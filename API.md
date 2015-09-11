# API - 0.1.0

### `@seamstress`

The main (and only) export of the library.

A component decorator function. Accepts your component class
as its first argument, and extends it with the behaviors listed in this document.

This works great with ES7 decorators (available with [`babel --stage 1`](https://babeljs.io/docs/usage/experimental/)):

```js
import seamstress from 'react-seamstress';

@seamstress
export default class YourComponent extends React.Component {
  // ...
}
```

If you're not using experimental babel features, it's still pretty easy:

```js
class YourComponent extends React.Component {
  // ...
}

export default YourComponent = seamstress(YourComponent);
```

ES5 with `React.createClass` is also supported:

```js
var seamstress = require('react-seamstress');

var YourComponent = React.createClass({
  // ...
});

// Note: Static properties must be set **before** calling `seamstress(...)`
YourComponent.styles = { ... };
YourComponent.styleStateTypes = { ... };

module.exports = YourComponent = seamstress(YourComponent);
```

### `props.styles`

(provided by [`@seamstress`](#seamstress))

A special prop used to define style overrides.

Can be a single `className` string, an object of raw inline styles, a function, or an array of any
combination thereof.

Object properties that take the form `:some-component-state` are used to define
styles that apply when the corresponding style state is `true`.

Examples:

```js
<YourComponent styles={{
  // "top-level" styles are unconditionally merged with the final
  // style properties of the component:
  color: 'black',

  // :state style objects are conditionally merged
  // in the order they appear in this object:
  ':expanded': {
    border: '1px solid black',
  },
}} />
```

```js
// This simply adds your class to the component's list of classes:
<YourComponent styles={'MyComponent'} />
```

```js
<YourComponent styles={[
  // Standalone strings in the array are unconditionally applied:
  'MyComponent',
  {
    // :states conditionally apply classes based on internal state:
    ':expanded': 'MyComponent_expanded',
  },
]} />
```

Alternatively, you can use the special `:base` state to unconditionally apply
classNames without the need to use an array:

```js
<YourComponent styles={{
  ':base': 'MyComponent',
  ':expanded': 'MyComponent_expanded',
}} />
```

You can specify a callback to compute the value of an
inline style rule:

```js
import chroma from 'chroma-js';

const colorScale = chroma.scale([
  'white',
  'yellow',
  'red',
]).domain([
  0,
  5000,
  7000,
]);

<Tachometer styles={{
  color: ({rpm}) => { return colorScale(rpm).hex() }
}} />
```

You can also build an entire `styles` object in a function; useful
for providing outer style-state values to `::sub-components`:

```js
<Dashboard styles={({rpm} => {
  return {
    '::tachometer': {
      color: colorScale(rpm).hex(),
    },
  };
})} />
```

**Note**: the `className` and `style` props still work; they are merged
last into `props.styles` before computing the result of [`getStyleProps()`](#thisgetstyleprops).

This behavior will probably change in future versions, as it's unclear what most users
expect to happen in this scenario.

### `YourComponent.styles`

(optional)

A **static property** defined on your component.

These are the default styles for your component. Think of these styles
as the default userstyles in the browser if your Component were a first-class
DOM element such as `<select>`.

Takes the same form as [`props.styles`](#propsstyles).

### `YourComponent.styleStateTypes`

(optional, recommended)

A **static property** defined on your component.

Takes a form similar to React's `propTypes`.

Explicitly defines the types/shape of the result returned by [`getStyleState()`](#yourcomponentgetstylestate).

```js
@seamstress
class YourComponent extends React.Component {
  static styleStateTypes = {
    expanded: React.PropTypes.bool,
  };
}
```

Use `PropTypes.bool` to indicate that a specific state can be styled with
a `:psuedo-selector`-like syntax inside [`props.styles`](#propsstyles).

It's recommended that you define this property, because it provides
[helpful warning messages](WHY.md#the-pit-of-success).

### `YourComponent::getStyleState()`

(required)

An **instance function** you must define on your component.

Should return the current "style state" of your component.

The style state is used to compute the final `className` and `style`
props returned from [`this.getStyleProps()`](#thisgetstyleprops).

```js
@seamstress
class YourComponent extends React.Component {
  getStyleState () {
    return {
      expanded: this.state.expanded,
    };
  }
}
```

### `this.getStyleProps()`

(provided by [`@seamstress`](#seamstress))

Returns a computed `{className, style}` based on the merged result of `YourComponent.styles` with
`props.styles` (`props.className` and `props.style` are also merged in lastly, but
this is generally not the favored why to style a component with Seamstress).

These resulting merged styles are filtered to only include styles that apply based on the
result of [`YourComponent::getStyleState()`](#yourcomponentgetstylestate).

For instance, if `getStyleState()` returns `{ loading: false }`, then 
any styles under the `:loading` pseudo-selector will *not* be applied,
and vice-versa.

The easiest way to apply these props is to use the experimental
[spread operator](https://babeljs.io/docs/learn-es2015/#default-rest-spread) (`...`):

```js
<div {...this.getStyleProps()} />
```

This is just shorthand for applying the props by hand:

```js
var styleProps = this.getStyleProps();
<div className={styleProps.className} style={styleProps.style} />
```

### `this.getStylePropsFor(subComponent)`

(provided by [`@seamstress`](#seamstress))

Like [`getStyleProps()`](#thisgetstyleprops), but for a specific `::sub-component`.

```js
<div {...this.getStyleProps()}>
  <div {...this.getStylePropsFor('indicator')} />
</div>
```

### `this.getStylesFor(subComponent)`

(provided by [`@seamstress`](#seamstress))

Like [`getStylePropsFor()`](#thisgetstylepropsforsubcomponent), but returns something
in the form of [`props.styles`](#propsstyles) rather than `{className, style}`.

This is particularly useful for when `::sub-component` is also
a [`@seamstress`](#seamstress)-decorated component.

```js
<div {...this.getStyleProps()} />
  <Indicator styles={this.getStylesFor('indicator')} />
</div>
```

### `YourComponent.withStyles(styles)`

(provided by [`@seamstress`](#seamstress))

A **static method** that creates a new "skinned" version of your component.

The `styles` argument takes the same form as [`props.styles`](#propsstyles) and is merged with
[`YourComponent.styles`](#yourcomponentstyles) to form a new default set of styles.

```js
import YourComponent from 'your-component';

const MY_STYLES = {
  ':busy': {
    opacity: 0.5,
  },
};

const MyComponent = YourComponent.withStyles(MY_STYLES);

// These are equivalent:
<MyComponent />
<YourComponent styles={MY_STYLES} />
```
