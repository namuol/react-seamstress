import mergeStyles from './mergeStyles';
import styleFromState from './styleFromState';
import getInvalidStyleStates from './getInvalidStyleStates';

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
          return new Error(
            `Warning: Style states ${JSON.stringify(invalidStyleStates)}` +
            ` were not specified in \`${displayName}\`. ` +
            `Available states are: ${JSON.stringify(Object.keys(Component.styleStateTypes))}. `
          );
        }
      },
    }, Component.propTypes);

    getStyle () {
      const state = this.getStyleState();
      const style = mergeStyles([Component.baseStyle, ...arrayify(this.props.styles)]);
      return mergeStyles(styleFromState({state, style}));
    }
  }
}
