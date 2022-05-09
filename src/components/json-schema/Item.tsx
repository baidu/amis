import React from 'react';
import InputBox from '../InputBox';
import NumberInput from '../NumberInput';
import Switch from '../Switch';
import {InputJSONSchemaArray} from './Array';
import type {InputJSONSchemaItemProps} from './index';
import {InputJSONSchemaObject} from './Object';

export function InputJSONSchemaItem(props: InputJSONSchemaItemProps) {
  const schema = props.schema;
  if (schema.type === 'object') {
    return <InputJSONSchemaObject {...props} />;
  } else if (schema.type === 'array') {
    return <InputJSONSchemaArray {...props} />;
  } else if (props.renderValue) {
    return props.renderValue(props.value, props.onChange, schema);
  } else if (schema.type == 'number') {
    return (
      <NumberInput
        value={props.value}
        onChange={props.onChange}
        placeholder={props.placeholder}
      />
    );
  } else if (schema.type == 'integer') {
    return (
      <NumberInput
        value={props.value}
        onChange={props.onChange}
        precision={0}
        placeholder={props.placeholder}
      />
    );
  } else if (schema.type == 'boolean') {
    return (
      <Switch value={props.value} onChange={props.onChange} className="mt-2" />
    );
  }

  return (
    <InputBox
      value={props.value}
      onChange={props.onChange}
      placeholder={props.placeholder}
    />
  );
}
