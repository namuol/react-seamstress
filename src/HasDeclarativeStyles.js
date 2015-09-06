import warning from 'fbjs/lib/warning';
import mergeStyles from './mergeStyles';
import filterStylesFromState from './filterStylesFromState';
import getInvalidStyleStates from './getInvalidStyleStates';
import checkPropTypes from './checkPropTypes';

const __DEV__ = process.env.NODE_ENV !== 'production';

function arrayify (obj) {
  return Array.isArray(obj) ? obj : [obj];
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

  if (__DEV__) {
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

    getStyles () {
      const state = this.getStyleState();
      if (__DEV__) {
        checkPropTypes(displayName, Component.styleStateTypes, state, 'prop', 'styleStateType',
          `Check the \`getStyleState\` method of \`${displayName}\`.`);
      }

      if (this.props.className || this.props.style) {
        if (__DEV__) {
          const propNames = ['className', 'style']
            .filter(n => !!this.props[n])
            .map(n=>'`'+n+'`')
            .join(' and ');

          warning(false, `Replacing ALL styles of \`${displayName}\` with the ${propNames} you supplied. ` +
                         `The preferred way to customize the styles of \`${displayName}\` is to use the \`styles\` property.`);
        }

        return {
          style: this.props.style,
          className: this.props.className,
        };
      } else {
        return mergeStyles(filterStylesFromState({
          state,
          styles: [...arrayify(this.constructor.baseStyles), ...arrayify(this.props.styles), this.props.className, this.props.style],
        }));
      }
    }

    static withStyles (myStyles) {
      return class TailoredComponent extends ComponentWithDeclarativeStyles {
        static baseStyles = [...arrayify(Component.baseStyles), ...arrayify(myStyles)];
      };
    }
  }
}
