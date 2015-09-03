export default function filterStylesFromState ({styles=[], state={}}) {
  if (!styles) {
    return [];
  }

  return styles.filter(s => !!s).reduce((result, style) => {
    const type = (typeof style);

    if (type === 'string') {
      return result.concat(style);
    }

    if (type === 'object') {
      const defaultStyles = {};
      let hasDefaultStyles = false;
      const stylesToAdd = [];

      Object.keys(style).forEach((propName) => {
        if (!(/^:/).test(propName)) {
          defaultStyles[propName] = style[propName];
          hasDefaultStyles = true;
        } else if (!!state[propName.substr(1)]) {
          stylesToAdd.push(style[propName]);
        }
      });

      if (hasDefaultStyles) {
        stylesToAdd.unshift(defaultStyles)
      }

      return result.concat(stylesToAdd);
    }

    return result;
  }, []);
}