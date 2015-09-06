## Why make this?

1. I needed a better way to provide styling hooks into components that have a complex set of states.
2. The declarativeness of pseudo-selectors (i.e. `:hover`, `:disabled`) is one of the most powerful things about CSS.
3. Components are much more than the DOM primitives they're comprised of, so **why limit ourselves to CSS's default set of pseudo-selectors?**

## Why use this?

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

This is the current "state of the art", but I think we could do better.

### A novel, yet familiar approach

What if we instead borrowed CSS's `:pseudo-selector` syntax and
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
    <div {...getStyles()}>
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

### Not just "syntactic sugar"

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

When the Combobox is *expanded* **AND** *busy*, I expect *opacity* to be 1, but it's 0.5.

It looks like *busyStyle* **always** overrides *expandedStyle* when the Combobox is busy.

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

This scenario already works as expected; `:expanded`'s opacity of 1 overrides `:busy`'s 0.5:

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

How does this work?

`@HasDeclarativeStyles` was written such that styles are applied
*in the order they are iterated over in the original style object*, meaning that
"whatever comes last" always overrides what was described earlier.

Alternatively, this behavior be expressed more directly using `:composed:pseudo-selectors`, like so:

```js
<Combobox style={{
  ':expanded:busy': {
    opacity: 1,
  }
}} />
```

This makes composed styles much easier to reason about, and more closely resembles
the actual behavior of the syntax that inspired it.

### The Pit of Success

Suppose someone is using your `<Combobox>` for the first time, and they misspell
one of the pseudo-selectors:

```js
<Combobox style={{
  ':expand': {
    opacity: 1,
  }
}} />
```

Component authors can take advantage of a special static field, `styleStateTypes`, which
declares the values that `getStyleState` returns.

This is intentionally very similar to the way `childContextTypes` and `getChildContext`
already work, so this should already be a familiar pattern for sophisticated component authors.

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
Warning: Failed propType: Style state `:expand` was not specified in `Combobox`. Available states are: [`:expanded`, `:busy`, `:error`].  Check the render method of `MyApp`.
```

We can take this one step further: component authors that forget to specify a required
field from `styleStateTypes` in their `getStyleState` can also receive helpful warnings at runtime:

```
Warning: Failed styleStateType: Required prop `expanded` was not specified in the `getStyleState` method of `Combobox`.
```

### What about Theming/Skinning?

Passing in custom styles to every component via props is not ideal when you
use the same style everywhere. This is the common use-case for "skinning" a
third-party component to be used with your project.

What we ***really*** want is a way to simply get a version of 
`SomeThirdPartyComponent` that has our styles as its default styles.

Here's how that looks, as it is currently implemented:

```js
import SomeThirdPartyComponent from 'some-third-party-component';

// SomeThirdPartyComponent uses HasDeclarativeStyles

const MY_STYLES = {
  ':error': {
    color: '#faa',
    backgroundColor: '#b00',
  },
  ':busy': {
    opacity: 0.5,
  },
};

export default const MyComponent = SomeThirdPartyComponent.withStyles(MY_STYLES);
```

The only downside I can think of is that we'd have to manually override
`displayName` if we want it to show up in devtools/error messages as `MyComponent`.
