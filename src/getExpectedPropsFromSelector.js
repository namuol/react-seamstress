import getAllMatches from './getAllMatches';

const propRegex = /\[\s*(\w+)\s*(\s*=\s*([^\]]+)\s*)?\s*\]/g;

export default function getExpectedPropsFromSelector (str) {
  return getAllMatches(propRegex, str).filter(([, propName]) => {
    return !!propName;
  }).reduce((propValues, matches) => {
    const [ , propName, , unparsedValue ] = matches;
    
    let expectedValue;

    if (unparsedValue === undefined) {
      expectedValue = undefined;
    } else {
      try {
        expectedValue = JSON.parse(unparsedValue);
      } catch (e) {
        throw new SyntaxError(`Seamstress: Malformed [prop] selector: "${str}"; did you forget to quote a string?`);
      }
    }

    propValues[propName] = expectedValue;

    return propValues
  }, {});
}