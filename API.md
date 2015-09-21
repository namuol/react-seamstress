# Seamstress API Reference - 0.3

## Seamstress

```js
import Seamstress from 'react-seamstress';
```

The entry point into the Seamstress library.

## Seamstress.createContainer

```js
HigherOrderComponent createContainer(
  ReactClass/Component/Function WrappedComponent,
  object config
)
```

Returns a higher-order component that processes [`props.styles`](#propsstyles)and passes the result as [`props.computedStyles`](#propscomputedstyles) to `WrappedComponent`.

The [configuration object](#config) passed as the second argument determines how the input styles are processed.

> Note:
>
> If your [`config.getStyleState()`](#configgetstylestate) function needs access to `this.state`, or your component's API exposes any instance properties or methods, use [**`createDecorator`**](#seamstresscreatedecorator), instead.

## Seamstress.createDecorator

```js
decoratorFunction createDecorator(object config)
```

Returns a decorator function that takes the following form:

```js
SeamstressComponent decoratorFunction(ReactClass/Component YourComponent)
```

The decorator returns a component that derives from `YourComponent` and supplies some additional behaviors:

- `this.getComputedStyles()` provides [`computedStyles`](#computedstyles) to your component.
- `propTypes` is enhanced with a custom `styles` validator if [`styleStateTypes`](#configstylestatetypes) or [`subComponentTypes`](#configsubcomponenttypes) were configured.

> Note:
>
> If `YourComponent` is a stateless component, or your [`config.getStyleState()`](#configgetstylestate) function doesn't need access to component state, use [**`createContainer`**](#seamstresscreatecontainer), instead.

## config

```js
{
  styles: string/object/function/Array,
  getStyleState: Function,
  [styleStateTypes: object],
  [subComponentTypes: object],
}
```

### config.styles

The "default" styles for your component.

Takes the same form as the [`styles` prop](#propsstyles).

These styles are applied unless explicitly overridden by `props.styles`.

### config.getStyleState

```js
getStyleState: function ({
  props: object,
  context: object,
  [state: object],
}) {
  return {
    // style-state values go here
  };
}
```

A function that returns all style-related state of your component.

This should be a **pure function** of the `props`, `context`, and if applicable, the `state` of your component.

The `state` parameter is only specified when using [`Seamstress.createDecorator()`](#seamstresscreatedecorator).

### config.styleStateTypes

```js
styleStateTypes: {
  ['style-state': React.PropType],
  ...,
}
```

An optional (but recommended) way to declare the state your component exposes for styling purposes.

Takes the same form as [`propTypes`](https://facebook.github.io/react/docs/reusable-components.html#prop-validation).

In a nutshell, `bool` style-state items correspond to a single [`:pseudo-selector`](#pseudo-selectors), and all other types are only accessible via [style callbacks](#stylecallbacks).

Much like `propTypes`, `styleStateTypes` will help ensure your component is being styled correctly by providing warnings whenever unspecified or non-boolean style-states are used as `:pseudo-selectors`.

The result of `config.getStyleState()` is also validated using these prop-types.

> Note:
> 
> Validations are skipped and warnings will be suppressed when executing in a production environment.

### config.subComponentTypes

```js
styleStateTypes: {
  ['sub-component': Seamstress.SubComponentType],
  ...,
}
```

An optional (but recommended) way to declare the styleable sub-components (if any) that your component contains.

In a nutshell, each named sub-component corresponds to a single [`::pseudo-element`](#pseudo-element).

Values must come from [`Seamstress.SubComponentTypes`](#seamstresssubcomponenttypes).

If specified, `props.styles` will warn the user if any unspecified `::sub-component` is used.

If unspecified, all `::sub-components` are assumed to be `SubComponentTypes.simple`.

> Note:
> 
> Validations are skipped and warnings will be suppressed when executing in a production environment.

## Seamstress.SubComponentTypes

```js
// A simple sub-component that expects `className` and `style` props:
Seamstress.SubComponentTypes.simple

// A Seamstress-enabled sub-component that expects a `styles` prop:
Seamstress.SubComponentTypes.composite
```

## computedStyles

The applicable style-related props for your component and any of its sub-components. Typically used inside a `render()` function.

Can be accessed in one of two ways, depending on how you created your Seamstress-enabled component:

If (and **only** if) you're using [Seamstress.createDecorator](#seamstresscreatedecorator):

```js
this.getComputedStyles()
```

If (and **only** if) you're using [Seamstress.createContainer](#seamstresscreatecontainer):

```js
props.computedStyles
```

The `computedStyles` object takes on the following shape:

```js
{
  root: { className, style },

  (simple sub-component): { className, style },
  (composite sub-component): { styles },
}
```

The `root` property is always defined on `computedStyles`, because it corresponds to all "top-level" styles from [`props.styles`](#propsstyles). Typically, `root` props are passed to the outermost styleable element inside your component's `render()` method.

All other items in `computedStyles` apply to the named sub-components of your component.

[**`simple`** sub-components](#subcomponenttypessimple) are automatically merged into low-level style props (in the case of the DOM, `className` and `style`).

[**`composite`** sub-components](#subcomponenttypescomposite) retain the original unprocessed [`styles`](#propsstyles) prop that should only be passed to other Seamstress-wrapped components.

By default, all sub-components are assumed to be `simple`. Use [`config.subComponentTypes`](#configsubcomponenttypes) to control how each individual sub-component's style props are processed.

## props.styles

```js
<SeamstressComponent styles={string/object/function/Array} />
```

A prop for expressing how a Seamstress component should be styled.

Think of it as a combination of React inline styles with custom `:pseudo-selectors` and `::pseudo-elements`.

Values can be a `string`, an `object`, a callback `function`, or an `Array` containing any combination of such types.

All other value types (`boolean`, `null`, `undefined`, etc) are ignored.

Default styles specified with [`config.styles`](#configstyles) are retained unless explicitly overridden by `props.styles`.

See [STYLES_PROPS_EXAMPLES.md](STYLES_PROPS_EXAMPLES.md) for a comprehensive list of the forms `props.styles` can take.

### Top-level styles

All keys in a styles `object` that *don't* begin with `:` are considered "top-level" styles. These will be combined into [`computedStyles.root`](#computedstyles).

Top-level CSS classes can be applied as a standalone `string`, a `string` in an array, or with the [`:base` pseudo-selector](#base).

### :pseudo-selectors

```js
':some-style-state-name': string/object/Function
```

Inside any `object`, keys beginning with a single `:` correspond to styles that are only applied when the matching value returned from [`config.getStyleState()`](#configgetstylestate) is `true`.

For instance, the key-value-pair `':busy': {opacity: 0.5}` translates to "When the component is busy, set `opacity` to `0.5`."

If multiple style-state selectors are specified (i.e. `:busy:expanded`), the associated styles only apply when **all** correspinding style-states are `true`.

To apply a specific CSS class, provide a `string` instead of an object (i.e. `':busy': 'MyComponent_busy'`).

> Note:
>
> Seamstress `:pseudo-selectors` are **not** CSS pseudo-selectors.
>
> For instance, `:hover` will only apply if you explicitly keep track of the hover state and include it in the result of [`config.getStyleState()`](#configgetstylestate).
>
> However, ordinary CSS selectors may still be used within your actual CSS, of course! Seamstress merely combines and applies the applicable CSS classes for you.

#### `:base`

```js
':base': string/object/Function
```

A special style-state used to *unconditionally* apply styles to a component. This is mostly useful for specifying a default classnames, (i.e. `':base': 'MyComponent'`).

### ::pseudo-elements

```js
'::some-sub-component-name': string/object/Function
```


Inside any `object`, keys containing `::` correspond to styles that apply to nested sub-components (i.e. `'::indicator': 'Indicator'`).

These can be used in combination with `:pseudo-selectors` to conditionally apply style properties to sub-components (i.e. `':busy::indicator': 'Indicator_busy'`).

Use [`config.subComponentTypes`](#configsubcomponenttypes) to declare which `::sub-components` are valid, and how their style props should be processed inside [`computedStyles`](#computedstyles).

> Note:
>
> Seamstress `::pseudo-elements` are **not** CSS pseudo-elements.
>
> For instance, `::first-letter` only means something if the component-author explicitly applies `computedStyles['first-letter]` to something like a `<span>` wrapped around the first letter of its internal content.
>
> However, ordinary CSS selectors may still be used within your actual CSS, of course! Seamstress merely combines and applies the applicable CSS classes for you.

### Style callbacks

When a `function` is encountered in a `styles` object, it is treated as a callback. This function will receive an object containing the results of [`config.getStyleState()`](#configgetstylestate) as its first and only argument.

Such callbacks can be used to compute the entire `styles` prop, the `styles` pertaining to a specific `:pseudo-selector` or `::pseudo-element`, or a single inline-style value.

Nested callbacks are not supported, but you may return a styles definition containing nested `:pseudo-selector` and `::pseudo-element` items.

> Note:
>
> Callbacks should be avoided whenever possible. They are generally less predictable and need to be re-evaluated every `render()`, and purely-declarative styles can be [optimized](PERFORMANCE.md) by Seamstress, behind the scenes.
