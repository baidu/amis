// 主题管理
import cx from 'classnames';
import React from 'react';
import hoistNonReactStatic from 'hoist-non-react-statics';
import {ExtractProps, Omit} from './types';

type translateFn = (str: string, ...args: any[]) => string;

interface LocaleConfig {
  [propsName: string]: string;
}

let defaultLocale: string = '';

const locales: {
  [propName: string]: LocaleConfig;
} = {};

export function register(name: string, config: LocaleConfig) {
  locales[name] = config;
}

const fns: {
  [propName: string]: translateFn;
} = {};

// todo 支持参数
function format(str: string, ...args: any[]) {
  return str;
}

export function makeTranslator(locale?: string): translateFn {
  if (locale && fns[locale]) {
    return fns[locale];
  }

  const fn = (str: string, ...args: any[]) => {
    if (!str || typeof str !== 'string') {
      return str;
    }

    const dict = locales[locale!] || locales[defaultLocale];
    return format(dict[str] || str, ...args);
  };

  locale && (fns[locale] = fn);
  return fn;
}

export function setDefaultLocale(loacle: string) {
  defaultLocale = loacle;
}

export interface LocaleProps {
  locale: string;
  translate: translateFn;
}

export const LocaleContext = React.createContext('locale');

export function localeable<
  T extends React.ComponentType<LocaleProps & ExtractProps<T>>
>(ComposedComponent: T) {
  type ComposedProps = JSX.LibraryManagedAttributes<T, ExtractProps<T>>;
  type Props = Omit<ComposedProps, keyof LocaleProps> & {
    locale?: string;
    translate: (str: string, ...args: any[]) => string;
  };

  const result = hoistNonReactStatic(
    class extends React.Component<Props> {
      static displayName = `I18N(${
        ComposedComponent.displayName || ComposedComponent.name
      })`;
      static contextType = LocaleContext;
      static ComposedComponent = ComposedComponent;

      render() {
        const locale: string =
          this.props.locale || this.context || defaultLocale;
        const translate = makeTranslator(locale);
        const injectedProps: {
          locale: string;
          translate: translateFn;
        } = {
          locale,
          translate
        };

        return (
          <LocaleContext.Provider value={locale}>
            <ComposedComponent
              {
                ...(this.props as any) /* todo, 解决这个类型问题 */
              }
              {...injectedProps}
            />
          </LocaleContext.Provider>
        );
      }
    },
    ComposedComponent
  );

  return result as typeof result & {
    ComposedComponent: T;
  };
}
