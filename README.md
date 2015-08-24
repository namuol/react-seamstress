# Declarative Styling of Complex Components

```js
<DropDown style={`
  &:expanded: {
    border: 1px solid black;
  }
`}>
  {items.map(item => 
    <DropDownItem style={`
      background-color: #0f0;
      color: #f0f;
      
      &:selected: {
        background-color: #f0f;
        color: #0f0;
      }
    `} />
  )}
</DropDown>
```

## `styleTypes`: expose state

```js
class DropDown extends React.Component {
  static styleTypes = {
    expanded: React.PropTypes.bool,
  };

  getStyleState () {
    return {
      expanded: this.state.expanded,
    };
  }

  // ...

}

class DropDownItem extends React.Component {
  static styleTypes = {
    selected: React.PropTypes.bool,
  };

  getStyleState () {
    return {
      selected: this.state.selected,
    };
  }

  // ...

}
```

## Why not just expose props that provide hooks into state?

Example:

```js
<DropDown expandedStyle={{
  border: 1px solid black;
}} />
```

This is essentially all we're doing, but with one crucial difference: we're explicitly declaring
what state is available. This has some subtle yet powerful benefits.

For instance, suppose you're refactoring some existing code to use this shiny new `<DropDown>` component,
and for whatever reason it's just not obeying your demands:

```js
class FancyForm extends React.Component {
  render () {
    return (
      <DropDown style={`
        &:expand {
          color: red;
        }
      `} />;
    );
  }
}
```

You flip over to your browser and see this friendly warning:

```
Warning: Style state `expand` was not specified in `DropDown`. Available style state parameters are: `expanded`. Check the render method of `FancyForm`.
```

How friendly -- you didn't even need to check the documentation of `DropDown` to fix the issue!

