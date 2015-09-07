import HasDeclarativeStyles from '../../src/HasDeclarativeStyles';
import React, { PropTypes, Component } from 'react';

export class StyleElement extends Component {
  render () {
    return <style>{
    `
    .Toggler {
      width: 20px;
      height: 20px;
      cursor: pointer;
      margin: 5px;
      border: 2px solid #aaa;
      background-color: #eee;
      display: inline-block;
      -webkit-user-select: none;
      -moz-user-select: none;
      -ms-user-select: none;
      user-select: none;
    }

    .Toggler_toggled {
      background-color: #aaa;
    }
    `
    }</style>
  }
}

@HasDeclarativeStyles
export default class Toggler extends Component {
  static StyleElement = StyleElement;

  static styles = [
    'Toggler',
    {
      ':toggled': 'Toggler_toggled'
    }
  ];
  
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
      }} />
    );
  }
}
