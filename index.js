/**
 * @typedef {import('./lib/state.js').State} State
 * @typedef {import('./lib/types.js').Handle} Handle
 * @typedef {import('./lib/types.js').NodeHandle} NodeHandle
 * @typedef {import('./lib/types.js').Options} Options
 */

export {toMdast} from './lib/index.js'

export {
  handlers as defaultHandlers,
  nodeHandlers as defaultNodeHandlers
} from './lib/handlers/index.js'
