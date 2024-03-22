import {Attributes} from '../../../openxml/Attributes';
import {X14Sparkline, X14Sparkline_Attributes} from './X14Sparkline';

export type X14Sparklines = {
  'x14:sparkline'?: X14Sparkline[];
};

export const X14Sparklines_Attributes: Attributes = {
  'x14:sparkline': {
    type: 'child',
    childAttributes: X14Sparkline_Attributes,
    childIsArray: true
  }
};
