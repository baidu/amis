import React from 'react';
import {LocaleProps} from '../../locale';
import {ThemeProps} from '../../theme';
import type {JSONSchema} from '../../utils/DataScope';
import {autobind} from '../../utils/helper';
import Checkbox from '../Checkbox';
import InputBox from '../InputBox';
import Select from '../Select';
import {SchemaEditorItemArray} from './Array';
import {SchemaEditorItemCommon} from './Common';
import {SchemaEditorItemObject} from './Object';

export interface SchemaEditorItemProps extends LocaleProps, ThemeProps {
  value?: JSONSchema;
  hasError?: boolean;
  onChange: (value: JSONSchema) => void;
  required?: boolean;
  onRequiredChange?: (value: boolean) => void;
  disabled?: boolean;
  renderExtraProps?: (
    value: JSONSchema,
    onChange: (value: JSONSchema) => void
  ) => JSX.Element;
  typeMutable?: boolean;
  showInfo?: boolean;
  prefix?: JSX.Element;
  affix?: JSX.Element;
}

export class SchemaEditorItem extends React.Component<SchemaEditorItemProps> {
  render() {
    const {
      value,
      onChange,
      typeMutable: mutable,
      locale,
      translate,
      classnames,
      classPrefix,
      showInfo,
      required,
      onRequiredChange,
      prefix,
      affix
    } = this.props;

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

    return (
      <Renderer
        value={value}
        onChange={onChange}
        typeMutable={mutable}
        showInfo={showInfo}
        locale={locale}
        translate={translate}
        classnames={classnames}
        classPrefix={classPrefix}
        required={required}
        onRequiredChange={onRequiredChange}
        prefix={prefix}
        affix={affix}
      />
    );
  }
}
