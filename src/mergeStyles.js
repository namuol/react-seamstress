function _mergeStyles (styles=[], depth=0) {
  const classNames = {};
  const inlineStyles = {};
  const inlineStyleKeys = [];

  styles.forEach((style) => {
    const typeofStyle = typeof style;
    if (typeofStyle !== 'object') {
      if (depth === 0 && typeofStyle === 'string') {
        style.split(/\s+/).forEach((className) => {
          classNames[className] = true;
        })
      }
      return;
    }

    Object.keys(style).forEach((key) => {
      const val = style[key];
      
      let finalVal;
      if (typeof val === 'object' && inlineStyles[key]) {
        finalVal = _mergeStyles([inlineStyles[key], val], depth+1);
      } else {
        finalVal = val;
      }

      inlineStyles[key] = finalVal;

      const idx = inlineStyleKeys.indexOf(key);
      if (idx > -1) {
        inlineStyleKeys.splice(idx, 1);
      }
      inlineStyleKeys.push(key);
    });
  });

  if (depth > 0) {
    return inlineStyles;
  }

  return {
    className: Object.keys(classNames).join(' '),
    style: inlineStyleKeys.reduce((result, key) => {
      result[key] = inlineStyles[key];
      return result;
    }, {}),
  };
}

export default function mergeStyles (styles) {
  return _mergeStyles(styles);
}