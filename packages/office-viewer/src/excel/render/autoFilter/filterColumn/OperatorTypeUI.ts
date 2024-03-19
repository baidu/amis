export type OperatorTypeUI =
  | 'equal'
  | 'notEqual'
  | 'beginsWith'
  | 'notBeginsWith'
  | 'endsWith'
  | 'notEndsWith'
  | 'contains'
  | 'notContains'
  | 'greaterThan'
  | 'greaterThanOrEqual'
  | 'lessThan'
  | 'lessThanOrEqual';

export type OperatorOptions = {
  text: string;
  value: OperatorTypeUI;
};
