import {Icon, InputBox, SchemaVariableListPicker, FormItem} from 'amis';
import type {FormControlProps} from 'amis-core';
import React from 'react';
import {autobind} from '../../util';

export class DataBindingControl extends React.Component<FormControlProps> {
  @autobind
  handleConfirm(result: {value: string; schema: any}) {
    const {manager, data} = this.props;

    if (result?.value) {
      this.props.onChange(`${result.value}`);
      manager.config?.dataBindingChange?.(result.value, data, manager);
    }
  }

  @autobind
  async handlePickerOpen() {
    const {manager, node} = this.props;
    const withSuper = manager.config?.withSuperDataSchema ?? false;
    const schemas = await manager.getContextSchemas(node.info.id, !withSuper);
    return {schemas};
  }

  render() {
    const {classnames: cx, value, onChange, disabled} = this.props;

    return (
      <SchemaVariableListPicker
        onPickerOpen={this.handlePickerOpen}
        onConfirm={this.handleConfirm}
        title="绑定变量"
      >
        {({onClick, isOpened, setState}) => {
          return (
            <InputBox
              className="ae-InputVariable"
              clearable={false}
              value={value}
              onChange={onChange}
              disabled={disabled}
            >
              <span
                onClick={async e => {
                  onClick(e);
                }}
              >
                <Icon icon="info" className="icon cursor-pointer" />
              </span>
            </InputBox>
          );
        }}
      </SchemaVariableListPicker>
    );
  }
}

@FormItem({
  type: 'ae-DataBindingControl'
})
export class DataBindingControlRenderer extends DataBindingControl {}
