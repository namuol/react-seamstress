import Seamstress from 'react-seamstress';
import React, { PropTypes, Component } from 'react';

import classes from './Toggler.css';

const seamstressConfig = {
  styles: {
    ':base': classes.base,
    ':toggled': classes.toggled,
    '::indicator': classes.indicator,
  },

  styleStateTypes: {
    toggled: PropTypes.bool.isRequired,
  },

  getStyleState: ({props, state, context}) => {
    return {
      toggled: state.toggled,
    };
  },
};

@Seamstress.decorate(seamstressConfig)
export default class Toggler extends Component {
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

  render () {
    const computedStyles = this.getComputedStyles();

    return (
      <div {...mergeStyles(computedStyles.root)} onClick={() => {
        this.setState({
          toggled: !this.state.toggled,
        });
      }}>
        {this.state.toggled && <span {...mergeStyles(computedStyles.indicator)}>✓</span>}
      </div>
    );
  }
}
