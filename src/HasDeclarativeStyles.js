import warning from 'fbjs/lib/warning';
import mergeStyles from './mergeStyles';
import computeStylesFromState from './computeStylesFromState';
import getInvalidStyleStates from './getInvalidStyleStates';
import checkPropTypes from './checkPropTypes';
import getSubComponentStyles from './getSubComponentStyles';

const __DEV__ = process.env.NODE_ENV !== 'production';

function arrayify (obj) {
  return Array.isArray(obj) ? obj : [obj];
}

export default function HasDeclarativeStyles (Component) {
  const displayName = Component.displayName || Component.name;

  function validateStyles (props, propName, component) {
    if (!Component.styleStateTypes) {
      return;
    }
    
    // We're only concerned with root styles:
    const styles = getSubComponentStyles({
      styles: arrayify(props.styles),
    }).__root || [];

    const {style} = mergeStyles(styles);
    
    // HACKish:
    delete style[':base'];

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
    let error = validateStyles(Component, 'styles');
    if (!!error) {
      console.error(error.message + ` Check the definition of \`${displayName}.styles\`.`);
    }
  }

  return class ComponentWithDeclarativeStyles extends Component {
    __calculatedStylesBySubComponent = null;

    static displayName = displayName;

    static propTypes = Object.assign({
      styles: validateStyles,
    }, Component.propTypes);

    componentWillReceiveProps (nextProps) {
      // TODO: nullify this ONLY when props.styles changes:
      this.__calculatedStylesBySubComponent = null;
    }

    __splitStylesBySubComponent () {
      if (!!this.__calculatedStylesBySubComponent) {
        return;
      }

      this.__calculatedStylesBySubComponent = getSubComponentStyles({
        styles: [...arrayify(this.constructor.styles), ...arrayify(this.props.styles)]
      });
    }

    getStylesFor (subComponentName) {
      this.__splitStylesBySubComponent();

      const state = this.getStyleState();

      warning(!state.hasOwnProperty('base'),
              `\`:base\` is a reserved styleState that is always \`true\`; please use a different name. ` +
              `Check the \`getStyleState\` method of \`${displayName}\`.`);

      if (__DEV__ && Component.styleStateTypes) {
        checkPropTypes(displayName, Component.styleStateTypes, state, 'prop', 'styleStateType',
          `Check the \`getStyleState\` method of \`${displayName}\`.`);
      }

      // HACKish: ensures :base:composed:selectors work as expected:
      state.base = true;

      if (!(this.props.className || this.props.style)) {
        const styles = computeStylesFromState({
          state,
          styles: this.__calculatedStylesBySubComponent[subComponentName] || [],
        });

        return mergeStyles(styles);
      } else {
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
      }
    }

    getStyles () {
      this.__splitStylesBySubComponent();

      return this.getStylesFor('__root');
    }

    static withStyles (myStyles) {
      return class TailoredComponent extends ComponentWithDeclarativeStyles {
        static styles = [...arrayify(Component.styles), ...arrayify(myStyles)];
      };
    }
  }
}
