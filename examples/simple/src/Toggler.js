import Seamstress from 'react-seamstress';
import React, { PropTypes, Component } from 'react';

@Seamstress.createDecorator({
  styles: {
    ':base': 'Toggler',
    ':toggled': 'Toggler_toggled',
    '::indicator': 'TogglerIndicator',
  },
  subComponentTypes: {
    indicator: Seamstress.SubComponentTypes.simple,
  },
  styleStateTypes: {
    toggled: PropTypes.bool.isRequired,
  },
  getStyleState: ({props, context, state}) => {
    return {
      toggled: !!state.toggled,
    };
  },
})
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
