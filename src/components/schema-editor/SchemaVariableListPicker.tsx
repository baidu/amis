import React from 'react';
import {localeable} from '../../locale';
import {autobind} from '../../utils/helper';
import PickerContainer from '../PickerContainer';
import SchemaVariableList, {
  SchemaVariableListProps
} from './SchemaVariableList';

export interface SchemaVariableListPickerProps extends SchemaVariableListProps {
  children: (props: {
    onClick: (e: React.MouseEvent) => void;
    isOpened: boolean;
  }) => JSX.Element;
  value?: any;
  onConfirm?: (value?: any) => void;
  onCancel?: () => void;
}

export class SchemaVariableListPicker extends React.Component<SchemaVariableListPickerProps> {
  @autobind
  handleConfirm() {}

  render() {
    const {
      translate: __,
      schemas,
      value,
      onConfirm,
      onCancel,
      children
    } = this.props;

    return (
      <PickerContainer
        title={__('Select.placeholder')}
        bodyRender={({onClose, value, onChange, setState, ...states}) => {
          return (
            <SchemaVariableList
              value={value}
              onSelect={(value, schema) =>
                onChange({
                  value,
                  schema
                })
              }
              schemas={schemas}
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

export default localeable(SchemaVariableListPicker);
