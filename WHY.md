## Why make this?

- I needed a better way to provide styling hooks for complex components.
- I love CSS's pseudo-selectors (i.e. `:hover`, `:disabled`).
- React components are much more than DOM primitives, so **why do we limit ourselves to CSS's default set of pseudo-selectors?**

## Why use this?

Imagine you're building a `<Combobox>` that can asynchronously fetch its options.

It has many specific internal states (such as `busy`, `expanded`, etc.), each of which will need a different look and feel.

Here's how a thoughtful author of `<Combobox>` might provide style hooks to users:

```js
const expanded = this.state.expanded;
const busy = this.state.options === undefined;
const error = this.state.options === null;

<div className={classnames(
  classes.base,
  this.props.className,

  expanded && classes.expanded,
  expanded && this.props.expandedClassName,

  busy && classes.busy,
  busy && this.props.busyClassName,

  error && classes.error,
  error && this.props.errorClassName,
)} />
```

This is a good start, but some people might prefer to use inline styles, so let's add those as well:

```js
<div
  className={classnames(...)}

  style={mergeStyles(
    this.props.style,    
    expanded && this.props.expandedStyle,
    busy && this.props.busyStyle,
    error && this.props.errorStyle,
  )}
/>
```

Whew! It's not pretty for us, but now the users of `<Combobox>` have a convenient, declarative way to control how it looks, using inline styles *or* CSS!

```js
<Combobox
  className={'MyCombobox'}
  expandedClassName={'MyCombobox_expanded'}
  busyStyle={{
    opacity: 0.5,
    cursor: 'no-drag',
  }}
  errorStyle={{
    color: 'red',
  }}
/>
```

This is the current "state of the art", but not very many third-party component authors provide flexibility at this level.

I'd wager few authors provide this level of flexibility because it's rather cumbersome to manage. It's much easier to just give your users a few `less` files or require them to directly write their own CSS selectors using a set of proprietary, if conventional, CSS classes.

### A novel, yet familiar approach

Seamstress allows us to use CSS's familiar `:pseudo-selector` syntax and combined the entire set of styles in a single "sheet":

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

CSS class names can used by specifying simple strings:

```js
import classes from './MyCombobox.css';

<Combobox styles={{
  ':base': classes.base,
  ':expanded': classes.expanded,
}} />
```

