import React, { PropTypes, Component } from 'react';
import HasDeclarativeStyles from '../../src/HasDeclarativeStyles';
import mergeStyles from '../../src/mergeStyles';

@HasDeclarativeStyles
class Toggler extends Component {
  static styleStateTypes = {
    toggled: PropTypes.bool,
  };

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

  state = (() => {
    return {
      toggled: this.props.toggled || false,
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

const RED_STYLE = {
  border: '2px solid #c66',
  backgroundColor: '#f88',
  '&:toggled': {
    backgroundColor: '#c66',
  },
};

const GREEN_STYLE = {
  border: '2px solid #6c6',
  backgroundColor: '#8f8',
  '&:toggled': {
    backgroundColor: '#6c6',
  },
};

const BLUE_STYLE = {
  border: '2px solid #66c',
  backgroundColor: '#88f',
  '&:toggled': {
    backgroundColor: '#66c',
  },
};

export default class App extends Component {
  render() {
    return (
      <div>
        <Toggler style={RED_STYLE} />
        <Toggler style={GREEN_STYLE} />
        <Toggler style={BLUE_STYLE} />
      </div>
    );
  }
}
