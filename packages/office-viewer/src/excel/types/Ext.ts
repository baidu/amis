import {Attributes} from '../../openxml/Attributes';
import {
  X14ConditionalFormattings,
  X14ConditionalFormattings_Attributes
} from './X14CF/X14ConditionalFormattings';

import {
  X14SparklineGroups,
  X14SparklineGroups_Attributes
} from './X14Sparkline/X14SparklineGroups';

export type Ext = {
  'uri'?: string;
  'x14:id'?: string;
  'x14:conditionalFormattings'?: X14ConditionalFormattings;
  'x14:sparklineGroups'?: X14SparklineGroups;
};

export const Ext_Attributes: Attributes = {
  'uri': {
    type: 'string'
  },

  'x14:id': {
    type: 'child-string'
  },

  'x14:conditionalFormattings': {
    type: 'child',
    childAttributes: X14ConditionalFormattings_Attributes
  },

  'x14:sparklineGroups': {
    type: 'child',
    childAttributes: X14SparklineGroups_Attributes
  }
};
