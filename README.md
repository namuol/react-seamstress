# Seamstress

> ## Notice
>
> This is an in-progress branch of Seamstress -- most documentation is currently out of date/missing.

A powerful styling layer for reusable React components.

## Features

### Conditional styles (inspired by [`[attr]`](https://developer.mozilla.org/en/docs/Web/CSS/Attribute_selectors))

```js
<Toggler
  toggled={...}
  styles={{
    '[toggled]': {
      color: 'black',
    },
  }}
/>
```

### Nestable component selectors (inspired by [`::psuedo-elements`](https://developer.mozilla.org/en/docs/Web/CSS/Pseudo-elements))

```js
<Toggler
  styles={{
    '::indicator': {
      color: 'black',
    },
  }}
/>
```

### Developer-friendly warnings

```text
::check is not a valid sub-component of `Toggler`.

Valid sub-components are:

::checkmark
::label
```

```text
Malformed selector: ":indicator"

Here are some examples of valid selectors:
  ::subComponent
  ::subComponent, ::subComponent2
  [prop]
  [prop=false]
  [prop=42]
  [prop="string"], [prop2=42]
  [prop]::subComponent
  [prop1][prop2="string"]::subComponent
```

### Compatibility

Seamstress works with any styling solutions for React that use `className` or `style` props.

Seamstress lets you author your component with one styling solution, while allowing your component's users use a different solution.

There are already some complete [examples](examples) using popular styling solutions:

- [React Native](examples/react-native)
- [CSS Modules](examples/css-modules)
- [Radium](examples/css-modules)
- [Aphrodite](examples/css-modules)
- [Vanilla CSS / Inline Styles](examples/simple)

## Prior Art/Acknowledgements

- [Modularise CSS the React Way](https://medium.com/@jviereck/modularise-css-the-react-way-1e817b317b04) - article with some ideas that influenced this library
- [JedWatson/classNames](https://github.com/JedWatson/classnames) - conditionally compose classNames
- [casesandberg/ReactCSS](https://github.com/casesandberg/reactcss) - declaratively style components
- [pluralsight/react-styleable](https://github.com/pluralsight/react-styleable) - theme components with CSS modules
- [markdalgleish/react-themeable](https://github.com/markdalgleish/react-themeable) - theme components with inline styles *or* CSS classes
