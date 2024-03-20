import {Attributes} from '../../../openxml/Attributes';
import {CT_Color, CT_Color_Attributes} from '../CT_Color';
import {CT_Cfvo, CT_Cfvo_Attributes} from './CT_Cfvo';

export type X14DataBar = {
  'minLength'?: number;
  'maxLength'?: number;
  'border'?: boolean;
  'gradient'?: boolean;
  'direction'?: 'leftToRight' | 'rightToLeft';
  'negativeBarBorderColorSameAsPositive'?: boolean;
  'negativeBarColorSameAsPositive'?: boolean;
  'x14:cfvo'?: CT_Cfvo[];
  'x14:borderColor'?: CT_Color;
  'x14:negativeFillColor'?: CT_Color;
  'x14:negativeBorderColor'?: CT_Color;
  'x14:axisColor'?: CT_Color;
};

export const X14DataBar_Attributes: Attributes = {
  'minLength': {
    type: 'int',
    defaultValue: '10'
  },
  'maxLength': {
    type: 'int',
    defaultValue: '90'
  },
  'border': {
    type: 'boolean',
    defaultValue: 'false'
  },
  'gradient': {
    type: 'boolean',
    defaultValue: 'true'
  },
  'direction': {
    type: 'string'
  },
  'negativeBarColorSameAsPositive': {
    type: 'boolean'
  },
  'negativeBarBorderColorSameAsPositive': {
    type: 'boolean',
    defaultValue: 'false'
  },
  'x14:cfvo': {
    type: 'child',
    childAttributes: CT_Cfvo_Attributes,
    childIsArray: true
  },
  'x14:borderColor': {
    type: 'child',
    childAttributes: CT_Color_Attributes
  },
  'x14:negativeFillColor': {
    type: 'child',
    childAttributes: CT_Color_Attributes
  },
  'x14:negativeBorderColor': {
    type: 'child',
    childAttributes: CT_Color_Attributes
  },
  'x14:axisColor': {
    type: 'child',
    childAttributes: CT_Color_Attributes
  }
};
