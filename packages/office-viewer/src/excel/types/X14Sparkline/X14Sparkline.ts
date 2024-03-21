import {Attributes} from '../../../openxml/Attributes';

export type X14Sparkline = {
  'xm:f': string;
  'xm:sqref': string;
};

export const X14Sparkline_Attributes: Attributes = {
  'xm:f': {
    type: 'child-string'
  },
  'xm:sqref': {
    type: 'child-string'
  }
};
