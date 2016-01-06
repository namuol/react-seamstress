export default function getInvalidSubComponents ({subComponents, subComponentTypes}) {
  if (!subComponentTypes || !subComponents) {
    return;
  }

  const invalids = Object.keys(subComponents.reduce((invalids, subComponentName) => {
    if (!Object.prototype.hasOwnProperty.call(subComponentTypes, subComponentName)) {
      invalids[subComponentName] = true;
    }
    return invalids;
  }, {}));

  if (invalids.length === 0) {
    return;
  }

  return invalids;
}