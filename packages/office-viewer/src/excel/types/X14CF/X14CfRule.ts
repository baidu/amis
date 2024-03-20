import {X} from 'zrender';
import {Attributes} from '../../../openxml/Attributes';
import {X14DataBar, X14DataBar_Attributes} from './X14DataBar';
import {X14IconSet, X14IconSet_Attributes} from './X14IconSet';

export type X14CfRule = {
  'type'?: string;
  'id'?: string;

  'x14:dataBar'?: X14DataBar;

  'x14:iconSet'?: X14IconSet;
};

export const X14CfRule_Attributes: Attributes = {
  'type': {
    type: 'string'
  },
  'id': {
    type: 'string'
  },

  'x14:dataBar': {
    type: 'child',
    childAttributes: X14DataBar_Attributes
  },

  'x14:iconSet': {
    type: 'child',
    childAttributes: X14IconSet_Attributes
  }
};
