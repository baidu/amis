import {Icon, InputBox, FormulaPicker, FormItem, DataSchema} from 'amis';
import type {FormControlProps} from 'amis-core';
import React from 'react';
import {autobind} from '../../util';

class DataPickerControl extends React.Component<FormControlProps> {
  @autobind
  handleConfirm(value: string) {
    this.props.onChange(value);
  }

  @autobind
  async handlePickerOpen() {
    const {manager, node} = this.props;
    let variables:any = this.props.variables ?? this.props.data.variables;

    if (!variables) {
      await manager.getContextSchemas(node.info.id);
      variables = (manager.dataSchema as DataSchema).getDataPropsAsOptions();
    }
    
    return {
      variables: variables.map((item:any) => ({
        ...item,
        selectMode: 'tree'
      })),
      variableMode: 'tabs'
    };
  }

  render() {
    const {
      classnames: cx,
      value,
      onChange,
      disabled,
      manager,
      node
    } = this.props;

    return (
      <FormulaPicker
        onPickerOpen={this.handlePickerOpen}
        evalMode={false}
        onConfirm={this.handleConfirm}
        value={value}
        onChange={() => {}}
        header={''}
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
                onClick={onClick}
              >
                <Icon icon="info" className="icon" />
              </span>
            </InputBox>
          );
        }}
      </FormulaPicker>
    );
  }
}

@FormItem({
  type: 'ae-DataPickerControl',
  renderLabel: false
})
export class DataPickerControlRenderer extends DataPickerControl {}
