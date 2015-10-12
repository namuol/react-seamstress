## Why make this?

* I needed a better way to provide styling hooks for complex components.
* I love CSS's pseudo-selectors (i.e. `:hover`, `:disabled`).
* React components are much more than DOM primitives, so **why do we limit ourselves to CSS's default set of pseudo-selectors?**

## Why use this?

Imagine you're building a `Combobox` that can asynchronously fetch its options.

It has many specific internal states (such as `busy`, `expanded`, etc.), each of which will need a different look and feel.

Here's how a thoughtful author of `Combobox` might provide style hooks to users:

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

Whew! It's not pretty for us, but now the users of `Combobox` have a convenient, declarative way to control how it looks, using inline styles *or* CSS!

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

This is the current "state of the art", but few third-party component authors provide flexibility at this level from within React.

Rather, it's much easier to just provide users with a few `less` files or encourage them to directly write their own CSS selectors using a set of proprietary -- if conventional -- CSS classes.

### A novel, yet familiar approach

Seamstress provides a `:pseudo-selector`-like syntax to apply styles conditionally based on the internal state of the component:

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

You are not limited to using inline styles; CSS classes can be specified as strings:

```js
import classes from './MyCombobox.css';

<Combobox styles={{
  ':base': classes.base,
  ':expanded': classes.expanded,
}} />
```

### How is this implemented?

Inside our `Combobox` implementation, we move all of the styling logic outside `render()`, and access the applicable style props with [`computedStyles`](/api/README.md#computedstyles).

Rather than writing lots of boilerplate logic, we just *declare* what the "style state" of our component is, and Seamstress takes care of the rest:

```js
@Seamstress.createDecorator({
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

Under the hood, Seamstress uses the result of [`getStyleState()`](/api/README.md#config-getstylestate) to determine which `:pseudo-selector` styles should be applied. Adding a new state state is as simple as adding a field to this function's return value.

### The Pit of Success

Suppose someone is using your `Combobox` for the first time, and they misspell one of the pseudo-selectors:

```js
<Combobox style={{
  ':expand': {
    opacity: 1,
  }
}} />
```

Component authors can take advantage of a special config option, [`styleStateTypes`](/api/README.md#config-stylestatetypes), which declares the values that [`getStyleState()`](/api/README.md#config-getstylestate) returns.

This pattern should look familiar to those who've used `propTypes` before:

```js
@Seamstress.createDecorator({
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

Now, specifying a state that doesn't correspond to an entry in `styleStateTypes` leads to this friendly message:

```
Warning: Failed propType: `:expand` is not a valid style-state of `Combobox`.

Valid style-states are: [`:expanded`, `:busy`, `:error`].

Check the render method of `MyApp`.
```

Furthermore, component authors also see warnings if their `getStyleState()` returns an incorrect or missing type.

### Sub-components

In addition to style-states (which correspond to `:pseudo-selectors`), component authors can specify *sub components*, which are analogous to the `::pseudo-elements` of CSS.

Suppose our `Combobox` has a little arrow indicator similar to a standard DOM `select`.

Naturally, users will want to change how this looks as well. Here's how that would look using Seamstress:

```js
<Combobox style={{
  // Let's say you don't want to see the indicator:
  '::indicator': {
    display: 'none',
  },
}} />
```

Any `::sub-components` specified on the `styles` prop are automatically added to [`computedStyles`](/api/README.md#computedstyles):

```js
@Seamstress.createDecorator({
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

Passing custom `styles` to every component is not ideal when you use the same style every time. This is the common use-case for "skinning" a third-party component to be used with your project.

What we ***really*** want is a version of `Combobox` that uses our styles by default.

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

const MyCombobox = Combobox.extendStyles(MY_STYLES);
```
