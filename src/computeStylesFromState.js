import arrayify from './arrayify';

function satisfies (state) {
  return function (propString) {
    const propNames = propString.split(':').filter(p => !!p);
    return propNames.every(p => !!state[p]);
  }
}

function getPropString (fullString) {
  return fullString.substr(0, fullString.indexOf('::'));
}

function getPseudoElementName (fullString) {
  return fullString.substr(fullString.indexOf('::'));
}

function getValue (style, k, state) {
  const value = style[k];

  if (typeof value === 'function') {
    return value(state);
  }

  return value;
}

export default function computeStylesFromState ({styles, state={}}) {
  if (!styles) {
    return [];
  }

  const satisfiesState = satisfies(state);

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
      pseudoElements,
    } = Object.keys(style).reduce((keys, k) => {
      if (/::/.test(k)) {
        keys.pseudoElements.push(k);
      } else if (/^:/.test(k)) {
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
      result[k] = getValue(style, k, state);
      return result;
    }, {});

    if (topLevel.length > 0) {
      computedStyles.push(topLevelStyles);
    }

    conditionals.filter(satisfiesState).forEach((k) => {
      const value = getValue(style, k, state);

      if (Array.isArray(value)) {
        computedStyles.push(...value);
      } else {
        computedStyles.push(value);
      }
    });

    pseudoElements.map(k => [k, getPropString(k)])
    .filter(([k,propString]) => { return satisfiesState(propString) })
    .forEach(([k]) => {
      computedStyles.push({[getPseudoElementName(k)]: getValue(style, k, state)});
    });

    return computedStyles;
  }, []);
}