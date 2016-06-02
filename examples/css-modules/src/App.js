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
            <Toggler styles={RED_STYLE_INLINE} />
            <Toggler styles={GREEN_STYLE_INLINE} defaultToggled />
            <Toggler styles={BLUE_STYLE_INLINE} />
          </div>
        </section>
      </div>
    );
  }
}
