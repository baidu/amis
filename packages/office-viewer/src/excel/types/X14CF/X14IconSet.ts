import {Attributes} from '../../../openxml/Attributes';
import {CT_Cfvo, CT_Cfvo_Attributes} from './CT_Cfvo';

export type ST_IconSetType =
  | '3Arrows'
  | '3ArrowsGray'
  | '3Flags'
  | '3TrafficLights1'
  | '3TrafficLights2'
  | '3Signs'
  | '3Symbols'
  | '3Symbols2'
  | '4Arrows'
  | '4ArrowsGray'
  | '4RedToBlack'
  | '4Rating'
  | '4TrafficLights'
  | '5Arrows'
  | '5ArrowsGray'
  | '5Rating'
  | '5Quarters';

export interface X14IconSet {
  cfvo?: CT_Cfvo[];
  iconSet?: ST_IconSetType;
  showValue?: boolean;
  percent?: boolean;
  reverse?: boolean;
}

export const X14IconSet_Attributes: Attributes = {
  cfvo: {
    type: 'child',
    childAttributes: CT_Cfvo_Attributes,
    childIsArray: true
  },
  iconSet: {
    type: 'string',
    defaultValue: '3TrafficLights1'
  },
  showValue: {
    type: 'boolean',
    defaultValue: 'true'
  },
  percent: {
    type: 'boolean',
    defaultValue: 'true'
  },
  reverse: {
    type: 'boolean',
    defaultValue: 'false'
  }
};
