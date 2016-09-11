import Ramda from "ramda"

/**
 * Transform {key: value} object pairs into [key, value] tuples
 * @param {object} object - The object to process
 * @returns {array}
 */

export const objToTuples = (obj) =>
  Ramda.map((key) => [key, obj[key]], Ramda.keys(obj))

/**
 * Generate a flat list of [selector, declaration, value] tuples
 * @param {object} rules - The rules object to process
 * @returns {array}
 */

export const preprocessRules = Ramda.compose(
  Ramda.unnest,
  Ramda.map(([declaration, rule]) =>
    Ramda.map(([key, value]) =>
      [`.${declaration}--${key}`, declaration, value], objToTuples(rule))),
  objToTuples
)

/**
 * Generate CSS string
 * @param {object} rules - The rules object to process
 * @returns {string}
 */

export const generateCSS = (config) => {
  const rules = preprocessRules(config.rules)
  return Ramda.reduce((acc, [selector, declaration, value]) =>
    `${acc}${selector} {${declaration}: ${value};}`, "", rules)
}

/**
 * Inject CSS into <head>
 * @param {string}
 * @returns {void}
 */

export const inject = (css) => {
  const style = document.createElement("style")
  style.type = "text/css"
  style.appendChild(document.createTextNode(css))

  document.head.appendChild(style)
}

/**
 * Convert kebab-case to camelCase
 * @param {string}
 * @returns {string}
 */

export const camelCase = (string) =>
  Ramda.replace(/-([a-z])/g, (_, match) => Ramda.toUpper(match), string)

/**
 * Retrieve classname from config
 * @param {object} config
 * @param {string} rule
 * @param {string} key
 * @returns {string} classname
 */

export const getter = Ramda.curry((config, rule, key) => {
  if (config.rules[rule][key]) {
    return `${rule}--${key}`
  } else {
    console.error(`Couldn't find '${key}' for '${rule}' rule.`)
    return null
  }
})

/**
 * Retrieve getters
 * @param {object} config
 * @returns {object} getters
 */

export const generateGetters = (config) =>
  Ramda.reduce((acc, rule) =>
    Ramda.assoc(camelCase(rule), getter(config, rule), acc), {}, Ramda.keys(config.rules))

/**
 * Main
 * @param {object} config
 * @returns {object} getters
 */

export default (config) => {
  inject(generateCSS(config))
  return generateGetters(config)
}
