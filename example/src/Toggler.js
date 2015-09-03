import HasDeclarativeStyles from '../../src/HasDeclarativeStyles';
import React, { PropTypes, Component } from 'react';

const BASE_STYLE = [
  'Toggler',
  {
    ':toggled': 'Toggler_toggled'
  }
];

export class Styles extends Component {
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

Toggler.Styles = Styles;