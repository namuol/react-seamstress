import React, { Component } from 'react';
import Toggler from './Toggler';

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
  '[toggled]': 'RedToggler_toggled',
};

const GREEN_STYLE_CSS = {
  '::root': 'GreenToggler',
  '[toggled]': 'GreenToggler_toggled',
  '::indicator': 'GreenTogglerIndicator',
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
            <Toggler />
            <Toggler defaultToggled />
            <Toggler />
          </div>
        </section>

        <section>
          <h2>Overriding with <code>props.styles</code>:</h2>
          <div>
            <p>With inline styles:</p>
            <p>(Unfortunately, it is <a href='https://github.com/Khan/aphrodite/issues/25'>impossible</a> to skin Aphrodite-styled components with inline styles)</p>
            <Toggler styles={RED_STYLE_INLINE} />
            <Toggler styles={GREEN_STYLE_INLINE} defaultToggled />
            <Toggler styles={BLUE_STYLE_INLINE} />
          </div>

          <div>
            <p>With CSS:</p>
            <p>You can skin Aphrodite components with CSS, but you must set all CSS properties to be <a href='https://github.com/Khan/aphrodite/issues/25'><code>!important</code></a>:</p>
            <style>
            {`/* Let's "inject" some custom CSS: */
              .RedToggler {
                border: 2px solid #c66 !important;
                background-color: #fbb !important;
              }

              .RedToggler_toggled {
                background-color: #c66 !important;
              }

              .GreenToggler {
                border: 2px solid #6c6 !important;
                background-color: #bfb !important;
              }

              .GreenTogglerIndicator {
                color: #272 !important;
              }

              .GreenToggler_toggled {
                background-color: #6c6 !important;
              }

              .BlueToggler {
                border: 2px solid #66c !important;
                background-color: #bbf !important;
              }

              .BlueToggler_toggled {
                background-color: #66c !important;
              }
            `}
            </style>
            <Toggler styles={RED_STYLE_CSS} />
            <Toggler styles={GREEN_STYLE_CSS} defaultToggled />
            <Toggler styles={BLUE_STYLE_CSS} />
          </div>
        </section>
      </div>
    );
  }
}
