import classes from './Combobox.css';

import Seamstress from 'react-seamstress';

@Seamstress.createDecorator({
  styles: {
    ':base': classes.base,
    ':expanded': classes.expanded,
    ':busy': classes.busy,
    '::indicator': classes.indicator,
    ':expanded::indicator': classes.expandedIndicator,
    ':busy::indicator': classes.busyIndicator
  },
  getStyleState: function ({props, context, state}) {
    return {
      expanded: state.expanded,
      busy: state.busy
    };
  }
})
class Combobox extends React.Component {
  render () {
    const computedStyles = this.props.computedStyles;

    return (
      <div {...computedStyles.root}>
        <div {...computedStyles.indicator} />
      </div>
    );
  }
}

