# [Seamstress](http://namuol.github.io/react-seamstress/)

Declaratively describe conditional styles of your React components.

[![Module Version](http://img.shields.io/npm/v/react-seamstress.svg)](https://www.npmjs.org/package/react-seamstress)

- **Custom `:pseudo-selectors`** - Familiar styling syntax inspired by CSS.
- **Eliminates most styling boilerplate** - Decouple style "rendering" from the `render()` function.
- **Mix CSS classes and inline styles** - Intelligently merge class-names and style props with a single `styles` prop.

### Component Styling:
![Before and After](/docs/before_after_users.png)

### Component Authoring:
![Before and After](/docs/before_after.png)

## Installation

```
npm install react-seamstress --save
```

## Examples

See the [`examples`](https://github.com/namuol/react-seamstress/tree/master/examples) directory for some simple examples of using Seamstress.

For a more complex component-authoring example, take a look at [this fork of `react-select`](https://github.com/namuol/react-select-seamstress/blob/b662327697a8646300791d8cedb647653b951762/src/Select.js#L855) that replaces most of its styling logic with Seamstress as an exercise (it was easier than I expected!).

## Documentation

- [GitBook](http://namuol.github.io/react-seamstress/)
- [API Reference](http://namuol.github.io/react-seamstress/docs/api/index.html)

## Stability & Feedback

This project is still in the **experimental** phase, and I need feedback.

If you have any issues or ideas please [open a new issue](https://github.com/namuol/react-seamstress/issues).

I can also be reached [via email](mailto:louis.acresti@gmail.com), on Twitter as [@louroboros](http://twitter.com/louroboros), or on [reactiflux](http://reactiflux.com) as **@namuol**.

Thanks! :beers:

## Prior Art/Acknowledgements

- [Modularise CSS the React Way](https://medium.com/@jviereck/modularise-css-the-react-way-1e817b317b04) - article with some ideas that influenced this library
- [JedWatson/classNames](https://github.com/JedWatson/classnames) - conditionally compose classNames
- [casesandberg/ReactCSS](https://github.com/casesandberg/reactcss) - declaratively style components
- [pluralsight/react-styleable](https://github.com/pluralsight/react-styleable) - theme components with CSS modules
- [markdalgleish/react-themeable](https://github.com/markdalgleish/react-themeable) - theme components with inline styles *or* CSS classes