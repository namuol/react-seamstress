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

const RedToggler = Toggler.withStyles(RED_STYLE_CSS);
const GreenToggler = Toggler.withStyles(GREEN_STYLE_CSS);
const BlueToggler = Toggler.withStyles(BLUE_STYLE_CSS);

export default class App extends Component {
  render () {
    return (
      <div>
        {/*
          Note: This is not the recommended way to include CSS styles from a component
          in your project; I'm just using this for the simplcity of this demo.
        */}
        <Toggler.StyleElement />

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
            {`
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
          <h2>Overriding with <code>Toggler.withStyles</code>:</h2>
          <RedToggler />
          <GreenToggler defaultToggled={true} />
          <BlueToggler />
        </section>
      </div>
    );
  }
}
