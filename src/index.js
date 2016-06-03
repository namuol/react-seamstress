import React, { PropTypes } from 'react';

import arrayify from './arrayify';

import computeStylesInternal from './computeStyles';
import getSubComponentStyles from './getSubComponentStyles';

import validateStyles from './validateStyles';

import mergeStyles from './mergeStyles';

export const SubComponentTypes = {
  simple: '__Seamstress_SubComponentTypes_simple__',
  composite: '__Seamstress_SubComponentTypes_composite__',
};

export function configure ({
  styles = {},
  subComponentTypes = {},
  propTypes = {},
  native = false,
} = {}) {
  function computeStyles (props = {}) {
    const computedStyles = getSubComponentStyles({
      styles: computeStylesInternal({
        styles: [...arrayify(styles), ...arrayify(props.styles), props.className, props.style],
        props,
      }),
    });

    const allSubComponentNames = Object.keys(Object.assign({}, computedStyles, subComponentTypes));

    allSubComponentNames.forEach((name) => {
      if (subComponentTypes[name] === SubComponentTypes.composite) {
        computedStyles[name] = { styles: computedStyles[name] || [] };
      } else if (native) {
        computedStyles[name] = { style: computedStyles[name] || [] };
      } else {
        computedStyles[name] = mergeStyles(computedStyles[name] || []);
      }
    });

    return computedStyles;
  }

  const stylesPropType = (...args) => {
    return validateStyles({
      subComponentTypes,
      propTypes,
    }, ...args);
  };

  const computedStylesPropType = PropTypes.shape({
    root: PropTypes.shape({}).isRequired,
  }).isRequired;

  return {
    computeStyles,
    stylesPropType,
    computedStylesPropType,
    createContainer: (Component) => {
      return class extends React.Component {
        static displayName = Component.displayName || Component.name;

        static propTypes = {
          styles: stylesPropType,
        };

        render () {
          return (
            <Component
              {...this.props}
              styles={computeStyles(this.props)}
            />
          );
        }
      };
    },
  };
};

const Seamstress = {
  configure,
};

export default Seamstress;
