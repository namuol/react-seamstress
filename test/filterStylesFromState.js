import filterStylesFromState from '../src/filterStylesFromState';
import runTests from './runTests';

runTests({
  func: filterStylesFromState,
  tests: [
    {
      capability: 'should return an empty array when supplied null/undefined',
      input: {},
      expected: [],
    },

    {
      capability: 'should include any strings (classNames) from the input styles array',
      input: {
        styles: [
          'aaa',
        ],
      },
      expected: [
        'aaa',
      ],
    },

    {
      capability: 'should not include any objects when no state is supplied (we assume false)',
      input: {
        styles: [
          {
            ':test': {color: 'red'}
          },
        ],
      },
      expected: [
      ],
    },

    {
      capability: 'should filter out style objects whose corresponding state is false',
      input: {
        styles: [
          {
            ':test': {color: 'red'}
          },
        ],

        state: {
          test: false,
        }
      },
      expected: [
      ],
    },

    {
      capability: 'should include style objects whose corresponding state is true',
      input: {
        styles: [
          {
            ':test': {color: 'red'}
          },
        ],

        state: {
          test: true,
        }
      },
      expected: [
        {color: 'red'},
      ],
    },

    {
      capability: 'should include mutliple style objects',
      input: {
        styles: [
          {
            ':test': {color: 'black'},
          },
          {
            ':test': {color: 'red'},
          }
        ],

        state: {
          test: true,
        }
      },
      expected: [
        {color: 'black'},
        {color: 'red'},
      ],
    },

    {
      capability: 'should include mutliple style objects mixed with strings (classNames)',
      input: {
        styles: [
          {
            ':test': 'MyComponent_test',
          },
          {
            ':test': {color: 'black'},
          },
          {
            ':test': {color: 'red'},
          },
        ],

        state: {
          test: true,
        }
      },
      expected: [
        'MyComponent_test',
        {color: 'black'},
        {color: 'red'},
      ],
    },

    {
      capability: 'should maintain order of key iteration',
      input: {
        styles: [
          {
            ':test2': 'MyComponent_test2',
            ':test': 'MyComponent_test',
          },
        ],

        state: {
          test: true,
          test2: true,
        }
      },
      expected: [
        'MyComponent_test2',
        'MyComponent_test',
      ],
    },

    {
      capability: 'should maintain order of key iteration (different order)',
      input: {
        styles: [
          {
            ':test': 'MyComponent_test',
            ':test2': 'MyComponent_test2',
          },
        ],

        state: {
          test: true,
          test2: true,
        }
      },
      expected: [
        'MyComponent_test',
        'MyComponent_test2',
      ],
    },

    {
      capability: 'should "hoist" toplevel styles',
      input: {
        styles: [
          {
            color: 'black',
            ':test': {color: 'red'},
            backgroundColor: 'orange',
          },
        ],

        state: {
          test: true,
        }
      },
      expected: [
        {
          color: 'black',
          backgroundColor: 'orange',
        },
        {color: 'red'},
      ],
    },

    {
      capability: 'should "hoist" :base styles and assume :base to be true',
      input: {
        styles: [
          {
            ':test': {color: 'red'},
            ':base': {
              color: 'black',
              backgroundColor: 'orange',
            },
          },
        ],

        state: {
          test: true,
        }
      },
      expected: [
        {
          color: 'black',
          backgroundColor: 'orange',
        },
        {color: 'red'},
      ],
    },

    {
      capability: 'should straight-up *ignore* non-string, non-object values inside the array',
      input: {
        styles: [
          true,
          0,
          false,
          null,
          42,
        ],

        state: {}
      },
      expected: [],
    },

    {
      capability: 'should handle false style instead of array',
      input: {
        styles: false,
        state: {}
      },
      expected: [],
    },

    {
      capability: 'should handle null style instead of array',
      input: {
        styles: null,
        state: {}
      },
      expected: [],
    },

    {
      capability: 'should handle undefined style instead of array',
      input: {
        styles: undefined,
        state: {}
      },
      expected: [],
    },

    {
      capability: 'should handle totally unspecified style instead of array',
      input: {
      },
      expected: [],
    },
  ],
});