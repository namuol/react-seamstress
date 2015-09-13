# Usage with other styling libraries

I'm trying to keep the project flexible enough to work with most styling tools out there.

If you can't get it to work with your workflow, please [file an issue](https://github.com/namuol/react-declarative-styles/issues).

Contributions of examples using other tools/workflows are welcome! :beers:

----

TODO: Create live examples of all of these.

Each example should illustrate:

1. How to author a third-party component
2. How to re-skin a third-party component

----

### [CSS Modules](https://github.com/css-modules/css-modules)

**Example code:** [examples/css-modules](examples/css-modules)

CSS modules should work pretty well right out of the box:

```css
/* MyComponent.css */

.base {
  color: cyan;
}

.expanded {
  color: magenta;
}

@media only screen and (max-width: 800px) {
  .base {
    color: yellow;
  }

  .expanded {
    color: black;
  }
}
```

```js
// MyComponent.js

import classes from './MyComponent.css';

// ...

<Component styles={{
  ':base': classes.base,
  ':expanded': classes.expanded,
}} />
```

The mapping from `:selector` to `classes.selector` is a little tedious, but could easily be
automated with a simple helper function:

```js
function stylize (classes) {
  return Object.keys(classes).reduce((styles, className) => {
    styles[':' + className] = classes[className];
    return styles;
  }, {});
}

import classes from './MyComponent.css';

<Component styles={stylize(classes)} />
```

#### Using `composes`

Note that we aren't using `composes` in our example, since `@seamstress` composes
classNames for us automatically. However, `composes` combined with `@seamstress` shouldn't
break anything, since it would simply result in duplicate class names that could automatically
be removed.

### [free-style](https://github.com/blakeembrey/free-style)

Media queries are *terribly* useful for web developers.

free-style uses a pure CSS-based approach to support native `@media`
queries with CSS-in-JS, and for that it's awesome.

In order for free-style's `@media` implementation to work as-expected with `@seamstress`,
we'd need to provide some kind of sugaring function.

For instance, ideally we'd be able to express our styles that need `@media` this way:

```js
{
  color: 'cyan',

  ':expanded': {
    color: 'magenta',
  },

  '@media only screen and (max-width: 800px)': {
    color: 'yellow',

    ':expanded': {
      color: 'black',
    },
  }
};
```

...But free-style knows nothing about `:expanded`, so we'd need to turn this into something it can use.

Essentially, each use of a custom `:pseudo-selector` translates to a specific className with free-style, so
we'd need to provide a desugaring function that produces something like this from the above input:

```js
{
  ':base': Style.registerStyle({
    color: 'cyan',
    '@media only screen and (max-width: 800px)': {
      color: 'yellow',
    },
  }).className,

  ':expanded': Style.registerStyle({
    color: 'magenta',
    '@media only screen and (max-width: 800px)': {
      color: 'black',
    }
  }).className,
}
```

Under the hood, free-style will intelligently merge the idential `@media` queries.

### [Radium](https://github.com/FormidableLabs/radium)

TODO

I personally like Radium's interface and their approach (it's what inspired this project),
however the implementation is problematic for third-party component authors.

Radium unfortunately may not be a good choice for authoring third-party components, because
it forces users to use inline-styles to reskin your component.