Inside our `<Combobox>` implementation, we move all of the styling logic outside `render()`, and access the applicable style props with [`computedStyles`](API.md#computedstyles).

Rather than writing lots of boilerplate logic, we just *declare* what the "style state" of our component is, and Seamstress takes care of the rest:

```js
@Seamstress.decorate({
  styles: {
    ':base': classes.base,
    ':expanded': classes.expanded,
    ':busy': classes.busy,
    ':error': classes.error,
  },
  getStyleState: function ({props, context, state}) {
    return {
      /* :base is a special style state that is unconditionally true */
      expanded: state.expanded,
      busy: state.options === undefined,
      error: state.options === null,
    };
  },
})
class Combobox extends React.Component {
  render () {
    const computedStyles = this.getComputedStyles();
    <div {...computedStyles.root} />
  }
}
```

Under the hood, Seamstress uses the result of [`getStyleState()`](API.md#configgetstylestate) to determine which `:pseudo-selector` styles should be applied. Adding a new state state is as simple as adding a field to this function's return value.

### It's more than syntactic sugar

At first glance, this method may only seem like syntactic sugar for the `<Combobox>` author, but there are other subtle, powerful benefits.

Let's pretend you publish `<Combobox>` on NPM, using the canonical *just add more `props`* approach for overriding styles.

After enough people start using it in the real world, you see issues like this popping up on GitHub:

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

In the canonical approach, our styles were **ordered** in such a way that `busyStyle` was always last, causing `expectedStyle: opacity` to be overridden when the user needs it to be the other way around.

Rather than reordering the styles in the array and potentially breaking other people's projects, you decide the safest way around this is to provide yet another, *weirdly-specific* style prop: `expandedAndBusyStyle`/`expandedAndBusyClassName`:

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

<div
  className={classnames(
    // ... a bunch of other classes ...
    (expanded && busy) && this.props.expandedAndBusyClassName,
  )}
  style={[
    // ... a bunch of other styles ...
    (expanded && busy) && this.props.expandedAndBusyStyle
  ]}
/>
```

This seems ugly, but it solves the problem without breaking anyone else's code.

With Seamstress, this scenario already works as expected; `:expanded`'s opacity of 1 overrides `:busy`'s 0.5 simply by virtue of *appearing later*:

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

Seamstress ensures that styles are applied *in the order they are iterated over in the original style object*, meaning that "whatever comes last" always overrides what was described earlier -- as we'd expect with CSS or the `style` prop, on its own.

When dynamically generating a `styles` prop, using an array can guarantee any styles that appear later take priority (this is actually how Seamstress merges styles, under the hood).

### The Pit of Success

Suppose someone is using your `<Combobox>` for the first time, and they misspell one of the pseudo-selectors:

```js
<Combobox style={{
  ':expand': {
    opacity: 1,
  }
}} />
```

Component authors can take advantage of a special config option, [`styleStateTypes`])(API.md#configstylestatetypes), which declares the values that [`getStyleState()`](API.md#configgetstylestate) returns.

This pattern should look familiar to those who've used `propTypes` before:

```js
@Seamstress.decorate({
  styleStateTypes: {
    expanded: React.PropTypes.bool.isRequired,
    busy: React.PropTypes.bool.isRequired,
    error: React.PropTypes.bool.isRequired,
  },
  // ...
})
class Combobox extends React.Component {
  // ...
}
```

Now, specifying a psuedo-element that doesn't correspond to an entry in `styleStateTypes` leads to this friendly message:

```
Warning: Failed propType: `:expand` is not a valid style-state of `Combobox`.
Valid style-states are: [`:expanded`, `:busy`, `:error`].
Check the render method of `MyApp`.
```

Furthermore, component authors also see warnings if their `getStyleState()` returns an incorrect or missing type.

### Sub-components

In addition to style-states (which correspond to `:pseudo-selectors`), component authors can specify *sub components*, which are analogous to the `::pseudo-elements` of CSS.

Suppose our `Combobox` had a little arrow indicator similar to a standard DOM `<select>`.

Naturally, users will want to change how this looks as well. Here's how that would look using Seamstress:

```js
<Combobox style={{
  // Let's say you don't want to see the indicator:
  '::indicator': {
    display: 'none',
  },
}} />
```

Any `::sub-components` specified on the `styles` prop are automatically added to [`computedStyles`](API.md#computedstyles):

```js
@Seamstress.decorate({
  // ...
})
class Combobox extends React.Component {
  render () {
    const computedStyles = this.getComputedStyles();
    <div {...computedStyles.root}>
      <div {...computedStyles.indicator} />
    </div>
  }
}
```

Users can even combine `:pseudo-selectors` with `::sub-components`:

```js
<Combobox style={{
  ':expanded::indicator': {
    transform: 'rotate(90deg)',
  },
}} />
```

Now we're talking!

### What about Theming/Skinning?

Passing in custom `styles` to every component via props is not ideal when you use the same style everywhere. This is the common use-case for "skinning" a third-party component to be used with your project.

What we ***really*** want is a way to simply get a version of `Combobox` that uses our styles as its default styles.

```js
import Combobox from 'fictional-third-party-combobox';

const MY_STYLES = {
  ':base': {
    fontSize: '24px',
  },
  ':expanded': {
    opacity: 0.5,
  },
  '::indicator': {
    display: 'none',
  }
};

export default const MyCombobox = Combobox.extendStyles(MY_STYLES);
```
