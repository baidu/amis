import {ST_LineSpacingRule} from '../Types';

export interface Spacing {
  readonly after?: number;
  readonly before?: number;
  readonly line?: number;
  readonly lineRule?: ST_LineSpacingRule;
  readonly beforeAutoSpacing?: boolean;
  readonly afterAutoSpacing?: boolean;
}
