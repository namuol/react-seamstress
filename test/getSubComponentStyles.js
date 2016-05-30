import getSubComponentStyles from '../src/getSubComponentStyles';
import runTests from './runTests';

runTests({
  func: getSubComponentStyles,
  tests: [
    {
      capability: 'return {root: []} for empty input',
      input: {},
      expected: {
        root: [],
      },
    },

    {
      capability: 'put all non-::sub-component styles in `root`',
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
        root: [
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
        root: [],
        'sub-component': [
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
          undefined,
        ],
      },
      expected: {
        root: [],
      },
    },

    {
      capability: 'simply append strings to `root`',
      input: {
        styles: [
          'test',
        ],
      },
      expected: {
        root: [
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
        root: [],
        'sub-component': [
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
        root: [],
        'sub-component': [
          {
            ':many:state:selectors:before:the': {color: 'red'},
          },
        ],
      },
    },

    {
      capability: 'handle [propSelectorsBeforeThe]::sub-component',
      input: {
        styles: [
          {
            '[prop]::sub-component': {
              color: 'red',
            },
          },
        ],
      },
      expected: {
        root: [],
        'sub-component': [
          {
            '[prop]': {color: 'red'},
          },
        ],
      },
    },
  ],
});
