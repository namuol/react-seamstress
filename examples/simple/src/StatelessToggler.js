import Seamstress from 'react-seamstress';
import React, { PropTypes, Component } from 'react';

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

export default Seamstress.createContainer(StatelessToggler, {
  styles: {
    ':base': 'Toggler',
    ':toggled': 'Toggler_toggled',
    '::indicator': 'TogglerIndicator',
  },

  subComponentTypes: {
    indicator: Seamstress.SubComponentTypes.simple,
  },

  styleStateTypes: {
    toggled: PropTypes.bool.isRequired,
  },

  getStyleState: ({props, context}) => {
    return {
      toggled: !!props.toggled,
    };
  },
});
