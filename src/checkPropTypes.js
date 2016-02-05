//
// Adapted from React's internal propTypes validation
// https://github.com/facebook/react/blob/2d63dfd73c5258e683d394d9ea0b922be21c65d8/src/isomorphic/classic/element/ReactElementValidator.js
//

import warning from 'warning';
import invariant from 'invariant';

const ReactPropTypeLocationNames = {
  prop: 'prop',
  context: 'context',
  childContext: 'child context'
};

const loggedTypeFailures = {};

/**
 * Assert that the props are valid
 *
 * @param {string} componentName Name of the component for error messages.
 * @param {object} propTypes Map of prop name to a ReactPropType
 * @param {object} props
 * @param {string} location e.g. "prop", "context", "child context"
 * @private
 */
export default function checkPropTypes(componentName, propTypes, props, location, propTypeType="propType", addendum="") {
  for (var propName in propTypes) {
    if (propTypes.hasOwnProperty(propName)) {
      var error;
      // Prop type validation may throw. In case they do, we don't want to
      // fail the render phase where it didn't fail before. So we log it.
      // After these have been cleaned up, we'll let them throw.
      try {
        // This is intentionally an invariant that gets caught. It's the same
        // behavior as without this statement except with a better message.
        invariant(
          typeof propTypes[propName] === 'function',
          '%s: %s type `%s` is invalid; it must be a function, usually from ' +
          'React.PropTypes.',
          componentName || 'React class',
          ReactPropTypeLocationNames[location],
          propName
        );
        error = propTypes[propName](props, propName, componentName, location);
      } catch (ex) {
        error = ex;
      }
      warning(
        !error || error instanceof Error,
        '%s: type specification of %s `%s` is invalid; the type checker ' +
        'function must return `null` or an `Error` but returned a %s. ' +
        'You may have forgotten to pass an argument to the type checker ' +
        'creator (arrayOf, instanceOf, objectOf, oneOf, oneOfType, and ' +
        'shape all require an argument).',
        componentName || 'React class',
        ReactPropTypeLocationNames[location],
        propName,
        typeof error
      );
      if (error instanceof Error && !(error.message in loggedTypeFailures)) {
        // Only monitor this failure once because there tends to be a lot of the
        // same error.
        loggedTypeFailures[error.message] = true;

        warning(false, 'Failed %s: %s %s', propTypeType, error.message, addendum);
      }
    }
  }
}