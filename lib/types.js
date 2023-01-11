/**
 * @typedef {import('unist').Parent} UnistParent
 * @typedef {import('mdast').Content} MdastContent
 * @typedef {import('mdast').Root} MdastRoot
 * @typedef {import('hast').Content} Content
 * @typedef {import('hast').Element} Element
 * @typedef {import('hast').Root} Root
 */

/**
 * @typedef {MdastContent | MdastRoot} MdastNode
 * @typedef {Content | Root} Node
 * @typedef {Extract<Node, UnistParent>} Parent
 *
 * @typedef {(state: State, node: any, parent?: Parent) => MdastNode | Array<MdastNode> | void} Handle
 *
 * @typedef Options
 *   Configuration (optional).
 * @property {boolean | null | undefined} [newlines=false]
 *   Keep line endings when collapsing whitespace.
 *
 *   The default collapses to a single space.
 * @property {string | null | undefined} [checked='[x]']
 *   Value to use for a checked checkbox or radio input.
 * @property {string | null | undefined} [unchecked='[ ]']
 *   Value to use for an unchecked checkbox or radio input.
 * @property {Array<string> | null | undefined} [quotes=['"']]
 *   List of quotes to use.
 *
 *   Each value can be one or two characters.
 *   When two, the first character determines the opening quote and the second
 *   the closing quote at that level.
 *   When one, both the opening and closing quote are that character.
 *
 *   The order in which the preferred quotes appear determines which quotes to
 *   use at which level of nesting.
 *   So, to prefer `‘’` at the first level of nesting, and `“”` at the second,
 *   pass `['‘’', '“”']`.
 *   If `<q>`s are nested deeper than the given amount of quotes, the markers
 *   wrap around: a third level of nesting when using `['«»', '‹›']` should
 *   have double guillemets, a fourth single, a fifth double again, etc.
 * @property {boolean | null | undefined} [document]
 *   Whether the given tree represents a complete document.
 *
 *   Applies when the `tree` is a `root` node.
 *   When the tree represents a complete document, then things are wrapped in
 *   paragraphs when needed, and otherwise they’re left as-is.
 *   The default checks for whether there’s mixed content: some phrasing nodes
 *   *and* some non-phrasing nodes.
 * @property {Record<string, Handle> | null | undefined} [handlers]
 *   Object mapping tag names or node types to functions handling the
 *   corresponding nodes.
 *
 * @typedef State
 *   Info passed around about the current state.
 * @property {PatchPosition} patch
 *   Copy a node’s positional info.
 * @property {All} all
 *   Transform the children of a hast parent to mdast.
 * @property {One} one
 *   Transform a hast node to mdast.
 * @property {Options} options
 *   User configuration.
 * @property {Record<string, Element>} nodeById
 *   Elements by their `id`.
 * @property {Record<string, Handle>} handlers
 *   Applied handlers.
 * @property {boolean} baseFound
 *   Whether a `<base>` element was seen.
 * @property {string | undefined} frozenBaseUrl
 *   `href` of `<base>`, if any.
 * @property {boolean} inTable
 *   Whether we’re in a table.
 * @property {number} qNesting
 *   Non-negative finite integer representing how deep we’re in `<q>`s.
 *
 * @callback PatchPosition
 *   Copy a node’s positional info.
 * @param {Node} origin
 *   hast node to copy from.
 * @param {MdastNode} node
 *   mdast node to copy into.
 * @returns {void}
 *   Nothing.
 *
 * @callback All
 *   Transform the children of a hast parent to mdast.
 * @param {Parent} parent
 *   Parent.
 * @returns {Array<MdastContent>}
 *   mdast children.
 *
 * @callback One
 *   Transform a hast node to mdast.
 * @param {Node} node
 *   Expected hast node.
 * @param {Parent | undefined} parent
 *   Parent of `node`.
 * @returns {MdastNode | Array<MdastNode> | void}
 *   mdast result.
 */

export {}
