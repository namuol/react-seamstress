# Other Ideas

### Advanced queries

If a `styleState` item is declared to be `PropTypes.number`, users
could potentially query it numerically:

For instance, you might want to style a dropdown differently for when it is empty,
has one option, or has many options:

_**Note**: This syntax is very far from final ;)_

```js
<DropDown styles={{
  ':optionCount == 0': {
    // ... styles for an empty dropdown
  },

  ':optionCount == 1': {
    // ... styles for a dropdown with a single element
  },

  ':optionCount > 1': {
    // ... styles for a dropdown with many elements
  },
}} />
```

We may even want to support comparing multiple style state items:

```js
':foo > :bar': {
  // ...
}
```

Similar operations may also be performed on `PropTypes.string` items.

```js
<CountryChooser style={{
  ':value == "United States"': {
    // ... styles for American
  },
}} />
```

Queries that make no sense (i.e. comparing a `PropType.string` to a
`PropType.number`) could warn the user.

```
Warning: Numeric comparison query attempted in `string` defined on `CountryChooser`.
Check the render method of `SomeComponent`.
```

These can all effectively be implemented by passing a function for
`props.styles`, but the inherently declarative nature is lost in that
case, meaning fewer chances for catching errors.
