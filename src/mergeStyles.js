function _mergeStyles (styles, depth=0) {
  const classNames = {};

  const inlineStyles = styles.reduce((result, style) => {
    const typeofStyle = typeof style;
    if (typeofStyle !== 'object') {
      if (depth === 0 && typeofStyle === 'string') {
        style.split(/\s+/).forEach((className) => {
          classNames[className] = true;
        })
      }
      return result;
    }

    Object.keys(style).forEach((key) => {
      const val = style[key];
      
      let finalVal;
      if (typeof val === 'object' && result[key]) {
        finalVal = _mergeStyles([result[key], val], depth+1);
      } else {
        finalVal = val;
      }

      delete result[key];
      result[key] = finalVal;
    });

    return result;
  }, {});

  if (depth > 0) {
    return inlineStyles;
  }

  return {
    className: Object.keys(classNames).join(' '),
    style: inlineStyles,
  };
};


export default function mergeStyles (styles) {
  return _mergeStyles(styles);
}