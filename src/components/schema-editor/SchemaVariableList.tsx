import React from 'react';
import {localeable, LocaleProps} from '../../locale';
import {themeable, ThemeProps} from '../../theme';
import {DataSchema} from '../../utils/DataSchema';
import type {JSONSchema} from '../../utils/DataScope';
import {autobind} from '../../utils/helper';
import {VariableItem} from '../formula/Editor';
import VariableList from '../formula/VariableList';
import TooltipWrapper from '../TooltipWrapper';

export interface SchemaVariableListProps extends LocaleProps, ThemeProps {
  schemas?: Array<JSONSchema> | JSONSchema;
  value?: string;
  onSelect?: (value: string, schema: JSONSchema) => void;
}

export interface SchemaVariableListState {
  variables: Array<VariableItem>;
}

export class SchemaVariableList extends React.Component<
  SchemaVariableListProps,
  SchemaVariableListState
> {
  state = {
    variables: this.schemasToVaraibles(this.props)
  };

  dataSchema?: DataSchema;

  constructor(props: SchemaVariableListProps) {
    super(props);
  }

  schemasToVaraibles(props: SchemaVariableListProps) {
    const schemas = Array.isArray(props.schemas)
      ? props.schemas.concat()
      : props.schemas
      ? [props.schemas]
      : [];

    if (!schemas.length) {
      return [];
    }
    const dataSchema = new DataSchema(schemas);
    this.dataSchema = dataSchema;
    return dataSchema.getDataPropsAsOptions();
  }

  @autobind
  handleSelect(item: any) {
    const {onSelect} = this.props;
    const schema = this.dataSchema?.getSchemaByPath(item.value);

    onSelect?.(item.value, schema!);
  }

  @autobind
  itemRender(option: any) {
    const {classnames: cx, translate: __} = this.props;

    return (
      <span className={cx(`FormulaEditor-VariableList-item`)}>
        <label>{option.label}</label>
        {option?.type ? (
          <TooltipWrapper tooltip={option.description} tooltipTheme="dark">
            <span className={cx(`FormulaEditor-VariableList-item-tag`)}>
              {__(`SchemaType.${option.type}`)}
            </span>
          </TooltipWrapper>
        ) : null}
      </span>
    );
  }

  render() {
    return (
      <VariableList
        data={this.state.variables}
        value={this.props.value}
        onSelect={this.handleSelect}
        selectMode="tree"
        itemRender={this.itemRender}
      />
    );
  }
}

export default localeable(themeable(SchemaVariableList));
