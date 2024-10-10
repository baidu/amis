import {Attributes} from '../../../openxml/Attributes';
import {X14CfRule, X14CfRule_Attributes} from './X14CfRule';

export type X14ConditionalFormatting = {
  'x14:cfRule'?: X14CfRule[];
};

export const X14ConditionalFormatting_Attributes: Attributes = {
  'x14:cfRule': {
    type: 'child',
    childAttributes: X14CfRule_Attributes,
    childIsArray: true
  }
};
