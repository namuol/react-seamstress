import React, { Component } from 'react';
import Toggler from './Toggler';
import StatelessToggler from './StatelessToggler';

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
  '::indicator': {
    color: '#272',
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
  'GreenToggler',
  {
    ':toggled': 'GreenToggler_toggled',
    ':toggled::indicator': 'GreenTogglerIndicator',
  }
];

const BLUE_STYLE_CSS = [
  'BlueToggler',
  {
    ':toggled': 'BlueToggler_toggled',
  }
];

// StatelessToggler can simply use [prop] selectors, a la vanilla CSS's [attr] selectors:

const RED_STYLE_INLINE_STATELESS = {
  border: '2px solid #c66',
  backgroundColor: '#fbb',
  '[toggled]': {
    backgroundColor: '#c66',
  },
};

const GREEN_STYLE_CSS_STATELESS = [
  'GreenToggler',
  {
    '[toggled]': 'GreenToggler_toggled',
    '[toggled]::indicator': 'GreenTogglerIndicator',
  }
];

const BLUE_STYLE_CSS_STATELESS = [
  'BlueToggler',
  {
    '[toggled]': 'BlueToggler_toggled',
  }
];

const RedToggler = Toggler.extendStyles(RED_STYLE_CSS);
const GreenToggler = Toggler.extendStyles(GREEN_STYLE_CSS);
const BlueToggler = Toggler.extendStyles(BLUE_STYLE_CSS);

const BlueStatelessToggler = StatelessToggler.extendStyles(BLUE_STYLE_CSS_STATELESS);

export default class App extends Component {
  render () {
    return (
      <div>
        <section>
          <h2>Default styles:</h2>
          <div>
            <Toggler />
            <Toggler defaultToggled={true} />
            <Toggler />
          </div>
        </section>

        <section>
          <h2>Overriding inside render with <code>props.styles</code>:</h2>
          <div>
            <p>With inline styles:</p>
            <Toggler styles={RED_STYLE_INLINE} />
            <Toggler styles={GREEN_STYLE_INLINE} defaultToggled={true} />
            <Toggler styles={BLUE_STYLE_INLINE} />
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
            <Toggler styles={RED_STYLE_CSS} />
            <Toggler styles={GREEN_STYLE_CSS} defaultToggled={true} />
            <Toggler styles={BLUE_STYLE_CSS} />
          </div>
        </section>

        <section>
          <h2>Overriding with <code>Toggler.extendStyles</code>:</h2>
          <RedToggler />
          <GreenToggler defaultToggled={true} />
          <BlueToggler />
        </section>

        <section>
          <h2>It also works with stateless components:</h2>
          <StatelessToggler styles={RED_STYLE_INLINE_STATELESS} toggled={true} />
          <StatelessToggler styles={GREEN_STYLE_CSS_STATELESS} toggled={true} />
          <BlueStatelessToggler toggled={true} />
        </section>
      </div>
    );
  }
}
