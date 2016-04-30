import mergeStyles from '../src/mergeStyles';
import runTests from './runTests';

function orderedMap (val) {
  if (typeof val === 'object') {
    return Object.keys(val).map((k) => [k, orderedMap(val[k])]);
  } else {
    return val;
  }
}

const tests = [
  {
    capability: 'override styles in the order they appear',
    input: [
      {color: 'red'},
      {color: 'black'},
    ],

    expected: {
      className: '',
      style: orderedMap({
        'color': 'black',
      }),
    },
  },

  {
    capability: 'override nested styles in the order they appear',
    input: [
      {':hover': {color: 'red'}},
      {':hover': {color: 'black'}},
    ],
    expected: {
      className: '',
      style: orderedMap({
        ':hover': {
          'color': 'black',
        },
      }),
    },
  },

  {
    capability: '"push" nested styles down when a sub-style is overridden',
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
            color: 'black',
          },
        },
      },

    ],

    expected: {
      className: '',
      style: orderedMap({
        ':hover': {
          'color': 'red',
        },

        '@media': {
          ':hover': {
            'color': 'black',
          },
        },
      }),
    },
  },

  {
    capability: '"push" toplevel styles down when they are overridden',
    input: [
      {color: 'red', backgroundColor: 'blue'},
      {color: 'black'},
    ],
    expected: {
      className: '',
      style: orderedMap({
        'backgroundColor': 'blue',
        'color': 'black',
      }),
    },
  },

  {
    capability: 'merge nested styles into a single object',
    input: [
      {
        '@media': {
          color: 'black',
        },
      },
      {
        '@media': {
          ':hover': {
            color: 'black',
          },
        },
      },
    ],

    expected: {
      className: '',
      style: orderedMap({
        '@media': {
          'color': 'black',
          ':hover': {
            'color': 'black',
          },
        },
      }),
    },
  },

  {
    capability: 'handle a complex example where nested styles "change" order',
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
      false,
    ],

    expected: {
      className: '',
      style: orderedMap({
        'backgroundColor': 'black',
        ':hover': {
          'backgroundColor': 'red',
        },

        '@media2': {
          'padding': '100px',
        },

        '@media1': {
          'padding': '10px',
          ':hover': {
            'backgroundColor': 'black',
          },
        },
      }),
    },
  },

  {
    capability: 'handle a single className',
    input: [
      'aaa',
    ],

    expected: {
      className: 'aaa',
      style: orderedMap({}),
    },
  },

  {
    capability: 'handle multiple classNames',
    input: [
      'aaa',
      'bbb',
      'ccc',
    ],

    expected: {
      className: 'aaa bbb ccc',
      style: orderedMap({}),
    },
  },

  {
    capability: 'ignore duplicate classNames',
    input: [
      'aaa',
      'bbb',
      'bbb',
      'ccc',
    ],

    expected: {
      className: 'aaa bbb ccc',
      style: orderedMap({}),
    },
  },

  {
    capability: 'be able to combine styles with classNames',
    input: [
      'aaa',
      'bbb',
      'ccc',
      {color: 'red'},
      {color: 'black'},
    ],

    expected: {
      className: 'aaa bbb ccc',
      style: orderedMap({
        'color': 'black',
      }),
    },
  },

  {
    capability: 'treat whitespace-delimited classNames as a list',
    input: [
      'aaa',
      'bbb   bbb  ccc',
      'ccc',
    ],

    expected: {
      className: 'aaa bbb ccc',
      style: orderedMap({}),
    },
  },
];

runTests({
  // I convert results to array-tuple to ensure the key order is correct:
  func: function orderedMapMergeStyles (styles) {
    const { style, className } = mergeStyles(styles);
    return {
      className,
      style: orderedMap(style),
    };
  },
  funcName: 'mergeStyles',
  tests,
});
