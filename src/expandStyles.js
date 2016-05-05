export default function expandStyles (styles) {
  return Object.keys(styles).map((k) => [k, k.split(',')]).reduce((result, [fullKey, keySet], idx, keySets) => {
    if (keySet.length === 1) {
      if (((keySets[idx - 1] || [])[1] || []).length > 1) {
        result.push({});
      }
      let lastStyle = result[result.length - 1];
      if (!lastStyle) {
        lastStyle = {};
        result.push(lastStyle);
      }
      lastStyle[fullKey] = styles[fullKey];
      return result;
    }
    result.push(...keySet.map((key) => ({
      [key]: styles[fullKey],
    })));
    return result;
  }, []);
}
