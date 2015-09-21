import { PropTypes } from 'react';

import getInvalidSubComponents from '../src/getInvalidSubComponents';
import runTests from './runTests';

runTests({
  func: getInvalidSubComponents,
  tests: [
    {
      capability: 'return undefined when there are no style or subComponentTypes are specified',
      input: {
      },
      expected: undefined,
    },

    {
      capability: 'return undefined when no subComponentTypes are specified',
      input: {
        subComponents: ['invalid'],
      },
      expected: undefined,
    },

    {
      capability: 'considers a subComponents invalid when subComponentTypes does not include its name as a key',
      input: {
        subComponents: ['invalid'],
        subComponentTypes: {
        },
      },
      expected: ['invalid'],
    },

    {
      capability: 'returns undefined when all subComponents specified exist as keys of subComponentTypes',
      input: {
        subComponents: ['valid'],
        subComponentTypes: {
          valid: true,
        },
      },
      expected: undefined,
    },

    {
      capability: '',
      input: {
        subComponents: ['invalid', 'also-invalid'],
        subComponentTypes: {
          valid: true,
        },
      },
      expected: ['invalid', 'also-invalid'],
    },
  ],
});