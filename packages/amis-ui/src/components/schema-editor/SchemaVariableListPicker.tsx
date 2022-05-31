import React from 'react';
import {localeable, themeable} from 'amis-core';
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
  onPickerOpen?: (props: any) => any;
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
      title,
      selectMode,
      beforeBuildVariables,
      onPickerOpen
    } = this.props;

    return (
      <PickerContainer
        onPickerOpen={onPickerOpen}
        title={title ?? __('Select.placeholder')}
        bodyRender={({value, onChange, schemas: stateSchemas, isOpened}) => {
          return isOpened ? (
            <SchemaVariableList
              value={value?.value ?? value}
              onSelect={(value, schema) =>
                onChange({
                  value,
                  schema
                })
              }
              schemas={stateSchemas ?? schemas}
              selectMode={selectMode}
              beforeBuildVariables={beforeBuildVariables}
            />
          ) : (
            <></>
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
