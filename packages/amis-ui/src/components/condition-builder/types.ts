import type {BaseApiObject, OperatorType} from 'amis-core';

export type FieldTypes =
  | 'text'
  | 'number'
  | 'boolean'
  | 'date'
  | 'time'
  | 'datetime'
  | 'select'
  | 'custom';

export type FieldItem = {
  type: 'text';
  operators: Array<OperatorType>;
};

interface customOperator {
  lable: string;
  value: string;
  values?: any[];
}

interface BaseField {
  type: FieldTypes;
  label: string;
  valueTypes?: Array<'value' | 'field' | 'func'>;
  operators?: Array<string | customOperator>;

  // valueTypes 里面配置 func 才有效。
  funcs?: Array<string>;

  defaultValue?: any;
  placeholder?: string;
  disabled?: boolean;
}

export type FieldGroup = {
  label: string;
  children: Array<FieldSimple>;
};

interface TextField extends BaseField {
  name: string;
  type: 'text';
  minLength?: number;
  maxLength?: number;
}

interface NumberField extends BaseField {
  name: string;
  type: 'number';
  maximum?: number;
  minimum?: number;
  step?: number;
  precision?: number;
}

interface DateField extends BaseField {
  name: string;
  type: 'date';
  format?: string;
  inputFormat?: string;
  minDate?: any;
  maxDate?: any;
}

interface TimeField extends BaseField {
  name: string;
  type: 'time';
  minTime?: any;
  maxTime?: any;
  format?: string;
  inputFormat?: string;
}

interface DatetimeField extends BaseField {
  type: 'datetime';
  name: string;
  format?: string;
  inputFormat?: string;
  timeFormat?: string;
}

interface SelectField extends BaseField {
  type: 'select';
  name: string;
  multiple?: boolean;
  options?: Array<any>;
  source?: string | BaseApiObject;
  searchable?: boolean;
  maxTagCount?: number;
  overflowTagPopover?: any;
  /**
   * 自动完成 API，当输入部分文字的时候，会将这些文字通过 ${term} 可以取到，发送给接口。
   * 接口可以返回匹配到的选项，帮助用户输入。
   */
  autoComplete?: string | BaseApiObject;
}

interface BooleanField extends BaseField {
  type: 'boolean';
  name: string;
}

export interface CustomField extends BaseField {
  type: 'custom';
  name: string;
  value: any;
}

interface GroupField {
  type: 'group';
  label: string;
  name: string;
  children: Array<FieldSimple>;
}

export type FieldSimple =
  | TextField
  | NumberField
  | DateField
  | TimeField
  | DatetimeField
  | SelectField
  | BooleanField
  | CustomField;

export type ConditionBuilderField = FieldSimple | FieldGroup | GroupField;

interface FuncGroup {
  label: string;
  children: Array<ConditionFieldFunc>;
}

export interface ConditionFieldFunc {
  type: string;
  returnType: FieldTypes;
  args: Array<ConditionBuilderFuncArg>;
  label: string;
}
export interface ConditionBuilderFuncArg extends BaseField {
  isOptional?: boolean;
}
export type ConditionBuilderFuncs = Array<ConditionFieldFunc | FuncGroup>;
export type ConditionBuilderFields = Array<ConditionBuilderField>;

export type ConditionBuilderType = {
  defaultOp?: OperatorType;
  operators: Array<OperatorType>;
  placeholder?: string;
  valueTypes?: Array<'value' | 'field' | 'func'>;
};
