import {useEffect, useRef} from 'react';
import type {RendererEnv} from '../env';
import type {InsertCustomStyle} from '../utils/style-helper';
import {StyleDom} from '../utils/style-helper';

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
  const styleDom = useRef(new StyleDom(id || '')).current;

  useEffect(() => {
    if (themeCss && styleDom.id) {
      styleDom.insertCustomStyle({
        themeCss,
        classNames,
        defaultData,
        customStyleClassPrefix: env?.customStyleClassPrefix,
        doc: env.getModalContainer?.().ownerDocument
      });
    }

    return () => {
      styleDom.removeCustomStyle('', env.getModalContainer?.().ownerDocument);
    };
  }, [themeCss]);

  useEffect(() => {
    if (wrapperCustomStyle && styleDom.id) {
      styleDom.insertEditCustomStyle(
        wrapperCustomStyle,
        env.getModalContainer?.().ownerDocument
      );
    }

    return () => {
      styleDom.removeCustomStyle(
        'wrapperCustomStyle',
        env.getModalContainer?.().ownerDocument
      );
    };
  }, [wrapperCustomStyle]);

  return null;
}
