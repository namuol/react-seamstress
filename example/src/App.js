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
  'RedToggle',
  {
    ':toggled': 'RedToggle_toggled',
  }
];

const GREEN_STYLE_CSS = [
  'GreenToggle',
  {
    ':toggled': 'GreenToggle_toggled',
  }
];

const BLUE_STYLE_CSS = [
  'BlueToggle',
  {
    ':toggled': 'BlueToggle_toggled',
  }
];

export default class App extends Component {
  render() {
    return (
      <div>
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
          <style>{`
            /* HACK: We need to use !important since Toggler uses inline styles :( */

            .RedToggle {
              border: 2px solid #c66!important;
              background-color: #fbb!important;
            }

            .RedToggle_toggled {
              background-color: #c66!important;
            }


            .GreenToggle {
              border: 2px solid #6c6!important;
              background-color: #bfb!important;
            }

            .GreenToggle_toggled {
              background-color: #6c6!important;
            }


            .BlueToggle {
              border: 2px solid #66c!important;
              background-color: #bbf!important;
            }

            .BlueToggle_toggled {
              background-color: #66c!important;
            }
          `}</style>
          <Toggler styles={RED_STYLE_CSS} />
          <Toggler styles={GREEN_STYLE_CSS} defaultToggled={true} />
          <Toggler styles={BLUE_STYLE_CSS} />
        </div>
      </div>
    );
  }
}
