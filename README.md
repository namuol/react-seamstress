# Declarative Styles for React Components

Style your components without the need to write lots of error-prone boilerplate.

Inspired by CSS's `:pseudo-selectors` and React's developer-friendly `propTypes`.

Here's what it looks like to author a component with various states that
result in changes in its style:

```js
@HasDeclarativeStyles
class Combobox extends React.Component {
  // Set default styles:
  static baseStyles = [
    // Base/default style class
    'Combobox',
    {
      // Classes that get applied based on the results of `this.getStyleState()`:
      ':expanded': 'Combobox_expanded',
      ':busy': 'Combobox_busy',
      ':error': 'Combobox_error',
    },
  ];

  // Declare what style states are available (optional, recommended)
  static styleStateTypes = {
    expanded: React.PropTypes.bool,
    busy: React.PropTypes.bool,
    error: React.PropTypes.bool,
  };

  getStyleState () {
    return {
      expanded: this.state.expanded,
      busy: this.state.options === undefined,
      error: this.state.options === null,
    };
  }

  render () {
    // `getStyles()` examines the result of `getStyleState`
    //  and returns both `className` and `style` props:
    return <div {...this.getStyles()} />
  }
}
```

Here's what it looks like to re-style your component with inline styles:

```js
<Combobox styles={{
  color: 'white',
  backgroundColor: '#333',

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

...or with CSS classes:

```js
<Combobox styles={[
  'MyCombobox', // <-- Base styles
  {
    ':expanded': 'MyCombobox_expanded',
    ':busy': 'MyCombobox_busy',
    ':error': 'MyCombobox_error',
  }
]} />
```

You can also create a pre-skinned version of your component so you don't have to
keep repeating yourself:

```js
const MY_STYLES = { ...etc };

export default const MyCombobox = Combobox.withStyles(MY_STYLES);
```

## Features

- Replace lots of inflexible styling boilerplate
  * (no more `style={this.state.expanded && styles.expanded}`)
- Fall into [the Pit of Success](WHY.md#the-pit-of-success)
- Easily combine [inline styles with CSS/classNames](CSS_OR_INLINE.md)

## API

Until a guide is written, the easiest way to get started is to check out the
contents in [`./example/src`](example/src).

#### `HasDeclarativeStyles`

A decorator function. Accepts your component class as its first argument, and extends it
with the behaviors listed below.

Easiest way to apply this is to use ES7 decorators (available with `babel --stage=0`):

```js
@HasDeclarativeStyles
export default class YourComponent extends React.Component {
  // ...
}
```

This is the same as the following:

```js
class YourComponent extends React.Component {
  // ...
}
YourComponent = HasDeclarativeStyles(YourComponent);
export default YourComponent;
```

#### `YourComponent.baseStyles`

(optional)

A static property defined on your component.

These are the default styles for your component. Takes the same form 
as the [`styles`](#props.styles) prop.

#### `YourComponent.styleStateTypes`

(optional, but recommended)

A static property defined on your component.

Takes a form similar to React's canonical `propTypes`.

A set of `PropType` definitions that are used to describe what states are
available for styling. Currently, it really only makes sense for these to be `PropTypes.bool`.

[In the future](OTHER_IDEAS.md#advanced-queries), we may also support different types.

If `styleStateTypes` is defined on your class, any `:pseudo-selector` that isn't
explicitly defined will trigger a [helpful warning message](WHY.md#the-pit-of-success).

If the author of `YourComponent` fails to supply any of the `isRequired` properties,
a different helpful warning message will be triggered.

```js
@HasDeclarativeStyles
class YourComponent extends React.Component {
  static styleStateTypes = {
    expanded: React.PropTypes.bool,
  };
}
```

#### `YourComponent::getStyleState()`

(required)

An instance function you must define on your component.

Should return the current "style state" of your component.

The style state is effectively a set of booleans that are used to generate the final
set of `className` and `style` props returned from `this.getStyles()`.

```js
@HasDeclarativeStyles
class YourComponent extends React.Component {
  static getStyleState () {
    return {
      expanded: this.state.expanded,
    };
  }
}
```

#### `this.getStyles()`

(provided by `@HasDeclarativeStyles` decorator)

Returns an object that contains the appropriate style
props -- both `className` and `style` -- based on the contents
returned from `YourComponent::getStyleState`.

The easiest way to apply these props is to use the new spread operator (`...`):

```js
<div {...this.getStyles()} />

// This unwraps to:
const styleProps = this.getStyles();
<div className={styleProps.className} style={styleProps.style} />
```

#### `props.styles`

(provided by `@HasDeclarativeStyles` decorator)

A special prop used to define style overrides.

Can be a single `className` string, an object of raw inline styles, or an array of any
combination of these.

Examples:

```js
<YourComponent styles={{
  // "top-level" styles are unconditionally merged with the final
  // style properties of the component:
  color: 'black',

  // :pseudo-selector style objects are conditionally merged with
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
    // :pseudo-selectors conditionally apply classes based on internal state:
    ':expanded': 'MyComponent_expanded',
  },
]} />
```

## Running examples

If you'd like to see a live example of what's been implemented,
clone this repo, then run:

```shell
npm install
npm start
```

A debug server should now be running on http://localhost:3000/

The source code of this demo can be found in `./example`.

## Usage with other styling tools/libraries

See `PLAYING_NICE.md`.

## Future Features

Only single boolean pseudo-selectors are implemented.

See `OTHER_IDEAS.md` for potential features we may want to experiment with.

## Prior Art/Acknowledgements

- [JedWatson/classNames](https://github.com/JedWatson/classnames) - conditional composition of classNames
- [pluralsight/react-styleable](https://github.com/pluralsight/react-styleable) - very easy re-skinning via CSS Modules
- [Modularise CSS the React Way](https://medium.com/@jviereck/modularise-css-the-react-way-1e817b317b04) - article with some ideas that influenced this library