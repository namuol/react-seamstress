import { PropTypes } from 'react';

import getInvalidStyleStates from '../src/getInvalidStyleStates';
import runTests from './runTests';

runTests({
  func: getInvalidStyleStates,
  tests: [
    {
      capability: 'return undefined when there are no style or styleStateTypes are specified',
      input: {
      },
      expected: undefined,
    },

    {
      capability: 'return an array of each :style-state that wasn\'t specified on `styleStateTypes`',
      input: {
        style: {
          ':invalid': {},
        },
        styleStateTypes: {},
      },
      expected: ['invalid'],
    },

    {
      capability: 'not include any :style-state items that are specified on `styleStateTypes`',
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
      capability: 'correctly handle a mixture of valid and invalid :style-state items',
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
      capability: 'not include "toplevel" style items',
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
      capability: 'include :composed:selectors in its tests',
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
      capability: 'consider non-boolean props as invalid',
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
      capability: 'consider bool.isRequired props as valid',
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

    {
      capability: 'consider all [props] valid',
      input: {
        style: {
          '[valid]': {},
        },
      },
      expected: undefined,
    },
  ],
});
