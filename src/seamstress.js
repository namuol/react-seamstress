import warning from 'fbjs/lib/warning';
import mergeStyles from './mergeStyles';
import computeStylesFromState from './computeStylesFromState';
import getInvalidStyleStates from './getInvalidStyleStates';
import checkPropTypes from './checkPropTypes';
import getSubComponentStyles from './getSubComponentStyles';
import arrayify from './arrayify';

const __DEV__ = process.env.NODE_ENV !== 'production';

export default function seamstress (Component) {
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
    __computedStyles = null;
    __subComponentStyles = null;

    static displayName = displayName;

    static propTypes = Object.assign({
      styles: validateStyles,
    }, Component.propTypes);

    getStyleState = Component.prototype.getStyleState || () => { return {}; };

    componentWillUpdate (...args) {
      super.componentWillUpdate && super.componentWillUpdate(...args);
      
      // PERF TODO: nullify this ONLY when result of this.getStyleState or props.styles changes.
      this.__computedStyles = null;
      this.__subComponentStyles = null;
    }

    getStylesFor (subComponentName) {
      if (!this.__computedStyles) {
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

        this.__computedStyles = computeStylesFromState({
          state,
          styles: [...arrayify(this.constructor.styles), ...arrayify(this.props.styles)],
        });

        this.__subComponentStyles = getSubComponentStyles({
          styles: this.__computedStyles,
        });
      }

      return this.__subComponentStyles[subComponentName] || [];
    }

    getStylePropsFor (subComponentName, extraStyles=[]) {
      return mergeStyles([...this.getStylesFor(subComponentName), ...extraStyles]);
    }

    getStyleProps () {
      return this.getStylePropsFor('__root', [this.props.className, this.props.style]);
    }

    static withStyles (myStyles) {
      class TailoredComponent extends ComponentWithDeclarativeStyles {
        static styles = [...arrayify(Component.styles), ...arrayify(myStyles)];
      };

      if (__DEV__) {
        let error = validateStyles(TailoredComponent, 'styles');
        if (!!error) {
          console.error(error.message + ` Check the value passed to \`${displayName}.withStyles(...)\`.`);
        }
      }

      return TailoredComponent;
    }
  }
}
