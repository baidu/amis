import React from 'react';
import {
  JSONSchema,
  localeable,
  LocaleProps,
  themeable,
  ThemeProps
} from 'amis-core';
import {InputJSONSchemaItem} from './Item';

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
}

export interface InputJSONSchemaProps
  extends Omit<InputJSONSchemaItemProps, 'schema'> {
  schema?: any;
}

function InputJSONSchema(props: InputJSONSchemaProps) {
  const schema = props.schema || {
    type: 'object',
    properties: {}
  };

  return <InputJSONSchemaItem {...props} schema={schema} />;
}

export default themeable(localeable(InputJSONSchema));
