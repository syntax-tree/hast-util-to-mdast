/**
 * @typedef {import('../types.js').MdastNode} MdastNode
 * @typedef {import('../types.js').MdastPhrasingContent} MdastPhrasingContent
 */

import extend from 'extend'
import {phrasing as hastPhrasing} from 'hast-util-phrasing'
import {phrasing as mdastPhrasing} from 'mdast-util-phrasing'

/**
 * @param {Array<MdastNode>} nodes
 */
export function wrap(nodes) {
  return runs(nodes, onphrasing)

  /**
   * @param {Array<MdastPhrasingContent>} nodes
   * @returns {MdastNode|Array<MdastNode>}
   */
  function onphrasing(nodes) {
    const head = nodes[0]

    if (
      nodes.length === 1 &&
      head.type === 'text' &&
      (head.value === ' ' || head.value === '\n')
    ) {
      return []
    }

    return {type: 'paragraph', children: nodes}
  }
}

/**
 * Check if there are non-phrasing mdast nodes returned.
 * This is needed if a fragment is given, which could just be a sentence, and
 * doesn’t need a wrapper paragraph.
 *
 * @param {Array<MdastNode>} nodes
 * @returns {boolean}
 */
export function wrapNeeded(nodes) {
  let index = -1
  /** @type {MdastNode} */
  let node

  while (++index < nodes.length) {
    node = nodes[index]

    if (!phrasing(node) || ('children' in node && wrapNeeded(node.children))) {
      return true
    }
  }

  return false
}

/**
 * Wrap all runs of mdast phrasing content in `paragraph` nodes.
 *
 * @param {Array<MdastNode>} nodes
 * @param {(nodes: Array<MdastPhrasingContent>) => MdastNode|Array<MdastNode>} onphrasing
 * @param {(node: MdastNode) => MdastNode} [onnonphrasing]
 */
function runs(nodes, onphrasing, onnonphrasing) {
  const nonphrasing = onnonphrasing || identity
  /** @type {Array<MdastNode>} */
  const flattened = flatten(nodes)
  /** @type {Array<MdastNode>} */
  let result = []
  let index = -1
  /** @type {Array<MdastPhrasingContent>|undefined} */
  let queue
  /** @type {MdastNode} */
  let node

  while (++index < flattened.length) {
    node = flattened[index]

    if (phrasing(node)) {
      if (!queue) queue = []
      queue.push(node)
    } else {
      if (queue) {
        result = result.concat(onphrasing(queue))
        queue = undefined
      }

      result = result.concat(nonphrasing(node))
    }
  }

  if (queue) {
    result = result.concat(onphrasing(queue))
  }

  return result
}

/**
 * Flatten a list of nodes.
 *
 * @param {Array<MdastNode>} nodes
 * @returns {Array<MdastNode>}
 */
function flatten(nodes) {
  /** @type {Array<MdastNode>} */
  let flattened = []
  let index = -1
  /** @type {MdastNode} */
  let node

  while (++index < nodes.length) {
    node = nodes[index]

    // Straddling: some elements are *weird*.
    // Namely: `map`, `ins`, `del`, and `a`, as they are hybrid elements.
    // See: <https://html.spec.whatwg.org/#paragraphs>.
    // Paragraphs are the weirdest of them all.
    // See the straddling fixture for more info!
    // `ins` is ignored in mdast, so we don’t need to worry about that.
    // `map` maps to its content, so we don’t need to worry about that either.
    // `del` maps to `delete` and `a` to `link`, so we do handle those.
    // What we’ll do is split `node` over each of its children.
    if (
      (node.type === 'delete' || node.type === 'link') &&
      wrapNeeded(node.children)
    ) {
      flattened = flattened.concat(split(node))
    } else {
      flattened.push(node)
    }
  }

  return flattened
}

/**
 * @param {MdastNode} node
 * @returns {Array<MdastNode>}
 */
function split(node) {
  // @ts-expect-error Assume parent.
  return runs(node.children, onphrasing, onnonphrasing)

  /**
   * Use `child`, add `parent` as its first child, put the original children
   * into `parent`.
   * If `child` is not a parent, `parent` will not be added.
   *
   * @param {MdastNode} child
   * @returns {MdastNode}
   */
  function onnonphrasing(child) {
    if ('children' in child && 'children' in node) {
      const {children, ...rest} = node
      return {
        ...child,
        // @ts-expect-error: assume matching parent & child.
        children: [{...extend(true, {}, rest), children: child.children}]
      }
    }

    return {...child}
  }

  /**
   * Use `parent`, put the phrasing run inside it.
   *
   * @param {Array<MdastPhrasingContent>} nodes
   * @returns {MdastNode}
   */
  function onphrasing(nodes) {
    // @ts-expect-error: assume parent.
    const {children, ...rest} = node
    // @ts-expect-error: assume matching parent & child.
    return {...extend(true, {}, rest), children: nodes}
  }
}

/**
 * Check if an mdast node is phrasing.
 *
 * Also supports checking embedded hast fields.
 *
 * @param {MdastNode} node
 * @returns {node is MdastPhrasingContent}
 */
function phrasing(node) {
  return node.data && node.data.hName
    ? hastPhrasing({
        type: 'element',
        tagName: node.data.hName,
        properties: {},
        children: []
      })
    : mdastPhrasing(node)
}

/**
 * @template {unknown} T
 * @param {T} n
 * @returns {T}
 */
function identity(n) {
  return n
}
