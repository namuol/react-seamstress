import getSubComponentStyles from '../src/getSubComponentStyles';
import runTests from './runTests';

runTests({
  func: getSubComponentStyles,
  tests: [
    {
      capability: 'should return {__root: []} for empty input',
      input: {},
      expected: {
      },
    },

    {
      capability: 'should put all non-::sub-component styles in __root',
      input: {
        styles: [
          {
            color: 'red',
            ':expanded': {
              color: 'green',
            },
          },
        ],
      },
      expected: {
        __root: [
          {
            color: 'red',
            ':expanded': {
              color: 'green',
            },
          },
        ],
      },
    },

    {
      capability: 'should put ::sub-component into result["sub-component"]',
      input: {
        styles: [
          {
            '::sub-component': {
              color: 'red',
            },
          },
        ],
      },
      expected: {
        "sub-component": [
          {
            color: 'red',
          },
        ],
      },
    },

    {
      capability: 'should ignore nonsense',
      input: {
        styles: [
          false,
          null,
          24,
          undefined,
        ],
      },
      expected: {
      },
    },

    {
      capability: 'should simply append strings to __root',
      input: {
        styles: [
          'test',
        ],
      },
      expected: {
        __root: [
          'test',
        ],
      },
    },
  ],
});