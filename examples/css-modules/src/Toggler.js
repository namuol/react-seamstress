import seamstress from '../../../src/seamstress';
import React, { PropTypes, Component } from 'react';

import classes from './Toggler.css';

@seamstress
export default class Toggler extends Component {
  static styles = {
    ':base': classes.base,
    ':toggled': classes.toggled,
    '::indicator': classes.indicator,
  };
  
  static propTypes = {
    defaultToggled: PropTypes.bool,
  };

  static defaultProps = {
    defaultToggled: false,
  };

  state = (() => {
    return {
      toggled: this.props.defaultToggled,
    };
  }());

  static styleStateTypes = {
    toggled: PropTypes.bool.isRequired,
  };

  getStyleState () {
    return {
      toggled: this.state.toggled,
    };
  }

  render () {
    return (
      <div {...this.getStyleProps()} onClick={() => {
        this.setState({
          toggled: !this.state.toggled,
        });
      }}>
        {this.state.toggled && <span {...this.getStylePropsFor('indicator')}>✓</span>}
      </div>
    );
  }
}
