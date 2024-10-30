import {useEffect, useRef} from 'react';
import {
  removeCustomStyle,
  type InsertCustomStyle,
  insertCustomStyle,
  insertEditCustomStyle,
  CustomStyleClassName,
  setThemeClassName
} from '../utils/style-helper';
import React from 'react';
import {PlainObject} from '../types';
import cx from 'classnames';

interface CustomStyleProps {
  config: {
    wrapperCustomStyle?: any;
  } & InsertCustomStyle;
  [propName: string]: any;
}

export const styleIdCount = new Map();

export default function CustomStyle(props: CustomStyleProps) {
  const {config, env, data, children, classPrefix} = props;
  const {themeCss, classNames, defaultData, wrapperCustomStyle} = config;
  const id = config.id ? `${config.id}` : config.id;

  useEffect(() => {
    if (styleIdCount.has(id)) {
      styleIdCount.set(id, styleIdCount.get(id) + 1);
    } else if (id) {
      styleIdCount.set(id, 1);
    }
    return () => {
      if (styleIdCount.has(id)) {
        styleIdCount.set(id, styleIdCount.get(id) - 1);
        if (styleIdCount.get(id) === 0) {
          styleIdCount.delete(id);
        }
      }
    };
  }, [id]);

  useEffect(() => {
    if (themeCss && id) {
      insertCustomStyle({
        themeCss,
        classNames,
        id,
        defaultData,
        customStyleClassPrefix: env?.customStyleClassPrefix,
        doc: env?.getModalContainer?.()?.ownerDocument,
        data,
        classPrefix
      });
    }

    return () => {
      if (id && !styleIdCount.get(id)) {
        removeCustomStyle(
          '',
          id,
          env?.getModalContainer?.()?.ownerDocument,
          data
        );
      }
    };
  }, [themeCss, id]);

  useEffect(() => {
    if (wrapperCustomStyle && id) {
      insertEditCustomStyle({
        customStyle: wrapperCustomStyle,
        id,
        doc: env?.getModalContainer?.()?.ownerDocument,
        data
      });
    }

    return () => {
      if (id && !styleIdCount.get(id)) {
        removeCustomStyle(
          'wrapperCustomStyle',
          id,
          env?.getModalContainer?.()?.ownerDocument,
          data
        );
      }
    };
  }, [wrapperCustomStyle, id]);

  return children;
}

/**
 * 自定义样式装饰器
 */
export function CustomStyleWrapper(config: {
  classNames: CustomStyleClassName[];
  wrapperCustomStyle?: boolean;
  themeCss?: string;
  id?: string;
}) {
  return function <T extends React.ComponentType>(Component: T): T {
    const WrappedComponent = (props: any) => {
      const id = config.id || props.id;
      const themeCss = props[config.themeCss || 'themeCss'];

      const [className, setClassName] = React.useState<PlainObject>({});

      useEffect(() => {
        const className: PlainObject = {};
        config.classNames.forEach(item => {
          if (item.name) {
            className[item.name] = cx(
              setThemeClassName({
                props,
                name: item.key,
                id,
                themeCss
              }),
              props[item.name]
            );
          }
        });
        setClassName(className);
      }, [props]);

      return (
        <>
          <CustomStyle
            config={{
              classNames: config.classNames,
              id,
              themeCss,
              wrapperCustomStyle: config.wrapperCustomStyle
                ? props.wrapperCustomStyle
                : null
            }}
            {...props}
          />
          <Component {...props} {...className} />
        </>
      );
    };
    return WrappedComponent as unknown as T;
  };
}
