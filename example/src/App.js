import React, { Component } from 'react';

import Toggler from './Toggler';

const RED_STYLE_INLINE = {
  border: '2px solid #c66',
  backgroundColor: '#fbb',
  ':toggled': {
    backgroundColor: '#c66',
  },
};

const GREEN_STYLE_INLINE = {
  border: '2px solid #6c6',
  backgroundColor: '#bfb',
  ':toggled': {
    backgroundColor: '#6c6',
  },
};

const BLUE_STYLE_INLINE = {
  border: '2px solid #66c',
  backgroundColor: '#bbf',
  ':toggled': {
    backgroundColor: '#66c',
  },
};


const RED_STYLE_CSS = [
  'RedToggler',
  {
    ':toggled': 'RedToggler_toggled',
  }
];

const GREEN_STYLE_CSS = [
  'GreenToggle',
  {
    ':toggled': 'GreenToggler_toggled',
  }
];

const BLUE_STYLE_CSS = [
  'BlueToggler',
  {
    ':toggled': 'BlueToggler_toggled',
  }
];

export default class App extends Component {
  render() {
    return (
      <div>
        <style>
        {`
          /* HACK: Pretend this was generated/included with Toggler */
          .Toggler {
            width: 20px;
            height: 20px;
            cursor: pointer;
            margin: 5px;
            border: 2px solid #aaa;
            background-color: #eee;
          }

          .Toggler_toggled {
            background-color: #aaa;
          }
        `}
        </style>
        <div>
          <p>Without style:</p>
          <Toggler />
          <Toggler defaultToggled={true} />
          <Toggler />
        </div>
        <div>
          <p>With inline styles:</p>
          <Toggler styles={RED_STYLE_INLINE} />
          <Toggler styles={GREEN_STYLE_INLINE} defaultToggled={true} />
          <Toggler styles={BLUE_STYLE_INLINE} />
        </div>

        <div>
          <p>With CSS:</p>
          <style>
          {`
            .RedToggler {
              border: 2px solid #c66;
              background-color: #fbb;
            }

            .RedToggler_toggled {
              background-color: #c66;
            }


            .GreenToggle {
              border: 2px solid #6c6;
              background-color: #bfb;
            }

            .GreenToggler_toggled {
              background-color: #6c6;
            }


            .BlueToggler {
              border: 2px solid #66c;
              background-color: #bbf;
            }

            .BlueToggler_toggled {
              background-color: #66c;
            }
          `}
          </style>
          <Toggler styles={RED_STYLE_CSS} />
          <Toggler styles={GREEN_STYLE_CSS} defaultToggled={true} />
          <Toggler styles={BLUE_STYLE_CSS} />
        </div>
      </div>
    );
  }
}
