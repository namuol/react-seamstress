export default function getInvalidStyleStates ({style={}, styleStateTypes={}}) {
  const invalids = Object.keys(style).filter(k => (/^:[^:]/).test(k)).reduce((invalids, propName) => {
    const styleStateName = propName.substr(1);
    if (!styleStateTypes.hasOwnProperty(styleStateName)) {
      invalids.push(styleStateName);
    }
    return invalids;
  }, []);

  if (invalids.length === 0) {
    return;
  }

  return invalids;
}