# Declarative Styling of Complex Components

```js
<DropDown style={{
  '&:expanded': {
    border: '1px solid black',
  }
}}>
  {items.map(item => 
    <DropDownItem style={{
      backgroundColor: '#0f0',
      color: '#f0f',
      
      &:selected: {
        backgroundColor: '#f0f',
        color: '#0f0',
      }
    }} />
  )}
</DropDown>
```

## Why not just expose props that provide hooks into state?

Example:

```js
<DropDown expandedStyle={{
  border: '1px solid black',
}} />
```

This is essentially all we're doing, but with one crucial difference: we're explicitly declaring
what state is available. This has some subtle yet powerful benefits.

For instance, suppose you're using this `DropDown` for the first time, and you write something like this:

```js
class FancyForm extends React.Component {
  render () {
    return (
      <DropDown style={{
        '&:active': {
          border: '1px solid black',
        }
      }} />;
    );
  }
}
```

You flip over to your browser and see this friendly warning:

```
Warning: Style state `active` was not specified in `DropDown`. Available states are: `expanded`. Check the render method of `FancyForm`.
```

How friendly -- you didn't even need to check the documentation of `DropDown` to fix the issue!

Furthermore, this leads to a cleaner implementation on our `DropDown` component;

```js
// Standard props:

class DropDown extends React.Component {
  static propTypes = {
    expandedStyle: React.PropTypes.object,
  };

  render () {
    return <div style={[
      this.props.style,
      this.state.expanded && this.props.expandedStyle,
    ]} />;
  }
}

// With styleStateTypes:

class DropDown extends React.Component {
  static styleStateTypes = {
    expanded: React.PropTypes.bool,
  };

  getStyleState () {
    return {
      expanded: this.state.expanded,
    };
  }

  render () {
    return <div style={getStyle()} />;
  }
}
```