# Declarative Styling of Complex React Components

**Note**: This is an experiment. Please submit
[issues](https://github.com/namuol/react-declarative-styles/issues) 
for any bugs/questions/comments/discussion.

----

## Reasoning

1. We need a better way to provide styling hooks into components that have a complex set of states.
2. The declarativeness of pseudo-selectors (i.e. `:hover`, `:disabled`) is one of the most powerful things about CSS.
3. Our components are much more than the DOM primitives they're comprised of, so **why limit ourselves to CSS's internal set of pseudo-selectors?**

## Example

Imagine a `<Combobox>` that can asynchronously fetch its options.

It has many specific internal states (such as `busy`, `expanded`, etc.), each of
which will need a different look & feel.

Here's how a thoughtful author of `<Combobox>` would provide style hooks to users like so,
using the tools React already gives us:

(For the sake of simplicity, let's also pretend that the
[style array syntax](https://github.com/reactjs/react-future/blob/fc5b7ac89effaea4c00143cb4d3bd3daa0f81f5d/04%20-%20Layout/04%20-%20Inline%20Styles.md#using-styles))
is a standard part of React)

```js
// Inside Combobox.js - render():

<div style={[
  // Default styles:
  DEFAULT_STYLE,
  // User styles:  
  this.props.style,
  
  // Default expanded styles:
  this.state.expanded && EXPANDED_STYLE,
  // User expanded styles:
  this.state.expanded && this.this.props.expandedStyle,

  // Default busy styles:
  this.state.busy && BUSY_STYLE,
  // User busy styles:
  this.state.busy && this.this.props.busyStyle,
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

Now, the `<Combobox>` author can succinctly *describe* how their component can be styled
inside the results of `getStyleState`, rather than with a big list of short-circuit boolean
operations.

## More than "syntactic sugar"

This method might first only seem like sugar for the `<Combobox>` author, but 
there are other subtle but powerful benefits.

I publish `<Combobox>` on NPM, using the canonical approach to specify styles.

A few days in, and someone creates a new issue on GitHub:

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

Now, when the Combobox is expanded, I would expect its *opacity* to be 1, 
however, it seems that *busyStyle* always overrides the styles in *expandedStyle*.

Is there any way around this?

```

In the canonical approach, our styles were ordered in such a
way that `busyStyle` was always last.

Rather than simply reordering the styles in the array and potentially breaking
other people's projects, you decide the only way around this is to
provide yet another, *weirdly-specific* style prop: `expandedAndBusyStyle`.

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

```js
// Inside Combobox.js - render():

<div style={[
  
  // ... a bunch of other styles ...

  (this.state.expanded && this.state.options === undefined) && this.props.expandedAndBusyStyle
]} />
```

You know something's wrong here, but it solves the problem.

Meanwhile, using our `:pseudo-selector`-inspired syntax, this can be expressed much more cleanly:

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

`@HasDeclarativeStyles` was written in such a way as to ensure that styles are applied
in the order they are iterated over in the original object, meaning that "whatever comes last"
always overrides what's above.

This could also be expressed more explicitly using `:composed:pseudo-selectors`, like so:

```js
<Combobox style={{
  ':expanded:busy': {
    opacity: 1,
  }
}} />
```

This makes composing styles much easier to reason about, and more closely resembles
the actual behavior of the syntax that inspired it.

----

## Current Implementation

Currently, only the most basic single boolean pseudo-selectors are implemented.

See `OTHER_IDEAS.md` for a more comprehensive set of potential features.

## Discussion

This is an experimental repo created for discussion purposes.

Contributions are welcome, and
[issues](https://github.com/namuol/react-declarative-styles/issues) are
a good place to start if you have any questions/comments/ideas.

Thanks! :beers:
