import { PropTypes } from 'react';

import getInvalidStyleStates from '../src/getInvalidStyleStates';
import runTests from './runTests';

runTests({
  func: getInvalidStyleStates,
  tests: [
    {
      capability: 'should return undefined when there are no style or styleStateTypes are specified',
      input: {
      },
      expected: undefined,
    },

    {
      capability: 'should return an array of each :style-state that wasn\'t specified on `styleStateTypes`',
      input: {
        style: {
          ':invalid': {},
        },
        styleStateTypes: {},
      },
      expected: ['invalid'],
    },

    {
      capability: 'should not include any :style-state items that are specified on `styleStateTypes`',
      input: {
        style: {
          ':valid': {},
        },
        styleStateTypes: {
          valid: PropTypes.bool,
        },
      },
      expected: undefined,
    },

    {
      capability: 'should correctly handle a mixture of valid and invalid :style-state items',
      input: {
        style: {
          ':valid': {},
          ':invalid': {},
        },
        styleStateTypes: {
          valid: PropTypes.bool,
        },
      },
      expected: ['invalid'],
    },

    {
      capability: 'should not include "toplevel" style items',
      input: {
        style: {
          ':valid': {},
          ':invalid': {},
          'color': 'red',
        },
        styleStateTypes: {
          valid: PropTypes.bool,
        },
      },
      expected: ['invalid'],
    },

    {
      capability: 'should include :composed:selectors in its tests',
      input: {
        style: {
          ':valid': {},
          ':invalid': {},
          ':valid:invalid': {},
          ':invalid:valid': {},
        },
        styleStateTypes: {
          valid: PropTypes.bool,
        },
      },
      expected: ['invalid'],
    },

    {
      capability: 'should consider non-boolean props as invalid',
      input: {
        style: {
          ':invalid': {},
        },
        styleStateTypes: {
          invalid: PropTypes.number,
        },
      },
      expected: ['invalid'],
    },

    {
      capability: 'should consider bool.isRequired props as valid',
      input: {
        style: {
          ':valid': {},
        },
        styleStateTypes: {
          valid: PropTypes.bool.isRequired,
        },
      },
      expected: undefined,
    },
  ],
});