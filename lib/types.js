/**
 * @typedef {import('unist').Node}  UnistNode
 *
 * @typedef {import('mdast').Root} MdastRoot
 * @typedef {import('mdast').Content} MdastNode
 * @typedef {import('mdast').Parent} MdastParent
 * @typedef {import('mdast').ListContent} MdastListContent
 * @typedef {import('mdast').PhrasingContent} MdastPhrasingContent
 * @typedef {import('mdast').DefinitionContent} MdastDefinitionContent
 * @typedef {import('mdast').BlockContent} MdastBlockContent
 * @typedef {import('mdast').TableContent} MdastTableContent
 * @typedef {import('mdast').RowContent} MdastRowContent
 *
 * @typedef {import('hast').Parent} Parent
 * @typedef {import('hast').Root} Root
 * @typedef {import('hast').Element} Element
 * @typedef {import('hast').Text} Text
 * @typedef {import('hast').Comment} Comment
 * @typedef {Element['children'][number]} ElementChild
 * @typedef {Parent['children'][number]} Child
 * @typedef {Child|Root} Node
 *
 * @typedef {(h: H, node: any, parent?: Parent) => MdastNode|Array<MdastNode>|void} Handle
 *
 * @typedef {Record<string, unknown>} Properties
 *
 * @typedef Options
 *   Configuration (optional).
 * @property {boolean} [newlines=false]
 *   Keep line endings when collapsing whitespace.
 *   The default collapses to a single space.
 * @property {string} [checked='[x]']
 *   Value to use for a checked checkbox or radio input.
 * @property {string} [unchecked='[ ]']
 *   Value to use for an unchecked checkbox or radio input.
 * @property {Array<string>} [quotes=['"']]
 *   List of quotes to use.
 *   Each value can be one or two characters.
 *   When two, the first character determines the opening quote and the second
 *   the closing quote at that level.
 *   When one, both the opening and closing quote are that character.
 *   The order in which the preferred quotes appear determines which quotes to
 *   use at which level of nesting.
 *   So, to prefer `‘’` at the first level of nesting, and `“”` at the second,
 *   pass `['‘’', '“”']`.
 *   If `<q>`s are nested deeper than the given amount of quotes, the markers
 *   wrap around: a third level of nesting when using `['«»', '‹›']` should
 *   have double guillemets, a fourth single, a fifth double again, etc.
 * @property {boolean} [document]
 *   Whether the given tree represents a complete document.
 *   Applies when the `tree` is a `root` node.
 *   When the tree represents a complete document, then things are wrapped in
 *   paragraphs when needed, and otherwise they’re left as-is.
 *   The default checks for whether there’s mixed content: some phrasing nodes
 *   *and* some non-phrasing nodes.
 * @property {Record<string, Handle>} [handlers]
 *   Object mapping tag names or node types to functions handling the
 *   corresponding nodes.
 *   See `handlers/` for examples.
 *
 *   In a handler, you have access to `h`, which should be used to create mdast
 *   nodes from hast nodes.
 *   On `h`, there are several fields that may be of interest.
 *   Most interesting of them is `h.wrapText`, which is `true` if the mdast
 *   content can include newlines, and `false` if not (such as in headings or
 *   table cells).
 *
 * @typedef Context
 * @property {Record<string, Element>} nodeById
 * @property {boolean} baseFound
 * @property {string|null} frozenBaseUrl
 * @property {boolean} wrapText
 * @property {boolean} inTable
 * @property {number} qNesting
 * @property {Record<string, Handle>} handlers
 * @property {boolean|undefined} document
 * @property {string} checked
 * @property {string} unchecked
 * @property {Array<string>} quotes
 *
 * @typedef {(node: Node, type: string, props?: Properties, children?: string|Array<MdastNode>) => MdastNode} HWithProps
 * @typedef {(node: Node, type: string, children?: string|Array<MdastNode>) => MdastNode} HWithoutProps
 *
 * @typedef {HWithProps & HWithoutProps & Context} H
 */

export {}
