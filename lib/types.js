/**
 * @typedef {import('unist').Parent} UnistParent
 * @typedef {import('mdast').Content} MdastContent
 * @typedef {import('mdast').Root} MdastRoot
 * @typedef {import('hast').Content} Content
 * @typedef {import('hast').Root} Root
 * @typedef {import('hast').Element} Element
 * @typedef {import('./state.js').State} State
 */

/**
 * @typedef {MdastContent | MdastRoot} MdastNode
 * @typedef {Content | Root} Node
 * @typedef {Extract<Node, UnistParent>} Parent
 *
 * @callback Handle
 *   Handle a particular element.
 * @param {State} state
 *   Info passed around about the current state.
 * @param {Element} element
 *   Element to transform.
 * @param {Parent | undefined} parent
 *   Parent of `element`.
 * @returns {MdastNode | Array<MdastNode> | void}
 *   mdast node or nodes.
 *
 * @callback NodeHandle
 *   Handle a particular node.
 * @param {State} state
 *   Info passed around about the current state.
 * @param {any} node
 *   Node to transform.
 * @param {Parent | undefined} parent
 *   Parent of `node`.
 * @returns {MdastNode | Array<MdastNode> | void}
 *   mdast node or nodes.
 *
 * @typedef Options
 *   Configuration.
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
 * @property {Record<string, Handle | null | undefined> | null | undefined} [handlers]
 *   Object mapping tag names to functions handling the corresponding elements.
 *
 *   Merged into the defaults.
 * @property {Record<string, NodeHandle | null | undefined> | null | undefined} [nodeHandlers]
 *   Object mapping node types to functions handling the corresponding nodes.
 *
 *   Merged into the defaults.
 */

export {}
