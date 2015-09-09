# Other Ideas

### `::sub-component`

----

**Note**: `::sub-component` support is now implemented.

----

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
      <div {...this.getStyles()}>
        <div {...this.getStylesFor('indicator')} />
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
<DropDown styles={{
  '::indicator': {
    display: 'none',
  }
}} />
```

**Question:** How do we pass `:pseudo-selectors` to subcomponents?

Maybe something like:

```js
class DropDown extends React.Component {
  static subComponents = {
    indicator: {
      styleStateTypes: {
        hover: PropTypes.bool,
      }
    }
  };
  
  // ...
}

// ...

<DropDown styles={{
  '::indicator': {
    ':hover': {
      // etc
    }
  }
}} />
```

A better question might be: Would doing this ever be considered good practice?

A more straightforward approach is to simply break your component up further. In
the case of our `DropDown` with an `::indicator`, we can simply create an `Indicator`
component and set `styleStateTypes` on it directly:

```js
@HasDeclarativeStyles
class Indicator extends React.Component {
  static styleStateTypes = {
    hover: React.PropTypes.bool.isRequired,
  };

  isHovered () {
    // TODO: Implementation ;)
  }

  getStyleState () {
    return {
      hover: this.isHovered(),
    };
  }

  render () {
    return <div {...this.getStyles()} />;
  }
}

@HasDeclarativeStyles
class DropDown extends React.Component {
  static subComponents = {
    indicator: Indicator,
  };

  static styleStateTypes = {
    expanded: React.PropTypes.bool.isRequired,
  };

  getStyleState () {
    return {
      expanded: this.state.expanded,
    };
  }

  render () {
    return (
      <div {...this.getStyles()}>
        <Indicator
          {...this.getStylesFor('indicator')}
        />
      </div>
    );
  }
}
```

This makes expressing complex variations much easier:

```js
<DropDown styles={{
  '::indicator': {
    ':hover': {
      display: 'none',
    },
  },

  ':expanded': {
    '::indicator': {
      transform: 'rotate(90deg)',
    },
  },
}} />
```

### `:composed:pseudo:selectors`

----

**Note**: Basic non-nested `:composed:selectors` are now implemented.

----

It could be useful to provide a mechanism to switch on multiple
pseudo selectors.

For instance, you might have async-fetching built into your component, and
users might want to be able to change the appearance of an `:expanded` dropdown
when it is `:busy`:

```js
<DropDown styles={{
  ':expanded:busy': {
    cursor: 'progress',
  }
}} />
```

**Note**: We may also want to support more sass-like nested selectors (Syntax is
not final; we may want to use the more canonical `&:nested` form):

```js
<DropDown styles={{
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

### Computed values

Supply a function to compute the value of an inline style rule.

The result of `getStyleState()` is passed as the first argument.

The value returned is the value associated with the style rule,
applied as an inline style.

```js
// Gradually fade the text of a Tachometer (measures engine RPMs)
//  based on how many RPMs
import chroma from 'chroma-js';

const colorScale = chroma.scale([
  'white',
  'yellow',
  'orange',
  'red',
]).domain([
  0,
  5000,
  6000,
  7000,
]);

<Tachometer styles={{
  color: ({rpm}) => { return colorScale(rpm).hex() }
}} />
```

In many cases it might make sense to return an entire `styles` object.

This is particularly useful if you need to change the style of `::sub-components`
based on the state of the root component:

```js
import chroma from 'chroma-js';

const colorScale = chroma.scale([
  'white',
  'yellow',
  'orange',
  'red',
]).domain([
  0,
  5000,
  6000,
  7000,
]);


<Dashboard styles={({rpm} => {
  return {
    '::tachometer': {
      color: colorScale(rpm).hex(),
    },
  };
})} />
```
