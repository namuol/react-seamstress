<p align="center">
  <img src="http://i.imgur.com/fkaQtsM.png" alt="Seamstress" />
</p>

[![Module Version](http://img.shields.io/npm/v/react-seamstress.svg)](https://www.npmjs.org/package/react-seamstress)

A **powerful**, **declarative** interface for styling **React** components in the real world.

- Inspired by CSS's `:pseudo-selectors` and React's developer-friendly `propTypes`.
- Replaces [`props.className` & `props.style`](CSS_OR_INLINE.md) with a unified `styles` prop.
- [Works with what you're already using](PLAYING_NICE.md) to style your components.

```
npm install react-seamstress --save
```

For an overview of the problems this project aims to solve
(and why you should care), read [WHY.md](WHY.md).

## Features

### Custom `:pseudo-selectors`

React components are so much more than their DOM counterparts, so
why limit ourselves to the DOM's pseudo-selectors (i.e `:hover`)?

Seamstress allows you to define custom pseudo-selectors
that refer to an internal state of the component.

```js
<Combobox styles={{
  backgroundColor: 'black',
  color: 'whitesmoke',
  ':busy': {
    opacity: 0.5,
  }
}} />
```

See the [API reference](API.md#thisgetstyleprops) for details.

### Transparent support for `className` and `style`

Using CSS? No problem. Just use simple strings to denote
class names.

```js
<Combobox styles={{
  // The `:base` selector is for "default" classes/styles:
  ':base': 'MyCombobox',

  ':busy': 'MyCombobox_busy',
}} />
```

This works quite well with [CSS Modules](PLAYING_NICE.md#css-modules), for instance.

You can even mix `classNames` and `style` objects within a single object.

```js
<Combobox styles={{
  ':base': 'MyCombobox',
  ':busy': { opacity: 0.5 },
}} />
```

### Custom `::pseudo-elements`

Components tend to be composed of other components, those
of which also need to be styled.

Seamstress uses a syntax inspired by CSS's `::pseudo-elements`
for succinctness:

```js
<Combobox styles={{
  '::indicator': {
    backgroundImage: 'url(down-arrow.svg)',
  },
  ':busy::indicator': {
    backgroundImage: 'url(spinner.svg)',
  },
}} />
```

See the [API reference](API.md#thisgetstylesforsubcomponent) for details.

### `:composed:pseudo:selectors`

```js
<Combobox styles={{
  ':busy:expanded': {
    // ...styles for when the combobox is
    // busy *and* expanded...
  }
}} />
```

### Computed styles

Seamstress aims to replace a lot of boilerplate code
with declarative style declarations, however sometimes
you need to dynamically generate your styles.

Component authors can explicity choose what state
to expose, which can then be used in style callbacks
inside `props.styles`, if necessary.

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

You can also return an entire `styles` object from a top-level function; useful
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

### Fall into the *Pit of Success*

Component authors can use `styleStateTypes` to explicitly declare
what the result of `getStyleState()` should look like.

```js
@seamstress
class Combobox extends React.Component {
  static styleStateTypes = {
    expanded: React.PropTypes.bool,
  };

  getStyleState () {
    return { expanded: this.state.expanded };
  }
}
```

Now, if a user tries to style a state that doesn't exist,
they see a friendly warning:

```js
<Combobox style={{
  ':expand': { ...etc }
}} />

/*
Warning: Failed propType: Style state `:expand` was not
specified in `Combobox`. Available states are: [`:expanded`].
Check the render method of `MyApp`.
*/
```

# Stability & Feedback

This project is still in the **experimental** phase, and I need feedback.

If you have any issues or ideas please open a new issue.

I can also be reached [via email](mailto:louis.acresti@gmail.com),
on Twitter as [@louroboros](http://twitter.com/louroboros),
or on [reactiflux](http://reactiflux.com) as **@namuol**.

Thanks! :beers:

## Prior Art/Acknowledgements

- [JedWatson/classNames](https://github.com/JedWatson/classnames) - conditional composition of classNames
- [pluralsight/react-styleable](https://github.com/pluralsight/react-styleable) - very easy re-skinning via CSS Modules
- [Modularise CSS the React Way](https://medium.com/@jviereck/modularise-css-the-react-way-1e817b317b04) - article with some ideas that influenced this library
