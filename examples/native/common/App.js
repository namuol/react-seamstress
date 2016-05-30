import React from 'react';

import {
  View,
  Text,
  StyleSheet,
} from 'react-native';

import Toggler from './Toggler';

const styles = StyleSheet.create({
  root: {
    padding: 20,
  },
  red: {
    borderColor: '#c66',
    backgroundColor: '#fbb',
  },
  redToggled: {
    backgroundColor: '#c66',
  },
  green: {
    borderColor: '#6c6',
    backgroundColor: '#bfb',
  },
  greenToggled: {
    backgroundColor: '#6c6',
  },
  blue: {
    borderColor: '#66c',
    backgroundColor: '#bbf',
  },
  blueToggled: {
    backgroundColor: '#66c',
  },
});

const App = () => (
  <View style={styles.root}>
    <View>
      <Text>Default styles:</Text>
      <View>
        <Toggler />
        <Toggler defaultToggled />
        <Toggler />
      </View>
    </View>

    <View>
      <Text>Overriding inside render with props.styles:</Text>
      <View>
        <Toggler
          styles={{
            '::root': styles.red,
            '[toggled]': styles.redToggled,
          }}
        />
        <Toggler
          styles={{
            '::root': styles.green,
            '[toggled]': styles.greenToggled,
          }}
          defaultToggled
        />
        <Toggler
          styles={{
            '::root': styles.blue,
            '[toggled]': styles.blueToggled,
          }}
        />
      </View>
    </View>
  </View>
);

export default App;
