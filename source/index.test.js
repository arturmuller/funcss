import test from "ava"
import {generateCSS} from "./index"
import {objToTuples} from "./index"
import {preprocessRules} from "./index"
import {generateGetters} from "./index"
import oneLineTrim from "common-tags/lib/oneLineTrim"

test("objToTuples", (t) => {
  const actual = objToTuples({
    "padding-top": {"small": "1rem"},
  })
  const expected = [
    ["padding-top", {"small": "1rem"}],
  ]
  t.deepEqual(actual, expected)
})

test("preprocessRules", (t) => {
  const actual = preprocessRules({
    "padding-top": {"small": "1rem", "medium": "3rem"},
    "padding-bottom": {"small": "1rem", "medium": "3rem"},
  })
  const expected = [
    [".padding-top--small", "padding-top", "1rem"],
    [".padding-top--medium", "padding-top", "3rem"],
    [".padding-bottom--small", "padding-bottom", "1rem"],
    [".padding-bottom--medium", "padding-bottom", "3rem"],
  ]
  t.deepEqual(actual, expected)
})

test("generateCSS", (t) => {
  const config = {
    "rules": {
      "padding-top": {
        "small": "1rem",
        "medium": "3rem",
        "large": "5rem",
      },
    },
  }
  const expected = oneLineTrim`
    .padding-top--small {padding-top: 1rem;}
    .padding-top--medium {padding-top: 3rem;}
    .padding-top--large {padding-top: 5rem;}
  `
  const css = generateCSS(config)
  t.is(css, expected)
})

test("generateGetters", (t) => {
  const config = {
    "rules": {
      "padding-top": {
        "small": "1rem",
        "medium": "3rem",
        "large": "5rem",
      },
    },
  }
  const getters = generateGetters(config)
  t.is(getters.paddingTop("small"), "padding-top--small")
})

test.todo("inject")

test.todo("funcss")
