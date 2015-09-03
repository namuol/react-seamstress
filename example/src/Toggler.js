import HasDeclarativeStyles from '../../src/HasDeclarativeStyles';
import React, { PropTypes, Component } from 'react';

@HasDeclarativeStyles
export default class Toggler extends Component {
  static baseStyle = {
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
      }} />
    );
  }
}
