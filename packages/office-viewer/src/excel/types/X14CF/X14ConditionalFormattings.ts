import {Attributes} from '../../../openxml/Attributes';
import {
  X14ConditionalFormatting,
  X14ConditionalFormatting_Attributes
} from './X14ConditionalFormatting';

export type X14ConditionalFormattings = {
  'x14:conditionalFormatting'?: X14ConditionalFormatting[];
};

export const X14ConditionalFormattings_Attributes: Attributes = {
  'x14:conditionalFormatting': {
    type: 'child',
    childAttributes: X14ConditionalFormatting_Attributes,
    childIsArray: true
  }
};
