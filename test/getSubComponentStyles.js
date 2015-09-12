import getSubComponentStyles from '../src/getSubComponentStyles';
import runTests from './runTests';

runTests({
  func: getSubComponentStyles,
  tests: [
    {
      capability: 'return {__root: []} for empty input',
      input: {},
      expected: {
      },
    },

    {
      capability: 'put all non-::sub-component styles in __root',
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
      capability: 'put ::sub-component into result["sub-component"]',
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
      capability: 'ignore nonsense',
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
      capability: 'simply append strings to __root',
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

    {
      capability: 'put :root-state::sub-component into result["sub-component"][":root-state"]',
      input: {
        styles: [
          {
            ':root-state::sub-component': {
              color: 'red',
            },
          },
        ],
      },
      expected: {
        "sub-component": [
          {
            ':root-state': {color: 'red'},
          },
        ],
      },
    },

    {
      capability: 'handle :many:state:selectors:before:the::sub-component',
      input: {
        styles: [
          {
            ':many:state:selectors:before:the::sub-component': {
              color: 'red',
            },
          },
        ],
      },
      expected: {
        "sub-component": [
          {
            ':many:state:selectors:before:the': {color: 'red'},
          },
        ],
      },
    },
  ],
});