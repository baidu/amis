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
  const {themeCss, classNames, id, defaultData, wrapperCustomStyle} =
    props.config;
  if (!themeCss && !wrapperCustomStyle) {
    return null;
  }
  const styleDom = useRef(new StyleDom(id || '')).current;

  useEffect(() => {
    styleDom.insertCustomStyle({
      themeCss,
      classNames,
      defaultData,
      customStyleClassPrefix: props.env?.customStyleClassPrefix
    });
    return () => {
      styleDom.removeCustomStyle();
    };
  }, [props.config.themeCss]);

  useEffect(() => {
    styleDom.insertEditCustomStyle(wrapperCustomStyle);
    return () => {
      styleDom.removeCustomStyle('wrapperCustomStyle');
    };
  }, [props.config.wrapperCustomStyle]);

  return null;
}
