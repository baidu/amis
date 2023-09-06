import {useEffect, useState} from 'react';
import type {RendererEnv} from '../env';
import type {CustomStyleClassName} from '../utils/style-helper';
import {insertCustomStyle, insertEditCustomStyle} from '../utils/style-helper';

interface CustomStyleProps {
  config: {
    wrapperCustomStyle?: any;
    componentId?: string;
  } & InsertCustomStyle;
  env: RendererEnv;
}

interface InsertCustomStyle {
  themeCss?: any;
  classNames?: CustomStyleClassName[];
  id?: string;
  defaultData?: any;
  customStyleClassPrefix?: string;
}

class StyleDom {
  id: string;
  constructor(id: string) {
    this.id = id;
  }
  /**
   * 插入自定义样式
   *
   * @param {InsertCustomStyle} params - 插入自定义样式的参数
   * @param {string} params.themeCss - 主题样式
   * @param {string} params.classNames - 自定义样式类名
   * @param {string} params.defaultData - 默认数据
   * @param {string} params.customStyleClassPrefix - 自定义样式类名前缀
   */
  insertCustomStyle({
    themeCss,
    classNames,
    defaultData,
    customStyleClassPrefix
  }: InsertCustomStyle) {
    insertCustomStyle(
      themeCss,
      classNames,
      this.id,
      defaultData,
      customStyleClassPrefix
    );
  }

  /**
   * 插入外层自定义样式
   *
   * @param wrapperCustomStyle 自定义样式
   */
  insertEditCustomStyle(wrapperCustomStyle: any) {
    insertEditCustomStyle(wrapperCustomStyle, this.id);
  }
  /**
   * 移除自定义样式
   */
  removeCustomStyle(type?: string) {
    const style = document.getElementById(
      (type ? type + '-' : '') + this.id.replace('u:', '')
    );
    if (style) {
      style.remove();
    }
  }
}

export default function (props: CustomStyleProps) {
  const {themeCss, classNames, id, defaultData, wrapperCustomStyle} =
    props.config;
  if (!themeCss && !wrapperCustomStyle) {
    return null;
  }
  const [styleDom] = useState(new StyleDom(id || ''));

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
