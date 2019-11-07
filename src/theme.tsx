// 主题管理
import cx from 'classnames';
import React from 'react';
import hoistNonReactStatic = require('hoist-non-react-statics');
import {ExtractProps, Omit} from './types';
import PropTypes from 'prop-types';

export type ClassValue =
  | string
  | number
  | ClassDictionary
  | ClassArray
  | undefined
  | null
  | boolean;

interface ClassDictionary {
  [id: string]: any;
}

// This is the only way I found to break circular references between ClassArray and ClassValue
// https://github.com/Microsoft/TypeScript/issues/3496#issuecomment-128553540
interface ClassArray extends Array<ClassValue> {} // tslint:disable-line no-empty-interface

export type ClassNamesFn = (...classes: ClassValue[]) => string;

interface ThemeConfig {
  classPrefix?: string;
  renderers?: {
    [propName: string]: any;
  };

  [propsName: string]: any;
}

const themes: {
  [propName: string]: ThemeConfig;
} = {
  default: {}
};

export function theme(name: string, config: Partial<ThemeConfig>) {
  themes[name] = {
    ...config
  };
}

const fns: {
  [propName: string]: (...classes: ClassValue[]) => string;
} = {};
export function makeClassnames(ns?: string) {
  if (ns && fns[ns]) {
    return fns[ns];
  }

  const fn = (...classes: ClassValue[]) => {
    const str = cx(...(classes as any));
    return str && ns
      ? str
          .replace(/(^|\s)([A-Z])/g, '$1' + ns + '$2')
          .replace(/(^|\s)\:/g, '$1')
      : str || '';
  };

  ns && (fns[ns] = fn);
  return fn;
}

export type ThemeInstance = ThemeConfig & {
  getRendererConfig: (name?: string) => any;
  classnames: ClassNamesFn;
};

export function hasTheme(theme: string): boolean {
  return !!themes[theme];
}

export function setDefaultTheme(theme: string) {
  if (hasTheme(theme)) {
    defaultTheme = theme;
  }
}

export function classnames(...classes: ClassValue[]) {
  return getTheme(defaultTheme).classnames(...classes);
}

export function getClassPrefix() {
  return getTheme(defaultTheme).classPrefix;
}

export function getTheme(theme: string): ThemeInstance {
  if (!themes[theme]) {
    throw new Error(`Theme with name "${theme}" does not exist!`);
  }

  const config = themes[theme];

  if (!config.getRendererConfig) {
    config.getRendererConfig = (name?: string) =>
      config.renderers && name ? config.renderers[name] : null;
  }

  if (!config.classnames) {
    const ns = config.classPrefix;
    config.classnames = config.classnames || makeClassnames(ns);
  }

  return config as ThemeInstance;
}

export interface ThemeProps {
  classPrefix: string;
  classnames: ClassNamesFn;
}

export const ThemeContext = React.createContext('theme');
export let defaultTheme: string = 'default';

export function themeable<
  T extends React.ComponentType<ThemeProps & ExtractProps<T>>
>(ComposedComponent: T) {
  type ComposedProps = JSX.LibraryManagedAttributes<T, ExtractProps<T>>;
  type Props = Omit<ComposedProps, keyof ThemeProps> & {
    theme?: string;
    classPrefix?: string;
    classnames?: ClassNamesFn;
  };

  class EnhancedComponent extends React.Component<Props> {
    static displayName = `Themeable(${ComposedComponent.displayName ||
      ComposedComponent.name})`;
    static contextType = ThemeContext;
    static ComposedComponent = ComposedComponent;

    render() {
      const theme: string = this.props.theme || this.context || defaultTheme;
      const config = hasTheme(theme) ? getTheme(theme) : getTheme(defaultTheme);
      const injectedProps: {
        classPrefix: string;
        classnames: ClassNamesFn;
      } = {
        classPrefix: config.classPrefix as string,
        classnames: config.classnames
      };

      return (
        <ThemeContext.Provider value={theme}>
          <ComposedComponent
            {
              ...this.props as any /* todo, 解决这个类型问题 */
            }
            {...injectedProps}
          />
        </ThemeContext.Provider>
      );
    }
  }

  return hoistNonReactStatic(
    EnhancedComponent,
    ComposedComponent
  ) as React.ComponentClass<Props> & {
    ComposedComponent: T;
  };
}
