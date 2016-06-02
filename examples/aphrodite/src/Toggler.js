import Seamstress, { SubComponentTypes } from 'react-seamstress';
import React, { PropTypes } from 'react';
import { StyleSheet, css } from 'aphrodite';

const propTypes = {
  toggled: PropTypes.bool,
  onToggle: PropTypes.func.isRequired,
};

const styles = StyleSheet.create({
  root: {
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
  toggled: {
    backgroundColor: '#aaa',
  },
  indicator: {
    color: 'white',
    display: 'none',
    lineHeight: '20px',
    width: '100%',
    height: '100%',
    textAlign: 'center',
    fontSize: '16pt',
  },
  indicatorToggled: {
    display: 'block',
  },
});

const {
  createContainer,
  stylesPropType,
  computedStylesPropType,
} = Seamstress.configure({
  propTypes,
  styles: {
    '::root': css(styles.root),
    '[toggled]': css(styles.toggled),
    '::indicator': css(styles.indicator),
    '[toggled]::indicator': css(styles.indicatorToggled),
  },
  subComponentTypes: {
    indicator: SubComponentTypes.simple,
  },
});

// Presentational component:
const Toggler = ({ styles = {}, onToggle }) => (
  <div
    {...styles.root}
    onClick={onToggle}
  >
    <span {...styles.indicator}>✓</span>
  </div>
);

Toggler.propTypes = {
  ...propTypes,
  styles: computedStylesPropType,
};

// Seamstress-styled component:
const StyledToggler = createContainer(Toggler);

// Stateful container:
export default class TogglerContainer extends React.Component {
  static propTypes = {
    defaultToggled: PropTypes.bool,
    styles: stylesPropType,
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
