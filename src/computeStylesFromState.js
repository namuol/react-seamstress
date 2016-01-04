import arrayify from './arrayify';

function satisfies (state) {
  return function (propString) {
    const propNames = propString.split(':').filter(p => !!p);
    return propNames.every(p => !!state[p]);
  }
}

function execAll (regexp, str) {
  const results = [];
  
  let result;
  while ((result = regexp.exec(str)) !== null) {
    results.push(result);
  }

  return results;
}

const propRegex = /\[(\w+)(=([^\]]+)?)?\]/g;
const getPropsAndValues = (str) => {
  return execAll(propRegex, str).reduce((propValues, matches) => {
    const [ , propName, , propValue ] = matches;
    propValues[propName] = propValue;
    return propValues
  }, {});
}

function propsSatisfies (props) {
  return function (propString) {
    const propsAndValues = getPropsAndValues(propString);
    return Object.keys(propsAndValues).every((propName) => {
      try {
        const unparsedValue = propsAndValues[propName];
        if (unparsedValue === undefined) {
          return !!props[propName];
        }
        const expectedValue = JSON.parse(unparsedValue);
        const actualValue = props[propName];
        return actualValue === expectedValue;
      } catch (e) {
        throw new TypeError(`Seamstress: Malformed rule: ${propString}; did you forget to quote a string?`);
      }
    });
  }
}

function splitPseudoElementString (fullString) {
  const idx = fullString.indexOf('::');
  return [fullString, fullString.substr(0, idx), fullString.substr(idx)];
}

function getValue (style, k, state) {
  const value = style[k];

  if (typeof value === 'function') {
    return value(state);
  }

  return value;
}

export default function computeStylesFromState ({styles, state={}, props={}}) {
  if (!styles) {
    return [];
  }

  const satisfiesState = satisfies(state);
  const satisfiesProps = propsSatisfies(props);

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
        styles: style(state),
        state,
      }));
      return computedStyles;
    }

    // styleType === 'object':

    let base = style[':base'];

    if ((typeof base) === 'function') {
      base = base(state);
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
      propConditionals,
      pseudoElements,
    } = Object.keys(style).reduce((keys, k) => {
      if (/::/.test(k)) {
        keys.pseudoElements.push(k);
      } else if (/^:/.test(k)) {
        keys.conditionals.push(k);
      } else if (/^\[.+\]/.test(k)) {
        keys.propConditionals.push(k);
      } else if (k !== ':base') {
        keys.topLevel.push(k);
      }

      return keys;
    }, {
      topLevel: [],
      conditionals: [],
      propConditionals: [],
      pseudoElements: [],
    });

    const topLevelStyles = topLevel.reduce((result, k) => {
      result[k] = getValue(style, k, state);
      return result;
    }, {});

    if (topLevel.length > 0) {
      computedStyles.push(topLevelStyles);
    }

    const addValue = (k) => {
      const value = getValue(style, k, state);

      if (Array.isArray(value)) {
        computedStyles.push(...value);
      } else {
        computedStyles.push(value);
      }
    }

    conditionals.filter(satisfiesState).forEach(addValue);
    propConditionals.filter(satisfiesProps).forEach(addValue);

    pseudoElements.map(splitPseudoElementString)
    .filter(([k, propString]) => {
      return satisfiesState(propString);
    }).forEach(([k, _, pseudoElementName]) => {
      computedStyles.push({[pseudoElementName]: getValue(style, k, state)});
    });

    return computedStyles;
  }, []);
}