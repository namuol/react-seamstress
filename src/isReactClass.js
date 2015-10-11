import { Component } from 'react';

export default function isReactClass (component) {
  return component && (component instanceof Component || component.isReactClass || (component.prototype && component.prototype.isReactComponent));
}