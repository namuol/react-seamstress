import mergeStyles from '../src/mergeStyles';
import runTests from './runTests';

function arrayify (val) {
  if (typeof val === 'object') {
    return Object.keys(val).map(k => [k, arrayify(val[k])]);
  } else {
    return val;
  }
}

const tests = [
  {
    capability: 'should override styles in the order they appear',
    input: [
      {color:'red'},
      {color:'black'},
    ],
    expected: [
      ['color', 'black'],
    ],
  },

  {
    capability: 'should override nested styles in the order they appear',
    input: [
      {':hover': {color:'red'}},
      {':hover': {color:'black'}},
    ],
    expected: [
      [':hover', [
        ['color', 'black'],
      ]],
    ],
  },

  {
    capability: 'should "push" nested styles down when a sub-style is overridden',
    input: [
      {
        '@media': {},
      },

      {
        ':hover': {
          color: 'red',
        },
        '@media': {
          ':hover': {
            color: 'black'
          },
        },
      },
      
    ],

    expected: [
      [':hover', [
        ['color', 'red'],
      ]],

      ['@media', [
        [':hover', [
          ['color', 'black'],
        ]],
      ]],
    ],
  },

  {
    capability: 'should "push" toplevel styles down when they are overridden',
    input: [
      {color:'red', backgroundColor: 'blue'},
      {color:'black'},
    ],
    expected: [
      ['backgroundColor', 'blue'],
      ['color', 'black'],
    ],
  },

  {
    capability: 'should merge nested styles into a single object',
    input: [
      {
        '@media': {
          color: 'black',
        }
      },
      {
        '@media': {
          ':hover': {
            color: 'black',
          },
        },
      },
    ],
    expected: [
      ['@media', [
        ['color', 'black'],
        [':hover', [
          ['color', 'black'],
        ]],
      ]],
    ],
  },

  {
    capability: 'should handle a complex example where nested styles "change" order',
    input: [
      {
        '@media1': {
          padding: '10px',
        },
        '@media2': {
          padding: '20px',
        },
      },
      {
        backgroundColor: 'black',
        ':hover': {
          backgroundColor: 'red',
        },
        '@media2': {
          padding: '100px',
        },
        '@media1': {
          ':hover': {
            backgroundColor: 'black',
          },
        },
      },
      false
    ],

    expected: [
      ['backgroundColor', 'black'],
      [':hover', [
        ['backgroundColor', 'red'],
      ]],

      ['@media2', [
        ['padding', '100px'],
      ]],

      ['@media1', [
        ['padding', '10px'],
        [':hover', [
          ['backgroundColor', 'black'],
        ]],
      ]],
    ],
  }
];

runTests({
  // I convert results to array-tuple to ensure the key order is correct:
  func: function _arrayifyMergeStyles (styles) {
    return arrayify(mergeStyles(styles));
  },
  funcName: 'mergeStyles',
  tests,
});
