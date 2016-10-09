# Functional Style Sheets

[![npm](https://img.shields.io/npm/v/funcss.svg?maxAge=2592000)](https://www.npmjs.com/package/funcss)

Functional Style Sheets let you easily generate functional CSS — similar to [Tachyons](http://tachyons.io) or [Basscss](http://basscss.com) — based a custom definitions you provide to it.

Additionally, functional utilities are provided, guarding against using undefined classes.

Basically, using `funcss`, you end up writing something that almost looks like inline styles, but *with native support for media queries and pseudo classes & elements*, and very performant. (See examples below...)

Styles can be injected and generated on client to reduce payload size or generated on the server and used like any other regular CSS.

Functional Style Sheets can be used with any framework (React, Angular, whatever...) and are independent of build system.


## Usage


### Step 1: Install

```
npm install --save funcss
```


### Step 2: Specify Definitions

First off, you need to specify your rule definitions:

```js
// Create a module like this, and import it somewhere early
// in the app. Ideally before things like `React.render()`.

import funcss from 'funcss'

const defs = [{
  name: "background-color"
  rules: [
    ["blue", "#4996f2"],
    ["dark-blue", "#428ae0"],
  ],
  media: [
    ["@narrow", "(min-width:20rem)"],
    ["@wide", "(min-width:40rem)"],
  ],
  pseudo: [
    ":hover",
    "::placeholder",
  ],
}]

const stylesheet = funcss(defs)

export default stylesheet
```

<!-- _If you're wondering why arrays are used instead of objects, it is because source order for CSS matters, and objects don't guarantee iteration order._ -->

The default export from `funcss` will inject generated stylesheet into the `<head>` of the document and return an object with methods matching your defs.

In the above example, the `stylesheet` object would include one method — `backgroundColor` — which can be used to retrieve the right class name, which can be subsequently used inside your components.

Note that methods are camelCased so that you can access them in JS using the dot notation.

### Step 3: Use Stylesheet Methods to Retrieve Class Names in Components

Usage in a React component looks like this:

```js
import React from "react"
import classnames from "classnames"
import stylesheet from "./stylesheet"

const FancyButton = (props) => (
  <button className={classnames(
      stylesheet.backgroundColor("blue"),
      stylesheet.backgroundColor("dark-blue", ":hover"),
    )}>
    {props.children}
  </button>
)
```

Stylesheet methods take one or two arguments. The first argument should be one the rules you have defined for this definition (in this case `"blue"` or `"dark-blue"`), and the second, optional, argument is either a media query name (`"@narrow"`, `"@wide"`), or a pseudo selector (`:hover`).

So `stylesheet.backgroundColor("blue")` will return the correct CSS class name (simple string) based on your arguments, but will also let you know if you try to get things which you haven't defined previously.

For example, `stylesheet.backgroundColor("foo")` will print "Couldn't find 'foo' key for 'background-color' definition." to the console.

_Note that since we are dealing with totally vanilla CSS here (and those class names are just regular strings), you can use any other styling solution — regular CSS, CSS Modules, inline styles — to handle edge-cases like relatively positioning an element to optically align it, etc..._

### Server-side Usage

To use on the server, use the `generate` secondary export (`import {generate} from 'funcss'`) instead of the default.

The `generate` functions returns an object with `css` and `stylesheet` properties without trying to inject anything anywhere, so you can use it safely on the server and do what you will with the output.

## Further Reading

- http://www.jon.gold/2015/07/functional-css/
- https://github.com/chibicode/react-functional-css-protips

## Influences & Inspiration

- [Tachyons](http://tachyons.io/)
- [Basscss](http://www.basscss.com/)
- [Aphrodite](https://github.com/Khan/aphrodite)
- [CSS Modules](https://github.com/css-modules/css-modules)
