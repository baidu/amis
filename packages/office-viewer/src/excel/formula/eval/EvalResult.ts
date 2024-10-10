export type EvalResult =
  | undefined
  | number
  | string
  | boolean
  | Date
  | ErrorResult
  | EvalResult[]
  | UnionValue
  | HyperlinkResult;

export type ErrorResult = {
  type: 'Error';
  value: string;
};

export type UnionValue = {
  type: 'Union';
  children: EvalResult[];
};

export type HyperlinkResult = {
  type: 'Hyperlink';
  text: string;
  link: string;
};

export function isUnionValue(value: EvalResult): boolean {
  return (
    value !== null &&
    typeof value === 'object' &&
    'type' in value &&
    value.type === 'Union'
  );
}

export function isErrorValue(value: EvalResult): boolean {
  return (
    value !== null &&
    typeof value === 'object' &&
    'type' in value &&
    value.type === 'Error'
  );
}
