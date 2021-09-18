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
 * @typedef {(h: H, node: any, parent?: Parent) => MdastNode|Array.<MdastNode>|void} Handle
 *
 * @typedef {Record<string, unknown>} Properties
 *
 * @typedef Options
 * @property {Object.<string, Handle>} [handlers]
 * @property {boolean} [document]
 * @property {boolean} [newlines=false]
 * @property {string} [checked='[x]']
 * @property {string} [unchecked='[ ]']
 * @property {Array.<string>} [quotes=['"']]
 *
 * @typedef Context
 * @property {Object.<string, Element>} nodeById
 * @property {boolean} baseFound
 * @property {string|null} frozenBaseUrl
 * @property {boolean} wrapText
 * @property {boolean} inTable
 * @property {number} qNesting
 * @property {Object.<string, Handle>} handlers
 * @property {boolean|undefined} document
 * @property {string} checked
 * @property {string} unchecked
 * @property {Array.<string>} quotes
 *
 * @typedef {(node: Node, type: string, props?: Properties, children?: string|Array.<MdastNode>) => MdastNode} HWithProps
 * @typedef {(node: Node, type: string, children?: string|Array.<MdastNode>) => MdastNode} HWithoutProps
 *
 * @typedef {HWithProps & HWithoutProps & Context} H
 */

export {}
