import React from 'react';
import {localeable} from '../../locale';
import {themeable} from '../../theme';
import {autobind} from '../../utils/helper';
import PickerContainer from '../PickerContainer';
import SchemaVariableList, {
  SchemaVariableListProps
} from './SchemaVariableList';

export interface SchemaVariableListPickerProps extends SchemaVariableListProps {
  children: (props: {
    onClick: (e: React.MouseEvent) => void;
    setState: (state: any) => void;
    isOpened: boolean;
  }) => JSX.Element;
  value?: any;
  title?: string;
  onConfirm?: (value?: any) => void;
  onCancel?: () => void;
}

export class SchemaVariableListPicker extends React.Component<SchemaVariableListPickerProps> {
  render() {
    const {
      translate: __,
      schemas,
      value,
      onConfirm,
      onCancel,
      children,
      title
    } = this.props;

    return (
      <PickerContainer
        title={title ?? __('Select.placeholder')}
        bodyRender={({
          onClose,
          value,
          onChange,
          setState,
          schemas: stateSchemas,
          ...states
        }) => {
          return (
            <SchemaVariableList
              value={value?.value ?? value}
              onSelect={(value, schema) =>
                onChange({
                  value,
                  schema
                })
              }
              schemas={stateSchemas ?? schemas}
            />
          );
        }}
        value={value}
        onConfirm={onConfirm}
        onCancel={onCancel}
      >
        {children}
      </PickerContainer>
    );
  }
}

export default localeable(themeable(SchemaVariableListPicker));
