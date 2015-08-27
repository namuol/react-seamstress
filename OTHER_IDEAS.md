# Other Ideas

### `::sub-component`

Sub-component styling could be achieved with a `::pseudo-element`-inspired
interface.

Here's a hypothetical example of a `DropDown` that has an indicator
(such as a down arrow) which can be styled:

```js
@HasDeclarativeStyles
class DropDown extends React.Component {
  static subComponentNames = {
    'indicator',
  };

  render () {
    return (
      <div style={this.getStyle()}>
        <div style={this.getStyleFor('indicator')} />
        {
          // ...
        }
      </div>
    );
  }
}
```

Notice how we explicitly declare all the nested elements we expose with `subComponentNames`.
This allows us to warn the user of our component if they make a mistake.

Here's how such a component could be used:

```js
<DropDown style={{
  '::indicator': {
    display: 'none',
  }
}} />
```

**Question:** How do we handle/provide custom `:pseudo-selectors` to subcomponents?

Maybe something like:

```js
class DropDown extends React.Component {
  static subComponents = {
    someSubComponent: {
      styleStateTypes: {
        someSubComponentStateItem: PropTypes.bool,
      }
    }
  };
  
  // ...
}

// ...

<DropDown style={{
  '::someSubComponent': {
    ':someSubComponentStateItem': {
      // etc
    }
  }
}} />
```

A better question might be: Would doing this ever be considered good practice?

### `:composed:pseudo:selectors`

It could be useful to provide a mechanism to switch on multiple
pseudo selectors.

For instance, you might have async-fetching built into your component, and
users might want to be able to change the appearance of an `:expanded` dropdown
when it is `:busy`:

```js
<DropDown style={{
  ':expanded:busy': {
    cursor: 'progress',
  }
}} />
```

**Note**: We may also want to support more sass-like nested selectors (Syntax is
not final; we may want to use the more canonical `&:nested` form):

```js
<DropDown style={{
  ':expanded': {
    ':busy': {
      cursor: 'progress',
    }
  }
}} />
```

### Advanced queries

If a `styleState` item is declared to be `PropTypes.number`, users
could potentially query it numerically:

For instance, you might want to style a dropdown differently for when it is empty,
has one option, or has many options:

_**Note**: This syntax is very far from final ;)_

```js
<DropDown style={{
  ':optionCount == 0': {
    // ... styles for an empty dropdown
  },

  ':optionCount == 1': {
    // ... styles for a dropdown with a single element
  },

  ':optionCount > 1': {
    // ... styles for a dropdown with a single element
  }
}} />
```

Similar operations may also be performed on `PropTypes.string` items.

```js
<CountryChooser style={{
  ':value == "United States"': {
    // ... styles for American
  },
}} />
```
