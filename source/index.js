/* eslint-disable no-console */
/* global process */

import Ramda from "ramda"

/**
 * Strip "@"s and ":"s from a string
 */

const strip = Ramda.replace(/[@:]/g, "")


/**
 * Render class name from array of strings (`null` and `undefined` are ignored)
 */

export const renderClassName = Ramda.compose(
  Ramda.join("--"),
  Ramda.map(strip),
  Ramda.reject(Ramda.isNil)
)


/**
 * Generate CSS for single rule
 */

const rulesReducer = (name, makeSelector) => (accum, rule) => {
  const key = rule[0]
  const value = rule[1] || key

  const ruleCSS = `.${makeSelector(name, key)}{${name}:${value}}`

  return Ramda.concat(accum, ruleCSS)
}


/**
 * Generate CSS for pseudo class/element
 */

const pseudoReducer = (name, rules) => (accum, pseudo) => {

  const pseudoCSS = Ramda.reduce(
    rulesReducer(name, (dec, rule) => `${dec}--${rule}--${strip(pseudo)}${pseudo}`),
    "",
    rules
  )

  return Ramda.concat(accum, pseudoCSS)
}


/**
 * Generates CSS for a media query
 */

const mediaQueryReducer = (name, rules) => (accum, [mediaKey, query]) => {

  const rulesCSS = Ramda.reduce(
    rulesReducer(name, (dec, rule) => `${dec}--${rule}--${strip(mediaKey)}`),
    "",
    rules
  )

  const mediaQueryCSS = `@media ${query}{${rulesCSS}}`

  return Ramda.concat(accum, mediaQueryCSS)
}


/**
 * Generate CSS for a single definition
 */

const definitionReducer = (accum, {name, rules, media, pseudo}) => {

  const vanillaRulesCSS = Ramda.reduce(
    rulesReducer(name, (dec, rule) => `${dec}--${rule}`),
    "",
    rules
  )

  const pseudoCSS = Ramda.reduce(
    pseudoReducer(name, rules),
    "",
    pseudo || []
  )

  const mediaQueryRulesCSS = Ramda.reduce(
    mediaQueryReducer(name, rules),
    "",
    media || []
  )

  return `${accum}${vanillaRulesCSS}${pseudoCSS}${mediaQueryRulesCSS}`
}


/**
 * Generate CSS markup
 * @param {object} config
 * @returns {string}
 */

export const generateCSS = (defs, options = {}) => {
  const css = Ramda.reduce(
    definitionReducer,
    "",
    defs
  )

  return `${options.globals || ""}${css}`
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
 */

export const camelCase = (string) =>
  Ramda.replace(/-([a-z])/g, (_, match) => Ramda.toUpper(match), string)


/**
 * Retrieve classname from config
 */

export const styleGetter = ({name, rules, media, pseudo}) => (...args) => {
  const [rule, arg] = args

  // This is a convenience for being able to call the getter function with
  // arguments but without generating no output.
  // This is useful when passing props directly
  if (rule === null) return null

  if (process.env.NODE_ENV !== "production") {
    if (!Ramda.find(Ramda.propEq(0, rule), rules)) {
      return console.error(`Couldn't find '${rule}' rule for '${name}' definition. Available rules are: ${rules.map(([ruleName]) => ruleName).join(", ")}`)
    }

    if (arg) {
      const isPseudo = arg.startsWith(":")
      const isMedia = arg.startsWith("@")

      if (isMedia) {
        if (!media) {
          return console.error(`You're trying to access '${media}' media query for '${name}' definition, but the definition doesn't include any 'media' property at all. Try checking your funcss definitions for errors.`)
        }
        if (!Ramda.find(Ramda.propEq(0, arg), media)) {
          return console.error(`Couldn't find '${media}' media query for '${name}' definition. Available media queries are: ${media.map(([mediaName]) => mediaName).join(", ")}`)
        }
      }

      if (isPseudo) {
        if (!pseudo) {
          return console.error(`You're trying to access '${pseudo}' pseudo class/element for '${name}' definition, but the definition doesn't include any 'pseudo' property at all. Try checking your funcss definitions for errors.`)
        }
        if (!Ramda.find(Ramda.equals(arg), pseudo)) {
          return console.error(`Couldn't find '${pseudo}' psedo class/element for '${name}' definition. Available media queries are: ${pseudo.join(", ")}`)
        }
      }
    }

  }

  return renderClassName([name, ...args])
}


/**
 * Create stylesheet object
 */

export const generateStylesheet = (defs) =>
  Ramda.reduce((acc, def) =>
    Ramda.assoc(camelCase(def.name), styleGetter(def), acc), {}, defs)


/**
 * Generate CSS string and stylesheet object
 */

export const generate = (config, options) => ({
  css: generateCSS(config, options),
  stylesheet: generateStylesheet(config),
})


/**
 * Main
 */

export default (config, options) => {
  const {css, stylesheet} = generate(config, options)
  inject(css)
  return stylesheet
}
