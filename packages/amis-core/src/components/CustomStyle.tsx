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

export default function (props: CustomStyleProps) {
  const {config, env} = props;
  const {themeCss, classNames, id, defaultData, wrapperCustomStyle} = config;
  if (!themeCss && !wrapperCustomStyle) {
    return null;
  }

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
      if (id) {
        removeCustomStyle('', id, env.getModalContainer?.().ownerDocument);
      }
    };
  }, [themeCss]);

  useEffect(() => {
    if (wrapperCustomStyle && id) {
      insertEditCustomStyle(
        wrapperCustomStyle,
        id,
        env.getModalContainer?.().ownerDocument
      );
    }

    return () => {
      if (id) {
        removeCustomStyle(
          'wrapperCustomStyle',
          id,
          env.getModalContainer?.().ownerDocument
        );
      }
    };
  }, [wrapperCustomStyle]);

  return null;
}
