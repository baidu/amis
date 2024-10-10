import React from 'react';
import InputBox from '../InputBox';
import NumberInput from '../NumberInput';
import Switch from '../Switch';
import {InputJSONSchemaArray} from './Array';
import type {InputJSONSchemaItemProps} from './index';
import InputJSONSchemaObject from './Object';
import {FormulaPicker} from '../formula/Picker';

export function InputJSONSchemaItem(props: InputJSONSchemaItemProps, ref: any) {
  const childRef = React.useRef<any>();
  React.useImperativeHandle(ref, () => {
    return {
      validate() {
        return childRef.current?.validate();
      }
    };
  });

  const schema = props.schema;
  const formua = props.formula;
  if (schema.type === 'object') {
    return <InputJSONSchemaObject {...props} ref={childRef} />;
  } else if (schema.type === 'array') {
    return <InputJSONSchemaArray {...props} />;
  } else if (props.renderValue) {
    return props.renderValue(props.value, props.onChange, schema, props);
  } else if (formua) {
    const inputSettings = React.useMemo(() => {
      const inputSettings: any = {
        ...formua.inputSettings
      };

      if (schema.type === 'number' || schema.type === 'integer') {
        inputSettings.type = 'number';
      } else if (schema.type === 'boolean') {
        inputSettings.type = 'boolean';
      }
      return inputSettings;
    }, [formua.inputSettings, schema.type]);
    return (
      <FormulaPicker
        mode="input-group"
        mixedMode={true}
        {...formua}
        inputSettings={inputSettings}
        value={props.value ?? schema.default}
        onChange={props.onChange}
        className={props.className}
        disabled={props.disabled}
        placeholder={props.placeholder}
        theme={props.theme}
        classPrefix={props.classPrefix}
        classnames={props.classnames}
        translate={props.translate}
        locale={props.locale}
      />
    );
  } else if (schema.type == 'number') {
    return (
      <NumberInput
        className={props.className}
        value={props.value ?? schema.default}
        onChange={props.onChange}
        placeholder={props.placeholder}
        mobileUI={props.mobileUI}
      />
    );
  } else if (schema.type == 'integer') {
    return (
      <NumberInput
        className={props.className}
        value={props.value ?? schema.default}
        onChange={props.onChange}
        precision={0}
        placeholder={props.placeholder}
        mobileUI={props.mobileUI}
      />
    );
  } else if (schema.type == 'boolean') {
    return (
      <Switch
        value={props.value ?? schema.default}
        onChange={props.onChange}
        className="mt-2"
      />
    );
  }

  return (
    <InputBox
      className={props.className}
      value={props.value ?? schema.default}
      onChange={props.onChange}
      placeholder={props.placeholder}
      mobileUI={props.mobileUI}
    />
  );
}

export default React.forwardRef(InputJSONSchemaItem);
