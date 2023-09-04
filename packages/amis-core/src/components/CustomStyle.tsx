import {useEffect} from 'react';
import type {RendererEnv} from '../env';
import type {CustomStyleClassName} from '../utils/style-helper';
import {insertCustomStyle, insertEditCustomStyle} from '../utils/style-helper';

interface CustomStyleProps {
  config: {
    themeCss?: any;
    classNames?: CustomStyleClassName[];
    id?: string;
    defaultData?: any;
    wrapperCustomStyle?: any;
    componentId?: string;
  };
  env: RendererEnv;
}

export default function (props: CustomStyleProps) {
  const {themeCss, classNames, id, defaultData, wrapperCustomStyle} =
    props.config;
  useEffect(() => {
    insertCustomStyle(
      themeCss,
      classNames,
      id,
      defaultData,
      props.env?.customStyleClassPrefix
    );
  }, [props.config.themeCss]);

  useEffect(() => {
    insertEditCustomStyle(wrapperCustomStyle, id);
  }, [props.config.wrapperCustomStyle]);

  return null;
}
