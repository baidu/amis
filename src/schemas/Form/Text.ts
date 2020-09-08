import {FormBaseControl} from './BaseItem';
import {ActionSchema} from '../Action';

export interface TextControlSchema extends FormBaseControl {
  type: 'text' | 'email' | 'password' | 'url';

  /**
   * 是否去除首尾空白
   */
  trimContents?: string;

  addOn?: (
    | ActionSchema
    | {
        type: 'text';
        label: string;
      }
  ) & {
    position?: 'left' | 'right';
  };
}
