# Should you use CSS or inline styles?

This experiment is **not** concerned with the debate over using `props.className` or `props.style`.

However, in general I'd recommend using a CSS-based solution if you intend to ***publish*** your component
with `@HasDeclarativeStyles`; [skip ahead](#conclusions) to see why.

That said, both approaches are supported.

`className` can be composed of any strings we encounter in the `props.styles` array,
and everything else can be assumed to be a `style` object.

Users can specify `className` styles simply by using strings instead of objects inside
a `styles` object, and top-level (i.e. "default") `className`s can be specified by composing it
into an array, like so:

```js
const MY_STYLES = [
  'myFancyClass',
  {
    ':hover': 'myFancyClass_hover',
    ':active': 'myFancyClass_active',
  },
];
```

An alternative, perhaps more succinct API might be to reserve something like `:default` for
applying "top-level" styles (this is not currently implemented):

```js
const MY_STYLES = {
  ':default': 'myFancyClass',
  ':hover': 'myFancyClass_hover',
  ':active': 'myFancyClass_active',
};
```

The `getStyles()` method then returns an object that looks like this:

```js
{
  // Automatically-combined classNames:
  className: 'myFancyClass myFancyClass_hover',

  // Any inline styles:
  style: {color: 'red'},
}
```

Component authors can utilize the spread operator (`...`) to apply
`className` and `style` props all at once:

```js
<div {...this.getStyles()} />
```

### Gotchas

#### inline trumps CSS

It's possible to supply inline styles before attempting to override them
with classes, which may lead to unexpected behavior.

For example, here we're trying to override an inline style with a className:

```css
.MyComboBox {
  color: black;
}
```

```js
<Combobox styles={[
  {
    color: 'red',
  },
  'MyComboBox',
]} />
```

Browser semantics dictate that this will not do what we expect, because the inline
styles always take priority over styles derived from CSS.

To reduce the risk of this kind of thing, we can provide a runtime check
that ensures all inline style definitions are supplied **at the end** of 
a style definition:

```
Warning: Attempted to override inline styles with className styles; this may lead to unexpected styling behavior. Check the render method of `MyComponent`.
```

#### Rule order matters with CSS

CSS rules are applied in the order they appear, and thus the mechanism
that controls their order is critically important.

If we express our CSS as a dependency graph, we can simply traverse it
pre-order depth first to ensure the order matches our expectations. This will naturally emerge
when using something like CSS modules or CSS-in-JS solutions like free-style, but
users need to be extra careful when combining different approaches.

Inline styles don't have the ordering problem

### The need for a standard

Given the lack of overridability of inline styles, it might make most sense to use
CSS for styling a component you intend to distribute on NPM or the like.

A third-party component author may decide to only use inline styles, but
the component *user* may exclusively use CSS in their project. In this situation,
the component author's inline styles can only be overridden by other inline styles,
which poses problems for users who prefer a CSS/classname-oriented styling system.

This is still an unsolved problem for component authors, and another 
reason why React really needs a single, agreed-upon implementation of styling.

[react-future](https://github.com/reactjs/react-future/blob/fc5b7ac89effaea4c00143cb4d3bd3daa0f81f5d/04%20-%20Layout/04%20-%20Inline%20Styles.md)
uses `StyleSheet.create` in its examples, which is also [the standard with React Native](https://facebook.github.io/react-native/docs/style.html),
so there's a good chance we'll see this standard become part of React as a whole.

Whether `StyleSheet.create` uses `props.className` or `props.style` under the hood is
really just an *implementation detail*, in the end -- ideally the behavior would transparently
mimic the desired behavior using the most sensible approach, not unlike the VDOM.

### Conclusions?

If you're only using your components internally in your project, choose the approach
that best suits your project's needs.

If you're ***publishing your component*** for use in other people's projects, use CSS/`className`.

Why? Inline styles can only be overridden by other inline styles, and therefore using inline styles
in your published component forces users that are using CSS everywhere else in their project to use
inline styles, or to rely on ugly hacks like `!important`.

Distribute any compiled CSS **AND** the "source" CSS files with your npm module. In other words, take
care not to exclude the original sources of your CSS in `.npmignore`.

Again, this will all be a lot simpler *once there's an agreed-upon approach to styling*. :pray:
