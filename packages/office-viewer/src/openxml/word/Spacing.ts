export enum LineRuleType {
  AT_LEAST = 'atLeast',
  EXACTLY = 'exactly',
  EXACT = 'exact',
  AUTO = 'auto'
}
export interface Spacing {
  readonly after?: number;
  readonly before?: number;
  readonly line?: number;
  readonly lineRule?: LineRuleType;
  readonly beforeAutoSpacing?: boolean;
  readonly afterAutoSpacing?: boolean;
}
