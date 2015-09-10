# CSS or inline styles; which should you use?

Either! (With the exception of [publishable components](#conclusions))

Seamstress is **not** concerned with the debate over using `props.className` or `props.style`.

Users can specify `classNames` simply by using strings instead of objects inside
a `styles` object, and top-level (i.e. "default") `className`s can be specified by using
the special `:base` style state:

```js
const MY_STYLES = {
  ':base': 'myFancyClass',
  ':hover': 'myFancyClass_hover',
  ':active': 'myFancyClass_active',
};
```

The `getStyleProps()` method then returns an object that looks like this:

```js
{
  // Automatically-combined classNames:
  className: 'myFancyClass myFancyClass_hover',

  // Any inline styles:
  style: {color: 'red'},
}
```

Component authors can utilize the spread operator (`...`) to apply
`className` and `style` props in one fell swoop:

```js
<div {...this.getStyleProps()} />
```

## Gotchas

### Inline trumps CSS

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

This is a yet-to-be-implemented feature, but I think it's important, in particular for
third-party components.

### Rule order matters with CSS

CSS rules are applied in the order they appear, and thus the mechanism
that controls their order is critically important.

If we express our CSS as a dependency graph, we can simply traverse it
pre-order depth first to ensure the order matches our expectations. This will naturally emerge
when using something like CSS modules or CSS-in-JS solutions like free-style, but
users need to be extra careful when combining different approaches.

Inline styles don't have the ordering problem, but are problematic for reasons
mentioned above.

## The need for a standard

[react-future](https://github.com/reactjs/react-future/blob/fc5b7ac89effaea4c00143cb4d3bd3daa0f81f5d/04%20-%20Layout/04%20-%20Inline%20Styles.md)
uses `StyleSheet.create` in its examples, which is also [the standard with React Native](https://facebook.github.io/react-native/docs/style.html),
so there's a good chance we'll see this standard become part of React as a whole.

Whether `StyleSheet.create` uses `props.className` or `props.style` under the hood is
really just an *implementation detail*. Ideally the behavior would transparently
mimic the desired behavior using the most sensible/performant approach, not unlike the VDOM.

## Conclusions?

If you're only using your components internally in your project, choose the approach
that best suits your project's needs.

If you're ***publishing your component*** for use in other people's projects, use CSS/`className`.

Why? Inline styles can only be overridden by other inline styles, and therefore using inline styles
in your published component forces users that are using CSS everywhere else in their project to use
inline styles, or to rely on ugly hacks like `!important`.

Distribute any compiled CSS **AND** the "source" CSS files with your npm module. In other words, take
care not to exclude the original sources of your CSS in `.npmignore`.

Again, this will all be a lot simpler *once there's an agreed-upon approach to styling*. :pray:
