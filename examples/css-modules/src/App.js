import React, { Component } from 'react';
import Toggler from './Toggler';

import RedClasses from './RedToggler.css';
import GreenClasses from './GreenToggler.css';
import BlueClasses from './BlueToggler.css';

const RED_STYLE_CSS = {
  ':base': RedClasses.base,
  ':toggled': RedClasses.toggled,
};

const GREEN_STYLE_CSS = {
  ':base': GreenClasses.base,
  ':toggled': GreenClasses.toggled,
  '::indicator': GreenClasses.indicator,
};

const BLUE_STYLE_CSS = {
  ':base': BlueClasses.base,
  ':toggled': BlueClasses.toggled,
};

const RedToggler = Toggler.extendStyles(RED_STYLE_CSS);
const GreenToggler = Toggler.extendStyles(GREEN_STYLE_CSS);
const BlueToggler = Toggler.extendStyles(BLUE_STYLE_CSS);

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
          <h2>Overriding inside render with <code>props.styles</code>:</h2>
          <div>
            <Toggler styles={RED_STYLE_CSS} />
            <Toggler styles={GREEN_STYLE_CSS} defaultToggled />
            <Toggler styles={BLUE_STYLE_CSS} />
          </div>
        </section>

        <section>
          <h2>Overriding with <code>Toggler.extendStyles</code>:</h2>
          <RedToggler />
          <GreenToggler defaultToggled />
          <BlueToggler />
        </section>
      </div>
    );
  }
}
