import {ST_Border} from '../Types';

export interface BorderOptions {
  readonly style: ST_Border;
  /** Border color, in hex (eg 'FF00AA') */
  readonly color?: string;
  /** Size of the border in 1/8 pt */
  readonly size?: number;
  /** Spacing offset. Values are specified in pt */
  readonly space?: number;
}
