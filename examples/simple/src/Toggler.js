import Seamstress from 'react-seamstress';
import React, { PropTypes } from 'react';

const seamstressConfig = {
  styles: {
    ':base': 'Toggler',
    ':toggled': 'Toggler_toggled',
    '::indicator': 'TogglerIndicator',
  },

  styleStateTypes: {
    toggled: PropTypes.bool.isRequired,
  },

  getStyleState: ({props, state, context}) => {
    return {
      toggled: !!state.toggled,
    };
  },
};

@Seamstress.createDecorator(seamstressConfig)
export default class Toggler extends React.Component {
  static propTypes = {
    defaultToggled: PropTypes.bool,
  };

  static defaultProps = {
    defaultToggled: false,
  };

  state = {
    toggled: this.props.defaultToggled,
  };

  toggle () {
    this.setState({ toggled: !this.state.toggled });
  }

  render () {
    const computedStyles = this.getComputedStyles();

    return <div {...computedStyles.root} onClick={::this.toggle}>
      {this.state.toggled &&
        <span {...computedStyles.indicator}>✓</span>
      }
    </div>;
  }
}
