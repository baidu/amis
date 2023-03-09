import {ST_TabJc, ST_TabTlc} from '../Types';

export interface Tab {
  readonly type: ST_TabJc;
  readonly position: number;
  readonly leader?: ST_TabTlc;
}
