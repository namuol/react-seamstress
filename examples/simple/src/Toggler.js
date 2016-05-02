import Seamstress, { SubComponentTypes } from 'react-seamstress';
import React, { PropTypes } from 'react';

const {
  createContainer,
  stylesPropType,
} = Seamstress.configure({
  styles: {
    '::root': 'Toggler',
    '[toggled]': 'Toggler_toggled',
    '::indicator': 'TogglerIndicator',
    '[toggled]::indicator': 'TogglerIndicator_toggled',
  },
  subComponentTypes: {
    indicator: SubComponentTypes.simple,
  },
});

export const Toggler = ({ styles = {}, onToggle }) => (
  <div
    {...styles.root}
    onClick={onToggle}
  >
    <span {...styles.indicator}>✓</span>
  </div>
);

Toggler.propTypes = {
  onToggle: PropTypes.func.isRequired,
  styles: stylesPropType,
};

export default createContainer(Toggler);
