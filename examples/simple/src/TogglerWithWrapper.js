import Seamstress from 'react-seamstress';
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

function StatelessToggler (props) {
  const { computedStyles } = props;

  return (
    <div {...props} {...computedStyles.root}>
      {props.toggled &&
        <span {...computedStyles.indicator}>✓</span>
      }
    </div>
  );
}

export StatelessToggler = Seamstress.createContainer(, {
  styles: {
    ':base': 'Toggler',
    ':toggled': 'Toggler_toggled',
    '::indicator': 'TogglerIndicator',
  },

  styleStateTypes: {
    toggled: PropTypes.bool.isRequired,
  },

  subComponentTypes: {
    indicator: SubComponentTypes.simple,
  },

  getStyleState: ({props, context}) => {
    return {
      toggled: !!props.toggled,
    };
  },
});

function withWrappedComponent (InnerComponent) {
  return function (Wrapper) {
    return class extends Wrapper {
      static Component = InnerComponent;
      static extendStyles (styles) {
        return withWrappedComponent(InnerComponent.extendStyles(styles))(Wrapper);
      }
    }
  }
}

@withWrappedComponent(StatelessToggler)
export default class Toggler extends Component {
  static StyleElement = StyleElement;

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

  render () {
    return <this.constructor.Component
      {...this.props}
      onClick={_ => this.setState({toggled: !this.state.toggled})}
      toggled={!!this.state.toggled}
    />;
  }
}
