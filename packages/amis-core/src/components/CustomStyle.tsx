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
    styleDom.insertCustomStyle({
      themeCss,
      classNames,
      defaultData,
      customStyleClassPrefix: env?.customStyleClassPrefix,
      doc: env.getModalDocument?.()
    });
    return () => {
      styleDom.removeCustomStyle('', env.getModalDocument?.());
    };
  }, [config.themeCss]);

  useEffect(() => {
    styleDom.insertEditCustomStyle(
      wrapperCustomStyle,
      env.getModalDocument?.()
    );
    return () => {
      styleDom.removeCustomStyle(
        'wrapperCustomStyle',
        env.getModalDocument?.()
      );
    };
  }, [config.wrapperCustomStyle]);

  return null;
}
