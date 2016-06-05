# API Reference

## Contents

-   [Seamstress](#seamstress)

-   [Seamstress.configure(...)](#seamstressconfigure)

    -   [config.styles](#configstyles)
    -   [config.subComponentTypes](#configsubcomponenttypes)
    -   [config.native](#confignative)

-   [createContainer](#createcontainer)

-   [props.styles](#propsstyles)

    -   [\[prop\] selectors](#prop-selectors)
    -   [Sub-component selectors](#sub-component-selectors)
    -   [Computed styles](#computed-styles)

## Seamstress

```js
import Seamstress from 'react-seamstress';
```

The entry point into the Seamstress library.

## Seamstress.configure(...)

```js
SeamstressInstance Seamstress.configure({
  styles: string | object | Array,
  [subComponentTypes: {
    subComponentName: SubComponentTypes.simple | SubComponent.composite,
    ...,
  }],
  [native: boolean = false],
})
```

### config.styles

The "default" styles for your component.

Takes the same form as the [`styles` prop](#propsstyles).

These styles are applied unless explicitly overridden by `props.styles`.

### config.subComponentTypes

```js
subComponentTypes: {
  [subComponentName: SubComponentTypes.simple | SubComponentTypes.composite],
  ...,
}
```

An optional (recommended) parameter for declaring the styleable sub-components (if any) that your component contains.

Each named sub-component corresponds to a single [`::sub-component`](#sub-component-selectors).

### config.native

Set this flag to `true` to ensure that the [computed styles](#computed-styles) are formatted correctly for a React Native component.

## createContainer

```js
const { createContainer } = Seamstress.configure(...);
```

```js
SeamstressComponent createContainer(ReactClass WrappedComponent);
```

Returns a higher-order component that processes [`props.styles`](#propsstyles) and passes the result as `props.styles` to `WrappedComponent`.

## props.styles

```js
<SeamstressComponent styles={object | string | Array} />
```

A seamstress-wrapped component accepts a prop called `styles` that overrides its default styles.

```js
// Apply the CSS class "MyCSSClass" to the root element of the component:
<SeamstressComponent styles={{'::root': 'MyCSSClass'}} />
<SeamstressComponent styles={'MyCSSClass'} />

// Apply inline styles to the root element of the component:
<SeamstressComponent styles={{'::root': {backgroundColor: 'gray'}}} />
<SeamstressComponent styles={{backgroundColor: 'gray'}} />

// Apply CSS classes to a named sub-component:
<SeamstressComponent
  toggled={...}
  styles={{
    '::subComponent': 'MyCSSClass-SubComponent',
    // Only apply this class when the `toggled` prop is truthy:
    '[toggled]::subComponent': 'MyCSSClass-SubComponent-toggled',
  }}
/>

// Apply inline styles to a named sub-component:
<SeamstressComponent
  toggled={...}
  styles={{
    '::subComponent': {backgroundColor: 'gray'},
    // Only apply these styles when the `toggled` prop is truthy:
    '[toggled]::subComponent': {backgroundColor: 'black'},
  }}
/>

// When no ::subComponent is specified, styles are applied to ::root.
// These are equivalent:
<SeamstressComponent
  toggled={...}
  styles={{'[toggled]::root': 'MyCSSClass-toggled'}}
/>
<SeamstressComponent
  toggled={...}
  styles={{'[toggled]': 'MyCSSClass-toggled'}}
/>

// You can apply the same styles to multiple selectors by using
// a comma, similar to CSS:
<SeamstressComponent
  toggled={...}
  active={...}
  styles={{'[toggled], [active]': 'MyCSSClass-toggled-or-active'}}
/>

// "Top level" inline styles are applied to ::root.
// These are equivalent:
<SeamstressComponent
  styles={{backgroundColor: 'gray'}}
/>
<SeamstressComponent
  styles={{'::root': {backgroundColor: 'gray'}}}
/>

// Multiple CSS classes or styles can be merged by using an array:
<SeamstressComponent
  styles={['MyCSSClass', 'MyOtherCSSClass', {backgroundColor: 'gray'}]}
/>
```

### \[prop] selectors

```js
[propName]
[propName=false]
[propName=42]
[propName="string"]
```

Seamstress implements a syntax inspired by [CSS's `[attr]` selector](https://developer.mozilla.org/en-US/docs/Web/CSS/Attribute_selectors) to allow you to style your components based on their props.

There are some key differences from standard CSS `[attr]` selectors, however:

-   Only `[prop]` and `[prop=<value>]` syntax supported.
-   `[prop]` only applies when `prop` is [truthy](https://developer.mozilla.org/en-US/docs/Glossary/Truthy).
-   Boolean props can also be tested explicitly, i.e. `[prop=true]` or `[prop=false]`
-   String values **must** include **double-quotes**, i.e. `[prop="string"]`

### Sub-component selectors

```js
::subComponentName
```

Selectors that contain `::` correspond to styles that apply to nested sub-components.

Use [`config.subComponentTypes`](#configsubcomponenttypes) to declare which `::subComponents` are valid.

### Computed styles

Seamstress processes the incoming `styles` prop and passes the result as the `styles` prop to your wrapped component.

It will look something like this:

```js
{
  root: {
    // styles.root is *always* supplied and is meant to be applied to the root of your component
    style: {
      // ...
    },
    className: '<merged list of any applicable CSS classes>',
  },
  simpleSubComponent: {
    style: {
      // inline styles
    },
    className: '<merged list of any applicable CSS classes>',
  },
  compositeSubComponent: {
    styles: {
      // Un-processed styles being passed to a nested Seamstress component
    },
  },
  // ...
}
```

When `config.native` is true, no `className` props are supplied.

In your component's `render` function, pass these props to the appropriate components:

```js
<div {...styles.root}>
  <div {...styles.simpleSubComponent} />
  <NestedSeamstressComponent {...styles.compositeSubComponent} />
</div>
```

Note: in the example above, `compositeSubComponent` needs to be declared as `SubComponentTypes.composite` in your Seamstress configuration for Seamstress to defer processing its styles to the nested component.
