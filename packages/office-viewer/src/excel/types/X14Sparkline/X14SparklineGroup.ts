/**
 * 目前先简单实现，后面再改成自动解析
 */

import {Attributes} from '../../../openxml/Attributes';
import {CT_Color, CT_Color_Attributes} from '../CT_Color';
import {X14Sparklines, X14Sparklines_Attributes} from './x14Sparklines';

export type ST_SparklineAxisMinMax = 'individual' | 'groupMax' | 'group';

export type X14SparklineGroup = {
  'displayEmptyCellsAs'?: 'gap' | 'zero' | 'span';
  'type'?: 'line' | 'column' | 'stacked';
  'markers'?: boolean;
  'manualMax'?: number;
  'manualMin'?: number;
  'lineWeight'?: number;
  'high'?: boolean;
  'low'?: boolean;
  'first'?: boolean;
  'last'?: boolean;
  'negative'?: boolean;
  'displayXAxis'?: boolean;
  'displayHidden'?: boolean;
  'minAxisType'?: ST_SparklineAxisMinMax;
  'maxAxisType'?: ST_SparklineAxisMinMax;
  'rightToLeft'?: boolean;
  'x14:colorSeries'?: CT_Color;
  'x14:colorNegative'?: CT_Color;
  'x14:colorAxis'?: CT_Color;
  'x14:colorMarkers'?: CT_Color;
  'x14:colorFirst'?: CT_Color;
  'x14:colorLast'?: CT_Color;
  'x14:colorHigh'?: CT_Color;
  'x14:colorLow'?: CT_Color;
  'x14:sparklines'?: X14Sparklines;
};

export const X14SparklineGroup_Attributes: Attributes = {
  'displayEmptyCellsAs': {
    type: 'string',
    defaultValue: 'gap'
  },
  'type': {
    type: 'string',
    defaultValue: 'line'
  },
  'markers': {
    type: 'boolean',
    defaultValue: false
  },
  'manualMax': {
    type: 'double'
  },
  'manualMin': {
    type: 'double'
  },
  'lineWeight': {
    type: 'double',
    defaultValue: 0.75
  },
  'high': {
    type: 'boolean',
    defaultValue: false
  },
  'low': {
    type: 'boolean',
    defaultValue: false
  },
  'first': {
    type: 'boolean',
    defaultValue: false
  },
  'last': {
    type: 'boolean',
    defaultValue: false
  },
  'negative': {
    type: 'boolean',
    defaultValue: false
  },
  'displayXAxis': {
    type: 'boolean',
    defaultValue: false
  },
  'displayHidden': {
    type: 'boolean',
    defaultValue: false
  },
  'minAxisType': {
    type: 'string',
    defaultValue: 'group'
  },
  'maxAxisType': {
    type: 'string',
    defaultValue: 'group'
  },
  'rightToLeft': {
    type: 'boolean',
    defaultValue: false
  },
  'x14:colorSeries': {
    type: 'child',
    childAttributes: CT_Color_Attributes
  },
  'x14:colorNegative': {
    type: 'child',
    childAttributes: CT_Color_Attributes
  },
  'x14:colorAxis': {
    type: 'child',
    childAttributes: CT_Color_Attributes
  },
  'x14:colorMarkers': {
    type: 'child',
    childAttributes: CT_Color_Attributes
  },
  'x14:colorFirst': {
    type: 'child',
    childAttributes: CT_Color_Attributes
  },
  'x14:colorLast': {
    type: 'child',
    childAttributes: CT_Color_Attributes
  },
  'x14:colorHigh': {
    type: 'child',
    childAttributes: CT_Color_Attributes
  },
  'x14:colorLow': {
    type: 'child',
    childAttributes: CT_Color_Attributes
  },
  'x14:sparklines': {
    type: 'child',
    childAttributes: X14Sparklines_Attributes
  }
};
