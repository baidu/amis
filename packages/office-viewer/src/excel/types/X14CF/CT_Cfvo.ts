import {Attributes} from '../../../openxml/Attributes';
import {ST_CfvoType} from './ST_CfvoType';

export interface CT_Cfvo {
  type?: ST_CfvoType;
  val?: string;
  gte?: boolean;
}

export const CT_Cfvo_Attributes: Attributes = {
  type: {
    type: 'string'
  },
  val: {
    type: 'string'
  },
  gte: {
    type: 'boolean',
    defaultValue: 'true'
  }
};
