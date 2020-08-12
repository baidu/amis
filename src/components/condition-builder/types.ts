type TypedMap<T> = {
  [key: string]: T;
};

export type FieldTypes = 'text' | 'number' | 'boolean' | 'date' | 'datetime';

export type OperatorType =
  | 'equals'
  | 'not_equals'
  | 'less_than'
  | 'less_than_or_equals';

export type FieldItem = {
  type: 'text';
  operators: Array<OperatorType>;
};

export type ConditionRightValueLiteral = string | number | object | undefined;
export type ConditionRightValue =
  | ConditionRightValueLiteral
  | {
      type: 'raw';
      value: ConditionRightValueLiteral;
    }
  | {
      type: 'func';
      func: string;
      args: Array<ConditionRightValue>;
    }
  | {
      type: 'field';
      field: string;
    }
  | {
      type: 'expression';
      field: string;
    };

export interface ConditionRule {
  left: string;
  op: OperatorType;
  right: ConditionRightValue | Array<ConditionRightValue>;
}

export interface ConditionGroup {
  conjunction: 'and' | 'or';
  not?: boolean;
  children?: Array<ConditionRule | ConditionGroup>;
}

export interface ConditionValue extends ConditionGroup {}

interface BaseField {
  type: FieldTypes;
  label: string;
  valueTypes?: Array<'raw' | 'field' | 'func' | 'expression'>;

  // valueTypes 里面配置 func 才有效。
  funcs?: Array<string>;

  defaultValue?: any;
}

interface TextField extends BaseField {
  type: 'text';
}

type Field = TextField;

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
