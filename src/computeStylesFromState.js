// TODO: This could use some refactoring for clarity and performance.

export default function computeStylesFromState ({styles=[], state={}}) {
  if (!styles) {
    return [];
  }

  return styles.filter(s => !!s).reduce((result, style) => {
    const type = (typeof style);

    if (type === 'string') {
      return result.concat(style);
    }

    if (type === 'object') {
      const topLevelStyles = {};
      const baseClassNames = [];

      let hasDefaultStyles = false;
      const stylesToAdd = [];

      Object.keys(style).forEach((propName) => {
        let styleValue = style[propName];

        if (!(/^:/).test(propName)) {
          if (typeof styleValue === 'function') {
            styleValue = styleValue(state);
          }
          topLevelStyles[propName] = styleValue;
          hasDefaultStyles = true;
        } else if (propName === ':base') {
          if (typeof styleValue === 'string') {
            baseClassNames.push(styleValue);
          } else {
            Object.assign(topLevelStyles, styleValue);
            hasDefaultStyles = true;
          }
        } else {
          const propNames = propName.split(/:/).filter(n => n.length > 0);

          if (propNames.every(prop => !!state[prop])) {
            if (typeof styleValue === 'function') {
              styleValue = styleValue(state);
            }

            if (typeof styleValue === 'function') {

              // TODO: Should we maybe just print a warning instead of throw, in this case?
              // Can we actually just support nested functions? Seems like a can of worms.
              throw new Error(
                'seamstress: Nested style functions are not supported.'
              );

            } else if (typeof styleValue === 'object') {
              styleValue = Object.keys(styleValue).reduce((result, key) => {
                if (typeof styleValue[key] === 'function') {
                  result[key] = styleValue[key](state);
                } else {
                  result[key] = styleValue[key];
                }
                return result;
              }, {});
            } else if (typeof styleValue !== 'string') {
              throw new Error(
                `seamstress: Unsupported style type: \`${typeof styleValue}\`; ` +
                `supported types are: \`string\`, \`object\``
              );
            }

            stylesToAdd.push(styleValue);
          }
        }
      });

      if (hasDefaultStyles) {
        stylesToAdd.unshift(topLevelStyles)
      }

      if (baseClassNames.length > 0) {
        stylesToAdd.unshift(...baseClassNames);
      }

      return result.concat(stylesToAdd);
    }

    if (type === 'function') {
      result.push(style(state));
    }

    return result;
  }, []);
}