/**
 * http://officeopenxml.com/WPshading.php
 */

export enum ShadingType {
  CLEAR = 'clear',
  DIAGONAL_CROSS = 'diagCross',
  DIAGONAL_STRIPE = 'diagStripe',
  HORIZONTAL_CROSS = 'horzCross',
  HORIZONTAL_STRIPE = 'horzStripe',
  NIL = 'nil',
  PERCENT_5 = 'pct5',
  PERCENT_10 = 'pct10',
  PERCENT_12 = 'pct12',
  PERCENT_15 = 'pct15',
  PERCENT_20 = 'pct20',
  PERCENT_25 = 'pct25',
  PERCENT_30 = 'pct30',
  PERCENT_35 = 'pct35',
  PERCENT_37 = 'pct37',
  PERCENT_40 = 'pct40',
  PERCENT_45 = 'pct45',
  PERCENT_50 = 'pct50',
  PERCENT_55 = 'pct55',
  PERCENT_60 = 'pct60',
  PERCENT_62 = 'pct62',
  PERCENT_65 = 'pct65',
  PERCENT_70 = 'pct70',
  PERCENT_75 = 'pct75',
  PERCENT_80 = 'pct80',
  PERCENT_85 = 'pct85',
  PERCENT_87 = 'pct87',
  PERCENT_90 = 'pct90',
  PERCENT_95 = 'pct95',
  REVERSE_DIAGONAL_STRIPE = 'reverseDiagStripe',
  SOLID = 'solid',
  THIN_DIAGONAL_CROSS = 'thinDiagCross',
  THIN_DIAGONAL_STRIPE = 'thinDiagStripe',
  THIN_HORIZONTAL_CROSS = 'thinHorzCross',
  THIN_REVERSE_DIAGONAL_STRIPE = 'thinReverseDiagStripe',
  THIN_VERTICAL_STRIPE = 'thinVertStripe',
  VERTICAL_STRIPE = 'vertStripe'
}

export interface Shading {
  readonly fill?: string;
  readonly color?: string;
  readonly type?: ShadingType;
}
