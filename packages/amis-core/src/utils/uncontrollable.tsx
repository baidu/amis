import React from 'react';
import {uncontrollable as baseUncontrollable} from 'uncontrollable';
import hoistNonReactStatic from 'hoist-non-react-statics';

export function uncontrollable<
  T extends React.ComponentType<any>,
  P extends {
    [propName: string]: any;
  }
>(arg: T, config: P, mapping?: any): T {
  const result = baseUncontrollable(arg, config, mapping);
  return hoistNonReactStatic(result, arg);
}
