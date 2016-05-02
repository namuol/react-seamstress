import React, { Component } from 'react';
import StatefulToggler from './StatefulToggler';

const RED_STYLE_INLINE = {
  border: '2px solid #c66',
  backgroundColor: '#fbb',
  '[toggled]': {
    backgroundColor: '#c66',
  },
};

const GREEN_STYLE_INLINE = {
  border: '2px solid #6c6',
  backgroundColor: '#bfb',
  '[toggled]': {
    backgroundColor: '#6c6',
  },
  '::indicator': {
    color: '#272',
  },
};

const BLUE_STYLE_INLINE = {
  border: '2px solid #66c',
  backgroundColor: '#bbf',
  '[toggled]': {
    backgroundColor: '#66c',
  },
};

const RED_STYLE_CSS = {
  '::root': 'RedToggler',
  '[toggled]::root': 'RedToggler_toggled',
};

const GREEN_STYLE_CSS = {
  '::root': 'GreenToggler',
  '[toggled]::root': 'GreenToggler_toggled',
  '[toggled]::indicator': 'GreenTogglerIndicator',
};

const BLUE_STYLE_CSS = [
  // ::root classNames can also be applied by supplying a string:
  'BlueToggler',
  {
    '[toggled]': 'BlueToggler_toggled',
  },
];

export default class App extends Component {
  render () {
    return (
      <div>
        <section>
          <h2>Default styles:</h2>
          <div>
            <StatefulToggler />
            <StatefulToggler defaultToggled />
            <StatefulToggler />
          </div>
        </section>

        <section>
          <h2>Overriding inside render with <code>props.styles</code>:</h2>
          <div>
            <p>With inline styles:</p>
            <StatefulToggler styles={RED_STYLE_INLINE} />
            <StatefulToggler styles={GREEN_STYLE_INLINE} defaultToggled />
            <StatefulToggler styles={BLUE_STYLE_INLINE} />
          </div>

          <div>
            <p>With CSS:</p>
            <style>
            {`/* Let's "inject" some custom CSS: */
              .RedToggler {
                border: 2px solid #c66;
                background-color: #fbb;
              }

              .RedToggler_toggled {
                background-color: #c66;
              }

              .GreenToggler {
                border: 2px solid #6c6;
                background-color: #bfb;
              }

              .GreenTogglerIndicator {
                color: #272;
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
            <StatefulToggler styles={RED_STYLE_CSS} />
            <StatefulToggler styles={GREEN_STYLE_CSS} defaultToggled />
            <StatefulToggler styles={BLUE_STYLE_CSS} />
          </div>
        </section>
      </div>
    );
  }
}
