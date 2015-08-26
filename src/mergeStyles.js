export default function mergeStyles (styles) {
  return styles.reduce((result, style) => {
    if (!style) {
      return result;
    }

    Object.keys(style).forEach((key) => {
      const val = style[key];
      
      let finalVal;
      if (typeof val === 'object' && result[key]) {
        finalVal = mergeStyles([result[key], val]);
      } else {
        finalVal = val;
      }

      delete result[key];
      result[key] = finalVal;
    });

    return result;
  }, {});
};
