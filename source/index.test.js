import test from "ava"
import {generateCSS} from "./index"
import {generateGetters} from "./index"
import oneLineTrim from "common-tags/lib/oneLineTrim"

const config = [[
  "background-color", {
    "rules": [
      ["red", "#ff4b5b"],
      ["green", "#00d4a8"],
      ["blue", "#4996f2"],
    ],
    "pseudo": [
      ":hover",
      "::placeholder",
    ],
    "media": [
      ["@narrow", "(min-width:20rem)"],
      ["@wide", "(min-width:40rem)"],
    ],
  },
]]

test("generateCSS", (t) => {
  const expected = oneLineTrim`
    .background-color--red{background-color:#ff4b5b}
    .background-color--green{background-color:#00d4a8}
    .background-color--blue{background-color:#4996f2}

    .background-color--red--hover:hover{background-color:#ff4b5b}
    .background-color--green--hover:hover{background-color:#00d4a8}
    .background-color--blue--hover:hover{background-color:#4996f2}

    .background-color--red--placeholder::placeholder{background-color:#ff4b5b}
    .background-color--green--placeholder::placeholder{background-color:#00d4a8}
    .background-color--blue--placeholder::placeholder{background-color:#4996f2}

    @media (min-width:20rem){
      .background-color--red--narrow{background-color:#ff4b5b}
      .background-color--green--narrow{background-color:#00d4a8}
      .background-color--blue--narrow{background-color:#4996f2}
    }

    @media (min-width:40rem){
      .background-color--red--wide{background-color:#ff4b5b}
      .background-color--green--wide{background-color:#00d4a8}
      .background-color--blue--wide{background-color:#4996f2}
    }
  `

  const css = generateCSS(config)
  t.is(css, expected)
})

test("generateGetters", (t) => {
  const getters = generateGetters(config)
  t.is(getters.backgroundColor("red"), "background-color--red")
  t.is(getters.backgroundColor("red", "@narrow"), "background-color--red--narrow")
  t.is(getters.backgroundColor("red", ":hover"), "background-color--red--hover")
})

test.todo("inject")

test.todo("funcss")
