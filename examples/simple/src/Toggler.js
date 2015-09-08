import HasDeclarativeStyles from '../../../src/HasDeclarativeStyles';
import React, { PropTypes, Component } from 'react';

export class StyleElement extends Component {
  render () {
    return <style>{
    `
    .Toggler {
      width: 24px;
      height: 24px;
      cursor: pointer;
      margin: 5px;
      border: 2px solid #aaa;
      background-color: #eee;
      display: inline-block;
      -webkit-user-select: none;
      -moz-user-select: none;
      -ms-user-select: none;
      user-select: none;
      overflow: hidden;
    }

    .Toggler_toggled {
      background-color: #aaa;
    }

    .TogglerIndicator {
      color: white;
      display: block;
      line-height: 20px;
      width: 100%;
      height: 100%;
      text-align: center;
      font-size: 16pt;
    }
    `
    }</style>
  }
}

@HasDeclarativeStyles
export default class Toggler extends Component {
  static StyleElement = StyleElement;

  static styles = {
    ':base': 'Toggler',
    ':toggled': 'Toggler_toggled',
    '::indicator': 'TogglerIndicator',
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
