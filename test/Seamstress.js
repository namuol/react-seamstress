import tape from 'tape';
import Seamstress, {
  SubComponentTypes,
} from '../src/index.js';

tape.test('SubComponentTypes', (t) => {
  t.equal(typeof SubComponentTypes, 'object', 'has a named "SubComponentTypes" export object');

  t.assert(!!SubComponentTypes.simple, 'contains "simple" property');
  t.assert(!!SubComponentTypes.composite, 'contains "composite" property');
  t.end();
});

tape.test('Seamstress.configure(...)', (t) => {
  t.equal(typeof Seamstress.configure, 'function', 'exists and is a function');
  const result = Seamstress.configure();
  t.equal(typeof result, 'object', 'returns an object');
  t.equal(typeof result.computeStyles, 'function', 'returns `computeStyles` function property');
  t.end();
});

import runTests from './runTests';

const {
  computeStyles,
} = Seamstress.configure({
  styles: [
    {
      color: 'red',
    },
    'aaa',
  ],
});

runTests({
  func: computeStyles,
  funcName: 'Seamstress.configure(...).computeStyles(...)',
  tests: [
    {
      capability: 'in absense of arguments, returns processed styles ',
      input: undefined,
      expected: {
        root: {
          style: {
            color: 'red',
          },
          className: 'aaa',
        },
      },
    },

    {
      capability: 'overrides defaults with unconditional styles',
      input: {
        styles: {
          color: 'black',
        },
      },
      expected: {
        root: {
          style: {
            color: 'black',
          },
          className: 'aaa',
        },
      },
    },

    {
      capability: 'overrides defaults with conditionally-true styles',
      input: {
        test: true,
        styles: {
          '[test]': {
            color: 'black',
          },
        },
      },
      expected: {
        root: {
          style: {
            color: 'black',
          },
          className: 'aaa',
        },
      },
    },

    {
      capability: 'doesn\'t override defaults with conditionally-false styles',
      input: {
        test: false,
        styles: {
          '[test]': {
            color: 'black',
          },
        },
      },
      expected: {
        root: {
          style: {
            color: 'red',
          },
          className: 'aaa',
        },
      },
    },

    {
      capability: 'overrides defaults with conditionally-true compound styles',
      input: {
        test: true,
        test2: true,
        styles: {
          '[test][test2]': {
            color: 'black',
          },
        },
      },
      expected: {
        root: {
          style: {
            color: 'black',
          },
          className: 'aaa',
        },
      },
    },

    {
      capability: 'doesn\'t override default conditionally-false compound styles',
      input: {
        test: true,
        test2: false,
        styles: {
          '[test][test2]': {
            color: 'black',
          },
        },
      },
      expected: {
        root: {
          style: {
            color: 'red',
          },
          className: 'aaa',
        },
      },
    },

    {
      capability: 'correctly merges classNames',
      input: {
        styles: 'bbb',
      },
      expected: {
        root: {
          style: {
            color: 'red',
          },
          className: 'aaa bbb',
        },
      },
    },

    {
      capability: 'correctly handles truthy values',
      input: {
        test: true,
        test2: 0,
        test3: 1,
        test4: 42,
        test5: 'hello',
        test6: [],
        test7: {},
        styles: {
          '[test]': 'bbb',
          '[test2]': 'ccc',
          '[test3]': 'ddd',
          '[test4]': 'eee',
          '[test5]': 'fff',
          '[test6]': 'ggg',
          '[test7]': 'hhh',
        },
      },
      expected: {
        root: {
          style: {
            color: 'red',
          },
          className: 'aaa bbb ddd eee fff ggg hhh',
        },
      },
    },

    {
      capability: 'correctly handles [prop=<value>]',
      input: {
        test: true,
        test2: 0,
        test3: 1,
        test4: 42,
        test5: 'hello',
        test6: false,
        styles: {
          '[test=true]': 'bbb',
          '[test2=0]': 'ccc',
          '[test3=1]': 'ddd',
          '[test4=42]': 'eee',
          '[test5="hello"]': 'fff',
          '[test6=false]': 'ggg',

          '[test=false]': 'xxx',
          '[test="true"]': 'xxx',

          '[test2="0"]': 'xxx',
          '[test2=false]': 'xxx',

          '[test3="1"]': 'xxx',
          '[test3=true]': 'xxx',

          '[test4="42"]': 'xxx',
          '[test4=true]': 'xxx',

          '[test5=true]': 'xxx',

          '[test6=true]': 'xxx',
          '[test6="false"]': 'xxx',
          '[test6=0]': 'xxx',
          '[test6=""]': 'xxx',
        },
      },
      expected: {
        root: {
          style: {
            color: 'red',
          },
          className: 'aaa bbb ccc ddd eee fff ggg',
        },
      },
    },

    {
      capability: 'correctly merges conditional classNames',
      input: {
        test: true,
        test2: false,
        test3: 42,
        styles: {
          '[test]': 'bbb',
          '[test2]': 'ccc',
          '[test3]': 'ddd',
          '[test3=42]': 'eee',
          '[test][test3]': 'fff',
          '[test][test3=42]': 'ggg',
          '[test2][test3]': 'hhh',
          '[test2=false]': 'iii',
          '[test2=false][test3=42]': 'jjj',
        },
      },
      expected: {
        root: {
          style: {
            color: 'red',
          },
          className: 'aaa bbb ddd eee fff ggg iii jjj',
        },
      },
    },
  ],
});
