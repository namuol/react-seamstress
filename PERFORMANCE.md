# Performance Considerations

This document serves as a brain-dump for any performance-related ideas or concerns.

In its experimental phase, **Seamstress** has yet to be properly profiled for
the most common use-cases, so there's probably a lot of room for optimization.

Nonetheless, it's important to consider the potential performance ramifications
that each feature has, and whether its benefits outweigh the inherent cost.

### Optimization: `getStyleProps()` as a pure function

If we avoid callbacks (which may introduce side-effects), `getStyleProps()` can be thought
of as a *pure function* that operates on the results of `getStyleState()`, which itself **should**
be a pure function of `props`, `state`, and `context`.

This means we can *memoize* `getStyleProps()`, and its cousins, `getStylePropsFor()` & `getStylesFor()`.

Why might this be awesome?

The benefits would be seen if we need to re-run `render()`, but all of our style
calculations have already been computed.

In practice, this may only be beneficial for components with very large `Component.style`
objects that need to be parsed and iterated over.

For memo lookups to be fast, we'd need a fast way to value-compare the results of `getStyleState()`.

When testing out this idea, we can probably use Immutable.js to solve this problem,
and hopefully replace the dependency with something lighter that serves our specific
use-case. (Immutable adds around `60KB` to bundle sizes).