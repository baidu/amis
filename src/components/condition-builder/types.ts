import {SchemaApi} from '../../Schema';
import {Api} from '../../types';

export type FieldTypes =
  | 'text'
  | 'number'
  | 'boolean'
  | 'date'
  | 'time'
  | 'datetime'
  | 'select';

export type OperatorType =
  | 'equal'
  | 'not_equal'
  | 'is_empty'
  | 'is_not_empty'
  | 'like'
  | 'not_like'
  | 'starts_with'
  | 'ends_with'
  | 'less'
  | 'less_or_equal'
  | 'greater'
  | 'greater_or_equal'
  | 'between'
  | 'not_between'
  | 'select_equals'
  | 'select_not_equals'
  | 'select_any_in'
  | 'select_not_any_in';

export type FieldItem = {
  type: 'text';
  operators: Array<OperatorType>;
};

export type ExpressionSimple = string | number | object | undefined;
export type ExpressionValue =
  | ExpressionSimple
  | {
      type: 'value';
      value: ExpressionSimple;
    };
export type ExpressionFunc = {
  type: 'func';
  func: string;
  args: Array<ExpressionComplex>;
};
export type ExpressionField = {
  type: 'field';
  field: string;
};
export type ExpressionFormula = {
  type: 'formula';
  value: string;
};

export type ExpressionComplex =
  | ExpressionValue
  | ExpressionFunc
  | ExpressionField
  | ExpressionFormula;

export interface ConditionRule {
  id: any;
  left?: ExpressionComplex;
  op?: OperatorType;
  right?: ExpressionComplex | Array<ExpressionComplex>;
}

export interface ConditionGroupValue {
  id: string;
  conjunction: 'and' | 'or';
  not?: boolean;
  children?: Array<ConditionRule | ConditionGroupValue>;
}

export interface ConditionValue extends ConditionGroupValue {}

interface BaseField {
  type: FieldTypes;
  label: string;
  valueTypes?: Array<'value' | 'field' | 'func' | 'formula'>;
  operators?: Array<string>;

  // valueTypes 里面配置 func 才有效。
  funcs?: Array<string>;

  defaultValue?: any;
  placeholder?: string;
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
  source?: SchemaApi;
  searchable?: boolean;
}

interface BooleanField extends BaseField {
  type: 'boolean';
  name: string;
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
  | BooleanField;

export type Field = FieldSimple | FieldGroup | GroupField;

interface FuncGroup {
  label: string;
  children: Array<Func>;
}

export interface Func {
  type: string;
  returnType: FieldTypes;
  args: Array<FuncArg>;
  label: string;
}
export interface FuncArg extends BaseField {
  isOptional?: boolean;
}
export type Funcs = Array<Func | FuncGroup>;
export type Fields = Array<Field>;

export type Type = {
  defaultOp?: OperatorType;
  operators: Array<OperatorType>;
  placeholder?: string;
  valueTypes?: Array<'value' | 'field' | 'func' | 'formula'>;
};
