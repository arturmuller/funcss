/* eslint-disable no-console */
/* global process */

import Ramda from "ramda"
import oneLineTrim from "common-tags/lib/oneLineTrim"


/**
 * Strip "@"s and ":"s from a string
 */

const strip = Ramda.replace(/[@:]/g, "")


/**
 * Strip "@"s and ":"s from a string
 */

export const renderClassName = Ramda.compose(
  Ramda.join("--"),
  Ramda.map(strip)
)


/**
 * Generate CSS for single rule
 */

const rulesReducer = Ramda.curry((declaration, makeSelector, accum, rule) => {
  const key = rule[0]
  const value = rule[1] || key

  const ruleCSS = oneLineTrim`
    .${makeSelector(declaration, key)}{
      ${declaration}:${value}
    }`

  return Ramda.concat(accum, ruleCSS)
})


/**
 * Generate CSS for pseudo class/element
 */

const pseudoReducer = Ramda.curry((declaration, rules, accum, pseudo) => {

  const pseudoCSS = Ramda.reduce(
    rulesReducer(declaration, (dec, rule) => `${dec}--${rule}--${strip(pseudo)}${pseudo}`),
    "",
    rules
  )

  return Ramda.concat(accum, pseudoCSS)
})


/**
 * Generates CSS for a media query
 */

const mediaQueryReducer = Ramda.curry((declaration, rules, accum, [mediaKey, query]) => {

  const rulesCSS = Ramda.reduce(
    rulesReducer(declaration, (dec, rule) => `${dec}--${rule}--${strip(mediaKey)}`),
    "",
    rules
  )

  const mediaQueryCSS = oneLineTrim`
    @media ${query}{
      ${rulesCSS}
    }`

  return Ramda.concat(accum, mediaQueryCSS)
})


/**
 * Generate CSS for a signle definition
 */

const definitionReducer = (accum, [declaration, {rules, media, pseudo}]) => {

  const vanillaRulesCSS = Ramda.reduce(
    rulesReducer(declaration, (dec, rule) => `${dec}--${rule}`),
    "",
    rules
  )

  const pseudoCSS = Ramda.reduce(
    pseudoReducer(declaration, rules),
    "",
    pseudo || []
  )

  const mediaQueryRulesCSS = Ramda.reduce(
    mediaQueryReducer(declaration, rules),
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

export const generateCSS = (config, options = {}) => {
  const css = Ramda.reduce(
    definitionReducer,
    "",
    config
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

export const getter = ([def, {rules, media, pseudo}]) => (...args) => {
  const [key, arg] = args

  // This is a convenience for being able to call the getter function with
  // arguments but without generating no output.
  // This is useful when passing props directly
  if (key === null) return null

  if (process.env.NODE_ENV !== "production") {
    if (!Ramda.find(Ramda.propEq(0, key), rules)) {
      return console.error(`Couldn't find '${key}' key for '${def}' definition.`)
    }

    if (arg) {
      const isPseudo = arg.startsWith(":")
      const isMedia = arg.startsWith("@")

      if (isMedia && !Ramda.find(Ramda.propEq(0, arg), media)) {
        return console.error(`Couldn't find '${media}' media query for '${def}' definition.`)
      }

      if (isPseudo && !Ramda.find(Ramda.equals(arg), pseudo)) {
        return console.error(`Couldn't find '${pseudo}' psedo class/element for '${def}' definition.`)
      }
    }

  }

  return renderClassName([def, ...args])
}


/**
 * Create getter functions
 */

export const generateGetters = (defs) =>
  Ramda.reduce((acc, def) =>
    Ramda.assoc(camelCase(def[0]), getter(def), acc), {}, defs)


/**
 * Generate CSS and getter functions
 */

export const generate = (config, options) => ({
  css: generateCSS(config, options),
  getters: generateGetters(config),
})


/**
 * Main
 */

export default (config, options) => {
  const {css, getters} = generate(config, options)
  inject(css)
  return getters
}
