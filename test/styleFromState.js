import styleFromState from '../src/styleFromState';
import runTests from './runTests';

runTests({
  func: styleFromState,
  tests: [
    {
      capability: 'should return an array of styles',
      input: {
        state: {
        },
        style: {
          color: 'black',
        },
      },

      expected: [{
        color: 'black',
      }],
    },

    {
      capability: 'should include a state-style when the state param is true',
      input: {
        state: {
          expanded: true,
        },
        style: {
          color: 'black',
          '&:expanded': {
            color: 'red',
          }
        },
      },

      expected: [
        {color: 'black'},
        {color: 'red'},
      ],
    },

    {
      capability: 'should NOT include a state-style when the state param is false',
      input: {
        state: {
          expanded: false,
        },
        style: {
          color: 'black',
          '&:expanded': {
            color: 'red',
          }
        },
      },

      expected: [
        {color: 'black'},
      ],
    },

    {
      capability: 'should always order state-styles later than default styles',
      input: {
        state: {
          expanded: true,
        },
        style: {
          '&:expanded': {
            color: 'red',
          },
          color: 'black',
        },
      },

      expected: [
        {color: 'black'},
        {color: 'red'},
      ],
    },

    {
      capability: 'should group default styles into a single object',
      input: {
        state: {
          expanded: true,
        },
        style: {
          backgroundColor: 'whitesmoke',
          '&:expanded': {
            color: 'red',
          },
          color: 'black',
        },
      },

      expected: [
        {
          backgroundColor: 'whitesmoke',
          color: 'black',
        },
        {color: 'red'},
      ],
    },
  ],
});