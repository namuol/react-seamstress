import tape from 'tape';
import Seamstress, {
  SubComponentTypes,
} from '../src/index.js';

import { PropTypes } from 'react';

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
  t.equal(typeof result.computeStyles, 'function', 'returned object includes `computeStyles` function');
  t.equal(typeof result.stylesPropType, 'function', 'returned object includes `stylesPropType` function');
  t.end();
});

tape.test('Seamstress.configure(...).stylesPropType(...)', (t) => {
  const { stylesPropType } = Seamstress.configure({
    subComponentTypes: {
      simpleSubComponent: SubComponentTypes.simple,
      compositeSubComponent: SubComponentTypes.composite,
    },
    propTypes: {
      someBool: PropTypes.bool,
      someNumber: PropTypes.number,
      someString: PropTypes.string,
    },
  });

  t.equal(stylesPropType({}, 'styles', 'TestComponent'), undefined, 'returns nothing when valid styles are supplied');

  let result = stylesPropType({
    styles: {
      '::invalidSubComponent': 'whatever',
    },
  }, 'styles', 'TestComponent');
  t.assert(result instanceof Error, 'returns an Error when an unspecified subcomponent style is provided');

  result = stylesPropType({
    styles: {
      '::simpleSubComponent': 'whatever',
      '::compositeSubComponent': 'whatever',
    },
  }, 'styles', 'TestComponent');
  t.equal(result, undefined, 'returns undefined when valid subcomponent styles are provided');

  result = stylesPropType({
    styles: {
      '[someBool=true]': 'whatever',
      '[someNumber=42]': 'whatever',
      '[someString="bacon"]': 'whatever',
    },
  }, 'styles', 'TestComponent');
  t.equal(result, undefined, 'returns undefined when valid [prop] comparisons are made');

  result = stylesPropType({
    styles: {
      '[someBool="true"]': 'whatever',
    },
  }, 'styles', 'TestComponent');
  t.assert(result instanceof Error, 'returns an error when [bool="string"] comparisons are made');

  result = stylesPropType({
    styles: {
      '[someNumber="42"]': 'whatever',
    },
  }, 'styles', 'TestComponent');
  t.assert(result instanceof Error, 'returns an error when [number="string"] comparisons are made');

  result = stylesPropType({
    styles: {
      '[someString=bacon]': 'whatever',
    },
  }, 'styles', 'TestComponent');
  t.assert(result instanceof Error, 'returns an error when [string=unquoted-string] comparisons are made');

  result = stylesPropType({
    styles: {
      '[someString=="bacon"]': 'whatever',
    },
  }, 'styles', 'TestComponent');
  t.assert(result instanceof Error, 'returns an error when using double-equals');

  result = stylesPropType({
    styles: {
      ':simpleSubComponent': 'whatever',
    },
  }, 'styles', 'TestComponent');
  t.assert(result instanceof Error, 'returns an error when using single semicolon syntax');

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
