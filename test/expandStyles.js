import expandStyles from '../src/expandStyles';
import runTests from './runTests';

runTests({
  func: expandStyles,
  tests: [
    {
      capability: 'retain simple one-element array when no comma-separated styles exist',
      input: {
        '[whatever]': { color: 'red' },
      },
      expected: [{
        '[whatever]': { color: 'red' },
      }],
    },
    {
      capability: 'split into new objects when encountering commas',
      input: {
        '[whatever],[whatever2]': { color: 'red' },
      },
      expected: [
        {
          '[whatever]': { color: 'red' },
        },
        {
          '[whatever2]': { color: 'red' },
        },
      ],
    },
    {
      capability: 'maintains order with a complex set',
      input: {
        '[aaa],[bbb]': '111',
        '[ccc]': '222',
        '[ddd]': '333',
        '[eee],[fff],[ggg]': '444',
        '[hhh]': '555',
        '[iii]': '666',
      },
      expected: [
        {'[aaa]': '111'},
        {'[bbb]': '111'},
        {'[ccc]': '222', '[ddd]': '333'},
        {'[eee]': '444'},
        {'[fff]': '444'},
        {'[ggg]': '444'},
        {'[hhh]': '555', '[iii]': '666'},
      ],
    },
  ],
});
