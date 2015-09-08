import HasDeclarativeStyles from '../../../src/HasDeclarativeStyles';
import React, { PropTypes, Component } from 'react';

import classes from './Toggler.css';

@HasDeclarativeStyles
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
      <div {...this.getStyles()} onClick={() => {
        this.setState({
          toggled: !this.state.toggled,
        });
      }}>
        {this.state.toggled && <span {...this.getStylesFor('indicator')}>✓</span>}
      </div>
    );
  }
}
