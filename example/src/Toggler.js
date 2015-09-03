import HasDeclarativeStyles from '../../src/HasDeclarativeStyles';
import React, { PropTypes, Component } from 'react';

const BASE_STYLE = {
  backgroundColor: '#eee',
  border: '2px solid #aaa',
  width: '20px',
  height: '20px',
  cursor: 'pointer',
  margin: '5px',
  ':toggled': {
    backgroundColor: '#aaa',
  },
};

@HasDeclarativeStyles
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
      <div {...this.getStyleProps(BASE_STYLE)} onClick={() => {
        this.setState({
          toggled: !this.state.toggled,
        });
      }} />
    );
  }
}
