# Declarative Styling of Complex React Components

**Note**: This is an experiment. Please submit
[issues](https://github.com/namuol/react-declarative-styles/issues) 
for any bugs/questions/comments/discussion.

----

Idea: custom :pseudo-selector-like abilities in React components.

Example:

```js
<DropDown style={{
  ':expanded': {
    border: '1px solid black',
  }
}} />
```

## Why not just expose props that provide hooks into state?

We can already support this pretty easily with props:

```js
<DropDown expandedStyle={{
  border: '1px solid black',
}} />
```

However, why not explicitly declare what state is available to styles separately?
This has some subtle yet powerful benefits.

For instance, suppose you're using this `DropDown` for the first time,
and you write something like this:

```js
class FancyForm extends React.Component {
  render () {
    return (
      <DropDown style={{
        ':active': {
          border: '1px solid black',
        }
      }} />;
    );
  }
}
```

You flip over to your browser and see this friendly warning:

```
Warning: Style state `active` was not specified in `DropDown`.
Available states are: `expanded`. Check the render method of `FancyForm`.
```

How friendly -- you didn't even need to check the documentation of `DropDown`
to fix the issue!

Furthermore, this leads to a cleaner implementation on our `DropDown`
component.

Here's how you'd implement this today by exposing the `expandedStyle` prop:

```js
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
```

...and here's an example using a decorator that provides us with
`styleStateProps`, `getStyleState()` and `getStyle()`:

```js
@HasDeclarativeStyles
class DropDown extends React.Component {
  static styleStateTypes = {
    expanded: React.PropTypes.bool.isRequired,
  };

  getStyleState () {
    return {
      expanded: this.state.expanded,
    };
  }

  render () {
    return <div style={this.getStyle()} />;
  }
}
```

In our example, `getStyle()` effectively does the work of composing
style props as done manually in the first example.

## Other possibilities/unimplemented features

Sub-component styling could be achieved with a `::pseudo-element`-inspired
interface.

Here's a hypothetical example of a `DropDown` that has an indicator
(such as a down arrow) which can be styled:

```js
@HasDeclarativeStyles
class DropDown extends React.Component {
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

Here's how such a component could be used:

```js
<DropDown style={{
  '::indicator': {
    display: 'none',
  }
}} />
```

We could provide developers with something like `subComponentNames` to
explicitly declare which sub-components are available, enabling helpful
warning messages/static analysis:

```js
@HasDeclarativeStyles
class Dropdown extends React.Component {
  static subComponentNames = {
    'indicator',
  };

  // ...
}
```
