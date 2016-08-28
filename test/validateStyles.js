import {
  isSelectorValid,
  validSelectorExamples,
} from '../src/validateStyles';

import runTests from './runTests';

const test = (str, valid) => ({
  capability: `${str} ${valid ? '👍' : '👎'}`,
  input: str,
  expected: valid,
});

runTests({
  func: isSelectorValid,
  tests: [
    ...validSelectorExamples.map((s) => test(s, true)),
    test('::test', true),
    test('::test,::test2', true),
    test('::test-test', true),
    test('[test]', true),
    test('[test="Hi! This string,= has strange=__, [punctuation]"]', true),
    test('[test][test2]', true),
    test('[test]::test', true),
    test('[test]::test-test', true),
    test('[test],[test2]', true),
    test('[test] , [test2]', true),
    test('[test],[test2]::test', true),
    test('color', true),
    test('backgroundImage', true),
    test('WebkitTransition', true),
    test('::', false),
    test('[', false),
    test('][]', false),
    test('[]', false),
    test(':bad', false),
    test('::good::bad', false),
    test('::good,:bad', false),
    test('[::bad]', false),
    test('::bad=42', false),
    test('[test=\'I love single-quotes.\']', false),
  ],
});
