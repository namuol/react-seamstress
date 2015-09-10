function isBool (propTypeFunction) {
  // HACKish:
  return !propTypeFunction({a:true}, 'a');
}

export default function getInvalidStyleStates ({style={}, styleStateTypes={}}) {
  const invalidSet = Object.keys(style)
    .filter(k => (/^:[^:]/).test(k))
    .reduce((invalids, propName) => {
      const styleStateNames = propName.split(/:/)
                                      .filter(n => n.length > 0);

      styleStateNames.forEach((styleStateName) => {
        if (!styleStateTypes.hasOwnProperty(styleStateName) || !isBool(styleStateTypes[styleStateName])) {
          invalids[styleStateName] = true;
        }
      });

      return invalids;
    }, {});

  const invalids = Object.keys(invalidSet);

  if (invalids.length === 0) {
    return;
  }

  return invalids;
}