function _mergeStyles (styles, depth=0) {
  const classNames = {};
  let classNameCount = 0;

  const style = styles.reduce((result, style) => {
    const typeofStyle = typeof style;
    if (typeofStyle !== 'object') {
      if (depth === 0 && typeofStyle === 'string') {
        style.split(/\s+/).forEach((className) => {
          classNames[className] = classNameCount;
          classNameCount += 1;
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
    return style;
  }

  return {
    className: Object.keys(classNames).join(' '),
    style,
  };
};


export default function mergeStyles (styles) {
  return _mergeStyles(styles);
}