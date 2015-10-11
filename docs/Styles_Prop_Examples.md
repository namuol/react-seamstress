# props.styles examples

Unconditionally apply a single CSS class:

```js
styles={'MyComponent'}
```

Unconditionally apply some inline styles:

```js
styles={{
  color: 'red',
}}
```

Unconditionally apply some inline styles with the `:base` selector:

```js
styles={{
  ':base': { color: 'red' },
}}
```

Unconditionally apply a single CSS class *and* a set of inline styles, using an array:

```js
styles={[ 'MyComponent', { opacity: 0.5 } ]}
```

Conditionally apply a CSS class via custom `:pseudo-selector`:

```js
styles={{
  ':busy': 'MyComponent_busy',
}}
```

Conditionally apply inline styles via custom `:pseudo-selector`:

```js
styles={{
  ':busy': { opacity: 0.5 },
}}
```

Apply multiple CSS classes using `:pseudo-selectors`, including the special unconditional `:base` selector:

```js
styles={{
  ':base': 'MyComponent',
  ':busy': 'MyComponent_busy',
}}
```
