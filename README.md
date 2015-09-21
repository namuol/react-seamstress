<p align="center">
  <img src="http://i.imgur.com/fkaQtsM.png" alt="Seamstress" />
</p>

[![Module Version](http://img.shields.io/npm/v/react-seamstress.svg)](https://www.npmjs.org/package/react-seamstress)

A **powerful**, **declarative** interface for styling **React** components in the real world.

- Inspired by CSS's `:pseudo-selectors` and React's developer-friendly `propTypes`.
- Replaces [`props.className` & `props.style`](CSS_OR_INLINE.md) with a unified `styles` prop.
- [Works with what you're already using](PLAYING_NICE.md) to style your components.

For an overview of the problems this project aims to solve (and why you should care), read [WHY.md](WHY.md).

## Installation

```
npm install react-seamstress --save
```

## Examples

See the [`examples`](examples) directory for complete examples of authoring and re-styling a simple Seamstress-styled component.

For a more complex component-authoring example, take a look at [this fork of `react-select`](https://github.com/namuol/react-select-seamstress/tree/seamstress) that replaces most of its styling logic with Seamstress, as an exercise (it was easier than I expected!). This is also a good example of using Seamstress with `React.createClass`.

## Stability & Feedback

This project is still in the **experimental** phase, and I need feedback.

If you have any issues or ideas please [open a new issue](https://github.com/namuol/react-seamstress/issues).

I can also be reached [via email](mailto:louis.acresti@gmail.com), on Twitter as [@louroboros](http://twitter.com/louroboros), or on [reactiflux](http://reactiflux.com) as **@namuol**.

Thanks! :beers:

## Prior Art/Acknowledgements

- [JedWatson/classNames](https://github.com/JedWatson/classnames) - conditional composition of classNames
- [pluralsight/react-styleable](https://github.com/pluralsight/react-styleable) - very easy re-skinning via CSS Modules
- [Modularise CSS the React Way](https://medium.com/@jviereck/modularise-css-the-react-way-1e817b317b04) - article with some ideas that influenced this library
