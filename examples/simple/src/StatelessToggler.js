import Seamstress from 'react-seamstress';
import React, { PropTypes } from 'react';

const seamstressConfig = {
  styles: {
    ':base': 'Toggler',
    '[toggled]': 'Toggler_toggled',
    '::indicator': 'TogglerIndicator',
  },

  subComponentTypes: {
    indicator: Seamstress.SubComponentTypes.simple,
  },

};

function StatelessToggler (props) {
  const { computedStyles } = props;

  return <div {...props} {...computedStyles.root}>
    {props.toggled &&
      <span {...computedStyles.indicator}>✓</span>
    }
  </div>;
}

StatelessToggler.propTypes = {
  toggled: PropTypes.bool,
};

StatelessToggler.defaultProps = {
  toggled: false,
};

StatelessToggler.displayName = 'StatelessToggler';

export default Seamstress.createContainer(StatelessToggler, seamstressConfig);
