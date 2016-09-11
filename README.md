# Functional Style Sheets

## Install

```
npm install --save funcss
```

## Usage

```js
// Create a module like this, and import it somewhere early
// in the app. Ideally before things like `React.render()`.

import funcss from 'funcss'

const rules = {
  "padding": {
    "small": "1rem",
    "medium": "3rem",
    "large": "5rem",
  },
  "color": {
    "red": "#ab1c4a",
    "green": "#258819",
    "blue": "#194088",
  },
  "font-family": {
    "source-sans-pro": "'Source Sans Pro', sans-serif"
    "gloria-hallelujah": "'Gloria Hallelujah', cursive"
  },
}

const media = {
  "@narrow": "(min-width: 20em)",
  "@wide": "(min-width: 40em)",
}

const pseudo = {
  color: [ ":hover", "::first-letter" ],
}

const stylesheet = funcss({rules, media, pseudo})

export default stylesheet
```

This will generate and inject styles into the `<head>` of the page.

Now, you can import the `stylesheet` object, which contains functions matching the rules object you provided.

Note that function names are camelCased to make it more user-friendly to access inside JS.

You can use it as follows:

```js
import React from "react"
import c from "classnames"
import s from "./stylesheet"

const FancyButton = ({label}) => (
  <button className={c(
      s.padding("small"),
      s.backgroundColor("blue"),
      s.backgroundColor("green", ":hover"),
    )}>
    {label}
  </button>
)
```

_Note that this example uses React, but since these functions just return strings, there is no limit on where this can be used..._

One very cool thing is that these accessor functions let you know if you try to get something which hasn't been defined in your config.

Additionally, since we are dealing with totally vanilla CSS here (and those classnames are just regular strings), you can use any other CSS solution to handle edge-cases like relatively positioning an element to optically align it ,etc...

## Influences

- [Tachyons](http://tachyons.io/)
- [Basscss](http://www.basscss.com/)
- [Aphrodite](https://github.com/Khan/aphrodite)
- [CSS Modules](https://github.com/css-modules/css-modules)
