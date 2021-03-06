import arrayify from './arrayify';
import getExpectedPropsFromSelector from './getExpectedPropsFromSelector';

function makePropsSatisfactionChecker (props) {
  return function (propString) {
    const propsAndValues = getExpectedPropsFromSelector(propString);
    return Object.keys(propsAndValues).every((propName) => {
      const expectedValue = propsAndValues[propName];

      if (expectedValue === undefined) {
        return !!props[propName];
      }

      return props[propName] === expectedValue;
    });
  };
}

function splitPseudoElementString (fullString) {
  const idx = fullString.indexOf('::');
  return [fullString, fullString.substr(0, idx), fullString.substr(idx)];
}

function getValue (style, key, props) {
  const value = style[key];

  if (typeof value === 'function') {
    return value({ props });
  }

  return value;
}

import expandStyles from './expandStyles';

export default function computeStyles ({styles, props = {}}) {
  if (!styles) {
    return [];
  }

  const satisfiesProps = makePropsSatisfactionChecker(props);
  const satisfiesSelector = (str) => satisfiesProps(str);

  return arrayify(styles).filter((s) =>
    s && ['string', 'function', 'object', 'number'].indexOf(typeof s) > -1
  ).reduce((flattenedStyles, style) => {
    if (typeof style !== 'object') {
      flattenedStyles.push(style);
    } else {
      flattenedStyles.push(...expandStyles(style));
    }
    return flattenedStyles;
  }, []).reduce((computedStyles, style) => {
    if (!style) {
      return computedStyles;
    }

    const styleType = (typeof style);

    if (styleType === 'string' || styleType === 'number') {
      computedStyles.push(style);
      return computedStyles;
    }

    if (styleType === 'function') {
      computedStyles.push(...computeStyles({
        styles: style({props}),
        props,
      }));
      return computedStyles;
    }

    // styleType === 'object':

    let root = style['::root'];

    const rootType = typeof root;

    if (rootType === 'function') {
      root = root({props});
    }

    arrayify(root).forEach((subRoot) => {
      const subRootType = typeof subRoot;

      if (subRootType === 'object') {
        Object.assign(style, subRoot);
      } else if (subRootType === 'string' || subRootType === 'number') {
        computedStyles.push(subRoot);
      }
    });

    const {
      topLevel,
      conditionals,
      pseudoElements,
    } = Object.keys(style).reduce((keys, k) => {
      if (/::/.test(k) && k !== '::root') {
        keys.pseudoElements.push(k);
      } else if (/^\s*\[.+\]/.test(k)) {
        keys.conditionals.push(k);
      } else if (k !== '::root') {
        keys.topLevel.push(k);
      }

      return keys;
    }, {
      topLevel: [],
      conditionals: [],
      pseudoElements: [],
    });

    const topLevelStyles = topLevel.reduce((result, key) => {
      result[key] = getValue(style, key, props);
      return result;
    }, {});

    if (topLevel.length > 0) {
      computedStyles.push(topLevelStyles);
    }

    const addValue = (key) => {
      const value = getValue(style, key, props);

      if (Array.isArray(value)) {
        computedStyles.push(...value);
      } else {
        computedStyles.push(value);
      }
    };

    conditionals.filter(satisfiesSelector).forEach(addValue);

    pseudoElements.map(splitPseudoElementString)
    .filter(([key, propString]) => {
      return satisfiesSelector(propString);
    }).forEach(([key, _, pseudoElementName]) => {
      computedStyles.push({[pseudoElementName]: getValue(style, key, props)});
    });

    return computedStyles;
  }, []);
}
