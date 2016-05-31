import Seamstress, { SubComponentTypes } from 'react-seamstress';
import React, { PropTypes } from 'react';

import classes from './Toggler.css';

const propTypes = {
  toggled: PropTypes.bool,
  onToggle: PropTypes.func.isRequired,
};

const {
  createContainer,
  stylesPropType,
  computedStylesPropType,
} = Seamstress.configure({
  propTypes,
  styles: {
    '::root': classes.root,
    '[toggled]': classes.toggled,
    '::indicator': classes.indicator,
    '[toggled]::indicator': classes.indicatorToggled,
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
