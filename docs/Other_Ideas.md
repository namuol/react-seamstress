# Other Ideas

Other potential features, development patterns, FIXMEs, or general brain-dumps go in this document.

### Logic: `:foo, :bar` and `not()`

We already have logical `AND` via `:composed:selectors`, but adding `OR` and `NOT` should eliminate many common cases where we'd need to resort to a (more error-prone) callback to compute our styles.

Syntax-wise, we could just borrow more from CSS.

`OR` can be expressed with a CSS-inspired comma:

```js
':disabled, :loading': {
  opacity: 0.5,
}
```

Here's how that'd look with `::sub-components`:

```js
':disabled::indicator, :loading::indicator': {
  opacity: 0.5,
}
```

We could use parenthesis to make this more readable:

```js
'(:disabled, :loading)::indicator': {
  opacity: 0.5,
}
```

`NOT` can be expressed with CSS's existing `:not(...)` pseudo-selector's syntax:

```js
':not(:busy):focused': {
  // Styles that only apply when we're not busy AND focused.
}
```

```js
':not(:disabled, :loading)': {
  // Styles that apply if we're NOT disabled and NOT loading.
}
```

```js
':not(:disabled, :loading)::indicator': {
  // Styles that apply to an indicator if we're NOT disabled and NOT loading.
}
```

### Advanced queries

If a `styleState` item is declared to be `PropTypes.number`, users could potentially query it numerically:

For instance, you might want to style a dropdown differently for when it is empty, has one option, or has many options:

```js
'option-count = 0': {
  // ... styles for an empty dropdown
}

'option-count = 1': {
  // ... styles for a dropdown with a single element
}

'option-count > 1': {
  // ... styles for a dropdown with many elements
}
```

Multiple conditions can be expressed by chaining:

```js
'option-count = 0:busy': { ...etc }
```

Similar questions may also be asked about `PropTypes.string` items.

```js
'country = "US"': {
  // ... styles for Americans
}
```

Queries that make no sense (i.e. comparing a `PropType.string` to a
`PropType.number`) could warn the user.

```
Warning: Numeric comparison query attempted in `string` defined on `CountryChooser`.
Check the render method of `SomeComponent`.
```

These can all effectively be implemented by passing a function for `props.styles`, but the inherently declarative nature is lost in that case, meaning fewer chances for catching errors.

### Thoughts on "Base Styles"

The way to overwrite the styles *completely* is already quite easy:

```js
class MyComponent extends Component {
  static styles = {
    // That's it.
  };
}
```

...but this is generally not a good idea, so long as `Component` adheres to a minimal set of base-styles.

Using `Component.extendStyles` will "keep" the existing styles and "tack on" any changes you pass in. This is the preferred way to "skin" a component.

The base styles of `Component` should only be concerned with the *behavior* of `Component` and any other *aesthetic* styles should be reduced to a minimum and made to look like something you might find in a browser if your component were a first-class DOM element like `select`, `button`, or even web-components like `video`.

It's difficult to define what kinds of styles are more behavioral than aesthetic, but these are some common ones:

- `display`
- `position`
- `zIndex`
- `flex`-related styles
- Any `margin` or `padding` used for layout purposes.

Basically, anything that affects the internal layout is generally stuff you would want to keep in place.

### More SubComponentTypes

Right now there's just `simple` and `composite` types, but we may want to support something like `:nth-child`, which would require us to declare that a sub-component appears multiple times.

I'm thinking the best way to do this is with something like `.hasMany`:

```js
subComponentTypes = {
  indicator: SubComponentTypes.simple,
  row: SubComponentTypes.composite.hasMany,
}
```
