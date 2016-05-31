import Seamstress, { SubComponentTypes } from 'react-seamstress';
import React, { PropTypes } from 'react';
import {
  TouchableHighlight,
  View,
  Text,
  StyleSheet,
} from 'react-native';

const propTypes = {
  toggled: PropTypes.bool,
  onToggle: PropTypes.func.isRequired,
};

const styles = StyleSheet.create({
  default: {
    width: 24,
    height: 24,
    margin: 5,
    borderWidth: 2,
    borderColor: '#aaa',
    backgroundColor: '#eee',
  },
  toggled: {
    backgroundColor: '#aaa',
  },
  indicator: {
    color: 'white',
    opacity: 0,
    lineHeight: 20,
    textAlign: 'center',
    fontSize: 16,
  },
  indicatorToggled: {
    opacity: 1,
  },
});

const {
  createContainer,
  stylesPropType,
  computedStylesPropType,
} = Seamstress.configure({
  native: true,
  propTypes,
  styles: {
    '::root': styles.default,
    '[toggled]': styles.toggled,
    '::indicator': styles.indicator,
    '[toggled]::indicator': styles.indicatorToggled,
  },
  subComponentTypes: {
    indicator: SubComponentTypes.simple,
  },
});

// Presentational component:
const Toggler = ({ styles = {}, onToggle }) => (
  <TouchableHighlight
    onPress={onToggle}
    {...styles.root}
  >
    <View>
      <Text {...styles.indicator}>✓</Text>
    </View>
  </TouchableHighlight>
);

Toggler.propTypes = {
  ...propTypes,
  styles: computedStylesPropType,
};

// Seamstress-styled component:
const StyledToggler = createContainer(Toggler);

// Stateful container:
export default class TogglerContainer extends React.Component {
  static propTypes = {
    defaultToggled: PropTypes.bool,
    styles: stylesPropType,
  };

  static defaultProps = {
    defaultToggled: false,
  };

  state = {
    toggled: this.props.defaultToggled || false,
  };

  render () {
    return (
      <StyledToggler
        onToggle={() => {
          this.setState({
            toggled: !this.state.toggled,
          });
        }}
        toggled={this.state.toggled}
        {...this.props}
      />
    );
  }
}
