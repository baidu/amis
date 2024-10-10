import {IRElt} from './IRElt';

export interface RichText {
  type: 'rich';
  richText: IRElt[];
  t?: number;
  s?: number;
}
