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
    '&:toggled': {
      backgroundColor: '#aaa',
    },
  };

  static styleStateTypes = {
    toggled: PropTypes.bool,
  };

  static defaultProps = {
    toggled: false,
  };

  state = (() => {
    return {
      toggled: this.props.toggled,
    };
  }());
  
  getStyleState () {
    return {
      toggled: this.state.toggled,
    };
  }

  render () {
    return (
      <div style={this.getStyle()} onClick={() => {
        this.setState({
          toggled: !this.state.toggled,
        });
      }} />
    );
  }
}
