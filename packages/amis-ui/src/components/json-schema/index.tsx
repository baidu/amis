import React from 'react';
import {
  JSONSchema,
  localeable,
  LocaleProps,
  themeable,
  ThemeProps
} from 'amis-core';
import InputJSONSchemaItem from './Item';
import {FormulaPickerProps} from '../formula/Picker';

export interface InputJSONSchemaItemProps extends ThemeProps, LocaleProps {
  schema: JSONSchema & {
    [propName: string]: any;
  };
  value?: any;
  onChange?: any;
  disabled?: boolean;
  renderValue?: (
    value: any,
    onChange: (value: any) => void,
    schema: any,
    props: any
  ) => JSX.Element;
  renderKey?: (
    value: any,
    onChange: (value: any) => void,
    schema: any,
    props: any
  ) => JSX.Element;
  collapsable?: boolean;
  placeholder?: string;
  required?: boolean;
  addButtonText?: string;
  formula?: FormulaPickerProps;
  popOverContainer?: any;
  autoCreateMembers?: boolean;
}

export interface InputJSONSchemaProps
  extends Omit<InputJSONSchemaItemProps, 'schema'> {
  schema?: any;
}

function InputJSONSchema(props: InputJSONSchemaProps, ref: any) {
  const schema = props.schema || {
    type: 'object',
    properties: {}
  };

  const childRef = React.useRef<any>();

  React.useImperativeHandle(ref, () => {
    return {
      validate() {
        return childRef.current?.validate();
      }
    };
  });

  return <InputJSONSchemaItem {...props} schema={schema} ref={childRef} />;
}

export default themeable(localeable(React.forwardRef(InputJSONSchema)));
