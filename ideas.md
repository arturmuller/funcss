# Ideas

- Ask @karlpurk if we could help provide an Angular example
- consider using a css parser to check validity of css and improve testing...


## Design Goals

- Config object should usable as a style guide


## FAQ

### Isn't this slow?

No. The CSS is generated only once, so even for a large config object, this is a one-time operation that never has to be repeated after the initial injection.

As far as rendering performance is concerned, using this micro-class style for your CSS is actually more efficient than the more traditional approach of writing a CSS class per component.

Additionally, because the styles are generated from a fairly small config object, you also save a lot of time downloading the CSS.

### What if I want more than one rule per class?

This is not supported, but since you are just dealing with functions returning stings, it is very easy to group rules together through arrays or even other functions to create your own 'mixins'.

Using a library like `classnames`, this is actually very easy:

```js

// Simple group of rules combined into one

const simple = [
  s.padding("small"),
  s.backgroundColor("red"),
]

// A parametrized group of rules

const fancy = (color) => [
  s.padding("small"),
  s.backgroundColor(color),
]
```


## Example output

<!--
```css
.padding--small {
  padding: 1rem;
}

.padding--medium {
  padding: 3rem;
}

.padding--large {
  padding: 5rem;
}

.color--red {
  color: #ab1c4a;
}
.color--green {
  color: #258819;
}
.color--blue {
  color: #194088;
}

.font-family--source-sans-pro {
  font-family: 'Source Sans Pro', sans-serif;
}

.font-family--gloria-hallelujah {
  font-family: 'Gloria Hallelujah', cursive;
}

.color--red--hover:hover {
  color: #ab1c4a;
}
.color--green--hover:hover {
  color: #258819;
}
.color--blue--hover:hover {
  color: #194088;
}

.color--red--first-letter::first-letter {
  color: #ab1c4a;
}
.color--green--first-letter::first-letter {
  color: #258819;
}
.color--blue--first-letter::first-letter {
  color: #194088;
}

@media (min-width: 20em) {
  .padding--small--narrow {
    padding: 1rem;
  }

  .padding--medium--narrow {
    padding: 3rem;
  }

  .padding--large--narrow {
    padding: 5rem;
  }

  .color--red--narrow {
    color: #ab1c4a;
  }
  .color--green--narrow {
    color: #258819;
  }
  .color--blue--narrow {
    color: #194088;
  }

  .font-family--source-sans-pro--narrow {
    font-family: 'Source Sans Pro', sans-serif;
  }

  .font-family--gloria-hallelujah--narrow {
    font-family: 'Gloria Hallelujah', cursive;
  }
}

@media (min-width: 40em) {
  .padding--small--wide {
    padding: 1rem;
  }

  .padding--medium--wide {
    padding: 3rem;
  }

  .padding--large--wide {
    padding: 5rem;
  }

  .color--red--wide {
    color: #ab1c4a;
  }
  .color--green--wide {
    color: #258819;
  }
  .color--blue--wide {
    color: #194088;
  }

  .font-family--source-sans-pro--wide {
    font-family: 'Source Sans Pro', sans-serif;
  }

  .font-family--gloria-hallelujah--wide {
    font-family: 'Gloria Hallelujah', cursive;
  }
}
``` -->
