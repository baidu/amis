import React from 'react';
import {LocaleProps, ThemeProps} from 'amis-core';
import {
  ITEMMAP,
  SchemaEditorItemCommon,
  SchemaEditorItemCommonProps
} from './Common';

export interface SchemaEditorItemProps
  extends SchemaEditorItemCommonProps,
    LocaleProps,
    ThemeProps {}

export class SchemaEditorItem extends React.Component<SchemaEditorItemProps> {
  render() {
    const {value} = this.props;

    // 动态Component要用大写开头的才会被识别
    let Renderer =
      (value?.type && ITEMMAP[value?.type as string]) || SchemaEditorItemCommon;

    return (
      <Renderer {...this.props} key={(value?.type as string) || 'string'} />
    );
  }
}
