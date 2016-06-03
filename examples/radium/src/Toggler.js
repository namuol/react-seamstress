import Seamstress, { SubComponentTypes } from 'react-seamstress';
import React, { PropTypes } from 'react';
import Radium from 'radium';

const propTypes = {
  toggled: PropTypes.bool,
  onToggle: PropTypes.func.isRequired,
};

const {
  createContainer,
  computedStylesPropType,
} = Seamstress.configure({
  propTypes,
  styles: {
    '::root': {
      width: 24,
      height: 24,
      cursor: 'pointer',
      margin: 5,
      border: '2px solid #aaa',
      backgroundColor: '#eee',
      display: 'inline-block',
      userSelect: 'none',
      overflow: 'hidden',
      transition: 'box-shadow 250ms',
      ':hover': {
        boxShadow: '0 0 5px rgba(0,0,0,0.5)',
      },
    },
    '[toggled]': {
      backgroundColor: '#aaa',
    },
    '::indicator': {
      color: 'white',
      display: 'none',
      lineHeight: '20px',
      width: '100%',
      height: '100%',
      textAlign: 'center',
      fontSize: '16pt',
    },
    '[toggled]::indicator': {
      display: 'block',
    },
  },
  subComponentTypes: {
    indicator: SubComponentTypes.simple,
  },
});

// Presentational component:
const Toggler = Radium(class Toggler extends React.Component {
  static propTypes = {
    ...propTypes,
    styles: computedStylesPropType,
  };

  render () {
    return (
      <div
        {...this.props.styles.root}
        onClick={this.props.onToggle}
      >
        <span {...this.props.styles.indicator}>✓</span>
      </div>
    );
  }
});

// Seamstress-styled component:
const StyledToggler = createContainer(Toggler);

// Stateful container:
export default class TogglerContainer extends React.Component {
  static propTypes = {
    defaultToggled: PropTypes.bool,
  };

  static defaultProps = {
    defaultToggled: false,
  };

  state = {
    toggled: this.props.defaultToggled || false,
  };

  render () {
    return (
      <StyledToggler
        onToggle={() => {
          this.setState({
            toggled: !this.state.toggled,
          });
        }}
        toggled={this.state.toggled}
        {...this.props}
      />
    );
  }
}
