// 主题管理
import cx from 'classnames';
import React from 'react';
import hoistNonReactStatic from 'hoist-non-react-statics';

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

interface ClassArray extends Array<ClassValue> {}

export type ClassNamesFn = (...classes: ClassValue[]) => string;

interface ThemeConfig {
  classPrefix?: string;
  renderers?: {
    [propName: string]: any;
  };
  components?: {
    [propName: string]: any;
  };

  [propsName: string]: any;
}

const themes: {
  [propName: string]: ThemeConfig;
} = {
  default: {},
  cxd: {
    classPrefix: 'cxd-'
  }
};

export function theme(name: string, config: Partial<ThemeConfig>) {
  themes[name] = {
    ...themes[name],
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
  getComponentConfig: (name?: string) => any;
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
  return getTheme(defaultTheme).classnames.apply(null, classes);
}

export function getClassPrefix() {
  return getTheme(defaultTheme).classPrefix;
}

export function getTheme(theme: string): ThemeInstance {
  const config = themes[theme || 'cxd'];

  if (!config.getRendererConfig) {
    config.getRendererConfig = (name?: string) => {
      const config = themes[theme || 'cxd'];
      return config.renderers && name ? config.renderers[name] : null;
    };
  }

  if (!config.classnames) {
    const ns = config.classPrefix;
    config.classnames = config.classnames || makeClassnames(ns);
  }

  if (!config.getComponentConfig) {
    config.getComponentConfig = (name?: string) =>
      config.components && name ? config.components[name] : null;
  }

  return config as ThemeInstance;
}

export interface ThemeProps {
  className?: string;
  classPrefix: string;
  classnames: ClassNamesFn;
  theme?: string;
}

export interface ThemeOutterProps {
  theme?: string;
  className?: string;
  classPrefix?: string;
  classnames?: ClassNamesFn;
}

export let defaultTheme: string = 'cxd';
export const ThemeContext = React.createContext('');

export function themeable<
  T extends React.ComponentType<React.ComponentProps<T> & ThemeProps> & {
    themeKey?: string;
  }
>(ComposedComponent: T) {
  type OuterProps = JSX.LibraryManagedAttributes<
    T,
    Omit<React.ComponentProps<T>, keyof ThemeProps>
  > &
    ThemeOutterProps;

  const result = hoistNonReactStatic(
    class extends React.Component<OuterProps> {
      static displayName = `Themeable(${
        ComposedComponent.displayName || ComposedComponent.name
      })`;
      static contextType = ThemeContext;
      static ComposedComponent = ComposedComponent as React.ComponentType<T>;

      constructor(props: OuterProps) {
        super(props);

        this.childRef = this.childRef.bind(this);
        this.getWrappedInstance = this.getWrappedInstance.bind(this);
      }

      ref: any;

      childRef(ref: any) {
        while (ref && ref.getWrappedInstance) {
          ref = ref.getWrappedInstance();
        }

        this.ref = ref;
      }

      getWrappedInstance() {
        return this.ref;
      }

      render() {
        const theme: string = this.props.theme || this.context || defaultTheme;
        const config = hasTheme(theme)
          ? getTheme(theme)
          : getTheme(defaultTheme);
        const injectedProps: {
          classPrefix: string;
          classnames: ClassNamesFn;
          theme: string;
        } = {
          classPrefix: config.classPrefix as string,
          classnames: config.classnames,
          theme
        };
        const refConfig = ComposedComponent.prototype?.isReactComponent
          ? {ref: this.childRef}
          : {forwardedRef: this.childRef};

        const body = (
          <ComposedComponent
            {...config.getComponentConfig(ComposedComponent.themeKey)}
            {...(this.props as JSX.LibraryManagedAttributes<
              T,
              React.ComponentProps<T>
            >)}
            {...injectedProps}
            {...refConfig}
          />
        );

        return this.context ? (
          body
        ) : (
          <ThemeContext.Provider value={theme}>{body}</ThemeContext.Provider>
        );
      }
    },
    ComposedComponent
  );

  return result as typeof result & {
    ComposedComponent: T;
  };
}
