import classes from './Combobox.css';

class Combobox extends React.Component {
  render () {
    const { expanded, busy } = this.state;
    return (
      <div
        className={classnames(
          classes.base,
          this.props.className,
          expanded && classes.expanded,
          expanded && this.props.expandedClassName,
          busy && classes.busy,
          busy && this.props.busyClassName
        )}
        style={mergeStyles(
          this.props.style,    
          expanded && this.props.expandedStyle,
          busy && this.props.busyStyle
        )}
      >
        <div
          className={classnames(
            classes.indicator,
            this.props.indicatorClassName,
            expanded && classes.expandedIndicator,
            expanded && this.props.expandedIndicatorClassName,
            busy && classes.busyIndicator,
            busy && this.props.busyIndicatorClassName
          )}
          style={mergeStyles(
            this.props.indicatorStyle,    
            expanded && this.props.expandedIndicatorStyle,
            busy && this.props.busyIndicatorStyle
          )}
        />
      </div>
    );
  }
}

// ...

import myClasses from './MyCombobox.css';

<Combobox
  className={myClasses.base}
  expandedStyle={{
    color: 'red',
  }}
  expandedIndicatorClassName={myClasses.expandedIndicator}
/>
