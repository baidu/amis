import {Attributes} from '../../openxml/Attributes';

export interface CT_Color {
  auto?: boolean;
  indexed?: number;
  rgb?: string;
  theme?: number;
  tint?: number;
}

export const CT_Color_Attributes: Attributes = {
  auto: {
    type: 'boolean'
  },
  indexed: {
    type: 'int'
  },
  rgb: {
    type: 'string'
  },
  theme: {
    type: 'int'
  },
  tint: {
    type: 'double',
    defaultValue: '0.0'
  }
};
