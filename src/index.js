import React from 'react';
import isReactClass from './isReactClass';

import warning from 'warning';
import arrayify from './arrayify';

import computeStylesInternal from './computeStyles';
import getSubComponentStyles from './getSubComponentStyles';
import getExpectedPropsFromSelector from './getExpectedPropsFromSelector';

import validateStyles from './validateStyles';
import checkPropTypes from './checkPropTypes';

// TODO: What's a better way to do this? How does React do it?
const __DEV__ = process.env.NODE_ENV !== 'production';

import mergeStyles from './mergeStyles';

export const SubComponentTypes = {
  simple: '__Seamstress_SubComponentTypes_simple__',
  composite: '__Seamstress_SubComponentTypes_composite__',
};

export function configure ({
  styles = {},
  subComponentTypes = {},
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
      } else {
        computedStyles[name] = mergeStyles(computedStyles[name] || {});
      }
    });

    return computedStyles;
  }

  return {
    computeStyles,
  };
};

const Seamstress = {
  configure,
};

export default Seamstress;
