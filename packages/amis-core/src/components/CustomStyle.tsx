import {useEffect, useMemo, useRef} from 'react';
import type {RendererEnv} from '../env';
import {
  removeCustomStyle,
  type InsertCustomStyle,
  insertCustomStyle,
  insertEditCustomStyle,
  hasExpression
} from '../utils/style-helper';
import isEmpty from 'lodash/isEmpty';

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

  const cssHasExpression = useMemo(() => {
    return (
      hasExpression(themeCss || {}) || hasExpression(wrapperCustomStyle || {})
    );
  }, [themeCss, wrapperCustomStyle]);

  let styleId = id;
  // 如果有变量 并且存在index变量则生成多个行
  if (typeof data?.index === 'number' && cssHasExpression) {
    styleId += `-${data.index}`;
  }

  useEffect(() => {
    if (styleIdCount.has(styleId)) {
      styleIdCount.set(styleId, styleIdCount.get(styleId) + 1);
    } else if (id) {
      styleIdCount.set(styleId, 1);
    }
    return () => {
      if (styleIdCount.has(styleId)) {
        styleIdCount.set(styleId, styleIdCount.get(styleId) - 1);
        if (styleIdCount.get(styleId) === 0) {
          styleIdCount.delete(styleId);
        }
      }
    };
  }, [styleId]);

  useEffect(() => {
    if (themeCss && id) {
      if (!isEmpty(themeCss)) {
        insertCustomStyle({
          themeCss,
          classNames,
          id,
          defaultData,
          customStyleClassPrefix: env?.customStyleClassPrefix,
          doc: env?.getModalContainer?.()?.ownerDocument,
          data,
          cssHasExpression
        });
      }
    }

    return () => {
      if (id && !styleIdCount.get(styleId)) {
        removeCustomStyle(
          '',
          id,
          env?.getModalContainer?.()?.ownerDocument,
          data,
          cssHasExpression
        );
      }
    };
  }, [
    themeCss,
    id,
    styleId,
    cssHasExpression,
    cssHasExpression ? data : undefined
  ]);

  useEffect(() => {
    if (wrapperCustomStyle && id) {
      if (!isEmpty(wrapperCustomStyle)) {
        insertEditCustomStyle({
          customStyle: wrapperCustomStyle,
          id,
          customStyleClassPrefix: env?.customStyleClassPrefix,
          doc: env?.getModalContainer?.()?.ownerDocument,
          data,
          cssHasExpression
        });
      }
    }

    return () => {
      if (id && !styleIdCount.get(styleId)) {
        removeCustomStyle(
          'wrapperCustomStyle',
          id,
          env?.getModalContainer?.()?.ownerDocument,
          data,
          cssHasExpression
        );
      }
    };
  }, [
    wrapperCustomStyle,
    id,
    styleId,
    cssHasExpression,
    cssHasExpression ? data : undefined
  ]);

  return null;
}
