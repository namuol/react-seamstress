import getAllMatches from './getAllMatches';

const propRegex = /\[\s*(\w+)\s*(\s*=\s*([^\]]+)\s*)?\s*\]/g;

const validSelectorExamples = [
  '[prop]',
  '[prop=false]',
  '[prop=42]',
  '[prop="bacon"]',
  '[prop][prop2="hello"][prop3=false]',
];

const helpfulExamplesString = `Here are some examples of valid [prop] selectors:\n${validSelectorExamples.map((s) => '  ' + s).join('\n')}`;

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
        throw new SyntaxError(`Seamstress: Malformed [prop] selector: "${str}"\n\n${helpfulExamplesString}`);
      }
    }

    propValues[propName] = expectedValue;

    return propValues;
  }, {});
}
