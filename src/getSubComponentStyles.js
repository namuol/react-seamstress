export default function getSubComponentStyles ({styles = []}) {
  return styles.reduce((result, style) => {
    if (!style) {
      return result;
    }

    if (typeof style === 'string') {
      result.root.push(style);
      return result;
    }

    const sorted = Object.keys(style).reduce((subResult, propName) => {
      let subComponentName;
      if ((/::/).test(propName)) {
        let value = style[propName];
        if ((/^::/).test(propName)) {
          subComponentName = propName.substr(2);
        } else {
          const subComponentIndicatorIdx = propName.indexOf('::');
          const selector = propName.substr(0, subComponentIndicatorIdx);
          subComponentName = propName.substr(subComponentIndicatorIdx + 2);
          value = {
            [selector]: value,
          };
        }

        if (!subResult[subComponentName]) {
          subResult[subComponentName] = {};
        }

        subResult[subComponentName] = value;
      } else {
        if (!subResult.root) {
          subResult.root = {};
        }
        subResult.root[propName] = style[propName];
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
  }, {root: []});
}
