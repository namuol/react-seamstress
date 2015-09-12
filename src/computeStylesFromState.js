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

    let hasTopLevelStyles = false;
    const topLevelStyles = topLevel.reduce((result, k) => {
      let value = style[k];

      if (typeof value === 'function') {
        value = value(state);
      }

      hasTopLevelStyles = true;
      
      result[k] = value;
      return result;
    }, {});

    if (hasTopLevelStyles) {
      computedStyles.push(topLevelStyles);
    }

    conditionals.filter(satisfiesState).forEach((k) => {
      let value = style[k];

      if (typeof value === 'function') {
        value = value(state);
      }

      if (Array.isArray(value)) {
        computedStyles.push(...value);
      } else {
        computedStyles.push(value);
      }
    });

    pseudoElements.map(k => [k, getPropString(k)]).filter(([k,propString]) => {return satisfiesState(propString)}).forEach(([k]) => {
      let value = style[k];
      
      if (typeof value === 'function') {
        value = value(state);
      }

      computedStyles.push({[getPseudoElementName(k)]: value});
    });

    return computedStyles;
  }, []);
}