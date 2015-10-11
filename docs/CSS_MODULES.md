# Using Seamstress with [CSS Modules](https://github.com/css-modules/css-modules)

**Example code:** [examples/css-modules](examples/css-modules)

CSS modules fit very naturally with Seamstress.

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

The mapping from `:selector` to `classes.selector` is a little tedious, but could easily be automated with a simple helper function:

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

Note that we aren't using [`composes`](https://github.com/css-modules/css-modules#composition) in our example, since Seamstress composes classNames for us automatically. However, `composes` combined with Seamstress shouldn't break anything, since it would simply result in duplicate class names that could automatically be removed.
