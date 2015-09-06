# Declarative Styles for React Components

Style your components without the need to write lots of error-prone boilerplate.

Inspired by CSS's `:pseudo-selectors` and React's developer-friendly `propTypes`.

Here's what it looks like to author a component with various states that may
result in changes in its style:

```js
@HasDeclarativeStyles
class Combobox extends React.Component {
  static baseStyles = [
    // Base/default style class; this could be imported via CSS modules, for instance:
    'Combobox',
    {
      // Classes that get applied based on the results of `this.getStyleState()`:
      ':expanded': 'Combobox_expanded',
      ':busy': 'Combobox_busy',
      ':error': 'Combobox_error',
    },
  ];

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
    // getStyles() provides both `className` and `style`:
    return <div {...getStyles()} />
  }
}
```

Here's what it looks like to style your component inline:

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

Users can create a version of your component with their own styles, so they don't need
to keep repeating themselves:

```js
const MY_STYLES = { ...etc };

export default const MyCombobox = Combobox.withStyles(MY_STYLES);
```

## Features

- Replace lots of error-prone, inflexible styling boilerplate (i.e. `style={this.state.expanded && styles.busy}`)
- Guide you and your components' users into [the Pit of Success](WHY.md#the-pit-of-success)
- Easily combine CSS with inline styles [inline styles and CSS/classNames](CSS_OR_INLINE.md) (with some [caveats](CSS_OR_INLINE.md#caveats))
- 

## API

----

**Note**: This is an experiment. Please submit
[issues](https://github.com/namuol/react-declarative-styles/issues) 
for any bugs/questions/comments/discussion.

At the time of writing, much of what's written in these markdown files is
unimplemented, and primarily serves as a brain-dump.

----

### Running examples

If you'd like to see a live example of what's been implemented,
clone this repo, then run:

```shell
npm install
npm start
```

A debug server should now be running on http://localhost:3000/

The source code of this demo can be found in `./example`.

### A note on syntax

We all have strong feelings about syntax, especially when it comes to
expanding on previously-established syntax.

So please keep in mind that any kind of syntax outlined here is anything but final;
the broader concepts are what I've focused on, so far.

That said, syntax is nonetheless important, so if you have any suggestions, please
[submit an issue](https://github.com/namuol/react-declarative-styles/issues)! :beers:

Some examples of syntax-related questions:

- Do we want to support Sass-like `&:nested` selectors?
- Should we really precede all custom selectors with `:`?
  * Alternatively, we might use something like `$expanded` -- no need to quote and has less risk of confusion with ordinary CSS `:selectors`
- etc

## Usage with other styling tools/libraries

See `PLAYING_NICE.md`.

## Future Features

Only single boolean pseudo-selectors are implemented.

See `OTHER_IDEAS.md` for potential features we may want to experiment with.

## Prior Art/Acknowledgements

- [JedWatson/classNames](https://github.com/JedWatson/classnames) - conditional composition of classNames
- [pluralsight/react-styleable](https://github.com/pluralsight/react-styleable) - very easy re-skinning via CSS Modules
