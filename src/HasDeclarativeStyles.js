import mergeStyles from './mergeStyles';
import styleFromState from './styleFromState';
import getInvalidStyleStates from './getInvalidStyleStates';
import checkPropTypes from './checkPropTypes';

function arrayify (obj) {
  if (Array.isArray(obj)) {
    return obj;
  }

  return [obj];
}

export default function HasDeclarativeStyles (Component) {
  const displayName = Component.displayName || Component.name;

  return class ComponentWithDeclarativeStyles extends Component {
    static displayName = displayName;

    static propTypes = Object.assign({
      styles: (props, propName, component) => {
        const style = mergeStyles(arrayify(props[propName]));
        const invalidStyleStates = getInvalidStyleStates({
          style,
          styleStateTypes: Component.styleStateTypes,
        });
        if (!!invalidStyleStates) {
          const plural = invalidStyleStates.length > 1;
          const listString = invalidStyleStates.map(s => `\`:${s}\``).join(', ');
          return new Error(
            `Style state${plural ? 's' : ''} ${listString}` +
            ` ${plural ? 'were' : 'was'} not specified in \`${displayName}\`. ` +
            'Available states are: [' +
            Object.keys(Component.styleStateTypes).map(s=>`\`${s}\``).join(', ') +
            '].'
          );
        }
      },
    }, Component.propTypes);

    getStyle () {
      const state = this.getStyleState();
      checkPropTypes(displayName, Component.styleStateTypes, state, "prop", "styleStateType",
        `Check the \`getStyleState\` method of \`${displayName}\`.`);
      const style = mergeStyles([Component.baseStyle, ...arrayify(this.props.styles)]);
      return mergeStyles(styleFromState({state, style}));
    }
  }
}
