import React from 'react';
import isReactClass from './isReactClass';

import warning from 'fbjs/lib/warning';
import arrayify from './arrayify';

import computeStylesFromState from './computeStylesFromState';
import getSubComponentStyles from './getSubComponentStyles';

import validateStyles from './validateStyles';
import checkPropTypes from './checkPropTypes';

// TODO: What's a better way to do this? How does React do it?
const __DEV__ = process.env.NODE_ENV !== 'production';

import mergeStyles from './mergeStyles';

function overrideWithWarning (object, propertyName, value, displayName) {
  if (__DEV__) {
    displayName = displayName || propertyName;

    warning(!Object.prototype.hasOwnProperty.call(object, propertyName),
      `\`${displayName}\` is automatically provided by Seamstress. ` +
      `The original definition will be overridden.`
    );
  }

  object[propertyName] = value;
}

function getDisplayName (Component) {
  return Component.displayName || Component.name;
}

function configureSeamstress (config={}) {
  const {
    styles={},
    styleStateTypes,
    getStyleState=(_ => {}),
  } = config;

  const __subComponentTypes = config.subComponentTypes || {};
  const subComponentTypes = Object.assign({}, __subComponentTypes, {
    root: __subComponentTypes.root || SubComponentTypes.simple,
  });

  function styleizeComponent (useHoc, Component) {
    const typeofComponent = typeof Component;
    if (typeofComponent !== 'function') {
      throw new TypeError('Expected a React component, but got ' + typeofComponent);
    }

    const displayName = getDisplayName(Component);
    const validateComponentStyles = validateStyles.bind(null, config, displayName);

    if (__DEV__) {
      let error = validateComponentStyles({styles}, 'styles');
      warning(!error, (error ? error.message : 'Unexpected Error') +
        ` Check the \`styles\` property supplied to the Seamstress config of \`${displayName}\`.`);
    }

    function getComputedStyles ({ props, context, state }) {
      const styleState = getStyleState({props, context, state});

      if (__DEV__) {
        const addendum = `Check the \`getStyleState()\` function supplied to the Seamstress config of \`${displayName}\`.`;

        warning(!styleState.hasOwnProperty('base'),
          `\`:base\` is a reserved styleState that is always \`true\`; please use a different name. ` +
          addendum
        );

        if (styleStateTypes) {
          checkPropTypes(displayName, styleStateTypes, styleState, 'prop', 'styleStateType', addendum);
        }
      }
    
      // HACKish: ensures :base:composed:selectors work as expected:
      styleState.base = true;

      const computedStyles = getSubComponentStyles({
        styles: computeStylesFromState({
          state: styleState,
          styles: [...arrayify(styles), ...arrayify(props.styles)],
        }),
      });

      const allSubComponentNames = Object.keys(Object.assign({}, computedStyles, subComponentTypes));

      allSubComponentNames.forEach((name) => {
        if (subComponentTypes[name] === SubComponentTypes.composite) {
          computedStyles[name] = { styles: computedStyles[name] };
        } else {
          computedStyles[name] = mergeStyles(computedStyles[name]);
        }
      });

      return computedStyles;
    }

    function extendStyles (myStyles) {
      const newConfig = Object.assign({}, config, {
        styles: [...arrayify(styles), ...arrayify(myStyles)],
      });

      return configureSeamstress(newConfig).decorate(Component);
    }

    function wrap (Component) {
      return class SeamstressComponent extends React.Component {
        static propTypes = {
          styles: validateComponentStyles,
        };

        render () {
          const { props, context } = this;
          return <Component
            {...props}
            computedStyles={getComputedStyles({props, context})}
          />;
        }
      }
    }

    let newComponent;

    if (useHoc) {
      newComponent = wrap(Component);
    } else {
      function thisGetComputedStyles () {
        const { props, context, state } = this;
        return getComputedStyles({ props, context, state });
      }

      if (!isReactClass(Component)) {
        // We wrap with a HoC if we detect a non-class component:
        newComponent = wrap(Component);
      } else {
        newComponent = class extends Component {
          static propTypes = Object.assign({}, Component.propTypes);
        };

        overrideWithWarning(newComponent.prototype, 'getComputedStyles', thisGetComputedStyles, `${displayName}.prototype.getComputedStyles`);
      }

      newComponent.displayName = displayName;
    }
    
    overrideWithWarning(newComponent, 'extendStyles', extendStyles, `${displayName}.extendStyles`);

    return newComponent;
  }

  return {
    decorate: styleizeComponent.bind(null, false),
    createContainer: styleizeComponent.bind(null, true),
  };
}

export function createDecorator (config) {
  return function (Component) {
    return configureSeamstress(config).decorate(Component);
  }
}

export function createContainer (Component, config) {
  return configureSeamstress(config).createContainer(Component);
}

export const SubComponentTypes = {
  simple: '__Seamstress_SubComponentTypes_simple__',
  composite: '__Seamstress_SubComponentTypes_composite__',
};

export { mergeStyles };

const Seamstress = {
  createDecorator: createDecorator,
  createContainer: createContainer,
  SubComponentTypes: SubComponentTypes,
  mergeStyles: mergeStyles,
};

export default Seamstress;