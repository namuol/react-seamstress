export default function styleFromState ({state, style}) {
  let defaults = {};
  
  let result = Object.keys(style).reduce((result, propName) => {
    if (!(/^:/).test(propName)) {
      defaults[propName] = style[propName];
    } else if (!!state[propName.substr(1)]) {
      result.push(style[propName]);
    }
    return result;
  }, []);

  result.unshift(defaults);
  
  return result;
}
