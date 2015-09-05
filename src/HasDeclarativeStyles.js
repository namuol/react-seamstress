import mergeStyles from './mergeStyles';
import filterStylesFromState from './filterStylesFromState';
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
  
  function validateStyles (props, propName, component) {
    const {style} = mergeStyles(arrayify(props[propName]));
    const invalidStyleStates = getInvalidStyleStates({
      style,
      styleStateTypes: Component.styleStateTypes,
    });

    if (!invalidStyleStates) {
      return;
    }

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

  if (process.env.NODE_ENV !== 'production') {
    let error = validateStyles(Component, 'baseStyles')
    if (!!error) {
      console.error(error.message + ` Check the definition of \`${displayName}.baseStyles\``);
    }
  }

  return class ComponentWithDeclarativeStyles extends Component {
    static displayName = displayName;

    static propTypes = Object.assign({
      styles: validateStyles,
    }, Component.propTypes);

    getStyleProps () {
      const state = this.getStyleState();
      if (process.env.NODE_ENV !== 'production') {
        checkPropTypes(displayName, Component.styleStateTypes, state, 'prop', 'styleStateType',
          `Check the \`getStyleState\` method of \`${displayName}\`.`);
      }
      return mergeStyles(filterStylesFromState({
        state,
        styles: [...arrayify(this.constructor.baseStyles), ...arrayify(this.props.styles)],
      }));
    }

    static withStyles (myStyles) {
      return class TailoredComponent extends ComponentWithDeclarativeStyles {
        static baseStyles = [...arrayify(Component.baseStyles), ...arrayify(myStyles)];
      };
    }
  }
}
