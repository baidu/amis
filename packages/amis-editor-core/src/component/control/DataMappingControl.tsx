import {Renderer} from 'amis';
import type {FormControlProps} from 'amis-core';
import React from 'react';
import {autobind} from '../../util';

export interface DataMappingProps extends FormControlProps {
  schema?: string;
}

export class DataMappingControl extends React.Component<DataMappingProps> {
  @autobind
  renderValue(value: any, onChange: (value: any) => void, schema: any) {
    const {render} = this.props;

    return render(
      'value',
      {
        type: 'ae-DataPickerControl',
        inputOnly: true,
        name: 'any'
      },
      {
        value,
        onChange
      }
    );
  }

  render() {
    const {schema, render, name, description, required, ...rest} = this.props;

    return render(
      'inner',
      {
        type: 'json-schema',
        schema,
        name,
        description,
        required
      },
      {
        ...rest,
        renderValue: this.renderValue
      }
    );

    // return (
    //   <InputJSONSchema
    //     {...rest}
    //     schema={this.state.schema}
    //     renderValue={this.renderValue}
    //   />
    // );
  }
}

@Renderer({
  type: 'ae-DataMappingControl'
})
export class DataMappingControlRenderer extends DataMappingControl {}
