// 多语言支持
import React from 'react';
import hoistNonReactStatic from 'hoist-non-react-statics';
import moment from 'moment';
import {resolveVariable} from './utils/tpl-builtin';

export type TranslateFn<T = any> = (str: T, data?: object) => T;

interface LocaleConfig {
  [propsName: string]: string;
}

let defaultLocale: string = 'zh-CN';

const momentLocaleMap: Record<string, string> = {
  'zh-CN': 'zh-cn',
  'en-US': 'en',
  'de-DE': 'de'
};

const locales: {
  [propName: string]: LocaleConfig;
} = {};

export function register(name: string, config: LocaleConfig) {
  // 修改为扩展，防止已注册的语料被覆盖
  extendLocale(name, config);
}

export function extendLocale(
  name: string,
  config: LocaleConfig,
  cover: boolean = true
) {
  if (cover) {
    // 覆盖式扩展语料
    locales[name] = {
      ...(locales[name] || {}),
      ...config
    };
  } else {
    locales[name] = {
      ...config,
      ...(locales[name] || {})
    };
  }
}

/** 删除语料数据 */
export function removeLocaleData(name: string, key: Array<string> | string) {
  if (Array.isArray(key)) {
    key.forEach(item => {
      removeLocaleData(name, item);
    });
    return;
  }
  if (locales?.[name]?.[key]) {
    delete locales[name][key];
  }
}

const fns: {
  [propName: string]: TranslateFn;
} = {};

export function format(str: string, data?: object) {
  if (!str.includes('{{')) return str; // 先快速检查，避免无谓的正则执行

  return str.replace(/(\\)?\{\{([^{}]+?)\}\}/g, (_, escape, key) => {
    if (escape) {
      return _.substring(1);
    }

    return resolveVariable(key, data || {});
  });
}

export function makeTranslator(locale?: string): TranslateFn {
  if (locale && fns[locale]) {
    return fns[locale];
  }

  const fn = (str: any, ...args: any[]) => {
    if (!str || typeof str !== 'string') {
      return str;
    }

    const value =
      locales[locale!]?.[str] ||
      locales[defaultLocale]?.[str] ||
      locales['zh-CN']?.[str] ||
      str;
    return format(value, ...args);
  };

  locale && (fns[locale] = fn);
  return fn;
}

export function getDefaultLocale() {
  return defaultLocale;
}

export function setDefaultLocale(locale: string) {
  defaultLocale = locale;
}

export interface LocaleProps {
  locale: string;
  translate: TranslateFn;
}

export const LocaleContext = React.createContext('');

export function localeable<
  T extends React.ComponentType<React.ComponentProps<T> & LocaleProps>
>(ComposedComponent: T, methods?: Array<string>) {
  type OuterProps = JSX.LibraryManagedAttributes<
    T,
    Omit<React.ComponentProps<T>, keyof LocaleProps>
  > & {
    locale?: string;
    translate?: (str: string, ...args: any[]) => string;
  };

  const result = hoistNonReactStatic(
    class extends React.Component<OuterProps> {
      static displayName: string = `I18N(${
        ComposedComponent.displayName || ComposedComponent.name
      })`;
      static contextType = LocaleContext;
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
        const locale: string =
          this.props.locale || (this.context as string) || defaultLocale;
        const translate = this.props.translate || makeTranslator(locale);
        const injectedProps: {
          locale: string;
          translate: TranslateFn;
        } = {
          locale,
          translate: translate!
        };
        moment.locale(momentLocaleMap?.[locale] ?? locale);
        const refConfig =
          ComposedComponent.prototype?.isReactComponent ||
          (ComposedComponent as any).$$typeof ===
            Symbol.for('react.forward_ref')
            ? {ref: this.childRef}
            : {forwardedRef: this.childRef};

        const body = (
          <ComposedComponent
            {...(this.props as JSX.LibraryManagedAttributes<
              T,
              React.ComponentProps<T>
            > as any)}
            {...injectedProps}
            {...refConfig}
          />
        );
        return this.context ? (
          body
        ) : (
          <LocaleContext.Provider value={locale}>{body}</LocaleContext.Provider>
        );
      }
    },
    ComposedComponent
  );

  if (Array.isArray(methods)) {
    methods.forEach(method => {
      if (ComposedComponent.prototype[method]) {
        (result as any).prototype[method] = function () {
          const fn = this.ref?.[method];
          return fn ? fn.apply(this.ref, arguments) : undefined;
        };
      }
    });
  }

  return result as typeof result & {
    ComposedComponent: T;
  };
}
