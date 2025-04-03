import {useEffect, useRef} from 'react';
import type {RendererEnv} from '../env';
import {
  removeCustomStyle,
  type InsertCustomStyle,
  insertCustomStyle,
  insertEditCustomStyle
} from '../utils/style-helper';

interface CustomStyleProps {
  config: {
    wrapperCustomStyle?: any;
    componentId?: string;
  } & InsertCustomStyle;
  [propName: string]: any;
}

export const styleIdCount = new Map();

export default function (props: CustomStyleProps) {
  const {config, env, data} = props;
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
        data
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
        customStyleClassPrefix: env?.customStyleClassPrefix,
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

  return null;
}
