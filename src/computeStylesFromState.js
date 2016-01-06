import arrayify from './arrayify';
import getExpectedPropsFromSelector from './getExpectedPropsFromSelector';
import getAllMatches from './getAllMatches';

const selectorRegex = /:([\w-_]+)/g;
const elementRegex = /::([\w-_]+)/g;

function makeStyleStateSatisfactionChecker (styleState) {
  return function (propString) {
    const propNames = getAllMatches(selectorRegex, propString.replace(elementRegex, '')).map(matches => matches[1]).filter(m => !!m);
    return propNames.every(p => !!styleState[p]);
  }
}

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
  }
}

function splitPseudoElementString (fullString) {
  const idx = fullString.indexOf('::');
  return [fullString, fullString.substr(0, idx), fullString.substr(idx)];
}

function getValue (style, k, styleState, props) {
  const value = style[k];

  if (typeof value === 'function') {
    return value({styleState, props});
  }

  return value;
}

export default function computeStylesFromState ({styles, styleState={}, props={}}) {
  if (!styles) {
    return [];
  }

  const satisfiesStyleState = makeStyleStateSatisfactionChecker(styleState);
  const satisfiesProps = makePropsSatisfactionChecker(props);
  const satisfiesSelector = str => satisfiesStyleState(str) && satisfiesProps(str);

  return arrayify(styles).filter(s =>
    ['string','function','object'].indexOf(typeof s) > -1
  ).reduce((computedStyles, style) => {
    if (!style) {
      return computedStyles;
    }

    const styleType = (typeof style);

    if (styleType === 'string') {
      computedStyles.push(style);
      return computedStyles;
    }

    if (styleType === 'function') {
      computedStyles.push(...computeStylesFromState({
        styles: style({styleState, props}),
        styleState,
        props,
      }));
      return computedStyles;
    }

    // styleType === 'object':

    let base = style[':base'];

    if ((typeof base) === 'function') {
      base = base({styleState, props});
    }

    arrayify(base).forEach((base) => {
      if ((typeof base) === 'object') {
        Object.assign(style, base);
      } else if ((typeof base) === 'string') {
        computedStyles.push(base);
      }
    });

    const {
      topLevel,
      conditionals,
      pseudoElements,
    } = Object.keys(style).reduce((keys, k) => {
      if (/::/.test(k)) {
        keys.pseudoElements.push(k);
      } else if (/^:|^\[.+\]/.test(k)) {
        keys.conditionals.push(k);
      } else if (k !== ':base') {
        keys.topLevel.push(k);
      }

      return keys;
    }, {
      topLevel: [],
      conditionals: [],
      pseudoElements: [],
    });

    const topLevelStyles = topLevel.reduce((result, k) => {
      result[k] = getValue(style, k, styleState, props);
      return result;
    }, {});

    if (topLevel.length > 0) {
      computedStyles.push(topLevelStyles);
    }

    const addValue = (k) => {
      const value = getValue(style, k, styleState, props);

      if (Array.isArray(value)) {
        computedStyles.push(...value);
      } else {
        computedStyles.push(value);
      }
    }

    conditionals.filter(satisfiesSelector).forEach(addValue);

    pseudoElements.map(splitPseudoElementString)
    .filter(([k, propString]) => {
      return satisfiesSelector(propString);
    }).forEach(([k, _, pseudoElementName]) => {
      computedStyles.push({[pseudoElementName]: getValue(style, k, styleState, props)});
    });

    return computedStyles;
  }, []);
}