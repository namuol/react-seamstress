# Declarative Styling of Complex React Components

## Why stop at `:hover`?

```js
<Combobox styles={{
  ':expanded': {
    border: '1px solid black',
  },

  ':busy': {
    opacity: 0.5,
    cursor: 'no-drag',
  },
}} />
```

----

**Note**: This is an experiment. Please submit
[issues](https://github.com/namuol/react-declarative-styles/issues) 
for any bugs/questions/comments/discussion.

----

## Reasoning

1. We need a better way to provide styling hooks into components that have a complex set of states.
2. The declarativeness of pseudo-selectors (i.e. `:hover`, `:disabled`) is one of the most powerful things about CSS.
3. Our components are much more than the DOM primitives they're comprised of, so **why limit ourselves to CSS's default set of pseudo-selectors?**

## Example

Imagine a `<Combobox>` that can asynchronously fetch its options.

It has many specific internal states (such as `busy`, `expanded`, etc.), each of
which will need a different look & feel.

Here's how the thoughtful author of `<Combobox>` would provide style hooks to users,
using the tools React already gives us:

(**Note:** For the sake of simplicity, let's also pretend that the
[style array syntax](https://github.com/reactjs/react-future/blob/fc5b7ac89effaea4c00143cb4d3bd3daa0f81f5d/04%20-%20Layout/04%20-%20Inline%20Styles.md#using-styles)
is a standard part of React)

```js
// Inside Combobox.js - render():

const expanded = this.state.expanded;
const busy = this.state.options === undefined;
const error = this.state.options === null;

<div style={[
  // Default styles:
  DEFAULT_STYLE,
  // User styles:  
  this.props.style,
  
  // Default expanded styles:
  expanded && EXPANDED_STYLE,
  // User expanded styles:
  expanded && this.this.props.expandedStyle,

  // Default busy styles:
  busy && BUSY_STYLE,
  // User busy styles:
  busy && this.this.props.busyStyle,

  // Default error styles:
  error && ERROR_STYLE,
  // User error styles:
  error && this.this.props.errorStyle,
]} />
```

This is somewhat tedious, but manageble for this relatively simple Component.

The users of `<Combobox>` now have a convenient, declarative way to control how it looks:

```js
<Combobox
  expandedStyle={{
    border: '1px solid black',
  }}
  busyStyle={{
    opacity: 0.5,
    cursor: 'no-drag',
  }}
  errorStyle={{
    color: 'red',
  }}
/>
```

Again, slightly verbose, but gets the job done and it's easy to understand.

This is the current "state of the art", but I think we could better.

What if we instead borrowed CSS's familiar `:pseudo-selector` syntax and
combined the entire set of styles in a single "sheet"?

```js
<Combobox styles={{
  ':expanded': {
    border: '1px solid black',
  },

  ':busy': {
    opacity: 0.5,
    cursor: 'no-drag',
  },

  ':error': {
    color: 'red',
  },
}} />
```

Now, inside our `<Combobox>` implementation, all we need to do is provide
a way to obtain the state of these "pseudo-selectors":

```js
@HasDeclarativeStyles
class Combobox extends React.Component {
  getStyleState () {
    return {
      expanded: this.state.expanded,
      busy: this.state.options === undefined,
      error: this.state.options === null,
    };
  }

  render () {
    <div style={this.getStyle()}>
      {
        // ... etc
      }
    </div>
  }
}
```

Under the hood, `@HasDeclarativeStyles` uses the result of `getStyleState()` to 
determine which `:pseudo-selector` styles should be applied.

Now, the `<Combobox>` author can simply *describe* how their component can be styled
with `getStyleState()`, rather than by manually implementing a big list of short-circuited boolean
operations.

## More than "syntactic sugar"

This method might first only seem like sugar for the `<Combobox>` author, but 
there are other subtle but powerful benefits.

Suppose I publish `<Combobox>` on NPM, using the canonical `props` approach to specify styles.

People start using it in their projects, and someone creates a new issue on GitHub:

```md
**Unexpected styling behavior when expanded AND busy**

Here's how I'm using <Combobox>:

    <Combobox
      busyStyle={{
        opacity: 0.5,
      }}
      expandedStyle={{
        opacity: 1,
      }}
    />

When the Combobox is *expanded*, I expect *opacity* to be 1, but it's 0.5.

It looks like *busyStyle* **always** overrides *expandedStyle*.

Is there any way around this?

```

In the canonical approach, our styles were ordered in such a
way that `busyStyle` was always last, causing the `expectedStyle`'s opacity
param to be overridden when the user needs it to be the other way around.

Rather than reordering the styles in the array and potentially breaking
other people's projects, you decide the only way around this is to
provide yet another, *weirdly-specific* style prop: `expandedAndBusyStyle`:

```js
<Combobox
  busyStyle={{
    opacity: 0.5,
  }}
  expandedStyle={{
    opacity: 1,
  }}
  expandedAndBusyStyle={{
    opacity: 1,
  }}
/>
```

Your `Combobox` implementation would need to be updated to support this, of course:

```js
// Inside Combobox.js - render():

<div style={[
  
  // ... a bunch of other styles ...

  (expanded && busy) && this.props.expandedAndBusyStyle
]} />
```

Your gut tells you something's not quite right here, but it solves the problem without breaking anyone else's code.

What if we chose to use `@HasDeclarativeStyles` instead?

This can be expressed much more cleanly, and "just works" --
`:expanded`'s opacity of 1 overrides `:busy`'s 0.5:

```js
<Combobox style={{
  ':busy': {
    opacity: 0.5,
  },
  ':expanded': {
    opacity: 1,
  },
}} />
```

Nothing would need to change in our implementation of `<Combobox>`.

Why does this work?

`@HasDeclarativeStyles` was written such that styles are applied
in the order they are iterated over in the original style object, meaning that
"whatever comes last" always overrides what's described above (if applicable).

This could also be expressed more directly using `:composed:pseudo-selectors`, like so:

```js
<Combobox style={{
  ':expanded:busy': {
    opacity: 1,
  }
}} />
```

This makes composing styles much easier to reason about, and more closely resembles
the actual behavior of the syntax that inspired it.

## The Pit of Success

Suppose someone is using your `<Combobox>` for the first time, and they misspell
one of the pseudo-selectors:

```js
<Combobox style={{
  ':expand': {
    opacity: 1,
  }
}} />
```

Component authors can take advantage of a special static component field, `styleStateTypes`:

```js
@HasDeclarativeStyles
class Combobox extends React.Component {
  static styleStateTypes = {
    expanded: React.PropTypes.bool.isRequired,
    busy: React.PropTypes.bool.isRequired,
    error: React.PropTypes.bool.isRequired,
  };

  // ...
}
```

Now, the user who made the typo will see this friendly message:

```
Warning: Failed propType: Style state `expand` was not specified in `Combobox`. Available states are: ["expanded", "busy", "error"].  Check the render method of `MyApp`.
```

Furthermore, component authors that forget to specify a required field on `styleStateTypes` may also receive warnings:

```
Warning: Failed styleStateType: Required styleStateType `expanded` was not specified in the `getStyleState` method of `Combobox`.
```

----

## Current Implementation

### Missing Features

Only single boolean pseudo-selectors are implemented. (no `:composed:selectors`, for instance)

See `OTHER_IDEAS.md` for a more comprehensive set of potential features that I'd like to experiment with.

### How are styles applied?

The purpose of this experiment is **not** to prefer using `props.className` or `props.style`.

Currently, for the sake of this experiment, styles are only applied inline on `style={...}`.

However, it should be pretty easy to transparently support the composition of styles
with `className` **and** `style` simultaneously, allowing this to play nicely with most of the existing
style-defining solutions (i.e. [Radium](https://github.com/FormidableLabs/radium) vs [CSS Modules](https://github.com/css-modules/css-modules) vs [free-style](https://github.com/blakeembrey/react-free-style)).

How could we support all of these solutions?

`className` can be composed of any strings we encounter in the `props.styles` array,
and everything else can be assumed to be a `style` object.

Users could specify `className` styles simply by using strings instead of objects inside
a `styles` object, and top-level (i.e. "default") `className`s can be specified by using an
array, like so:

```js
const MY_STYLES = [
  'myFancyClass',
  {
    ':hover': 'myFancyClass_hover',
    ':active': 'myFancyClass_active',
  },
];
```

An alternative, more succinct API might be to reserve the `:default` styleStateType for
applying top-level styles:

```js
const MY_STYLES = {
  ':default': 'myFancyClass',
  ':hover': 'myFancyClass_hover',
  ':active': 'myFancyClass_active',
};
```

The `getStyle()` method would return an object that looks like this:

```js
{
  className: 'foo bar',
  style: {color: 'red'},
}
```

Component authors can exploit React/babel's spread operator (`...`) to apply the styles:

```js
<div {...getStyles()} />
```

One caveat is that it's possible to supply inline styles before attempting to "override" them
with classNames.

For example:

```js
<Combobox styles={[
  {
    color: 'red',
  },
  'MyComboBox',
]} />
```

In this example, we're trying to "override" an inline style with a className.

Browser semantics dictate that this will not do what we expect.

To reduce the risk of this kind of thing, we can provide a runtime check
that ensures all inline style definitions are supplied **at the end** of 
a style definition:

```
Warning: Attempted to override inline styles with className styles; this may lead to unexpected styling behavior. Check the render method of `MyComponent`.
```

This works well for internally-used components, but is less elegant
in the case of third-party components.

Why? A third-party component author may decide to only use inline styles, but
the component *user* may exclusively use classNames in their project.

This is still an unsolved problem for component authors, and another 
reason why React really needs a single, agreed-upon implementation of styling.

[react-future](https://github.com/reactjs/react-future/blob/fc5b7ac89effaea4c00143cb4d3bd3daa0f81f5d/04%20-%20Layout/04%20-%20Inline%20Styles.md)
uses `StyleSheet.create` in its examples, which is also [the standard with React Native](https://facebook.github.io/react-native/docs/style.html),
so there's a good chance we'll see this standard become part of React
as a whole.

## Discussion/Contributing

This is an experimental repo created for discussion purposes.

Contributions are welcome, and
[issues](https://github.com/namuol/react-declarative-styles/issues) are
a good place to start if you have any questions/comments/ideas.

Thanks! :beers:
