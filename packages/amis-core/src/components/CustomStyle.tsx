import type {RendererEnv} from '../env';
import type {CustomStyleClassName} from '../utils/style-helper';
import {insertCustomStyle} from '../utils/style-helper';

interface CustomStyleProps {
  config: {
    themeCss: any;
    classNames: CustomStyleClassName[];
    id?: string;
    defaultData?: any;
  };
  env: RendererEnv;
}

export default function (props: CustomStyleProps) {
  const {themeCss, classNames, id, defaultData} = props.config;
  insertCustomStyle(
    themeCss,
    classNames,
    id,
    defaultData,
    props.env?.customStyleClassPrefix
  );
  return null;
}
