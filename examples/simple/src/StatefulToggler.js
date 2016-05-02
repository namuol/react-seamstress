import Seamstress from 'react-seamstress';
import React, { PropTypes } from 'react';

const {
  computeStyles,
} = Seamstress.configure({
  styles: {
    '::root': 'Toggler',
    '[toggled]': 'Toggler_toggled',
    '::indicator': 'TogglerIndicator',
    '[toggled]::indicator': 'TogglerIndicator_toggled',
  },
});

export default class StatefulToggler extends React.Component {
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
    const styles = computeStyles({
      ...this.props,
      ...this.state,
    });

    return (
      <div
        {...styles.root}
        onClick={::this.toggle}
      >
        <span {...styles.indicator}>✓</span>
      </div>
    );
  }
}
