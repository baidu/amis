import React from 'react';
import {LocaleProps} from '../../locale';
import {ThemeProps} from '../../theme';
import type {JSONSchema} from '../../utils/DataScope';
import {autobind} from '../../utils/helper';
import Checkbox from '../Checkbox';
import InputBox from '../InputBox';
import Select from '../Select';
import {SchemaEditorItemArray} from './Array';
import {SchemaEditorItemCommon, SchemaEditorItemCommonProps} from './Common';
import {SchemaEditorItemObject} from './Object';

export interface SchemaEditorItemProps
  extends SchemaEditorItemCommonProps,
    LocaleProps,
    ThemeProps {}

export class SchemaEditorItem extends React.Component<SchemaEditorItemProps> {
  render() {
    const {value} = this.props;

    // 动态Component要用大写开头的才会被识别
    let Renderer = SchemaEditorItemCommon;
    switch (value?.type) {
      case 'object':
        Renderer = SchemaEditorItemObject as any;
        break;

      case 'array':
        Renderer = SchemaEditorItemArray as any;
        break;
    }

    return <Renderer {...this.props} />;
  }
}
