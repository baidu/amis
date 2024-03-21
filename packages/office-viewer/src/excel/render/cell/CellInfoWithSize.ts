import {CellInfo} from '../../types/CellInfo';

export type CellInfoWithSize = CellInfo & {
  width: number;
  height: number;
};
