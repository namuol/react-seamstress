import React from 'react';
import {
  AppRegistry,
} from 'react-native';

import App from './common/App';

function NativeSeamstressExample (props) {
  return (
    <App />
  );
}

AppRegistry.registerComponent('NativeSeamstressExample', () =>
  NativeSeamstressExample
);
