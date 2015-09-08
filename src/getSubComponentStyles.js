export default function getSubComponentStyles ({styles=[]}) {

  return styles.reduce((result, style) => {
    if (!style) {
      return result;
    }

    if (typeof style === 'string') {
      if (!result.__root) {
        result.__root = [];
      }
      result.__root.push(style);
      return result;
    }

    const sorted = Object.keys(style).reduce((subResult, propName) => {
      let subComponentName;
      if ((/^::/).test(propName)) {
        subComponentName = propName.substr(2);
        if (!subResult[subComponentName]) {
          subResult[subComponentName] = {};
        }

        subResult[subComponentName] = style[propName];
      } else {
        if (!subResult.__root) {
          subResult.__root = {};
        }
        subResult.__root[propName] = style[propName];
      }

      return subResult;
    }, {});

    Object.keys(sorted).forEach((subComponentName) => {
      if (!result[subComponentName]) {
        result[subComponentName] = [];
      }
      result[subComponentName].push(sorted[subComponentName]);
    });

    return result;
  }, {});
}