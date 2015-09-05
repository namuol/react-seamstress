## CSS vs inline styles

This experiment is **not** concerned with the debate over using `props.className` or `props.style`.

Currently, for the sake of simplicity, styles are only applied inline on `style={...}`.

However, it should be pretty easy to transparently support the composition of styles
with `className` **and** `style` simultaneously, allowing `@HasDeclarativeStyles` to play nicely with
most of the existing style-defining solutions
(i.e. [Radium](https://github.com/FormidableLabs/radium) vs [CSS Modules](https://github.com/css-modules/css-modules) vs [free-style](https://github.com/blakeembrey/react-free-style)).

How could we support all of these solutions?

`className` can be composed of any strings we encounter in the `props.styles` array,
and everything else can be assumed to be a `style` object.

Users could specify `className` styles simply by using strings instead of objects inside
a `styles` object, and top-level (i.e. "default") `className`s can be specified by composing it
into an array, like so:

```js
const MY_STYLES = [
  'myFancyClass',
  {
    ':hover': 'myFancyClass_hover',
    ':active': 'myFancyClass_active',
  },
];
```

An alternative, more succinct API might be to reserve something like `:default` for
applying "top-level" styles:

```js
const MY_STYLES = {
  ':default': 'myFancyClass',
  ':hover': 'myFancyClass_hover',
  ':active': 'myFancyClass_active',
};
```

The `getStyleProps()` method would return an object that looks like this:

```js
{
  // Automatically-combined classNames:
  className: 'myFancyClass myFancyClass_hover',

  // Any inline styles:
  style: {color: 'red'},
}
```

Component authors can utilize React/babel's spread operator (`...`) to apply `className` and `style` props
all at once:

```js
<div {...getStyleProps()} />
```

#### Caveats

It's possible to supply inline styles before attempting to "override" them
with classNames, which can lead to unexpected behavior.

For example, here we're trying to "override" an inline style with a className:

```js
<Combobox styles={[
  {
    color: 'red',
  },
  'MyComboBox',
]} />
```

Browser semantics dictate that this will not do what we expect, because the inline
styles always take priority over styles derived from CSS.

To reduce the risk of this kind of thing, we can provide a runtime check
that ensures all inline style definitions are supplied **at the end** of 
a style definition:

```
Warning: Attempted to override inline styles with className styles; this may lead to unexpected styling behavior. Check the render method of `MyComponent`.
```

This will work well for internally-used components where there's probably a single
approach to how styles are applied, but in the case of third-party components, it could
be problematic.

Why? A third-party component author may decide to only use inline styles, but
the component *user* may exclusively use classNames in their project. In this situation,
the component author's inline styles can only be overridden by other inline styles,
which poses problems for users who prefer a CSS/classname-oriented styling system.

This is still an unsolved problem for component authors, and another 
reason why React really needs a single, agreed-upon implementation of styling.

[react-future](https://github.com/reactjs/react-future/blob/fc5b7ac89effaea4c00143cb4d3bd3daa0f81f5d/04%20-%20Layout/04%20-%20Inline%20Styles.md)
uses `StyleSheet.create` in its examples, which is also [the standard with React Native](https://facebook.github.io/react-native/docs/style.html),
so there's a good chance we'll see this standard become part of React
as a whole.

## Usage with other styling libraries

Assuming we did implement support for className + inline styles, here's how one might integrate

### [Radium](https://github.com/FormidableLabs/radium)

TODO

### [free-style](https://github.com/blakeembrey/free-style)

Media queries are *terribly* useful for web developers.

free-style uses a pure CSS-based approach to support native `@media`
queries, and for that it's awesome.

In order for free-style's `@media` implementation to work as-expected with `@HasDeclarativeStyles`,
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
  ':default': Style.registerStyle({
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

### [CSS Modules](https://github.com/css-modules/css-modules)

CSS modules should work pretty well right out of the box:

```css
/* MyComponent.css */

.default {
  color: cyan;
}

.expanded {
  color: magenta;
}

@media only screen and (max-width: 800px) {
  .default {
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
  ':default': classes.default,
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

Thought: Given how close this is to being "perfect", we might just want to change the syntax
to remove the preceding `:` altogether...

#### Using `composes`

Note that we aren't using `composes` in our example, since `@HasDeclarativeStyles` composes
classNames for us automatically. However, `composes` combined with `@HasDeclarativeStyles` shouldn't
break anything, since it would simply result in duplicate class names that could automatically
be removed.

#### What about nested `::pseudo-elements`?

TODO