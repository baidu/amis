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
  env: RendererEnv;
}

export const styleIdCount = new Map();

export default function (props: CustomStyleProps) {
  const {config, env} = props;
  const {themeCss, classNames, id, defaultData, wrapperCustomStyle} = config;
  if (!themeCss && !wrapperCustomStyle) {
    return null;
  }

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
      insertCustomStyle(
        themeCss,
        classNames,
        id,
        defaultData,
        env?.customStyleClassPrefix,
        env.getModalContainer?.().ownerDocument
      );
    }

    return () => {
      if (id && !styleIdCount.get(id)) {
        removeCustomStyle('', id, env.getModalContainer?.().ownerDocument);
      }
    };
  }, [themeCss, id]);

  useEffect(() => {
    if (wrapperCustomStyle && id) {
      insertEditCustomStyle(
        wrapperCustomStyle,
        id,
        env.getModalContainer?.().ownerDocument
      );
    }

    return () => {
      if (id && !styleIdCount.get(id)) {
        removeCustomStyle(
          'wrapperCustomStyle',
          id,
          env.getModalContainer?.().ownerDocument
        );
      }
    };
  }, [wrapperCustomStyle, id]);

  return null;
}
