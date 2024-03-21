import {Attributes} from './Attributes';

import {
  CT_ExtensionList,
  CT_ExtensionList_Attributes
} from './../excel/types/CT_ExtensionList';

export type ST_Lang = string;

export type ST_HexColorRGB = string;

export type ST_Panose = string;

export type ST_CalendarType =
  | 'gregorian'
  | 'gregorianUs'
  | 'gregorianMeFrench'
  | 'gregorianArabic'
  | 'hijri'
  | 'hebrew'
  | 'taiwan'
  | 'japan'
  | 'thai'
  | 'korea'
  | 'saka'
  | 'gregorianXlitEnglish'
  | 'gregorianXlitFrench'
  | 'none';

export type ST_Guid = string;

export type ST_OnOff = boolean;

export type ST_String = string;

export type ST_XmlName = string;

export type ST_UnsignedDecimalNumber = number;

export type ST_TwipsMeasure =
  | ST_UnsignedDecimalNumber
  | ST_PositiveUniversalMeasure;

export type ST_VerticalAlignRun = 'baseline' | 'superscript' | 'subscript';

export type ST_Xstring = string;

export type ST_XAlign = 'left' | 'center' | 'right' | 'inside' | 'outside';

export type ST_YAlign =
  | 'inline'
  | 'top'
  | 'center'
  | 'bottom'
  | 'inside'
  | 'outside';

export type ST_ConformanceClass = 'strict' | 'transitional';

export type ST_UniversalMeasure = string;

export type ST_PositiveUniversalMeasure = ST_UniversalMeasure;

export type ST_Percentage = string;

export type ST_FixedPercentage = string;

export type ST_PositivePercentage = string;

export type ST_PositiveFixedPercentage = string;

export interface CT_OfficeArtExtension {
  __any__?: any;
  uri?: string;
}

export const CT_OfficeArtExtension_Attributes: Attributes = {
  __any__: {
    type: 'any'
  },
  uri: {
    type: 'string'
  }
};

export interface CT_OfficeArtExtensionList {
  ext?: CT_OfficeArtExtension[];
}

export const CT_OfficeArtExtensionList_Attributes: Attributes = {
  ext: {
    type: 'child',
    childAttributes: CT_OfficeArtExtension_Attributes,
    childIsArray: true
  }
};

export interface CT_AudioFile {
  extLst?: CT_OfficeArtExtensionList;
  contentType?: string;
}

export const CT_AudioFile_Attributes: Attributes = {
  extLst: {
    type: 'child',
    childAttributes: CT_OfficeArtExtensionList_Attributes
  },
  contentType: {
    type: 'string'
  }
};

export interface CT_VideoFile {
  extLst?: CT_OfficeArtExtensionList;
  contentType?: string;
}

export const CT_VideoFile_Attributes: Attributes = {
  extLst: {
    type: 'child',
    childAttributes: CT_OfficeArtExtensionList_Attributes
  },
  contentType: {
    type: 'string'
  }
};

export interface CT_QuickTimeFile {
  extLst?: CT_OfficeArtExtensionList;
}

export const CT_QuickTimeFile_Attributes: Attributes = {
  extLst: {
    type: 'child',
    childAttributes: CT_OfficeArtExtensionList_Attributes
  }
};

export interface CT_AudioCDTime {
  track?: number;
  time?: number;
}

export const CT_AudioCDTime_Attributes: Attributes = {
  track: {
    type: 'int'
  },
  time: {
    type: 'int',
    defaultValue: '0'
  }
};

export interface CT_AudioCD {
  st?: CT_AudioCDTime;
  end?: CT_AudioCDTime;
  extLst?: CT_OfficeArtExtensionList;
}

export const CT_AudioCD_Attributes: Attributes = {
  st: {
    type: 'child',
    childAttributes: CT_AudioCDTime_Attributes
  },
  end: {
    type: 'child',
    childAttributes: CT_AudioCDTime_Attributes
  },
  extLst: {
    type: 'child',
    childAttributes: CT_OfficeArtExtensionList_Attributes
  }
};

export type ST_StyleMatrixColumnIndex = number;

export type ST_FontCollectionIndex = 'major' | 'minor' | 'none';

export type ST_ColorSchemeIndex =
  | 'dk1'
  | 'lt1'
  | 'dk2'
  | 'lt2'
  | 'accent1'
  | 'accent2'
  | 'accent3'
  | 'accent4'
  | 'accent5'
  | 'accent6'
  | 'hlink'
  | 'folHlink';

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

export interface CT_ColorScheme {
  dk1?: CT_Color;
  lt1?: CT_Color;
  dk2?: CT_Color;
  lt2?: CT_Color;
  accent1?: CT_Color;
  accent2?: CT_Color;
  accent3?: CT_Color;
  accent4?: CT_Color;
  accent5?: CT_Color;
  accent6?: CT_Color;
  hlink?: CT_Color;
  folHlink?: CT_Color;
  extLst?: CT_OfficeArtExtensionList;
  name?: string;
}

export const CT_ColorScheme_Attributes: Attributes = {
  dk1: {
    type: 'child',
    childAttributes: CT_Color_Attributes
  },
  lt1: {
    type: 'child',
    childAttributes: CT_Color_Attributes
  },
  dk2: {
    type: 'child',
    childAttributes: CT_Color_Attributes
  },
  lt2: {
    type: 'child',
    childAttributes: CT_Color_Attributes
  },
  accent1: {
    type: 'child',
    childAttributes: CT_Color_Attributes
  },
  accent2: {
    type: 'child',
    childAttributes: CT_Color_Attributes
  },
  accent3: {
    type: 'child',
    childAttributes: CT_Color_Attributes
  },
  accent4: {
    type: 'child',
    childAttributes: CT_Color_Attributes
  },
  accent5: {
    type: 'child',
    childAttributes: CT_Color_Attributes
  },
  accent6: {
    type: 'child',
    childAttributes: CT_Color_Attributes
  },
  hlink: {
    type: 'child',
    childAttributes: CT_Color_Attributes
  },
  folHlink: {
    type: 'child',
    childAttributes: CT_Color_Attributes
  },
  extLst: {
    type: 'child',
    childAttributes: CT_OfficeArtExtensionList_Attributes
  },
  name: {
    type: 'string'
  }
};

export interface CT_PositiveFixedPercentage {
  val?: ST_PositiveFixedPercentage;
}

export const CT_PositiveFixedPercentage_Attributes: Attributes = {
  val: {
    type: 'string'
  }
};

export interface CT_ComplementTransform {}

export const CT_ComplementTransform_Attributes: Attributes = {};

export interface CT_InverseTransform {}

export const CT_InverseTransform_Attributes: Attributes = {};

export interface CT_GrayscaleTransform {}

export const CT_GrayscaleTransform_Attributes: Attributes = {};

export interface CT_FixedPercentage {
  val?: ST_FixedPercentage;
}

export const CT_FixedPercentage_Attributes: Attributes = {
  val: {
    type: 'string'
  }
};

export interface CT_PositivePercentage {
  val?: ST_PositivePercentage;
}

export const CT_PositivePercentage_Attributes: Attributes = {
  val: {
    type: 'string'
  }
};

export type ST_PositiveFixedAngle = ST_Angle;

export interface CT_PositiveFixedAngle {
  val?: number;
}

export const CT_PositiveFixedAngle_Attributes: Attributes = {
  val: {
    type: 'int'
  }
};

export type ST_Angle = number;

export interface CT_Angle {
  val?: number;
}

export const CT_Angle_Attributes: Attributes = {
  val: {
    type: 'int'
  }
};

export interface CT_Percentage {
  val?: string;
}

export const CT_Percentage_Attributes: Attributes = {
  val: {
    type: 'string'
  }
};

export interface CT_GammaTransform {}

export const CT_GammaTransform_Attributes: Attributes = {};

export interface CT_InverseGammaTransform {}

export const CT_InverseGammaTransform_Attributes: Attributes = {};

export interface CT_ScRgbColor {
  tint?: CT_PositiveFixedPercentage;
  shade?: CT_PositiveFixedPercentage;
  comp?: CT_ComplementTransform;
  inv?: CT_InverseTransform;
  gray?: CT_GrayscaleTransform;
  alpha?: CT_PositiveFixedPercentage;
  alphaOff?: CT_FixedPercentage;
  alphaMod?: CT_PositivePercentage;
  hue?: CT_PositiveFixedAngle;
  hueOff?: CT_Angle;
  hueMod?: CT_PositivePercentage;
  sat?: CT_Percentage;
  satOff?: CT_Percentage;
  satMod?: CT_Percentage;
  lum?: CT_Percentage;
  lumOff?: CT_Percentage;
  lumMod?: CT_Percentage;
  red?: CT_Percentage;
  redOff?: CT_Percentage;
  redMod?: CT_Percentage;
  green?: CT_Percentage;
  greenOff?: CT_Percentage;
  greenMod?: CT_Percentage;
  blue?: CT_Percentage;
  blueOff?: CT_Percentage;
  blueMod?: CT_Percentage;
  gamma?: CT_GammaTransform;
  invGamma?: CT_InverseGammaTransform;
  r?: string;
  g?: string;
  b?: string;
}

export const CT_ScRgbColor_Attributes: Attributes = {
  tint: {
    type: 'child',
    childAttributes: CT_PositiveFixedPercentage_Attributes
  },
  shade: {
    type: 'child',
    childAttributes: CT_PositiveFixedPercentage_Attributes
  },
  comp: {
    type: 'child',
    childAttributes: CT_ComplementTransform_Attributes
  },
  inv: {
    type: 'child',
    childAttributes: CT_InverseTransform_Attributes
  },
  gray: {
    type: 'child',
    childAttributes: CT_GrayscaleTransform_Attributes
  },
  alpha: {
    type: 'child',
    childAttributes: CT_PositiveFixedPercentage_Attributes
  },
  alphaOff: {
    type: 'child',
    childAttributes: CT_FixedPercentage_Attributes
  },
  alphaMod: {
    type: 'child',
    childAttributes: CT_PositivePercentage_Attributes
  },
  hue: {
    type: 'child',
    childAttributes: CT_PositiveFixedAngle_Attributes
  },
  hueOff: {
    type: 'child',
    childAttributes: CT_Angle_Attributes
  },
  hueMod: {
    type: 'child',
    childAttributes: CT_PositivePercentage_Attributes
  },
  sat: {
    type: 'child',
    childAttributes: CT_Percentage_Attributes
  },
  satOff: {
    type: 'child',
    childAttributes: CT_Percentage_Attributes
  },
  satMod: {
    type: 'child',
    childAttributes: CT_Percentage_Attributes
  },
  lum: {
    type: 'child',
    childAttributes: CT_Percentage_Attributes
  },
  lumOff: {
    type: 'child',
    childAttributes: CT_Percentage_Attributes
  },
  lumMod: {
    type: 'child',
    childAttributes: CT_Percentage_Attributes
  },
  red: {
    type: 'child',
    childAttributes: CT_Percentage_Attributes
  },
  redOff: {
    type: 'child',
    childAttributes: CT_Percentage_Attributes
  },
  redMod: {
    type: 'child',
    childAttributes: CT_Percentage_Attributes
  },
  green: {
    type: 'child',
    childAttributes: CT_Percentage_Attributes
  },
  greenOff: {
    type: 'child',
    childAttributes: CT_Percentage_Attributes
  },
  greenMod: {
    type: 'child',
    childAttributes: CT_Percentage_Attributes
  },
  blue: {
    type: 'child',
    childAttributes: CT_Percentage_Attributes
  },
  blueOff: {
    type: 'child',
    childAttributes: CT_Percentage_Attributes
  },
  blueMod: {
    type: 'child',
    childAttributes: CT_Percentage_Attributes
  },
  gamma: {
    type: 'child',
    childAttributes: CT_GammaTransform_Attributes
  },
  invGamma: {
    type: 'child',
    childAttributes: CT_InverseGammaTransform_Attributes
  },
  r: {
    type: 'string'
  },
  g: {
    type: 'string'
  },
  b: {
    type: 'string'
  }
};

export interface CT_SRgbColor {
  tint?: CT_PositiveFixedPercentage;
  shade?: CT_PositiveFixedPercentage;
  comp?: CT_ComplementTransform;
  inv?: CT_InverseTransform;
  gray?: CT_GrayscaleTransform;
  alpha?: CT_PositiveFixedPercentage;
  alphaOff?: CT_FixedPercentage;
  alphaMod?: CT_PositivePercentage;
  hue?: CT_PositiveFixedAngle;
  hueOff?: CT_Angle;
  hueMod?: CT_PositivePercentage;
  sat?: CT_Percentage;
  satOff?: CT_Percentage;
  satMod?: CT_Percentage;
  lum?: CT_Percentage;
  lumOff?: CT_Percentage;
  lumMod?: CT_Percentage;
  red?: CT_Percentage;
  redOff?: CT_Percentage;
  redMod?: CT_Percentage;
  green?: CT_Percentage;
  greenOff?: CT_Percentage;
  greenMod?: CT_Percentage;
  blue?: CT_Percentage;
  blueOff?: CT_Percentage;
  blueMod?: CT_Percentage;
  gamma?: CT_GammaTransform;
  invGamma?: CT_InverseGammaTransform;
  val?: string;
}

export const CT_SRgbColor_Attributes: Attributes = {
  tint: {
    type: 'child',
    childAttributes: CT_PositiveFixedPercentage_Attributes
  },
  shade: {
    type: 'child',
    childAttributes: CT_PositiveFixedPercentage_Attributes
  },
  comp: {
    type: 'child',
    childAttributes: CT_ComplementTransform_Attributes
  },
  inv: {
    type: 'child',
    childAttributes: CT_InverseTransform_Attributes
  },
  gray: {
    type: 'child',
    childAttributes: CT_GrayscaleTransform_Attributes
  },
  alpha: {
    type: 'child',
    childAttributes: CT_PositiveFixedPercentage_Attributes
  },
  alphaOff: {
    type: 'child',
    childAttributes: CT_FixedPercentage_Attributes
  },
  alphaMod: {
    type: 'child',
    childAttributes: CT_PositivePercentage_Attributes
  },
  hue: {
    type: 'child',
    childAttributes: CT_PositiveFixedAngle_Attributes
  },
  hueOff: {
    type: 'child',
    childAttributes: CT_Angle_Attributes
  },
  hueMod: {
    type: 'child',
    childAttributes: CT_PositivePercentage_Attributes
  },
  sat: {
    type: 'child',
    childAttributes: CT_Percentage_Attributes
  },
  satOff: {
    type: 'child',
    childAttributes: CT_Percentage_Attributes
  },
  satMod: {
    type: 'child',
    childAttributes: CT_Percentage_Attributes
  },
  lum: {
    type: 'child',
    childAttributes: CT_Percentage_Attributes
  },
  lumOff: {
    type: 'child',
    childAttributes: CT_Percentage_Attributes
  },
  lumMod: {
    type: 'child',
    childAttributes: CT_Percentage_Attributes
  },
  red: {
    type: 'child',
    childAttributes: CT_Percentage_Attributes
  },
  redOff: {
    type: 'child',
    childAttributes: CT_Percentage_Attributes
  },
  redMod: {
    type: 'child',
    childAttributes: CT_Percentage_Attributes
  },
  green: {
    type: 'child',
    childAttributes: CT_Percentage_Attributes
  },
  greenOff: {
    type: 'child',
    childAttributes: CT_Percentage_Attributes
  },
  greenMod: {
    type: 'child',
    childAttributes: CT_Percentage_Attributes
  },
  blue: {
    type: 'child',
    childAttributes: CT_Percentage_Attributes
  },
  blueOff: {
    type: 'child',
    childAttributes: CT_Percentage_Attributes
  },
  blueMod: {
    type: 'child',
    childAttributes: CT_Percentage_Attributes
  },
  gamma: {
    type: 'child',
    childAttributes: CT_GammaTransform_Attributes
  },
  invGamma: {
    type: 'child',
    childAttributes: CT_InverseGammaTransform_Attributes
  },
  val: {
    type: 'string'
  }
};

export interface CT_HslColor {
  tint?: CT_PositiveFixedPercentage;
  shade?: CT_PositiveFixedPercentage;
  comp?: CT_ComplementTransform;
  inv?: CT_InverseTransform;
  gray?: CT_GrayscaleTransform;
  alpha?: CT_PositiveFixedPercentage;
  alphaOff?: CT_FixedPercentage;
  alphaMod?: CT_PositivePercentage;
  hue?: number;
  hueOff?: CT_Angle;
  hueMod?: CT_PositivePercentage;
  sat?: string;
  satOff?: CT_Percentage;
  satMod?: CT_Percentage;
  lum?: string;
  lumOff?: CT_Percentage;
  lumMod?: CT_Percentage;
  red?: CT_Percentage;
  redOff?: CT_Percentage;
  redMod?: CT_Percentage;
  green?: CT_Percentage;
  greenOff?: CT_Percentage;
  greenMod?: CT_Percentage;
  blue?: CT_Percentage;
  blueOff?: CT_Percentage;
  blueMod?: CT_Percentage;
  gamma?: CT_GammaTransform;
  invGamma?: CT_InverseGammaTransform;
}

export const CT_HslColor_Attributes: Attributes = {
  tint: {
    type: 'child',
    childAttributes: CT_PositiveFixedPercentage_Attributes
  },
  shade: {
    type: 'child',
    childAttributes: CT_PositiveFixedPercentage_Attributes
  },
  comp: {
    type: 'child',
    childAttributes: CT_ComplementTransform_Attributes
  },
  inv: {
    type: 'child',
    childAttributes: CT_InverseTransform_Attributes
  },
  gray: {
    type: 'child',
    childAttributes: CT_GrayscaleTransform_Attributes
  },
  alpha: {
    type: 'child',
    childAttributes: CT_PositiveFixedPercentage_Attributes
  },
  alphaOff: {
    type: 'child',
    childAttributes: CT_FixedPercentage_Attributes
  },
  alphaMod: {
    type: 'child',
    childAttributes: CT_PositivePercentage_Attributes
  },
  hue: {
    type: 'int'
  },
  hueOff: {
    type: 'child',
    childAttributes: CT_Angle_Attributes
  },
  hueMod: {
    type: 'child',
    childAttributes: CT_PositivePercentage_Attributes
  },
  sat: {
    type: 'string'
  },
  satOff: {
    type: 'child',
    childAttributes: CT_Percentage_Attributes
  },
  satMod: {
    type: 'child',
    childAttributes: CT_Percentage_Attributes
  },
  lum: {
    type: 'string'
  },
  lumOff: {
    type: 'child',
    childAttributes: CT_Percentage_Attributes
  },
  lumMod: {
    type: 'child',
    childAttributes: CT_Percentage_Attributes
  },
  red: {
    type: 'child',
    childAttributes: CT_Percentage_Attributes
  },
  redOff: {
    type: 'child',
    childAttributes: CT_Percentage_Attributes
  },
  redMod: {
    type: 'child',
    childAttributes: CT_Percentage_Attributes
  },
  green: {
    type: 'child',
    childAttributes: CT_Percentage_Attributes
  },
  greenOff: {
    type: 'child',
    childAttributes: CT_Percentage_Attributes
  },
  greenMod: {
    type: 'child',
    childAttributes: CT_Percentage_Attributes
  },
  blue: {
    type: 'child',
    childAttributes: CT_Percentage_Attributes
  },
  blueOff: {
    type: 'child',
    childAttributes: CT_Percentage_Attributes
  },
  blueMod: {
    type: 'child',
    childAttributes: CT_Percentage_Attributes
  },
  gamma: {
    type: 'child',
    childAttributes: CT_GammaTransform_Attributes
  },
  invGamma: {
    type: 'child',
    childAttributes: CT_InverseGammaTransform_Attributes
  }
};

export type ST_SystemColorVal =
  | 'scrollBar'
  | 'background'
  | 'activeCaption'
  | 'inactiveCaption'
  | 'menu'
  | 'window'
  | 'windowFrame'
  | 'menuText'
  | 'windowText'
  | 'captionText'
  | 'activeBorder'
  | 'inactiveBorder'
  | 'appWorkspace'
  | 'highlight'
  | 'highlightText'
  | 'btnFace'
  | 'btnShadow'
  | 'grayText'
  | 'btnText'
  | 'inactiveCaptionText'
  | 'btnHighlight'
  | '3dDkShadow'
  | '3dLight'
  | 'infoText'
  | 'infoBk'
  | 'hotLight'
  | 'gradientActiveCaption'
  | 'gradientInactiveCaption'
  | 'menuHighlight'
  | 'menuBar';

export interface CT_SystemColor {
  tint?: CT_PositiveFixedPercentage;
  shade?: CT_PositiveFixedPercentage;
  comp?: CT_ComplementTransform;
  inv?: CT_InverseTransform;
  gray?: CT_GrayscaleTransform;
  alpha?: CT_PositiveFixedPercentage;
  alphaOff?: CT_FixedPercentage;
  alphaMod?: CT_PositivePercentage;
  hue?: CT_PositiveFixedAngle;
  hueOff?: CT_Angle;
  hueMod?: CT_PositivePercentage;
  sat?: CT_Percentage;
  satOff?: CT_Percentage;
  satMod?: CT_Percentage;
  lum?: CT_Percentage;
  lumOff?: CT_Percentage;
  lumMod?: CT_Percentage;
  red?: CT_Percentage;
  redOff?: CT_Percentage;
  redMod?: CT_Percentage;
  green?: CT_Percentage;
  greenOff?: CT_Percentage;
  greenMod?: CT_Percentage;
  blue?: CT_Percentage;
  blueOff?: CT_Percentage;
  blueMod?: CT_Percentage;
  gamma?: CT_GammaTransform;
  invGamma?: CT_InverseGammaTransform;
  val?: ST_SystemColorVal;
  lastClr?: string;
}

export const CT_SystemColor_Attributes: Attributes = {
  tint: {
    type: 'child',
    childAttributes: CT_PositiveFixedPercentage_Attributes
  },
  shade: {
    type: 'child',
    childAttributes: CT_PositiveFixedPercentage_Attributes
  },
  comp: {
    type: 'child',
    childAttributes: CT_ComplementTransform_Attributes
  },
  inv: {
    type: 'child',
    childAttributes: CT_InverseTransform_Attributes
  },
  gray: {
    type: 'child',
    childAttributes: CT_GrayscaleTransform_Attributes
  },
  alpha: {
    type: 'child',
    childAttributes: CT_PositiveFixedPercentage_Attributes
  },
  alphaOff: {
    type: 'child',
    childAttributes: CT_FixedPercentage_Attributes
  },
  alphaMod: {
    type: 'child',
    childAttributes: CT_PositivePercentage_Attributes
  },
  hue: {
    type: 'child',
    childAttributes: CT_PositiveFixedAngle_Attributes
  },
  hueOff: {
    type: 'child',
    childAttributes: CT_Angle_Attributes
  },
  hueMod: {
    type: 'child',
    childAttributes: CT_PositivePercentage_Attributes
  },
  sat: {
    type: 'child',
    childAttributes: CT_Percentage_Attributes
  },
  satOff: {
    type: 'child',
    childAttributes: CT_Percentage_Attributes
  },
  satMod: {
    type: 'child',
    childAttributes: CT_Percentage_Attributes
  },
  lum: {
    type: 'child',
    childAttributes: CT_Percentage_Attributes
  },
  lumOff: {
    type: 'child',
    childAttributes: CT_Percentage_Attributes
  },
  lumMod: {
    type: 'child',
    childAttributes: CT_Percentage_Attributes
  },
  red: {
    type: 'child',
    childAttributes: CT_Percentage_Attributes
  },
  redOff: {
    type: 'child',
    childAttributes: CT_Percentage_Attributes
  },
  redMod: {
    type: 'child',
    childAttributes: CT_Percentage_Attributes
  },
  green: {
    type: 'child',
    childAttributes: CT_Percentage_Attributes
  },
  greenOff: {
    type: 'child',
    childAttributes: CT_Percentage_Attributes
  },
  greenMod: {
    type: 'child',
    childAttributes: CT_Percentage_Attributes
  },
  blue: {
    type: 'child',
    childAttributes: CT_Percentage_Attributes
  },
  blueOff: {
    type: 'child',
    childAttributes: CT_Percentage_Attributes
  },
  blueMod: {
    type: 'child',
    childAttributes: CT_Percentage_Attributes
  },
  gamma: {
    type: 'child',
    childAttributes: CT_GammaTransform_Attributes
  },
  invGamma: {
    type: 'child',
    childAttributes: CT_InverseGammaTransform_Attributes
  },
  val: {
    type: 'string'
  },
  lastClr: {
    type: 'string'
  }
};

export type ST_SchemeColorVal =
  | 'bg1'
  | 'tx1'
  | 'bg2'
  | 'tx2'
  | 'accent1'
  | 'accent2'
  | 'accent3'
  | 'accent4'
  | 'accent5'
  | 'accent6'
  | 'hlink'
  | 'folHlink'
  | 'phClr'
  | 'dk1'
  | 'lt1'
  | 'dk2'
  | 'lt2';

export interface CT_SchemeColor {
  tint?: CT_PositiveFixedPercentage;
  shade?: CT_PositiveFixedPercentage;
  comp?: CT_ComplementTransform;
  inv?: CT_InverseTransform;
  gray?: CT_GrayscaleTransform;
  alpha?: CT_PositiveFixedPercentage;
  alphaOff?: CT_FixedPercentage;
  alphaMod?: CT_PositivePercentage;
  hue?: CT_PositiveFixedAngle;
  hueOff?: CT_Angle;
  hueMod?: CT_PositivePercentage;
  sat?: CT_Percentage;
  satOff?: CT_Percentage;
  satMod?: CT_Percentage;
  lum?: CT_Percentage;
  lumOff?: CT_Percentage;
  lumMod?: CT_Percentage;
  red?: CT_Percentage;
  redOff?: CT_Percentage;
  redMod?: CT_Percentage;
  green?: CT_Percentage;
  greenOff?: CT_Percentage;
  greenMod?: CT_Percentage;
  blue?: CT_Percentage;
  blueOff?: CT_Percentage;
  blueMod?: CT_Percentage;
  gamma?: CT_GammaTransform;
  invGamma?: CT_InverseGammaTransform;
  val?: ST_SchemeColorVal;
}

export const CT_SchemeColor_Attributes: Attributes = {
  tint: {
    type: 'child',
    childAttributes: CT_PositiveFixedPercentage_Attributes
  },
  shade: {
    type: 'child',
    childAttributes: CT_PositiveFixedPercentage_Attributes
  },
  comp: {
    type: 'child',
    childAttributes: CT_ComplementTransform_Attributes
  },
  inv: {
    type: 'child',
    childAttributes: CT_InverseTransform_Attributes
  },
  gray: {
    type: 'child',
    childAttributes: CT_GrayscaleTransform_Attributes
  },
  alpha: {
    type: 'child',
    childAttributes: CT_PositiveFixedPercentage_Attributes
  },
  alphaOff: {
    type: 'child',
    childAttributes: CT_FixedPercentage_Attributes
  },
  alphaMod: {
    type: 'child',
    childAttributes: CT_PositivePercentage_Attributes
  },
  hue: {
    type: 'child',
    childAttributes: CT_PositiveFixedAngle_Attributes
  },
  hueOff: {
    type: 'child',
    childAttributes: CT_Angle_Attributes
  },
  hueMod: {
    type: 'child',
    childAttributes: CT_PositivePercentage_Attributes
  },
  sat: {
    type: 'child',
    childAttributes: CT_Percentage_Attributes
  },
  satOff: {
    type: 'child',
    childAttributes: CT_Percentage_Attributes
  },
  satMod: {
    type: 'child',
    childAttributes: CT_Percentage_Attributes
  },
  lum: {
    type: 'child',
    childAttributes: CT_Percentage_Attributes
  },
  lumOff: {
    type: 'child',
    childAttributes: CT_Percentage_Attributes
  },
  lumMod: {
    type: 'child',
    childAttributes: CT_Percentage_Attributes
  },
  red: {
    type: 'child',
    childAttributes: CT_Percentage_Attributes
  },
  redOff: {
    type: 'child',
    childAttributes: CT_Percentage_Attributes
  },
  redMod: {
    type: 'child',
    childAttributes: CT_Percentage_Attributes
  },
  green: {
    type: 'child',
    childAttributes: CT_Percentage_Attributes
  },
  greenOff: {
    type: 'child',
    childAttributes: CT_Percentage_Attributes
  },
  greenMod: {
    type: 'child',
    childAttributes: CT_Percentage_Attributes
  },
  blue: {
    type: 'child',
    childAttributes: CT_Percentage_Attributes
  },
  blueOff: {
    type: 'child',
    childAttributes: CT_Percentage_Attributes
  },
  blueMod: {
    type: 'child',
    childAttributes: CT_Percentage_Attributes
  },
  gamma: {
    type: 'child',
    childAttributes: CT_GammaTransform_Attributes
  },
  invGamma: {
    type: 'child',
    childAttributes: CT_InverseGammaTransform_Attributes
  },
  val: {
    type: 'string'
  }
};

export type ST_PresetColorVal =
  | 'aliceBlue'
  | 'antiqueWhite'
  | 'aqua'
  | 'aquamarine'
  | 'azure'
  | 'beige'
  | 'bisque'
  | 'black'
  | 'blanchedAlmond'
  | 'blue'
  | 'blueViolet'
  | 'brown'
  | 'burlyWood'
  | 'cadetBlue'
  | 'chartreuse'
  | 'chocolate'
  | 'coral'
  | 'cornflowerBlue'
  | 'cornsilk'
  | 'crimson'
  | 'cyan'
  | 'darkBlue'
  | 'darkCyan'
  | 'darkGoldenrod'
  | 'darkGray'
  | 'darkGrey'
  | 'darkGreen'
  | 'darkKhaki'
  | 'darkMagenta'
  | 'darkOliveGreen'
  | 'darkOrange'
  | 'darkOrchid'
  | 'darkRed'
  | 'darkSalmon'
  | 'darkSeaGreen'
  | 'darkSlateBlue'
  | 'darkSlateGray'
  | 'darkSlateGrey'
  | 'darkTurquoise'
  | 'darkViolet'
  | 'dkBlue'
  | 'dkCyan'
  | 'dkGoldenrod'
  | 'dkGray'
  | 'dkGrey'
  | 'dkGreen'
  | 'dkKhaki'
  | 'dkMagenta'
  | 'dkOliveGreen'
  | 'dkOrange'
  | 'dkOrchid'
  | 'dkRed'
  | 'dkSalmon'
  | 'dkSeaGreen'
  | 'dkSlateBlue'
  | 'dkSlateGray'
  | 'dkSlateGrey'
  | 'dkTurquoise'
  | 'dkViolet'
  | 'deepPink'
  | 'deepSkyBlue'
  | 'dimGray'
  | 'dimGrey'
  | 'dodgerBlue'
  | 'firebrick'
  | 'floralWhite'
  | 'forestGreen'
  | 'fuchsia'
  | 'gainsboro'
  | 'ghostWhite'
  | 'gold'
  | 'goldenrod'
  | 'gray'
  | 'grey'
  | 'green'
  | 'greenYellow'
  | 'honeydew'
  | 'hotPink'
  | 'indianRed'
  | 'indigo'
  | 'ivory'
  | 'khaki'
  | 'lavender'
  | 'lavenderBlush'
  | 'lawnGreen'
  | 'lemonChiffon'
  | 'lightBlue'
  | 'lightCoral'
  | 'lightCyan'
  | 'lightGoldenrodYellow'
  | 'lightGray'
  | 'lightGrey'
  | 'lightGreen'
  | 'lightPink'
  | 'lightSalmon'
  | 'lightSeaGreen'
  | 'lightSkyBlue'
  | 'lightSlateGray'
  | 'lightSlateGrey'
  | 'lightSteelBlue'
  | 'lightYellow'
  | 'ltBlue'
  | 'ltCoral'
  | 'ltCyan'
  | 'ltGoldenrodYellow'
  | 'ltGray'
  | 'ltGrey'
  | 'ltGreen'
  | 'ltPink'
  | 'ltSalmon'
  | 'ltSeaGreen'
  | 'ltSkyBlue'
  | 'ltSlateGray'
  | 'ltSlateGrey'
  | 'ltSteelBlue'
  | 'ltYellow'
  | 'lime'
  | 'limeGreen'
  | 'linen'
  | 'magenta'
  | 'maroon'
  | 'medAquamarine'
  | 'medBlue'
  | 'medOrchid'
  | 'medPurple'
  | 'medSeaGreen'
  | 'medSlateBlue'
  | 'medSpringGreen'
  | 'medTurquoise'
  | 'medVioletRed'
  | 'mediumAquamarine'
  | 'mediumBlue'
  | 'mediumOrchid'
  | 'mediumPurple'
  | 'mediumSeaGreen'
  | 'mediumSlateBlue'
  | 'mediumSpringGreen'
  | 'mediumTurquoise'
  | 'mediumVioletRed'
  | 'midnightBlue'
  | 'mintCream'
  | 'mistyRose'
  | 'moccasin'
  | 'navajoWhite'
  | 'navy'
  | 'oldLace'
  | 'olive'
  | 'oliveDrab'
  | 'orange'
  | 'orangeRed'
  | 'orchid'
  | 'paleGoldenrod'
  | 'paleGreen'
  | 'paleTurquoise'
  | 'paleVioletRed'
  | 'papayaWhip'
  | 'peachPuff'
  | 'peru'
  | 'pink'
  | 'plum'
  | 'powderBlue'
  | 'purple'
  | 'red'
  | 'rosyBrown'
  | 'royalBlue'
  | 'saddleBrown'
  | 'salmon'
  | 'sandyBrown'
  | 'seaGreen'
  | 'seaShell'
  | 'sienna'
  | 'silver'
  | 'skyBlue'
  | 'slateBlue'
  | 'slateGray'
  | 'slateGrey'
  | 'snow'
  | 'springGreen'
  | 'steelBlue'
  | 'tan'
  | 'teal'
  | 'thistle'
  | 'tomato'
  | 'turquoise'
  | 'violet'
  | 'wheat'
  | 'white'
  | 'whiteSmoke'
  | 'yellow'
  | 'yellowGreen';

export interface CT_PresetColor {
  tint?: CT_PositiveFixedPercentage;
  shade?: CT_PositiveFixedPercentage;
  comp?: CT_ComplementTransform;
  inv?: CT_InverseTransform;
  gray?: CT_GrayscaleTransform;
  alpha?: CT_PositiveFixedPercentage;
  alphaOff?: CT_FixedPercentage;
  alphaMod?: CT_PositivePercentage;
  hue?: CT_PositiveFixedAngle;
  hueOff?: CT_Angle;
  hueMod?: CT_PositivePercentage;
  sat?: CT_Percentage;
  satOff?: CT_Percentage;
  satMod?: CT_Percentage;
  lum?: CT_Percentage;
  lumOff?: CT_Percentage;
  lumMod?: CT_Percentage;
  red?: CT_Percentage;
  redOff?: CT_Percentage;
  redMod?: CT_Percentage;
  green?: CT_Percentage;
  greenOff?: CT_Percentage;
  greenMod?: CT_Percentage;
  blue?: CT_Percentage;
  blueOff?: CT_Percentage;
  blueMod?: CT_Percentage;
  gamma?: CT_GammaTransform;
  invGamma?: CT_InverseGammaTransform;
  val?: ST_PresetColorVal;
}

export const CT_PresetColor_Attributes: Attributes = {
  tint: {
    type: 'child',
    childAttributes: CT_PositiveFixedPercentage_Attributes
  },
  shade: {
    type: 'child',
    childAttributes: CT_PositiveFixedPercentage_Attributes
  },
  comp: {
    type: 'child',
    childAttributes: CT_ComplementTransform_Attributes
  },
  inv: {
    type: 'child',
    childAttributes: CT_InverseTransform_Attributes
  },
  gray: {
    type: 'child',
    childAttributes: CT_GrayscaleTransform_Attributes
  },
  alpha: {
    type: 'child',
    childAttributes: CT_PositiveFixedPercentage_Attributes
  },
  alphaOff: {
    type: 'child',
    childAttributes: CT_FixedPercentage_Attributes
  },
  alphaMod: {
    type: 'child',
    childAttributes: CT_PositivePercentage_Attributes
  },
  hue: {
    type: 'child',
    childAttributes: CT_PositiveFixedAngle_Attributes
  },
  hueOff: {
    type: 'child',
    childAttributes: CT_Angle_Attributes
  },
  hueMod: {
    type: 'child',
    childAttributes: CT_PositivePercentage_Attributes
  },
  sat: {
    type: 'child',
    childAttributes: CT_Percentage_Attributes
  },
  satOff: {
    type: 'child',
    childAttributes: CT_Percentage_Attributes
  },
  satMod: {
    type: 'child',
    childAttributes: CT_Percentage_Attributes
  },
  lum: {
    type: 'child',
    childAttributes: CT_Percentage_Attributes
  },
  lumOff: {
    type: 'child',
    childAttributes: CT_Percentage_Attributes
  },
  lumMod: {
    type: 'child',
    childAttributes: CT_Percentage_Attributes
  },
  red: {
    type: 'child',
    childAttributes: CT_Percentage_Attributes
  },
  redOff: {
    type: 'child',
    childAttributes: CT_Percentage_Attributes
  },
  redMod: {
    type: 'child',
    childAttributes: CT_Percentage_Attributes
  },
  green: {
    type: 'child',
    childAttributes: CT_Percentage_Attributes
  },
  greenOff: {
    type: 'child',
    childAttributes: CT_Percentage_Attributes
  },
  greenMod: {
    type: 'child',
    childAttributes: CT_Percentage_Attributes
  },
  blue: {
    type: 'child',
    childAttributes: CT_Percentage_Attributes
  },
  blueOff: {
    type: 'child',
    childAttributes: CT_Percentage_Attributes
  },
  blueMod: {
    type: 'child',
    childAttributes: CT_Percentage_Attributes
  },
  gamma: {
    type: 'child',
    childAttributes: CT_GammaTransform_Attributes
  },
  invGamma: {
    type: 'child',
    childAttributes: CT_InverseGammaTransform_Attributes
  },
  val: {
    type: 'string'
  }
};

export interface CT_CustomColor {
  scrgbClr?: CT_ScRgbColor;
  srgbClr?: CT_SRgbColor;
  hslClr?: CT_HslColor;
  sysClr?: CT_SystemColor;
  schemeClr?: CT_SchemeColor;
  prstClr?: CT_PresetColor;
  name?: string;
}

export const CT_CustomColor_Attributes: Attributes = {
  scrgbClr: {
    type: 'child',
    childAttributes: CT_ScRgbColor_Attributes
  },
  srgbClr: {
    type: 'child',
    childAttributes: CT_SRgbColor_Attributes
  },
  hslClr: {
    type: 'child',
    childAttributes: CT_HslColor_Attributes
  },
  sysClr: {
    type: 'child',
    childAttributes: CT_SystemColor_Attributes
  },
  schemeClr: {
    type: 'child',
    childAttributes: CT_SchemeColor_Attributes
  },
  prstClr: {
    type: 'child',
    childAttributes: CT_PresetColor_Attributes
  },
  name: {
    type: 'string'
  }
};

export type ST_TextTypeface = string;

export interface CT_SupplementalFont {
  script?: string;
  typeface?: string;
}

export const CT_SupplementalFont_Attributes: Attributes = {
  script: {
    type: 'string'
  },
  typeface: {
    type: 'string'
  }
};

export interface CT_CustomColorList {
  custClr?: CT_CustomColor[];
}

export const CT_CustomColorList_Attributes: Attributes = {
  custClr: {
    type: 'child',
    childAttributes: CT_CustomColor_Attributes,
    childIsArray: true
  }
};

export type ST_PitchFamily = number;

export interface CT_TextFont {
  typeface?: string;
  panose?: string;
  pitchFamily?: number;
  charset?: number;
}

export const CT_TextFont_Attributes: Attributes = {
  typeface: {
    type: 'string'
  },
  panose: {
    type: 'string'
  },
  pitchFamily: {
    type: 'int',
    defaultValue: '0'
  },
  charset: {
    type: 'int',
    defaultValue: '1'
  }
};

export interface CT_FontCollection {
  latin?: CT_TextFont;
  ea?: CT_TextFont;
  cs?: CT_TextFont;
  font?: CT_SupplementalFont[];
  extLst?: CT_OfficeArtExtensionList;
}

export const CT_FontCollection_Attributes: Attributes = {
  latin: {
    type: 'child',
    childAttributes: CT_TextFont_Attributes
  },
  ea: {
    type: 'child',
    childAttributes: CT_TextFont_Attributes
  },
  cs: {
    type: 'child',
    childAttributes: CT_TextFont_Attributes
  },
  font: {
    type: 'child',
    childAttributes: CT_SupplementalFont_Attributes,
    childIsArray: true
  },
  extLst: {
    type: 'child',
    childAttributes: CT_OfficeArtExtensionList_Attributes
  }
};

export type CT_EffectStyleItem = any;
export const CT_EffectStyleItem_Attributes: Attributes = {};

export type CT_EffectList = any;
export const CT_EffectList_Attributes: Attributes = {};

export type ST_PositiveCoordinate = number;

export interface CT_BlurEffect {
  rad?: number;
  grow?: boolean;
}

export const CT_BlurEffect_Attributes: Attributes = {
  rad: {
    type: 'int',
    defaultValue: '0'
  },
  grow: {
    type: 'boolean',
    defaultValue: 'true'
  }
};

export type CT_FillOverlayEffect = any;
export const CT_FillOverlayEffect_Attributes: Attributes = {};

export interface CT_NoFillProperties {}

export const CT_NoFillProperties_Attributes: Attributes = {};

export interface CT_SolidColorFillProperties {
  scrgbClr?: CT_ScRgbColor;
  srgbClr?: CT_SRgbColor;
  hslClr?: CT_HslColor;
  sysClr?: CT_SystemColor;
  schemeClr?: CT_SchemeColor;
  prstClr?: CT_PresetColor;
}

export const CT_SolidColorFillProperties_Attributes: Attributes = {
  scrgbClr: {
    type: 'child',
    childAttributes: CT_ScRgbColor_Attributes
  },
  srgbClr: {
    type: 'child',
    childAttributes: CT_SRgbColor_Attributes
  },
  hslClr: {
    type: 'child',
    childAttributes: CT_HslColor_Attributes
  },
  sysClr: {
    type: 'child',
    childAttributes: CT_SystemColor_Attributes
  },
  schemeClr: {
    type: 'child',
    childAttributes: CT_SchemeColor_Attributes
  },
  prstClr: {
    type: 'child',
    childAttributes: CT_PresetColor_Attributes
  }
};

export interface CT_GradientStop {
  color?: CT_Color;
  position?: number;
}

export const CT_GradientStop_Attributes: Attributes = {
  color: {
    type: 'child',
    childAttributes: CT_Color_Attributes
  },
  position: {
    type: 'double'
  }
};

export interface CT_GradientStopList {
  gs?: CT_GradientStop[];
}

export const CT_GradientStopList_Attributes: Attributes = {
  gs: {
    type: 'child',
    childAttributes: CT_GradientStop_Attributes,
    childIsArray: true
  }
};

export interface CT_LinearShadeProperties {
  ang?: number;
  scaled?: boolean;
}

export const CT_LinearShadeProperties_Attributes: Attributes = {
  ang: {
    type: 'int'
  },
  scaled: {
    type: 'boolean'
  }
};

export interface CT_RelativeRect {
  l?: string;
  t?: string;
  r?: string;
  b?: string;
}

export const CT_RelativeRect_Attributes: Attributes = {
  l: {
    type: 'string',
    defaultValue: '0%'
  },
  t: {
    type: 'string',
    defaultValue: '0%'
  },
  r: {
    type: 'string',
    defaultValue: '0%'
  },
  b: {
    type: 'string',
    defaultValue: '0%'
  }
};

export type ST_PathShadeType = 'shape' | 'circle' | 'rect';

export interface CT_PathShadeProperties {
  fillToRect?: CT_RelativeRect;
  path?: ST_PathShadeType;
}

export const CT_PathShadeProperties_Attributes: Attributes = {
  fillToRect: {
    type: 'child',
    childAttributes: CT_RelativeRect_Attributes
  },
  path: {
    type: 'string'
  }
};

export type ST_TileFlipMode = 'none' | 'x' | 'y' | 'xy';

export interface CT_GradientFillProperties {
  gsLst?: CT_GradientStopList;
  lin?: CT_LinearShadeProperties;
  path?: CT_PathShadeProperties;
  tileRect?: CT_RelativeRect;
  flip?: ST_TileFlipMode;
  rotWithShape?: boolean;
}

export const CT_GradientFillProperties_Attributes: Attributes = {
  gsLst: {
    type: 'child',
    childAttributes: CT_GradientStopList_Attributes
  },
  lin: {
    type: 'child',
    childAttributes: CT_LinearShadeProperties_Attributes
  },
  path: {
    type: 'child',
    childAttributes: CT_PathShadeProperties_Attributes
  },
  tileRect: {
    type: 'child',
    childAttributes: CT_RelativeRect_Attributes
  },
  flip: {
    type: 'string',
    defaultValue: 'none'
  },
  rotWithShape: {
    type: 'boolean'
  }
};

export interface CT_AlphaBiLevelEffect {
  thresh?: ST_PositiveFixedPercentage;
}

export const CT_AlphaBiLevelEffect_Attributes: Attributes = {
  thresh: {
    type: 'string'
  }
};

export interface CT_AlphaCeilingEffect {}

export const CT_AlphaCeilingEffect_Attributes: Attributes = {};

export interface CT_AlphaFloorEffect {}

export const CT_AlphaFloorEffect_Attributes: Attributes = {};

export interface CT_AlphaInverseEffect {
  scrgbClr?: CT_ScRgbColor;
  srgbClr?: CT_SRgbColor;
  hslClr?: CT_HslColor;
  sysClr?: CT_SystemColor;
  schemeClr?: CT_SchemeColor;
  prstClr?: CT_PresetColor;
}

export const CT_AlphaInverseEffect_Attributes: Attributes = {
  scrgbClr: {
    type: 'child',
    childAttributes: CT_ScRgbColor_Attributes
  },
  srgbClr: {
    type: 'child',
    childAttributes: CT_SRgbColor_Attributes
  },
  hslClr: {
    type: 'child',
    childAttributes: CT_HslColor_Attributes
  },
  sysClr: {
    type: 'child',
    childAttributes: CT_SystemColor_Attributes
  },
  schemeClr: {
    type: 'child',
    childAttributes: CT_SchemeColor_Attributes
  },
  prstClr: {
    type: 'child',
    childAttributes: CT_PresetColor_Attributes
  }
};

export type ST_EffectContainerType = 'sib' | 'tree';

export interface CT_EffectContainer {
  type?: ST_EffectContainerType;
  name?: string;
}

export const CT_EffectContainer_Attributes: Attributes = {
  type: {
    type: 'string',
    defaultValue: 'sib'
  },
  name: {
    type: 'string'
  }
};

export interface CT_AlphaModulateEffect {
  cont?: CT_EffectContainer;
}

export const CT_AlphaModulateEffect_Attributes: Attributes = {
  cont: {
    type: 'child',
    childAttributes: CT_EffectContainer_Attributes
  }
};

export interface CT_AlphaModulateFixedEffect {
  amt?: ST_PositivePercentage;
}

export const CT_AlphaModulateFixedEffect_Attributes: Attributes = {
  amt: {
    type: 'string',
    defaultValue: '100%'
  }
};

export interface CT_AlphaReplaceEffect {
  a?: ST_PositiveFixedPercentage;
}

export const CT_AlphaReplaceEffect_Attributes: Attributes = {
  a: {
    type: 'string'
  }
};

export interface CT_BiLevelEffect {
  thresh?: ST_PositiveFixedPercentage;
}

export const CT_BiLevelEffect_Attributes: Attributes = {
  thresh: {
    type: 'string'
  }
};

export interface CT_ColorChangeEffect {
  clrFrom?: CT_Color;
  clrTo?: CT_Color;
  useA?: boolean;
}

export const CT_ColorChangeEffect_Attributes: Attributes = {
  clrFrom: {
    type: 'child',
    childAttributes: CT_Color_Attributes
  },
  clrTo: {
    type: 'child',
    childAttributes: CT_Color_Attributes
  },
  useA: {
    type: 'boolean',
    defaultValue: 'true'
  }
};

export interface CT_ColorReplaceEffect {
  scrgbClr?: CT_ScRgbColor;
  srgbClr?: CT_SRgbColor;
  hslClr?: CT_HslColor;
  sysClr?: CT_SystemColor;
  schemeClr?: CT_SchemeColor;
  prstClr?: CT_PresetColor;
}

export const CT_ColorReplaceEffect_Attributes: Attributes = {
  scrgbClr: {
    type: 'child',
    childAttributes: CT_ScRgbColor_Attributes
  },
  srgbClr: {
    type: 'child',
    childAttributes: CT_SRgbColor_Attributes
  },
  hslClr: {
    type: 'child',
    childAttributes: CT_HslColor_Attributes
  },
  sysClr: {
    type: 'child',
    childAttributes: CT_SystemColor_Attributes
  },
  schemeClr: {
    type: 'child',
    childAttributes: CT_SchemeColor_Attributes
  },
  prstClr: {
    type: 'child',
    childAttributes: CT_PresetColor_Attributes
  }
};

export interface CT_DuotoneEffect {
  scrgbClr?: CT_ScRgbColor;
  srgbClr?: CT_SRgbColor;
  hslClr?: CT_HslColor;
  sysClr?: CT_SystemColor;
  schemeClr?: CT_SchemeColor;
  prstClr?: CT_PresetColor;
}

export const CT_DuotoneEffect_Attributes: Attributes = {
  scrgbClr: {
    type: 'child',
    childAttributes: CT_ScRgbColor_Attributes
  },
  srgbClr: {
    type: 'child',
    childAttributes: CT_SRgbColor_Attributes
  },
  hslClr: {
    type: 'child',
    childAttributes: CT_HslColor_Attributes
  },
  sysClr: {
    type: 'child',
    childAttributes: CT_SystemColor_Attributes
  },
  schemeClr: {
    type: 'child',
    childAttributes: CT_SchemeColor_Attributes
  },
  prstClr: {
    type: 'child',
    childAttributes: CT_PresetColor_Attributes
  }
};

export interface CT_GrayscaleEffect {}

export const CT_GrayscaleEffect_Attributes: Attributes = {};

export interface CT_HSLEffect {
  hue?: number;
  sat?: ST_FixedPercentage;
  lum?: ST_FixedPercentage;
}

export const CT_HSLEffect_Attributes: Attributes = {
  hue: {
    type: 'int',
    defaultValue: '0'
  },
  sat: {
    type: 'string',
    defaultValue: '0%'
  },
  lum: {
    type: 'string',
    defaultValue: '0%'
  }
};

export interface CT_LuminanceEffect {
  bright?: ST_FixedPercentage;
  contrast?: ST_FixedPercentage;
}

export const CT_LuminanceEffect_Attributes: Attributes = {
  bright: {
    type: 'string',
    defaultValue: '0%'
  },
  contrast: {
    type: 'string',
    defaultValue: '0%'
  }
};

export interface CT_TintEffect {
  hue?: number;
  amt?: ST_FixedPercentage;
}

export const CT_TintEffect_Attributes: Attributes = {
  hue: {
    type: 'int',
    defaultValue: '0'
  },
  amt: {
    type: 'string',
    defaultValue: '0%'
  }
};

export type ST_BlipCompression =
  | 'email'
  | 'screen'
  | 'print'
  | 'hqprint'
  | 'none';

export interface CT_Blip {
  alphaBiLevel?: CT_AlphaBiLevelEffect;
  alphaCeiling?: CT_AlphaCeilingEffect;
  alphaFloor?: CT_AlphaFloorEffect;
  alphaInv?: CT_AlphaInverseEffect;
  alphaMod?: CT_AlphaModulateEffect;
  alphaModFix?: CT_AlphaModulateFixedEffect;
  alphaRepl?: CT_AlphaReplaceEffect;
  biLevel?: CT_BiLevelEffect;
  blur?: CT_BlurEffect;
  clrChange?: CT_ColorChangeEffect;
  clrRepl?: CT_ColorReplaceEffect;
  duotone?: CT_DuotoneEffect;
  fillOverlay?: CT_FillOverlayEffect;
  grayscl?: CT_GrayscaleEffect;
  hsl?: CT_HSLEffect;
  lum?: CT_LuminanceEffect;
  tint?: CT_TintEffect;
  extLst?: CT_OfficeArtExtensionList;
  cstate?: ST_BlipCompression;
}

export const CT_Blip_Attributes: Attributes = {
  alphaBiLevel: {
    type: 'child',
    childAttributes: CT_AlphaBiLevelEffect_Attributes
  },
  alphaCeiling: {
    type: 'child',
    childAttributes: CT_AlphaCeilingEffect_Attributes
  },
  alphaFloor: {
    type: 'child',
    childAttributes: CT_AlphaFloorEffect_Attributes
  },
  alphaInv: {
    type: 'child',
    childAttributes: CT_AlphaInverseEffect_Attributes
  },
  alphaMod: {
    type: 'child',
    childAttributes: CT_AlphaModulateEffect_Attributes
  },
  alphaModFix: {
    type: 'child',
    childAttributes: CT_AlphaModulateFixedEffect_Attributes
  },
  alphaRepl: {
    type: 'child',
    childAttributes: CT_AlphaReplaceEffect_Attributes
  },
  biLevel: {
    type: 'child',
    childAttributes: CT_BiLevelEffect_Attributes
  },
  blur: {
    type: 'child',
    childAttributes: CT_BlurEffect_Attributes
  },
  clrChange: {
    type: 'child',
    childAttributes: CT_ColorChangeEffect_Attributes
  },
  clrRepl: {
    type: 'child',
    childAttributes: CT_ColorReplaceEffect_Attributes
  },
  duotone: {
    type: 'child',
    childAttributes: CT_DuotoneEffect_Attributes
  },
  fillOverlay: {
    type: 'child',
    childAttributes: CT_FillOverlayEffect_Attributes
  },
  grayscl: {
    type: 'child',
    childAttributes: CT_GrayscaleEffect_Attributes
  },
  hsl: {
    type: 'child',
    childAttributes: CT_HSLEffect_Attributes
  },
  lum: {
    type: 'child',
    childAttributes: CT_LuminanceEffect_Attributes
  },
  tint: {
    type: 'child',
    childAttributes: CT_TintEffect_Attributes
  },
  extLst: {
    type: 'child',
    childAttributes: CT_OfficeArtExtensionList_Attributes
  },
  cstate: {
    type: 'string',
    defaultValue: 'none'
  }
};

export type ST_Coordinate = ST_CoordinateUnqualified | ST_UniversalMeasure;

export type ST_RectAlignment =
  | 'tl'
  | 't'
  | 'tr'
  | 'l'
  | 'ctr'
  | 'r'
  | 'bl'
  | 'b'
  | 'br';

export interface CT_TileInfoProperties {
  tx?: ST_Coordinate;
  ty?: ST_Coordinate;
  sx?: string;
  sy?: string;
  flip?: ST_TileFlipMode;
  algn?: ST_RectAlignment;
}

export const CT_TileInfoProperties_Attributes: Attributes = {
  tx: {
    type: 'string'
  },
  ty: {
    type: 'string'
  },
  sx: {
    type: 'string'
  },
  sy: {
    type: 'string'
  },
  flip: {
    type: 'string',
    defaultValue: 'none'
  },
  algn: {
    type: 'string'
  }
};

export interface CT_StretchInfoProperties {
  fillRect?: CT_RelativeRect;
}

export const CT_StretchInfoProperties_Attributes: Attributes = {
  fillRect: {
    type: 'child',
    childAttributes: CT_RelativeRect_Attributes
  }
};

export interface CT_BlipFillProperties {
  blip?: CT_Blip;
  srcRect?: CT_RelativeRect;
  tile?: CT_TileInfoProperties;
  stretch?: CT_StretchInfoProperties;
  dpi?: number;
  rotWithShape?: boolean;
}

export const CT_BlipFillProperties_Attributes: Attributes = {
  blip: {
    type: 'child',
    childAttributes: CT_Blip_Attributes
  },
  srcRect: {
    type: 'child',
    childAttributes: CT_RelativeRect_Attributes
  },
  tile: {
    type: 'child',
    childAttributes: CT_TileInfoProperties_Attributes
  },
  stretch: {
    type: 'child',
    childAttributes: CT_StretchInfoProperties_Attributes
  },
  dpi: {
    type: 'int'
  },
  rotWithShape: {
    type: 'boolean'
  }
};

export type ST_PresetPatternVal =
  | 'pct5'
  | 'pct10'
  | 'pct20'
  | 'pct25'
  | 'pct30'
  | 'pct40'
  | 'pct50'
  | 'pct60'
  | 'pct70'
  | 'pct75'
  | 'pct80'
  | 'pct90'
  | 'horz'
  | 'vert'
  | 'ltHorz'
  | 'ltVert'
  | 'dkHorz'
  | 'dkVert'
  | 'narHorz'
  | 'narVert'
  | 'dashHorz'
  | 'dashVert'
  | 'cross'
  | 'dnDiag'
  | 'upDiag'
  | 'ltDnDiag'
  | 'ltUpDiag'
  | 'dkDnDiag'
  | 'dkUpDiag'
  | 'wdDnDiag'
  | 'wdUpDiag'
  | 'dashDnDiag'
  | 'dashUpDiag'
  | 'diagCross'
  | 'smCheck'
  | 'lgCheck'
  | 'smGrid'
  | 'lgGrid'
  | 'dotGrid'
  | 'smConfetti'
  | 'lgConfetti'
  | 'horzBrick'
  | 'diagBrick'
  | 'solidDmnd'
  | 'openDmnd'
  | 'dotDmnd'
  | 'plaid'
  | 'sphere'
  | 'weave'
  | 'divot'
  | 'shingle'
  | 'wave'
  | 'trellis'
  | 'zigZag';

export interface CT_PatternFillProperties {
  fgClr?: CT_Color;
  bgClr?: CT_Color;
  prst?: ST_PresetPatternVal;
}

export const CT_PatternFillProperties_Attributes: Attributes = {
  fgClr: {
    type: 'child',
    childAttributes: CT_Color_Attributes
  },
  bgClr: {
    type: 'child',
    childAttributes: CT_Color_Attributes
  },
  prst: {
    type: 'string'
  }
};

export interface CT_GroupFillProperties {}

export const CT_GroupFillProperties_Attributes: Attributes = {};

export type ST_BlendMode = 'over' | 'mult' | 'screen' | 'darken' | 'lighten';

export interface CT_GlowEffect {
  scrgbClr?: CT_ScRgbColor;
  srgbClr?: CT_SRgbColor;
  hslClr?: CT_HslColor;
  sysClr?: CT_SystemColor;
  schemeClr?: CT_SchemeColor;
  prstClr?: CT_PresetColor;
  rad?: number;
}

export const CT_GlowEffect_Attributes: Attributes = {
  scrgbClr: {
    type: 'child',
    childAttributes: CT_ScRgbColor_Attributes
  },
  srgbClr: {
    type: 'child',
    childAttributes: CT_SRgbColor_Attributes
  },
  hslClr: {
    type: 'child',
    childAttributes: CT_HslColor_Attributes
  },
  sysClr: {
    type: 'child',
    childAttributes: CT_SystemColor_Attributes
  },
  schemeClr: {
    type: 'child',
    childAttributes: CT_SchemeColor_Attributes
  },
  prstClr: {
    type: 'child',
    childAttributes: CT_PresetColor_Attributes
  },
  rad: {
    type: 'int',
    defaultValue: '0'
  }
};

export interface CT_InnerShadowEffect {
  scrgbClr?: CT_ScRgbColor;
  srgbClr?: CT_SRgbColor;
  hslClr?: CT_HslColor;
  sysClr?: CT_SystemColor;
  schemeClr?: CT_SchemeColor;
  prstClr?: CT_PresetColor;
  blurRad?: number;
  dist?: number;
  dir?: number;
}

export const CT_InnerShadowEffect_Attributes: Attributes = {
  scrgbClr: {
    type: 'child',
    childAttributes: CT_ScRgbColor_Attributes
  },
  srgbClr: {
    type: 'child',
    childAttributes: CT_SRgbColor_Attributes
  },
  hslClr: {
    type: 'child',
    childAttributes: CT_HslColor_Attributes
  },
  sysClr: {
    type: 'child',
    childAttributes: CT_SystemColor_Attributes
  },
  schemeClr: {
    type: 'child',
    childAttributes: CT_SchemeColor_Attributes
  },
  prstClr: {
    type: 'child',
    childAttributes: CT_PresetColor_Attributes
  },
  blurRad: {
    type: 'int',
    defaultValue: '0'
  },
  dist: {
    type: 'int',
    defaultValue: '0'
  },
  dir: {
    type: 'int',
    defaultValue: '0'
  }
};

export type ST_FixedAngle = ST_Angle;

export interface CT_OuterShadowEffect {
  scrgbClr?: CT_ScRgbColor;
  srgbClr?: CT_SRgbColor;
  hslClr?: CT_HslColor;
  sysClr?: CT_SystemColor;
  schemeClr?: CT_SchemeColor;
  prstClr?: CT_PresetColor;
  blurRad?: number;
  dist?: number;
  dir?: number;
  sx?: string;
  sy?: string;
  kx?: number;
  ky?: number;
  algn?: ST_RectAlignment;
  rotWithShape?: boolean;
}

export const CT_OuterShadowEffect_Attributes: Attributes = {
  scrgbClr: {
    type: 'child',
    childAttributes: CT_ScRgbColor_Attributes
  },
  srgbClr: {
    type: 'child',
    childAttributes: CT_SRgbColor_Attributes
  },
  hslClr: {
    type: 'child',
    childAttributes: CT_HslColor_Attributes
  },
  sysClr: {
    type: 'child',
    childAttributes: CT_SystemColor_Attributes
  },
  schemeClr: {
    type: 'child',
    childAttributes: CT_SchemeColor_Attributes
  },
  prstClr: {
    type: 'child',
    childAttributes: CT_PresetColor_Attributes
  },
  blurRad: {
    type: 'int',
    defaultValue: '0'
  },
  dist: {
    type: 'int',
    defaultValue: '0'
  },
  dir: {
    type: 'int',
    defaultValue: '0'
  },
  sx: {
    type: 'string',
    defaultValue: '100%'
  },
  sy: {
    type: 'string',
    defaultValue: '100%'
  },
  kx: {
    type: 'int',
    defaultValue: '0'
  },
  ky: {
    type: 'int',
    defaultValue: '0'
  },
  algn: {
    type: 'string',
    defaultValue: 'b'
  },
  rotWithShape: {
    type: 'boolean',
    defaultValue: 'true'
  }
};

export type ST_PresetShadowVal =
  | 'shdw1'
  | 'shdw2'
  | 'shdw3'
  | 'shdw4'
  | 'shdw5'
  | 'shdw6'
  | 'shdw7'
  | 'shdw8'
  | 'shdw9'
  | 'shdw10'
  | 'shdw11'
  | 'shdw12'
  | 'shdw13'
  | 'shdw14'
  | 'shdw15'
  | 'shdw16'
  | 'shdw17'
  | 'shdw18'
  | 'shdw19'
  | 'shdw20';

export interface CT_PresetShadowEffect {
  scrgbClr?: CT_ScRgbColor;
  srgbClr?: CT_SRgbColor;
  hslClr?: CT_HslColor;
  sysClr?: CT_SystemColor;
  schemeClr?: CT_SchemeColor;
  prstClr?: CT_PresetColor;
  prst?: ST_PresetShadowVal;
  dist?: number;
  dir?: number;
}

export const CT_PresetShadowEffect_Attributes: Attributes = {
  scrgbClr: {
    type: 'child',
    childAttributes: CT_ScRgbColor_Attributes
  },
  srgbClr: {
    type: 'child',
    childAttributes: CT_SRgbColor_Attributes
  },
  hslClr: {
    type: 'child',
    childAttributes: CT_HslColor_Attributes
  },
  sysClr: {
    type: 'child',
    childAttributes: CT_SystemColor_Attributes
  },
  schemeClr: {
    type: 'child',
    childAttributes: CT_SchemeColor_Attributes
  },
  prstClr: {
    type: 'child',
    childAttributes: CT_PresetColor_Attributes
  },
  prst: {
    type: 'string'
  },
  dist: {
    type: 'int',
    defaultValue: '0'
  },
  dir: {
    type: 'int',
    defaultValue: '0'
  }
};

export interface CT_ReflectionEffect {
  blurRad?: number;
  stA?: ST_PositiveFixedPercentage;
  stPos?: ST_PositiveFixedPercentage;
  endA?: ST_PositiveFixedPercentage;
  endPos?: ST_PositiveFixedPercentage;
  dist?: number;
  dir?: number;
  fadeDir?: number;
  sx?: string;
  sy?: string;
  kx?: number;
  ky?: number;
  algn?: ST_RectAlignment;
  rotWithShape?: boolean;
}

export const CT_ReflectionEffect_Attributes: Attributes = {
  blurRad: {
    type: 'int',
    defaultValue: '0'
  },
  stA: {
    type: 'string',
    defaultValue: '100%'
  },
  stPos: {
    type: 'string',
    defaultValue: '0%'
  },
  endA: {
    type: 'string',
    defaultValue: '0%'
  },
  endPos: {
    type: 'string',
    defaultValue: '100%'
  },
  dist: {
    type: 'int',
    defaultValue: '0'
  },
  dir: {
    type: 'int',
    defaultValue: '0'
  },
  fadeDir: {
    type: 'int',
    defaultValue: '5400000'
  },
  sx: {
    type: 'string',
    defaultValue: '100%'
  },
  sy: {
    type: 'string',
    defaultValue: '100%'
  },
  kx: {
    type: 'int',
    defaultValue: '0'
  },
  ky: {
    type: 'int',
    defaultValue: '0'
  },
  algn: {
    type: 'string',
    defaultValue: 'b'
  },
  rotWithShape: {
    type: 'boolean',
    defaultValue: 'true'
  }
};

export interface CT_SoftEdgesEffect {
  rad?: number;
}

export const CT_SoftEdgesEffect_Attributes: Attributes = {
  rad: {
    type: 'int'
  }
};

export interface CT_SphereCoords {
  lat?: number;
  lon?: number;
  rev?: number;
}

export const CT_SphereCoords_Attributes: Attributes = {
  lat: {
    type: 'int'
  },
  lon: {
    type: 'int'
  },
  rev: {
    type: 'int'
  }
};

export type ST_PresetCameraType =
  | 'legacyObliqueTopLeft'
  | 'legacyObliqueTop'
  | 'legacyObliqueTopRight'
  | 'legacyObliqueLeft'
  | 'legacyObliqueFront'
  | 'legacyObliqueRight'
  | 'legacyObliqueBottomLeft'
  | 'legacyObliqueBottom'
  | 'legacyObliqueBottomRight'
  | 'legacyPerspectiveTopLeft'
  | 'legacyPerspectiveTop'
  | 'legacyPerspectiveTopRight'
  | 'legacyPerspectiveLeft'
  | 'legacyPerspectiveFront'
  | 'legacyPerspectiveRight'
  | 'legacyPerspectiveBottomLeft'
  | 'legacyPerspectiveBottom'
  | 'legacyPerspectiveBottomRight'
  | 'orthographicFront'
  | 'isometricTopUp'
  | 'isometricTopDown'
  | 'isometricBottomUp'
  | 'isometricBottomDown'
  | 'isometricLeftUp'
  | 'isometricLeftDown'
  | 'isometricRightUp'
  | 'isometricRightDown'
  | 'isometricOffAxis1Left'
  | 'isometricOffAxis1Right'
  | 'isometricOffAxis1Top'
  | 'isometricOffAxis2Left'
  | 'isometricOffAxis2Right'
  | 'isometricOffAxis2Top'
  | 'isometricOffAxis3Left'
  | 'isometricOffAxis3Right'
  | 'isometricOffAxis3Bottom'
  | 'isometricOffAxis4Left'
  | 'isometricOffAxis4Right'
  | 'isometricOffAxis4Bottom'
  | 'obliqueTopLeft'
  | 'obliqueTop'
  | 'obliqueTopRight'
  | 'obliqueLeft'
  | 'obliqueRight'
  | 'obliqueBottomLeft'
  | 'obliqueBottom'
  | 'obliqueBottomRight'
  | 'perspectiveFront'
  | 'perspectiveLeft'
  | 'perspectiveRight'
  | 'perspectiveAbove'
  | 'perspectiveBelow'
  | 'perspectiveAboveLeftFacing'
  | 'perspectiveAboveRightFacing'
  | 'perspectiveContrastingLeftFacing'
  | 'perspectiveContrastingRightFacing'
  | 'perspectiveHeroicLeftFacing'
  | 'perspectiveHeroicRightFacing'
  | 'perspectiveHeroicExtremeLeftFacing'
  | 'perspectiveHeroicExtremeRightFacing'
  | 'perspectiveRelaxed'
  | 'perspectiveRelaxedModerately';

export type ST_FOVAngle = ST_Angle;

export interface CT_Camera {
  rot?: CT_SphereCoords;
  prst?: ST_PresetCameraType;
  fov?: number;
  zoom?: ST_PositivePercentage;
}

export const CT_Camera_Attributes: Attributes = {
  rot: {
    type: 'child',
    childAttributes: CT_SphereCoords_Attributes
  },
  prst: {
    type: 'string'
  },
  fov: {
    type: 'int'
  },
  zoom: {
    type: 'string',
    defaultValue: '100%'
  }
};

export type ST_LightRigType =
  | 'legacyFlat1'
  | 'legacyFlat2'
  | 'legacyFlat3'
  | 'legacyFlat4'
  | 'legacyNormal1'
  | 'legacyNormal2'
  | 'legacyNormal3'
  | 'legacyNormal4'
  | 'legacyHarsh1'
  | 'legacyHarsh2'
  | 'legacyHarsh3'
  | 'legacyHarsh4'
  | 'threePt'
  | 'balanced'
  | 'soft'
  | 'harsh'
  | 'flood'
  | 'contrasting'
  | 'morning'
  | 'sunrise'
  | 'sunset'
  | 'chilly'
  | 'freezing'
  | 'flat'
  | 'twoPt'
  | 'glow'
  | 'brightRoom';

export type ST_LightRigDirection =
  | 'tl'
  | 't'
  | 'tr'
  | 'l'
  | 'r'
  | 'bl'
  | 'b'
  | 'br';

export interface CT_LightRig {
  rot?: CT_SphereCoords;
  rig?: ST_LightRigType;
  dir?: ST_LightRigDirection;
}

export const CT_LightRig_Attributes: Attributes = {
  rot: {
    type: 'child',
    childAttributes: CT_SphereCoords_Attributes
  },
  rig: {
    type: 'string'
  },
  dir: {
    type: 'string'
  }
};

export interface CT_Point3D {
  x?: ST_Coordinate;
  y?: ST_Coordinate;
  z?: ST_Coordinate;
}

export const CT_Point3D_Attributes: Attributes = {
  x: {
    type: 'string'
  },
  y: {
    type: 'string'
  },
  z: {
    type: 'string'
  }
};

export interface CT_Vector3D {
  dx?: ST_Coordinate;
  dy?: ST_Coordinate;
  dz?: ST_Coordinate;
}

export const CT_Vector3D_Attributes: Attributes = {
  dx: {
    type: 'string'
  },
  dy: {
    type: 'string'
  },
  dz: {
    type: 'string'
  }
};

export interface CT_Backdrop {
  anchor?: CT_Point3D;
  norm?: CT_Vector3D;
  up?: CT_Vector3D;
  extLst?: CT_OfficeArtExtensionList;
}

export const CT_Backdrop_Attributes: Attributes = {
  anchor: {
    type: 'child',
    childAttributes: CT_Point3D_Attributes
  },
  norm: {
    type: 'child',
    childAttributes: CT_Vector3D_Attributes
  },
  up: {
    type: 'child',
    childAttributes: CT_Vector3D_Attributes
  },
  extLst: {
    type: 'child',
    childAttributes: CT_OfficeArtExtensionList_Attributes
  }
};

export interface CT_Scene3D {
  camera?: CT_Camera;
  lightRig?: CT_LightRig;
  backdrop?: CT_Backdrop;
  extLst?: CT_OfficeArtExtensionList;
}

export const CT_Scene3D_Attributes: Attributes = {
  camera: {
    type: 'child',
    childAttributes: CT_Camera_Attributes
  },
  lightRig: {
    type: 'child',
    childAttributes: CT_LightRig_Attributes
  },
  backdrop: {
    type: 'child',
    childAttributes: CT_Backdrop_Attributes
  },
  extLst: {
    type: 'child',
    childAttributes: CT_OfficeArtExtensionList_Attributes
  }
};

export type ST_BevelPresetType =
  | 'relaxedInset'
  | 'circle'
  | 'slope'
  | 'cross'
  | 'angle'
  | 'softRound'
  | 'convex'
  | 'coolSlant'
  | 'divot'
  | 'riblet'
  | 'hardEdge'
  | 'artDeco';

export interface CT_Bevel {
  w?: number;
  h?: number;
  prst?: ST_BevelPresetType;
}

export const CT_Bevel_Attributes: Attributes = {
  w: {
    type: 'int',
    defaultValue: '76200'
  },
  h: {
    type: 'int',
    defaultValue: '76200'
  },
  prst: {
    type: 'string',
    defaultValue: 'circle'
  }
};

export type ST_PresetMaterialType =
  | 'legacyMatte'
  | 'legacyPlastic'
  | 'legacyMetal'
  | 'legacyWireframe'
  | 'matte'
  | 'plastic'
  | 'metal'
  | 'warmMatte'
  | 'translucentPowder'
  | 'powder'
  | 'dkEdge'
  | 'softEdge'
  | 'clear'
  | 'flat'
  | 'softmetal';

export interface CT_Shape3D {
  bevelT?: CT_Bevel;
  bevelB?: CT_Bevel;
  extrusionClr?: CT_Color;
  contourClr?: CT_Color;
  extLst?: CT_OfficeArtExtensionList;
  z?: ST_Coordinate;
  extrusionH?: number;
  contourW?: number;
  prstMaterial?: ST_PresetMaterialType;
}

export const CT_Shape3D_Attributes: Attributes = {
  bevelT: {
    type: 'child',
    childAttributes: CT_Bevel_Attributes
  },
  bevelB: {
    type: 'child',
    childAttributes: CT_Bevel_Attributes
  },
  extrusionClr: {
    type: 'child',
    childAttributes: CT_Color_Attributes
  },
  contourClr: {
    type: 'child',
    childAttributes: CT_Color_Attributes
  },
  extLst: {
    type: 'child',
    childAttributes: CT_OfficeArtExtensionList_Attributes
  },
  z: {
    type: 'string',
    defaultValue: '0'
  },
  extrusionH: {
    type: 'int',
    defaultValue: '0'
  },
  contourW: {
    type: 'int',
    defaultValue: '0'
  },
  prstMaterial: {
    type: 'string',
    defaultValue: 'warmMatte'
  }
};

export interface CT_FillStyleList {
  noFill?: CT_NoFillProperties;
  solidFill?: CT_SolidColorFillProperties;
  gradFill?: CT_GradientFillProperties;
  blipFill?: CT_BlipFillProperties;
  pattFill?: CT_PatternFillProperties;
  grpFill?: CT_GroupFillProperties;
}

export const CT_FillStyleList_Attributes: Attributes = {
  noFill: {
    type: 'child',
    childAttributes: CT_NoFillProperties_Attributes
  },
  solidFill: {
    type: 'child',
    childAttributes: CT_SolidColorFillProperties_Attributes
  },
  gradFill: {
    type: 'child',
    childAttributes: CT_GradientFillProperties_Attributes
  },
  blipFill: {
    type: 'child',
    childAttributes: CT_BlipFillProperties_Attributes
  },
  pattFill: {
    type: 'child',
    childAttributes: CT_PatternFillProperties_Attributes
  },
  grpFill: {
    type: 'child',
    childAttributes: CT_GroupFillProperties_Attributes
  }
};

export type ST_PresetLineDashVal =
  | 'solid'
  | 'dot'
  | 'dash'
  | 'lgDash'
  | 'dashDot'
  | 'lgDashDot'
  | 'lgDashDotDot'
  | 'sysDash'
  | 'sysDot'
  | 'sysDashDot'
  | 'sysDashDotDot';

export interface CT_PresetLineDashProperties {
  val?: ST_PresetLineDashVal;
}

export const CT_PresetLineDashProperties_Attributes: Attributes = {
  val: {
    type: 'string'
  }
};

export interface CT_DashStop {
  d?: ST_PositivePercentage;
  sp?: ST_PositivePercentage;
}

export const CT_DashStop_Attributes: Attributes = {
  d: {
    type: 'string'
  },
  sp: {
    type: 'string'
  }
};

export interface CT_DashStopList {
  ds?: CT_DashStop[];
}

export const CT_DashStopList_Attributes: Attributes = {
  ds: {
    type: 'child',
    childAttributes: CT_DashStop_Attributes,
    childIsArray: true
  }
};

export interface CT_LineJoinRound {}

export const CT_LineJoinRound_Attributes: Attributes = {};

export interface CT_LineJoinBevel {}

export const CT_LineJoinBevel_Attributes: Attributes = {};

export interface CT_LineJoinMiterProperties {
  lim?: ST_PositivePercentage;
}

export const CT_LineJoinMiterProperties_Attributes: Attributes = {
  lim: {
    type: 'string'
  }
};

export type ST_LineEndType =
  | 'none'
  | 'triangle'
  | 'stealth'
  | 'diamond'
  | 'oval'
  | 'arrow';

export type ST_LineEndWidth = 'sm' | 'med' | 'lg';

export type ST_LineEndLength = 'sm' | 'med' | 'lg';

export interface CT_LineEndProperties {
  type?: ST_LineEndType;
  w?: ST_LineEndWidth;
  len?: ST_LineEndLength;
}

export const CT_LineEndProperties_Attributes: Attributes = {
  type: {
    type: 'string',
    defaultValue: 'none'
  },
  w: {
    type: 'string'
  },
  len: {
    type: 'string'
  }
};

export type ST_LineWidth = ST_Coordinate32Unqualified;

export type ST_LineCap = 'rnd' | 'sq' | 'flat';

export type ST_CompoundLine = 'sng' | 'dbl' | 'thickThin' | 'thinThick' | 'tri';

export type ST_PenAlignment = 'ctr' | 'in';

export interface CT_LineProperties {
  noFill?: CT_NoFillProperties;
  solidFill?: CT_SolidColorFillProperties;
  gradFill?: CT_GradientFillProperties;
  pattFill?: CT_PatternFillProperties;
  prstDash?: CT_PresetLineDashProperties;
  custDash?: CT_DashStopList;
  round?: CT_LineJoinRound;
  bevel?: CT_LineJoinBevel;
  miter?: CT_LineJoinMiterProperties;
  headEnd?: CT_LineEndProperties;
  tailEnd?: CT_LineEndProperties;
  extLst?: CT_OfficeArtExtensionList;
  w?: number;
  cap?: ST_LineCap;
  cmpd?: ST_CompoundLine;
  algn?: ST_PenAlignment;
}

export const CT_LineProperties_Attributes: Attributes = {
  noFill: {
    type: 'child',
    childAttributes: CT_NoFillProperties_Attributes
  },
  solidFill: {
    type: 'child',
    childAttributes: CT_SolidColorFillProperties_Attributes
  },
  gradFill: {
    type: 'child',
    childAttributes: CT_GradientFillProperties_Attributes
  },
  pattFill: {
    type: 'child',
    childAttributes: CT_PatternFillProperties_Attributes
  },
  prstDash: {
    type: 'child',
    childAttributes: CT_PresetLineDashProperties_Attributes
  },
  custDash: {
    type: 'child',
    childAttributes: CT_DashStopList_Attributes
  },
  round: {
    type: 'child',
    childAttributes: CT_LineJoinRound_Attributes
  },
  bevel: {
    type: 'child',
    childAttributes: CT_LineJoinBevel_Attributes
  },
  miter: {
    type: 'child',
    childAttributes: CT_LineJoinMiterProperties_Attributes
  },
  headEnd: {
    type: 'child',
    childAttributes: CT_LineEndProperties_Attributes
  },
  tailEnd: {
    type: 'child',
    childAttributes: CT_LineEndProperties_Attributes
  },
  extLst: {
    type: 'child',
    childAttributes: CT_OfficeArtExtensionList_Attributes
  },
  w: {
    type: 'int'
  },
  cap: {
    type: 'string'
  },
  cmpd: {
    type: 'string'
  },
  algn: {
    type: 'string'
  }
};

export interface CT_LineStyleList {
  ln?: CT_LineProperties[];
}

export const CT_LineStyleList_Attributes: Attributes = {
  ln: {
    type: 'child',
    childAttributes: CT_LineProperties_Attributes,
    childIsArray: true
  }
};

export interface CT_EffectStyleList {
  effectStyle?: CT_EffectStyleItem[];
}

export const CT_EffectStyleList_Attributes: Attributes = {
  effectStyle: {
    type: 'child',
    childAttributes: CT_EffectStyleItem_Attributes,
    childIsArray: true
  }
};

export interface CT_BackgroundFillStyleList {
  noFill?: CT_NoFillProperties;
  solidFill?: CT_SolidColorFillProperties;
  gradFill?: CT_GradientFillProperties;
  blipFill?: CT_BlipFillProperties;
  pattFill?: CT_PatternFillProperties;
  grpFill?: CT_GroupFillProperties;
}

export const CT_BackgroundFillStyleList_Attributes: Attributes = {
  noFill: {
    type: 'child',
    childAttributes: CT_NoFillProperties_Attributes
  },
  solidFill: {
    type: 'child',
    childAttributes: CT_SolidColorFillProperties_Attributes
  },
  gradFill: {
    type: 'child',
    childAttributes: CT_GradientFillProperties_Attributes
  },
  blipFill: {
    type: 'child',
    childAttributes: CT_BlipFillProperties_Attributes
  },
  pattFill: {
    type: 'child',
    childAttributes: CT_PatternFillProperties_Attributes
  },
  grpFill: {
    type: 'child',
    childAttributes: CT_GroupFillProperties_Attributes
  }
};

export interface CT_StyleMatrix {
  fillStyleLst?: CT_FillStyleList;
  lnStyleLst?: CT_LineStyleList;
  effectStyleLst?: CT_EffectStyleList;
  bgFillStyleLst?: CT_BackgroundFillStyleList;
  name?: string;
}

export const CT_StyleMatrix_Attributes: Attributes = {
  fillStyleLst: {
    type: 'child',
    childAttributes: CT_FillStyleList_Attributes
  },
  lnStyleLst: {
    type: 'child',
    childAttributes: CT_LineStyleList_Attributes
  },
  effectStyleLst: {
    type: 'child',
    childAttributes: CT_EffectStyleList_Attributes
  },
  bgFillStyleLst: {
    type: 'child',
    childAttributes: CT_BackgroundFillStyleList_Attributes
  },
  name: {
    type: 'string'
  }
};

export type ST_FontScheme = 'none' | 'major' | 'minor';

export interface CT_FontScheme {
  val?: ST_FontScheme;
}

export const CT_FontScheme_Attributes: Attributes = {
  val: {
    type: 'string'
  }
};

export interface CT_BaseStyles {
  clrScheme?: CT_ColorScheme;
  fontScheme?: CT_FontScheme;
  fmtScheme?: CT_StyleMatrix;
  extLst?: CT_OfficeArtExtensionList;
}

export const CT_BaseStyles_Attributes: Attributes = {
  clrScheme: {
    type: 'child',
    childAttributes: CT_ColorScheme_Attributes
  },
  fontScheme: {
    type: 'child',
    childAttributes: CT_FontScheme_Attributes
  },
  fmtScheme: {
    type: 'child',
    childAttributes: CT_StyleMatrix_Attributes
  },
  extLst: {
    type: 'child',
    childAttributes: CT_OfficeArtExtensionList_Attributes
  }
};

export type ST_CoordinateUnqualified = number;

export type ST_Coordinate32 = ST_Coordinate32Unqualified | ST_UniversalMeasure;

export type ST_Coordinate32Unqualified = number;

export type ST_PositiveCoordinate32 = ST_Coordinate32Unqualified;

export interface CT_Ratio {
  n?: number;
  d?: number;
}

export const CT_Ratio_Attributes: Attributes = {
  n: {
    type: 'int'
  },
  d: {
    type: 'int'
  }
};

export interface CT_Point2D {
  x?: ST_Coordinate;
  y?: ST_Coordinate;
}

export const CT_Point2D_Attributes: Attributes = {
  x: {
    type: 'string'
  },
  y: {
    type: 'string'
  }
};

export interface CT_PositiveSize2D {
  cx?: number;
  cy?: number;
}

export const CT_PositiveSize2D_Attributes: Attributes = {
  cx: {
    type: 'int'
  },
  cy: {
    type: 'int'
  }
};

export interface CT_Scale2D {
  sx?: CT_Ratio;
  sy?: CT_Ratio;
}

export const CT_Scale2D_Attributes: Attributes = {
  sx: {
    type: 'child',
    childAttributes: CT_Ratio_Attributes
  },
  sy: {
    type: 'child',
    childAttributes: CT_Ratio_Attributes
  }
};

export interface CT_Transform2D {
  off?: CT_Point2D;
  ext?: CT_PositiveSize2D;
  rot?: number;
  flipH?: boolean;
  flipV?: boolean;
}

export const CT_Transform2D_Attributes: Attributes = {
  off: {
    type: 'child',
    childAttributes: CT_Point2D_Attributes
  },
  ext: {
    type: 'child',
    childAttributes: CT_PositiveSize2D_Attributes
  },
  rot: {
    type: 'int',
    defaultValue: '0'
  },
  flipH: {
    type: 'boolean',
    defaultValue: 'false'
  },
  flipV: {
    type: 'boolean',
    defaultValue: 'false'
  }
};

export interface CT_GroupTransform2D {
  off?: CT_Point2D;
  ext?: CT_PositiveSize2D;
  chOff?: CT_Point2D;
  chExt?: CT_PositiveSize2D;
  rot?: number;
  flipH?: boolean;
  flipV?: boolean;
}

export const CT_GroupTransform2D_Attributes: Attributes = {
  off: {
    type: 'child',
    childAttributes: CT_Point2D_Attributes
  },
  ext: {
    type: 'child',
    childAttributes: CT_PositiveSize2D_Attributes
  },
  chOff: {
    type: 'child',
    childAttributes: CT_Point2D_Attributes
  },
  chExt: {
    type: 'child',
    childAttributes: CT_PositiveSize2D_Attributes
  },
  rot: {
    type: 'int',
    defaultValue: '0'
  },
  flipH: {
    type: 'boolean',
    defaultValue: 'false'
  },
  flipV: {
    type: 'boolean',
    defaultValue: 'false'
  }
};

export interface CT_ColorMRU {
  scrgbClr?: CT_ScRgbColor;
  srgbClr?: CT_SRgbColor;
  hslClr?: CT_HslColor;
  sysClr?: CT_SystemColor;
  schemeClr?: CT_SchemeColor;
  prstClr?: CT_PresetColor;
}

export const CT_ColorMRU_Attributes: Attributes = {
  scrgbClr: {
    type: 'child',
    childAttributes: CT_ScRgbColor_Attributes
  },
  srgbClr: {
    type: 'child',
    childAttributes: CT_SRgbColor_Attributes
  },
  hslClr: {
    type: 'child',
    childAttributes: CT_HslColor_Attributes
  },
  sysClr: {
    type: 'child',
    childAttributes: CT_SystemColor_Attributes
  },
  schemeClr: {
    type: 'child',
    childAttributes: CT_SchemeColor_Attributes
  },
  prstClr: {
    type: 'child',
    childAttributes: CT_PresetColor_Attributes
  }
};

export type ST_BlackWhiteMode =
  | 'clr'
  | 'auto'
  | 'gray'
  | 'ltGray'
  | 'invGray'
  | 'grayWhite'
  | 'blackGray'
  | 'blackWhite'
  | 'black'
  | 'white'
  | 'hidden';

export interface CT_EmbeddedWAVAudioFile {
  name?: string;
}

export const CT_EmbeddedWAVAudioFile_Attributes: Attributes = {
  name: {
    type: 'string'
  }
};

export type ST_DrawingElementId = number;

export interface CT_ConnectorLocking {
  extLst?: CT_OfficeArtExtensionList;
}

export const CT_ConnectorLocking_Attributes: Attributes = {
  extLst: {
    type: 'child',
    childAttributes: CT_OfficeArtExtensionList_Attributes
  }
};

export interface CT_ShapeLocking {
  extLst?: CT_OfficeArtExtensionList;
  noTextEdit?: boolean;
}

export const CT_ShapeLocking_Attributes: Attributes = {
  extLst: {
    type: 'child',
    childAttributes: CT_OfficeArtExtensionList_Attributes
  },
  noTextEdit: {
    type: 'boolean',
    defaultValue: 'false'
  }
};

export interface CT_PictureLocking {
  extLst?: CT_OfficeArtExtensionList;
  noCrop?: boolean;
}

export const CT_PictureLocking_Attributes: Attributes = {
  extLst: {
    type: 'child',
    childAttributes: CT_OfficeArtExtensionList_Attributes
  },
  noCrop: {
    type: 'boolean',
    defaultValue: 'false'
  }
};

export interface CT_GroupLocking {
  extLst?: CT_OfficeArtExtensionList;
  noGrp?: boolean;
  noUngrp?: boolean;
  noSelect?: boolean;
  noRot?: boolean;
  noChangeAspect?: boolean;
  noMove?: boolean;
  noResize?: boolean;
}

export const CT_GroupLocking_Attributes: Attributes = {
  extLst: {
    type: 'child',
    childAttributes: CT_OfficeArtExtensionList_Attributes
  },
  noGrp: {
    type: 'boolean',
    defaultValue: 'false'
  },
  noUngrp: {
    type: 'boolean',
    defaultValue: 'false'
  },
  noSelect: {
    type: 'boolean',
    defaultValue: 'false'
  },
  noRot: {
    type: 'boolean',
    defaultValue: 'false'
  },
  noChangeAspect: {
    type: 'boolean',
    defaultValue: 'false'
  },
  noMove: {
    type: 'boolean',
    defaultValue: 'false'
  },
  noResize: {
    type: 'boolean',
    defaultValue: 'false'
  }
};

export interface CT_GraphicalObjectFrameLocking {
  extLst?: CT_OfficeArtExtensionList;
  noGrp?: boolean;
  noDrilldown?: boolean;
  noSelect?: boolean;
  noChangeAspect?: boolean;
  noMove?: boolean;
  noResize?: boolean;
}

export const CT_GraphicalObjectFrameLocking_Attributes: Attributes = {
  extLst: {
    type: 'child',
    childAttributes: CT_OfficeArtExtensionList_Attributes
  },
  noGrp: {
    type: 'boolean',
    defaultValue: 'false'
  },
  noDrilldown: {
    type: 'boolean',
    defaultValue: 'false'
  },
  noSelect: {
    type: 'boolean',
    defaultValue: 'false'
  },
  noChangeAspect: {
    type: 'boolean',
    defaultValue: 'false'
  },
  noMove: {
    type: 'boolean',
    defaultValue: 'false'
  },
  noResize: {
    type: 'boolean',
    defaultValue: 'false'
  }
};

export interface CT_ContentPartLocking {
  extLst?: CT_OfficeArtExtensionList;
}

export const CT_ContentPartLocking_Attributes: Attributes = {
  extLst: {
    type: 'child',
    childAttributes: CT_OfficeArtExtensionList_Attributes
  }
};

export type ST_Ref = string;

export interface CT_Hyperlink {
  'ref'?: string;
  'r:id'?: string;
  'location'?: string;
  'tooltip'?: string;
  'display'?: string;
}

export const CT_Hyperlink_Attributes: Attributes = {
  'ref': {
    type: 'string'
  },
  'r:id': {
    type: 'string'
  },
  'location': {
    type: 'string'
  },
  'tooltip': {
    type: 'string'
  },
  'display': {
    type: 'string'
  }
};

export interface CT_NonVisualDrawingProps {
  hlinkClick?: CT_Hyperlink;
  hlinkHover?: CT_Hyperlink;
  extLst?: CT_OfficeArtExtensionList;
  id?: number;
  name?: string;
  descr?: string;
  hidden?: boolean;
  title?: string;
}

export const CT_NonVisualDrawingProps_Attributes: Attributes = {
  hlinkClick: {
    type: 'child',
    childAttributes: CT_Hyperlink_Attributes
  },
  hlinkHover: {
    type: 'child',
    childAttributes: CT_Hyperlink_Attributes
  },
  extLst: {
    type: 'child',
    childAttributes: CT_OfficeArtExtensionList_Attributes
  },
  id: {
    type: 'int'
  },
  name: {
    type: 'string'
  },
  descr: {
    type: 'string'
  },
  hidden: {
    type: 'boolean',
    defaultValue: 'false'
  },
  title: {
    type: 'string'
  }
};

export interface CT_NonVisualDrawingShapeProps {
  spLocks?: CT_ShapeLocking;
  extLst?: CT_OfficeArtExtensionList;
  txBox?: boolean;
}

export const CT_NonVisualDrawingShapeProps_Attributes: Attributes = {
  spLocks: {
    type: 'child',
    childAttributes: CT_ShapeLocking_Attributes
  },
  extLst: {
    type: 'child',
    childAttributes: CT_OfficeArtExtensionList_Attributes
  },
  txBox: {
    type: 'boolean',
    defaultValue: 'false'
  }
};

export interface CT_DbPr {
  connection?: string;
  command?: string;
  serverCommand?: string;
  commandType?: number;
}

export const CT_DbPr_Attributes: Attributes = {
  connection: {
    type: 'string'
  },
  command: {
    type: 'string'
  },
  serverCommand: {
    type: 'string'
  },
  commandType: {
    type: 'int',
    defaultValue: '2'
  }
};

export interface CT_OlapPr {
  local?: boolean;
  localConnection?: string;
  localRefresh?: boolean;
  sendLocale?: boolean;
  rowDrillCount?: number;
  serverFill?: boolean;
  serverNumberFormat?: boolean;
  serverFont?: boolean;
  serverFontColor?: boolean;
}

export const CT_OlapPr_Attributes: Attributes = {
  local: {
    type: 'boolean',
    defaultValue: 'false'
  },
  localConnection: {
    type: 'string'
  },
  localRefresh: {
    type: 'boolean',
    defaultValue: 'true'
  },
  sendLocale: {
    type: 'boolean',
    defaultValue: 'false'
  },
  rowDrillCount: {
    type: 'int'
  },
  serverFill: {
    type: 'boolean',
    defaultValue: 'true'
  },
  serverNumberFormat: {
    type: 'boolean',
    defaultValue: 'true'
  },
  serverFont: {
    type: 'boolean',
    defaultValue: 'true'
  },
  serverFontColor: {
    type: 'boolean',
    defaultValue: 'true'
  }
};

export interface CT_TableMissing {}

export const CT_TableMissing_Attributes: Attributes = {};

export interface CT_XStringElement {
  v?: string;
}

export const CT_XStringElement_Attributes: Attributes = {
  v: {
    type: 'string'
  }
};

export interface CT_Index {
  v?: number;
}

export const CT_Index_Attributes: Attributes = {
  v: {
    type: 'int'
  }
};

export interface CT_Tables {
  m?: CT_TableMissing[];
  s?: CT_XStringElement[];
  x?: CT_Index[];
  count?: number;
}

export const CT_Tables_Attributes: Attributes = {
  m: {
    type: 'child',
    childAttributes: CT_TableMissing_Attributes,
    childIsArray: true
  },
  s: {
    type: 'child',
    childAttributes: CT_XStringElement_Attributes,
    childIsArray: true
  },
  x: {
    type: 'child',
    childAttributes: CT_Index_Attributes,
    childIsArray: true
  },
  count: {
    type: 'int'
  }
};

export type ST_HtmlFmt = 'none' | 'rtf' | 'all';

export interface CT_WebPr {
  tables?: CT_Tables;
  xml?: boolean;
  sourceData?: boolean;
  parsePre?: boolean;
  consecutive?: boolean;
  firstRow?: boolean;
  xl97?: boolean;
  textDates?: boolean;
  xl2000?: boolean;
  url?: string;
  post?: string;
  htmlTables?: boolean;
  htmlFormat?: ST_HtmlFmt;
  editPage?: string;
}

export const CT_WebPr_Attributes: Attributes = {
  tables: {
    type: 'child',
    childAttributes: CT_Tables_Attributes
  },
  xml: {
    type: 'boolean',
    defaultValue: 'false'
  },
  sourceData: {
    type: 'boolean',
    defaultValue: 'false'
  },
  parsePre: {
    type: 'boolean',
    defaultValue: 'false'
  },
  consecutive: {
    type: 'boolean',
    defaultValue: 'false'
  },
  firstRow: {
    type: 'boolean',
    defaultValue: 'false'
  },
  xl97: {
    type: 'boolean',
    defaultValue: 'false'
  },
  textDates: {
    type: 'boolean',
    defaultValue: 'false'
  },
  xl2000: {
    type: 'boolean',
    defaultValue: 'false'
  },
  url: {
    type: 'string'
  },
  post: {
    type: 'string'
  },
  htmlTables: {
    type: 'boolean',
    defaultValue: 'false'
  },
  htmlFormat: {
    type: 'string',
    defaultValue: 'none'
  },
  editPage: {
    type: 'string'
  }
};

export type ST_ExternalConnectionType =
  | 'general'
  | 'text'
  | 'MDY'
  | 'DMY'
  | 'YMD'
  | 'MYD'
  | 'DYM'
  | 'YDM'
  | 'skip'
  | 'EMD';

export interface CT_TextField {
  type?: ST_ExternalConnectionType;
  position?: number;
}

export const CT_TextField_Attributes: Attributes = {
  type: {
    type: 'string',
    defaultValue: 'general'
  },
  position: {
    type: 'int',
    defaultValue: '0'
  }
};

export interface CT_TextFields {
  textField?: CT_TextField[];
  count?: number;
}

export const CT_TextFields_Attributes: Attributes = {
  textField: {
    type: 'child',
    childAttributes: CT_TextField_Attributes,
    childIsArray: true
  },
  count: {
    type: 'int',
    defaultValue: '1'
  }
};

export type ST_FileType = 'mac' | 'win' | 'dos' | 'lin' | 'other';

export type ST_Qualifier = 'doubleQuote' | 'singleQuote' | 'none';

export interface CT_TextPr {
  textFields?: CT_TextFields;
  prompt?: boolean;
  fileType?: ST_FileType;
  characterSet?: string;
  firstRow?: number;
  sourceFile?: string;
  delimited?: boolean;
  decimal?: string;
  thousands?: string;
  tab?: boolean;
  space?: boolean;
  comma?: boolean;
  semicolon?: boolean;
  consecutive?: boolean;
  qualifier?: ST_Qualifier;
  delimiter?: string;
}

export const CT_TextPr_Attributes: Attributes = {
  textFields: {
    type: 'child',
    childAttributes: CT_TextFields_Attributes
  },
  prompt: {
    type: 'boolean',
    defaultValue: 'true'
  },
  fileType: {
    type: 'string',
    defaultValue: 'win'
  },
  characterSet: {
    type: 'string'
  },
  firstRow: {
    type: 'int',
    defaultValue: '1'
  },
  sourceFile: {
    type: 'string'
  },
  delimited: {
    type: 'boolean',
    defaultValue: 'true'
  },
  decimal: {
    type: 'string',
    defaultValue: '.'
  },
  thousands: {
    type: 'string',
    defaultValue: ','
  },
  tab: {
    type: 'boolean',
    defaultValue: 'true'
  },
  space: {
    type: 'boolean',
    defaultValue: 'false'
  },
  comma: {
    type: 'boolean',
    defaultValue: 'false'
  },
  semicolon: {
    type: 'boolean',
    defaultValue: 'false'
  },
  consecutive: {
    type: 'boolean',
    defaultValue: 'false'
  },
  qualifier: {
    type: 'string',
    defaultValue: 'doubleQuote'
  },
  delimiter: {
    type: 'string'
  }
};

export type ST_ParameterType = 'prompt' | 'value' | 'cell';

export interface CT_Parameter {
  name?: string;
  sqlType?: number;
  parameterType?: ST_ParameterType;
  refreshOnChange?: boolean;
  prompt?: string;
  boolean?: boolean;
  double?: number;
  integer?: number;
  string?: string;
  cell?: string;
}

export const CT_Parameter_Attributes: Attributes = {
  name: {
    type: 'string'
  },
  sqlType: {
    type: 'int',
    defaultValue: '0'
  },
  parameterType: {
    type: 'string',
    defaultValue: 'prompt'
  },
  refreshOnChange: {
    type: 'boolean',
    defaultValue: 'false'
  },
  prompt: {
    type: 'string'
  },
  boolean: {
    type: 'boolean'
  },
  double: {
    type: 'double'
  },
  integer: {
    type: 'int'
  },
  string: {
    type: 'string'
  },
  cell: {
    type: 'string'
  }
};

export interface CT_Parameters {
  parameter?: CT_Parameter[];
  count?: number;
}

export const CT_Parameters_Attributes: Attributes = {
  parameter: {
    type: 'child',
    childAttributes: CT_Parameter_Attributes,
    childIsArray: true
  },
  count: {
    type: 'int'
  }
};

export type ST_CredMethod = 'integrated' | 'none' | 'stored' | 'prompt';

export interface CT_Connection {
  dbPr?: CT_DbPr;
  olapPr?: CT_OlapPr;
  webPr?: CT_WebPr;
  textPr?: CT_TextPr;
  parameters?: CT_Parameters;
  extLst?: CT_ExtensionList;
  id?: number;
  sourceFile?: string;
  odcFile?: string;
  keepAlive?: boolean;
  interval?: number;
  name?: string;
  description?: string;
  type?: number;
  reconnectionMethod?: number;
  refreshedVersion?: number;
  minRefreshableVersion?: number;
  savePassword?: boolean;
  new?: boolean;
  deleted?: boolean;
  onlyUseConnectionFile?: boolean;
  background?: boolean;
  refreshOnLoad?: boolean;
  saveData?: boolean;
  credentials?: ST_CredMethod;
  singleSignOnId?: string;
}

export const CT_Connection_Attributes: Attributes = {
  dbPr: {
    type: 'child',
    childAttributes: CT_DbPr_Attributes
  },
  olapPr: {
    type: 'child',
    childAttributes: CT_OlapPr_Attributes
  },
  webPr: {
    type: 'child',
    childAttributes: CT_WebPr_Attributes
  },
  textPr: {
    type: 'child',
    childAttributes: CT_TextPr_Attributes
  },
  parameters: {
    type: 'child',
    childAttributes: CT_Parameters_Attributes
  },
  extLst: {
    type: 'child',
    childAttributes: CT_ExtensionList_Attributes
  },
  id: {
    type: 'int'
  },
  sourceFile: {
    type: 'string'
  },
  odcFile: {
    type: 'string'
  },
  keepAlive: {
    type: 'boolean',
    defaultValue: 'false'
  },
  interval: {
    type: 'int',
    defaultValue: '0'
  },
  name: {
    type: 'string'
  },
  description: {
    type: 'string'
  },
  type: {
    type: 'int'
  },
  reconnectionMethod: {
    type: 'int',
    defaultValue: '1'
  },
  refreshedVersion: {
    type: 'int'
  },
  minRefreshableVersion: {
    type: 'int',
    defaultValue: '0'
  },
  savePassword: {
    type: 'boolean',
    defaultValue: 'false'
  },
  new: {
    type: 'boolean',
    defaultValue: 'false'
  },
  deleted: {
    type: 'boolean',
    defaultValue: 'false'
  },
  onlyUseConnectionFile: {
    type: 'boolean',
    defaultValue: 'false'
  },
  background: {
    type: 'boolean',
    defaultValue: 'false'
  },
  refreshOnLoad: {
    type: 'boolean',
    defaultValue: 'false'
  },
  saveData: {
    type: 'boolean',
    defaultValue: 'false'
  },
  credentials: {
    type: 'string',
    defaultValue: 'integrated'
  },
  singleSignOnId: {
    type: 'string'
  }
};

export interface CT_NonVisualConnectorProperties {
  cxnSpLocks?: CT_ConnectorLocking;
  stCxn?: CT_Connection;
  endCxn?: CT_Connection;
  extLst?: CT_OfficeArtExtensionList;
}

export const CT_NonVisualConnectorProperties_Attributes: Attributes = {
  cxnSpLocks: {
    type: 'child',
    childAttributes: CT_ConnectorLocking_Attributes
  },
  stCxn: {
    type: 'child',
    childAttributes: CT_Connection_Attributes
  },
  endCxn: {
    type: 'child',
    childAttributes: CT_Connection_Attributes
  },
  extLst: {
    type: 'child',
    childAttributes: CT_OfficeArtExtensionList_Attributes
  }
};

export interface CT_NonVisualPictureProperties {
  picLocks?: CT_PictureLocking;
  extLst?: CT_OfficeArtExtensionList;
  preferRelativeResize?: boolean;
}

export const CT_NonVisualPictureProperties_Attributes: Attributes = {
  picLocks: {
    type: 'child',
    childAttributes: CT_PictureLocking_Attributes
  },
  extLst: {
    type: 'child',
    childAttributes: CT_OfficeArtExtensionList_Attributes
  },
  preferRelativeResize: {
    type: 'boolean',
    defaultValue: 'true'
  }
};

export interface CT_NonVisualGroupDrawingShapeProps {
  grpSpLocks?: CT_GroupLocking;
  extLst?: CT_OfficeArtExtensionList;
}

export const CT_NonVisualGroupDrawingShapeProps_Attributes: Attributes = {
  grpSpLocks: {
    type: 'child',
    childAttributes: CT_GroupLocking_Attributes
  },
  extLst: {
    type: 'child',
    childAttributes: CT_OfficeArtExtensionList_Attributes
  }
};

export interface CT_NonVisualGraphicFrameProperties {
  graphicFrameLocks?: CT_GraphicalObjectFrameLocking;
  extLst?: CT_OfficeArtExtensionList;
}

export const CT_NonVisualGraphicFrameProperties_Attributes: Attributes = {
  graphicFrameLocks: {
    type: 'child',
    childAttributes: CT_GraphicalObjectFrameLocking_Attributes
  },
  extLst: {
    type: 'child',
    childAttributes: CT_OfficeArtExtensionList_Attributes
  }
};

export interface CT_NonVisualContentPartProperties {
  cpLocks?: CT_ContentPartLocking;
  extLst?: CT_OfficeArtExtensionList;
  isComment?: boolean;
}

export const CT_NonVisualContentPartProperties_Attributes: Attributes = {
  cpLocks: {
    type: 'child',
    childAttributes: CT_ContentPartLocking_Attributes
  },
  extLst: {
    type: 'child',
    childAttributes: CT_OfficeArtExtensionList_Attributes
  },
  isComment: {
    type: 'boolean',
    defaultValue: 'true'
  }
};

export interface CT_GraphicalObjectData {
  __any__?: any;
  uri?: string;
}

export const CT_GraphicalObjectData_Attributes: Attributes = {
  __any__: {
    type: 'any'
  },
  uri: {
    type: 'string'
  }
};

export interface CT_GraphicalObject {
  graphicData?: CT_GraphicalObjectData[];
}

export const CT_GraphicalObject_Attributes: Attributes = {
  graphicData: {
    type: 'child',
    childAttributes: CT_GraphicalObjectData_Attributes,
    childIsArray: true
  }
};

export type ST_ChartBuildStep =
  | 'category'
  | 'ptInCategory'
  | 'series'
  | 'ptInSeries'
  | 'allPts'
  | 'gridLegend';

export type ST_DgmBuildStep = 'sp' | 'bg';

export interface CT_AnimationDgmElement {
  id?: string;
  bldStep?: ST_DgmBuildStep;
}

export const CT_AnimationDgmElement_Attributes: Attributes = {
  id: {
    type: 'string',
    defaultValue: '{00000000-0000-0000-0000-000000000000}'
  },
  bldStep: {
    type: 'string',
    defaultValue: 'sp'
  }
};

export interface CT_AnimationChartElement {
  seriesIdx?: number;
  categoryIdx?: number;
  bldStep?: ST_ChartBuildStep;
}

export const CT_AnimationChartElement_Attributes: Attributes = {
  seriesIdx: {
    type: 'int',
    defaultValue: '-1'
  },
  categoryIdx: {
    type: 'int',
    defaultValue: '-1'
  },
  bldStep: {
    type: 'string'
  }
};

export interface CT_AnimationElementChoice {
  dgm?: CT_AnimationDgmElement[];
  chart?: CT_AnimationChartElement[];
}

export const CT_AnimationElementChoice_Attributes: Attributes = {
  dgm: {
    type: 'child',
    childAttributes: CT_AnimationDgmElement_Attributes,
    childIsArray: true
  },
  chart: {
    type: 'child',
    childAttributes: CT_AnimationChartElement_Attributes,
    childIsArray: true
  }
};

export type ST_AnimationBuildType = 'allAtOnce';

export type ST_AnimationDgmOnlyBuildType = 'one' | 'lvlOne' | 'lvlAtOnce';

export type ST_AnimationDgmBuildType =
  | ST_AnimationBuildType
  | ST_AnimationDgmOnlyBuildType;

export interface CT_AnimationDgmBuildProperties {
  bld?: ST_AnimationDgmBuildType;
  rev?: boolean;
}

export const CT_AnimationDgmBuildProperties_Attributes: Attributes = {
  bld: {
    type: 'string',
    defaultValue: 'allAtOnce'
  },
  rev: {
    type: 'boolean',
    defaultValue: 'false'
  }
};

export type ST_AnimationChartOnlyBuildType =
  | 'series'
  | 'category'
  | 'seriesEl'
  | 'categoryEl';

export type ST_AnimationChartBuildType =
  | ST_AnimationBuildType
  | ST_AnimationChartOnlyBuildType;

export interface CT_AnimationChartBuildProperties {
  bld?: ST_AnimationChartBuildType;
  animBg?: boolean;
}

export const CT_AnimationChartBuildProperties_Attributes: Attributes = {
  bld: {
    type: 'string',
    defaultValue: 'allAtOnce'
  },
  animBg: {
    type: 'boolean',
    defaultValue: 'true'
  }
};

export interface CT_AnimationGraphicalObjectBuildProperties {
  bldDgm?: CT_AnimationDgmBuildProperties[];
  bldChart?: CT_AnimationChartBuildProperties[];
}

export const CT_AnimationGraphicalObjectBuildProperties_Attributes: Attributes =
  {
    bldDgm: {
      type: 'child',
      childAttributes: CT_AnimationDgmBuildProperties_Attributes,
      childIsArray: true
    },
    bldChart: {
      type: 'child',
      childAttributes: CT_AnimationChartBuildProperties_Attributes,
      childIsArray: true
    }
  };

export interface CT_BackgroundFormatting {
  noFill?: CT_NoFillProperties;
  solidFill?: CT_SolidColorFillProperties;
  gradFill?: CT_GradientFillProperties;
  blipFill?: CT_BlipFillProperties;
  pattFill?: CT_PatternFillProperties;
  grpFill?: CT_GroupFillProperties;
  effectLst?: CT_EffectList;
  effectDag?: CT_EffectContainer;
}

export const CT_BackgroundFormatting_Attributes: Attributes = {
  noFill: {
    type: 'child',
    childAttributes: CT_NoFillProperties_Attributes
  },
  solidFill: {
    type: 'child',
    childAttributes: CT_SolidColorFillProperties_Attributes
  },
  gradFill: {
    type: 'child',
    childAttributes: CT_GradientFillProperties_Attributes
  },
  blipFill: {
    type: 'child',
    childAttributes: CT_BlipFillProperties_Attributes
  },
  pattFill: {
    type: 'child',
    childAttributes: CT_PatternFillProperties_Attributes
  },
  grpFill: {
    type: 'child',
    childAttributes: CT_GroupFillProperties_Attributes
  },
  effectLst: {
    type: 'child',
    childAttributes: CT_EffectList_Attributes
  },
  effectDag: {
    type: 'child',
    childAttributes: CT_EffectContainer_Attributes
  }
};

export interface CT_WholeE2oFormatting {
  ln?: CT_LineProperties;
  effectLst?: CT_EffectList;
  effectDag?: CT_EffectContainer;
}

export const CT_WholeE2oFormatting_Attributes: Attributes = {
  ln: {
    type: 'child',
    childAttributes: CT_LineProperties_Attributes
  },
  effectLst: {
    type: 'child',
    childAttributes: CT_EffectList_Attributes
  },
  effectDag: {
    type: 'child',
    childAttributes: CT_EffectContainer_Attributes
  }
};

export interface CT_GvmlUseShapeRectangle {}

export const CT_GvmlUseShapeRectangle_Attributes: Attributes = {};

export type ST_GeomGuideName = string;

export type ST_GeomGuideFormula = string;

export interface CT_GeomGuide {
  name?: string;
  fmla?: string;
}

export const CT_GeomGuide_Attributes: Attributes = {
  name: {
    type: 'string'
  },
  fmla: {
    type: 'string'
  }
};

export interface CT_GeomGuideList {
  gd?: CT_GeomGuide[];
}

export const CT_GeomGuideList_Attributes: Attributes = {
  gd: {
    type: 'child',
    childAttributes: CT_GeomGuide_Attributes,
    childIsArray: true
  }
};

export type ST_TextShapeType =
  | 'textNoShape'
  | 'textPlain'
  | 'textStop'
  | 'textTriangle'
  | 'textTriangleInverted'
  | 'textChevron'
  | 'textChevronInverted'
  | 'textRingInside'
  | 'textRingOutside'
  | 'textArchUp'
  | 'textArchDown'
  | 'textCircle'
  | 'textButton'
  | 'textArchUpPour'
  | 'textArchDownPour'
  | 'textCirclePour'
  | 'textButtonPour'
  | 'textCurveUp'
  | 'textCurveDown'
  | 'textCanUp'
  | 'textCanDown'
  | 'textWave1'
  | 'textWave2'
  | 'textDoubleWave1'
  | 'textWave4'
  | 'textInflate'
  | 'textDeflate'
  | 'textInflateBottom'
  | 'textDeflateBottom'
  | 'textInflateTop'
  | 'textDeflateTop'
  | 'textDeflateInflate'
  | 'textDeflateInflateDeflate'
  | 'textFadeRight'
  | 'textFadeLeft'
  | 'textFadeUp'
  | 'textFadeDown'
  | 'textSlantUp'
  | 'textSlantDown'
  | 'textCascadeUp'
  | 'textCascadeDown';

export interface CT_PresetTextShape {
  avLst?: CT_GeomGuideList;
  prst?: ST_TextShapeType;
}

export const CT_PresetTextShape_Attributes: Attributes = {
  avLst: {
    type: 'child',
    childAttributes: CT_GeomGuideList_Attributes
  },
  prst: {
    type: 'string'
  }
};

export interface CT_TextNoAutofit {}

export const CT_TextNoAutofit_Attributes: Attributes = {};

export type ST_TextFontScalePercentOrPercentString = string;

export type ST_TextSpacingPercentOrPercentString = string;

export interface CT_TextNormalAutofit {
  fontScale?: string;
  lnSpcReduction?: string;
}

export const CT_TextNormalAutofit_Attributes: Attributes = {
  fontScale: {
    type: 'string',
    defaultValue: '100%'
  },
  lnSpcReduction: {
    type: 'string',
    defaultValue: '0%'
  }
};

export interface CT_TextShapeAutofit {}

export const CT_TextShapeAutofit_Attributes: Attributes = {};

export interface CT_FlatText {
  z?: ST_Coordinate;
}

export const CT_FlatText_Attributes: Attributes = {
  z: {
    type: 'string',
    defaultValue: '0'
  }
};

export type ST_TextVertOverflowType = 'overflow' | 'ellipsis' | 'clip';

export type ST_TextHorzOverflowType = 'overflow' | 'clip';

export type ST_TextVerticalType =
  | 'horz'
  | 'vert'
  | 'vert270'
  | 'wordArtVert'
  | 'eaVert'
  | 'mongolianVert'
  | 'wordArtVertRtl';

export type ST_TextWrappingType = 'none' | 'square';

export type ST_TextColumnCount = number;

export type ST_TextAnchoringType = 't' | 'ctr' | 'b' | 'just' | 'dist';

export interface CT_TextBodyProperties {
  prstTxWarp?: CT_PresetTextShape;
  noAutofit?: CT_TextNoAutofit[];
  normAutofit?: CT_TextNormalAutofit[];
  spAutoFit?: CT_TextShapeAutofit[];
  scene3d?: CT_Scene3D;
  sp3d?: CT_Shape3D;
  flatTx?: CT_FlatText;
  extLst?: CT_OfficeArtExtensionList;
  rot?: number;
  spcFirstLastPara?: boolean;
  vertOverflow?: ST_TextVertOverflowType;
  horzOverflow?: ST_TextHorzOverflowType;
  vert?: ST_TextVerticalType;
  wrap?: ST_TextWrappingType;
  lIns?: ST_Coordinate32;
  tIns?: ST_Coordinate32;
  rIns?: ST_Coordinate32;
  bIns?: ST_Coordinate32;
  numCol?: number;
  spcCol?: number;
  rtlCol?: boolean;
  fromWordArt?: boolean;
  anchor?: ST_TextAnchoringType;
  anchorCtr?: boolean;
  forceAA?: boolean;
  upright?: boolean;
  compatLnSpc?: boolean;
}

export const CT_TextBodyProperties_Attributes: Attributes = {
  prstTxWarp: {
    type: 'child',
    childAttributes: CT_PresetTextShape_Attributes
  },
  noAutofit: {
    type: 'child',
    childAttributes: CT_TextNoAutofit_Attributes,
    childIsArray: true
  },
  normAutofit: {
    type: 'child',
    childAttributes: CT_TextNormalAutofit_Attributes,
    childIsArray: true
  },
  spAutoFit: {
    type: 'child',
    childAttributes: CT_TextShapeAutofit_Attributes,
    childIsArray: true
  },
  scene3d: {
    type: 'child',
    childAttributes: CT_Scene3D_Attributes
  },
  sp3d: {
    type: 'child',
    childAttributes: CT_Shape3D_Attributes
  },
  flatTx: {
    type: 'child',
    childAttributes: CT_FlatText_Attributes
  },
  extLst: {
    type: 'child',
    childAttributes: CT_OfficeArtExtensionList_Attributes
  },
  rot: {
    type: 'int'
  },
  spcFirstLastPara: {
    type: 'boolean'
  },
  vertOverflow: {
    type: 'string'
  },
  horzOverflow: {
    type: 'string'
  },
  vert: {
    type: 'string'
  },
  wrap: {
    type: 'string'
  },
  lIns: {
    type: 'string'
  },
  tIns: {
    type: 'string'
  },
  rIns: {
    type: 'string'
  },
  bIns: {
    type: 'string'
  },
  numCol: {
    type: 'int'
  },
  spcCol: {
    type: 'int'
  },
  rtlCol: {
    type: 'boolean'
  },
  fromWordArt: {
    type: 'boolean'
  },
  anchor: {
    type: 'string'
  },
  anchorCtr: {
    type: 'boolean'
  },
  forceAA: {
    type: 'boolean'
  },
  upright: {
    type: 'boolean',
    defaultValue: 'false'
  },
  compatLnSpc: {
    type: 'boolean'
  }
};

export interface CT_TextSpacingPercent {
  val?: string;
}

export const CT_TextSpacingPercent_Attributes: Attributes = {
  val: {
    type: 'string'
  }
};

export type ST_TextSpacingPoint = number;

export interface CT_TextSpacingPoint {
  val?: number;
}

export const CT_TextSpacingPoint_Attributes: Attributes = {
  val: {
    type: 'int'
  }
};

export interface CT_TextSpacing {
  spcPct?: CT_TextSpacingPercent[];
  spcPts?: CT_TextSpacingPoint[];
}

export const CT_TextSpacing_Attributes: Attributes = {
  spcPct: {
    type: 'child',
    childAttributes: CT_TextSpacingPercent_Attributes,
    childIsArray: true
  },
  spcPts: {
    type: 'child',
    childAttributes: CT_TextSpacingPoint_Attributes,
    childIsArray: true
  }
};

export interface CT_TextBulletColorFollowText {}

export const CT_TextBulletColorFollowText_Attributes: Attributes = {};

export interface CT_TextBulletSizeFollowText {}

export const CT_TextBulletSizeFollowText_Attributes: Attributes = {};

export type ST_TextBulletSizePercent = string;

export interface CT_TextBulletSizePercent {
  val?: string;
}

export const CT_TextBulletSizePercent_Attributes: Attributes = {
  val: {
    type: 'string'
  }
};

export type ST_TextFontSize = number;

export interface CT_TextBulletSizePoint {
  val?: number;
}

export const CT_TextBulletSizePoint_Attributes: Attributes = {
  val: {
    type: 'int'
  }
};

export interface CT_TextBulletTypefaceFollowText {}

export const CT_TextBulletTypefaceFollowText_Attributes: Attributes = {};

export interface CT_TextNoBullet {}

export const CT_TextNoBullet_Attributes: Attributes = {};

export type ST_TextAutonumberScheme =
  | 'alphaLcParenBoth'
  | 'alphaUcParenBoth'
  | 'alphaLcParenR'
  | 'alphaUcParenR'
  | 'alphaLcPeriod'
  | 'alphaUcPeriod'
  | 'arabicParenBoth'
  | 'arabicParenR'
  | 'arabicPeriod'
  | 'arabicPlain'
  | 'romanLcParenBoth'
  | 'romanUcParenBoth'
  | 'romanLcParenR'
  | 'romanUcParenR'
  | 'romanLcPeriod'
  | 'romanUcPeriod'
  | 'circleNumDbPlain'
  | 'circleNumWdBlackPlain'
  | 'circleNumWdWhitePlain'
  | 'arabicDbPeriod'
  | 'arabicDbPlain'
  | 'ea1ChsPeriod'
  | 'ea1ChsPlain'
  | 'ea1ChtPeriod'
  | 'ea1ChtPlain'
  | 'ea1JpnChsDbPeriod'
  | 'ea1JpnKorPlain'
  | 'ea1JpnKorPeriod'
  | 'arabic1Minus'
  | 'arabic2Minus'
  | 'hebrew2Minus'
  | 'thaiAlphaPeriod'
  | 'thaiAlphaParenR'
  | 'thaiAlphaParenBoth'
  | 'thaiNumPeriod'
  | 'thaiNumParenR'
  | 'thaiNumParenBoth'
  | 'hindiAlphaPeriod'
  | 'hindiNumPeriod'
  | 'hindiNumParenR'
  | 'hindiAlpha1Period';

export type ST_TextBulletStartAtNum = number;

export interface CT_TextAutonumberBullet {
  type?: ST_TextAutonumberScheme;
  startAt?: number;
}

export const CT_TextAutonumberBullet_Attributes: Attributes = {
  type: {
    type: 'string'
  },
  startAt: {
    type: 'int',
    defaultValue: '1'
  }
};

export interface CT_TextCharBullet {
  char?: string;
}

export const CT_TextCharBullet_Attributes: Attributes = {
  char: {
    type: 'string'
  }
};

export interface CT_TextBlipBullet {
  blip?: CT_Blip;
}

export const CT_TextBlipBullet_Attributes: Attributes = {
  blip: {
    type: 'child',
    childAttributes: CT_Blip_Attributes
  }
};

export type ST_TextTabAlignType = 'l' | 'ctr' | 'r' | 'dec';

export interface CT_TextTabStop {
  pos?: ST_Coordinate32;
  algn?: ST_TextTabAlignType;
}

export const CT_TextTabStop_Attributes: Attributes = {
  pos: {
    type: 'string'
  },
  algn: {
    type: 'string'
  }
};

export interface CT_TextTabStopList {
  tab?: CT_TextTabStop[];
}

export const CT_TextTabStopList_Attributes: Attributes = {
  tab: {
    type: 'child',
    childAttributes: CT_TextTabStop_Attributes,
    childIsArray: true
  }
};

export interface CT_TextUnderlineLineFollowText {}

export const CT_TextUnderlineLineFollowText_Attributes: Attributes = {};

export interface CT_TextUnderlineFillFollowText {}

export const CT_TextUnderlineFillFollowText_Attributes: Attributes = {};

export interface CT_TextUnderlineFillGroupWrapper {}

export const CT_TextUnderlineFillGroupWrapper_Attributes: Attributes = {};

export interface CT_X {
  v?: number;
}

export const CT_X_Attributes: Attributes = {
  v: {
    type: 'int',
    defaultValue: '0'
  }
};

export interface CT_Boolean {
  x?: CT_X[];
  v?: boolean;
  u?: boolean;
  f?: boolean;
  c?: string;
  cp?: number;
}

export const CT_Boolean_Attributes: Attributes = {
  x: {
    type: 'child',
    childAttributes: CT_X_Attributes,
    childIsArray: true
  },
  v: {
    type: 'boolean'
  },
  u: {
    type: 'boolean'
  },
  f: {
    type: 'boolean'
  },
  c: {
    type: 'string'
  },
  cp: {
    type: 'int'
  }
};

export type ST_TextUnderlineType =
  | 'none'
  | 'words'
  | 'sng'
  | 'dbl'
  | 'heavy'
  | 'dotted'
  | 'dottedHeavy'
  | 'dash'
  | 'dashHeavy'
  | 'dashLong'
  | 'dashLongHeavy'
  | 'dotDash'
  | 'dotDashHeavy'
  | 'dotDotDash'
  | 'dotDotDashHeavy'
  | 'wavy'
  | 'wavyHeavy'
  | 'wavyDbl';

export type ST_TextStrikeType = 'noStrike' | 'sngStrike' | 'dblStrike';

export type ST_TextNonNegativePoint = number;

export type ST_TextCapsType = 'none' | 'small' | 'all';

export type ST_TextPoint = ST_TextPointUnqualified | ST_UniversalMeasure;

export interface CT_TextCharacterProperties {
  ln?: CT_LineProperties;
  noFill?: CT_NoFillProperties;
  solidFill?: CT_SolidColorFillProperties;
  gradFill?: CT_GradientFillProperties;
  blipFill?: CT_BlipFillProperties;
  pattFill?: CT_PatternFillProperties;
  grpFill?: CT_GroupFillProperties;
  effectLst?: CT_EffectList;
  effectDag?: CT_EffectContainer;
  highlight?: CT_Color;
  uLnTx?: CT_TextUnderlineLineFollowText[];
  uLn?: CT_LineProperties;
  uFillTx?: CT_TextUnderlineFillFollowText[];
  uFill?: CT_TextUnderlineFillGroupWrapper[];
  latin?: CT_TextFont;
  ea?: CT_TextFont;
  cs?: CT_TextFont;
  sym?: CT_TextFont;
  hlinkClick?: CT_Hyperlink;
  hlinkMouseOver?: CT_Hyperlink;
  rtl?: CT_Boolean[];
  extLst?: CT_OfficeArtExtensionList;
  kumimoji?: boolean;
  lang?: string;
  altLang?: string;
  sz?: number;
  b?: boolean;
  i?: boolean;
  u?: ST_TextUnderlineType;
  strike?: ST_TextStrikeType;
  kern?: number;
  cap?: ST_TextCapsType;
  spc?: ST_TextPoint;
  normalizeH?: boolean;
  baseline?: string;
  noProof?: boolean;
  dirty?: boolean;
  err?: boolean;
  smtClean?: boolean;
  smtId?: number;
  bmk?: string;
}

export const CT_TextCharacterProperties_Attributes: Attributes = {
  ln: {
    type: 'child',
    childAttributes: CT_LineProperties_Attributes
  },
  noFill: {
    type: 'child',
    childAttributes: CT_NoFillProperties_Attributes
  },
  solidFill: {
    type: 'child',
    childAttributes: CT_SolidColorFillProperties_Attributes
  },
  gradFill: {
    type: 'child',
    childAttributes: CT_GradientFillProperties_Attributes
  },
  blipFill: {
    type: 'child',
    childAttributes: CT_BlipFillProperties_Attributes
  },
  pattFill: {
    type: 'child',
    childAttributes: CT_PatternFillProperties_Attributes
  },
  grpFill: {
    type: 'child',
    childAttributes: CT_GroupFillProperties_Attributes
  },
  effectLst: {
    type: 'child',
    childAttributes: CT_EffectList_Attributes
  },
  effectDag: {
    type: 'child',
    childAttributes: CT_EffectContainer_Attributes
  },
  highlight: {
    type: 'child',
    childAttributes: CT_Color_Attributes
  },
  uLnTx: {
    type: 'child',
    childAttributes: CT_TextUnderlineLineFollowText_Attributes,
    childIsArray: true
  },
  uLn: {
    type: 'child',
    childAttributes: CT_LineProperties_Attributes
  },
  uFillTx: {
    type: 'child',
    childAttributes: CT_TextUnderlineFillFollowText_Attributes,
    childIsArray: true
  },
  uFill: {
    type: 'child',
    childAttributes: CT_TextUnderlineFillGroupWrapper_Attributes,
    childIsArray: true
  },
  latin: {
    type: 'child',
    childAttributes: CT_TextFont_Attributes
  },
  ea: {
    type: 'child',
    childAttributes: CT_TextFont_Attributes
  },
  cs: {
    type: 'child',
    childAttributes: CT_TextFont_Attributes
  },
  sym: {
    type: 'child',
    childAttributes: CT_TextFont_Attributes
  },
  hlinkClick: {
    type: 'child',
    childAttributes: CT_Hyperlink_Attributes
  },
  hlinkMouseOver: {
    type: 'child',
    childAttributes: CT_Hyperlink_Attributes
  },
  rtl: {
    type: 'child',
    childAttributes: CT_Boolean_Attributes,
    childIsArray: true
  },
  extLst: {
    type: 'child',
    childAttributes: CT_OfficeArtExtensionList_Attributes
  },
  kumimoji: {
    type: 'boolean'
  },
  lang: {
    type: 'string'
  },
  altLang: {
    type: 'string'
  },
  sz: {
    type: 'int'
  },
  b: {
    type: 'boolean'
  },
  i: {
    type: 'boolean'
  },
  u: {
    type: 'string'
  },
  strike: {
    type: 'string'
  },
  kern: {
    type: 'int'
  },
  cap: {
    type: 'string',
    defaultValue: 'none'
  },
  spc: {
    type: 'string'
  },
  normalizeH: {
    type: 'boolean'
  },
  baseline: {
    type: 'string'
  },
  noProof: {
    type: 'boolean'
  },
  dirty: {
    type: 'boolean',
    defaultValue: 'true'
  },
  err: {
    type: 'boolean',
    defaultValue: 'false'
  },
  smtClean: {
    type: 'boolean',
    defaultValue: 'true'
  },
  smtId: {
    type: 'int',
    defaultValue: '0'
  },
  bmk: {
    type: 'string'
  }
};

export type ST_TextMargin = ST_Coordinate32Unqualified;

export type ST_TextIndentLevelType = number;

export type ST_TextIndent = ST_Coordinate32Unqualified;

export type ST_TextAlignType =
  | 'l'
  | 'ctr'
  | 'r'
  | 'just'
  | 'justLow'
  | 'dist'
  | 'thaiDist';

export type ST_TextFontAlignType = 'auto' | 't' | 'ctr' | 'base' | 'b';

export interface CT_TextParagraphProperties {
  lnSpc?: CT_TextSpacing;
  spcBef?: CT_TextSpacing;
  spcAft?: CT_TextSpacing;
  buClrTx?: CT_TextBulletColorFollowText;
  buClr?: CT_Color;
  buSzTx?: CT_TextBulletSizeFollowText[];
  buSzPct?: CT_TextBulletSizePercent[];
  buSzPts?: CT_TextBulletSizePoint[];
  buFontTx?: CT_TextBulletTypefaceFollowText[];
  buFont?: CT_TextFont[];
  buNone?: CT_TextNoBullet[];
  buAutoNum?: CT_TextAutonumberBullet[];
  buChar?: CT_TextCharBullet[];
  buBlip?: CT_TextBlipBullet[];
  tabLst?: CT_TextTabStopList;
  defRPr?: CT_TextCharacterProperties;
  extLst?: CT_OfficeArtExtensionList;
  marL?: number;
  marR?: number;
  lvl?: number;
  indent?: number;
  algn?: ST_TextAlignType;
  defTabSz?: ST_Coordinate32;
  rtl?: boolean;
  eaLnBrk?: boolean;
  fontAlgn?: ST_TextFontAlignType;
  latinLnBrk?: boolean;
  hangingPunct?: boolean;
}

export const CT_TextParagraphProperties_Attributes: Attributes = {
  lnSpc: {
    type: 'child',
    childAttributes: CT_TextSpacing_Attributes
  },
  spcBef: {
    type: 'child',
    childAttributes: CT_TextSpacing_Attributes
  },
  spcAft: {
    type: 'child',
    childAttributes: CT_TextSpacing_Attributes
  },
  buClrTx: {
    type: 'child',
    childAttributes: CT_TextBulletColorFollowText_Attributes
  },
  buClr: {
    type: 'child',
    childAttributes: CT_Color_Attributes
  },
  buSzTx: {
    type: 'child',
    childAttributes: CT_TextBulletSizeFollowText_Attributes,
    childIsArray: true
  },
  buSzPct: {
    type: 'child',
    childAttributes: CT_TextBulletSizePercent_Attributes,
    childIsArray: true
  },
  buSzPts: {
    type: 'child',
    childAttributes: CT_TextBulletSizePoint_Attributes,
    childIsArray: true
  },
  buFontTx: {
    type: 'child',
    childAttributes: CT_TextBulletTypefaceFollowText_Attributes,
    childIsArray: true
  },
  buFont: {
    type: 'child',
    childAttributes: CT_TextFont_Attributes,
    childIsArray: true
  },
  buNone: {
    type: 'child',
    childAttributes: CT_TextNoBullet_Attributes,
    childIsArray: true
  },
  buAutoNum: {
    type: 'child',
    childAttributes: CT_TextAutonumberBullet_Attributes,
    childIsArray: true
  },
  buChar: {
    type: 'child',
    childAttributes: CT_TextCharBullet_Attributes,
    childIsArray: true
  },
  buBlip: {
    type: 'child',
    childAttributes: CT_TextBlipBullet_Attributes,
    childIsArray: true
  },
  tabLst: {
    type: 'child',
    childAttributes: CT_TextTabStopList_Attributes
  },
  defRPr: {
    type: 'child',
    childAttributes: CT_TextCharacterProperties_Attributes
  },
  extLst: {
    type: 'child',
    childAttributes: CT_OfficeArtExtensionList_Attributes
  },
  marL: {
    type: 'int'
  },
  marR: {
    type: 'int'
  },
  lvl: {
    type: 'int'
  },
  indent: {
    type: 'int'
  },
  algn: {
    type: 'string'
  },
  defTabSz: {
    type: 'string'
  },
  rtl: {
    type: 'boolean'
  },
  eaLnBrk: {
    type: 'boolean'
  },
  fontAlgn: {
    type: 'string'
  },
  latinLnBrk: {
    type: 'boolean'
  },
  hangingPunct: {
    type: 'boolean'
  }
};

export interface CT_TextListStyle {
  defPPr?: CT_TextParagraphProperties;
  lvl1pPr?: CT_TextParagraphProperties;
  lvl2pPr?: CT_TextParagraphProperties;
  lvl3pPr?: CT_TextParagraphProperties;
  lvl4pPr?: CT_TextParagraphProperties;
  lvl5pPr?: CT_TextParagraphProperties;
  lvl6pPr?: CT_TextParagraphProperties;
  lvl7pPr?: CT_TextParagraphProperties;
  lvl8pPr?: CT_TextParagraphProperties;
  lvl9pPr?: CT_TextParagraphProperties;
  extLst?: CT_OfficeArtExtensionList;
}

export const CT_TextListStyle_Attributes: Attributes = {
  defPPr: {
    type: 'child',
    childAttributes: CT_TextParagraphProperties_Attributes
  },
  lvl1pPr: {
    type: 'child',
    childAttributes: CT_TextParagraphProperties_Attributes
  },
  lvl2pPr: {
    type: 'child',
    childAttributes: CT_TextParagraphProperties_Attributes
  },
  lvl3pPr: {
    type: 'child',
    childAttributes: CT_TextParagraphProperties_Attributes
  },
  lvl4pPr: {
    type: 'child',
    childAttributes: CT_TextParagraphProperties_Attributes
  },
  lvl5pPr: {
    type: 'child',
    childAttributes: CT_TextParagraphProperties_Attributes
  },
  lvl6pPr: {
    type: 'child',
    childAttributes: CT_TextParagraphProperties_Attributes
  },
  lvl7pPr: {
    type: 'child',
    childAttributes: CT_TextParagraphProperties_Attributes
  },
  lvl8pPr: {
    type: 'child',
    childAttributes: CT_TextParagraphProperties_Attributes
  },
  lvl9pPr: {
    type: 'child',
    childAttributes: CT_TextParagraphProperties_Attributes
  },
  extLst: {
    type: 'child',
    childAttributes: CT_OfficeArtExtensionList_Attributes
  }
};

export interface CT_RegularTextRun {
  rPr?: CT_TextCharacterProperties;
  t?: string;
}

export const CT_RegularTextRun_Attributes: Attributes = {
  rPr: {
    type: 'child',
    childAttributes: CT_TextCharacterProperties_Attributes
  },
  t: {
    type: 'child-string'
  }
};

export interface CT_TextLineBreak {
  rPr?: CT_TextCharacterProperties;
}

export const CT_TextLineBreak_Attributes: Attributes = {
  rPr: {
    type: 'child',
    childAttributes: CT_TextCharacterProperties_Attributes
  }
};

export interface CT_TextParagraph {
  pPr?: CT_TextParagraphProperties;
  r?: CT_RegularTextRun[];
  br?: CT_TextLineBreak[];
  fld?: CT_TextField[];
  endParaRPr?: CT_TextCharacterProperties;
}

export const CT_TextParagraph_Attributes: Attributes = {
  pPr: {
    type: 'child',
    childAttributes: CT_TextParagraphProperties_Attributes
  },
  r: {
    type: 'child',
    childAttributes: CT_RegularTextRun_Attributes,
    childIsArray: true
  },
  br: {
    type: 'child',
    childAttributes: CT_TextLineBreak_Attributes,
    childIsArray: true
  },
  fld: {
    type: 'child',
    childAttributes: CT_TextField_Attributes,
    childIsArray: true
  },
  endParaRPr: {
    type: 'child',
    childAttributes: CT_TextCharacterProperties_Attributes
  }
};

export interface CT_TextBody {
  bodyPr?: CT_TextBodyProperties;
  lstStyle?: CT_TextListStyle;
  p?: CT_TextParagraph[];
}

export const CT_TextBody_Attributes: Attributes = {
  bodyPr: {
    type: 'child',
    childAttributes: CT_TextBodyProperties_Attributes
  },
  lstStyle: {
    type: 'child',
    childAttributes: CT_TextListStyle_Attributes
  },
  p: {
    type: 'child',
    childAttributes: CT_TextParagraph_Attributes,
    childIsArray: true
  }
};

export interface CT_GvmlTextShape {
  txBody?: CT_TextBody;
  useSpRect?: CT_GvmlUseShapeRectangle;
  xfrm?: CT_Transform2D;
  extLst?: CT_OfficeArtExtensionList;
}

export const CT_GvmlTextShape_Attributes: Attributes = {
  txBody: {
    type: 'child',
    childAttributes: CT_TextBody_Attributes
  },
  useSpRect: {
    type: 'child',
    childAttributes: CT_GvmlUseShapeRectangle_Attributes
  },
  xfrm: {
    type: 'child',
    childAttributes: CT_Transform2D_Attributes
  },
  extLst: {
    type: 'child',
    childAttributes: CT_OfficeArtExtensionList_Attributes
  }
};

export interface CT_GvmlShapeNonVisual {
  cNvPr?: CT_NonVisualDrawingProps;
  cNvSpPr?: CT_NonVisualDrawingShapeProps;
}

export const CT_GvmlShapeNonVisual_Attributes: Attributes = {
  cNvPr: {
    type: 'child',
    childAttributes: CT_NonVisualDrawingProps_Attributes
  },
  cNvSpPr: {
    type: 'child',
    childAttributes: CT_NonVisualDrawingShapeProps_Attributes
  }
};

export type ST_AdjCoordinate = ST_Coordinate | ST_GeomGuideName;

export interface CT_AdjPoint2D {
  x?: ST_AdjCoordinate;
  y?: ST_AdjCoordinate;
}

export const CT_AdjPoint2D_Attributes: Attributes = {
  x: {
    type: 'string'
  },
  y: {
    type: 'string'
  }
};

export interface CT_XYAdjustHandle {
  pos?: CT_AdjPoint2D;
  gdRefX?: string;
  minX?: ST_AdjCoordinate;
  maxX?: ST_AdjCoordinate;
  gdRefY?: string;
  minY?: ST_AdjCoordinate;
  maxY?: ST_AdjCoordinate;
}

export const CT_XYAdjustHandle_Attributes: Attributes = {
  pos: {
    type: 'child',
    childAttributes: CT_AdjPoint2D_Attributes
  },
  gdRefX: {
    type: 'string'
  },
  minX: {
    type: 'string'
  },
  maxX: {
    type: 'string'
  },
  gdRefY: {
    type: 'string'
  },
  minY: {
    type: 'string'
  },
  maxY: {
    type: 'string'
  }
};

export type ST_AdjAngle = ST_Angle | ST_GeomGuideName;

export interface CT_PolarAdjustHandle {
  pos?: CT_AdjPoint2D;
  gdRefR?: string;
  minR?: ST_AdjCoordinate;
  maxR?: ST_AdjCoordinate;
  gdRefAng?: string;
  minAng?: ST_AdjAngle;
  maxAng?: ST_AdjAngle;
}

export const CT_PolarAdjustHandle_Attributes: Attributes = {
  pos: {
    type: 'child',
    childAttributes: CT_AdjPoint2D_Attributes
  },
  gdRefR: {
    type: 'string'
  },
  minR: {
    type: 'string'
  },
  maxR: {
    type: 'string'
  },
  gdRefAng: {
    type: 'string'
  },
  minAng: {
    type: 'string'
  },
  maxAng: {
    type: 'string'
  }
};

export interface CT_AdjustHandleList {
  ahXY?: CT_XYAdjustHandle;
  ahPolar?: CT_PolarAdjustHandle;
}

export const CT_AdjustHandleList_Attributes: Attributes = {
  ahXY: {
    type: 'child',
    childAttributes: CT_XYAdjustHandle_Attributes
  },
  ahPolar: {
    type: 'child',
    childAttributes: CT_PolarAdjustHandle_Attributes
  }
};

export interface CT_ConnectionSite {
  pos?: CT_AdjPoint2D;
  ang?: ST_AdjAngle;
}

export const CT_ConnectionSite_Attributes: Attributes = {
  pos: {
    type: 'child',
    childAttributes: CT_AdjPoint2D_Attributes
  },
  ang: {
    type: 'string'
  }
};

export interface CT_ConnectionSiteList {
  cxn?: CT_ConnectionSite[];
}

export const CT_ConnectionSiteList_Attributes: Attributes = {
  cxn: {
    type: 'child',
    childAttributes: CT_ConnectionSite_Attributes,
    childIsArray: true
  }
};

export interface CT_GeomRect {
  l?: ST_AdjCoordinate;
  t?: ST_AdjCoordinate;
  r?: ST_AdjCoordinate;
  b?: ST_AdjCoordinate;
}

export const CT_GeomRect_Attributes: Attributes = {
  l: {
    type: 'string'
  },
  t: {
    type: 'string'
  },
  r: {
    type: 'string'
  },
  b: {
    type: 'string'
  }
};

export interface CT_Path2DClose {}

export const CT_Path2DClose_Attributes: Attributes = {};

export interface CT_Path2DMoveTo {
  pt?: CT_AdjPoint2D;
}

export const CT_Path2DMoveTo_Attributes: Attributes = {
  pt: {
    type: 'child',
    childAttributes: CT_AdjPoint2D_Attributes
  }
};

export interface CT_Path2DLineTo {
  pt?: CT_AdjPoint2D;
}

export const CT_Path2DLineTo_Attributes: Attributes = {
  pt: {
    type: 'child',
    childAttributes: CT_AdjPoint2D_Attributes
  }
};

export interface CT_Path2DArcTo {
  wR?: ST_AdjCoordinate;
  hR?: ST_AdjCoordinate;
  stAng?: ST_AdjAngle;
  swAng?: ST_AdjAngle;
}

export const CT_Path2DArcTo_Attributes: Attributes = {
  wR: {
    type: 'string'
  },
  hR: {
    type: 'string'
  },
  stAng: {
    type: 'string'
  },
  swAng: {
    type: 'string'
  }
};

export interface CT_Path2DQuadBezierTo {
  pt?: CT_AdjPoint2D[];
}

export const CT_Path2DQuadBezierTo_Attributes: Attributes = {
  pt: {
    type: 'child',
    childAttributes: CT_AdjPoint2D_Attributes,
    childIsArray: true
  }
};

export interface CT_Path2DCubicBezierTo {
  pt?: CT_AdjPoint2D[];
}

export const CT_Path2DCubicBezierTo_Attributes: Attributes = {
  pt: {
    type: 'child',
    childAttributes: CT_AdjPoint2D_Attributes,
    childIsArray: true
  }
};

export type ST_PathFillMode =
  | 'none'
  | 'norm'
  | 'lighten'
  | 'lightenLess'
  | 'darken'
  | 'darkenLess';

export interface CT_Path2D {
  close?: CT_Path2DClose;
  moveTo?: CT_Path2DMoveTo;
  lnTo?: CT_Path2DLineTo;
  arcTo?: CT_Path2DArcTo;
  quadBezTo?: CT_Path2DQuadBezierTo;
  cubicBezTo?: CT_Path2DCubicBezierTo;
  w?: number;
  h?: number;
  fill?: ST_PathFillMode;
  stroke?: boolean;
  extrusionOk?: boolean;
}

export const CT_Path2D_Attributes: Attributes = {
  close: {
    type: 'child',
    childAttributes: CT_Path2DClose_Attributes
  },
  moveTo: {
    type: 'child',
    childAttributes: CT_Path2DMoveTo_Attributes
  },
  lnTo: {
    type: 'child',
    childAttributes: CT_Path2DLineTo_Attributes
  },
  arcTo: {
    type: 'child',
    childAttributes: CT_Path2DArcTo_Attributes
  },
  quadBezTo: {
    type: 'child',
    childAttributes: CT_Path2DQuadBezierTo_Attributes
  },
  cubicBezTo: {
    type: 'child',
    childAttributes: CT_Path2DCubicBezierTo_Attributes
  },
  w: {
    type: 'int',
    defaultValue: '0'
  },
  h: {
    type: 'int',
    defaultValue: '0'
  },
  fill: {
    type: 'string',
    defaultValue: 'norm'
  },
  stroke: {
    type: 'boolean',
    defaultValue: 'true'
  },
  extrusionOk: {
    type: 'boolean',
    defaultValue: 'true'
  }
};

export interface CT_Path2DList {
  path?: CT_Path2D[];
}

export const CT_Path2DList_Attributes: Attributes = {
  path: {
    type: 'child',
    childAttributes: CT_Path2D_Attributes,
    childIsArray: true
  }
};

export interface CT_CustomGeometry2D {
  avLst?: CT_GeomGuideList;
  gdLst?: CT_GeomGuideList;
  ahLst?: CT_AdjustHandleList;
  cxnLst?: CT_ConnectionSiteList;
  rect?: CT_GeomRect;
  pathLst?: CT_Path2DList;
}

export const CT_CustomGeometry2D_Attributes: Attributes = {
  avLst: {
    type: 'child',
    childAttributes: CT_GeomGuideList_Attributes
  },
  gdLst: {
    type: 'child',
    childAttributes: CT_GeomGuideList_Attributes
  },
  ahLst: {
    type: 'child',
    childAttributes: CT_AdjustHandleList_Attributes
  },
  cxnLst: {
    type: 'child',
    childAttributes: CT_ConnectionSiteList_Attributes
  },
  rect: {
    type: 'child',
    childAttributes: CT_GeomRect_Attributes
  },
  pathLst: {
    type: 'child',
    childAttributes: CT_Path2DList_Attributes
  }
};

export type ST_ShapeType =
  | 'line'
  | 'lineInv'
  | 'triangle'
  | 'rtTriangle'
  | 'rect'
  | 'diamond'
  | 'parallelogram'
  | 'trapezoid'
  | 'nonIsoscelesTrapezoid'
  | 'pentagon'
  | 'hexagon'
  | 'heptagon'
  | 'octagon'
  | 'decagon'
  | 'dodecagon'
  | 'star4'
  | 'star5'
  | 'star6'
  | 'star7'
  | 'star8'
  | 'star10'
  | 'star12'
  | 'star16'
  | 'star24'
  | 'star32'
  | 'roundRect'
  | 'round1Rect'
  | 'round2SameRect'
  | 'round2DiagRect'
  | 'snipRoundRect'
  | 'snip1Rect'
  | 'snip2SameRect'
  | 'snip2DiagRect'
  | 'plaque'
  | 'ellipse'
  | 'teardrop'
  | 'homePlate'
  | 'chevron'
  | 'pieWedge'
  | 'pie'
  | 'blockArc'
  | 'donut'
  | 'noSmoking'
  | 'rightArrow'
  | 'leftArrow'
  | 'upArrow'
  | 'downArrow'
  | 'stripedRightArrow'
  | 'notchedRightArrow'
  | 'bentUpArrow'
  | 'leftRightArrow'
  | 'upDownArrow'
  | 'leftUpArrow'
  | 'leftRightUpArrow'
  | 'quadArrow'
  | 'leftArrowCallout'
  | 'rightArrowCallout'
  | 'upArrowCallout'
  | 'downArrowCallout'
  | 'leftRightArrowCallout'
  | 'upDownArrowCallout'
  | 'quadArrowCallout'
  | 'bentArrow'
  | 'uturnArrow'
  | 'circularArrow'
  | 'leftCircularArrow'
  | 'leftRightCircularArrow'
  | 'curvedRightArrow'
  | 'curvedLeftArrow'
  | 'curvedUpArrow'
  | 'curvedDownArrow'
  | 'swooshArrow'
  | 'cube'
  | 'can'
  | 'lightningBolt'
  | 'heart'
  | 'sun'
  | 'moon'
  | 'smileyFace'
  | 'irregularSeal1'
  | 'irregularSeal2'
  | 'foldedCorner'
  | 'bevel'
  | 'frame'
  | 'halfFrame'
  | 'corner'
  | 'diagStripe'
  | 'chord'
  | 'arc'
  | 'leftBracket'
  | 'rightBracket'
  | 'leftBrace'
  | 'rightBrace'
  | 'bracketPair'
  | 'bracePair'
  | 'straightConnector1'
  | 'bentConnector2'
  | 'bentConnector3'
  | 'bentConnector4'
  | 'bentConnector5'
  | 'curvedConnector2'
  | 'curvedConnector3'
  | 'curvedConnector4'
  | 'curvedConnector5'
  | 'callout1'
  | 'callout2'
  | 'callout3'
  | 'accentCallout1'
  | 'accentCallout2'
  | 'accentCallout3'
  | 'borderCallout1'
  | 'borderCallout2'
  | 'borderCallout3'
  | 'accentBorderCallout1'
  | 'accentBorderCallout2'
  | 'accentBorderCallout3'
  | 'wedgeRectCallout'
  | 'wedgeRoundRectCallout'
  | 'wedgeEllipseCallout'
  | 'cloudCallout'
  | 'cloud'
  | 'ribbon'
  | 'ribbon2'
  | 'ellipseRibbon'
  | 'ellipseRibbon2'
  | 'leftRightRibbon'
  | 'verticalScroll'
  | 'horizontalScroll'
  | 'wave'
  | 'doubleWave'
  | 'plus'
  | 'flowChartProcess'
  | 'flowChartDecision'
  | 'flowChartInputOutput'
  | 'flowChartPredefinedProcess'
  | 'flowChartInternalStorage'
  | 'flowChartDocument'
  | 'flowChartMultidocument'
  | 'flowChartTerminator'
  | 'flowChartPreparation'
  | 'flowChartManualInput'
  | 'flowChartManualOperation'
  | 'flowChartConnector'
  | 'flowChartPunchedCard'
  | 'flowChartPunchedTape'
  | 'flowChartSummingJunction'
  | 'flowChartOr'
  | 'flowChartCollate'
  | 'flowChartSort'
  | 'flowChartExtract'
  | 'flowChartMerge'
  | 'flowChartOfflineStorage'
  | 'flowChartOnlineStorage'
  | 'flowChartMagneticTape'
  | 'flowChartMagneticDisk'
  | 'flowChartMagneticDrum'
  | 'flowChartDisplay'
  | 'flowChartDelay'
  | 'flowChartAlternateProcess'
  | 'flowChartOffpageConnector'
  | 'actionButtonBlank'
  | 'actionButtonHome'
  | 'actionButtonHelp'
  | 'actionButtonInformation'
  | 'actionButtonForwardNext'
  | 'actionButtonBackPrevious'
  | 'actionButtonEnd'
  | 'actionButtonBeginning'
  | 'actionButtonReturn'
  | 'actionButtonDocument'
  | 'actionButtonSound'
  | 'actionButtonMovie'
  | 'gear6'
  | 'gear9'
  | 'funnel'
  | 'mathPlus'
  | 'mathMinus'
  | 'mathMultiply'
  | 'mathDivide'
  | 'mathEqual'
  | 'mathNotEqual'
  | 'cornerTabs'
  | 'squareTabs'
  | 'plaqueTabs'
  | 'chartX'
  | 'chartStar'
  | 'chartPlus';

export interface CT_PresetGeometry2D {
  avLst?: CT_GeomGuideList;
  prst?: ST_ShapeType;
}

export const CT_PresetGeometry2D_Attributes: Attributes = {
  avLst: {
    type: 'child',
    childAttributes: CT_GeomGuideList_Attributes
  },
  prst: {
    type: 'string'
  }
};

export interface CT_ShapeProperties {
  xfrm?: CT_Transform2D;
  custGeom?: CT_CustomGeometry2D;
  prstGeom?: CT_PresetGeometry2D;
  noFill?: CT_NoFillProperties;
  solidFill?: CT_SolidColorFillProperties;
  gradFill?: CT_GradientFillProperties;
  blipFill?: CT_BlipFillProperties;
  pattFill?: CT_PatternFillProperties;
  grpFill?: CT_GroupFillProperties;
  ln?: CT_LineProperties;
  effectLst?: CT_EffectList;
  effectDag?: CT_EffectContainer;
  scene3d?: CT_Scene3D;
  sp3d?: CT_Shape3D;
  extLst?: CT_OfficeArtExtensionList;
  bwMode?: ST_BlackWhiteMode;
}

export const CT_ShapeProperties_Attributes: Attributes = {
  xfrm: {
    type: 'child',
    childAttributes: CT_Transform2D_Attributes
  },
  custGeom: {
    type: 'child',
    childAttributes: CT_CustomGeometry2D_Attributes
  },
  prstGeom: {
    type: 'child',
    childAttributes: CT_PresetGeometry2D_Attributes
  },
  noFill: {
    type: 'child',
    childAttributes: CT_NoFillProperties_Attributes
  },
  solidFill: {
    type: 'child',
    childAttributes: CT_SolidColorFillProperties_Attributes
  },
  gradFill: {
    type: 'child',
    childAttributes: CT_GradientFillProperties_Attributes
  },
  blipFill: {
    type: 'child',
    childAttributes: CT_BlipFillProperties_Attributes
  },
  pattFill: {
    type: 'child',
    childAttributes: CT_PatternFillProperties_Attributes
  },
  grpFill: {
    type: 'child',
    childAttributes: CT_GroupFillProperties_Attributes
  },
  ln: {
    type: 'child',
    childAttributes: CT_LineProperties_Attributes
  },
  effectLst: {
    type: 'child',
    childAttributes: CT_EffectList_Attributes
  },
  effectDag: {
    type: 'child',
    childAttributes: CT_EffectContainer_Attributes
  },
  scene3d: {
    type: 'child',
    childAttributes: CT_Scene3D_Attributes
  },
  sp3d: {
    type: 'child',
    childAttributes: CT_Shape3D_Attributes
  },
  extLst: {
    type: 'child',
    childAttributes: CT_OfficeArtExtensionList_Attributes
  },
  bwMode: {
    type: 'string'
  }
};

export interface CT_StyleMatrixReference {
  scrgbClr?: CT_ScRgbColor;
  srgbClr?: CT_SRgbColor;
  hslClr?: CT_HslColor;
  sysClr?: CT_SystemColor;
  schemeClr?: CT_SchemeColor;
  prstClr?: CT_PresetColor;
  idx?: number;
}

export const CT_StyleMatrixReference_Attributes: Attributes = {
  scrgbClr: {
    type: 'child',
    childAttributes: CT_ScRgbColor_Attributes
  },
  srgbClr: {
    type: 'child',
    childAttributes: CT_SRgbColor_Attributes
  },
  hslClr: {
    type: 'child',
    childAttributes: CT_HslColor_Attributes
  },
  sysClr: {
    type: 'child',
    childAttributes: CT_SystemColor_Attributes
  },
  schemeClr: {
    type: 'child',
    childAttributes: CT_SchemeColor_Attributes
  },
  prstClr: {
    type: 'child',
    childAttributes: CT_PresetColor_Attributes
  },
  idx: {
    type: 'int'
  }
};

export interface CT_FontReference {
  scrgbClr?: CT_ScRgbColor;
  srgbClr?: CT_SRgbColor;
  hslClr?: CT_HslColor;
  sysClr?: CT_SystemColor;
  schemeClr?: CT_SchemeColor;
  prstClr?: CT_PresetColor;
  idx?: ST_FontCollectionIndex;
}

export const CT_FontReference_Attributes: Attributes = {
  scrgbClr: {
    type: 'child',
    childAttributes: CT_ScRgbColor_Attributes
  },
  srgbClr: {
    type: 'child',
    childAttributes: CT_SRgbColor_Attributes
  },
  hslClr: {
    type: 'child',
    childAttributes: CT_HslColor_Attributes
  },
  sysClr: {
    type: 'child',
    childAttributes: CT_SystemColor_Attributes
  },
  schemeClr: {
    type: 'child',
    childAttributes: CT_SchemeColor_Attributes
  },
  prstClr: {
    type: 'child',
    childAttributes: CT_PresetColor_Attributes
  },
  idx: {
    type: 'string'
  }
};

export interface CT_ShapeStyle {
  lnRef?: CT_StyleMatrixReference;
  fillRef?: CT_StyleMatrixReference;
  effectRef?: CT_StyleMatrixReference;
  fontRef?: CT_FontReference;
}

export const CT_ShapeStyle_Attributes: Attributes = {
  lnRef: {
    type: 'child',
    childAttributes: CT_StyleMatrixReference_Attributes
  },
  fillRef: {
    type: 'child',
    childAttributes: CT_StyleMatrixReference_Attributes
  },
  effectRef: {
    type: 'child',
    childAttributes: CT_StyleMatrixReference_Attributes
  },
  fontRef: {
    type: 'child',
    childAttributes: CT_FontReference_Attributes
  }
};

export interface CT_GvmlShape {
  nvSpPr?: CT_GvmlShapeNonVisual;
  spPr?: CT_ShapeProperties;
  txSp?: CT_GvmlTextShape;
  style?: CT_ShapeStyle;
  extLst?: CT_OfficeArtExtensionList;
}

export const CT_GvmlShape_Attributes: Attributes = {
  nvSpPr: {
    type: 'child',
    childAttributes: CT_GvmlShapeNonVisual_Attributes
  },
  spPr: {
    type: 'child',
    childAttributes: CT_ShapeProperties_Attributes
  },
  txSp: {
    type: 'child',
    childAttributes: CT_GvmlTextShape_Attributes
  },
  style: {
    type: 'child',
    childAttributes: CT_ShapeStyle_Attributes
  },
  extLst: {
    type: 'child',
    childAttributes: CT_OfficeArtExtensionList_Attributes
  }
};

export interface CT_GvmlConnectorNonVisual {
  cNvPr?: CT_NonVisualDrawingProps;
  cNvCxnSpPr?: CT_NonVisualConnectorProperties;
}

export const CT_GvmlConnectorNonVisual_Attributes: Attributes = {
  cNvPr: {
    type: 'child',
    childAttributes: CT_NonVisualDrawingProps_Attributes
  },
  cNvCxnSpPr: {
    type: 'child',
    childAttributes: CT_NonVisualConnectorProperties_Attributes
  }
};

export interface CT_GvmlConnector {
  nvCxnSpPr?: CT_GvmlConnectorNonVisual;
  spPr?: CT_ShapeProperties;
  style?: CT_ShapeStyle;
  extLst?: CT_OfficeArtExtensionList;
}

export const CT_GvmlConnector_Attributes: Attributes = {
  nvCxnSpPr: {
    type: 'child',
    childAttributes: CT_GvmlConnectorNonVisual_Attributes
  },
  spPr: {
    type: 'child',
    childAttributes: CT_ShapeProperties_Attributes
  },
  style: {
    type: 'child',
    childAttributes: CT_ShapeStyle_Attributes
  },
  extLst: {
    type: 'child',
    childAttributes: CT_OfficeArtExtensionList_Attributes
  }
};

export interface CT_GvmlPictureNonVisual {
  cNvPr?: CT_NonVisualDrawingProps;
  cNvPicPr?: CT_NonVisualPictureProperties;
}

export const CT_GvmlPictureNonVisual_Attributes: Attributes = {
  cNvPr: {
    type: 'child',
    childAttributes: CT_NonVisualDrawingProps_Attributes
  },
  cNvPicPr: {
    type: 'child',
    childAttributes: CT_NonVisualPictureProperties_Attributes
  }
};

export interface CT_GvmlPicture {
  nvPicPr?: CT_GvmlPictureNonVisual;
  blipFill?: CT_BlipFillProperties;
  spPr?: CT_ShapeProperties;
  style?: CT_ShapeStyle;
  extLst?: CT_OfficeArtExtensionList;
}

export const CT_GvmlPicture_Attributes: Attributes = {
  nvPicPr: {
    type: 'child',
    childAttributes: CT_GvmlPictureNonVisual_Attributes
  },
  blipFill: {
    type: 'child',
    childAttributes: CT_BlipFillProperties_Attributes
  },
  spPr: {
    type: 'child',
    childAttributes: CT_ShapeProperties_Attributes
  },
  style: {
    type: 'child',
    childAttributes: CT_ShapeStyle_Attributes
  },
  extLst: {
    type: 'child',
    childAttributes: CT_OfficeArtExtensionList_Attributes
  }
};

export interface CT_GvmlGraphicFrameNonVisual {
  cNvPr?: CT_NonVisualDrawingProps;
  cNvGraphicFramePr?: CT_NonVisualGraphicFrameProperties;
}

export const CT_GvmlGraphicFrameNonVisual_Attributes: Attributes = {
  cNvPr: {
    type: 'child',
    childAttributes: CT_NonVisualDrawingProps_Attributes
  },
  cNvGraphicFramePr: {
    type: 'child',
    childAttributes: CT_NonVisualGraphicFrameProperties_Attributes
  }
};

export interface CT_GvmlGraphicalObjectFrame {
  nvGraphicFramePr?: CT_GvmlGraphicFrameNonVisual;
  xfrm?: CT_Transform2D;
  extLst?: CT_OfficeArtExtensionList;
}

export const CT_GvmlGraphicalObjectFrame_Attributes: Attributes = {
  nvGraphicFramePr: {
    type: 'child',
    childAttributes: CT_GvmlGraphicFrameNonVisual_Attributes
  },
  xfrm: {
    type: 'child',
    childAttributes: CT_Transform2D_Attributes
  },
  extLst: {
    type: 'child',
    childAttributes: CT_OfficeArtExtensionList_Attributes
  }
};

export interface CT_GvmlGroupShapeNonVisual {
  cNvPr?: CT_NonVisualDrawingProps;
  cNvGrpSpPr?: CT_NonVisualGroupDrawingShapeProps;
}

export const CT_GvmlGroupShapeNonVisual_Attributes: Attributes = {
  cNvPr: {
    type: 'child',
    childAttributes: CT_NonVisualDrawingProps_Attributes
  },
  cNvGrpSpPr: {
    type: 'child',
    childAttributes: CT_NonVisualGroupDrawingShapeProps_Attributes
  }
};

export type CT_GvmlGroupShape = any;
export const CT_GvmlGroupShape_Attributes: Attributes = {};

export interface CT_GroupShapeProperties {
  xfrm?: CT_GroupTransform2D;
  noFill?: CT_NoFillProperties;
  solidFill?: CT_SolidColorFillProperties;
  gradFill?: CT_GradientFillProperties;
  blipFill?: CT_BlipFillProperties;
  pattFill?: CT_PatternFillProperties;
  grpFill?: CT_GroupFillProperties;
  effectLst?: CT_EffectList;
  effectDag?: CT_EffectContainer;
  scene3d?: CT_Scene3D;
  extLst?: CT_OfficeArtExtensionList;
  bwMode?: ST_BlackWhiteMode;
}

export const CT_GroupShapeProperties_Attributes: Attributes = {
  xfrm: {
    type: 'child',
    childAttributes: CT_GroupTransform2D_Attributes
  },
  noFill: {
    type: 'child',
    childAttributes: CT_NoFillProperties_Attributes
  },
  solidFill: {
    type: 'child',
    childAttributes: CT_SolidColorFillProperties_Attributes
  },
  gradFill: {
    type: 'child',
    childAttributes: CT_GradientFillProperties_Attributes
  },
  blipFill: {
    type: 'child',
    childAttributes: CT_BlipFillProperties_Attributes
  },
  pattFill: {
    type: 'child',
    childAttributes: CT_PatternFillProperties_Attributes
  },
  grpFill: {
    type: 'child',
    childAttributes: CT_GroupFillProperties_Attributes
  },
  effectLst: {
    type: 'child',
    childAttributes: CT_EffectList_Attributes
  },
  effectDag: {
    type: 'child',
    childAttributes: CT_EffectContainer_Attributes
  },
  scene3d: {
    type: 'child',
    childAttributes: CT_Scene3D_Attributes
  },
  extLst: {
    type: 'child',
    childAttributes: CT_OfficeArtExtensionList_Attributes
  },
  bwMode: {
    type: 'string'
  }
};

export interface CT_AlphaOutsetEffect {
  rad?: ST_Coordinate;
}

export const CT_AlphaOutsetEffect_Attributes: Attributes = {
  rad: {
    type: 'string',
    defaultValue: '0'
  }
};

export interface CT_RelativeOffsetEffect {
  tx?: string;
  ty?: string;
}

export const CT_RelativeOffsetEffect_Attributes: Attributes = {
  tx: {
    type: 'string',
    defaultValue: '0%'
  },
  ty: {
    type: 'string',
    defaultValue: '0%'
  }
};

export interface CT_TransformEffect {
  sx?: string;
  sy?: string;
  kx?: number;
  ky?: number;
  tx?: ST_Coordinate;
  ty?: ST_Coordinate;
}

export const CT_TransformEffect_Attributes: Attributes = {
  sx: {
    type: 'string',
    defaultValue: '100%'
  },
  sy: {
    type: 'string',
    defaultValue: '100%'
  },
  kx: {
    type: 'int',
    defaultValue: '0'
  },
  ky: {
    type: 'int',
    defaultValue: '0'
  },
  tx: {
    type: 'string',
    defaultValue: '0'
  },
  ty: {
    type: 'string',
    defaultValue: '0'
  }
};

export interface CT_FillProperties {
  noFill?: CT_NoFillProperties;
  solidFill?: CT_SolidColorFillProperties;
  gradFill?: CT_GradientFillProperties;
  blipFill?: CT_BlipFillProperties;
  pattFill?: CT_PatternFillProperties;
  grpFill?: CT_GroupFillProperties;
}

export const CT_FillProperties_Attributes: Attributes = {
  noFill: {
    type: 'child',
    childAttributes: CT_NoFillProperties_Attributes
  },
  solidFill: {
    type: 'child',
    childAttributes: CT_SolidColorFillProperties_Attributes
  },
  gradFill: {
    type: 'child',
    childAttributes: CT_GradientFillProperties_Attributes
  },
  blipFill: {
    type: 'child',
    childAttributes: CT_BlipFillProperties_Attributes
  },
  pattFill: {
    type: 'child',
    childAttributes: CT_PatternFillProperties_Attributes
  },
  grpFill: {
    type: 'child',
    childAttributes: CT_GroupFillProperties_Attributes
  }
};

export interface CT_FillEffect {
  noFill?: CT_NoFillProperties;
  solidFill?: CT_SolidColorFillProperties;
  gradFill?: CT_GradientFillProperties;
  blipFill?: CT_BlipFillProperties;
  pattFill?: CT_PatternFillProperties;
  grpFill?: CT_GroupFillProperties;
}

export const CT_FillEffect_Attributes: Attributes = {
  noFill: {
    type: 'child',
    childAttributes: CT_NoFillProperties_Attributes
  },
  solidFill: {
    type: 'child',
    childAttributes: CT_SolidColorFillProperties_Attributes
  },
  gradFill: {
    type: 'child',
    childAttributes: CT_GradientFillProperties_Attributes
  },
  blipFill: {
    type: 'child',
    childAttributes: CT_BlipFillProperties_Attributes
  },
  pattFill: {
    type: 'child',
    childAttributes: CT_PatternFillProperties_Attributes
  },
  grpFill: {
    type: 'child',
    childAttributes: CT_GroupFillProperties_Attributes
  }
};

export interface CT_EffectReference {
  ref?: string;
}

export const CT_EffectReference_Attributes: Attributes = {
  ref: {
    type: 'string'
  }
};

export interface CT_BlendEffect {
  cont?: CT_EffectContainer;
  blend?: ST_BlendMode;
}

export const CT_BlendEffect_Attributes: Attributes = {
  cont: {
    type: 'child',
    childAttributes: CT_EffectContainer_Attributes
  },
  blend: {
    type: 'string'
  }
};

export interface CT_EffectProperties {
  effectLst?: CT_EffectList;
  effectDag?: CT_EffectContainer;
}

export const CT_EffectProperties_Attributes: Attributes = {
  effectLst: {
    type: 'child',
    childAttributes: CT_EffectList_Attributes
  },
  effectDag: {
    type: 'child',
    childAttributes: CT_EffectContainer_Attributes
  }
};

export type ST_ShapeID = string;

export interface CT_DefaultShapeDefinition {
  spPr?: CT_ShapeProperties;
  bodyPr?: CT_TextBodyProperties;
  lstStyle?: CT_TextListStyle;
  style?: CT_ShapeStyle;
  extLst?: CT_OfficeArtExtensionList;
}

export const CT_DefaultShapeDefinition_Attributes: Attributes = {
  spPr: {
    type: 'child',
    childAttributes: CT_ShapeProperties_Attributes
  },
  bodyPr: {
    type: 'child',
    childAttributes: CT_TextBodyProperties_Attributes
  },
  lstStyle: {
    type: 'child',
    childAttributes: CT_TextListStyle_Attributes
  },
  style: {
    type: 'child',
    childAttributes: CT_ShapeStyle_Attributes
  },
  extLst: {
    type: 'child',
    childAttributes: CT_OfficeArtExtensionList_Attributes
  }
};

export interface CT_ObjectStyleDefaults {
  spDef?: CT_DefaultShapeDefinition;
  lnDef?: CT_DefaultShapeDefinition;
  txDef?: CT_DefaultShapeDefinition;
  extLst?: CT_OfficeArtExtensionList;
}

export const CT_ObjectStyleDefaults_Attributes: Attributes = {
  spDef: {
    type: 'child',
    childAttributes: CT_DefaultShapeDefinition_Attributes
  },
  lnDef: {
    type: 'child',
    childAttributes: CT_DefaultShapeDefinition_Attributes
  },
  txDef: {
    type: 'child',
    childAttributes: CT_DefaultShapeDefinition_Attributes
  },
  extLst: {
    type: 'child',
    childAttributes: CT_OfficeArtExtensionList_Attributes
  }
};

export interface CT_EmptyElement {}

export const CT_EmptyElement_Attributes: Attributes = {};

export interface CT_ColorMapping {
  extLst?: CT_OfficeArtExtensionList;
  bg1?: ST_ColorSchemeIndex;
  tx1?: ST_ColorSchemeIndex;
  bg2?: ST_ColorSchemeIndex;
  tx2?: ST_ColorSchemeIndex;
  accent1?: ST_ColorSchemeIndex;
  accent2?: ST_ColorSchemeIndex;
  accent3?: ST_ColorSchemeIndex;
  accent4?: ST_ColorSchemeIndex;
  accent5?: ST_ColorSchemeIndex;
  accent6?: ST_ColorSchemeIndex;
  hlink?: ST_ColorSchemeIndex;
  folHlink?: ST_ColorSchemeIndex;
}

export const CT_ColorMapping_Attributes: Attributes = {
  extLst: {
    type: 'child',
    childAttributes: CT_OfficeArtExtensionList_Attributes
  },
  bg1: {
    type: 'string'
  },
  tx1: {
    type: 'string'
  },
  bg2: {
    type: 'string'
  },
  tx2: {
    type: 'string'
  },
  accent1: {
    type: 'string'
  },
  accent2: {
    type: 'string'
  },
  accent3: {
    type: 'string'
  },
  accent4: {
    type: 'string'
  },
  accent5: {
    type: 'string'
  },
  accent6: {
    type: 'string'
  },
  hlink: {
    type: 'string'
  },
  folHlink: {
    type: 'string'
  }
};

export interface CT_ColorMappingOverride {
  masterClrMapping?: CT_EmptyElement[];
  overrideClrMapping?: CT_ColorMapping[];
}

export const CT_ColorMappingOverride_Attributes: Attributes = {
  masterClrMapping: {
    type: 'child',
    childAttributes: CT_EmptyElement_Attributes,
    childIsArray: true
  },
  overrideClrMapping: {
    type: 'child',
    childAttributes: CT_ColorMapping_Attributes,
    childIsArray: true
  }
};

export interface CT_ColorSchemeAndMapping {
  clrScheme?: CT_ColorScheme;
  clrMap?: CT_ColorMapping;
}

export const CT_ColorSchemeAndMapping_Attributes: Attributes = {
  clrScheme: {
    type: 'child',
    childAttributes: CT_ColorScheme_Attributes
  },
  clrMap: {
    type: 'child',
    childAttributes: CT_ColorMapping_Attributes
  }
};

export interface CT_ColorSchemeList {
  extraClrScheme?: CT_ColorSchemeAndMapping[];
}

export const CT_ColorSchemeList_Attributes: Attributes = {
  extraClrScheme: {
    type: 'child',
    childAttributes: CT_ColorSchemeAndMapping_Attributes,
    childIsArray: true
  }
};

export interface CT_OfficeStyleSheet {
  themeElements?: CT_BaseStyles;
  objectDefaults?: CT_ObjectStyleDefaults;
  extraClrSchemeLst?: CT_ColorSchemeList;
  custClrLst?: CT_CustomColorList;
  extLst?: CT_OfficeArtExtensionList;
  name?: string;
}

export const CT_OfficeStyleSheet_Attributes: Attributes = {
  themeElements: {
    type: 'child',
    childAttributes: CT_BaseStyles_Attributes
  },
  objectDefaults: {
    type: 'child',
    childAttributes: CT_ObjectStyleDefaults_Attributes
  },
  extraClrSchemeLst: {
    type: 'child',
    childAttributes: CT_ColorSchemeList_Attributes
  },
  custClrLst: {
    type: 'child',
    childAttributes: CT_CustomColorList_Attributes
  },
  extLst: {
    type: 'child',
    childAttributes: CT_OfficeArtExtensionList_Attributes
  },
  name: {
    type: 'string'
  }
};

export interface CT_BaseStylesOverride {
  clrScheme?: CT_ColorScheme;
  fontScheme?: CT_FontScheme;
  fmtScheme?: CT_StyleMatrix;
}

export const CT_BaseStylesOverride_Attributes: Attributes = {
  clrScheme: {
    type: 'child',
    childAttributes: CT_ColorScheme_Attributes
  },
  fontScheme: {
    type: 'child',
    childAttributes: CT_FontScheme_Attributes
  },
  fmtScheme: {
    type: 'child',
    childAttributes: CT_StyleMatrix_Attributes
  }
};

export interface CT_ClipboardStyleSheet {
  themeElements?: CT_BaseStyles;
  clrMap?: CT_ColorMapping;
}

export const CT_ClipboardStyleSheet_Attributes: Attributes = {
  themeElements: {
    type: 'child',
    childAttributes: CT_BaseStyles_Attributes
  },
  clrMap: {
    type: 'child',
    childAttributes: CT_ColorMapping_Attributes
  }
};

export interface CT_Cell3D {
  bevel?: CT_Bevel;
  lightRig?: CT_LightRig;
  extLst?: CT_OfficeArtExtensionList;
  prstMaterial?: ST_PresetMaterialType;
}

export const CT_Cell3D_Attributes: Attributes = {
  bevel: {
    type: 'child',
    childAttributes: CT_Bevel_Attributes
  },
  lightRig: {
    type: 'child',
    childAttributes: CT_LightRig_Attributes
  },
  extLst: {
    type: 'child',
    childAttributes: CT_OfficeArtExtensionList_Attributes
  },
  prstMaterial: {
    type: 'string',
    defaultValue: 'plastic'
  }
};

export interface CT_Headers {
  header?: string[];
}

export const CT_Headers_Attributes: Attributes = {
  header: {
    type: 'child-string',
    childIsArray: true
  }
};

export interface CT_TableCellProperties {
  lnL?: CT_LineProperties;
  lnR?: CT_LineProperties;
  lnT?: CT_LineProperties;
  lnB?: CT_LineProperties;
  lnTlToBr?: CT_LineProperties;
  lnBlToTr?: CT_LineProperties;
  cell3D?: CT_Cell3D;
  noFill?: CT_NoFillProperties;
  solidFill?: CT_SolidColorFillProperties;
  gradFill?: CT_GradientFillProperties;
  blipFill?: CT_BlipFillProperties;
  pattFill?: CT_PatternFillProperties;
  grpFill?: CT_GroupFillProperties;
  headers?: CT_Headers[];
  extLst?: CT_OfficeArtExtensionList;
  marL?: ST_Coordinate32;
  marR?: ST_Coordinate32;
  marT?: ST_Coordinate32;
  marB?: ST_Coordinate32;
  vert?: ST_TextVerticalType;
  anchor?: ST_TextAnchoringType;
  anchorCtr?: boolean;
  horzOverflow?: ST_TextHorzOverflowType;
}

export const CT_TableCellProperties_Attributes: Attributes = {
  lnL: {
    type: 'child',
    childAttributes: CT_LineProperties_Attributes
  },
  lnR: {
    type: 'child',
    childAttributes: CT_LineProperties_Attributes
  },
  lnT: {
    type: 'child',
    childAttributes: CT_LineProperties_Attributes
  },
  lnB: {
    type: 'child',
    childAttributes: CT_LineProperties_Attributes
  },
  lnTlToBr: {
    type: 'child',
    childAttributes: CT_LineProperties_Attributes
  },
  lnBlToTr: {
    type: 'child',
    childAttributes: CT_LineProperties_Attributes
  },
  cell3D: {
    type: 'child',
    childAttributes: CT_Cell3D_Attributes
  },
  noFill: {
    type: 'child',
    childAttributes: CT_NoFillProperties_Attributes
  },
  solidFill: {
    type: 'child',
    childAttributes: CT_SolidColorFillProperties_Attributes
  },
  gradFill: {
    type: 'child',
    childAttributes: CT_GradientFillProperties_Attributes
  },
  blipFill: {
    type: 'child',
    childAttributes: CT_BlipFillProperties_Attributes
  },
  pattFill: {
    type: 'child',
    childAttributes: CT_PatternFillProperties_Attributes
  },
  grpFill: {
    type: 'child',
    childAttributes: CT_GroupFillProperties_Attributes
  },
  headers: {
    type: 'child',
    childAttributes: CT_Headers_Attributes,
    childIsArray: true
  },
  extLst: {
    type: 'child',
    childAttributes: CT_OfficeArtExtensionList_Attributes
  },
  marL: {
    type: 'string',
    defaultValue: '91440'
  },
  marR: {
    type: 'string',
    defaultValue: '91440'
  },
  marT: {
    type: 'string',
    defaultValue: '45720'
  },
  marB: {
    type: 'string',
    defaultValue: '45720'
  },
  vert: {
    type: 'string',
    defaultValue: 'horz'
  },
  anchor: {
    type: 'string',
    defaultValue: 't'
  },
  anchorCtr: {
    type: 'boolean',
    defaultValue: 'false'
  },
  horzOverflow: {
    type: 'string',
    defaultValue: 'clip'
  }
};

export interface CT_TableCol {
  extLst?: CT_OfficeArtExtensionList;
  w?: ST_Coordinate;
}

export const CT_TableCol_Attributes: Attributes = {
  extLst: {
    type: 'child',
    childAttributes: CT_OfficeArtExtensionList_Attributes
  },
  w: {
    type: 'string'
  }
};

export interface CT_TableGrid {
  gridCol?: CT_TableCol[];
}

export const CT_TableGrid_Attributes: Attributes = {
  gridCol: {
    type: 'child',
    childAttributes: CT_TableCol_Attributes,
    childIsArray: true
  }
};

export interface CT_TableCell {
  txBody?: CT_TextBody;
  tcPr?: CT_TableCellProperties;
  extLst?: CT_OfficeArtExtensionList;
  rowSpan?: number;
  gridSpan?: number;
  hMerge?: boolean;
  vMerge?: boolean;
  id?: string;
}

export const CT_TableCell_Attributes: Attributes = {
  txBody: {
    type: 'child',
    childAttributes: CT_TextBody_Attributes
  },
  tcPr: {
    type: 'child',
    childAttributes: CT_TableCellProperties_Attributes
  },
  extLst: {
    type: 'child',
    childAttributes: CT_OfficeArtExtensionList_Attributes
  },
  rowSpan: {
    type: 'int',
    defaultValue: '1'
  },
  gridSpan: {
    type: 'int',
    defaultValue: '1'
  },
  hMerge: {
    type: 'boolean',
    defaultValue: 'false'
  },
  vMerge: {
    type: 'boolean',
    defaultValue: 'false'
  },
  id: {
    type: 'string'
  }
};

export interface CT_TableRow {
  tc?: CT_TableCell[];
  extLst?: CT_OfficeArtExtensionList;
  h?: ST_Coordinate;
}

export const CT_TableRow_Attributes: Attributes = {
  tc: {
    type: 'child',
    childAttributes: CT_TableCell_Attributes,
    childIsArray: true
  },
  extLst: {
    type: 'child',
    childAttributes: CT_OfficeArtExtensionList_Attributes
  },
  h: {
    type: 'string'
  }
};

export type ST_TableStyleType =
  | 'wholeTable'
  | 'headerRow'
  | 'totalRow'
  | 'firstColumn'
  | 'lastColumn'
  | 'firstRowStripe'
  | 'secondRowStripe'
  | 'firstColumnStripe'
  | 'secondColumnStripe'
  | 'firstHeaderCell'
  | 'lastHeaderCell'
  | 'firstTotalCell'
  | 'lastTotalCell'
  | 'firstSubtotalColumn'
  | 'secondSubtotalColumn'
  | 'thirdSubtotalColumn'
  | 'firstSubtotalRow'
  | 'secondSubtotalRow'
  | 'thirdSubtotalRow'
  | 'blankRow'
  | 'firstColumnSubheading'
  | 'secondColumnSubheading'
  | 'thirdColumnSubheading'
  | 'firstRowSubheading'
  | 'secondRowSubheading'
  | 'thirdRowSubheading'
  | 'pageFieldLabels'
  | 'pageFieldValues';

export type ST_DxfId = number;

export interface CT_TableStyleElement {
  type?: ST_TableStyleType;
  size?: number;
  dxfId?: number;
}

export const CT_TableStyleElement_Attributes: Attributes = {
  type: {
    type: 'string'
  },
  size: {
    type: 'int',
    defaultValue: '1'
  },
  dxfId: {
    type: 'int'
  }
};

export interface CT_TableStyle {
  tableStyleElement?: CT_TableStyleElement[];
  name?: string;
  pivot?: boolean;
  table?: boolean;
  count?: number;
}

export const CT_TableStyle_Attributes: Attributes = {
  tableStyleElement: {
    type: 'child',
    childAttributes: CT_TableStyleElement_Attributes,
    childIsArray: true
  },
  name: {
    type: 'string'
  },
  pivot: {
    type: 'boolean',
    defaultValue: 'true'
  },
  table: {
    type: 'boolean',
    defaultValue: 'true'
  },
  count: {
    type: 'int'
  }
};

export interface CT_TableProperties {
  noFill?: CT_NoFillProperties;
  solidFill?: CT_SolidColorFillProperties;
  gradFill?: CT_GradientFillProperties;
  blipFill?: CT_BlipFillProperties;
  pattFill?: CT_PatternFillProperties;
  grpFill?: CT_GroupFillProperties;
  effectLst?: CT_EffectList;
  effectDag?: CT_EffectContainer;
  tableStyle?: CT_TableStyle[];
  tableStyleId?: string[];
  extLst?: CT_OfficeArtExtensionList;
  rtl?: boolean;
  firstRow?: boolean;
  firstCol?: boolean;
  lastRow?: boolean;
  lastCol?: boolean;
  bandRow?: boolean;
  bandCol?: boolean;
}

export const CT_TableProperties_Attributes: Attributes = {
  noFill: {
    type: 'child',
    childAttributes: CT_NoFillProperties_Attributes
  },
  solidFill: {
    type: 'child',
    childAttributes: CT_SolidColorFillProperties_Attributes
  },
  gradFill: {
    type: 'child',
    childAttributes: CT_GradientFillProperties_Attributes
  },
  blipFill: {
    type: 'child',
    childAttributes: CT_BlipFillProperties_Attributes
  },
  pattFill: {
    type: 'child',
    childAttributes: CT_PatternFillProperties_Attributes
  },
  grpFill: {
    type: 'child',
    childAttributes: CT_GroupFillProperties_Attributes
  },
  effectLst: {
    type: 'child',
    childAttributes: CT_EffectList_Attributes
  },
  effectDag: {
    type: 'child',
    childAttributes: CT_EffectContainer_Attributes
  },
  tableStyle: {
    type: 'child',
    childAttributes: CT_TableStyle_Attributes,
    childIsArray: true
  },
  tableStyleId: {
    type: 'string',
    childIsArray: true
  },
  extLst: {
    type: 'child',
    childAttributes: CT_OfficeArtExtensionList_Attributes
  },
  rtl: {
    type: 'boolean',
    defaultValue: 'false'
  },
  firstRow: {
    type: 'boolean',
    defaultValue: 'false'
  },
  firstCol: {
    type: 'boolean',
    defaultValue: 'false'
  },
  lastRow: {
    type: 'boolean',
    defaultValue: 'false'
  },
  lastCol: {
    type: 'boolean',
    defaultValue: 'false'
  },
  bandRow: {
    type: 'boolean',
    defaultValue: 'false'
  },
  bandCol: {
    type: 'boolean',
    defaultValue: 'false'
  }
};

export interface CT_ThemeableLineStyle {
  ln?: CT_LineProperties;
  lnRef?: CT_StyleMatrixReference;
}

export const CT_ThemeableLineStyle_Attributes: Attributes = {
  ln: {
    type: 'child',
    childAttributes: CT_LineProperties_Attributes
  },
  lnRef: {
    type: 'child',
    childAttributes: CT_StyleMatrixReference_Attributes
  }
};

export type ST_OnOffStyleType = 'on' | 'off' | 'def';

export interface CT_TableStyleTextStyle {
  font?: CT_FontCollection;
  fontRef?: CT_FontReference;
  scrgbClr?: CT_ScRgbColor;
  srgbClr?: CT_SRgbColor;
  hslClr?: CT_HslColor;
  sysClr?: CT_SystemColor;
  schemeClr?: CT_SchemeColor;
  prstClr?: CT_PresetColor;
  extLst?: CT_OfficeArtExtensionList;
  b?: ST_OnOffStyleType;
  i?: ST_OnOffStyleType;
}

export const CT_TableStyleTextStyle_Attributes: Attributes = {
  font: {
    type: 'child',
    childAttributes: CT_FontCollection_Attributes
  },
  fontRef: {
    type: 'child',
    childAttributes: CT_FontReference_Attributes
  },
  scrgbClr: {
    type: 'child',
    childAttributes: CT_ScRgbColor_Attributes
  },
  srgbClr: {
    type: 'child',
    childAttributes: CT_SRgbColor_Attributes
  },
  hslClr: {
    type: 'child',
    childAttributes: CT_HslColor_Attributes
  },
  sysClr: {
    type: 'child',
    childAttributes: CT_SystemColor_Attributes
  },
  schemeClr: {
    type: 'child',
    childAttributes: CT_SchemeColor_Attributes
  },
  prstClr: {
    type: 'child',
    childAttributes: CT_PresetColor_Attributes
  },
  extLst: {
    type: 'child',
    childAttributes: CT_OfficeArtExtensionList_Attributes
  },
  b: {
    type: 'string',
    defaultValue: 'def'
  },
  i: {
    type: 'string',
    defaultValue: 'def'
  }
};

export interface CT_TableCellBorderStyle {
  left?: CT_ThemeableLineStyle;
  right?: CT_ThemeableLineStyle;
  top?: CT_ThemeableLineStyle;
  bottom?: CT_ThemeableLineStyle;
  insideH?: CT_ThemeableLineStyle;
  insideV?: CT_ThemeableLineStyle;
  tl2br?: CT_ThemeableLineStyle;
  tr2bl?: CT_ThemeableLineStyle;
  extLst?: CT_OfficeArtExtensionList;
}

export const CT_TableCellBorderStyle_Attributes: Attributes = {
  left: {
    type: 'child',
    childAttributes: CT_ThemeableLineStyle_Attributes
  },
  right: {
    type: 'child',
    childAttributes: CT_ThemeableLineStyle_Attributes
  },
  top: {
    type: 'child',
    childAttributes: CT_ThemeableLineStyle_Attributes
  },
  bottom: {
    type: 'child',
    childAttributes: CT_ThemeableLineStyle_Attributes
  },
  insideH: {
    type: 'child',
    childAttributes: CT_ThemeableLineStyle_Attributes
  },
  insideV: {
    type: 'child',
    childAttributes: CT_ThemeableLineStyle_Attributes
  },
  tl2br: {
    type: 'child',
    childAttributes: CT_ThemeableLineStyle_Attributes
  },
  tr2bl: {
    type: 'child',
    childAttributes: CT_ThemeableLineStyle_Attributes
  },
  extLst: {
    type: 'child',
    childAttributes: CT_OfficeArtExtensionList_Attributes
  }
};

export interface CT_TableBackgroundStyle {
  fill?: CT_FillProperties;
  fillRef?: CT_StyleMatrixReference;
  effect?: CT_EffectProperties;
  effectRef?: CT_StyleMatrixReference;
}

export const CT_TableBackgroundStyle_Attributes: Attributes = {
  fill: {
    type: 'child',
    childAttributes: CT_FillProperties_Attributes
  },
  fillRef: {
    type: 'child',
    childAttributes: CT_StyleMatrixReference_Attributes
  },
  effect: {
    type: 'child',
    childAttributes: CT_EffectProperties_Attributes
  },
  effectRef: {
    type: 'child',
    childAttributes: CT_StyleMatrixReference_Attributes
  }
};

export interface CT_TableStyleCellStyle {
  tcBdr?: CT_TableCellBorderStyle;
  fill?: CT_FillProperties;
  fillRef?: CT_StyleMatrixReference;
  cell3D?: CT_Cell3D;
}

export const CT_TableStyleCellStyle_Attributes: Attributes = {
  tcBdr: {
    type: 'child',
    childAttributes: CT_TableCellBorderStyle_Attributes
  },
  fill: {
    type: 'child',
    childAttributes: CT_FillProperties_Attributes
  },
  fillRef: {
    type: 'child',
    childAttributes: CT_StyleMatrixReference_Attributes
  },
  cell3D: {
    type: 'child',
    childAttributes: CT_Cell3D_Attributes
  }
};

export interface CT_TablePartStyle {
  tcTxStyle?: CT_TableStyleTextStyle;
  tcStyle?: CT_TableStyleCellStyle;
}

export const CT_TablePartStyle_Attributes: Attributes = {
  tcTxStyle: {
    type: 'child',
    childAttributes: CT_TableStyleTextStyle_Attributes
  },
  tcStyle: {
    type: 'child',
    childAttributes: CT_TableStyleCellStyle_Attributes
  }
};

export interface CT_TableStyleList {
  tblStyle?: CT_TableStyle[];
  def?: string;
}

export const CT_TableStyleList_Attributes: Attributes = {
  tblStyle: {
    type: 'child',
    childAttributes: CT_TableStyle_Attributes,
    childIsArray: true
  },
  def: {
    type: 'string'
  }
};

export type ST_TextBulletSize = string;

export type ST_TextPointUnqualified = number;

export interface CT_AnchorClientData {
  fLocksWithSheet?: boolean;
  fPrintsWithSheet?: boolean;
}

export const CT_AnchorClientData_Attributes: Attributes = {
  fLocksWithSheet: {
    type: 'boolean',
    defaultValue: 'true'
  },
  fPrintsWithSheet: {
    type: 'boolean',
    defaultValue: 'true'
  }
};

export interface CT_ShapeNonVisual {
  cNvPr?: CT_NonVisualDrawingProps;
  cNvSpPr?: CT_NonVisualDrawingShapeProps;
}

export const CT_ShapeNonVisual_Attributes: Attributes = {
  cNvPr: {
    type: 'child',
    childAttributes: CT_NonVisualDrawingProps_Attributes
  },
  cNvSpPr: {
    type: 'child',
    childAttributes: CT_NonVisualDrawingShapeProps_Attributes
  }
};

export interface CT_Shape {
  nvSpPr?: CT_ShapeNonVisual;
  spPr?: CT_ShapeProperties;
  style?: CT_ShapeStyle;
  txBody?: CT_TextBody;
  macro?: string;
  textlink?: string;
  fLocksText?: boolean;
  fPublished?: boolean;
}

export const CT_Shape_Attributes: Attributes = {
  nvSpPr: {
    type: 'child',
    childAttributes: CT_ShapeNonVisual_Attributes
  },
  spPr: {
    type: 'child',
    childAttributes: CT_ShapeProperties_Attributes
  },
  style: {
    type: 'child',
    childAttributes: CT_ShapeStyle_Attributes
  },
  txBody: {
    type: 'child',
    childAttributes: CT_TextBody_Attributes
  },
  macro: {
    type: 'string'
  },
  textlink: {
    type: 'string'
  },
  fLocksText: {
    type: 'boolean',
    defaultValue: 'true'
  },
  fPublished: {
    type: 'boolean',
    defaultValue: 'false'
  }
};

export interface CT_ConnectorNonVisual {
  cNvPr?: CT_NonVisualDrawingProps;
  cNvCxnSpPr?: CT_NonVisualConnectorProperties;
}

export const CT_ConnectorNonVisual_Attributes: Attributes = {
  cNvPr: {
    type: 'child',
    childAttributes: CT_NonVisualDrawingProps_Attributes
  },
  cNvCxnSpPr: {
    type: 'child',
    childAttributes: CT_NonVisualConnectorProperties_Attributes
  }
};

export interface CT_Connector {
  nvCxnSpPr?: CT_ConnectorNonVisual;
  spPr?: CT_ShapeProperties;
  style?: CT_ShapeStyle;
  macro?: string;
  fPublished?: boolean;
}

export const CT_Connector_Attributes: Attributes = {
  nvCxnSpPr: {
    type: 'child',
    childAttributes: CT_ConnectorNonVisual_Attributes
  },
  spPr: {
    type: 'child',
    childAttributes: CT_ShapeProperties_Attributes
  },
  style: {
    type: 'child',
    childAttributes: CT_ShapeStyle_Attributes
  },
  macro: {
    type: 'string'
  },
  fPublished: {
    type: 'boolean',
    defaultValue: 'false'
  }
};

export interface CT_PictureNonVisual {
  cNvPr?: CT_NonVisualDrawingProps;
  cNvPicPr?: CT_NonVisualPictureProperties;
}

export const CT_PictureNonVisual_Attributes: Attributes = {
  cNvPr: {
    type: 'child',
    childAttributes: CT_NonVisualDrawingProps_Attributes
  },
  cNvPicPr: {
    type: 'child',
    childAttributes: CT_NonVisualPictureProperties_Attributes
  }
};

export interface CT_Picture {
  nvPicPr?: CT_PictureNonVisual;
  blipFill?: CT_BlipFillProperties;
  spPr?: CT_ShapeProperties;
  style?: CT_ShapeStyle;
  macro?: string;
  fPublished?: boolean;
}

export const CT_Picture_Attributes: Attributes = {
  nvPicPr: {
    type: 'child',
    childAttributes: CT_PictureNonVisual_Attributes
  },
  blipFill: {
    type: 'child',
    childAttributes: CT_BlipFillProperties_Attributes
  },
  spPr: {
    type: 'child',
    childAttributes: CT_ShapeProperties_Attributes
  },
  style: {
    type: 'child',
    childAttributes: CT_ShapeStyle_Attributes
  },
  macro: {
    type: 'string'
  },
  fPublished: {
    type: 'boolean',
    defaultValue: 'false'
  }
};

export interface CT_GraphicalObjectFrameNonVisual {
  cNvPr?: CT_NonVisualDrawingProps;
  cNvGraphicFramePr?: CT_NonVisualGraphicFrameProperties;
}

export const CT_GraphicalObjectFrameNonVisual_Attributes: Attributes = {
  cNvPr: {
    type: 'child',
    childAttributes: CT_NonVisualDrawingProps_Attributes
  },
  cNvGraphicFramePr: {
    type: 'child',
    childAttributes: CT_NonVisualGraphicFrameProperties_Attributes
  }
};

export interface CT_GraphicalObjectFrame {
  nvGraphicFramePr?: CT_GraphicalObjectFrameNonVisual;
  xfrm?: CT_Transform2D;
  macro?: string;
  fPublished?: boolean;
}

export const CT_GraphicalObjectFrame_Attributes: Attributes = {
  nvGraphicFramePr: {
    type: 'child',
    childAttributes: CT_GraphicalObjectFrameNonVisual_Attributes
  },
  xfrm: {
    type: 'child',
    childAttributes: CT_Transform2D_Attributes
  },
  macro: {
    type: 'string'
  },
  fPublished: {
    type: 'boolean',
    defaultValue: 'false'
  }
};

export interface CT_GroupShapeNonVisual {
  cNvPr?: CT_NonVisualDrawingProps;
  cNvGrpSpPr?: CT_NonVisualGroupDrawingShapeProps;
}

export const CT_GroupShapeNonVisual_Attributes: Attributes = {
  cNvPr: {
    type: 'child',
    childAttributes: CT_NonVisualDrawingProps_Attributes
  },
  cNvGrpSpPr: {
    type: 'child',
    childAttributes: CT_NonVisualGroupDrawingShapeProps_Attributes
  }
};

export type CT_GroupShape = any;
export const CT_GroupShape_Attributes: Attributes = {};

export interface CT_Rel {
  'r:id'?: string;
}

export const CT_Rel_Attributes: Attributes = {
  'r:id': {
    type: 'string'
  }
};

export type ST_ColID = number;

export type ST_RowID = number;

export interface CT_Marker {
  col?: number[];
  colOff?: string[];
  row?: number[];
  rowOff?: string[];
}

export const CT_Marker_Attributes: Attributes = {
  col: {
    type: 'child-int',
    childIsArray: true
  },
  colOff: {
    type: 'child-string',
    childIsArray: true
  },
  row: {
    type: 'child-int',
    childIsArray: true
  },
  rowOff: {
    type: 'child-string',
    childIsArray: true
  }
};

export type ST_EditAs = 'twoCell' | 'oneCell' | 'absolute';

export interface CT_TwoCellAnchor {
  from?: CT_Marker[];
  to?: CT_Marker[];
  sp?: CT_Shape[];
  grpSp?: CT_GroupShape[];
  graphicFrame?: CT_GraphicalObjectFrame[];
  cxnSp?: CT_Connector[];
  pic?: CT_Picture[];
  contentPart?: CT_Rel[];
  clientData?: CT_AnchorClientData;
  editAs?: ST_EditAs;
}

export const CT_TwoCellAnchor_Attributes: Attributes = {
  from: {
    type: 'child',
    childAttributes: CT_Marker_Attributes,
    childIsArray: true
  },
  to: {
    type: 'child',
    childAttributes: CT_Marker_Attributes,
    childIsArray: true
  },
  sp: {
    type: 'child',
    childAttributes: CT_Shape_Attributes,
    childIsArray: true
  },
  grpSp: {
    type: 'child',
    childAttributes: CT_GroupShape_Attributes,
    childIsArray: true
  },
  graphicFrame: {
    type: 'child',
    childAttributes: CT_GraphicalObjectFrame_Attributes,
    childIsArray: true
  },
  cxnSp: {
    type: 'child',
    childAttributes: CT_Connector_Attributes,
    childIsArray: true
  },
  pic: {
    type: 'child',
    childAttributes: CT_Picture_Attributes,
    childIsArray: true
  },
  contentPart: {
    type: 'child',
    childAttributes: CT_Rel_Attributes,
    childIsArray: true
  },
  clientData: {
    type: 'child',
    childAttributes: CT_AnchorClientData_Attributes
  },
  editAs: {
    type: 'string',
    defaultValue: 'twoCell'
  }
};

export interface CT_OneCellAnchor {
  from?: CT_Marker[];
  ext?: CT_PositiveSize2D[];
  sp?: CT_Shape[];
  grpSp?: CT_GroupShape[];
  graphicFrame?: CT_GraphicalObjectFrame[];
  cxnSp?: CT_Connector[];
  pic?: CT_Picture[];
  contentPart?: CT_Rel[];
  clientData?: CT_AnchorClientData;
}

export const CT_OneCellAnchor_Attributes: Attributes = {
  from: {
    type: 'child',
    childAttributes: CT_Marker_Attributes,
    childIsArray: true
  },
  ext: {
    type: 'child',
    childAttributes: CT_PositiveSize2D_Attributes,
    childIsArray: true
  },
  sp: {
    type: 'child',
    childAttributes: CT_Shape_Attributes,
    childIsArray: true
  },
  grpSp: {
    type: 'child',
    childAttributes: CT_GroupShape_Attributes,
    childIsArray: true
  },
  graphicFrame: {
    type: 'child',
    childAttributes: CT_GraphicalObjectFrame_Attributes,
    childIsArray: true
  },
  cxnSp: {
    type: 'child',
    childAttributes: CT_Connector_Attributes,
    childIsArray: true
  },
  pic: {
    type: 'child',
    childAttributes: CT_Picture_Attributes,
    childIsArray: true
  },
  contentPart: {
    type: 'child',
    childAttributes: CT_Rel_Attributes,
    childIsArray: true
  },
  clientData: {
    type: 'child',
    childAttributes: CT_AnchorClientData_Attributes
  }
};

export interface CT_AbsoluteAnchor {
  pos?: CT_Point2D[];
  ext?: CT_PositiveSize2D[];
  sp?: CT_Shape[];
  grpSp?: CT_GroupShape[];
  graphicFrame?: CT_GraphicalObjectFrame[];
  cxnSp?: CT_Connector[];
  pic?: CT_Picture[];
  contentPart?: CT_Rel[];
  clientData?: CT_AnchorClientData;
}

export const CT_AbsoluteAnchor_Attributes: Attributes = {
  pos: {
    type: 'child',
    childAttributes: CT_Point2D_Attributes,
    childIsArray: true
  },
  ext: {
    type: 'child',
    childAttributes: CT_PositiveSize2D_Attributes,
    childIsArray: true
  },
  sp: {
    type: 'child',
    childAttributes: CT_Shape_Attributes,
    childIsArray: true
  },
  grpSp: {
    type: 'child',
    childAttributes: CT_GroupShape_Attributes,
    childIsArray: true
  },
  graphicFrame: {
    type: 'child',
    childAttributes: CT_GraphicalObjectFrame_Attributes,
    childIsArray: true
  },
  cxnSp: {
    type: 'child',
    childAttributes: CT_Connector_Attributes,
    childIsArray: true
  },
  pic: {
    type: 'child',
    childAttributes: CT_Picture_Attributes,
    childIsArray: true
  },
  contentPart: {
    type: 'child',
    childAttributes: CT_Rel_Attributes,
    childIsArray: true
  },
  clientData: {
    type: 'child',
    childAttributes: CT_AnchorClientData_Attributes
  }
};

export interface CT_Filter {
  val?: string;
}

export const CT_Filter_Attributes: Attributes = {
  val: {
    type: 'string'
  }
};

export type ST_DateTimeGrouping =
  | 'year'
  | 'month'
  | 'day'
  | 'hour'
  | 'minute'
  | 'second';

export interface CT_DateGroupItem {
  year?: number;
  month?: number;
  day?: number;
  hour?: number;
  minute?: number;
  second?: number;
  dateTimeGrouping?: ST_DateTimeGrouping;
}

export const CT_DateGroupItem_Attributes: Attributes = {
  year: {
    type: 'int'
  },
  month: {
    type: 'int'
  },
  day: {
    type: 'int'
  },
  hour: {
    type: 'int'
  },
  minute: {
    type: 'int'
  },
  second: {
    type: 'int'
  },
  dateTimeGrouping: {
    type: 'string'
  }
};

export interface CT_Filters {
  filter?: CT_Filter[];
  dateGroupItem?: CT_DateGroupItem[];
  blank?: boolean;
  calendarType?: ST_CalendarType;
}

export const CT_Filters_Attributes: Attributes = {
  filter: {
    type: 'child',
    childAttributes: CT_Filter_Attributes,
    childIsArray: true
  },
  dateGroupItem: {
    type: 'child',
    childAttributes: CT_DateGroupItem_Attributes,
    childIsArray: true
  },
  blank: {
    type: 'boolean',
    defaultValue: 'false'
  },
  calendarType: {
    type: 'string',
    defaultValue: 'none'
  }
};

export interface CT_Top10 {
  top?: boolean;
  percent?: boolean;
  val?: number;
  filterVal?: number;
}

export const CT_Top10_Attributes: Attributes = {
  top: {
    type: 'boolean',
    defaultValue: 'true'
  },
  percent: {
    type: 'boolean',
    defaultValue: 'false'
  },
  val: {
    type: 'double'
  },
  filterVal: {
    type: 'double'
  }
};

export type ST_FilterOperator =
  | 'equal'
  | 'lessThan'
  | 'lessThanOrEqual'
  | 'notEqual'
  | 'greaterThanOrEqual'
  | 'greaterThan';

export interface CT_CustomFilter {
  operator?: ST_FilterOperator;
  val?: string;
}

export const CT_CustomFilter_Attributes: Attributes = {
  operator: {
    type: 'string',
    defaultValue: 'equal'
  },
  val: {
    type: 'string'
  }
};

export interface CT_CustomFilters {
  customFilter?: CT_CustomFilter[];
  and?: boolean;
}

export const CT_CustomFilters_Attributes: Attributes = {
  customFilter: {
    type: 'child',
    childAttributes: CT_CustomFilter_Attributes,
    childIsArray: true
  },
  and: {
    type: 'boolean',
    defaultValue: 'false'
  }
};

export type ST_DynamicFilterType =
  | 'null'
  | 'aboveAverage'
  | 'belowAverage'
  | 'tomorrow'
  | 'today'
  | 'yesterday'
  | 'nextWeek'
  | 'thisWeek'
  | 'lastWeek'
  | 'nextMonth'
  | 'thisMonth'
  | 'lastMonth'
  | 'nextQuarter'
  | 'thisQuarter'
  | 'lastQuarter'
  | 'nextYear'
  | 'thisYear'
  | 'lastYear'
  | 'yearToDate'
  | 'Q1'
  | 'Q2'
  | 'Q3'
  | 'Q4'
  | 'M1'
  | 'M2'
  | 'M3'
  | 'M4'
  | 'M5'
  | 'M6'
  | 'M7'
  | 'M8'
  | 'M9'
  | 'M10'
  | 'M11'
  | 'M12';

export interface CT_DynamicFilter {
  type?: ST_DynamicFilterType;
  val?: number;
  valIso?: string;
  maxValIso?: string;
}

export const CT_DynamicFilter_Attributes: Attributes = {
  type: {
    type: 'string'
  },
  val: {
    type: 'double'
  },
  valIso: {
    type: 'string'
  },
  maxValIso: {
    type: 'string'
  }
};

export interface CT_ColorFilter {
  dxfId?: number;
  cellColor?: boolean;
}

export const CT_ColorFilter_Attributes: Attributes = {
  dxfId: {
    type: 'int'
  },
  cellColor: {
    type: 'boolean',
    defaultValue: 'true'
  }
};

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

export interface CT_IconFilter {
  iconSet?: ST_IconSetType;
  iconId?: number;
}

export const CT_IconFilter_Attributes: Attributes = {
  iconSet: {
    type: 'string'
  },
  iconId: {
    type: 'int'
  }
};

export interface CT_FilterColumn {
  filters?: CT_Filters;
  top10?: CT_Top10;
  customFilters?: CT_CustomFilters;
  dynamicFilter?: CT_DynamicFilter;
  colorFilter?: CT_ColorFilter;
  iconFilter?: CT_IconFilter;
  extLst?: CT_ExtensionList;
  colId?: number;
  hiddenButton?: boolean;
  showButton?: boolean;
}

export const CT_FilterColumn_Attributes: Attributes = {
  filters: {
    type: 'child',
    childAttributes: CT_Filters_Attributes
  },
  top10: {
    type: 'child',
    childAttributes: CT_Top10_Attributes
  },
  customFilters: {
    type: 'child',
    childAttributes: CT_CustomFilters_Attributes
  },
  dynamicFilter: {
    type: 'child',
    childAttributes: CT_DynamicFilter_Attributes
  },
  colorFilter: {
    type: 'child',
    childAttributes: CT_ColorFilter_Attributes
  },
  iconFilter: {
    type: 'child',
    childAttributes: CT_IconFilter_Attributes
  },
  extLst: {
    type: 'child',
    childAttributes: CT_ExtensionList_Attributes
  },
  colId: {
    type: 'int'
  },
  hiddenButton: {
    type: 'boolean',
    defaultValue: 'false'
  },
  showButton: {
    type: 'boolean',
    defaultValue: 'true'
  }
};

export type ST_SortBy = 'value' | 'cellColor' | 'fontColor' | 'icon';

export interface CT_SortCondition {
  descending?: boolean;
  sortBy?: ST_SortBy;
  ref?: string;
  customList?: string;
  dxfId?: number;
  iconSet?: ST_IconSetType;
  iconId?: number;
}

export const CT_SortCondition_Attributes: Attributes = {
  descending: {
    type: 'boolean',
    defaultValue: 'false'
  },
  sortBy: {
    type: 'string',
    defaultValue: 'value'
  },
  ref: {
    type: 'string'
  },
  customList: {
    type: 'string'
  },
  dxfId: {
    type: 'int'
  },
  iconSet: {
    type: 'string',
    defaultValue: '3Arrows'
  },
  iconId: {
    type: 'int'
  }
};

export type ST_SortMethod = 'stroke' | 'pinYin' | 'none';

export interface CT_SortState {
  sortCondition?: CT_SortCondition[];
  extLst?: CT_ExtensionList;
  columnSort?: boolean;
  caseSensitive?: boolean;
  sortMethod?: ST_SortMethod;
  ref?: string;
}

export const CT_SortState_Attributes: Attributes = {
  sortCondition: {
    type: 'child',
    childAttributes: CT_SortCondition_Attributes,
    childIsArray: true
  },
  extLst: {
    type: 'child',
    childAttributes: CT_ExtensionList_Attributes
  },
  columnSort: {
    type: 'boolean',
    defaultValue: 'false'
  },
  caseSensitive: {
    type: 'boolean',
    defaultValue: 'false'
  },
  sortMethod: {
    type: 'string',
    defaultValue: 'none'
  },
  ref: {
    type: 'string'
  }
};

export interface CT_AutoFilter {
  filterColumn?: CT_FilterColumn[];
  sortState?: CT_SortState;
  extLst?: CT_ExtensionList;
  ref?: string;
}

export const CT_AutoFilter_Attributes: Attributes = {
  filterColumn: {
    type: 'child',
    childAttributes: CT_FilterColumn_Attributes,
    childIsArray: true
  },
  sortState: {
    type: 'child',
    childAttributes: CT_SortState_Attributes
  },
  extLst: {
    type: 'child',
    childAttributes: CT_ExtensionList_Attributes
  },
  ref: {
    type: 'string'
  }
};

export type ST_CellRef = string;

export type ST_RefA = string;

export type ST_Sqref = ST_Ref[];

export type ST_Formula = string;

export type ST_UnsignedIntHex = string;

export interface CT_ObjectAnchor {
  moveWithCells?: boolean;
  sizeWithCells?: boolean;
}

export const CT_ObjectAnchor_Attributes: Attributes = {
  moveWithCells: {
    type: 'boolean',
    defaultValue: 'false'
  },
  sizeWithCells: {
    type: 'boolean',
    defaultValue: 'false'
  }
};

export interface CT_CalcCell {
  r?: string;
  i?: number;
  s?: boolean;
  l?: boolean;
  t?: boolean;
  a?: boolean;
}

export const CT_CalcCell_Attributes: Attributes = {
  r: {
    type: 'string'
  },
  i: {
    type: 'int',
    defaultValue: '0'
  },
  s: {
    type: 'boolean',
    defaultValue: 'false'
  },
  l: {
    type: 'boolean',
    defaultValue: 'false'
  },
  t: {
    type: 'boolean',
    defaultValue: 'false'
  },
  a: {
    type: 'boolean',
    defaultValue: 'false'
  }
};

export interface CT_CalcChain {
  c?: CT_CalcCell[];
  extLst?: CT_ExtensionList[];
}

export const CT_CalcChain_Attributes: Attributes = {
  c: {
    type: 'child',
    childAttributes: CT_CalcCell_Attributes,
    childIsArray: true
  },
  extLst: {
    type: 'child',
    childAttributes: CT_ExtensionList_Attributes,
    childIsArray: true
  }
};

export interface CT_Authors {
  author?: string[];
}

export const CT_Authors_Attributes: Attributes = {
  author: {
    type: 'child-string',
    childIsArray: true
  }
};

export interface CT_FontName {
  val?: string;
}

export const CT_FontName_Attributes: Attributes = {
  val: {
    type: 'string'
  }
};

export interface CT_IntProperty {
  val?: number;
}

export const CT_IntProperty_Attributes: Attributes = {
  val: {
    type: 'int'
  }
};

export interface CT_BooleanProperty {
  val?: boolean;
}

export const CT_BooleanProperty_Attributes: Attributes = {
  val: {
    type: 'boolean',
    defaultValue: 'true'
  }
};

export interface CT_FontSize {
  val?: number;
}

export const CT_FontSize_Attributes: Attributes = {
  val: {
    type: 'double'
  }
};

export type ST_UnderlineValues =
  | 'single'
  | 'double'
  | 'singleAccounting'
  | 'doubleAccounting'
  | 'none';

export interface CT_UnderlineProperty {
  val?: ST_UnderlineValues;
}

export const CT_UnderlineProperty_Attributes: Attributes = {
  val: {
    type: 'string',
    defaultValue: 'single'
  }
};

export interface CT_VerticalAlignFontProperty {
  val?: ST_VerticalAlignRun;
}

export const CT_VerticalAlignFontProperty_Attributes: Attributes = {
  val: {
    type: 'string'
  }
};

export interface CT_RPrElt {
  rFont?: CT_FontName;
  charset?: CT_IntProperty;
  family?: CT_IntProperty;
  b?: CT_BooleanProperty;
  i?: CT_BooleanProperty;
  strike?: CT_BooleanProperty;
  outline?: CT_BooleanProperty;
  shadow?: CT_BooleanProperty;
  condense?: CT_BooleanProperty;
  extend?: CT_BooleanProperty;
  color?: CT_Color;
  sz?: CT_FontSize;
  u?: CT_UnderlineProperty;
  vertAlign?: CT_VerticalAlignFontProperty;
  scheme?: CT_FontScheme;
}

export const CT_RPrElt_Attributes: Attributes = {
  rFont: {
    type: 'child',
    childAttributes: CT_FontName_Attributes
  },
  charset: {
    type: 'child',
    childAttributes: CT_IntProperty_Attributes
  },
  family: {
    type: 'child',
    childAttributes: CT_IntProperty_Attributes
  },
  b: {
    type: 'child',
    childAttributes: CT_BooleanProperty_Attributes
  },
  i: {
    type: 'child',
    childAttributes: CT_BooleanProperty_Attributes
  },
  strike: {
    type: 'child',
    childAttributes: CT_BooleanProperty_Attributes
  },
  outline: {
    type: 'child',
    childAttributes: CT_BooleanProperty_Attributes
  },
  shadow: {
    type: 'child',
    childAttributes: CT_BooleanProperty_Attributes
  },
  condense: {
    type: 'child',
    childAttributes: CT_BooleanProperty_Attributes
  },
  extend: {
    type: 'child',
    childAttributes: CT_BooleanProperty_Attributes
  },
  color: {
    type: 'child',
    childAttributes: CT_Color_Attributes
  },
  sz: {
    type: 'child',
    childAttributes: CT_FontSize_Attributes
  },
  u: {
    type: 'child',
    childAttributes: CT_UnderlineProperty_Attributes
  },
  vertAlign: {
    type: 'child',
    childAttributes: CT_VerticalAlignFontProperty_Attributes
  },
  scheme: {
    type: 'child',
    childAttributes: CT_FontScheme_Attributes
  }
};

export interface CT_RElt {
  rPr?: CT_RPrElt;
  t?: string;
}

export const CT_RElt_Attributes: Attributes = {
  rPr: {
    type: 'child',
    childAttributes: CT_RPrElt_Attributes
  },
  t: {
    type: 'child-string'
  }
};

export interface CT_PhoneticRun {
  t?: string;
  sb?: number;
  eb?: number;
}

export const CT_PhoneticRun_Attributes: Attributes = {
  t: {
    type: 'child-string'
  },
  sb: {
    type: 'int'
  },
  eb: {
    type: 'int'
  }
};

export type ST_FontId = number;

export type ST_PhoneticType =
  | 'halfwidthKatakana'
  | 'fullwidthKatakana'
  | 'Hiragana'
  | 'noConversion';

export type ST_PhoneticAlignment =
  | 'noControl'
  | 'left'
  | 'center'
  | 'distributed';

export interface CT_PhoneticPr {
  fontId?: number;
  type?: ST_PhoneticType;
  alignment?: ST_PhoneticAlignment;
}

export const CT_PhoneticPr_Attributes: Attributes = {
  fontId: {
    type: 'int'
  },
  type: {
    type: 'string',
    defaultValue: 'fullwidthKatakana'
  },
  alignment: {
    type: 'string',
    defaultValue: 'left'
  }
};

export interface CT_Rst {
  t?: string;
  r?: CT_RElt[];
  rPh?: CT_PhoneticRun[];
  phoneticPr?: CT_PhoneticPr;
}

export const CT_Rst_Attributes: Attributes = {
  t: {
    type: 'child-string'
  },
  r: {
    type: 'child',
    childAttributes: CT_RElt_Attributes,
    childIsArray: true
  },
  rPh: {
    type: 'child',
    childAttributes: CT_PhoneticRun_Attributes,
    childIsArray: true
  },
  phoneticPr: {
    type: 'child',
    childAttributes: CT_PhoneticPr_Attributes
  }
};

export type ST_TextHAlign =
  | 'left'
  | 'center'
  | 'right'
  | 'justify'
  | 'distributed';

export type ST_TextVAlign =
  | 'top'
  | 'center'
  | 'bottom'
  | 'justify'
  | 'distributed';

export interface CT_CommentPr {
  anchor?: CT_ObjectAnchor;
  locked?: boolean;
  defaultSize?: boolean;
  print?: boolean;
  disabled?: boolean;
  autoFill?: boolean;
  autoLine?: boolean;
  altText?: string;
  textHAlign?: ST_TextHAlign;
  textVAlign?: ST_TextVAlign;
  lockText?: boolean;
  justLastX?: boolean;
  autoScale?: boolean;
}

export const CT_CommentPr_Attributes: Attributes = {
  anchor: {
    type: 'child',
    childAttributes: CT_ObjectAnchor_Attributes
  },
  locked: {
    type: 'boolean',
    defaultValue: 'true'
  },
  defaultSize: {
    type: 'boolean',
    defaultValue: 'true'
  },
  print: {
    type: 'boolean',
    defaultValue: 'true'
  },
  disabled: {
    type: 'boolean',
    defaultValue: 'false'
  },
  autoFill: {
    type: 'boolean',
    defaultValue: 'true'
  },
  autoLine: {
    type: 'boolean',
    defaultValue: 'true'
  },
  altText: {
    type: 'string'
  },
  textHAlign: {
    type: 'string',
    defaultValue: 'left'
  },
  textVAlign: {
    type: 'string',
    defaultValue: 'top'
  },
  lockText: {
    type: 'boolean',
    defaultValue: 'true'
  },
  justLastX: {
    type: 'boolean',
    defaultValue: 'false'
  },
  autoScale: {
    type: 'boolean',
    defaultValue: 'false'
  }
};

export interface CT_Comment {
  text?: CT_Rst;
  commentPr?: CT_CommentPr;
  ref?: string;
  authorId?: number;
  guid?: string;
  shapeId?: number;
}

export const CT_Comment_Attributes: Attributes = {
  text: {
    type: 'child',
    childAttributes: CT_Rst_Attributes
  },
  commentPr: {
    type: 'child',
    childAttributes: CT_CommentPr_Attributes
  },
  ref: {
    type: 'string'
  },
  authorId: {
    type: 'int'
  },
  guid: {
    type: 'string'
  },
  shapeId: {
    type: 'int'
  }
};

export interface CT_CommentList {
  comment?: CT_Comment[];
}

export const CT_CommentList_Attributes: Attributes = {
  comment: {
    type: 'child',
    childAttributes: CT_Comment_Attributes,
    childIsArray: true
  }
};

export interface CT_Comments {
  authors?: CT_Authors;
  commentList?: CT_CommentList;
  extLst?: CT_ExtensionList[];
}

export const CT_Comments_Attributes: Attributes = {
  authors: {
    type: 'child',
    childAttributes: CT_Authors_Attributes
  },
  commentList: {
    type: 'child',
    childAttributes: CT_CommentList_Attributes
  },
  extLst: {
    type: 'child',
    childAttributes: CT_ExtensionList_Attributes,
    childIsArray: true
  }
};

export interface CT_Schema {
  __any__?: any;
  ID?: string;
  SchemaRef?: string;
  Namespace?: string;
  SchemaLanguage?: string;
}

export const CT_Schema_Attributes: Attributes = {
  __any__: {
    type: 'any'
  },
  ID: {
    type: 'string'
  },
  SchemaRef: {
    type: 'string'
  },
  Namespace: {
    type: 'string'
  },
  SchemaLanguage: {
    type: 'string'
  }
};

export interface CT_DataBinding {
  __any__?: any;
  DataBindingName?: string;
  FileBinding?: boolean;
  ConnectionID?: number;
  FileBindingName?: string;
  DataBindingLoadMode?: number;
}

export const CT_DataBinding_Attributes: Attributes = {
  __any__: {
    type: 'any'
  },
  DataBindingName: {
    type: 'string'
  },
  FileBinding: {
    type: 'boolean'
  },
  ConnectionID: {
    type: 'int'
  },
  FileBindingName: {
    type: 'string'
  },
  DataBindingLoadMode: {
    type: 'int'
  }
};

export interface CT_Map {
  DataBinding?: CT_DataBinding;
  ID?: number;
  Name?: string;
  RootElement?: string;
  SchemaID?: string;
  ShowImportExportValidationErrors?: boolean;
  AutoFit?: boolean;
  Append?: boolean;
  PreserveSortAFLayout?: boolean;
  PreserveFormat?: boolean;
}

export const CT_Map_Attributes: Attributes = {
  DataBinding: {
    type: 'child',
    childAttributes: CT_DataBinding_Attributes
  },
  ID: {
    type: 'int'
  },
  Name: {
    type: 'string'
  },
  RootElement: {
    type: 'string'
  },
  SchemaID: {
    type: 'string'
  },
  ShowImportExportValidationErrors: {
    type: 'boolean'
  },
  AutoFit: {
    type: 'boolean'
  },
  Append: {
    type: 'boolean'
  },
  PreserveSortAFLayout: {
    type: 'boolean'
  },
  PreserveFormat: {
    type: 'boolean'
  }
};

export interface CT_MapInfo {
  Schema?: CT_Schema[];
  Map?: CT_Map[];
  SelectionNamespaces?: string;
}

export const CT_MapInfo_Attributes: Attributes = {
  Schema: {
    type: 'child',
    childAttributes: CT_Schema_Attributes,
    childIsArray: true
  },
  Map: {
    type: 'child',
    childAttributes: CT_Map_Attributes,
    childIsArray: true
  },
  SelectionNamespaces: {
    type: 'string'
  }
};

export interface CT_Connections {
  connection?: CT_Connection[];
}

export const CT_Connections_Attributes: Attributes = {
  connection: {
    type: 'child',
    childAttributes: CT_Connection_Attributes,
    childIsArray: true
  }
};

export interface CT_WorksheetSource {
  'ref'?: string;
  'name'?: string;
  'sheet'?: string;
  'r:id'?: string;
}

export const CT_WorksheetSource_Attributes: Attributes = {
  'ref': {
    type: 'string'
  },
  'name': {
    type: 'string'
  },
  'sheet': {
    type: 'string'
  },
  'r:id': {
    type: 'string'
  }
};

export interface CT_PageItem {
  name?: string;
}

export const CT_PageItem_Attributes: Attributes = {
  name: {
    type: 'string'
  }
};

export interface CT_PCDSCPage {
  pageItem?: CT_PageItem[];
  count?: number;
}

export const CT_PCDSCPage_Attributes: Attributes = {
  pageItem: {
    type: 'child',
    childAttributes: CT_PageItem_Attributes,
    childIsArray: true
  },
  count: {
    type: 'int'
  }
};

export interface CT_Pages {
  page?: CT_PCDSCPage[];
  count?: number;
}

export const CT_Pages_Attributes: Attributes = {
  page: {
    type: 'child',
    childAttributes: CT_PCDSCPage_Attributes,
    childIsArray: true
  },
  count: {
    type: 'int'
  }
};

export interface CT_RangeSet {
  'i1'?: number;
  'i2'?: number;
  'i3'?: number;
  'i4'?: number;
  'ref'?: string;
  'name'?: string;
  'sheet'?: string;
  'r:id'?: string;
}

export const CT_RangeSet_Attributes: Attributes = {
  'i1': {
    type: 'int'
  },
  'i2': {
    type: 'int'
  },
  'i3': {
    type: 'int'
  },
  'i4': {
    type: 'int'
  },
  'ref': {
    type: 'string'
  },
  'name': {
    type: 'string'
  },
  'sheet': {
    type: 'string'
  },
  'r:id': {
    type: 'string'
  }
};

export interface CT_RangeSets {
  rangeSet?: CT_RangeSet[];
  count?: number;
}

export const CT_RangeSets_Attributes: Attributes = {
  rangeSet: {
    type: 'child',
    childAttributes: CT_RangeSet_Attributes,
    childIsArray: true
  },
  count: {
    type: 'int'
  }
};

export interface CT_Consolidation {
  pages?: CT_Pages;
  rangeSets?: CT_RangeSets;
  autoPage?: boolean;
}

export const CT_Consolidation_Attributes: Attributes = {
  pages: {
    type: 'child',
    childAttributes: CT_Pages_Attributes
  },
  rangeSets: {
    type: 'child',
    childAttributes: CT_RangeSets_Attributes
  },
  autoPage: {
    type: 'boolean',
    defaultValue: 'true'
  }
};

export type ST_SourceType =
  | 'worksheet'
  | 'external'
  | 'consolidation'
  | 'scenario';

export interface CT_CacheSource {
  worksheetSource?: CT_WorksheetSource;
  consolidation?: CT_Consolidation;
  extLst?: CT_ExtensionList[];
  type?: ST_SourceType;
  connectionId?: number;
}

export const CT_CacheSource_Attributes: Attributes = {
  worksheetSource: {
    type: 'child',
    childAttributes: CT_WorksheetSource_Attributes
  },
  consolidation: {
    type: 'child',
    childAttributes: CT_Consolidation_Attributes
  },
  extLst: {
    type: 'child',
    childAttributes: CT_ExtensionList_Attributes,
    childIsArray: true
  },
  type: {
    type: 'string'
  },
  connectionId: {
    type: 'int',
    defaultValue: '0'
  }
};

export interface CT_Tuple {
  fld?: number;
  hier?: number;
  item?: number;
}

export const CT_Tuple_Attributes: Attributes = {
  fld: {
    type: 'int'
  },
  hier: {
    type: 'int'
  },
  item: {
    type: 'int'
  }
};

export interface CT_Tuples {
  tpl?: CT_Tuple[];
  c?: number;
}

export const CT_Tuples_Attributes: Attributes = {
  tpl: {
    type: 'child',
    childAttributes: CT_Tuple_Attributes,
    childIsArray: true
  },
  c: {
    type: 'int'
  }
};

export interface CT_Missing {
  tpls?: CT_Tuples[];
  x?: CT_X[];
  u?: boolean;
  f?: boolean;
  c?: string;
  cp?: number;
  in?: number;
  bc?: string;
  fc?: string;
  i?: boolean;
  un?: boolean;
  st?: boolean;
  b?: boolean;
}

export const CT_Missing_Attributes: Attributes = {
  tpls: {
    type: 'child',
    childAttributes: CT_Tuples_Attributes,
    childIsArray: true
  },
  x: {
    type: 'child',
    childAttributes: CT_X_Attributes,
    childIsArray: true
  },
  u: {
    type: 'boolean'
  },
  f: {
    type: 'boolean'
  },
  c: {
    type: 'string'
  },
  cp: {
    type: 'int'
  },
  in: {
    type: 'int'
  },
  bc: {
    type: 'string'
  },
  fc: {
    type: 'string'
  },
  i: {
    type: 'boolean',
    defaultValue: 'false'
  },
  un: {
    type: 'boolean',
    defaultValue: 'false'
  },
  st: {
    type: 'boolean',
    defaultValue: 'false'
  },
  b: {
    type: 'boolean',
    defaultValue: 'false'
  }
};

export interface CT_Number {
  tpls?: CT_Tuples[];
  x?: CT_X[];
  v?: number;
  u?: boolean;
  f?: boolean;
  c?: string;
  cp?: number;
  in?: number;
  bc?: string;
  fc?: string;
  i?: boolean;
  un?: boolean;
  st?: boolean;
  b?: boolean;
}

export const CT_Number_Attributes: Attributes = {
  tpls: {
    type: 'child',
    childAttributes: CT_Tuples_Attributes,
    childIsArray: true
  },
  x: {
    type: 'child',
    childAttributes: CT_X_Attributes,
    childIsArray: true
  },
  v: {
    type: 'double'
  },
  u: {
    type: 'boolean'
  },
  f: {
    type: 'boolean'
  },
  c: {
    type: 'string'
  },
  cp: {
    type: 'int'
  },
  in: {
    type: 'int'
  },
  bc: {
    type: 'string'
  },
  fc: {
    type: 'string'
  },
  i: {
    type: 'boolean',
    defaultValue: 'false'
  },
  un: {
    type: 'boolean',
    defaultValue: 'false'
  },
  st: {
    type: 'boolean',
    defaultValue: 'false'
  },
  b: {
    type: 'boolean',
    defaultValue: 'false'
  }
};

export interface CT_Error {
  tpls?: CT_Tuples[];
  x?: CT_X[];
  v?: string;
  u?: boolean;
  f?: boolean;
  c?: string;
  cp?: number;
  in?: number;
  bc?: string;
  fc?: string;
  i?: boolean;
  un?: boolean;
  st?: boolean;
  b?: boolean;
}

export const CT_Error_Attributes: Attributes = {
  tpls: {
    type: 'child',
    childAttributes: CT_Tuples_Attributes,
    childIsArray: true
  },
  x: {
    type: 'child',
    childAttributes: CT_X_Attributes,
    childIsArray: true
  },
  v: {
    type: 'string'
  },
  u: {
    type: 'boolean'
  },
  f: {
    type: 'boolean'
  },
  c: {
    type: 'string'
  },
  cp: {
    type: 'int'
  },
  in: {
    type: 'int'
  },
  bc: {
    type: 'string'
  },
  fc: {
    type: 'string'
  },
  i: {
    type: 'boolean',
    defaultValue: 'false'
  },
  un: {
    type: 'boolean',
    defaultValue: 'false'
  },
  st: {
    type: 'boolean',
    defaultValue: 'false'
  },
  b: {
    type: 'boolean',
    defaultValue: 'false'
  }
};

export interface CT_String {
  tpls?: CT_Tuples[];
  x?: CT_X[];
  v?: string;
  u?: boolean;
  f?: boolean;
  c?: string;
  cp?: number;
  in?: number;
  bc?: string;
  fc?: string;
  i?: boolean;
  un?: boolean;
  st?: boolean;
  b?: boolean;
}

export const CT_String_Attributes: Attributes = {
  tpls: {
    type: 'child',
    childAttributes: CT_Tuples_Attributes,
    childIsArray: true
  },
  x: {
    type: 'child',
    childAttributes: CT_X_Attributes,
    childIsArray: true
  },
  v: {
    type: 'string'
  },
  u: {
    type: 'boolean'
  },
  f: {
    type: 'boolean'
  },
  c: {
    type: 'string'
  },
  cp: {
    type: 'int'
  },
  in: {
    type: 'int'
  },
  bc: {
    type: 'string'
  },
  fc: {
    type: 'string'
  },
  i: {
    type: 'boolean',
    defaultValue: 'false'
  },
  un: {
    type: 'boolean',
    defaultValue: 'false'
  },
  st: {
    type: 'boolean',
    defaultValue: 'false'
  },
  b: {
    type: 'boolean',
    defaultValue: 'false'
  }
};

export interface CT_DateTime {
  x?: CT_X[];
  v?: string;
  u?: boolean;
  f?: boolean;
  c?: string;
  cp?: number;
}

export const CT_DateTime_Attributes: Attributes = {
  x: {
    type: 'child',
    childAttributes: CT_X_Attributes,
    childIsArray: true
  },
  v: {
    type: 'string'
  },
  u: {
    type: 'boolean'
  },
  f: {
    type: 'boolean'
  },
  c: {
    type: 'string'
  },
  cp: {
    type: 'int'
  }
};

export interface CT_SharedItems {
  m?: CT_Missing;
  n?: CT_Number;
  b?: CT_Boolean;
  e?: CT_Error;
  s?: CT_String;
  d?: CT_DateTime;
  containsSemiMixedTypes?: boolean;
  containsNonDate?: boolean;
  containsDate?: boolean;
  containsString?: boolean;
  containsBlank?: boolean;
  containsMixedTypes?: boolean;
  containsNumber?: boolean;
  containsInteger?: boolean;
  minValue?: number;
  maxValue?: number;
  minDate?: string;
  maxDate?: string;
  count?: number;
  longText?: boolean;
}

export const CT_SharedItems_Attributes: Attributes = {
  m: {
    type: 'child',
    childAttributes: CT_Missing_Attributes
  },
  n: {
    type: 'child',
    childAttributes: CT_Number_Attributes
  },
  b: {
    type: 'child',
    childAttributes: CT_Boolean_Attributes
  },
  e: {
    type: 'child',
    childAttributes: CT_Error_Attributes
  },
  s: {
    type: 'child',
    childAttributes: CT_String_Attributes
  },
  d: {
    type: 'child',
    childAttributes: CT_DateTime_Attributes
  },
  containsSemiMixedTypes: {
    type: 'boolean',
    defaultValue: 'true'
  },
  containsNonDate: {
    type: 'boolean',
    defaultValue: 'true'
  },
  containsDate: {
    type: 'boolean',
    defaultValue: 'false'
  },
  containsString: {
    type: 'boolean',
    defaultValue: 'true'
  },
  containsBlank: {
    type: 'boolean',
    defaultValue: 'false'
  },
  containsMixedTypes: {
    type: 'boolean',
    defaultValue: 'false'
  },
  containsNumber: {
    type: 'boolean',
    defaultValue: 'false'
  },
  containsInteger: {
    type: 'boolean',
    defaultValue: 'false'
  },
  minValue: {
    type: 'double'
  },
  maxValue: {
    type: 'double'
  },
  minDate: {
    type: 'string'
  },
  maxDate: {
    type: 'string'
  },
  count: {
    type: 'int'
  },
  longText: {
    type: 'boolean',
    defaultValue: 'false'
  }
};

export type ST_GroupBy =
  | 'range'
  | 'seconds'
  | 'minutes'
  | 'hours'
  | 'days'
  | 'months'
  | 'quarters'
  | 'years';

export interface CT_RangePr {
  autoStart?: boolean;
  autoEnd?: boolean;
  groupBy?: ST_GroupBy;
  startNum?: number;
  endNum?: number;
  startDate?: string;
  endDate?: string;
  groupInterval?: number;
}

export const CT_RangePr_Attributes: Attributes = {
  autoStart: {
    type: 'boolean',
    defaultValue: 'true'
  },
  autoEnd: {
    type: 'boolean',
    defaultValue: 'true'
  },
  groupBy: {
    type: 'string',
    defaultValue: 'range'
  },
  startNum: {
    type: 'double'
  },
  endNum: {
    type: 'double'
  },
  startDate: {
    type: 'string'
  },
  endDate: {
    type: 'string'
  },
  groupInterval: {
    type: 'double',
    defaultValue: '1'
  }
};

export interface CT_DiscretePr {
  x?: CT_Index[];
  count?: number;
}

export const CT_DiscretePr_Attributes: Attributes = {
  x: {
    type: 'child',
    childAttributes: CT_Index_Attributes,
    childIsArray: true
  },
  count: {
    type: 'int'
  }
};

export interface CT_GroupItems {
  m?: CT_Missing[];
  n?: CT_Number[];
  b?: CT_Boolean[];
  e?: CT_Error[];
  s?: CT_String[];
  d?: CT_DateTime[];
  count?: number;
}

export const CT_GroupItems_Attributes: Attributes = {
  m: {
    type: 'child',
    childAttributes: CT_Missing_Attributes,
    childIsArray: true
  },
  n: {
    type: 'child',
    childAttributes: CT_Number_Attributes,
    childIsArray: true
  },
  b: {
    type: 'child',
    childAttributes: CT_Boolean_Attributes,
    childIsArray: true
  },
  e: {
    type: 'child',
    childAttributes: CT_Error_Attributes,
    childIsArray: true
  },
  s: {
    type: 'child',
    childAttributes: CT_String_Attributes,
    childIsArray: true
  },
  d: {
    type: 'child',
    childAttributes: CT_DateTime_Attributes,
    childIsArray: true
  },
  count: {
    type: 'int'
  }
};

export interface CT_FieldGroup {
  rangePr?: CT_RangePr[];
  discretePr?: CT_DiscretePr[];
  groupItems?: CT_GroupItems[];
  par?: number;
  base?: number;
}

export const CT_FieldGroup_Attributes: Attributes = {
  rangePr: {
    type: 'child',
    childAttributes: CT_RangePr_Attributes,
    childIsArray: true
  },
  discretePr: {
    type: 'child',
    childAttributes: CT_DiscretePr_Attributes,
    childIsArray: true
  },
  groupItems: {
    type: 'child',
    childAttributes: CT_GroupItems_Attributes,
    childIsArray: true
  },
  par: {
    type: 'int'
  },
  base: {
    type: 'int'
  }
};

export type ST_NumFmtId = number;

export interface CT_CacheField {
  sharedItems?: CT_SharedItems;
  fieldGroup?: CT_FieldGroup[];
  mpMap?: CT_X[];
  extLst?: CT_ExtensionList[];
  name?: string;
  caption?: string;
  propertyName?: string;
  serverField?: boolean;
  uniqueList?: boolean;
  numFmtId?: number;
  formula?: string;
  sqlType?: number;
  hierarchy?: number;
  level?: number;
  databaseField?: boolean;
  mappingCount?: number;
  memberPropertyField?: boolean;
}

export const CT_CacheField_Attributes: Attributes = {
  sharedItems: {
    type: 'child',
    childAttributes: CT_SharedItems_Attributes
  },
  fieldGroup: {
    type: 'child',
    childAttributes: CT_FieldGroup_Attributes,
    childIsArray: true
  },
  mpMap: {
    type: 'child',
    childAttributes: CT_X_Attributes,
    childIsArray: true
  },
  extLst: {
    type: 'child',
    childAttributes: CT_ExtensionList_Attributes,
    childIsArray: true
  },
  name: {
    type: 'string'
  },
  caption: {
    type: 'string'
  },
  propertyName: {
    type: 'string'
  },
  serverField: {
    type: 'boolean',
    defaultValue: 'false'
  },
  uniqueList: {
    type: 'boolean',
    defaultValue: 'true'
  },
  numFmtId: {
    type: 'int'
  },
  formula: {
    type: 'string'
  },
  sqlType: {
    type: 'int',
    defaultValue: '0'
  },
  hierarchy: {
    type: 'int',
    defaultValue: '0'
  },
  level: {
    type: 'int',
    defaultValue: '0'
  },
  databaseField: {
    type: 'boolean',
    defaultValue: 'true'
  },
  mappingCount: {
    type: 'int'
  },
  memberPropertyField: {
    type: 'boolean',
    defaultValue: 'false'
  }
};

export interface CT_CacheFields {
  cacheField?: CT_CacheField[];
  count?: number;
}

export const CT_CacheFields_Attributes: Attributes = {
  cacheField: {
    type: 'child',
    childAttributes: CT_CacheField_Attributes,
    childIsArray: true
  },
  count: {
    type: 'int'
  }
};

export interface CT_FieldUsage {
  x?: number;
}

export const CT_FieldUsage_Attributes: Attributes = {
  x: {
    type: 'int'
  }
};

export interface CT_FieldsUsage {
  fieldUsage?: CT_FieldUsage[];
  count?: number;
}

export const CT_FieldsUsage_Attributes: Attributes = {
  fieldUsage: {
    type: 'child',
    childAttributes: CT_FieldUsage_Attributes,
    childIsArray: true
  },
  count: {
    type: 'int'
  }
};

export interface CT_GroupMember {
  uniqueName?: string;
  group?: boolean;
}

export const CT_GroupMember_Attributes: Attributes = {
  uniqueName: {
    type: 'string'
  },
  group: {
    type: 'boolean',
    defaultValue: 'false'
  }
};

export interface CT_GroupMembers {
  groupMember?: CT_GroupMember[];
  count?: number;
}

export const CT_GroupMembers_Attributes: Attributes = {
  groupMember: {
    type: 'child',
    childAttributes: CT_GroupMember_Attributes,
    childIsArray: true
  },
  count: {
    type: 'int'
  }
};

export interface CT_LevelGroup {
  groupMembers?: CT_GroupMembers[];
  name?: string;
  uniqueName?: string;
  caption?: string;
  uniqueParent?: string;
  id?: number;
}

export const CT_LevelGroup_Attributes: Attributes = {
  groupMembers: {
    type: 'child',
    childAttributes: CT_GroupMembers_Attributes,
    childIsArray: true
  },
  name: {
    type: 'string'
  },
  uniqueName: {
    type: 'string'
  },
  caption: {
    type: 'string'
  },
  uniqueParent: {
    type: 'string'
  },
  id: {
    type: 'int'
  }
};

export interface CT_Groups {
  group?: CT_LevelGroup[];
  count?: number;
}

export const CT_Groups_Attributes: Attributes = {
  group: {
    type: 'child',
    childAttributes: CT_LevelGroup_Attributes,
    childIsArray: true
  },
  count: {
    type: 'int'
  }
};

export interface CT_GroupLevel {
  groups?: CT_Groups[];
  extLst?: CT_ExtensionList[];
  uniqueName?: string;
  caption?: string;
  user?: boolean;
  customRollUp?: boolean;
}

export const CT_GroupLevel_Attributes: Attributes = {
  groups: {
    type: 'child',
    childAttributes: CT_Groups_Attributes,
    childIsArray: true
  },
  extLst: {
    type: 'child',
    childAttributes: CT_ExtensionList_Attributes,
    childIsArray: true
  },
  uniqueName: {
    type: 'string'
  },
  caption: {
    type: 'string'
  },
  user: {
    type: 'boolean',
    defaultValue: 'false'
  },
  customRollUp: {
    type: 'boolean',
    defaultValue: 'false'
  }
};

export interface CT_GroupLevels {
  groupLevel?: CT_GroupLevel[];
  count?: number;
}

export const CT_GroupLevels_Attributes: Attributes = {
  groupLevel: {
    type: 'child',
    childAttributes: CT_GroupLevel_Attributes,
    childIsArray: true
  },
  count: {
    type: 'int'
  }
};

export interface CT_CacheHierarchy {
  fieldsUsage?: CT_FieldsUsage[];
  groupLevels?: CT_GroupLevels[];
  extLst?: CT_ExtensionList[];
  uniqueName?: string;
  caption?: string;
  measure?: boolean;
  set?: boolean;
  parentSet?: number;
  iconSet?: number;
  attribute?: boolean;
  time?: boolean;
  keyAttribute?: boolean;
  defaultMemberUniqueName?: string;
  allUniqueName?: string;
  allCaption?: string;
  dimensionUniqueName?: string;
  displayFolder?: string;
  measureGroup?: string;
  measures?: boolean;
  count?: number;
  oneField?: boolean;
  memberValueDatatype?: number;
  unbalanced?: boolean;
  unbalancedGroup?: boolean;
  hidden?: boolean;
}

export const CT_CacheHierarchy_Attributes: Attributes = {
  fieldsUsage: {
    type: 'child',
    childAttributes: CT_FieldsUsage_Attributes,
    childIsArray: true
  },
  groupLevels: {
    type: 'child',
    childAttributes: CT_GroupLevels_Attributes,
    childIsArray: true
  },
  extLst: {
    type: 'child',
    childAttributes: CT_ExtensionList_Attributes,
    childIsArray: true
  },
  uniqueName: {
    type: 'string'
  },
  caption: {
    type: 'string'
  },
  measure: {
    type: 'boolean',
    defaultValue: 'false'
  },
  set: {
    type: 'boolean',
    defaultValue: 'false'
  },
  parentSet: {
    type: 'int'
  },
  iconSet: {
    type: 'int',
    defaultValue: '0'
  },
  attribute: {
    type: 'boolean',
    defaultValue: 'false'
  },
  time: {
    type: 'boolean',
    defaultValue: 'false'
  },
  keyAttribute: {
    type: 'boolean',
    defaultValue: 'false'
  },
  defaultMemberUniqueName: {
    type: 'string'
  },
  allUniqueName: {
    type: 'string'
  },
  allCaption: {
    type: 'string'
  },
  dimensionUniqueName: {
    type: 'string'
  },
  displayFolder: {
    type: 'string'
  },
  measureGroup: {
    type: 'string'
  },
  measures: {
    type: 'boolean',
    defaultValue: 'false'
  },
  count: {
    type: 'int'
  },
  oneField: {
    type: 'boolean',
    defaultValue: 'false'
  },
  memberValueDatatype: {
    type: 'int'
  },
  unbalanced: {
    type: 'boolean'
  },
  unbalancedGroup: {
    type: 'boolean'
  },
  hidden: {
    type: 'boolean',
    defaultValue: 'false'
  }
};

export interface CT_CacheHierarchies {
  cacheHierarchy?: CT_CacheHierarchy[];
  count?: number;
}

export const CT_CacheHierarchies_Attributes: Attributes = {
  cacheHierarchy: {
    type: 'child',
    childAttributes: CT_CacheHierarchy_Attributes,
    childIsArray: true
  },
  count: {
    type: 'int'
  }
};

export interface CT_PCDKPI {
  uniqueName?: string;
  caption?: string;
  displayFolder?: string;
  measureGroup?: string;
  parent?: string;
  value?: string;
  goal?: string;
  status?: string;
  trend?: string;
  weight?: string;
  time?: string;
}

export const CT_PCDKPI_Attributes: Attributes = {
  uniqueName: {
    type: 'string'
  },
  caption: {
    type: 'string'
  },
  displayFolder: {
    type: 'string'
  },
  measureGroup: {
    type: 'string'
  },
  parent: {
    type: 'string'
  },
  value: {
    type: 'string'
  },
  goal: {
    type: 'string'
  },
  status: {
    type: 'string'
  },
  trend: {
    type: 'string'
  },
  weight: {
    type: 'string'
  },
  time: {
    type: 'string'
  }
};

export interface CT_PCDKPIs {
  kpi?: CT_PCDKPI[];
  count?: number;
}

export const CT_PCDKPIs_Attributes: Attributes = {
  kpi: {
    type: 'child',
    childAttributes: CT_PCDKPI_Attributes,
    childIsArray: true
  },
  count: {
    type: 'int'
  }
};

export interface CT_PivotAreaReference {
  x?: CT_Index[];
  extLst?: CT_ExtensionList[];
  field?: number;
  count?: number;
  selected?: boolean;
  byPosition?: boolean;
  relative?: boolean;
  defaultSubtotal?: boolean;
  sumSubtotal?: boolean;
  countASubtotal?: boolean;
  avgSubtotal?: boolean;
  maxSubtotal?: boolean;
  minSubtotal?: boolean;
  productSubtotal?: boolean;
  countSubtotal?: boolean;
  stdDevSubtotal?: boolean;
  stdDevPSubtotal?: boolean;
  varSubtotal?: boolean;
  varPSubtotal?: boolean;
}

export const CT_PivotAreaReference_Attributes: Attributes = {
  x: {
    type: 'child',
    childAttributes: CT_Index_Attributes,
    childIsArray: true
  },
  extLst: {
    type: 'child',
    childAttributes: CT_ExtensionList_Attributes,
    childIsArray: true
  },
  field: {
    type: 'int'
  },
  count: {
    type: 'int'
  },
  selected: {
    type: 'boolean',
    defaultValue: 'true'
  },
  byPosition: {
    type: 'boolean',
    defaultValue: 'false'
  },
  relative: {
    type: 'boolean',
    defaultValue: 'false'
  },
  defaultSubtotal: {
    type: 'boolean',
    defaultValue: 'false'
  },
  sumSubtotal: {
    type: 'boolean',
    defaultValue: 'false'
  },
  countASubtotal: {
    type: 'boolean',
    defaultValue: 'false'
  },
  avgSubtotal: {
    type: 'boolean',
    defaultValue: 'false'
  },
  maxSubtotal: {
    type: 'boolean',
    defaultValue: 'false'
  },
  minSubtotal: {
    type: 'boolean',
    defaultValue: 'false'
  },
  productSubtotal: {
    type: 'boolean',
    defaultValue: 'false'
  },
  countSubtotal: {
    type: 'boolean',
    defaultValue: 'false'
  },
  stdDevSubtotal: {
    type: 'boolean',
    defaultValue: 'false'
  },
  stdDevPSubtotal: {
    type: 'boolean',
    defaultValue: 'false'
  },
  varSubtotal: {
    type: 'boolean',
    defaultValue: 'false'
  },
  varPSubtotal: {
    type: 'boolean',
    defaultValue: 'false'
  }
};

export interface CT_PivotAreaReferences {
  reference?: CT_PivotAreaReference[];
  count?: number;
}

export const CT_PivotAreaReferences_Attributes: Attributes = {
  reference: {
    type: 'child',
    childAttributes: CT_PivotAreaReference_Attributes,
    childIsArray: true
  },
  count: {
    type: 'int'
  }
};

export type ST_PivotAreaType =
  | 'none'
  | 'normal'
  | 'data'
  | 'all'
  | 'origin'
  | 'button'
  | 'topEnd';

export type ST_Axis = 'axisRow' | 'axisCol' | 'axisPage' | 'axisValues';

export interface CT_PivotArea {
  references?: CT_PivotAreaReferences[];
  extLst?: CT_ExtensionList[];
  field?: number;
  type?: ST_PivotAreaType;
  dataOnly?: boolean;
  labelOnly?: boolean;
  grandRow?: boolean;
  grandCol?: boolean;
  cacheIndex?: boolean;
  outline?: boolean;
  offset?: string;
  collapsedLevelsAreSubtotals?: boolean;
  axis?: ST_Axis;
  fieldPosition?: number;
}

export const CT_PivotArea_Attributes: Attributes = {
  references: {
    type: 'child',
    childAttributes: CT_PivotAreaReferences_Attributes,
    childIsArray: true
  },
  extLst: {
    type: 'child',
    childAttributes: CT_ExtensionList_Attributes,
    childIsArray: true
  },
  field: {
    type: 'int'
  },
  type: {
    type: 'string',
    defaultValue: 'normal'
  },
  dataOnly: {
    type: 'boolean',
    defaultValue: 'true'
  },
  labelOnly: {
    type: 'boolean',
    defaultValue: 'false'
  },
  grandRow: {
    type: 'boolean',
    defaultValue: 'false'
  },
  grandCol: {
    type: 'boolean',
    defaultValue: 'false'
  },
  cacheIndex: {
    type: 'boolean',
    defaultValue: 'false'
  },
  outline: {
    type: 'boolean',
    defaultValue: 'true'
  },
  offset: {
    type: 'string'
  },
  collapsedLevelsAreSubtotals: {
    type: 'boolean',
    defaultValue: 'false'
  },
  axis: {
    type: 'string'
  },
  fieldPosition: {
    type: 'int'
  }
};

export interface CT_CalculatedItem {
  pivotArea?: CT_PivotArea[];
  extLst?: CT_ExtensionList[];
  field?: number;
  formula?: string;
}

export const CT_CalculatedItem_Attributes: Attributes = {
  pivotArea: {
    type: 'child',
    childAttributes: CT_PivotArea_Attributes,
    childIsArray: true
  },
  extLst: {
    type: 'child',
    childAttributes: CT_ExtensionList_Attributes,
    childIsArray: true
  },
  field: {
    type: 'int'
  },
  formula: {
    type: 'string'
  }
};

export interface CT_CalculatedItems {
  calculatedItem?: CT_CalculatedItem[];
  count?: number;
}

export const CT_CalculatedItems_Attributes: Attributes = {
  calculatedItem: {
    type: 'child',
    childAttributes: CT_CalculatedItem_Attributes,
    childIsArray: true
  },
  count: {
    type: 'int'
  }
};

export interface CT_CalculatedMember {
  extLst?: CT_ExtensionList[];
  name?: string;
  mdx?: string;
  memberName?: string;
  hierarchy?: string;
  parent?: string;
  solveOrder?: number;
  set?: boolean;
}

export const CT_CalculatedMember_Attributes: Attributes = {
  extLst: {
    type: 'child',
    childAttributes: CT_ExtensionList_Attributes,
    childIsArray: true
  },
  name: {
    type: 'string'
  },
  mdx: {
    type: 'string'
  },
  memberName: {
    type: 'string'
  },
  hierarchy: {
    type: 'string'
  },
  parent: {
    type: 'string'
  },
  solveOrder: {
    type: 'int',
    defaultValue: '0'
  },
  set: {
    type: 'boolean',
    defaultValue: 'false'
  }
};

export interface CT_CalculatedMembers {
  calculatedMember?: CT_CalculatedMember[];
  count?: number;
}

export const CT_CalculatedMembers_Attributes: Attributes = {
  calculatedMember: {
    type: 'child',
    childAttributes: CT_CalculatedMember_Attributes,
    childIsArray: true
  },
  count: {
    type: 'int'
  }
};

export interface CT_PivotDimension {
  measure?: boolean;
  name?: string;
  uniqueName?: string;
  caption?: string;
}

export const CT_PivotDimension_Attributes: Attributes = {
  measure: {
    type: 'boolean',
    defaultValue: 'false'
  },
  name: {
    type: 'string'
  },
  uniqueName: {
    type: 'string'
  },
  caption: {
    type: 'string'
  }
};

export interface CT_Dimensions {
  dimension?: CT_PivotDimension[];
  count?: number;
}

export const CT_Dimensions_Attributes: Attributes = {
  dimension: {
    type: 'child',
    childAttributes: CT_PivotDimension_Attributes,
    childIsArray: true
  },
  count: {
    type: 'int'
  }
};

export interface CT_MeasureGroup {
  name?: string;
  caption?: string;
}

export const CT_MeasureGroup_Attributes: Attributes = {
  name: {
    type: 'string'
  },
  caption: {
    type: 'string'
  }
};

export interface CT_MeasureGroups {
  measureGroup?: CT_MeasureGroup[];
  count?: number;
}

export const CT_MeasureGroups_Attributes: Attributes = {
  measureGroup: {
    type: 'child',
    childAttributes: CT_MeasureGroup_Attributes,
    childIsArray: true
  },
  count: {
    type: 'int'
  }
};

export interface CT_MeasureDimensionMap {
  measureGroup?: number;
  dimension?: number;
}

export const CT_MeasureDimensionMap_Attributes: Attributes = {
  measureGroup: {
    type: 'int'
  },
  dimension: {
    type: 'int'
  }
};

export interface CT_MeasureDimensionMaps {
  map?: CT_MeasureDimensionMap[];
  count?: number;
}

export const CT_MeasureDimensionMaps_Attributes: Attributes = {
  map: {
    type: 'child',
    childAttributes: CT_MeasureDimensionMap_Attributes,
    childIsArray: true
  },
  count: {
    type: 'int'
  }
};

export interface CT_PivotCacheDefinition {
  'cacheSource'?: CT_CacheSource;
  'cacheFields'?: CT_CacheFields;
  'cacheHierarchies'?: CT_CacheHierarchies[];
  'kpis'?: CT_PCDKPIs[];
  'tupleCache'?: boolean;
  'calculatedItems'?: CT_CalculatedItems[];
  'calculatedMembers'?: CT_CalculatedMembers[];
  'dimensions'?: CT_Dimensions[];
  'measureGroups'?: CT_MeasureGroups[];
  'maps'?: CT_MeasureDimensionMaps[];
  'extLst'?: CT_ExtensionList[];
  'r:id'?: string;
  'invalid'?: boolean;
  'saveData'?: boolean;
  'refreshOnLoad'?: boolean;
  'optimizeMemory'?: boolean;
  'enableRefresh'?: boolean;
  'refreshedBy'?: string;
  'refreshedDateIso'?: string;
  'backgroundQuery'?: boolean;
  'missingItemsLimit'?: number;
  'createdVersion'?: number;
  'refreshedVersion'?: number;
  'minRefreshableVersion'?: number;
  'recordCount'?: number;
  'upgradeOnRefresh'?: boolean;
  'supportSubquery'?: boolean;
  'supportAdvancedDrill'?: boolean;
}

export const CT_PivotCacheDefinition_Attributes: Attributes = {
  'cacheSource': {
    type: 'child',
    childAttributes: CT_CacheSource_Attributes
  },
  'cacheFields': {
    type: 'child',
    childAttributes: CT_CacheFields_Attributes
  },
  'cacheHierarchies': {
    type: 'child',
    childAttributes: CT_CacheHierarchies_Attributes,
    childIsArray: true
  },
  'kpis': {
    type: 'child',
    childAttributes: CT_PCDKPIs_Attributes,
    childIsArray: true
  },
  'tupleCache': {
    type: 'boolean',
    defaultValue: 'false'
  },
  'calculatedItems': {
    type: 'child',
    childAttributes: CT_CalculatedItems_Attributes,
    childIsArray: true
  },
  'calculatedMembers': {
    type: 'child',
    childAttributes: CT_CalculatedMembers_Attributes,
    childIsArray: true
  },
  'dimensions': {
    type: 'child',
    childAttributes: CT_Dimensions_Attributes,
    childIsArray: true
  },
  'measureGroups': {
    type: 'child',
    childAttributes: CT_MeasureGroups_Attributes,
    childIsArray: true
  },
  'maps': {
    type: 'child',
    childAttributes: CT_MeasureDimensionMaps_Attributes,
    childIsArray: true
  },
  'extLst': {
    type: 'child',
    childAttributes: CT_ExtensionList_Attributes,
    childIsArray: true
  },
  'r:id': {
    type: 'string'
  },
  'invalid': {
    type: 'boolean',
    defaultValue: 'false'
  },
  'saveData': {
    type: 'boolean',
    defaultValue: 'true'
  },
  'refreshOnLoad': {
    type: 'boolean',
    defaultValue: 'false'
  },
  'optimizeMemory': {
    type: 'boolean',
    defaultValue: 'false'
  },
  'enableRefresh': {
    type: 'boolean',
    defaultValue: 'true'
  },
  'refreshedBy': {
    type: 'string'
  },
  'refreshedDateIso': {
    type: 'string'
  },
  'backgroundQuery': {
    type: 'boolean',
    defaultValue: 'false'
  },
  'missingItemsLimit': {
    type: 'int'
  },
  'createdVersion': {
    type: 'int',
    defaultValue: '0'
  },
  'refreshedVersion': {
    type: 'int',
    defaultValue: '0'
  },
  'minRefreshableVersion': {
    type: 'int',
    defaultValue: '0'
  },
  'recordCount': {
    type: 'int'
  },
  'upgradeOnRefresh': {
    type: 'boolean',
    defaultValue: 'false'
  },
  'supportSubquery': {
    type: 'boolean',
    defaultValue: 'false'
  },
  'supportAdvancedDrill': {
    type: 'boolean',
    defaultValue: 'false'
  }
};

export interface CT_Record {
  m?: CT_Missing[];
  n?: CT_Number[];
  b?: CT_Boolean[];
  e?: CT_Error[];
  s?: CT_String[];
  d?: CT_DateTime[];
  x?: CT_Index[];
}

export const CT_Record_Attributes: Attributes = {
  m: {
    type: 'child',
    childAttributes: CT_Missing_Attributes,
    childIsArray: true
  },
  n: {
    type: 'child',
    childAttributes: CT_Number_Attributes,
    childIsArray: true
  },
  b: {
    type: 'child',
    childAttributes: CT_Boolean_Attributes,
    childIsArray: true
  },
  e: {
    type: 'child',
    childAttributes: CT_Error_Attributes,
    childIsArray: true
  },
  s: {
    type: 'child',
    childAttributes: CT_String_Attributes,
    childIsArray: true
  },
  d: {
    type: 'child',
    childAttributes: CT_DateTime_Attributes,
    childIsArray: true
  },
  x: {
    type: 'child',
    childAttributes: CT_Index_Attributes,
    childIsArray: true
  }
};

export interface CT_PivotCacheRecords {
  r?: CT_Record[];
  extLst?: CT_ExtensionList[];
  count?: number;
}

export const CT_PivotCacheRecords_Attributes: Attributes = {
  r: {
    type: 'child',
    childAttributes: CT_Record_Attributes,
    childIsArray: true
  },
  extLst: {
    type: 'child',
    childAttributes: CT_ExtensionList_Attributes,
    childIsArray: true
  },
  count: {
    type: 'int'
  }
};

export interface CT_PCDSDTCEntries {
  m?: CT_Missing[];
  n?: CT_Number[];
  e?: CT_Error[];
  s?: CT_String[];
  count?: number;
}

export const CT_PCDSDTCEntries_Attributes: Attributes = {
  m: {
    type: 'child',
    childAttributes: CT_Missing_Attributes,
    childIsArray: true
  },
  n: {
    type: 'child',
    childAttributes: CT_Number_Attributes,
    childIsArray: true
  },
  e: {
    type: 'child',
    childAttributes: CT_Error_Attributes,
    childIsArray: true
  },
  s: {
    type: 'child',
    childAttributes: CT_String_Attributes,
    childIsArray: true
  },
  count: {
    type: 'int'
  }
};

export type ST_SortType =
  | 'none'
  | 'ascending'
  | 'descending'
  | 'ascendingAlpha'
  | 'descendingAlpha'
  | 'ascendingNatural'
  | 'descendingNatural';

export interface CT_Set {
  tpls?: CT_Tuples[];
  sortByTuple?: CT_Tuples[];
  count?: number;
  maxRank?: number;
  setDefinition?: string;
  sortType?: ST_SortType;
  queryFailed?: boolean;
}

export const CT_Set_Attributes: Attributes = {
  tpls: {
    type: 'child',
    childAttributes: CT_Tuples_Attributes,
    childIsArray: true
  },
  sortByTuple: {
    type: 'child',
    childAttributes: CT_Tuples_Attributes,
    childIsArray: true
  },
  count: {
    type: 'int'
  },
  maxRank: {
    type: 'int'
  },
  setDefinition: {
    type: 'string'
  },
  sortType: {
    type: 'string',
    defaultValue: 'none'
  },
  queryFailed: {
    type: 'boolean',
    defaultValue: 'false'
  }
};

export interface CT_Sets {
  set?: CT_Set[];
  count?: number;
}

export const CT_Sets_Attributes: Attributes = {
  set: {
    type: 'child',
    childAttributes: CT_Set_Attributes,
    childIsArray: true
  },
  count: {
    type: 'int'
  }
};

export interface CT_Query {
  tpls?: CT_Tuples[];
  mdx?: string;
}

export const CT_Query_Attributes: Attributes = {
  tpls: {
    type: 'child',
    childAttributes: CT_Tuples_Attributes,
    childIsArray: true
  },
  mdx: {
    type: 'string'
  }
};

export interface CT_QueryCache {
  query?: CT_Query[];
  count?: number;
}

export const CT_QueryCache_Attributes: Attributes = {
  query: {
    type: 'child',
    childAttributes: CT_Query_Attributes,
    childIsArray: true
  },
  count: {
    type: 'int'
  }
};

export interface CT_ServerFormat {
  culture?: string;
  format?: string;
}

export const CT_ServerFormat_Attributes: Attributes = {
  culture: {
    type: 'string'
  },
  format: {
    type: 'string'
  }
};

export interface CT_ServerFormats {
  serverFormat?: CT_ServerFormat[];
  count?: number;
}

export const CT_ServerFormats_Attributes: Attributes = {
  serverFormat: {
    type: 'child',
    childAttributes: CT_ServerFormat_Attributes,
    childIsArray: true
  },
  count: {
    type: 'int'
  }
};

export interface CT_TupleCache {
  entries?: CT_PCDSDTCEntries[];
  sets?: CT_Sets[];
  queryCache?: CT_QueryCache[];
  serverFormats?: CT_ServerFormats;
  extLst?: CT_ExtensionList[];
}

export const CT_TupleCache_Attributes: Attributes = {
  entries: {
    type: 'child',
    childAttributes: CT_PCDSDTCEntries_Attributes,
    childIsArray: true
  },
  sets: {
    type: 'child',
    childAttributes: CT_Sets_Attributes,
    childIsArray: true
  },
  queryCache: {
    type: 'child',
    childAttributes: CT_QueryCache_Attributes,
    childIsArray: true
  },
  serverFormats: {
    type: 'child',
    childAttributes: CT_ServerFormats_Attributes
  },
  extLst: {
    type: 'child',
    childAttributes: CT_ExtensionList_Attributes,
    childIsArray: true
  }
};

export interface CT_Location {
  ref?: string;
  firstHeaderRow?: number;
  firstDataRow?: number;
  firstDataCol?: number;
  rowPageCount?: number;
  colPageCount?: number;
}

export const CT_Location_Attributes: Attributes = {
  ref: {
    type: 'string'
  },
  firstHeaderRow: {
    type: 'int'
  },
  firstDataRow: {
    type: 'int'
  },
  firstDataCol: {
    type: 'int'
  },
  rowPageCount: {
    type: 'int',
    defaultValue: '0'
  },
  colPageCount: {
    type: 'int',
    defaultValue: '0'
  }
};

export type ST_ItemType =
  | 'data'
  | 'default'
  | 'sum'
  | 'countA'
  | 'avg'
  | 'max'
  | 'min'
  | 'product'
  | 'count'
  | 'stdDev'
  | 'stdDevP'
  | 'var'
  | 'varP'
  | 'grand'
  | 'blank';

export interface CT_Item {
  n?: string;
  t?: ST_ItemType;
  h?: boolean;
  s?: boolean;
  sd?: boolean;
  f?: boolean;
  m?: boolean;
  c?: boolean;
  x?: number;
  d?: boolean;
  e?: boolean;
}

export const CT_Item_Attributes: Attributes = {
  n: {
    type: 'string'
  },
  t: {
    type: 'string',
    defaultValue: 'data'
  },
  h: {
    type: 'boolean',
    defaultValue: 'false'
  },
  s: {
    type: 'boolean',
    defaultValue: 'false'
  },
  sd: {
    type: 'boolean',
    defaultValue: 'true'
  },
  f: {
    type: 'boolean',
    defaultValue: 'false'
  },
  m: {
    type: 'boolean',
    defaultValue: 'false'
  },
  c: {
    type: 'boolean',
    defaultValue: 'false'
  },
  x: {
    type: 'int'
  },
  d: {
    type: 'boolean',
    defaultValue: 'false'
  },
  e: {
    type: 'boolean',
    defaultValue: 'true'
  }
};

export interface CT_Items {
  item?: CT_Item[];
  count?: number;
}

export const CT_Items_Attributes: Attributes = {
  item: {
    type: 'child',
    childAttributes: CT_Item_Attributes,
    childIsArray: true
  },
  count: {
    type: 'int'
  }
};

export interface CT_AutoSortScope {
  pivotArea?: CT_PivotArea[];
}

export const CT_AutoSortScope_Attributes: Attributes = {
  pivotArea: {
    type: 'child',
    childAttributes: CT_PivotArea_Attributes,
    childIsArray: true
  }
};

export type ST_FieldSortType = 'manual' | 'ascending' | 'descending';

export interface CT_PivotField {
  items?: CT_Items[];
  autoSortScope?: CT_AutoSortScope[];
  extLst?: CT_ExtensionList[];
  name?: string;
  axis?: ST_Axis;
  dataField?: boolean;
  subtotalCaption?: string;
  showDropDowns?: boolean;
  hiddenLevel?: boolean;
  uniqueMemberProperty?: string;
  compact?: boolean;
  allDrilled?: boolean;
  numFmtId?: number;
  outline?: boolean;
  subtotalTop?: boolean;
  dragToRow?: boolean;
  dragToCol?: boolean;
  multipleItemSelectionAllowed?: boolean;
  dragToPage?: boolean;
  dragToData?: boolean;
  dragOff?: boolean;
  showAll?: boolean;
  insertBlankRow?: boolean;
  serverField?: boolean;
  insertPageBreak?: boolean;
  autoShow?: boolean;
  topAutoShow?: boolean;
  hideNewItems?: boolean;
  measureFilter?: boolean;
  includeNewItemsInFilter?: boolean;
  itemPageCount?: number;
  sortType?: ST_FieldSortType;
  dataSourceSort?: boolean;
  nonAutoSortDefault?: boolean;
  rankBy?: number;
  defaultSubtotal?: boolean;
  sumSubtotal?: boolean;
  countASubtotal?: boolean;
  avgSubtotal?: boolean;
  maxSubtotal?: boolean;
  minSubtotal?: boolean;
  productSubtotal?: boolean;
  countSubtotal?: boolean;
  stdDevSubtotal?: boolean;
  stdDevPSubtotal?: boolean;
  varSubtotal?: boolean;
  varPSubtotal?: boolean;
  showPropCell?: boolean;
  showPropTip?: boolean;
  showPropAsCaption?: boolean;
  defaultAttributeDrillState?: boolean;
}

export const CT_PivotField_Attributes: Attributes = {
  items: {
    type: 'child',
    childAttributes: CT_Items_Attributes,
    childIsArray: true
  },
  autoSortScope: {
    type: 'child',
    childAttributes: CT_AutoSortScope_Attributes,
    childIsArray: true
  },
  extLst: {
    type: 'child',
    childAttributes: CT_ExtensionList_Attributes,
    childIsArray: true
  },
  name: {
    type: 'string'
  },
  axis: {
    type: 'string'
  },
  dataField: {
    type: 'boolean',
    defaultValue: 'false'
  },
  subtotalCaption: {
    type: 'string'
  },
  showDropDowns: {
    type: 'boolean',
    defaultValue: 'true'
  },
  hiddenLevel: {
    type: 'boolean',
    defaultValue: 'false'
  },
  uniqueMemberProperty: {
    type: 'string'
  },
  compact: {
    type: 'boolean',
    defaultValue: 'true'
  },
  allDrilled: {
    type: 'boolean',
    defaultValue: 'false'
  },
  numFmtId: {
    type: 'int'
  },
  outline: {
    type: 'boolean',
    defaultValue: 'true'
  },
  subtotalTop: {
    type: 'boolean',
    defaultValue: 'true'
  },
  dragToRow: {
    type: 'boolean',
    defaultValue: 'true'
  },
  dragToCol: {
    type: 'boolean',
    defaultValue: 'true'
  },
  multipleItemSelectionAllowed: {
    type: 'boolean',
    defaultValue: 'false'
  },
  dragToPage: {
    type: 'boolean',
    defaultValue: 'true'
  },
  dragToData: {
    type: 'boolean',
    defaultValue: 'true'
  },
  dragOff: {
    type: 'boolean',
    defaultValue: 'true'
  },
  showAll: {
    type: 'boolean',
    defaultValue: 'true'
  },
  insertBlankRow: {
    type: 'boolean',
    defaultValue: 'false'
  },
  serverField: {
    type: 'boolean',
    defaultValue: 'false'
  },
  insertPageBreak: {
    type: 'boolean',
    defaultValue: 'false'
  },
  autoShow: {
    type: 'boolean',
    defaultValue: 'false'
  },
  topAutoShow: {
    type: 'boolean',
    defaultValue: 'true'
  },
  hideNewItems: {
    type: 'boolean',
    defaultValue: 'false'
  },
  measureFilter: {
    type: 'boolean',
    defaultValue: 'false'
  },
  includeNewItemsInFilter: {
    type: 'boolean',
    defaultValue: 'false'
  },
  itemPageCount: {
    type: 'int',
    defaultValue: '10'
  },
  sortType: {
    type: 'string',
    defaultValue: 'manual'
  },
  dataSourceSort: {
    type: 'boolean'
  },
  nonAutoSortDefault: {
    type: 'boolean',
    defaultValue: 'false'
  },
  rankBy: {
    type: 'int'
  },
  defaultSubtotal: {
    type: 'boolean',
    defaultValue: 'true'
  },
  sumSubtotal: {
    type: 'boolean',
    defaultValue: 'false'
  },
  countASubtotal: {
    type: 'boolean',
    defaultValue: 'false'
  },
  avgSubtotal: {
    type: 'boolean',
    defaultValue: 'false'
  },
  maxSubtotal: {
    type: 'boolean',
    defaultValue: 'false'
  },
  minSubtotal: {
    type: 'boolean',
    defaultValue: 'false'
  },
  productSubtotal: {
    type: 'boolean',
    defaultValue: 'false'
  },
  countSubtotal: {
    type: 'boolean',
    defaultValue: 'false'
  },
  stdDevSubtotal: {
    type: 'boolean',
    defaultValue: 'false'
  },
  stdDevPSubtotal: {
    type: 'boolean',
    defaultValue: 'false'
  },
  varSubtotal: {
    type: 'boolean',
    defaultValue: 'false'
  },
  varPSubtotal: {
    type: 'boolean',
    defaultValue: 'false'
  },
  showPropCell: {
    type: 'boolean',
    defaultValue: 'false'
  },
  showPropTip: {
    type: 'boolean',
    defaultValue: 'false'
  },
  showPropAsCaption: {
    type: 'boolean',
    defaultValue: 'false'
  },
  defaultAttributeDrillState: {
    type: 'boolean',
    defaultValue: 'false'
  }
};

export interface CT_PivotFields {
  pivotField?: CT_PivotField[];
  count?: number;
}

export const CT_PivotFields_Attributes: Attributes = {
  pivotField: {
    type: 'child',
    childAttributes: CT_PivotField_Attributes,
    childIsArray: true
  },
  count: {
    type: 'int'
  }
};

export interface CT_Field {
  x?: number;
}

export const CT_Field_Attributes: Attributes = {
  x: {
    type: 'int'
  }
};

export interface CT_RowFields {
  field?: CT_Field[];
  count?: number;
}

export const CT_RowFields_Attributes: Attributes = {
  field: {
    type: 'child',
    childAttributes: CT_Field_Attributes,
    childIsArray: true
  },
  count: {
    type: 'int',
    defaultValue: '0'
  }
};

export interface CT_I {
  x?: CT_X[];
  t?: ST_ItemType;
  r?: number;
  i?: number;
}

export const CT_I_Attributes: Attributes = {
  x: {
    type: 'child',
    childAttributes: CT_X_Attributes,
    childIsArray: true
  },
  t: {
    type: 'string',
    defaultValue: 'data'
  },
  r: {
    type: 'int',
    defaultValue: '0'
  },
  i: {
    type: 'int',
    defaultValue: '0'
  }
};

export interface CT_rowItems {
  i?: CT_I[];
  count?: number;
}

export const CT_rowItems_Attributes: Attributes = {
  i: {
    type: 'child',
    childAttributes: CT_I_Attributes,
    childIsArray: true
  },
  count: {
    type: 'int'
  }
};

export interface CT_ColFields {
  field?: CT_Field[];
  count?: number;
}

export const CT_ColFields_Attributes: Attributes = {
  field: {
    type: 'child',
    childAttributes: CT_Field_Attributes,
    childIsArray: true
  },
  count: {
    type: 'int',
    defaultValue: '0'
  }
};

export interface CT_colItems {
  i?: CT_I[];
  count?: number;
}

export const CT_colItems_Attributes: Attributes = {
  i: {
    type: 'child',
    childAttributes: CT_I_Attributes,
    childIsArray: true
  },
  count: {
    type: 'int'
  }
};

export interface CT_PageField {
  extLst?: CT_ExtensionList[];
  fld?: number;
  item?: number;
  hier?: number;
  name?: string;
  cap?: string;
}

export const CT_PageField_Attributes: Attributes = {
  extLst: {
    type: 'child',
    childAttributes: CT_ExtensionList_Attributes,
    childIsArray: true
  },
  fld: {
    type: 'int'
  },
  item: {
    type: 'int'
  },
  hier: {
    type: 'int'
  },
  name: {
    type: 'string'
  },
  cap: {
    type: 'string'
  }
};

export interface CT_PageFields {
  pageField?: CT_PageField[];
  count?: number;
}

export const CT_PageFields_Attributes: Attributes = {
  pageField: {
    type: 'child',
    childAttributes: CT_PageField_Attributes,
    childIsArray: true
  },
  count: {
    type: 'int'
  }
};

export type ST_DataConsolidateFunction =
  | 'average'
  | 'count'
  | 'countNums'
  | 'max'
  | 'min'
  | 'product'
  | 'stdDev'
  | 'stdDevp'
  | 'sum'
  | 'var'
  | 'varp';

export type ST_ShowDataAs =
  | 'normal'
  | 'difference'
  | 'percent'
  | 'percentDiff'
  | 'runTotal'
  | 'percentOfRow'
  | 'percentOfCol'
  | 'percentOfTotal'
  | 'index';

export interface CT_DataField {
  extLst?: CT_ExtensionList[];
  name?: string;
  fld?: number;
  subtotal?: ST_DataConsolidateFunction;
  showDataAs?: ST_ShowDataAs;
  baseField?: number;
  baseItem?: number;
  numFmtId?: number;
}

export const CT_DataField_Attributes: Attributes = {
  extLst: {
    type: 'child',
    childAttributes: CT_ExtensionList_Attributes,
    childIsArray: true
  },
  name: {
    type: 'string'
  },
  fld: {
    type: 'int'
  },
  subtotal: {
    type: 'string',
    defaultValue: 'sum'
  },
  showDataAs: {
    type: 'string',
    defaultValue: 'normal'
  },
  baseField: {
    type: 'int',
    defaultValue: '-1'
  },
  baseItem: {
    type: 'int',
    defaultValue: '1048832'
  },
  numFmtId: {
    type: 'int'
  }
};

export interface CT_DataFields {
  dataField?: CT_DataField[];
  count?: number;
}

export const CT_DataFields_Attributes: Attributes = {
  dataField: {
    type: 'child',
    childAttributes: CT_DataField_Attributes,
    childIsArray: true
  },
  count: {
    type: 'int'
  }
};

export type ST_FormatAction = 'blank' | 'formatting' | 'drill' | 'formula';

export interface CT_Format {
  pivotArea?: CT_PivotArea[];
  extLst?: CT_ExtensionList[];
  action?: ST_FormatAction;
  dxfId?: number;
}

export const CT_Format_Attributes: Attributes = {
  pivotArea: {
    type: 'child',
    childAttributes: CT_PivotArea_Attributes,
    childIsArray: true
  },
  extLst: {
    type: 'child',
    childAttributes: CT_ExtensionList_Attributes,
    childIsArray: true
  },
  action: {
    type: 'string',
    defaultValue: 'formatting'
  },
  dxfId: {
    type: 'int'
  }
};

export interface CT_Formats {
  format?: CT_Format[];
  count?: number;
}

export const CT_Formats_Attributes: Attributes = {
  format: {
    type: 'child',
    childAttributes: CT_Format_Attributes,
    childIsArray: true
  },
  count: {
    type: 'int',
    defaultValue: '0'
  }
};

export interface CT_PivotAreas {
  pivotArea?: CT_PivotArea[];
  count?: number;
}

export const CT_PivotAreas_Attributes: Attributes = {
  pivotArea: {
    type: 'child',
    childAttributes: CT_PivotArea_Attributes,
    childIsArray: true
  },
  count: {
    type: 'int'
  }
};

export type ST_Scope = 'selection' | 'data' | 'field';

export type ST_Type = 'none' | 'all' | 'row' | 'column';

export interface CT_ConditionalFormat {
  pivotAreas?: CT_PivotAreas[];
  extLst?: CT_ExtensionList[];
  scope?: ST_Scope;
  type?: ST_Type;
  priority?: number;
}

export const CT_ConditionalFormat_Attributes: Attributes = {
  pivotAreas: {
    type: 'child',
    childAttributes: CT_PivotAreas_Attributes,
    childIsArray: true
  },
  extLst: {
    type: 'child',
    childAttributes: CT_ExtensionList_Attributes,
    childIsArray: true
  },
  scope: {
    type: 'string',
    defaultValue: 'selection'
  },
  type: {
    type: 'string',
    defaultValue: 'none'
  },
  priority: {
    type: 'int'
  }
};

export interface CT_ConditionalFormats {
  conditionalFormat?: CT_ConditionalFormat[];
  count?: number;
}

export const CT_ConditionalFormats_Attributes: Attributes = {
  conditionalFormat: {
    type: 'child',
    childAttributes: CT_ConditionalFormat_Attributes,
    childIsArray: true
  },
  count: {
    type: 'int',
    defaultValue: '0'
  }
};

export interface CT_ChartFormat {
  pivotArea?: CT_PivotArea[];
  chart?: number;
  format?: number;
  series?: boolean;
}

export const CT_ChartFormat_Attributes: Attributes = {
  pivotArea: {
    type: 'child',
    childAttributes: CT_PivotArea_Attributes,
    childIsArray: true
  },
  chart: {
    type: 'int'
  },
  format: {
    type: 'int'
  },
  series: {
    type: 'boolean',
    defaultValue: 'false'
  }
};

export interface CT_ChartFormats {
  chartFormat?: CT_ChartFormat[];
  count?: number;
}

export const CT_ChartFormats_Attributes: Attributes = {
  chartFormat: {
    type: 'child',
    childAttributes: CT_ChartFormat_Attributes,
    childIsArray: true
  },
  count: {
    type: 'int',
    defaultValue: '0'
  }
};

export interface CT_MemberProperty {
  name?: string;
  showCell?: boolean;
  showTip?: boolean;
  showAsCaption?: boolean;
  nameLen?: number;
  pPos?: number;
  pLen?: number;
  level?: number;
  field?: number;
}

export const CT_MemberProperty_Attributes: Attributes = {
  name: {
    type: 'string'
  },
  showCell: {
    type: 'boolean',
    defaultValue: 'false'
  },
  showTip: {
    type: 'boolean',
    defaultValue: 'false'
  },
  showAsCaption: {
    type: 'boolean',
    defaultValue: 'false'
  },
  nameLen: {
    type: 'int'
  },
  pPos: {
    type: 'int'
  },
  pLen: {
    type: 'int'
  },
  level: {
    type: 'int'
  },
  field: {
    type: 'int'
  }
};

export interface CT_MemberProperties {
  mp?: CT_MemberProperty[];
  count?: number;
}

export const CT_MemberProperties_Attributes: Attributes = {
  mp: {
    type: 'child',
    childAttributes: CT_MemberProperty_Attributes,
    childIsArray: true
  },
  count: {
    type: 'int'
  }
};

export interface CT_Member {
  name?: string;
}

export const CT_Member_Attributes: Attributes = {
  name: {
    type: 'string'
  }
};

export interface CT_Members {
  member?: CT_Member[];
  count?: number;
  level?: number;
}

export const CT_Members_Attributes: Attributes = {
  member: {
    type: 'child',
    childAttributes: CT_Member_Attributes,
    childIsArray: true
  },
  count: {
    type: 'int'
  },
  level: {
    type: 'int'
  }
};

export interface CT_PivotHierarchy {
  mps?: CT_MemberProperties[];
  members?: CT_Members[];
  extLst?: CT_ExtensionList[];
  outline?: boolean;
  multipleItemSelectionAllowed?: boolean;
  subtotalTop?: boolean;
  showInFieldList?: boolean;
  dragToRow?: boolean;
  dragToCol?: boolean;
  dragToPage?: boolean;
  dragToData?: boolean;
  dragOff?: boolean;
  includeNewItemsInFilter?: boolean;
  caption?: string;
}

export const CT_PivotHierarchy_Attributes: Attributes = {
  mps: {
    type: 'child',
    childAttributes: CT_MemberProperties_Attributes,
    childIsArray: true
  },
  members: {
    type: 'child',
    childAttributes: CT_Members_Attributes,
    childIsArray: true
  },
  extLst: {
    type: 'child',
    childAttributes: CT_ExtensionList_Attributes,
    childIsArray: true
  },
  outline: {
    type: 'boolean',
    defaultValue: 'false'
  },
  multipleItemSelectionAllowed: {
    type: 'boolean',
    defaultValue: 'false'
  },
  subtotalTop: {
    type: 'boolean',
    defaultValue: 'false'
  },
  showInFieldList: {
    type: 'boolean',
    defaultValue: 'true'
  },
  dragToRow: {
    type: 'boolean',
    defaultValue: 'true'
  },
  dragToCol: {
    type: 'boolean',
    defaultValue: 'true'
  },
  dragToPage: {
    type: 'boolean',
    defaultValue: 'true'
  },
  dragToData: {
    type: 'boolean',
    defaultValue: 'false'
  },
  dragOff: {
    type: 'boolean',
    defaultValue: 'true'
  },
  includeNewItemsInFilter: {
    type: 'boolean',
    defaultValue: 'false'
  },
  caption: {
    type: 'string'
  }
};

export interface CT_PivotHierarchies {
  pivotHierarchy?: CT_PivotHierarchy[];
  count?: number;
}

export const CT_PivotHierarchies_Attributes: Attributes = {
  pivotHierarchy: {
    type: 'child',
    childAttributes: CT_PivotHierarchy_Attributes,
    childIsArray: true
  },
  count: {
    type: 'int'
  }
};

export interface CT_PivotTableStyle {
  name?: string;
  showRowHeaders?: boolean;
  showColHeaders?: boolean;
  showRowStripes?: boolean;
  showColStripes?: boolean;
  showLastColumn?: boolean;
}

export const CT_PivotTableStyle_Attributes: Attributes = {
  name: {
    type: 'string'
  },
  showRowHeaders: {
    type: 'boolean'
  },
  showColHeaders: {
    type: 'boolean'
  },
  showRowStripes: {
    type: 'boolean'
  },
  showColStripes: {
    type: 'boolean'
  },
  showLastColumn: {
    type: 'boolean'
  }
};

export type ST_PivotFilterType =
  | 'unknown'
  | 'count'
  | 'percent'
  | 'sum'
  | 'captionEqual'
  | 'captionNotEqual'
  | 'captionBeginsWith'
  | 'captionNotBeginsWith'
  | 'captionEndsWith'
  | 'captionNotEndsWith'
  | 'captionContains'
  | 'captionNotContains'
  | 'captionGreaterThan'
  | 'captionGreaterThanOrEqual'
  | 'captionLessThan'
  | 'captionLessThanOrEqual'
  | 'captionBetween'
  | 'captionNotBetween'
  | 'valueEqual'
  | 'valueNotEqual'
  | 'valueGreaterThan'
  | 'valueGreaterThanOrEqual'
  | 'valueLessThan'
  | 'valueLessThanOrEqual'
  | 'valueBetween'
  | 'valueNotBetween'
  | 'dateEqual'
  | 'dateNotEqual'
  | 'dateOlderThan'
  | 'dateOlderThanOrEqual'
  | 'dateNewerThan'
  | 'dateNewerThanOrEqual'
  | 'dateBetween'
  | 'dateNotBetween'
  | 'tomorrow'
  | 'today'
  | 'yesterday'
  | 'nextWeek'
  | 'thisWeek'
  | 'lastWeek'
  | 'nextMonth'
  | 'thisMonth'
  | 'lastMonth'
  | 'nextQuarter'
  | 'thisQuarter'
  | 'lastQuarter'
  | 'nextYear'
  | 'thisYear'
  | 'lastYear'
  | 'yearToDate'
  | 'Q1'
  | 'Q2'
  | 'Q3'
  | 'Q4'
  | 'M1'
  | 'M2'
  | 'M3'
  | 'M4'
  | 'M5'
  | 'M6'
  | 'M7'
  | 'M8'
  | 'M9'
  | 'M10'
  | 'M11'
  | 'M12';

export interface CT_PivotFilter {
  autoFilter?: CT_AutoFilter;
  extLst?: CT_ExtensionList[];
  fld?: number;
  mpFld?: number;
  type?: ST_PivotFilterType;
  evalOrder?: number;
  id?: number;
  iMeasureHier?: number;
  iMeasureFld?: number;
  name?: string;
  description?: string;
  stringValue1?: string;
  stringValue2?: string;
}

export const CT_PivotFilter_Attributes: Attributes = {
  autoFilter: {
    type: 'child',
    childAttributes: CT_AutoFilter_Attributes
  },
  extLst: {
    type: 'child',
    childAttributes: CT_ExtensionList_Attributes,
    childIsArray: true
  },
  fld: {
    type: 'int'
  },
  mpFld: {
    type: 'int'
  },
  type: {
    type: 'string'
  },
  evalOrder: {
    type: 'int',
    defaultValue: '0'
  },
  id: {
    type: 'int'
  },
  iMeasureHier: {
    type: 'int'
  },
  iMeasureFld: {
    type: 'int'
  },
  name: {
    type: 'string'
  },
  description: {
    type: 'string'
  },
  stringValue1: {
    type: 'string'
  },
  stringValue2: {
    type: 'string'
  }
};

export interface CT_PivotFilters {
  filter?: CT_PivotFilter[];
  count?: number;
}

export const CT_PivotFilters_Attributes: Attributes = {
  filter: {
    type: 'child',
    childAttributes: CT_PivotFilter_Attributes,
    childIsArray: true
  },
  count: {
    type: 'int',
    defaultValue: '0'
  }
};

export interface CT_HierarchyUsage {
  hierarchyUsage?: number;
}

export const CT_HierarchyUsage_Attributes: Attributes = {
  hierarchyUsage: {
    type: 'int'
  }
};

export interface CT_RowHierarchiesUsage {
  rowHierarchyUsage?: CT_HierarchyUsage[];
  count?: number;
}

export const CT_RowHierarchiesUsage_Attributes: Attributes = {
  rowHierarchyUsage: {
    type: 'child',
    childAttributes: CT_HierarchyUsage_Attributes,
    childIsArray: true
  },
  count: {
    type: 'int'
  }
};

export interface CT_ColHierarchiesUsage {
  colHierarchyUsage?: CT_HierarchyUsage[];
  count?: number;
}

export const CT_ColHierarchiesUsage_Attributes: Attributes = {
  colHierarchyUsage: {
    type: 'child',
    childAttributes: CT_HierarchyUsage_Attributes,
    childIsArray: true
  },
  count: {
    type: 'int'
  }
};

export interface CT_pivotTableDefinition {
  location?: CT_Location[];
  pivotFields?: CT_PivotFields[];
  rowFields?: CT_RowFields[];
  rowItems?: CT_rowItems[];
  colFields?: CT_ColFields[];
  colItems?: CT_colItems[];
  pageFields?: CT_PageFields[];
  dataFields?: CT_DataFields[];
  formats?: CT_Formats[];
  conditionalFormats?: CT_ConditionalFormats[];
  chartFormats?: CT_ChartFormats[];
  pivotHierarchies?: CT_PivotHierarchies[];
  pivotTableStyleInfo?: CT_PivotTableStyle;
  filters?: CT_PivotFilters;
  rowHierarchiesUsage?: CT_RowHierarchiesUsage;
  colHierarchiesUsage?: CT_ColHierarchiesUsage;
  extLst?: CT_ExtensionList[];
  name?: string;
  cacheId?: number;
  dataOnRows?: boolean;
  dataPosition?: number;
  dataCaption?: string;
  grandTotalCaption?: string;
  errorCaption?: string;
  showError?: boolean;
  missingCaption?: string;
  showMissing?: boolean;
  pageStyle?: string;
  pivotTableStyle?: string;
  vacatedStyle?: string;
  tag?: string;
  updatedVersion?: number;
  minRefreshableVersion?: number;
  asteriskTotals?: boolean;
  showItems?: boolean;
  editData?: boolean;
  disableFieldList?: boolean;
  showCalcMbrs?: boolean;
  visualTotals?: boolean;
  showMultipleLabel?: boolean;
  showDataDropDown?: boolean;
  showDrill?: boolean;
  printDrill?: boolean;
  showMemberPropertyTips?: boolean;
  showDataTips?: boolean;
  enableWizard?: boolean;
  enableDrill?: boolean;
  enableFieldProperties?: boolean;
  preserveFormatting?: boolean;
  useAutoFormatting?: boolean;
  pageWrap?: number;
  pageOverThenDown?: boolean;
  subtotalHiddenItems?: boolean;
  rowGrandTotals?: boolean;
  colGrandTotals?: boolean;
  fieldPrintTitles?: boolean;
  itemPrintTitles?: boolean;
  mergeItem?: boolean;
  showDropZones?: boolean;
  createdVersion?: number;
  indent?: number;
  showEmptyRow?: boolean;
  showEmptyCol?: boolean;
  showHeaders?: boolean;
  compact?: boolean;
  outline?: boolean;
  outlineData?: boolean;
  compactData?: boolean;
  published?: boolean;
  gridDropZones?: boolean;
  immersive?: boolean;
  multipleFieldFilters?: boolean;
  chartFormat?: number;
  rowHeaderCaption?: string;
  colHeaderCaption?: string;
  fieldListSortAscending?: boolean;
  mdxSubqueries?: boolean;
  customListSort?: boolean;
}

export const CT_pivotTableDefinition_Attributes: Attributes = {
  location: {
    type: 'child',
    childAttributes: CT_Location_Attributes,
    childIsArray: true
  },
  pivotFields: {
    type: 'child',
    childAttributes: CT_PivotFields_Attributes,
    childIsArray: true
  },
  rowFields: {
    type: 'child',
    childAttributes: CT_RowFields_Attributes,
    childIsArray: true
  },
  rowItems: {
    type: 'child',
    childAttributes: CT_rowItems_Attributes,
    childIsArray: true
  },
  colFields: {
    type: 'child',
    childAttributes: CT_ColFields_Attributes,
    childIsArray: true
  },
  colItems: {
    type: 'child',
    childAttributes: CT_colItems_Attributes,
    childIsArray: true
  },
  pageFields: {
    type: 'child',
    childAttributes: CT_PageFields_Attributes,
    childIsArray: true
  },
  dataFields: {
    type: 'child',
    childAttributes: CT_DataFields_Attributes,
    childIsArray: true
  },
  formats: {
    type: 'child',
    childAttributes: CT_Formats_Attributes,
    childIsArray: true
  },
  conditionalFormats: {
    type: 'child',
    childAttributes: CT_ConditionalFormats_Attributes,
    childIsArray: true
  },
  chartFormats: {
    type: 'child',
    childAttributes: CT_ChartFormats_Attributes,
    childIsArray: true
  },
  pivotHierarchies: {
    type: 'child',
    childAttributes: CT_PivotHierarchies_Attributes,
    childIsArray: true
  },
  pivotTableStyleInfo: {
    type: 'child',
    childAttributes: CT_PivotTableStyle_Attributes
  },
  filters: {
    type: 'child',
    childAttributes: CT_PivotFilters_Attributes
  },
  rowHierarchiesUsage: {
    type: 'child',
    childAttributes: CT_RowHierarchiesUsage_Attributes
  },
  colHierarchiesUsage: {
    type: 'child',
    childAttributes: CT_ColHierarchiesUsage_Attributes
  },
  extLst: {
    type: 'child',
    childAttributes: CT_ExtensionList_Attributes,
    childIsArray: true
  },
  name: {
    type: 'string'
  },
  cacheId: {
    type: 'int'
  },
  dataOnRows: {
    type: 'boolean',
    defaultValue: 'false'
  },
  dataPosition: {
    type: 'int'
  },
  dataCaption: {
    type: 'string'
  },
  grandTotalCaption: {
    type: 'string'
  },
  errorCaption: {
    type: 'string'
  },
  showError: {
    type: 'boolean',
    defaultValue: 'false'
  },
  missingCaption: {
    type: 'string'
  },
  showMissing: {
    type: 'boolean',
    defaultValue: 'true'
  },
  pageStyle: {
    type: 'string'
  },
  pivotTableStyle: {
    type: 'string'
  },
  vacatedStyle: {
    type: 'string'
  },
  tag: {
    type: 'string'
  },
  updatedVersion: {
    type: 'int',
    defaultValue: '0'
  },
  minRefreshableVersion: {
    type: 'int',
    defaultValue: '0'
  },
  asteriskTotals: {
    type: 'boolean',
    defaultValue: 'false'
  },
  showItems: {
    type: 'boolean',
    defaultValue: 'true'
  },
  editData: {
    type: 'boolean',
    defaultValue: 'false'
  },
  disableFieldList: {
    type: 'boolean',
    defaultValue: 'false'
  },
  showCalcMbrs: {
    type: 'boolean',
    defaultValue: 'true'
  },
  visualTotals: {
    type: 'boolean',
    defaultValue: 'true'
  },
  showMultipleLabel: {
    type: 'boolean',
    defaultValue: 'true'
  },
  showDataDropDown: {
    type: 'boolean',
    defaultValue: 'true'
  },
  showDrill: {
    type: 'boolean',
    defaultValue: 'true'
  },
  printDrill: {
    type: 'boolean',
    defaultValue: 'false'
  },
  showMemberPropertyTips: {
    type: 'boolean',
    defaultValue: 'true'
  },
  showDataTips: {
    type: 'boolean',
    defaultValue: 'true'
  },
  enableWizard: {
    type: 'boolean',
    defaultValue: 'true'
  },
  enableDrill: {
    type: 'boolean',
    defaultValue: 'true'
  },
  enableFieldProperties: {
    type: 'boolean',
    defaultValue: 'true'
  },
  preserveFormatting: {
    type: 'boolean',
    defaultValue: 'true'
  },
  useAutoFormatting: {
    type: 'boolean',
    defaultValue: 'false'
  },
  pageWrap: {
    type: 'int',
    defaultValue: '0'
  },
  pageOverThenDown: {
    type: 'boolean',
    defaultValue: 'false'
  },
  subtotalHiddenItems: {
    type: 'boolean',
    defaultValue: 'false'
  },
  rowGrandTotals: {
    type: 'boolean',
    defaultValue: 'true'
  },
  colGrandTotals: {
    type: 'boolean',
    defaultValue: 'true'
  },
  fieldPrintTitles: {
    type: 'boolean',
    defaultValue: 'false'
  },
  itemPrintTitles: {
    type: 'boolean',
    defaultValue: 'false'
  },
  mergeItem: {
    type: 'boolean',
    defaultValue: 'false'
  },
  showDropZones: {
    type: 'boolean',
    defaultValue: 'true'
  },
  createdVersion: {
    type: 'int',
    defaultValue: '0'
  },
  indent: {
    type: 'int',
    defaultValue: '1'
  },
  showEmptyRow: {
    type: 'boolean',
    defaultValue: 'false'
  },
  showEmptyCol: {
    type: 'boolean',
    defaultValue: 'false'
  },
  showHeaders: {
    type: 'boolean',
    defaultValue: 'true'
  },
  compact: {
    type: 'boolean',
    defaultValue: 'true'
  },
  outline: {
    type: 'boolean',
    defaultValue: 'false'
  },
  outlineData: {
    type: 'boolean',
    defaultValue: 'false'
  },
  compactData: {
    type: 'boolean',
    defaultValue: 'true'
  },
  published: {
    type: 'boolean',
    defaultValue: 'false'
  },
  gridDropZones: {
    type: 'boolean',
    defaultValue: 'false'
  },
  immersive: {
    type: 'boolean',
    defaultValue: 'true'
  },
  multipleFieldFilters: {
    type: 'boolean',
    defaultValue: 'true'
  },
  chartFormat: {
    type: 'int',
    defaultValue: '0'
  },
  rowHeaderCaption: {
    type: 'string'
  },
  colHeaderCaption: {
    type: 'string'
  },
  fieldListSortAscending: {
    type: 'boolean',
    defaultValue: 'false'
  },
  mdxSubqueries: {
    type: 'boolean',
    defaultValue: 'false'
  },
  customListSort: {
    type: 'boolean',
    defaultValue: 'true'
  }
};

export interface CT_QueryTableField {
  extLst?: CT_ExtensionList;
  id?: number;
  name?: string;
  dataBound?: boolean;
  rowNumbers?: boolean;
  fillFormulas?: boolean;
  clipped?: boolean;
  tableColumnId?: number;
}

export const CT_QueryTableField_Attributes: Attributes = {
  extLst: {
    type: 'child',
    childAttributes: CT_ExtensionList_Attributes
  },
  id: {
    type: 'int'
  },
  name: {
    type: 'string'
  },
  dataBound: {
    type: 'boolean',
    defaultValue: 'true'
  },
  rowNumbers: {
    type: 'boolean',
    defaultValue: 'false'
  },
  fillFormulas: {
    type: 'boolean',
    defaultValue: 'false'
  },
  clipped: {
    type: 'boolean',
    defaultValue: 'false'
  },
  tableColumnId: {
    type: 'int',
    defaultValue: '0'
  }
};

export interface CT_QueryTableFields {
  queryTableField?: CT_QueryTableField[];
  count?: number;
}

export const CT_QueryTableFields_Attributes: Attributes = {
  queryTableField: {
    type: 'child',
    childAttributes: CT_QueryTableField_Attributes,
    childIsArray: true
  },
  count: {
    type: 'int',
    defaultValue: '0'
  }
};

export interface CT_DeletedField {
  name?: string;
}

export const CT_DeletedField_Attributes: Attributes = {
  name: {
    type: 'string'
  }
};

export interface CT_QueryTableDeletedFields {
  deletedField?: CT_DeletedField[];
  count?: number;
}

export const CT_QueryTableDeletedFields_Attributes: Attributes = {
  deletedField: {
    type: 'child',
    childAttributes: CT_DeletedField_Attributes,
    childIsArray: true
  },
  count: {
    type: 'int'
  }
};

export interface CT_QueryTableRefresh {
  queryTableFields?: CT_QueryTableFields;
  queryTableDeletedFields?: CT_QueryTableDeletedFields;
  sortState?: CT_SortState;
  extLst?: CT_ExtensionList;
  preserveSortFilterLayout?: boolean;
  fieldIdWrapped?: boolean;
  headersInLastRefresh?: boolean;
  minimumVersion?: number;
  nextId?: number;
  unboundColumnsLeft?: number;
  unboundColumnsRight?: number;
}

export const CT_QueryTableRefresh_Attributes: Attributes = {
  queryTableFields: {
    type: 'child',
    childAttributes: CT_QueryTableFields_Attributes
  },
  queryTableDeletedFields: {
    type: 'child',
    childAttributes: CT_QueryTableDeletedFields_Attributes
  },
  sortState: {
    type: 'child',
    childAttributes: CT_SortState_Attributes
  },
  extLst: {
    type: 'child',
    childAttributes: CT_ExtensionList_Attributes
  },
  preserveSortFilterLayout: {
    type: 'boolean',
    defaultValue: 'true'
  },
  fieldIdWrapped: {
    type: 'boolean',
    defaultValue: 'false'
  },
  headersInLastRefresh: {
    type: 'boolean',
    defaultValue: 'true'
  },
  minimumVersion: {
    type: 'int',
    defaultValue: '0'
  },
  nextId: {
    type: 'int',
    defaultValue: '1'
  },
  unboundColumnsLeft: {
    type: 'int',
    defaultValue: '0'
  },
  unboundColumnsRight: {
    type: 'int',
    defaultValue: '0'
  }
};

export type ST_GrowShrinkType =
  | 'insertDelete'
  | 'insertClear'
  | 'overwriteClear';

export interface CT_QueryTable {
  queryTableRefresh?: CT_QueryTableRefresh;
  extLst?: CT_ExtensionList;
  name?: string;
  headers?: boolean;
  rowNumbers?: boolean;
  disableRefresh?: boolean;
  backgroundRefresh?: boolean;
  firstBackgroundRefresh?: boolean;
  refreshOnLoad?: boolean;
  growShrinkType?: ST_GrowShrinkType;
  fillFormulas?: boolean;
  removeDataOnSave?: boolean;
  disableEdit?: boolean;
  preserveFormatting?: boolean;
  adjustColumnWidth?: boolean;
  intermediate?: boolean;
  connectionId?: number;
}

export const CT_QueryTable_Attributes: Attributes = {
  queryTableRefresh: {
    type: 'child',
    childAttributes: CT_QueryTableRefresh_Attributes
  },
  extLst: {
    type: 'child',
    childAttributes: CT_ExtensionList_Attributes
  },
  name: {
    type: 'string'
  },
  headers: {
    type: 'boolean',
    defaultValue: 'true'
  },
  rowNumbers: {
    type: 'boolean',
    defaultValue: 'false'
  },
  disableRefresh: {
    type: 'boolean',
    defaultValue: 'false'
  },
  backgroundRefresh: {
    type: 'boolean',
    defaultValue: 'true'
  },
  firstBackgroundRefresh: {
    type: 'boolean',
    defaultValue: 'false'
  },
  refreshOnLoad: {
    type: 'boolean',
    defaultValue: 'false'
  },
  growShrinkType: {
    type: 'string',
    defaultValue: 'insertDelete'
  },
  fillFormulas: {
    type: 'boolean',
    defaultValue: 'false'
  },
  removeDataOnSave: {
    type: 'boolean',
    defaultValue: 'false'
  },
  disableEdit: {
    type: 'boolean',
    defaultValue: 'false'
  },
  preserveFormatting: {
    type: 'boolean',
    defaultValue: 'true'
  },
  adjustColumnWidth: {
    type: 'boolean',
    defaultValue: 'true'
  },
  intermediate: {
    type: 'boolean',
    defaultValue: 'false'
  },
  connectionId: {
    type: 'int'
  }
};

export interface CT_Sst {
  si?: CT_Rst[];
  extLst?: CT_ExtensionList[];
  count?: number;
  uniqueCount?: number;
}

export const CT_Sst_Attributes: Attributes = {
  si: {
    type: 'child',
    childAttributes: CT_Rst_Attributes,
    childIsArray: true
  },
  extLst: {
    type: 'child',
    childAttributes: CT_ExtensionList_Attributes,
    childIsArray: true
  },
  count: {
    type: 'int'
  },
  uniqueCount: {
    type: 'int'
  }
};

export interface CT_SheetId {
  val?: number;
}

export const CT_SheetId_Attributes: Attributes = {
  val: {
    type: 'int'
  }
};

export interface CT_SheetIdMap {
  sheetId?: CT_SheetId[];
  count?: number;
}

export const CT_SheetIdMap_Attributes: Attributes = {
  sheetId: {
    type: 'child',
    childAttributes: CT_SheetId_Attributes,
    childIsArray: true
  },
  count: {
    type: 'int'
  }
};

export interface CT_Reviewed {
  rId?: number;
}

export const CT_Reviewed_Attributes: Attributes = {
  rId: {
    type: 'int'
  }
};

export interface CT_ReviewedRevisions {
  reviewed?: CT_Reviewed[];
  count?: number;
}

export const CT_ReviewedRevisions_Attributes: Attributes = {
  reviewed: {
    type: 'child',
    childAttributes: CT_Reviewed_Attributes,
    childIsArray: true
  },
  count: {
    type: 'int'
  }
};

export interface CT_RevisionHeader {
  'sheetIdMap'?: CT_SheetIdMap;
  'reviewedList'?: CT_ReviewedRevisions;
  'extLst'?: CT_ExtensionList[];
  'guid'?: string;
  'dateTime'?: string;
  'maxSheetId'?: number;
  'userName'?: string;
  'r:id'?: string;
  'minRId'?: number;
  'maxRId'?: number;
}

export const CT_RevisionHeader_Attributes: Attributes = {
  'sheetIdMap': {
    type: 'child',
    childAttributes: CT_SheetIdMap_Attributes
  },
  'reviewedList': {
    type: 'child',
    childAttributes: CT_ReviewedRevisions_Attributes
  },
  'extLst': {
    type: 'child',
    childAttributes: CT_ExtensionList_Attributes,
    childIsArray: true
  },
  'guid': {
    type: 'string'
  },
  'dateTime': {
    type: 'string'
  },
  'maxSheetId': {
    type: 'int'
  },
  'userName': {
    type: 'string'
  },
  'r:id': {
    type: 'string'
  },
  'minRId': {
    type: 'int'
  },
  'maxRId': {
    type: 'int'
  }
};

export interface CT_RevisionHeaders {
  header?: CT_RevisionHeader[];
  guid?: string;
  lastGuid?: string;
  shared?: boolean;
  diskRevisions?: boolean;
  history?: boolean;
  trackRevisions?: boolean;
  exclusive?: boolean;
  revisionId?: number;
  version?: number;
  keepChangeHistory?: boolean;
  protected?: boolean;
  preserveHistory?: number;
}

export const CT_RevisionHeaders_Attributes: Attributes = {
  header: {
    type: 'child',
    childAttributes: CT_RevisionHeader_Attributes,
    childIsArray: true
  },
  guid: {
    type: 'string'
  },
  lastGuid: {
    type: 'string'
  },
  shared: {
    type: 'boolean',
    defaultValue: 'true'
  },
  diskRevisions: {
    type: 'boolean',
    defaultValue: 'false'
  },
  history: {
    type: 'boolean',
    defaultValue: 'true'
  },
  trackRevisions: {
    type: 'boolean',
    defaultValue: 'true'
  },
  exclusive: {
    type: 'boolean',
    defaultValue: 'false'
  },
  revisionId: {
    type: 'int',
    defaultValue: '0'
  },
  version: {
    type: 'int',
    defaultValue: '1'
  },
  keepChangeHistory: {
    type: 'boolean',
    defaultValue: 'true'
  },
  protected: {
    type: 'boolean',
    defaultValue: 'false'
  },
  preserveHistory: {
    type: 'int',
    defaultValue: '30'
  }
};

export type ST_FormulaExpression =
  | 'ref'
  | 'refError'
  | 'area'
  | 'areaError'
  | 'computedArea';

export interface CT_UndoInfo {
  index?: number;
  exp?: ST_FormulaExpression;
  ref3D?: boolean;
  array?: boolean;
  v?: boolean;
  nf?: boolean;
  cs?: boolean;
  dr?: string;
  dn?: string;
  r?: string;
  sId?: number;
}

export const CT_UndoInfo_Attributes: Attributes = {
  index: {
    type: 'int'
  },
  exp: {
    type: 'string'
  },
  ref3D: {
    type: 'boolean',
    defaultValue: 'false'
  },
  array: {
    type: 'boolean',
    defaultValue: 'false'
  },
  v: {
    type: 'boolean',
    defaultValue: 'false'
  },
  nf: {
    type: 'boolean',
    defaultValue: 'false'
  },
  cs: {
    type: 'boolean',
    defaultValue: 'false'
  },
  dr: {
    type: 'string'
  },
  dn: {
    type: 'string'
  },
  r: {
    type: 'string'
  },
  sId: {
    type: 'int'
  }
};

export interface CT_CellFormula {}

export const CT_CellFormula_Attributes: Attributes = {};

export type ST_CellType = 'b' | 'd' | 'n' | 'e' | 's' | 'str' | 'inlineStr';

export interface CT_Cell {
  f?: CT_CellFormula;
  v?: string;
  is?: CT_Rst;
  extLst?: CT_ExtensionList[];
  r?: string;
  s?: number;
  t?: ST_CellType;
  cm?: number;
  vm?: number;
  ph?: boolean;
}

export const CT_Cell_Attributes: Attributes = {
  f: {
    type: 'child',
    childAttributes: CT_CellFormula_Attributes
  },
  v: {
    type: 'child-string'
  },
  is: {
    type: 'child',
    childAttributes: CT_Rst_Attributes
  },
  extLst: {
    type: 'child',
    childAttributes: CT_ExtensionList_Attributes,
    childIsArray: true
  },
  r: {
    type: 'string'
  },
  s: {
    type: 'int',
    defaultValue: '0'
  },
  t: {
    type: 'string',
    defaultValue: 'n'
  },
  cm: {
    type: 'int',
    defaultValue: '0'
  },
  vm: {
    type: 'int',
    defaultValue: '0'
  },
  ph: {
    type: 'boolean',
    defaultValue: 'false'
  }
};

export type ST_FontFamily = number;

export interface CT_FontFamily {
  val?: number;
}

export const CT_FontFamily_Attributes: Attributes = {
  val: {
    type: 'int'
  }
};

export interface CT_Font {
  name?: CT_FontName;
  charset?: CT_IntProperty;
  family?: CT_FontFamily;
  b?: CT_BooleanProperty;
  i?: CT_BooleanProperty;
  strike?: CT_BooleanProperty;
  outline?: CT_BooleanProperty;
  shadow?: CT_BooleanProperty;
  condense?: CT_BooleanProperty;
  extend?: CT_BooleanProperty;
  color?: CT_Color;
  sz?: CT_FontSize;
  u?: CT_UnderlineProperty;
  vertAlign?: CT_VerticalAlignFontProperty;
  scheme?: CT_FontScheme;
}

export const CT_Font_Attributes: Attributes = {
  name: {
    type: 'child',
    childAttributes: CT_FontName_Attributes
  },
  charset: {
    type: 'child',
    childAttributes: CT_IntProperty_Attributes
  },
  family: {
    type: 'child',
    childAttributes: CT_FontFamily_Attributes
  },
  b: {
    type: 'child',
    childAttributes: CT_BooleanProperty_Attributes
  },
  i: {
    type: 'child',
    childAttributes: CT_BooleanProperty_Attributes
  },
  strike: {
    type: 'child',
    childAttributes: CT_BooleanProperty_Attributes
  },
  outline: {
    type: 'child',
    childAttributes: CT_BooleanProperty_Attributes
  },
  shadow: {
    type: 'child',
    childAttributes: CT_BooleanProperty_Attributes
  },
  condense: {
    type: 'child',
    childAttributes: CT_BooleanProperty_Attributes
  },
  extend: {
    type: 'child',
    childAttributes: CT_BooleanProperty_Attributes
  },
  color: {
    type: 'child',
    childAttributes: CT_Color_Attributes
  },
  sz: {
    type: 'child',
    childAttributes: CT_FontSize_Attributes
  },
  u: {
    type: 'child',
    childAttributes: CT_UnderlineProperty_Attributes
  },
  vertAlign: {
    type: 'child',
    childAttributes: CT_VerticalAlignFontProperty_Attributes
  },
  scheme: {
    type: 'child',
    childAttributes: CT_FontScheme_Attributes
  }
};

export interface CT_NumFmt {
  numFmtId?: number;
  formatCode?: string;
}

export const CT_NumFmt_Attributes: Attributes = {
  numFmtId: {
    type: 'int'
  },
  formatCode: {
    type: 'string'
  }
};

export type ST_PatternType =
  | 'none'
  | 'solid'
  | 'mediumGray'
  | 'darkGray'
  | 'lightGray'
  | 'darkHorizontal'
  | 'darkVertical'
  | 'darkDown'
  | 'darkUp'
  | 'darkGrid'
  | 'darkTrellis'
  | 'lightHorizontal'
  | 'lightVertical'
  | 'lightDown'
  | 'lightUp'
  | 'lightGrid'
  | 'lightTrellis'
  | 'gray125'
  | 'gray0625';

export interface CT_PatternFill {
  fgColor?: CT_Color;
  bgColor?: CT_Color;
  patternType?: ST_PatternType;
}

export const CT_PatternFill_Attributes: Attributes = {
  fgColor: {
    type: 'child',
    childAttributes: CT_Color_Attributes
  },
  bgColor: {
    type: 'child',
    childAttributes: CT_Color_Attributes
  },
  patternType: {
    type: 'string'
  }
};

export type ST_GradientType = 'linear' | 'path';

export interface CT_GradientFill {
  stop?: CT_GradientStop[];
  type?: ST_GradientType;
  degree?: number;
  left?: number;
  right?: number;
  top?: number;
  bottom?: number;
}

export const CT_GradientFill_Attributes: Attributes = {
  stop: {
    type: 'child',
    childAttributes: CT_GradientStop_Attributes,
    childIsArray: true
  },
  type: {
    type: 'string',
    defaultValue: 'linear'
  },
  degree: {
    type: 'double',
    defaultValue: '0'
  },
  left: {
    type: 'double',
    defaultValue: '0'
  },
  right: {
    type: 'double',
    defaultValue: '0'
  },
  top: {
    type: 'double',
    defaultValue: '0'
  },
  bottom: {
    type: 'double',
    defaultValue: '0'
  }
};

export interface CT_Fill {
  patternFill?: CT_PatternFill;
  gradientFill?: CT_GradientFill;
}

export const CT_Fill_Attributes: Attributes = {
  patternFill: {
    type: 'child',
    childAttributes: CT_PatternFill_Attributes
  },
  gradientFill: {
    type: 'child',
    childAttributes: CT_GradientFill_Attributes
  }
};

export type ST_HorizontalAlignment =
  | 'general'
  | 'left'
  | 'center'
  | 'right'
  | 'fill'
  | 'justify'
  | 'centerContinuous'
  | 'distributed';

export type ST_VerticalAlignment =
  | 'top'
  | 'center'
  | 'bottom'
  | 'justify'
  | 'distributed';

export interface CT_CellAlignment {
  horizontal?: ST_HorizontalAlignment;
  vertical?: ST_VerticalAlignment;
  textRotation?: number;
  wrapText?: boolean;
  indent?: number;
  relativeIndent?: number;
  justifyLastLine?: boolean;
  shrinkToFit?: boolean;
  readingOrder?: number;
}

export const CT_CellAlignment_Attributes: Attributes = {
  horizontal: {
    type: 'string'
  },
  vertical: {
    type: 'string',
    defaultValue: 'bottom'
  },
  textRotation: {
    type: 'int'
  },
  wrapText: {
    type: 'boolean'
  },
  indent: {
    type: 'int'
  },
  relativeIndent: {
    type: 'int'
  },
  justifyLastLine: {
    type: 'boolean'
  },
  shrinkToFit: {
    type: 'boolean'
  },
  readingOrder: {
    type: 'int'
  }
};

export type ST_BorderStyle =
  | 'none'
  | 'thin'
  | 'medium'
  | 'dashed'
  | 'dotted'
  | 'thick'
  | 'double'
  | 'hair'
  | 'mediumDashed'
  | 'dashDot'
  | 'mediumDashDot'
  | 'dashDotDot'
  | 'mediumDashDotDot'
  | 'slantDashDot';

export interface CT_BorderPr {
  color?: CT_Color;
  style?: ST_BorderStyle;
}

export const CT_BorderPr_Attributes: Attributes = {
  color: {
    type: 'child',
    childAttributes: CT_Color_Attributes
  },
  style: {
    type: 'string',
    defaultValue: 'none'
  }
};

export interface CT_Border {
  start?: CT_BorderPr;
  end?: CT_BorderPr;
  left?: CT_BorderPr;
  right?: CT_BorderPr;
  top?: CT_BorderPr;
  bottom?: CT_BorderPr;
  diagonal?: CT_BorderPr;
  vertical?: CT_BorderPr;
  horizontal?: CT_BorderPr;
  diagonalUp?: boolean;
  diagonalDown?: boolean;
  outline?: boolean;
}

export const CT_Border_Attributes: Attributes = {
  start: {
    type: 'child',
    childAttributes: CT_BorderPr_Attributes
  },
  end: {
    type: 'child',
    childAttributes: CT_BorderPr_Attributes
  },
  left: {
    type: 'child',
    childAttributes: CT_BorderPr_Attributes
  },
  right: {
    type: 'child',
    childAttributes: CT_BorderPr_Attributes
  },
  top: {
    type: 'child',
    childAttributes: CT_BorderPr_Attributes
  },
  bottom: {
    type: 'child',
    childAttributes: CT_BorderPr_Attributes
  },
  diagonal: {
    type: 'child',
    childAttributes: CT_BorderPr_Attributes
  },
  vertical: {
    type: 'child',
    childAttributes: CT_BorderPr_Attributes
  },
  horizontal: {
    type: 'child',
    childAttributes: CT_BorderPr_Attributes
  },
  diagonalUp: {
    type: 'boolean'
  },
  diagonalDown: {
    type: 'boolean'
  },
  outline: {
    type: 'boolean',
    defaultValue: 'true'
  }
};

export interface CT_CellProtection {
  locked?: boolean;
  hidden?: boolean;
}

export const CT_CellProtection_Attributes: Attributes = {
  locked: {
    type: 'boolean'
  },
  hidden: {
    type: 'boolean'
  }
};

export interface CT_Dxf {
  font?: CT_Font;
  numFmt?: CT_NumFmt;
  fill?: CT_Fill;
  alignment?: CT_CellAlignment;
  border?: CT_Border;
  protection?: CT_CellProtection;
  extLst?: CT_ExtensionList;
}

export const CT_Dxf_Attributes: Attributes = {
  font: {
    type: 'child',
    childAttributes: CT_Font_Attributes
  },
  numFmt: {
    type: 'child',
    childAttributes: CT_NumFmt_Attributes
  },
  fill: {
    type: 'child',
    childAttributes: CT_Fill_Attributes
  },
  alignment: {
    type: 'child',
    childAttributes: CT_CellAlignment_Attributes
  },
  border: {
    type: 'child',
    childAttributes: CT_Border_Attributes
  },
  protection: {
    type: 'child',
    childAttributes: CT_CellProtection_Attributes
  },
  extLst: {
    type: 'child',
    childAttributes: CT_ExtensionList_Attributes
  }
};

export interface CT_RevisionCellChange {
  oc?: CT_Cell;
  nc?: CT_Cell;
  odxf?: boolean;
  ndxf?: CT_Dxf;
  extLst?: CT_ExtensionList[];
  sId?: number;
  xfDxf?: boolean;
  s?: boolean;
  dxf?: boolean;
  numFmtId?: number;
  quotePrefix?: boolean;
  oldQuotePrefix?: boolean;
  ph?: boolean;
  oldPh?: boolean;
  endOfListFormulaUpdate?: boolean;
}

export const CT_RevisionCellChange_Attributes: Attributes = {
  oc: {
    type: 'child',
    childAttributes: CT_Cell_Attributes
  },
  nc: {
    type: 'child',
    childAttributes: CT_Cell_Attributes
  },
  odxf: {
    type: 'boolean',
    defaultValue: 'false'
  },
  ndxf: {
    type: 'child',
    childAttributes: CT_Dxf_Attributes
  },
  extLst: {
    type: 'child',
    childAttributes: CT_ExtensionList_Attributes,
    childIsArray: true
  },
  sId: {
    type: 'int'
  },
  xfDxf: {
    type: 'boolean',
    defaultValue: 'false'
  },
  s: {
    type: 'boolean',
    defaultValue: 'false'
  },
  dxf: {
    type: 'boolean',
    defaultValue: 'false'
  },
  numFmtId: {
    type: 'int'
  },
  quotePrefix: {
    type: 'boolean',
    defaultValue: 'false'
  },
  oldQuotePrefix: {
    type: 'boolean',
    defaultValue: 'false'
  },
  ph: {
    type: 'boolean',
    defaultValue: 'false'
  },
  oldPh: {
    type: 'boolean',
    defaultValue: 'false'
  },
  endOfListFormulaUpdate: {
    type: 'boolean',
    defaultValue: 'false'
  }
};

export interface CT_RevisionFormatting {
  dxf?: CT_Dxf;
  extLst?: CT_ExtensionList[];
  sheetId?: number;
  xfDxf?: boolean;
  s?: boolean;
  sqref?: string;
  start?: number;
  length?: number;
}

export const CT_RevisionFormatting_Attributes: Attributes = {
  dxf: {
    type: 'child',
    childAttributes: CT_Dxf_Attributes
  },
  extLst: {
    type: 'child',
    childAttributes: CT_ExtensionList_Attributes,
    childIsArray: true
  },
  sheetId: {
    type: 'int'
  },
  xfDxf: {
    type: 'boolean',
    defaultValue: 'false'
  },
  s: {
    type: 'boolean',
    defaultValue: 'false'
  },
  sqref: {
    type: 'string'
  },
  start: {
    type: 'int'
  },
  length: {
    type: 'int'
  }
};

export type ST_rwColActionType =
  | 'insertRow'
  | 'deleteRow'
  | 'insertCol'
  | 'deleteCol';

export interface CT_RevisionRowColumn {
  undo?: CT_UndoInfo[];
  rcc?: CT_RevisionCellChange[];
  rfmt?: CT_RevisionFormatting[];
  sId?: number;
  eol?: boolean;
  ref?: string;
  action?: ST_rwColActionType;
  edge?: boolean;
}

export const CT_RevisionRowColumn_Attributes: Attributes = {
  undo: {
    type: 'child',
    childAttributes: CT_UndoInfo_Attributes,
    childIsArray: true
  },
  rcc: {
    type: 'child',
    childAttributes: CT_RevisionCellChange_Attributes,
    childIsArray: true
  },
  rfmt: {
    type: 'child',
    childAttributes: CT_RevisionFormatting_Attributes,
    childIsArray: true
  },
  sId: {
    type: 'int'
  },
  eol: {
    type: 'boolean',
    defaultValue: 'false'
  },
  ref: {
    type: 'string'
  },
  action: {
    type: 'string'
  },
  edge: {
    type: 'boolean',
    defaultValue: 'false'
  }
};

export interface CT_RevisionMove {
  undo?: CT_UndoInfo[];
  rcc?: CT_RevisionCellChange[];
  rfmt?: CT_RevisionFormatting[];
  sheetId?: number;
  source?: string;
  destination?: string;
  sourceSheetId?: number;
}

export const CT_RevisionMove_Attributes: Attributes = {
  undo: {
    type: 'child',
    childAttributes: CT_UndoInfo_Attributes,
    childIsArray: true
  },
  rcc: {
    type: 'child',
    childAttributes: CT_RevisionCellChange_Attributes,
    childIsArray: true
  },
  rfmt: {
    type: 'child',
    childAttributes: CT_RevisionFormatting_Attributes,
    childIsArray: true
  },
  sheetId: {
    type: 'int'
  },
  source: {
    type: 'string'
  },
  destination: {
    type: 'string'
  },
  sourceSheetId: {
    type: 'int',
    defaultValue: '0'
  }
};

export type ST_RevisionAction = 'add' | 'delete';

export interface CT_RevisionCustomView {
  guid?: string;
  action?: ST_RevisionAction;
}

export const CT_RevisionCustomView_Attributes: Attributes = {
  guid: {
    type: 'string'
  },
  action: {
    type: 'string'
  }
};

export interface CT_RevisionSheetRename {
  extLst?: CT_ExtensionList[];
  sheetId?: number;
  oldName?: string;
  newName?: string;
}

export const CT_RevisionSheetRename_Attributes: Attributes = {
  extLst: {
    type: 'child',
    childAttributes: CT_ExtensionList_Attributes,
    childIsArray: true
  },
  sheetId: {
    type: 'int'
  },
  oldName: {
    type: 'string'
  },
  newName: {
    type: 'string'
  }
};

export interface CT_RevisionInsertSheet {
  sheetId?: number;
  name?: string;
  sheetPosition?: number;
}

export const CT_RevisionInsertSheet_Attributes: Attributes = {
  sheetId: {
    type: 'int'
  },
  name: {
    type: 'string'
  },
  sheetPosition: {
    type: 'int'
  }
};

export interface CT_RevisionAutoFormatting {
  sheetId?: number;
  ref?: string;
}

export const CT_RevisionAutoFormatting_Attributes: Attributes = {
  sheetId: {
    type: 'int'
  },
  ref: {
    type: 'string'
  }
};

export interface CT_RevisionDefinedName {
  formula?: string;
  oldFormula?: string;
  extLst?: CT_ExtensionList[];
  localSheetId?: number;
  customView?: boolean;
  name?: string;
  function?: boolean;
  oldFunction?: boolean;
  functionGroupId?: number;
  oldFunctionGroupId?: number;
  shortcutKey?: number;
  oldShortcutKey?: number;
  hidden?: boolean;
  oldHidden?: boolean;
  customMenu?: string;
  oldCustomMenu?: string;
  description?: string;
  oldDescription?: string;
  help?: string;
  oldHelp?: string;
  statusBar?: string;
  oldStatusBar?: string;
  comment?: string;
  oldComment?: string;
}

export const CT_RevisionDefinedName_Attributes: Attributes = {
  formula: {
    type: 'child-string'
  },
  oldFormula: {
    type: 'child-string'
  },
  extLst: {
    type: 'child',
    childAttributes: CT_ExtensionList_Attributes,
    childIsArray: true
  },
  localSheetId: {
    type: 'int'
  },
  customView: {
    type: 'boolean',
    defaultValue: 'false'
  },
  name: {
    type: 'string'
  },
  function: {
    type: 'boolean',
    defaultValue: 'false'
  },
  oldFunction: {
    type: 'boolean',
    defaultValue: 'false'
  },
  functionGroupId: {
    type: 'int'
  },
  oldFunctionGroupId: {
    type: 'int'
  },
  shortcutKey: {
    type: 'int'
  },
  oldShortcutKey: {
    type: 'int'
  },
  hidden: {
    type: 'boolean',
    defaultValue: 'false'
  },
  oldHidden: {
    type: 'boolean',
    defaultValue: 'false'
  },
  customMenu: {
    type: 'string'
  },
  oldCustomMenu: {
    type: 'string'
  },
  description: {
    type: 'string'
  },
  oldDescription: {
    type: 'string'
  },
  help: {
    type: 'string'
  },
  oldHelp: {
    type: 'string'
  },
  statusBar: {
    type: 'string'
  },
  oldStatusBar: {
    type: 'string'
  },
  comment: {
    type: 'string'
  },
  oldComment: {
    type: 'string'
  }
};

export interface CT_RevisionComment {
  sheetId?: number;
  cell?: string;
  guid?: string;
  action?: ST_RevisionAction;
  alwaysShow?: boolean;
  old?: boolean;
  hiddenRow?: boolean;
  hiddenColumn?: boolean;
  author?: string;
  oldLength?: number;
  newLength?: number;
}

export const CT_RevisionComment_Attributes: Attributes = {
  sheetId: {
    type: 'int'
  },
  cell: {
    type: 'string'
  },
  guid: {
    type: 'string'
  },
  action: {
    type: 'string',
    defaultValue: 'add'
  },
  alwaysShow: {
    type: 'boolean',
    defaultValue: 'false'
  },
  old: {
    type: 'boolean',
    defaultValue: 'false'
  },
  hiddenRow: {
    type: 'boolean',
    defaultValue: 'false'
  },
  hiddenColumn: {
    type: 'boolean',
    defaultValue: 'false'
  },
  author: {
    type: 'string'
  },
  oldLength: {
    type: 'int',
    defaultValue: '0'
  },
  newLength: {
    type: 'int',
    defaultValue: '0'
  }
};

export interface CT_RevisionQueryTableField {
  sheetId?: number;
  ref?: string;
  fieldId?: number;
}

export const CT_RevisionQueryTableField_Attributes: Attributes = {
  sheetId: {
    type: 'int'
  },
  ref: {
    type: 'string'
  },
  fieldId: {
    type: 'int'
  }
};

export interface CT_RevisionConflict {
  sheetId?: number;
}

export const CT_RevisionConflict_Attributes: Attributes = {
  sheetId: {
    type: 'int'
  }
};

export interface CT_Revisions {
  rrc?: CT_RevisionRowColumn[];
  rm?: CT_RevisionMove[];
  rcv?: CT_RevisionCustomView[];
  rsnm?: CT_RevisionSheetRename[];
  ris?: CT_RevisionInsertSheet[];
  rcc?: CT_RevisionCellChange[];
  rfmt?: CT_RevisionFormatting[];
  raf?: CT_RevisionAutoFormatting[];
  rdn?: CT_RevisionDefinedName[];
  rcmt?: CT_RevisionComment[];
  rqt?: CT_RevisionQueryTableField[];
  rcft?: CT_RevisionConflict[];
}

export const CT_Revisions_Attributes: Attributes = {
  rrc: {
    type: 'child',
    childAttributes: CT_RevisionRowColumn_Attributes,
    childIsArray: true
  },
  rm: {
    type: 'child',
    childAttributes: CT_RevisionMove_Attributes,
    childIsArray: true
  },
  rcv: {
    type: 'child',
    childAttributes: CT_RevisionCustomView_Attributes,
    childIsArray: true
  },
  rsnm: {
    type: 'child',
    childAttributes: CT_RevisionSheetRename_Attributes,
    childIsArray: true
  },
  ris: {
    type: 'child',
    childAttributes: CT_RevisionInsertSheet_Attributes,
    childIsArray: true
  },
  rcc: {
    type: 'child',
    childAttributes: CT_RevisionCellChange_Attributes,
    childIsArray: true
  },
  rfmt: {
    type: 'child',
    childAttributes: CT_RevisionFormatting_Attributes,
    childIsArray: true
  },
  raf: {
    type: 'child',
    childAttributes: CT_RevisionAutoFormatting_Attributes,
    childIsArray: true
  },
  rdn: {
    type: 'child',
    childAttributes: CT_RevisionDefinedName_Attributes,
    childIsArray: true
  },
  rcmt: {
    type: 'child',
    childAttributes: CT_RevisionComment_Attributes,
    childIsArray: true
  },
  rqt: {
    type: 'child',
    childAttributes: CT_RevisionQueryTableField_Attributes,
    childIsArray: true
  },
  rcft: {
    type: 'child',
    childAttributes: CT_RevisionConflict_Attributes,
    childIsArray: true
  }
};

export interface CT_SharedUser {
  extLst?: CT_ExtensionList[];
  guid?: string;
  name?: string;
  id?: number;
  dateTime?: string;
}

export const CT_SharedUser_Attributes: Attributes = {
  extLst: {
    type: 'child',
    childAttributes: CT_ExtensionList_Attributes,
    childIsArray: true
  },
  guid: {
    type: 'string'
  },
  name: {
    type: 'string'
  },
  id: {
    type: 'int'
  },
  dateTime: {
    type: 'string'
  }
};

export interface CT_Users {
  userInfo?: CT_SharedUser[];
  count?: number;
}

export const CT_Users_Attributes: Attributes = {
  userInfo: {
    type: 'child',
    childAttributes: CT_SharedUser_Attributes,
    childIsArray: true
  },
  count: {
    type: 'int'
  }
};

export interface CT_OutlinePr {
  applyStyles?: boolean;
  summaryBelow?: boolean;
  summaryRight?: boolean;
  showOutlineSymbols?: boolean;
}

export const CT_OutlinePr_Attributes: Attributes = {
  applyStyles: {
    type: 'boolean',
    defaultValue: 'false'
  },
  summaryBelow: {
    type: 'boolean',
    defaultValue: 'true'
  },
  summaryRight: {
    type: 'boolean',
    defaultValue: 'true'
  },
  showOutlineSymbols: {
    type: 'boolean',
    defaultValue: 'true'
  }
};

export interface CT_PageSetUpPr {
  autoPageBreaks?: boolean;
  fitToPage?: boolean;
}

export const CT_PageSetUpPr_Attributes: Attributes = {
  autoPageBreaks: {
    type: 'boolean',
    defaultValue: 'true'
  },
  fitToPage: {
    type: 'boolean',
    defaultValue: 'false'
  }
};

export interface CT_SheetPr {
  tabColor?: CT_Color;
  outlinePr?: CT_OutlinePr;
  pageSetUpPr?: CT_PageSetUpPr;
  syncHorizontal?: boolean;
  syncVertical?: boolean;
  syncRef?: string;
  transitionEvaluation?: boolean;
  transitionEntry?: boolean;
  published?: boolean;
  codeName?: string;
  filterMode?: boolean;
  enableFormatConditionsCalculation?: boolean;
}

export const CT_SheetPr_Attributes: Attributes = {
  tabColor: {
    type: 'child',
    childAttributes: CT_Color_Attributes
  },
  outlinePr: {
    type: 'child',
    childAttributes: CT_OutlinePr_Attributes
  },
  pageSetUpPr: {
    type: 'child',
    childAttributes: CT_PageSetUpPr_Attributes
  },
  syncHorizontal: {
    type: 'boolean',
    defaultValue: 'false'
  },
  syncVertical: {
    type: 'boolean',
    defaultValue: 'false'
  },
  syncRef: {
    type: 'string'
  },
  transitionEvaluation: {
    type: 'boolean',
    defaultValue: 'false'
  },
  transitionEntry: {
    type: 'boolean',
    defaultValue: 'false'
  },
  published: {
    type: 'boolean',
    defaultValue: 'true'
  },
  codeName: {
    type: 'string'
  },
  filterMode: {
    type: 'boolean',
    defaultValue: 'false'
  },
  enableFormatConditionsCalculation: {
    type: 'boolean',
    defaultValue: 'true'
  }
};

export interface CT_SheetDimension {
  ref?: string;
}

export const CT_SheetDimension_Attributes: Attributes = {
  ref: {
    type: 'string'
  }
};

export type ST_Pane = 'bottomRight' | 'topRight' | 'bottomLeft' | 'topLeft';

export type ST_PaneState = 'split' | 'frozen' | 'frozenSplit';

export interface CT_Pane {
  xSplit?: number;
  ySplit?: number;
  topLeftCell?: string;
  activePane?: ST_Pane;
  state?: ST_PaneState;
}

export const CT_Pane_Attributes: Attributes = {
  xSplit: {
    type: 'double',
    defaultValue: '0'
  },
  ySplit: {
    type: 'double',
    defaultValue: '0'
  },
  topLeftCell: {
    type: 'string'
  },
  activePane: {
    type: 'string',
    defaultValue: 'topLeft'
  },
  state: {
    type: 'string',
    defaultValue: 'split'
  }
};

export interface CT_Selection {
  pane?: ST_Pane;
  activeCell?: string;
  activeCellId?: number;
  sqref?: string;
}

export const CT_Selection_Attributes: Attributes = {
  pane: {
    type: 'string',
    defaultValue: 'topLeft'
  },
  activeCell: {
    type: 'string'
  },
  activeCellId: {
    type: 'int',
    defaultValue: '0'
  },
  sqref: {
    type: 'string',
    defaultValue: 'A1'
  }
};

export interface CT_PivotSelection {
  'pivotArea'?: CT_PivotArea[];
  'pane'?: ST_Pane;
  'showHeader'?: boolean;
  'label'?: boolean;
  'data'?: boolean;
  'extendable'?: boolean;
  'count'?: number;
  'axis'?: ST_Axis;
  'dimension'?: number;
  'start'?: number;
  'min'?: number;
  'max'?: number;
  'activeRow'?: number;
  'activeCol'?: number;
  'previousRow'?: number;
  'previousCol'?: number;
  'click'?: number;
  'r:id'?: string;
}

export const CT_PivotSelection_Attributes: Attributes = {
  'pivotArea': {
    type: 'child',
    childAttributes: CT_PivotArea_Attributes,
    childIsArray: true
  },
  'pane': {
    type: 'string',
    defaultValue: 'topLeft'
  },
  'showHeader': {
    type: 'boolean',
    defaultValue: 'false'
  },
  'label': {
    type: 'boolean',
    defaultValue: 'false'
  },
  'data': {
    type: 'boolean',
    defaultValue: 'false'
  },
  'extendable': {
    type: 'boolean',
    defaultValue: 'false'
  },
  'count': {
    type: 'int',
    defaultValue: '0'
  },
  'axis': {
    type: 'string'
  },
  'dimension': {
    type: 'int',
    defaultValue: '0'
  },
  'start': {
    type: 'int',
    defaultValue: '0'
  },
  'min': {
    type: 'int',
    defaultValue: '0'
  },
  'max': {
    type: 'int',
    defaultValue: '0'
  },
  'activeRow': {
    type: 'int',
    defaultValue: '0'
  },
  'activeCol': {
    type: 'int',
    defaultValue: '0'
  },
  'previousRow': {
    type: 'int',
    defaultValue: '0'
  },
  'previousCol': {
    type: 'int',
    defaultValue: '0'
  },
  'click': {
    type: 'int',
    defaultValue: '0'
  },
  'r:id': {
    type: 'string'
  }
};

export type ST_SheetViewType = 'normal' | 'pageBreakPreview' | 'pageLayout';

export interface CT_SheetView {
  pane?: CT_Pane;
  selection?: CT_Selection[];
  pivotSelection?: CT_PivotSelection[];
  extLst?: CT_ExtensionList;
  windowProtection?: boolean;
  showFormulas?: boolean;
  showGridLines?: boolean;
  showRowColHeaders?: boolean;
  showZeros?: boolean;
  rightToLeft?: boolean;
  tabSelected?: boolean;
  showRuler?: boolean;
  showOutlineSymbols?: boolean;
  defaultGridColor?: boolean;
  showWhiteSpace?: boolean;
  view?: ST_SheetViewType;
  topLeftCell?: string;
  colorId?: number;
  zoomScale?: number;
  zoomScaleNormal?: number;
  zoomScaleSheetLayoutView?: number;
  zoomScalePageLayoutView?: number;
  workbookViewId?: number;
}

export const CT_SheetView_Attributes: Attributes = {
  pane: {
    type: 'child',
    childAttributes: CT_Pane_Attributes
  },
  selection: {
    type: 'child',
    childAttributes: CT_Selection_Attributes,
    childIsArray: true
  },
  pivotSelection: {
    type: 'child',
    childAttributes: CT_PivotSelection_Attributes,
    childIsArray: true
  },
  extLst: {
    type: 'child',
    childAttributes: CT_ExtensionList_Attributes
  },
  windowProtection: {
    type: 'boolean',
    defaultValue: 'false'
  },
  showFormulas: {
    type: 'boolean',
    defaultValue: 'false'
  },
  showGridLines: {
    type: 'boolean',
    defaultValue: 'true'
  },
  showRowColHeaders: {
    type: 'boolean',
    defaultValue: 'true'
  },
  showZeros: {
    type: 'boolean',
    defaultValue: 'true'
  },
  rightToLeft: {
    type: 'boolean',
    defaultValue: 'false'
  },
  tabSelected: {
    type: 'boolean',
    defaultValue: 'false'
  },
  showRuler: {
    type: 'boolean',
    defaultValue: 'true'
  },
  showOutlineSymbols: {
    type: 'boolean',
    defaultValue: 'true'
  },
  defaultGridColor: {
    type: 'boolean',
    defaultValue: 'true'
  },
  showWhiteSpace: {
    type: 'boolean',
    defaultValue: 'true'
  },
  view: {
    type: 'string',
    defaultValue: 'normal'
  },
  topLeftCell: {
    type: 'string'
  },
  colorId: {
    type: 'int',
    defaultValue: '64'
  },
  zoomScale: {
    type: 'int',
    defaultValue: '100'
  },
  zoomScaleNormal: {
    type: 'int',
    defaultValue: '0'
  },
  zoomScaleSheetLayoutView: {
    type: 'int',
    defaultValue: '0'
  },
  zoomScalePageLayoutView: {
    type: 'int',
    defaultValue: '0'
  },
  workbookViewId: {
    type: 'int'
  }
};

export interface CT_SheetViews {
  sheetView?: CT_SheetView[];
  extLst?: CT_ExtensionList;
}

export const CT_SheetViews_Attributes: Attributes = {
  sheetView: {
    type: 'child',
    childAttributes: CT_SheetView_Attributes,
    childIsArray: true
  },
  extLst: {
    type: 'child',
    childAttributes: CT_ExtensionList_Attributes
  }
};

export interface CT_SheetFormatPr {
  baseColWidth?: number;
  defaultColWidth?: number;
  defaultRowHeight?: number;
  customHeight?: boolean;
  zeroHeight?: boolean;
  thickTop?: boolean;
  thickBottom?: boolean;
  outlineLevelRow?: number;
  outlineLevelCol?: number;
}

export const CT_SheetFormatPr_Attributes: Attributes = {
  baseColWidth: {
    type: 'int',
    defaultValue: '8'
  },
  defaultColWidth: {
    type: 'double'
  },
  defaultRowHeight: {
    type: 'double'
  },
  customHeight: {
    type: 'boolean',
    defaultValue: 'false'
  },
  zeroHeight: {
    type: 'boolean',
    defaultValue: 'false'
  },
  thickTop: {
    type: 'boolean',
    defaultValue: 'false'
  },
  thickBottom: {
    type: 'boolean',
    defaultValue: 'false'
  },
  outlineLevelRow: {
    type: 'int',
    defaultValue: '0'
  },
  outlineLevelCol: {
    type: 'int',
    defaultValue: '0'
  }
};

export interface CT_Col {
  min?: number;
  max?: number;
  width?: number;
  style?: number;
  hidden?: boolean;
  bestFit?: boolean;
  customWidth?: boolean;
  phonetic?: boolean;
  outlineLevel?: number;
  collapsed?: boolean;
}

export const CT_Col_Attributes: Attributes = {
  min: {
    type: 'int'
  },
  max: {
    type: 'int'
  },
  width: {
    type: 'double'
  },
  style: {
    type: 'int',
    defaultValue: '0'
  },
  hidden: {
    type: 'boolean',
    defaultValue: 'false'
  },
  bestFit: {
    type: 'boolean',
    defaultValue: 'false'
  },
  customWidth: {
    type: 'boolean',
    defaultValue: 'false'
  },
  phonetic: {
    type: 'boolean',
    defaultValue: 'false'
  },
  outlineLevel: {
    type: 'int',
    defaultValue: '0'
  },
  collapsed: {
    type: 'boolean',
    defaultValue: 'false'
  }
};

export interface CT_Cols {
  col?: CT_Col[];
}

export const CT_Cols_Attributes: Attributes = {
  col: {
    type: 'child',
    childAttributes: CT_Col_Attributes,
    childIsArray: true
  }
};

export type ST_CellSpans = ST_CellSpan[];

export interface CT_Row {
  c?: CT_Cell[];
  extLst?: CT_ExtensionList[];
  r?: number;
  spans?: string[];
  s?: number;
  customFormat?: boolean;
  ht?: number;
  hidden?: boolean;
  customHeight?: boolean;
  outlineLevel?: number;
  collapsed?: boolean;
  thickTop?: boolean;
  thickBot?: boolean;
  ph?: boolean;
}

export const CT_Row_Attributes: Attributes = {
  c: {
    type: 'child',
    childAttributes: CT_Cell_Attributes,
    childIsArray: true
  },
  extLst: {
    type: 'child',
    childAttributes: CT_ExtensionList_Attributes,
    childIsArray: true
  },
  r: {
    type: 'int'
  },
  spans: {
    type: 'string',
    childIsArray: true
  },
  s: {
    type: 'int',
    defaultValue: '0'
  },
  customFormat: {
    type: 'boolean',
    defaultValue: 'false'
  },
  ht: {
    type: 'double'
  },
  hidden: {
    type: 'boolean',
    defaultValue: 'false'
  },
  customHeight: {
    type: 'boolean',
    defaultValue: 'false'
  },
  outlineLevel: {
    type: 'int',
    defaultValue: '0'
  },
  collapsed: {
    type: 'boolean',
    defaultValue: 'false'
  },
  thickTop: {
    type: 'boolean',
    defaultValue: 'false'
  },
  thickBot: {
    type: 'boolean',
    defaultValue: 'false'
  },
  ph: {
    type: 'boolean',
    defaultValue: 'false'
  }
};

export interface CT_SheetData {
  row?: CT_Row[];
}

export const CT_SheetData_Attributes: Attributes = {
  row: {
    type: 'child',
    childAttributes: CT_Row_Attributes,
    childIsArray: true
  }
};

export interface CT_SheetProtection {
  algorithmName?: string;
  hashValue?: string;
  saltValue?: string;
  spinCount?: number;
  sheet?: boolean;
  objects?: boolean;
  scenarios?: boolean;
  formatCells?: boolean;
  formatColumns?: boolean;
  formatRows?: boolean;
  insertColumns?: boolean;
  insertRows?: boolean;
  insertHyperlinks?: boolean;
  deleteColumns?: boolean;
  deleteRows?: boolean;
  selectLockedCells?: boolean;
  sort?: boolean;
  autoFilter?: boolean;
  pivotTables?: boolean;
  selectUnlockedCells?: boolean;
}

export const CT_SheetProtection_Attributes: Attributes = {
  algorithmName: {
    type: 'string'
  },
  hashValue: {
    type: 'string'
  },
  saltValue: {
    type: 'string'
  },
  spinCount: {
    type: 'int'
  },
  sheet: {
    type: 'boolean',
    defaultValue: 'false'
  },
  objects: {
    type: 'boolean',
    defaultValue: 'false'
  },
  scenarios: {
    type: 'boolean',
    defaultValue: 'false'
  },
  formatCells: {
    type: 'boolean',
    defaultValue: 'true'
  },
  formatColumns: {
    type: 'boolean',
    defaultValue: 'true'
  },
  formatRows: {
    type: 'boolean',
    defaultValue: 'true'
  },
  insertColumns: {
    type: 'boolean',
    defaultValue: 'true'
  },
  insertRows: {
    type: 'boolean',
    defaultValue: 'true'
  },
  insertHyperlinks: {
    type: 'boolean',
    defaultValue: 'true'
  },
  deleteColumns: {
    type: 'boolean',
    defaultValue: 'true'
  },
  deleteRows: {
    type: 'boolean',
    defaultValue: 'true'
  },
  selectLockedCells: {
    type: 'boolean',
    defaultValue: 'false'
  },
  sort: {
    type: 'boolean',
    defaultValue: 'true'
  },
  autoFilter: {
    type: 'boolean',
    defaultValue: 'true'
  },
  pivotTables: {
    type: 'boolean',
    defaultValue: 'true'
  },
  selectUnlockedCells: {
    type: 'boolean',
    defaultValue: 'false'
  }
};

export interface CT_DataRef {
  'ref'?: string;
  'name'?: string;
  'sheet'?: string;
  'r:id'?: string;
}

export const CT_DataRef_Attributes: Attributes = {
  'ref': {
    type: 'string'
  },
  'name': {
    type: 'string'
  },
  'sheet': {
    type: 'string'
  },
  'r:id': {
    type: 'string'
  }
};

export interface CT_DataRefs {
  dataRef?: CT_DataRef[];
  count?: number;
}

export const CT_DataRefs_Attributes: Attributes = {
  dataRef: {
    type: 'child',
    childAttributes: CT_DataRef_Attributes,
    childIsArray: true
  },
  count: {
    type: 'int'
  }
};

export interface CT_DataConsolidate {
  dataRefs?: CT_DataRefs;
  function?: ST_DataConsolidateFunction;
  startLabels?: boolean;
  topLabels?: boolean;
  link?: boolean;
}

export const CT_DataConsolidate_Attributes: Attributes = {
  dataRefs: {
    type: 'child',
    childAttributes: CT_DataRefs_Attributes
  },
  function: {
    type: 'string',
    defaultValue: 'sum'
  },
  startLabels: {
    type: 'boolean',
    defaultValue: 'false'
  },
  topLabels: {
    type: 'boolean',
    defaultValue: 'false'
  },
  link: {
    type: 'boolean',
    defaultValue: 'false'
  }
};

export interface CT_Break {
  id?: number;
  min?: number;
  max?: number;
  man?: boolean;
  pt?: boolean;
}

export const CT_Break_Attributes: Attributes = {
  id: {
    type: 'int',
    defaultValue: '0'
  },
  min: {
    type: 'int',
    defaultValue: '0'
  },
  max: {
    type: 'int',
    defaultValue: '0'
  },
  man: {
    type: 'boolean',
    defaultValue: 'false'
  },
  pt: {
    type: 'boolean',
    defaultValue: 'false'
  }
};

export interface CT_PageBreak {
  brk?: CT_Break[];
  count?: number;
  manualBreakCount?: number;
}

export const CT_PageBreak_Attributes: Attributes = {
  brk: {
    type: 'child',
    childAttributes: CT_Break_Attributes,
    childIsArray: true
  },
  count: {
    type: 'int',
    defaultValue: '0'
  },
  manualBreakCount: {
    type: 'int',
    defaultValue: '0'
  }
};

export interface CT_PageMargins {
  left?: number;
  right?: number;
  top?: number;
  bottom?: number;
  header?: number;
  footer?: number;
}

export const CT_PageMargins_Attributes: Attributes = {
  left: {
    type: 'double'
  },
  right: {
    type: 'double'
  },
  top: {
    type: 'double'
  },
  bottom: {
    type: 'double'
  },
  header: {
    type: 'double'
  },
  footer: {
    type: 'double'
  }
};

export interface CT_PrintOptions {
  horizontalCentered?: boolean;
  verticalCentered?: boolean;
  headings?: boolean;
  gridLines?: boolean;
  gridLinesSet?: boolean;
}

export const CT_PrintOptions_Attributes: Attributes = {
  horizontalCentered: {
    type: 'boolean',
    defaultValue: 'false'
  },
  verticalCentered: {
    type: 'boolean',
    defaultValue: 'false'
  },
  headings: {
    type: 'boolean',
    defaultValue: 'false'
  },
  gridLines: {
    type: 'boolean',
    defaultValue: 'false'
  },
  gridLinesSet: {
    type: 'boolean',
    defaultValue: 'true'
  }
};

export type ST_PageOrder = 'downThenOver' | 'overThenDown';

export type ST_Orientation = 'default' | 'portrait' | 'landscape';

export type ST_CellComments = 'none' | 'asDisplayed' | 'atEnd';

export type ST_PrintError = 'displayed' | 'blank' | 'dash' | 'NA';

export interface CT_PageSetup {
  'paperSize'?: number;
  'paperHeight'?: string;
  'paperWidth'?: string;
  'scale'?: number;
  'firstPageNumber'?: number;
  'fitToWidth'?: number;
  'fitToHeight'?: number;
  'pageOrder'?: ST_PageOrder;
  'orientation'?: ST_Orientation;
  'usePrinterDefaults'?: boolean;
  'blackAndWhite'?: boolean;
  'draft'?: boolean;
  'cellComments'?: ST_CellComments;
  'useFirstPageNumber'?: boolean;
  'errors'?: ST_PrintError;
  'horizontalDpi'?: number;
  'verticalDpi'?: number;
  'copies'?: number;
  'r:id'?: string;
}

export const CT_PageSetup_Attributes: Attributes = {
  'paperSize': {
    type: 'int',
    defaultValue: '1'
  },
  'paperHeight': {
    type: 'string'
  },
  'paperWidth': {
    type: 'string'
  },
  'scale': {
    type: 'int',
    defaultValue: '100'
  },
  'firstPageNumber': {
    type: 'int',
    defaultValue: '1'
  },
  'fitToWidth': {
    type: 'int',
    defaultValue: '1'
  },
  'fitToHeight': {
    type: 'int',
    defaultValue: '1'
  },
  'pageOrder': {
    type: 'string',
    defaultValue: 'downThenOver'
  },
  'orientation': {
    type: 'string',
    defaultValue: 'default'
  },
  'usePrinterDefaults': {
    type: 'boolean',
    defaultValue: 'true'
  },
  'blackAndWhite': {
    type: 'boolean',
    defaultValue: 'false'
  },
  'draft': {
    type: 'boolean',
    defaultValue: 'false'
  },
  'cellComments': {
    type: 'string',
    defaultValue: 'none'
  },
  'useFirstPageNumber': {
    type: 'boolean',
    defaultValue: 'false'
  },
  'errors': {
    type: 'string',
    defaultValue: 'displayed'
  },
  'horizontalDpi': {
    type: 'int',
    defaultValue: '600'
  },
  'verticalDpi': {
    type: 'int',
    defaultValue: '600'
  },
  'copies': {
    type: 'int',
    defaultValue: '1'
  },
  'r:id': {
    type: 'string'
  }
};

export interface CT_HeaderFooter {
  oddHeader?: string;
  oddFooter?: string;
  evenHeader?: string;
  evenFooter?: string;
  firstHeader?: string;
  firstFooter?: string;
  differentOddEven?: boolean;
  differentFirst?: boolean;
  scaleWithDoc?: boolean;
  alignWithMargins?: boolean;
}

export const CT_HeaderFooter_Attributes: Attributes = {
  oddHeader: {
    type: 'child-string'
  },
  oddFooter: {
    type: 'child-string'
  },
  evenHeader: {
    type: 'child-string'
  },
  evenFooter: {
    type: 'child-string'
  },
  firstHeader: {
    type: 'child-string'
  },
  firstFooter: {
    type: 'child-string'
  },
  differentOddEven: {
    type: 'boolean',
    defaultValue: 'false'
  },
  differentFirst: {
    type: 'boolean',
    defaultValue: 'false'
  },
  scaleWithDoc: {
    type: 'boolean',
    defaultValue: 'true'
  },
  alignWithMargins: {
    type: 'boolean',
    defaultValue: 'true'
  }
};

export type ST_SheetState = 'visible' | 'hidden' | 'veryHidden';

export interface CT_CustomSheetView {
  pane?: CT_Pane;
  selection?: CT_Selection;
  rowBreaks?: CT_PageBreak;
  colBreaks?: CT_PageBreak;
  pageMargins?: CT_PageMargins;
  printOptions?: CT_PrintOptions;
  pageSetup?: CT_PageSetup;
  headerFooter?: CT_HeaderFooter;
  autoFilter?: CT_AutoFilter;
  extLst?: CT_ExtensionList[];
  guid?: string;
  scale?: number;
  colorId?: number;
  showPageBreaks?: boolean;
  showFormulas?: boolean;
  showGridLines?: boolean;
  showRowCol?: boolean;
  outlineSymbols?: boolean;
  zeroValues?: boolean;
  fitToPage?: boolean;
  printArea?: boolean;
  filter?: boolean;
  showAutoFilter?: boolean;
  hiddenRows?: boolean;
  hiddenColumns?: boolean;
  state?: ST_SheetState;
  filterUnique?: boolean;
  view?: ST_SheetViewType;
  showRuler?: boolean;
  topLeftCell?: string;
}

export const CT_CustomSheetView_Attributes: Attributes = {
  pane: {
    type: 'child',
    childAttributes: CT_Pane_Attributes
  },
  selection: {
    type: 'child',
    childAttributes: CT_Selection_Attributes
  },
  rowBreaks: {
    type: 'child',
    childAttributes: CT_PageBreak_Attributes
  },
  colBreaks: {
    type: 'child',
    childAttributes: CT_PageBreak_Attributes
  },
  pageMargins: {
    type: 'child',
    childAttributes: CT_PageMargins_Attributes
  },
  printOptions: {
    type: 'child',
    childAttributes: CT_PrintOptions_Attributes
  },
  pageSetup: {
    type: 'child',
    childAttributes: CT_PageSetup_Attributes
  },
  headerFooter: {
    type: 'child',
    childAttributes: CT_HeaderFooter_Attributes
  },
  autoFilter: {
    type: 'child',
    childAttributes: CT_AutoFilter_Attributes
  },
  extLst: {
    type: 'child',
    childAttributes: CT_ExtensionList_Attributes,
    childIsArray: true
  },
  guid: {
    type: 'string'
  },
  scale: {
    type: 'int',
    defaultValue: '100'
  },
  colorId: {
    type: 'int',
    defaultValue: '64'
  },
  showPageBreaks: {
    type: 'boolean',
    defaultValue: 'false'
  },
  showFormulas: {
    type: 'boolean',
    defaultValue: 'false'
  },
  showGridLines: {
    type: 'boolean',
    defaultValue: 'true'
  },
  showRowCol: {
    type: 'boolean',
    defaultValue: 'true'
  },
  outlineSymbols: {
    type: 'boolean',
    defaultValue: 'true'
  },
  zeroValues: {
    type: 'boolean',
    defaultValue: 'true'
  },
  fitToPage: {
    type: 'boolean',
    defaultValue: 'false'
  },
  printArea: {
    type: 'boolean',
    defaultValue: 'false'
  },
  filter: {
    type: 'boolean',
    defaultValue: 'false'
  },
  showAutoFilter: {
    type: 'boolean',
    defaultValue: 'false'
  },
  hiddenRows: {
    type: 'boolean',
    defaultValue: 'false'
  },
  hiddenColumns: {
    type: 'boolean',
    defaultValue: 'false'
  },
  state: {
    type: 'string',
    defaultValue: 'visible'
  },
  filterUnique: {
    type: 'boolean',
    defaultValue: 'false'
  },
  view: {
    type: 'string',
    defaultValue: 'normal'
  },
  showRuler: {
    type: 'boolean',
    defaultValue: 'true'
  },
  topLeftCell: {
    type: 'string'
  }
};

export interface CT_CustomSheetViews {
  customSheetView?: CT_CustomSheetView[];
}

export const CT_CustomSheetViews_Attributes: Attributes = {
  customSheetView: {
    type: 'child',
    childAttributes: CT_CustomSheetView_Attributes,
    childIsArray: true
  }
};

export type ST_CfvoType =
  | 'num'
  | 'percent'
  | 'max'
  | 'min'
  | 'formula'
  | 'percentile';

export interface CT_Cfvo {
  extLst?: CT_ExtensionList;
  type?: ST_CfvoType;
  val?: string;
  gte?: boolean;
}

export const CT_Cfvo_Attributes: Attributes = {
  extLst: {
    type: 'child',
    childAttributes: CT_ExtensionList_Attributes
  },
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

export interface CT_ColorScale {
  cfvo?: CT_Cfvo[];
  color?: CT_Color[];
}

export const CT_ColorScale_Attributes: Attributes = {
  cfvo: {
    type: 'child',
    childAttributes: CT_Cfvo_Attributes,
    childIsArray: true
  },
  color: {
    type: 'child',
    childAttributes: CT_Color_Attributes,
    childIsArray: true
  }
};

export interface CT_DataBar {
  cfvo?: CT_Cfvo[];
  color?: CT_Color;
  minLength?: number;
  maxLength?: number;
  showValue?: boolean;
}

export const CT_DataBar_Attributes: Attributes = {
  cfvo: {
    type: 'child',
    childAttributes: CT_Cfvo_Attributes,
    childIsArray: true
  },
  color: {
    type: 'child',
    childAttributes: CT_Color_Attributes
  },
  minLength: {
    type: 'int',
    defaultValue: '10'
  },
  maxLength: {
    type: 'int',
    defaultValue: '90'
  },
  showValue: {
    type: 'boolean',
    defaultValue: 'true'
  }
};

export interface CT_IconSet {
  cfvo?: CT_Cfvo[];
  iconSet?: ST_IconSetType;
  showValue?: boolean;
  percent?: boolean;
  reverse?: boolean;
}

export const CT_IconSet_Attributes: Attributes = {
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

export type ST_CfType =
  | 'expression'
  | 'cellIs'
  | 'colorScale'
  | 'dataBar'
  | 'iconSet'
  | 'top10'
  | 'uniqueValues'
  | 'duplicateValues'
  | 'containsText'
  | 'notContainsText'
  | 'beginsWith'
  | 'endsWith'
  | 'containsBlanks'
  | 'notContainsBlanks'
  | 'containsErrors'
  | 'notContainsErrors'
  | 'timePeriod'
  | 'aboveAverage';

export type ST_ConditionalFormattingOperator =
  | 'lessThan'
  | 'lessThanOrEqual'
  | 'equal'
  | 'notEqual'
  | 'greaterThanOrEqual'
  | 'greaterThan'
  | 'between'
  | 'notBetween'
  | 'containsText'
  | 'notContains'
  | 'beginsWith'
  | 'endsWith';

export type ST_TimePeriod =
  | 'today'
  | 'yesterday'
  | 'tomorrow'
  | 'last7Days'
  | 'thisMonth'
  | 'lastMonth'
  | 'nextMonth'
  | 'thisWeek'
  | 'lastWeek'
  | 'nextWeek';

export interface CT_CfRule {
  formula?: string[];
  colorScale?: CT_ColorScale;
  dataBar?: CT_DataBar;
  iconSet?: CT_IconSet;
  extLst?: CT_ExtensionList[];
  type?: ST_CfType;
  dxfId?: number;
  priority?: number;
  stopIfTrue?: boolean;
  aboveAverage?: boolean;
  percent?: boolean;
  bottom?: boolean;
  operator?: ST_ConditionalFormattingOperator;
  text?: string;
  timePeriod?: ST_TimePeriod;
  rank?: number;
  stdDev?: number;
  equalAverage?: boolean;
}

export const CT_CfRule_Attributes: Attributes = {
  formula: {
    type: 'child-string',
    childIsArray: true
  },
  colorScale: {
    type: 'child',
    childAttributes: CT_ColorScale_Attributes
  },
  dataBar: {
    type: 'child',
    childAttributes: CT_DataBar_Attributes
  },
  iconSet: {
    type: 'child',
    childAttributes: CT_IconSet_Attributes
  },
  extLst: {
    type: 'child',
    childAttributes: CT_ExtensionList_Attributes,
    childIsArray: true
  },
  type: {
    type: 'string'
  },
  dxfId: {
    type: 'int'
  },
  priority: {
    type: 'int'
  },
  stopIfTrue: {
    type: 'boolean',
    defaultValue: 'false'
  },
  aboveAverage: {
    type: 'boolean',
    defaultValue: 'true'
  },
  percent: {
    type: 'boolean',
    defaultValue: 'false'
  },
  bottom: {
    type: 'boolean',
    defaultValue: 'false'
  },
  operator: {
    type: 'string'
  },
  text: {
    type: 'string'
  },
  timePeriod: {
    type: 'string'
  },
  rank: {
    type: 'int'
  },
  stdDev: {
    type: 'int'
  },
  equalAverage: {
    type: 'boolean',
    defaultValue: 'false'
  }
};

export interface CT_ConditionalFormatting {
  cfRule?: CT_CfRule[];
  extLst?: CT_ExtensionList[];
  pivot?: boolean;
  sqref?: string;
}

export const CT_ConditionalFormatting_Attributes: Attributes = {
  cfRule: {
    type: 'child',
    childAttributes: CT_CfRule_Attributes,
    childIsArray: true
  },
  extLst: {
    type: 'child',
    childAttributes: CT_ExtensionList_Attributes,
    childIsArray: true
  },
  pivot: {
    type: 'boolean',
    defaultValue: 'false'
  },
  sqref: {
    type: 'string'
  }
};

export interface CT_CustomProperty {
  'name'?: string;
  'r:id'?: string;
}

export const CT_CustomProperty_Attributes: Attributes = {
  'name': {
    type: 'string'
  },
  'r:id': {
    type: 'string'
  }
};

export interface CT_CustomProperties {
  customPr?: CT_CustomProperty[];
}

export const CT_CustomProperties_Attributes: Attributes = {
  customPr: {
    type: 'child',
    childAttributes: CT_CustomProperty_Attributes,
    childIsArray: true
  }
};

export interface CT_Drawing {
  'r:id'?: string;
}

export const CT_Drawing_Attributes: Attributes = {
  'r:id': {
    type: 'string'
  }
};

export interface CT_DrawingHF {
  'r:id'?: string;
  'lho'?: number;
  'lhe'?: number;
  'lhf'?: number;
  'cho'?: number;
  'che'?: number;
  'chf'?: number;
  'rho'?: number;
  'rhe'?: number;
  'rhf'?: number;
  'lfo'?: number;
  'lfe'?: number;
  'lff'?: number;
  'cfo'?: number;
  'cfe'?: number;
  'cff'?: number;
  'rfo'?: number;
  'rfe'?: number;
  'rff'?: number;
}

export const CT_DrawingHF_Attributes: Attributes = {
  'r:id': {
    type: 'string'
  },
  'lho': {
    type: 'int'
  },
  'lhe': {
    type: 'int'
  },
  'lhf': {
    type: 'int'
  },
  'cho': {
    type: 'int'
  },
  'che': {
    type: 'int'
  },
  'chf': {
    type: 'int'
  },
  'rho': {
    type: 'int'
  },
  'rhe': {
    type: 'int'
  },
  'rhf': {
    type: 'int'
  },
  'lfo': {
    type: 'int'
  },
  'lfe': {
    type: 'int'
  },
  'lff': {
    type: 'int'
  },
  'cfo': {
    type: 'int'
  },
  'cfe': {
    type: 'int'
  },
  'cff': {
    type: 'int'
  },
  'rfo': {
    type: 'int'
  },
  'rfe': {
    type: 'int'
  },
  'rff': {
    type: 'int'
  }
};

export interface CT_SheetBackgroundPicture {
  'r:id'?: string;
}

export const CT_SheetBackgroundPicture_Attributes: Attributes = {
  'r:id': {
    type: 'string'
  }
};

export interface CT_ObjectPr {
  'anchor'?: CT_ObjectAnchor;
  'locked'?: boolean;
  'defaultSize'?: boolean;
  'print'?: boolean;
  'disabled'?: boolean;
  'uiObject'?: boolean;
  'autoFill'?: boolean;
  'autoLine'?: boolean;
  'autoPict'?: boolean;
  'macro'?: string;
  'altText'?: string;
  'dde'?: boolean;
  'r:id'?: string;
}

export const CT_ObjectPr_Attributes: Attributes = {
  'anchor': {
    type: 'child',
    childAttributes: CT_ObjectAnchor_Attributes
  },
  'locked': {
    type: 'boolean',
    defaultValue: 'true'
  },
  'defaultSize': {
    type: 'boolean',
    defaultValue: 'true'
  },
  'print': {
    type: 'boolean',
    defaultValue: 'true'
  },
  'disabled': {
    type: 'boolean',
    defaultValue: 'false'
  },
  'uiObject': {
    type: 'boolean',
    defaultValue: 'false'
  },
  'autoFill': {
    type: 'boolean',
    defaultValue: 'true'
  },
  'autoLine': {
    type: 'boolean',
    defaultValue: 'true'
  },
  'autoPict': {
    type: 'boolean',
    defaultValue: 'true'
  },
  'macro': {
    type: 'string'
  },
  'altText': {
    type: 'string'
  },
  'dde': {
    type: 'boolean',
    defaultValue: 'false'
  },
  'r:id': {
    type: 'string'
  }
};

export type ST_DvAspect = 'DVASPECT_CONTENT' | 'DVASPECT_ICON';

export type ST_OleUpdate = 'OLEUPDATE_ALWAYS' | 'OLEUPDATE_ONCALL';

export interface CT_OleObject {
  'objectPr'?: CT_ObjectPr;
  'progId'?: string;
  'dvAspect'?: ST_DvAspect;
  'link'?: string;
  'oleUpdate'?: ST_OleUpdate;
  'autoLoad'?: boolean;
  'shapeId'?: number;
  'r:id'?: string;
}

export const CT_OleObject_Attributes: Attributes = {
  'objectPr': {
    type: 'child',
    childAttributes: CT_ObjectPr_Attributes
  },
  'progId': {
    type: 'string'
  },
  'dvAspect': {
    type: 'string',
    defaultValue: 'DVASPECT_CONTENT'
  },
  'link': {
    type: 'string'
  },
  'oleUpdate': {
    type: 'string'
  },
  'autoLoad': {
    type: 'boolean',
    defaultValue: 'false'
  },
  'shapeId': {
    type: 'int'
  },
  'r:id': {
    type: 'string'
  }
};

export interface CT_OleObjects {
  oleObject?: CT_OleObject[];
}

export const CT_OleObjects_Attributes: Attributes = {
  oleObject: {
    type: 'child',
    childAttributes: CT_OleObject_Attributes,
    childIsArray: true
  }
};

export interface CT_Macrosheet {
  sheetPr?: CT_SheetPr;
  dimension?: CT_SheetDimension;
  sheetViews?: CT_SheetViews;
  sheetFormatPr?: CT_SheetFormatPr;
  cols?: CT_Cols[];
  sheetData?: CT_SheetData;
  sheetProtection?: CT_SheetProtection;
  autoFilter?: CT_AutoFilter;
  sortState?: CT_SortState;
  dataConsolidate?: CT_DataConsolidate;
  customSheetViews?: CT_CustomSheetViews;
  phoneticPr?: CT_PhoneticPr;
  conditionalFormatting?: CT_ConditionalFormatting[];
  printOptions?: CT_PrintOptions;
  pageMargins?: CT_PageMargins;
  pageSetup?: CT_PageSetup;
  headerFooter?: CT_HeaderFooter;
  rowBreaks?: CT_PageBreak;
  colBreaks?: CT_PageBreak;
  customProperties?: CT_CustomProperties;
  drawing?: CT_Drawing;
  drawingHF?: CT_DrawingHF;
  picture?: CT_SheetBackgroundPicture;
  oleObjects?: CT_OleObjects;
  extLst?: CT_ExtensionList[];
}

export const CT_Macrosheet_Attributes: Attributes = {
  sheetPr: {
    type: 'child',
    childAttributes: CT_SheetPr_Attributes
  },
  dimension: {
    type: 'child',
    childAttributes: CT_SheetDimension_Attributes
  },
  sheetViews: {
    type: 'child',
    childAttributes: CT_SheetViews_Attributes
  },
  sheetFormatPr: {
    type: 'child',
    childAttributes: CT_SheetFormatPr_Attributes
  },
  cols: {
    type: 'child',
    childAttributes: CT_Cols_Attributes,
    childIsArray: true
  },
  sheetData: {
    type: 'child',
    childAttributes: CT_SheetData_Attributes
  },
  sheetProtection: {
    type: 'child',
    childAttributes: CT_SheetProtection_Attributes
  },
  autoFilter: {
    type: 'child',
    childAttributes: CT_AutoFilter_Attributes
  },
  sortState: {
    type: 'child',
    childAttributes: CT_SortState_Attributes
  },
  dataConsolidate: {
    type: 'child',
    childAttributes: CT_DataConsolidate_Attributes
  },
  customSheetViews: {
    type: 'child',
    childAttributes: CT_CustomSheetViews_Attributes
  },
  phoneticPr: {
    type: 'child',
    childAttributes: CT_PhoneticPr_Attributes
  },
  conditionalFormatting: {
    type: 'child',
    childAttributes: CT_ConditionalFormatting_Attributes,
    childIsArray: true
  },
  printOptions: {
    type: 'child',
    childAttributes: CT_PrintOptions_Attributes
  },
  pageMargins: {
    type: 'child',
    childAttributes: CT_PageMargins_Attributes
  },
  pageSetup: {
    type: 'child',
    childAttributes: CT_PageSetup_Attributes
  },
  headerFooter: {
    type: 'child',
    childAttributes: CT_HeaderFooter_Attributes
  },
  rowBreaks: {
    type: 'child',
    childAttributes: CT_PageBreak_Attributes
  },
  colBreaks: {
    type: 'child',
    childAttributes: CT_PageBreak_Attributes
  },
  customProperties: {
    type: 'child',
    childAttributes: CT_CustomProperties_Attributes
  },
  drawing: {
    type: 'child',
    childAttributes: CT_Drawing_Attributes
  },
  drawingHF: {
    type: 'child',
    childAttributes: CT_DrawingHF_Attributes
  },
  picture: {
    type: 'child',
    childAttributes: CT_SheetBackgroundPicture_Attributes
  },
  oleObjects: {
    type: 'child',
    childAttributes: CT_OleObjects_Attributes
  },
  extLst: {
    type: 'child',
    childAttributes: CT_ExtensionList_Attributes,
    childIsArray: true
  }
};

export interface CT_ControlPr {
  'anchor'?: CT_ObjectAnchor;
  'locked'?: boolean;
  'defaultSize'?: boolean;
  'print'?: boolean;
  'disabled'?: boolean;
  'recalcAlways'?: boolean;
  'uiObject'?: boolean;
  'autoFill'?: boolean;
  'autoLine'?: boolean;
  'autoPict'?: boolean;
  'macro'?: string;
  'altText'?: string;
  'linkedCell'?: string;
  'listFillRange'?: string;
  'cf'?: string;
  'r:id'?: string;
}

export const CT_ControlPr_Attributes: Attributes = {
  'anchor': {
    type: 'child',
    childAttributes: CT_ObjectAnchor_Attributes
  },
  'locked': {
    type: 'boolean',
    defaultValue: 'true'
  },
  'defaultSize': {
    type: 'boolean',
    defaultValue: 'true'
  },
  'print': {
    type: 'boolean',
    defaultValue: 'true'
  },
  'disabled': {
    type: 'boolean',
    defaultValue: 'false'
  },
  'recalcAlways': {
    type: 'boolean',
    defaultValue: 'false'
  },
  'uiObject': {
    type: 'boolean',
    defaultValue: 'false'
  },
  'autoFill': {
    type: 'boolean',
    defaultValue: 'true'
  },
  'autoLine': {
    type: 'boolean',
    defaultValue: 'true'
  },
  'autoPict': {
    type: 'boolean',
    defaultValue: 'true'
  },
  'macro': {
    type: 'string'
  },
  'altText': {
    type: 'string'
  },
  'linkedCell': {
    type: 'string'
  },
  'listFillRange': {
    type: 'string'
  },
  'cf': {
    type: 'string',
    defaultValue: 'pict'
  },
  'r:id': {
    type: 'string'
  }
};

export interface CT_Control {
  'controlPr'?: CT_ControlPr;
  'shapeId'?: number;
  'r:id'?: string;
  'name'?: string;
}

export const CT_Control_Attributes: Attributes = {
  'controlPr': {
    type: 'child',
    childAttributes: CT_ControlPr_Attributes
  },
  'shapeId': {
    type: 'int'
  },
  'r:id': {
    type: 'string'
  },
  'name': {
    type: 'string'
  }
};

export interface CT_Controls {
  control?: CT_Control[];
}

export const CT_Controls_Attributes: Attributes = {
  control: {
    type: 'child',
    childAttributes: CT_Control_Attributes,
    childIsArray: true
  }
};

export interface CT_Dialogsheet {
  sheetPr?: CT_SheetPr[];
  sheetViews?: CT_SheetViews[];
  sheetFormatPr?: CT_SheetFormatPr[];
  sheetProtection?: CT_SheetProtection;
  customSheetViews?: CT_CustomSheetViews[];
  printOptions?: CT_PrintOptions[];
  pageMargins?: CT_PageMargins[];
  pageSetup?: CT_PageSetup[];
  headerFooter?: CT_HeaderFooter[];
  drawing?: CT_Drawing[];
  drawingHF?: CT_DrawingHF;
  oleObjects?: CT_OleObjects;
  controls?: CT_Controls;
  extLst?: CT_ExtensionList[];
}

export const CT_Dialogsheet_Attributes: Attributes = {
  sheetPr: {
    type: 'child',
    childAttributes: CT_SheetPr_Attributes,
    childIsArray: true
  },
  sheetViews: {
    type: 'child',
    childAttributes: CT_SheetViews_Attributes,
    childIsArray: true
  },
  sheetFormatPr: {
    type: 'child',
    childAttributes: CT_SheetFormatPr_Attributes,
    childIsArray: true
  },
  sheetProtection: {
    type: 'child',
    childAttributes: CT_SheetProtection_Attributes
  },
  customSheetViews: {
    type: 'child',
    childAttributes: CT_CustomSheetViews_Attributes,
    childIsArray: true
  },
  printOptions: {
    type: 'child',
    childAttributes: CT_PrintOptions_Attributes,
    childIsArray: true
  },
  pageMargins: {
    type: 'child',
    childAttributes: CT_PageMargins_Attributes,
    childIsArray: true
  },
  pageSetup: {
    type: 'child',
    childAttributes: CT_PageSetup_Attributes,
    childIsArray: true
  },
  headerFooter: {
    type: 'child',
    childAttributes: CT_HeaderFooter_Attributes,
    childIsArray: true
  },
  drawing: {
    type: 'child',
    childAttributes: CT_Drawing_Attributes,
    childIsArray: true
  },
  drawingHF: {
    type: 'child',
    childAttributes: CT_DrawingHF_Attributes
  },
  oleObjects: {
    type: 'child',
    childAttributes: CT_OleObjects_Attributes
  },
  controls: {
    type: 'child',
    childAttributes: CT_Controls_Attributes
  },
  extLst: {
    type: 'child',
    childAttributes: CT_ExtensionList_Attributes,
    childIsArray: true
  }
};

export interface CT_SheetCalcPr {
  fullCalcOnLoad?: boolean;
}

export const CT_SheetCalcPr_Attributes: Attributes = {
  fullCalcOnLoad: {
    type: 'boolean',
    defaultValue: 'false'
  }
};

export interface CT_ProtectedRange {
  securityDescriptor?: string[];
  sqref?: string;
  name?: string;
  algorithmName?: string;
  hashValue?: string;
  saltValue?: string;
  spinCount?: number;
}

export const CT_ProtectedRange_Attributes: Attributes = {
  securityDescriptor: {
    type: 'child-string',
    childIsArray: true
  },
  sqref: {
    type: 'string'
  },
  name: {
    type: 'string'
  },
  algorithmName: {
    type: 'string'
  },
  hashValue: {
    type: 'string'
  },
  saltValue: {
    type: 'string'
  },
  spinCount: {
    type: 'int'
  }
};

export interface CT_ProtectedRanges {
  protectedRange?: CT_ProtectedRange[];
}

export const CT_ProtectedRanges_Attributes: Attributes = {
  protectedRange: {
    type: 'child',
    childAttributes: CT_ProtectedRange_Attributes,
    childIsArray: true
  }
};

export interface CT_InputCells {
  r?: string;
  deleted?: boolean;
  undone?: boolean;
  val?: string;
  numFmtId?: number;
}

export const CT_InputCells_Attributes: Attributes = {
  r: {
    type: 'string'
  },
  deleted: {
    type: 'boolean',
    defaultValue: 'false'
  },
  undone: {
    type: 'boolean',
    defaultValue: 'false'
  },
  val: {
    type: 'string'
  },
  numFmtId: {
    type: 'int'
  }
};

export interface CT_Scenario {
  inputCells?: CT_InputCells[];
  name?: string;
  locked?: boolean;
  hidden?: boolean;
  count?: number;
  user?: string;
  comment?: string;
}

export const CT_Scenario_Attributes: Attributes = {
  inputCells: {
    type: 'child',
    childAttributes: CT_InputCells_Attributes,
    childIsArray: true
  },
  name: {
    type: 'string'
  },
  locked: {
    type: 'boolean',
    defaultValue: 'false'
  },
  hidden: {
    type: 'boolean',
    defaultValue: 'false'
  },
  count: {
    type: 'int'
  },
  user: {
    type: 'string'
  },
  comment: {
    type: 'string'
  }
};

export interface CT_Scenarios {
  scenario?: CT_Scenario[];
  current?: number;
  show?: number;
  sqref?: string;
}

export const CT_Scenarios_Attributes: Attributes = {
  scenario: {
    type: 'child',
    childAttributes: CT_Scenario_Attributes,
    childIsArray: true
  },
  current: {
    type: 'int'
  },
  show: {
    type: 'int'
  },
  sqref: {
    type: 'string'
  }
};

export interface CT_MergeCell {
  ref?: string;
}

export const CT_MergeCell_Attributes: Attributes = {
  ref: {
    type: 'string'
  }
};

export interface CT_MergeCells {
  mergeCell?: CT_MergeCell[];
  count?: number;
}

export const CT_MergeCells_Attributes: Attributes = {
  mergeCell: {
    type: 'child',
    childAttributes: CT_MergeCell_Attributes,
    childIsArray: true
  },
  count: {
    type: 'int'
  }
};

export type ST_DataValidationType =
  | 'none'
  | 'whole'
  | 'decimal'
  | 'list'
  | 'date'
  | 'time'
  | 'textLength'
  | 'custom';

export type ST_DataValidationErrorStyle = 'stop' | 'warning' | 'information';

export type ST_DataValidationImeMode =
  | 'noControl'
  | 'off'
  | 'on'
  | 'disabled'
  | 'hiragana'
  | 'fullKatakana'
  | 'halfKatakana'
  | 'fullAlpha'
  | 'halfAlpha'
  | 'fullHangul'
  | 'halfHangul';

export type ST_DataValidationOperator =
  | 'between'
  | 'notBetween'
  | 'equal'
  | 'notEqual'
  | 'lessThan'
  | 'lessThanOrEqual'
  | 'greaterThan'
  | 'greaterThanOrEqual';

export interface CT_DataValidation {
  formula1?: string;
  formula2?: string;
  type?: ST_DataValidationType;
  errorStyle?: ST_DataValidationErrorStyle;
  imeMode?: ST_DataValidationImeMode;
  operator?: ST_DataValidationOperator;
  allowBlank?: boolean;
  showDropDown?: boolean;
  showInputMessage?: boolean;
  showErrorMessage?: boolean;
  errorTitle?: string;
  error?: string;
  promptTitle?: string;
  prompt?: string;
  sqref?: string;
}

export const CT_DataValidation_Attributes: Attributes = {
  formula1: {
    type: 'child-string'
  },
  formula2: {
    type: 'child-string'
  },
  type: {
    type: 'string',
    defaultValue: 'none'
  },
  errorStyle: {
    type: 'string',
    defaultValue: 'stop'
  },
  imeMode: {
    type: 'string',
    defaultValue: 'noControl'
  },
  operator: {
    type: 'string',
    defaultValue: 'between'
  },
  allowBlank: {
    type: 'boolean',
    defaultValue: 'false'
  },
  showDropDown: {
    type: 'boolean',
    defaultValue: 'false'
  },
  showInputMessage: {
    type: 'boolean',
    defaultValue: 'false'
  },
  showErrorMessage: {
    type: 'boolean',
    defaultValue: 'false'
  },
  errorTitle: {
    type: 'string'
  },
  error: {
    type: 'string'
  },
  promptTitle: {
    type: 'string'
  },
  prompt: {
    type: 'string'
  },
  sqref: {
    type: 'string'
  }
};

export interface CT_DataValidations {
  dataValidation?: CT_DataValidation[];
  disablePrompts?: boolean;
  xWindow?: number;
  yWindow?: number;
  count?: number;
}

export const CT_DataValidations_Attributes: Attributes = {
  dataValidation: {
    type: 'child',
    childAttributes: CT_DataValidation_Attributes,
    childIsArray: true
  },
  disablePrompts: {
    type: 'boolean',
    defaultValue: 'false'
  },
  xWindow: {
    type: 'int'
  },
  yWindow: {
    type: 'int'
  },
  count: {
    type: 'int'
  }
};

export interface CT_Hyperlinks {
  hyperlink?: CT_Hyperlink[];
}

export const CT_Hyperlinks_Attributes: Attributes = {
  hyperlink: {
    type: 'child',
    childAttributes: CT_Hyperlink_Attributes,
    childIsArray: true
  }
};

export interface CT_CellWatch {
  r?: string;
}

export const CT_CellWatch_Attributes: Attributes = {
  r: {
    type: 'string'
  }
};

export interface CT_CellWatches {
  cellWatch?: CT_CellWatch[];
}

export const CT_CellWatches_Attributes: Attributes = {
  cellWatch: {
    type: 'child',
    childAttributes: CT_CellWatch_Attributes,
    childIsArray: true
  }
};

export interface CT_IgnoredError {
  sqref?: string;
  evalError?: boolean;
  twoDigitTextYear?: boolean;
  numberStoredAsText?: boolean;
  formula?: boolean;
  formulaRange?: boolean;
  unlockedFormula?: boolean;
  emptyCellReference?: boolean;
  listDataValidation?: boolean;
  calculatedColumn?: boolean;
}

export const CT_IgnoredError_Attributes: Attributes = {
  sqref: {
    type: 'string'
  },
  evalError: {
    type: 'boolean',
    defaultValue: 'false'
  },
  twoDigitTextYear: {
    type: 'boolean',
    defaultValue: 'false'
  },
  numberStoredAsText: {
    type: 'boolean',
    defaultValue: 'false'
  },
  formula: {
    type: 'boolean',
    defaultValue: 'false'
  },
  formulaRange: {
    type: 'boolean',
    defaultValue: 'false'
  },
  unlockedFormula: {
    type: 'boolean',
    defaultValue: 'false'
  },
  emptyCellReference: {
    type: 'boolean',
    defaultValue: 'false'
  },
  listDataValidation: {
    type: 'boolean',
    defaultValue: 'false'
  },
  calculatedColumn: {
    type: 'boolean',
    defaultValue: 'false'
  }
};

export interface CT_IgnoredErrors {
  ignoredError?: CT_IgnoredError[];
  extLst?: CT_ExtensionList;
}

export const CT_IgnoredErrors_Attributes: Attributes = {
  ignoredError: {
    type: 'child',
    childAttributes: CT_IgnoredError_Attributes,
    childIsArray: true
  },
  extLst: {
    type: 'child',
    childAttributes: CT_ExtensionList_Attributes
  }
};

export interface CT_CellSmartTagPr {
  key?: string;
  val?: string;
}

export const CT_CellSmartTagPr_Attributes: Attributes = {
  key: {
    type: 'string'
  },
  val: {
    type: 'string'
  }
};

export interface CT_CellSmartTag {
  cellSmartTagPr?: CT_CellSmartTagPr[];
  type?: number;
  deleted?: boolean;
  xmlBased?: boolean;
}

export const CT_CellSmartTag_Attributes: Attributes = {
  cellSmartTagPr: {
    type: 'child',
    childAttributes: CT_CellSmartTagPr_Attributes,
    childIsArray: true
  },
  type: {
    type: 'int'
  },
  deleted: {
    type: 'boolean',
    defaultValue: 'false'
  },
  xmlBased: {
    type: 'boolean',
    defaultValue: 'false'
  }
};

export interface CT_CellSmartTags {
  cellSmartTag?: CT_CellSmartTag[];
  r?: string;
}

export const CT_CellSmartTags_Attributes: Attributes = {
  cellSmartTag: {
    type: 'child',
    childAttributes: CT_CellSmartTag_Attributes,
    childIsArray: true
  },
  r: {
    type: 'string'
  }
};

export interface CT_SmartTags {
  cellSmartTags?: CT_CellSmartTags[];
}

export const CT_SmartTags_Attributes: Attributes = {
  cellSmartTags: {
    type: 'child',
    childAttributes: CT_CellSmartTags_Attributes,
    childIsArray: true
  }
};

export type ST_WebSourceType =
  | 'sheet'
  | 'printArea'
  | 'autoFilter'
  | 'range'
  | 'chart'
  | 'pivotTable'
  | 'query'
  | 'label';

export interface CT_WebPublishItem {
  id?: number;
  divId?: string;
  sourceType?: ST_WebSourceType;
  sourceRef?: string;
  sourceObject?: string;
  destinationFile?: string;
  title?: string;
  autoRepublish?: boolean;
}

export const CT_WebPublishItem_Attributes: Attributes = {
  id: {
    type: 'int'
  },
  divId: {
    type: 'string'
  },
  sourceType: {
    type: 'string'
  },
  sourceRef: {
    type: 'string'
  },
  sourceObject: {
    type: 'string'
  },
  destinationFile: {
    type: 'string'
  },
  title: {
    type: 'string'
  },
  autoRepublish: {
    type: 'boolean',
    defaultValue: 'false'
  }
};

export interface CT_WebPublishItems {
  webPublishItem?: CT_WebPublishItem[];
  count?: number;
}

export const CT_WebPublishItems_Attributes: Attributes = {
  webPublishItem: {
    type: 'child',
    childAttributes: CT_WebPublishItem_Attributes,
    childIsArray: true
  },
  count: {
    type: 'int'
  }
};

export interface CT_TablePart {
  'r:id'?: string;
}

export const CT_TablePart_Attributes: Attributes = {
  'r:id': {
    type: 'string'
  }
};

export interface CT_TableParts {
  tablePart?: CT_TablePart[];
  count?: number;
}

export const CT_TableParts_Attributes: Attributes = {
  tablePart: {
    type: 'child',
    childAttributes: CT_TablePart_Attributes,
    childIsArray: true
  },
  count: {
    type: 'int'
  }
};

export interface CT_Worksheet {
  sheetPr?: CT_SheetPr;
  dimension?: CT_SheetDimension;
  sheetViews?: CT_SheetViews;
  sheetFormatPr?: CT_SheetFormatPr;
  cols?: CT_Cols[];
  sheetData?: CT_SheetData;
  sheetCalcPr?: CT_SheetCalcPr;
  sheetProtection?: CT_SheetProtection;
  protectedRanges?: CT_ProtectedRanges;
  scenarios?: CT_Scenarios;
  autoFilter?: CT_AutoFilter;
  sortState?: CT_SortState;
  dataConsolidate?: CT_DataConsolidate;
  customSheetViews?: CT_CustomSheetViews;
  mergeCells?: CT_MergeCells;
  phoneticPr?: CT_PhoneticPr;
  conditionalFormatting?: CT_ConditionalFormatting[];
  dataValidations?: CT_DataValidations;
  hyperlinks?: CT_Hyperlinks;
  printOptions?: CT_PrintOptions;
  pageMargins?: CT_PageMargins;
  pageSetup?: CT_PageSetup;
  headerFooter?: CT_HeaderFooter;
  rowBreaks?: CT_PageBreak;
  colBreaks?: CT_PageBreak;
  customProperties?: CT_CustomProperties;
  cellWatches?: CT_CellWatches;
  ignoredErrors?: CT_IgnoredErrors;
  smartTags?: CT_SmartTags;
  drawing?: CT_Drawing;
  drawingHF?: CT_DrawingHF;
  picture?: CT_SheetBackgroundPicture;
  oleObjects?: CT_OleObjects;
  controls?: CT_Controls;
  webPublishItems?: CT_WebPublishItems;
  tableParts?: CT_TableParts;
  extLst?: CT_ExtensionList;
}

export const CT_Worksheet_Attributes: Attributes = {
  sheetPr: {
    type: 'child',
    childAttributes: CT_SheetPr_Attributes
  },
  dimension: {
    type: 'child',
    childAttributes: CT_SheetDimension_Attributes
  },
  sheetViews: {
    type: 'child',
    childAttributes: CT_SheetViews_Attributes
  },
  sheetFormatPr: {
    type: 'child',
    childAttributes: CT_SheetFormatPr_Attributes
  },
  cols: {
    type: 'child',
    childAttributes: CT_Cols_Attributes,
    childIsArray: true
  },
  sheetData: {
    type: 'child',
    childAttributes: CT_SheetData_Attributes
  },
  sheetCalcPr: {
    type: 'child',
    childAttributes: CT_SheetCalcPr_Attributes
  },
  sheetProtection: {
    type: 'child',
    childAttributes: CT_SheetProtection_Attributes
  },
  protectedRanges: {
    type: 'child',
    childAttributes: CT_ProtectedRanges_Attributes
  },
  scenarios: {
    type: 'child',
    childAttributes: CT_Scenarios_Attributes
  },
  autoFilter: {
    type: 'child',
    childAttributes: CT_AutoFilter_Attributes
  },
  sortState: {
    type: 'child',
    childAttributes: CT_SortState_Attributes
  },
  dataConsolidate: {
    type: 'child',
    childAttributes: CT_DataConsolidate_Attributes
  },
  customSheetViews: {
    type: 'child',
    childAttributes: CT_CustomSheetViews_Attributes
  },
  mergeCells: {
    type: 'child',
    childAttributes: CT_MergeCells_Attributes
  },
  phoneticPr: {
    type: 'child',
    childAttributes: CT_PhoneticPr_Attributes
  },
  conditionalFormatting: {
    type: 'child',
    childAttributes: CT_ConditionalFormatting_Attributes,
    childIsArray: true
  },
  dataValidations: {
    type: 'child',
    childAttributes: CT_DataValidations_Attributes
  },
  hyperlinks: {
    type: 'child',
    childAttributes: CT_Hyperlinks_Attributes
  },
  printOptions: {
    type: 'child',
    childAttributes: CT_PrintOptions_Attributes
  },
  pageMargins: {
    type: 'child',
    childAttributes: CT_PageMargins_Attributes
  },
  pageSetup: {
    type: 'child',
    childAttributes: CT_PageSetup_Attributes
  },
  headerFooter: {
    type: 'child',
    childAttributes: CT_HeaderFooter_Attributes
  },
  rowBreaks: {
    type: 'child',
    childAttributes: CT_PageBreak_Attributes
  },
  colBreaks: {
    type: 'child',
    childAttributes: CT_PageBreak_Attributes
  },
  customProperties: {
    type: 'child',
    childAttributes: CT_CustomProperties_Attributes
  },
  cellWatches: {
    type: 'child',
    childAttributes: CT_CellWatches_Attributes
  },
  ignoredErrors: {
    type: 'child',
    childAttributes: CT_IgnoredErrors_Attributes
  },
  smartTags: {
    type: 'child',
    childAttributes: CT_SmartTags_Attributes
  },
  drawing: {
    type: 'child',
    childAttributes: CT_Drawing_Attributes
  },
  drawingHF: {
    type: 'child',
    childAttributes: CT_DrawingHF_Attributes
  },
  picture: {
    type: 'child',
    childAttributes: CT_SheetBackgroundPicture_Attributes
  },
  oleObjects: {
    type: 'child',
    childAttributes: CT_OleObjects_Attributes
  },
  controls: {
    type: 'child',
    childAttributes: CT_Controls_Attributes
  },
  webPublishItems: {
    type: 'child',
    childAttributes: CT_WebPublishItems_Attributes
  },
  tableParts: {
    type: 'child',
    childAttributes: CT_TableParts_Attributes
  },
  extLst: {
    type: 'child',
    childAttributes: CT_ExtensionList_Attributes
  }
};

export type ST_CellSpan = string;

export type ST_CellFormulaType = 'normal' | 'array' | 'dataTable' | 'shared';

export interface CT_ChartsheetPr {
  tabColor?: CT_Color;
  published?: boolean;
  codeName?: string;
}

export const CT_ChartsheetPr_Attributes: Attributes = {
  tabColor: {
    type: 'child',
    childAttributes: CT_Color_Attributes
  },
  published: {
    type: 'boolean',
    defaultValue: 'true'
  },
  codeName: {
    type: 'string'
  }
};

export interface CT_ChartsheetView {
  extLst?: CT_ExtensionList;
  tabSelected?: boolean;
  zoomScale?: number;
  workbookViewId?: number;
  zoomToFit?: boolean;
}

export const CT_ChartsheetView_Attributes: Attributes = {
  extLst: {
    type: 'child',
    childAttributes: CT_ExtensionList_Attributes
  },
  tabSelected: {
    type: 'boolean',
    defaultValue: 'false'
  },
  zoomScale: {
    type: 'int',
    defaultValue: '100'
  },
  workbookViewId: {
    type: 'int'
  },
  zoomToFit: {
    type: 'boolean',
    defaultValue: 'false'
  }
};

export interface CT_ChartsheetViews {
  sheetView?: CT_ChartsheetView[];
  extLst?: CT_ExtensionList;
}

export const CT_ChartsheetViews_Attributes: Attributes = {
  sheetView: {
    type: 'child',
    childAttributes: CT_ChartsheetView_Attributes,
    childIsArray: true
  },
  extLst: {
    type: 'child',
    childAttributes: CT_ExtensionList_Attributes
  }
};

export interface CT_ChartsheetProtection {
  algorithmName?: string;
  hashValue?: string;
  saltValue?: string;
  spinCount?: number;
  content?: boolean;
  objects?: boolean;
}

export const CT_ChartsheetProtection_Attributes: Attributes = {
  algorithmName: {
    type: 'string'
  },
  hashValue: {
    type: 'string'
  },
  saltValue: {
    type: 'string'
  },
  spinCount: {
    type: 'int'
  },
  content: {
    type: 'boolean',
    defaultValue: 'false'
  },
  objects: {
    type: 'boolean',
    defaultValue: 'false'
  }
};

export interface CT_CsPageSetup {
  'paperSize'?: number;
  'paperHeight'?: string;
  'paperWidth'?: string;
  'firstPageNumber'?: number;
  'orientation'?: ST_Orientation;
  'usePrinterDefaults'?: boolean;
  'blackAndWhite'?: boolean;
  'draft'?: boolean;
  'useFirstPageNumber'?: boolean;
  'horizontalDpi'?: number;
  'verticalDpi'?: number;
  'copies'?: number;
  'r:id'?: string;
}

export const CT_CsPageSetup_Attributes: Attributes = {
  'paperSize': {
    type: 'int',
    defaultValue: '1'
  },
  'paperHeight': {
    type: 'string'
  },
  'paperWidth': {
    type: 'string'
  },
  'firstPageNumber': {
    type: 'int',
    defaultValue: '1'
  },
  'orientation': {
    type: 'string',
    defaultValue: 'default'
  },
  'usePrinterDefaults': {
    type: 'boolean',
    defaultValue: 'true'
  },
  'blackAndWhite': {
    type: 'boolean',
    defaultValue: 'false'
  },
  'draft': {
    type: 'boolean',
    defaultValue: 'false'
  },
  'useFirstPageNumber': {
    type: 'boolean',
    defaultValue: 'false'
  },
  'horizontalDpi': {
    type: 'int',
    defaultValue: '600'
  },
  'verticalDpi': {
    type: 'int',
    defaultValue: '600'
  },
  'copies': {
    type: 'int',
    defaultValue: '1'
  },
  'r:id': {
    type: 'string'
  }
};

export interface CT_CustomChartsheetView {
  pageMargins?: CT_PageMargins;
  pageSetup?: CT_CsPageSetup;
  headerFooter?: CT_HeaderFooter;
  guid?: string;
  scale?: number;
  state?: ST_SheetState;
  zoomToFit?: boolean;
}

export const CT_CustomChartsheetView_Attributes: Attributes = {
  pageMargins: {
    type: 'child',
    childAttributes: CT_PageMargins_Attributes
  },
  pageSetup: {
    type: 'child',
    childAttributes: CT_CsPageSetup_Attributes
  },
  headerFooter: {
    type: 'child',
    childAttributes: CT_HeaderFooter_Attributes
  },
  guid: {
    type: 'string'
  },
  scale: {
    type: 'int',
    defaultValue: '100'
  },
  state: {
    type: 'string',
    defaultValue: 'visible'
  },
  zoomToFit: {
    type: 'boolean',
    defaultValue: 'false'
  }
};

export interface CT_CustomChartsheetViews {
  customSheetView?: CT_CustomChartsheetView[];
}

export const CT_CustomChartsheetViews_Attributes: Attributes = {
  customSheetView: {
    type: 'child',
    childAttributes: CT_CustomChartsheetView_Attributes,
    childIsArray: true
  }
};

export interface CT_Chartsheet {
  sheetPr?: CT_ChartsheetPr;
  sheetViews?: CT_ChartsheetViews;
  sheetProtection?: CT_ChartsheetProtection;
  customSheetViews?: CT_CustomChartsheetViews;
  pageMargins?: CT_PageMargins[];
  pageSetup?: CT_CsPageSetup;
  headerFooter?: CT_HeaderFooter[];
  drawing?: CT_Drawing;
  drawingHF?: CT_DrawingHF;
  picture?: CT_SheetBackgroundPicture;
  webPublishItems?: CT_WebPublishItems;
  extLst?: CT_ExtensionList;
}

export const CT_Chartsheet_Attributes: Attributes = {
  sheetPr: {
    type: 'child',
    childAttributes: CT_ChartsheetPr_Attributes
  },
  sheetViews: {
    type: 'child',
    childAttributes: CT_ChartsheetViews_Attributes
  },
  sheetProtection: {
    type: 'child',
    childAttributes: CT_ChartsheetProtection_Attributes
  },
  customSheetViews: {
    type: 'child',
    childAttributes: CT_CustomChartsheetViews_Attributes
  },
  pageMargins: {
    type: 'child',
    childAttributes: CT_PageMargins_Attributes,
    childIsArray: true
  },
  pageSetup: {
    type: 'child',
    childAttributes: CT_CsPageSetup_Attributes
  },
  headerFooter: {
    type: 'child',
    childAttributes: CT_HeaderFooter_Attributes,
    childIsArray: true
  },
  drawing: {
    type: 'child',
    childAttributes: CT_Drawing_Attributes
  },
  drawingHF: {
    type: 'child',
    childAttributes: CT_DrawingHF_Attributes
  },
  picture: {
    type: 'child',
    childAttributes: CT_SheetBackgroundPicture_Attributes
  },
  webPublishItems: {
    type: 'child',
    childAttributes: CT_WebPublishItems_Attributes
  },
  extLst: {
    type: 'child',
    childAttributes: CT_ExtensionList_Attributes
  }
};

export interface CT_MetadataType {
  name?: string;
  minSupportedVersion?: number;
  ghostRow?: boolean;
  ghostCol?: boolean;
  edit?: boolean;
  delete?: boolean;
  copy?: boolean;
  pasteAll?: boolean;
  pasteFormulas?: boolean;
  pasteValues?: boolean;
  pasteFormats?: boolean;
  pasteComments?: boolean;
  pasteDataValidation?: boolean;
  pasteBorders?: boolean;
  pasteColWidths?: boolean;
  pasteNumberFormats?: boolean;
  merge?: boolean;
  splitFirst?: boolean;
  splitAll?: boolean;
  rowColShift?: boolean;
  clearAll?: boolean;
  clearFormats?: boolean;
  clearContents?: boolean;
  clearComments?: boolean;
  assign?: boolean;
  coerce?: boolean;
  adjust?: boolean;
  cellMeta?: boolean;
}

export const CT_MetadataType_Attributes: Attributes = {
  name: {
    type: 'string'
  },
  minSupportedVersion: {
    type: 'int'
  },
  ghostRow: {
    type: 'boolean',
    defaultValue: 'false'
  },
  ghostCol: {
    type: 'boolean',
    defaultValue: 'false'
  },
  edit: {
    type: 'boolean',
    defaultValue: 'false'
  },
  delete: {
    type: 'boolean',
    defaultValue: 'false'
  },
  copy: {
    type: 'boolean',
    defaultValue: 'false'
  },
  pasteAll: {
    type: 'boolean',
    defaultValue: 'false'
  },
  pasteFormulas: {
    type: 'boolean',
    defaultValue: 'false'
  },
  pasteValues: {
    type: 'boolean',
    defaultValue: 'false'
  },
  pasteFormats: {
    type: 'boolean',
    defaultValue: 'false'
  },
  pasteComments: {
    type: 'boolean',
    defaultValue: 'false'
  },
  pasteDataValidation: {
    type: 'boolean',
    defaultValue: 'false'
  },
  pasteBorders: {
    type: 'boolean',
    defaultValue: 'false'
  },
  pasteColWidths: {
    type: 'boolean',
    defaultValue: 'false'
  },
  pasteNumberFormats: {
    type: 'boolean',
    defaultValue: 'false'
  },
  merge: {
    type: 'boolean',
    defaultValue: 'false'
  },
  splitFirst: {
    type: 'boolean',
    defaultValue: 'false'
  },
  splitAll: {
    type: 'boolean',
    defaultValue: 'false'
  },
  rowColShift: {
    type: 'boolean',
    defaultValue: 'false'
  },
  clearAll: {
    type: 'boolean',
    defaultValue: 'false'
  },
  clearFormats: {
    type: 'boolean',
    defaultValue: 'false'
  },
  clearContents: {
    type: 'boolean',
    defaultValue: 'false'
  },
  clearComments: {
    type: 'boolean',
    defaultValue: 'false'
  },
  assign: {
    type: 'boolean',
    defaultValue: 'false'
  },
  coerce: {
    type: 'boolean',
    defaultValue: 'false'
  },
  adjust: {
    type: 'boolean',
    defaultValue: 'false'
  },
  cellMeta: {
    type: 'boolean',
    defaultValue: 'false'
  }
};

export interface CT_MetadataTypes {
  metadataType?: CT_MetadataType[];
  count?: number;
}

export const CT_MetadataTypes_Attributes: Attributes = {
  metadataType: {
    type: 'child',
    childAttributes: CT_MetadataType_Attributes,
    childIsArray: true
  },
  count: {
    type: 'int',
    defaultValue: '0'
  }
};

export interface CT_MetadataStrings {
  s?: CT_XStringElement[];
  count?: number;
}

export const CT_MetadataStrings_Attributes: Attributes = {
  s: {
    type: 'child',
    childAttributes: CT_XStringElement_Attributes,
    childIsArray: true
  },
  count: {
    type: 'int',
    defaultValue: '0'
  }
};

export interface CT_MetadataStringIndex {
  x?: number;
  s?: boolean;
}

export const CT_MetadataStringIndex_Attributes: Attributes = {
  x: {
    type: 'int'
  },
  s: {
    type: 'boolean',
    defaultValue: 'false'
  }
};

export interface CT_MdxTuple {
  n?: CT_MetadataStringIndex[];
  c?: number;
  ct?: string;
  si?: number;
  fi?: number;
  bc?: string;
  fc?: string;
  i?: boolean;
  u?: boolean;
  st?: boolean;
  b?: boolean;
}

export const CT_MdxTuple_Attributes: Attributes = {
  n: {
    type: 'child',
    childAttributes: CT_MetadataStringIndex_Attributes,
    childIsArray: true
  },
  c: {
    type: 'int',
    defaultValue: '0'
  },
  ct: {
    type: 'string'
  },
  si: {
    type: 'int'
  },
  fi: {
    type: 'int'
  },
  bc: {
    type: 'string'
  },
  fc: {
    type: 'string'
  },
  i: {
    type: 'boolean',
    defaultValue: 'false'
  },
  u: {
    type: 'boolean',
    defaultValue: 'false'
  },
  st: {
    type: 'boolean',
    defaultValue: 'false'
  },
  b: {
    type: 'boolean',
    defaultValue: 'false'
  }
};

export type ST_MdxSetOrder = 'u' | 'a' | 'd' | 'aa' | 'ad' | 'na' | 'nd';

export interface CT_MdxSet {
  n?: CT_MetadataStringIndex[];
  ns?: number;
  c?: number;
  o?: ST_MdxSetOrder;
}

export const CT_MdxSet_Attributes: Attributes = {
  n: {
    type: 'child',
    childAttributes: CT_MetadataStringIndex_Attributes,
    childIsArray: true
  },
  ns: {
    type: 'int'
  },
  c: {
    type: 'int',
    defaultValue: '0'
  },
  o: {
    type: 'string',
    defaultValue: 'u'
  }
};

export interface CT_MdxMemeberProp {
  n?: number;
  np?: number;
}

export const CT_MdxMemeberProp_Attributes: Attributes = {
  n: {
    type: 'int'
  },
  np: {
    type: 'int'
  }
};

export type ST_MdxKPIProperty = 'v' | 'g' | 's' | 't' | 'w' | 'm';

export interface CT_MdxKPI {
  n?: number;
  np?: number;
  p?: ST_MdxKPIProperty;
}

export const CT_MdxKPI_Attributes: Attributes = {
  n: {
    type: 'int'
  },
  np: {
    type: 'int'
  },
  p: {
    type: 'string'
  }
};

export type ST_MdxFunctionType = 'm' | 'v' | 's' | 'c' | 'r' | 'p' | 'k';

export interface CT_Mdx {
  t?: CT_MdxTuple[];
  ms?: CT_MdxSet[];
  p?: CT_MdxMemeberProp[];
  k?: CT_MdxKPI[];
  n?: number;
  f?: ST_MdxFunctionType;
}

export const CT_Mdx_Attributes: Attributes = {
  t: {
    type: 'child',
    childAttributes: CT_MdxTuple_Attributes,
    childIsArray: true
  },
  ms: {
    type: 'child',
    childAttributes: CT_MdxSet_Attributes,
    childIsArray: true
  },
  p: {
    type: 'child',
    childAttributes: CT_MdxMemeberProp_Attributes,
    childIsArray: true
  },
  k: {
    type: 'child',
    childAttributes: CT_MdxKPI_Attributes,
    childIsArray: true
  },
  n: {
    type: 'int'
  },
  f: {
    type: 'string'
  }
};

export interface CT_MdxMetadata {
  mdx?: CT_Mdx[];
  count?: number;
}

export const CT_MdxMetadata_Attributes: Attributes = {
  mdx: {
    type: 'child',
    childAttributes: CT_Mdx_Attributes,
    childIsArray: true
  },
  count: {
    type: 'int',
    defaultValue: '0'
  }
};

export interface CT_FutureMetadataBlock {
  extLst?: CT_ExtensionList;
}

export const CT_FutureMetadataBlock_Attributes: Attributes = {
  extLst: {
    type: 'child',
    childAttributes: CT_ExtensionList_Attributes
  }
};

export interface CT_FutureMetadata {
  bk?: CT_FutureMetadataBlock[];
  extLst?: CT_ExtensionList;
  name?: string;
  count?: number;
}

export const CT_FutureMetadata_Attributes: Attributes = {
  bk: {
    type: 'child',
    childAttributes: CT_FutureMetadataBlock_Attributes,
    childIsArray: true
  },
  extLst: {
    type: 'child',
    childAttributes: CT_ExtensionList_Attributes
  },
  name: {
    type: 'string'
  },
  count: {
    type: 'int',
    defaultValue: '0'
  }
};

export interface CT_MetadataRecord {
  t?: number;
  v?: number;
}

export const CT_MetadataRecord_Attributes: Attributes = {
  t: {
    type: 'int'
  },
  v: {
    type: 'int'
  }
};

export interface CT_MetadataBlock {
  rc?: CT_MetadataRecord[];
}

export const CT_MetadataBlock_Attributes: Attributes = {
  rc: {
    type: 'child',
    childAttributes: CT_MetadataRecord_Attributes,
    childIsArray: true
  }
};

export interface CT_MetadataBlocks {
  bk?: CT_MetadataBlock[];
  count?: number;
}

export const CT_MetadataBlocks_Attributes: Attributes = {
  bk: {
    type: 'child',
    childAttributes: CT_MetadataBlock_Attributes,
    childIsArray: true
  },
  count: {
    type: 'int',
    defaultValue: '0'
  }
};

export interface CT_Metadata {
  metadataTypes?: CT_MetadataTypes;
  metadataStrings?: CT_MetadataStrings;
  mdxMetadata?: CT_MdxMetadata;
  futureMetadata?: CT_FutureMetadata[];
  cellMetadata?: CT_MetadataBlocks;
  valueMetadata?: CT_MetadataBlocks;
  extLst?: CT_ExtensionList;
}

export const CT_Metadata_Attributes: Attributes = {
  metadataTypes: {
    type: 'child',
    childAttributes: CT_MetadataTypes_Attributes
  },
  metadataStrings: {
    type: 'child',
    childAttributes: CT_MetadataStrings_Attributes
  },
  mdxMetadata: {
    type: 'child',
    childAttributes: CT_MdxMetadata_Attributes
  },
  futureMetadata: {
    type: 'child',
    childAttributes: CT_FutureMetadata_Attributes,
    childIsArray: true
  },
  cellMetadata: {
    type: 'child',
    childAttributes: CT_MetadataBlocks_Attributes
  },
  valueMetadata: {
    type: 'child',
    childAttributes: CT_MetadataBlocks_Attributes
  },
  extLst: {
    type: 'child',
    childAttributes: CT_ExtensionList_Attributes
  }
};

export type ST_XmlDataType = string;

export interface CT_XmlPr {
  extLst?: CT_ExtensionList;
  mapId?: number;
  xpath?: string;
  xmlDataType?: string;
}

export const CT_XmlPr_Attributes: Attributes = {
  extLst: {
    type: 'child',
    childAttributes: CT_ExtensionList_Attributes
  },
  mapId: {
    type: 'int'
  },
  xpath: {
    type: 'string'
  },
  xmlDataType: {
    type: 'string'
  }
};

export interface CT_XmlCellPr {
  xmlPr?: CT_XmlPr;
  extLst?: CT_ExtensionList;
  id?: number;
  uniqueName?: string;
}

export const CT_XmlCellPr_Attributes: Attributes = {
  xmlPr: {
    type: 'child',
    childAttributes: CT_XmlPr_Attributes
  },
  extLst: {
    type: 'child',
    childAttributes: CT_ExtensionList_Attributes
  },
  id: {
    type: 'int'
  },
  uniqueName: {
    type: 'string'
  }
};

export interface CT_SingleXmlCell {
  xmlCellPr?: CT_XmlCellPr;
  extLst?: CT_ExtensionList;
  id?: number;
  r?: string;
  connectionId?: number;
}

export const CT_SingleXmlCell_Attributes: Attributes = {
  xmlCellPr: {
    type: 'child',
    childAttributes: CT_XmlCellPr_Attributes
  },
  extLst: {
    type: 'child',
    childAttributes: CT_ExtensionList_Attributes
  },
  id: {
    type: 'int'
  },
  r: {
    type: 'string'
  },
  connectionId: {
    type: 'int'
  }
};

export interface CT_SingleXmlCells {
  singleXmlCell?: CT_SingleXmlCell[];
}

export const CT_SingleXmlCells_Attributes: Attributes = {
  singleXmlCell: {
    type: 'child',
    childAttributes: CT_SingleXmlCell_Attributes,
    childIsArray: true
  }
};

export interface CT_NumFmts {
  numFmt?: CT_NumFmt[];
  count?: number;
}

export const CT_NumFmts_Attributes: Attributes = {
  numFmt: {
    type: 'child',
    childAttributes: CT_NumFmt_Attributes,
    childIsArray: true
  },
  count: {
    type: 'int'
  }
};

export interface CT_Fonts {
  font?: CT_Font[];
  count?: number;
}

export const CT_Fonts_Attributes: Attributes = {
  font: {
    type: 'child',
    childAttributes: CT_Font_Attributes,
    childIsArray: true
  },
  count: {
    type: 'int'
  }
};

export interface CT_Fills {
  fill?: CT_Fill[];
  count?: number;
}

export const CT_Fills_Attributes: Attributes = {
  fill: {
    type: 'child',
    childAttributes: CT_Fill_Attributes,
    childIsArray: true
  },
  count: {
    type: 'int'
  }
};

export interface CT_Borders {
  border?: CT_Border[];
  count?: number;
}

export const CT_Borders_Attributes: Attributes = {
  border: {
    type: 'child',
    childAttributes: CT_Border_Attributes,
    childIsArray: true
  },
  count: {
    type: 'int'
  }
};

export type ST_FillId = number;

export type ST_BorderId = number;

export type ST_CellStyleXfId = number;

export interface CT_Xf {
  alignment?: CT_CellAlignment;
  protection?: CT_CellProtection;
  extLst?: CT_ExtensionList;
  numFmtId?: number;
  fontId?: number;
  fillId?: number;
  borderId?: number;
  xfId?: number;
  quotePrefix?: boolean;
  pivotButton?: boolean;
  applyNumberFormat?: boolean;
  applyFont?: boolean;
  applyFill?: boolean;
  applyBorder?: boolean;
  applyAlignment?: boolean;
  applyProtection?: boolean;
}

export const CT_Xf_Attributes: Attributes = {
  alignment: {
    type: 'child',
    childAttributes: CT_CellAlignment_Attributes
  },
  protection: {
    type: 'child',
    childAttributes: CT_CellProtection_Attributes
  },
  extLst: {
    type: 'child',
    childAttributes: CT_ExtensionList_Attributes
  },
  numFmtId: {
    type: 'int'
  },
  fontId: {
    type: 'int'
  },
  fillId: {
    type: 'int'
  },
  borderId: {
    type: 'int'
  },
  xfId: {
    type: 'int'
  },
  quotePrefix: {
    type: 'boolean',
    defaultValue: 'false'
  },
  pivotButton: {
    type: 'boolean',
    defaultValue: 'false'
  },
  applyNumberFormat: {
    type: 'boolean'
  },
  applyFont: {
    type: 'boolean'
  },
  applyFill: {
    type: 'boolean'
  },
  applyBorder: {
    type: 'boolean'
  },
  applyAlignment: {
    type: 'boolean'
  },
  applyProtection: {
    type: 'boolean'
  }
};

export interface CT_CellStyleXfs {
  xf?: CT_Xf[];
  count?: number;
}

export const CT_CellStyleXfs_Attributes: Attributes = {
  xf: {
    type: 'child',
    childAttributes: CT_Xf_Attributes,
    childIsArray: true
  },
  count: {
    type: 'int'
  }
};

export interface CT_CellXfs {
  xf?: CT_Xf[];
  count?: number;
}

export const CT_CellXfs_Attributes: Attributes = {
  xf: {
    type: 'child',
    childAttributes: CT_Xf_Attributes,
    childIsArray: true
  },
  count: {
    type: 'int'
  }
};

export interface CT_CellStyle {
  extLst?: CT_ExtensionList;
  name?: string;
  xfId?: number;
  builtinId?: number;
  iLevel?: number;
  hidden?: boolean;
  customBuiltin?: boolean;
}

export const CT_CellStyle_Attributes: Attributes = {
  extLst: {
    type: 'child',
    childAttributes: CT_ExtensionList_Attributes
  },
  name: {
    type: 'string'
  },
  xfId: {
    type: 'int'
  },
  builtinId: {
    type: 'int'
  },
  iLevel: {
    type: 'int'
  },
  hidden: {
    type: 'boolean'
  },
  customBuiltin: {
    type: 'boolean'
  }
};

export interface CT_CellStyles {
  cellStyle?: CT_CellStyle[];
  count?: number;
}

export const CT_CellStyles_Attributes: Attributes = {
  cellStyle: {
    type: 'child',
    childAttributes: CT_CellStyle_Attributes,
    childIsArray: true
  },
  count: {
    type: 'int'
  }
};

export interface CT_Dxfs {
  dxf?: CT_Dxf[];
  count?: number;
}

export const CT_Dxfs_Attributes: Attributes = {
  dxf: {
    type: 'child',
    childAttributes: CT_Dxf_Attributes,
    childIsArray: true
  },
  count: {
    type: 'int'
  }
};

export interface CT_TableStyles {
  tableStyle?: CT_TableStyle[];
  count?: number;
  defaultTableStyle?: string;
  defaultPivotStyle?: string;
}

export const CT_TableStyles_Attributes: Attributes = {
  tableStyle: {
    type: 'child',
    childAttributes: CT_TableStyle_Attributes,
    childIsArray: true
  },
  count: {
    type: 'int'
  },
  defaultTableStyle: {
    type: 'string'
  },
  defaultPivotStyle: {
    type: 'string'
  }
};

export interface CT_RgbColor {
  rgb?: string;
}

export const CT_RgbColor_Attributes: Attributes = {
  rgb: {
    type: 'string'
  }
};

export interface CT_IndexedColors {
  rgbColor?: CT_RgbColor[];
}

export const CT_IndexedColors_Attributes: Attributes = {
  rgbColor: {
    type: 'child',
    childAttributes: CT_RgbColor_Attributes,
    childIsArray: true
  }
};

export interface CT_MRUColors {
  color?: CT_Color[];
}

export const CT_MRUColors_Attributes: Attributes = {
  color: {
    type: 'child',
    childAttributes: CT_Color_Attributes,
    childIsArray: true
  }
};

export interface CT_Colors {
  indexedColors?: CT_IndexedColors;
  mruColors?: CT_MRUColors;
}

export const CT_Colors_Attributes: Attributes = {
  indexedColors: {
    type: 'child',
    childAttributes: CT_IndexedColors_Attributes
  },
  mruColors: {
    type: 'child',
    childAttributes: CT_MRUColors_Attributes
  }
};

export interface CT_Stylesheet {
  numFmts?: CT_NumFmts;
  fonts?: CT_Fonts;
  fills?: CT_Fills;
  borders?: CT_Borders;
  cellStyleXfs?: CT_CellStyleXfs;
  cellXfs?: CT_CellXfs;
  cellStyles?: CT_CellStyles;
  dxfs?: CT_Dxfs;
  tableStyles?: CT_TableStyles;
  colors?: CT_Colors;
  extLst?: CT_ExtensionList;
}

export const CT_Stylesheet_Attributes: Attributes = {
  numFmts: {
    type: 'child',
    childAttributes: CT_NumFmts_Attributes
  },
  fonts: {
    type: 'child',
    childAttributes: CT_Fonts_Attributes
  },
  fills: {
    type: 'child',
    childAttributes: CT_Fills_Attributes
  },
  borders: {
    type: 'child',
    childAttributes: CT_Borders_Attributes
  },
  cellStyleXfs: {
    type: 'child',
    childAttributes: CT_CellStyleXfs_Attributes
  },
  cellXfs: {
    type: 'child',
    childAttributes: CT_CellXfs_Attributes
  },
  cellStyles: {
    type: 'child',
    childAttributes: CT_CellStyles_Attributes
  },
  dxfs: {
    type: 'child',
    childAttributes: CT_Dxfs_Attributes
  },
  tableStyles: {
    type: 'child',
    childAttributes: CT_TableStyles_Attributes
  },
  colors: {
    type: 'child',
    childAttributes: CT_Colors_Attributes
  },
  extLst: {
    type: 'child',
    childAttributes: CT_ExtensionList_Attributes
  }
};

export type ST_TextRotation = undefined;

export interface CT_ExternalSheetName {
  val?: string;
}

export const CT_ExternalSheetName_Attributes: Attributes = {
  val: {
    type: 'string'
  }
};

export interface CT_ExternalSheetNames {
  sheetName?: CT_ExternalSheetName[];
}

export const CT_ExternalSheetNames_Attributes: Attributes = {
  sheetName: {
    type: 'child',
    childAttributes: CT_ExternalSheetName_Attributes,
    childIsArray: true
  }
};

export interface CT_ExternalDefinedName {
  name?: string;
  refersTo?: string;
  sheetId?: number;
}

export const CT_ExternalDefinedName_Attributes: Attributes = {
  name: {
    type: 'string'
  },
  refersTo: {
    type: 'string'
  },
  sheetId: {
    type: 'int'
  }
};

export interface CT_ExternalDefinedNames {
  definedName?: CT_ExternalDefinedName[];
}

export const CT_ExternalDefinedNames_Attributes: Attributes = {
  definedName: {
    type: 'child',
    childAttributes: CT_ExternalDefinedName_Attributes,
    childIsArray: true
  }
};

export interface CT_ExternalCell {
  v?: string;
  r?: string;
  t?: ST_CellType;
  vm?: number;
}

export const CT_ExternalCell_Attributes: Attributes = {
  v: {
    type: 'child-string'
  },
  r: {
    type: 'string'
  },
  t: {
    type: 'string',
    defaultValue: 'n'
  },
  vm: {
    type: 'int',
    defaultValue: '0'
  }
};

export interface CT_ExternalRow {
  cell?: CT_ExternalCell[];
  r?: number;
}

export const CT_ExternalRow_Attributes: Attributes = {
  cell: {
    type: 'child',
    childAttributes: CT_ExternalCell_Attributes,
    childIsArray: true
  },
  r: {
    type: 'int'
  }
};

export interface CT_ExternalSheetData {
  row?: CT_ExternalRow[];
  sheetId?: number;
  refreshError?: boolean;
}

export const CT_ExternalSheetData_Attributes: Attributes = {
  row: {
    type: 'child',
    childAttributes: CT_ExternalRow_Attributes,
    childIsArray: true
  },
  sheetId: {
    type: 'int'
  },
  refreshError: {
    type: 'boolean',
    defaultValue: 'false'
  }
};

export interface CT_ExternalSheetDataSet {
  sheetData?: CT_ExternalSheetData[];
}

export const CT_ExternalSheetDataSet_Attributes: Attributes = {
  sheetData: {
    type: 'child',
    childAttributes: CT_ExternalSheetData_Attributes,
    childIsArray: true
  }
};

export interface CT_ExternalBook {
  'sheetNames'?: CT_ExternalSheetNames;
  'definedNames'?: CT_ExternalDefinedNames;
  'sheetDataSet'?: CT_ExternalSheetDataSet;
  'r:id'?: string;
}

export const CT_ExternalBook_Attributes: Attributes = {
  'sheetNames': {
    type: 'child',
    childAttributes: CT_ExternalSheetNames_Attributes
  },
  'definedNames': {
    type: 'child',
    childAttributes: CT_ExternalDefinedNames_Attributes
  },
  'sheetDataSet': {
    type: 'child',
    childAttributes: CT_ExternalSheetDataSet_Attributes
  },
  'r:id': {
    type: 'string'
  }
};

export type ST_DdeValueType = 'nil' | 'b' | 'n' | 'e' | 'str';

export interface CT_DdeValue {
  val?: string;
  t?: ST_DdeValueType;
}

export const CT_DdeValue_Attributes: Attributes = {
  val: {
    type: 'child-string'
  },
  t: {
    type: 'string',
    defaultValue: 'n'
  }
};

export interface CT_DdeValues {
  value?: CT_DdeValue[];
  rows?: number;
  cols?: number;
}

export const CT_DdeValues_Attributes: Attributes = {
  value: {
    type: 'child',
    childAttributes: CT_DdeValue_Attributes,
    childIsArray: true
  },
  rows: {
    type: 'int',
    defaultValue: '1'
  },
  cols: {
    type: 'int',
    defaultValue: '1'
  }
};

export interface CT_DdeItem {
  values?: CT_DdeValues;
  name?: string;
  ole?: boolean;
  advise?: boolean;
  preferPic?: boolean;
}

export const CT_DdeItem_Attributes: Attributes = {
  values: {
    type: 'child',
    childAttributes: CT_DdeValues_Attributes
  },
  name: {
    type: 'string',
    defaultValue: '0'
  },
  ole: {
    type: 'boolean',
    defaultValue: 'false'
  },
  advise: {
    type: 'boolean',
    defaultValue: 'false'
  },
  preferPic: {
    type: 'boolean',
    defaultValue: 'false'
  }
};

export interface CT_DdeItems {
  ddeItem?: CT_DdeItem[];
}

export const CT_DdeItems_Attributes: Attributes = {
  ddeItem: {
    type: 'child',
    childAttributes: CT_DdeItem_Attributes,
    childIsArray: true
  }
};

export interface CT_DdeLink {
  ddeItems?: CT_DdeItems;
  ddeService?: string;
  ddeTopic?: string;
}

export const CT_DdeLink_Attributes: Attributes = {
  ddeItems: {
    type: 'child',
    childAttributes: CT_DdeItems_Attributes
  },
  ddeService: {
    type: 'string'
  },
  ddeTopic: {
    type: 'string'
  }
};

export interface CT_OleItem {
  name?: string;
  icon?: boolean;
  advise?: boolean;
  preferPic?: boolean;
}

export const CT_OleItem_Attributes: Attributes = {
  name: {
    type: 'string'
  },
  icon: {
    type: 'boolean',
    defaultValue: 'false'
  },
  advise: {
    type: 'boolean',
    defaultValue: 'false'
  },
  preferPic: {
    type: 'boolean',
    defaultValue: 'false'
  }
};

export interface CT_OleItems {
  oleItem?: CT_OleItem[];
}

export const CT_OleItems_Attributes: Attributes = {
  oleItem: {
    type: 'child',
    childAttributes: CT_OleItem_Attributes,
    childIsArray: true
  }
};

export interface CT_OleLink {
  'oleItems'?: CT_OleItems;
  'r:id'?: string;
  'progId'?: string;
}

export const CT_OleLink_Attributes: Attributes = {
  'oleItems': {
    type: 'child',
    childAttributes: CT_OleItems_Attributes
  },
  'r:id': {
    type: 'string'
  },
  'progId': {
    type: 'string'
  }
};

export interface CT_ExternalLink {
  externalBook?: CT_ExternalBook;
  ddeLink?: CT_DdeLink;
  oleLink?: CT_OleLink;
  extLst?: CT_ExtensionList[];
}

export const CT_ExternalLink_Attributes: Attributes = {
  externalBook: {
    type: 'child',
    childAttributes: CT_ExternalBook_Attributes
  },
  ddeLink: {
    type: 'child',
    childAttributes: CT_DdeLink_Attributes
  },
  oleLink: {
    type: 'child',
    childAttributes: CT_OleLink_Attributes
  },
  extLst: {
    type: 'child',
    childAttributes: CT_ExtensionList_Attributes,
    childIsArray: true
  }
};

export interface CT_TableFormula {}

export const CT_TableFormula_Attributes: Attributes = {};

export interface CT_XmlColumnPr {
  extLst?: CT_ExtensionList;
  mapId?: number;
  xpath?: string;
  denormalized?: boolean;
  xmlDataType?: string;
}

export const CT_XmlColumnPr_Attributes: Attributes = {
  extLst: {
    type: 'child',
    childAttributes: CT_ExtensionList_Attributes
  },
  mapId: {
    type: 'int'
  },
  xpath: {
    type: 'string'
  },
  denormalized: {
    type: 'boolean',
    defaultValue: 'false'
  },
  xmlDataType: {
    type: 'string'
  }
};

export type ST_TotalsRowFunction =
  | 'none'
  | 'sum'
  | 'min'
  | 'max'
  | 'average'
  | 'count'
  | 'countNums'
  | 'stdDev'
  | 'var'
  | 'custom';

export interface CT_TableColumn {
  calculatedColumnFormula?: CT_TableFormula;
  totalsRowFormula?: CT_TableFormula;
  xmlColumnPr?: CT_XmlColumnPr;
  extLst?: CT_ExtensionList;
  id?: number;
  uniqueName?: string;
  name?: string;
  totalsRowFunction?: ST_TotalsRowFunction;
  totalsRowLabel?: string;
  queryTableFieldId?: number;
  headerRowDxfId?: number;
  dataDxfId?: number;
  totalsRowDxfId?: number;
  headerRowCellStyle?: string;
  dataCellStyle?: string;
  totalsRowCellStyle?: string;
}

export const CT_TableColumn_Attributes: Attributes = {
  calculatedColumnFormula: {
    type: 'child',
    childAttributes: CT_TableFormula_Attributes
  },
  totalsRowFormula: {
    type: 'child',
    childAttributes: CT_TableFormula_Attributes
  },
  xmlColumnPr: {
    type: 'child',
    childAttributes: CT_XmlColumnPr_Attributes
  },
  extLst: {
    type: 'child',
    childAttributes: CT_ExtensionList_Attributes
  },
  id: {
    type: 'int'
  },
  uniqueName: {
    type: 'string'
  },
  name: {
    type: 'string'
  },
  totalsRowFunction: {
    type: 'string',
    defaultValue: 'none'
  },
  totalsRowLabel: {
    type: 'string'
  },
  queryTableFieldId: {
    type: 'int'
  },
  headerRowDxfId: {
    type: 'int'
  },
  dataDxfId: {
    type: 'int'
  },
  totalsRowDxfId: {
    type: 'int'
  },
  headerRowCellStyle: {
    type: 'string'
  },
  dataCellStyle: {
    type: 'string'
  },
  totalsRowCellStyle: {
    type: 'string'
  }
};

export interface CT_TableColumns {
  tableColumn?: CT_TableColumn[];
  count?: number;
}

export const CT_TableColumns_Attributes: Attributes = {
  tableColumn: {
    type: 'child',
    childAttributes: CT_TableColumn_Attributes,
    childIsArray: true
  },
  count: {
    type: 'int'
  }
};

export interface CT_TableStyleInfo {
  name?: string;
  showFirstColumn?: boolean;
  showLastColumn?: boolean;
  showRowStripes?: boolean;
  showColumnStripes?: boolean;
}

export const CT_TableStyleInfo_Attributes: Attributes = {
  name: {
    type: 'string'
  },
  showFirstColumn: {
    type: 'boolean'
  },
  showLastColumn: {
    type: 'boolean'
  },
  showRowStripes: {
    type: 'boolean'
  },
  showColumnStripes: {
    type: 'boolean'
  }
};

export type ST_TableType = 'worksheet' | 'xml' | 'queryTable';

export interface CT_Table {
  autoFilter?: CT_AutoFilter;
  sortState?: CT_SortState;
  tableColumns?: CT_TableColumns;
  tableStyleInfo?: CT_TableStyleInfo;
  extLst?: CT_ExtensionList;
  id?: number;
  name?: string;
  displayName?: string;
  comment?: string;
  ref?: string;
  tableType?: ST_TableType;
  headerRowCount?: number;
  insertRow?: boolean;
  insertRowShift?: boolean;
  totalsRowCount?: number;
  totalsRowShown?: boolean;
  published?: boolean;
  headerRowDxfId?: number;
  dataDxfId?: number;
  totalsRowDxfId?: number;
  headerRowBorderDxfId?: number;
  tableBorderDxfId?: number;
  totalsRowBorderDxfId?: number;
  headerRowCellStyle?: string;
  dataCellStyle?: string;
  totalsRowCellStyle?: string;
  connectionId?: number;
}

export const CT_Table_Attributes: Attributes = {
  autoFilter: {
    type: 'child',
    childAttributes: CT_AutoFilter_Attributes
  },
  sortState: {
    type: 'child',
    childAttributes: CT_SortState_Attributes
  },
  tableColumns: {
    type: 'child',
    childAttributes: CT_TableColumns_Attributes
  },
  tableStyleInfo: {
    type: 'child',
    childAttributes: CT_TableStyleInfo_Attributes
  },
  extLst: {
    type: 'child',
    childAttributes: CT_ExtensionList_Attributes
  },
  id: {
    type: 'int'
  },
  name: {
    type: 'string'
  },
  displayName: {
    type: 'string'
  },
  comment: {
    type: 'string'
  },
  ref: {
    type: 'string'
  },
  tableType: {
    type: 'string',
    defaultValue: 'worksheet'
  },
  headerRowCount: {
    type: 'int',
    defaultValue: '1'
  },
  insertRow: {
    type: 'boolean',
    defaultValue: 'false'
  },
  insertRowShift: {
    type: 'boolean',
    defaultValue: 'false'
  },
  totalsRowCount: {
    type: 'int',
    defaultValue: '0'
  },
  totalsRowShown: {
    type: 'boolean',
    defaultValue: 'true'
  },
  published: {
    type: 'boolean',
    defaultValue: 'false'
  },
  headerRowDxfId: {
    type: 'int'
  },
  dataDxfId: {
    type: 'int'
  },
  totalsRowDxfId: {
    type: 'int'
  },
  headerRowBorderDxfId: {
    type: 'int'
  },
  tableBorderDxfId: {
    type: 'int'
  },
  totalsRowBorderDxfId: {
    type: 'int'
  },
  headerRowCellStyle: {
    type: 'string'
  },
  dataCellStyle: {
    type: 'string'
  },
  totalsRowCellStyle: {
    type: 'string'
  },
  connectionId: {
    type: 'int'
  }
};

export interface CT_VolTopicRef {
  r?: string;
  s?: number;
}

export const CT_VolTopicRef_Attributes: Attributes = {
  r: {
    type: 'string'
  },
  s: {
    type: 'int'
  }
};

export type ST_VolValueType = 'b' | 'n' | 'e' | 's';

export interface CT_VolTopic {
  v?: string;
  stp?: string[];
  tr?: CT_VolTopicRef[];
  t?: ST_VolValueType;
}

export const CT_VolTopic_Attributes: Attributes = {
  v: {
    type: 'child-string'
  },
  stp: {
    type: 'child-string',
    childIsArray: true
  },
  tr: {
    type: 'child',
    childAttributes: CT_VolTopicRef_Attributes,
    childIsArray: true
  },
  t: {
    type: 'string',
    defaultValue: 'n'
  }
};

export interface CT_VolMain {
  tp?: CT_VolTopic[];
  first?: string;
}

export const CT_VolMain_Attributes: Attributes = {
  tp: {
    type: 'child',
    childAttributes: CT_VolTopic_Attributes,
    childIsArray: true
  },
  first: {
    type: 'string'
  }
};

export type ST_VolDepType = 'realTimeData' | 'olapFunctions';

export interface CT_VolType {
  main?: CT_VolMain[];
  type?: ST_VolDepType;
}

export const CT_VolType_Attributes: Attributes = {
  main: {
    type: 'child',
    childAttributes: CT_VolMain_Attributes,
    childIsArray: true
  },
  type: {
    type: 'string'
  }
};

export interface CT_VolTypes {
  volType?: CT_VolType[];
  extLst?: CT_ExtensionList[];
}

export const CT_VolTypes_Attributes: Attributes = {
  volType: {
    type: 'child',
    childAttributes: CT_VolType_Attributes,
    childIsArray: true
  },
  extLst: {
    type: 'child',
    childAttributes: CT_ExtensionList_Attributes,
    childIsArray: true
  }
};

export interface CT_FileVersion {
  appName?: string;
  lastEdited?: string;
  lowestEdited?: string;
  rupBuild?: string;
  codeName?: string;
}

export const CT_FileVersion_Attributes: Attributes = {
  appName: {
    type: 'string'
  },
  lastEdited: {
    type: 'string'
  },
  lowestEdited: {
    type: 'string'
  },
  rupBuild: {
    type: 'string'
  },
  codeName: {
    type: 'string'
  }
};

export interface CT_FileSharing {
  readOnlyRecommended?: boolean;
  userName?: string;
  algorithmName?: string;
  hashValue?: string;
  saltValue?: string;
  spinCount?: number;
}

export const CT_FileSharing_Attributes: Attributes = {
  readOnlyRecommended: {
    type: 'boolean',
    defaultValue: 'false'
  },
  userName: {
    type: 'string'
  },
  algorithmName: {
    type: 'string'
  },
  hashValue: {
    type: 'string'
  },
  saltValue: {
    type: 'string'
  },
  spinCount: {
    type: 'int'
  }
};

export type ST_Objects = 'all' | 'placeholders' | 'none';

export type ST_UpdateLinks = 'userSet' | 'never' | 'always';

export interface CT_WorkbookPr {
  date1904?: boolean;
  showObjects?: ST_Objects;
  showBorderUnselectedTables?: boolean;
  filterPrivacy?: boolean;
  promptedSolutions?: boolean;
  showInkAnnotation?: boolean;
  backupFile?: boolean;
  saveExternalLinkValues?: boolean;
  updateLinks?: ST_UpdateLinks;
  codeName?: string;
  hidePivotFieldList?: boolean;
  showPivotChartFilter?: boolean;
  allowRefreshQuery?: boolean;
  publishItems?: boolean;
  checkCompatibility?: boolean;
  autoCompressPictures?: boolean;
  refreshAllConnections?: boolean;
  defaultThemeVersion?: number;
}

export const CT_WorkbookPr_Attributes: Attributes = {
  date1904: {
    type: 'boolean',
    defaultValue: 'false'
  },
  showObjects: {
    type: 'string',
    defaultValue: 'all'
  },
  showBorderUnselectedTables: {
    type: 'boolean',
    defaultValue: 'true'
  },
  filterPrivacy: {
    type: 'boolean',
    defaultValue: 'false'
  },
  promptedSolutions: {
    type: 'boolean',
    defaultValue: 'false'
  },
  showInkAnnotation: {
    type: 'boolean',
    defaultValue: 'true'
  },
  backupFile: {
    type: 'boolean',
    defaultValue: 'false'
  },
  saveExternalLinkValues: {
    type: 'boolean',
    defaultValue: 'true'
  },
  updateLinks: {
    type: 'string',
    defaultValue: 'userSet'
  },
  codeName: {
    type: 'string'
  },
  hidePivotFieldList: {
    type: 'boolean',
    defaultValue: 'false'
  },
  showPivotChartFilter: {
    type: 'boolean',
    defaultValue: 'false'
  },
  allowRefreshQuery: {
    type: 'boolean',
    defaultValue: 'false'
  },
  publishItems: {
    type: 'boolean',
    defaultValue: 'false'
  },
  checkCompatibility: {
    type: 'boolean',
    defaultValue: 'false'
  },
  autoCompressPictures: {
    type: 'boolean',
    defaultValue: 'true'
  },
  refreshAllConnections: {
    type: 'boolean',
    defaultValue: 'false'
  },
  defaultThemeVersion: {
    type: 'int'
  }
};

export interface CT_WorkbookProtection {
  lockStructure?: boolean;
  lockWindows?: boolean;
  lockRevision?: boolean;
  revisionsAlgorithmName?: string;
  revisionsHashValue?: string;
  revisionsSaltValue?: string;
  revisionsSpinCount?: number;
  workbookAlgorithmName?: string;
  workbookHashValue?: string;
  workbookSaltValue?: string;
  workbookSpinCount?: number;
}

export const CT_WorkbookProtection_Attributes: Attributes = {
  lockStructure: {
    type: 'boolean',
    defaultValue: 'false'
  },
  lockWindows: {
    type: 'boolean',
    defaultValue: 'false'
  },
  lockRevision: {
    type: 'boolean',
    defaultValue: 'false'
  },
  revisionsAlgorithmName: {
    type: 'string'
  },
  revisionsHashValue: {
    type: 'string'
  },
  revisionsSaltValue: {
    type: 'string'
  },
  revisionsSpinCount: {
    type: 'int'
  },
  workbookAlgorithmName: {
    type: 'string'
  },
  workbookHashValue: {
    type: 'string'
  },
  workbookSaltValue: {
    type: 'string'
  },
  workbookSpinCount: {
    type: 'int'
  }
};

export type ST_Visibility = 'visible' | 'hidden' | 'veryHidden';

export interface CT_BookView {
  extLst?: CT_ExtensionList;
  visibility?: ST_Visibility;
  minimized?: boolean;
  showHorizontalScroll?: boolean;
  showVerticalScroll?: boolean;
  showSheetTabs?: boolean;
  xWindow?: number;
  yWindow?: number;
  windowWidth?: number;
  windowHeight?: number;
  tabRatio?: number;
  firstSheet?: number;
  activeTab?: number;
  autoFilterDateGrouping?: boolean;
}

export const CT_BookView_Attributes: Attributes = {
  extLst: {
    type: 'child',
    childAttributes: CT_ExtensionList_Attributes
  },
  visibility: {
    type: 'string',
    defaultValue: 'visible'
  },
  minimized: {
    type: 'boolean',
    defaultValue: 'false'
  },
  showHorizontalScroll: {
    type: 'boolean',
    defaultValue: 'true'
  },
  showVerticalScroll: {
    type: 'boolean',
    defaultValue: 'true'
  },
  showSheetTabs: {
    type: 'boolean',
    defaultValue: 'true'
  },
  xWindow: {
    type: 'int'
  },
  yWindow: {
    type: 'int'
  },
  windowWidth: {
    type: 'int'
  },
  windowHeight: {
    type: 'int'
  },
  tabRatio: {
    type: 'int',
    defaultValue: '600'
  },
  firstSheet: {
    type: 'int',
    defaultValue: '0'
  },
  activeTab: {
    type: 'int',
    defaultValue: '0'
  },
  autoFilterDateGrouping: {
    type: 'boolean',
    defaultValue: 'true'
  }
};

export interface CT_BookViews {
  workbookView?: CT_BookView[];
}

export const CT_BookViews_Attributes: Attributes = {
  workbookView: {
    type: 'child',
    childAttributes: CT_BookView_Attributes,
    childIsArray: true
  }
};

export interface CT_Sheet {
  'name'?: string;
  'sheetId'?: number;
  'state'?: ST_SheetState;
  'r:id'?: string;
}

export const CT_Sheet_Attributes: Attributes = {
  'name': {
    type: 'string'
  },
  'sheetId': {
    type: 'int'
  },
  'state': {
    type: 'string',
    defaultValue: 'visible'
  },
  'r:id': {
    type: 'string'
  }
};

export interface CT_Sheets {
  sheet?: CT_Sheet[];
}

export const CT_Sheets_Attributes: Attributes = {
  sheet: {
    type: 'child',
    childAttributes: CT_Sheet_Attributes,
    childIsArray: true
  }
};

export interface CT_FunctionGroup {
  name?: string;
}

export const CT_FunctionGroup_Attributes: Attributes = {
  name: {
    type: 'string'
  }
};

export interface CT_FunctionGroups {
  functionGroup?: CT_FunctionGroup[];
  builtInGroupCount?: number;
}

export const CT_FunctionGroups_Attributes: Attributes = {
  functionGroup: {
    type: 'child',
    childAttributes: CT_FunctionGroup_Attributes,
    childIsArray: true
  },
  builtInGroupCount: {
    type: 'int',
    defaultValue: '16'
  }
};

export interface CT_ExternalReference {
  'r:id'?: string;
}

export const CT_ExternalReference_Attributes: Attributes = {
  'r:id': {
    type: 'string'
  }
};

export interface CT_ExternalReferences {
  externalReference?: CT_ExternalReference[];
}

export const CT_ExternalReferences_Attributes: Attributes = {
  externalReference: {
    type: 'child',
    childAttributes: CT_ExternalReference_Attributes,
    childIsArray: true
  }
};

export interface CT_DefinedName {}

export const CT_DefinedName_Attributes: Attributes = {};

export interface CT_DefinedNames {
  definedName?: CT_DefinedName[];
}

export const CT_DefinedNames_Attributes: Attributes = {
  definedName: {
    type: 'child',
    childAttributes: CT_DefinedName_Attributes,
    childIsArray: true
  }
};

export type ST_CalcMode = 'manual' | 'auto' | 'autoNoTable';

export type ST_RefMode = 'A1' | 'R1C1';

export interface CT_CalcPr {
  calcId?: number;
  calcMode?: ST_CalcMode;
  fullCalcOnLoad?: boolean;
  refMode?: ST_RefMode;
  iterate?: boolean;
  iterateCount?: number;
  iterateDelta?: number;
  fullPrecision?: boolean;
  calcCompleted?: boolean;
  calcOnSave?: boolean;
  concurrentCalc?: boolean;
  concurrentManualCount?: number;
  forceFullCalc?: boolean;
}

export const CT_CalcPr_Attributes: Attributes = {
  calcId: {
    type: 'int'
  },
  calcMode: {
    type: 'string',
    defaultValue: 'auto'
  },
  fullCalcOnLoad: {
    type: 'boolean',
    defaultValue: 'false'
  },
  refMode: {
    type: 'string',
    defaultValue: 'A1'
  },
  iterate: {
    type: 'boolean',
    defaultValue: 'false'
  },
  iterateCount: {
    type: 'int',
    defaultValue: '100'
  },
  iterateDelta: {
    type: 'double',
    defaultValue: '0.001'
  },
  fullPrecision: {
    type: 'boolean',
    defaultValue: 'true'
  },
  calcCompleted: {
    type: 'boolean',
    defaultValue: 'true'
  },
  calcOnSave: {
    type: 'boolean',
    defaultValue: 'true'
  },
  concurrentCalc: {
    type: 'boolean',
    defaultValue: 'true'
  },
  concurrentManualCount: {
    type: 'int'
  },
  forceFullCalc: {
    type: 'boolean'
  }
};

export interface CT_OleSize {
  ref?: string;
}

export const CT_OleSize_Attributes: Attributes = {
  ref: {
    type: 'string'
  }
};

export type ST_Comments = 'commNone' | 'commIndicator' | 'commIndAndComment';

export interface CT_CustomWorkbookView {
  extLst?: CT_ExtensionList[];
  name?: string;
  guid?: string;
  autoUpdate?: boolean;
  mergeInterval?: number;
  changesSavedWin?: boolean;
  onlySync?: boolean;
  personalView?: boolean;
  includePrintSettings?: boolean;
  includeHiddenRowCol?: boolean;
  maximized?: boolean;
  minimized?: boolean;
  showHorizontalScroll?: boolean;
  showVerticalScroll?: boolean;
  showSheetTabs?: boolean;
  xWindow?: number;
  yWindow?: number;
  windowWidth?: number;
  windowHeight?: number;
  tabRatio?: number;
  activeSheetId?: number;
  showFormulaBar?: boolean;
  showStatusbar?: boolean;
  showComments?: ST_Comments;
  showObjects?: ST_Objects;
}

export const CT_CustomWorkbookView_Attributes: Attributes = {
  extLst: {
    type: 'child',
    childAttributes: CT_ExtensionList_Attributes,
    childIsArray: true
  },
  name: {
    type: 'string'
  },
  guid: {
    type: 'string'
  },
  autoUpdate: {
    type: 'boolean',
    defaultValue: 'false'
  },
  mergeInterval: {
    type: 'int'
  },
  changesSavedWin: {
    type: 'boolean',
    defaultValue: 'false'
  },
  onlySync: {
    type: 'boolean',
    defaultValue: 'false'
  },
  personalView: {
    type: 'boolean',
    defaultValue: 'false'
  },
  includePrintSettings: {
    type: 'boolean',
    defaultValue: 'true'
  },
  includeHiddenRowCol: {
    type: 'boolean',
    defaultValue: 'true'
  },
  maximized: {
    type: 'boolean',
    defaultValue: 'false'
  },
  minimized: {
    type: 'boolean',
    defaultValue: 'false'
  },
  showHorizontalScroll: {
    type: 'boolean',
    defaultValue: 'true'
  },
  showVerticalScroll: {
    type: 'boolean',
    defaultValue: 'true'
  },
  showSheetTabs: {
    type: 'boolean',
    defaultValue: 'true'
  },
  xWindow: {
    type: 'int',
    defaultValue: '0'
  },
  yWindow: {
    type: 'int',
    defaultValue: '0'
  },
  windowWidth: {
    type: 'int'
  },
  windowHeight: {
    type: 'int'
  },
  tabRatio: {
    type: 'int',
    defaultValue: '600'
  },
  activeSheetId: {
    type: 'int'
  },
  showFormulaBar: {
    type: 'boolean',
    defaultValue: 'true'
  },
  showStatusbar: {
    type: 'boolean',
    defaultValue: 'true'
  },
  showComments: {
    type: 'string',
    defaultValue: 'commIndicator'
  },
  showObjects: {
    type: 'string',
    defaultValue: 'all'
  }
};

export interface CT_CustomWorkbookViews {
  customWorkbookView?: CT_CustomWorkbookView[];
}

export const CT_CustomWorkbookViews_Attributes: Attributes = {
  customWorkbookView: {
    type: 'child',
    childAttributes: CT_CustomWorkbookView_Attributes,
    childIsArray: true
  }
};

export interface CT_PivotCache {
  'cacheId'?: number;
  'r:id'?: string;
}

export const CT_PivotCache_Attributes: Attributes = {
  'cacheId': {
    type: 'int'
  },
  'r:id': {
    type: 'string'
  }
};

export interface CT_PivotCaches {
  pivotCache?: CT_PivotCache[];
}

export const CT_PivotCaches_Attributes: Attributes = {
  pivotCache: {
    type: 'child',
    childAttributes: CT_PivotCache_Attributes,
    childIsArray: true
  }
};

export type ST_SmartTagShow = 'all' | 'none' | 'noIndicator';

export interface CT_SmartTagPr {
  embed?: boolean;
  show?: ST_SmartTagShow;
}

export const CT_SmartTagPr_Attributes: Attributes = {
  embed: {
    type: 'boolean',
    defaultValue: 'false'
  },
  show: {
    type: 'string',
    defaultValue: 'all'
  }
};

export interface CT_SmartTagType {
  namespaceUri?: string;
  name?: string;
  url?: string;
}

export const CT_SmartTagType_Attributes: Attributes = {
  namespaceUri: {
    type: 'string'
  },
  name: {
    type: 'string'
  },
  url: {
    type: 'string'
  }
};

export interface CT_SmartTagTypes {
  smartTagType?: CT_SmartTagType[];
}

export const CT_SmartTagTypes_Attributes: Attributes = {
  smartTagType: {
    type: 'child',
    childAttributes: CT_SmartTagType_Attributes,
    childIsArray: true
  }
};

export type ST_TargetScreenSize =
  | '544x376'
  | '640x480'
  | '720x512'
  | '800x600'
  | '1024x768'
  | '1152x882'
  | '1152x900'
  | '1280x1024'
  | '1600x1200'
  | '1800x1440'
  | '1920x1200';

export interface CT_WebPublishing {
  css?: boolean;
  thicket?: boolean;
  longFileNames?: boolean;
  vml?: boolean;
  allowPng?: boolean;
  targetScreenSize?: ST_TargetScreenSize;
  dpi?: number;
  characterSet?: string;
}

export const CT_WebPublishing_Attributes: Attributes = {
  css: {
    type: 'boolean',
    defaultValue: 'true'
  },
  thicket: {
    type: 'boolean',
    defaultValue: 'true'
  },
  longFileNames: {
    type: 'boolean',
    defaultValue: 'true'
  },
  vml: {
    type: 'boolean',
    defaultValue: 'false'
  },
  allowPng: {
    type: 'boolean',
    defaultValue: 'false'
  },
  targetScreenSize: {
    type: 'string',
    defaultValue: '800x600'
  },
  dpi: {
    type: 'int',
    defaultValue: '96'
  },
  characterSet: {
    type: 'string'
  }
};

export interface CT_FileRecoveryPr {
  autoRecover?: boolean;
  crashSave?: boolean;
  dataExtractLoad?: boolean;
  repairLoad?: boolean;
}

export const CT_FileRecoveryPr_Attributes: Attributes = {
  autoRecover: {
    type: 'boolean',
    defaultValue: 'true'
  },
  crashSave: {
    type: 'boolean',
    defaultValue: 'false'
  },
  dataExtractLoad: {
    type: 'boolean',
    defaultValue: 'false'
  },
  repairLoad: {
    type: 'boolean',
    defaultValue: 'false'
  }
};

export interface CT_WebPublishObject {
  id?: number;
  divId?: string;
  sourceObject?: string;
  destinationFile?: string;
  title?: string;
  autoRepublish?: boolean;
}

export const CT_WebPublishObject_Attributes: Attributes = {
  id: {
    type: 'int'
  },
  divId: {
    type: 'string'
  },
  sourceObject: {
    type: 'string'
  },
  destinationFile: {
    type: 'string'
  },
  title: {
    type: 'string'
  },
  autoRepublish: {
    type: 'boolean',
    defaultValue: 'false'
  }
};

export interface CT_WebPublishObjects {
  webPublishObject?: CT_WebPublishObject[];
  count?: number;
}

export const CT_WebPublishObjects_Attributes: Attributes = {
  webPublishObject: {
    type: 'child',
    childAttributes: CT_WebPublishObject_Attributes,
    childIsArray: true
  },
  count: {
    type: 'int'
  }
};

export interface CT_Workbook {
  fileVersion?: CT_FileVersion;
  fileSharing?: CT_FileSharing;
  workbookPr?: CT_WorkbookPr;
  workbookProtection?: CT_WorkbookProtection;
  bookViews?: CT_BookViews;
  sheets?: CT_Sheets;
  functionGroups?: CT_FunctionGroups;
  externalReferences?: CT_ExternalReferences;
  definedNames?: CT_DefinedNames;
  calcPr?: CT_CalcPr;
  oleSize?: CT_OleSize;
  customWorkbookViews?: CT_CustomWorkbookViews;
  pivotCaches?: CT_PivotCaches;
  smartTagPr?: CT_SmartTagPr;
  smartTagTypes?: CT_SmartTagTypes;
  webPublishing?: CT_WebPublishing;
  fileRecoveryPr?: CT_FileRecoveryPr[];
  webPublishObjects?: CT_WebPublishObjects;
  extLst?: CT_ExtensionList;
  conformance?: ST_ConformanceClass;
}

export const CT_Workbook_Attributes: Attributes = {
  fileVersion: {
    type: 'child',
    childAttributes: CT_FileVersion_Attributes
  },
  fileSharing: {
    type: 'child',
    childAttributes: CT_FileSharing_Attributes
  },
  workbookPr: {
    type: 'child',
    childAttributes: CT_WorkbookPr_Attributes
  },
  workbookProtection: {
    type: 'child',
    childAttributes: CT_WorkbookProtection_Attributes
  },
  bookViews: {
    type: 'child',
    childAttributes: CT_BookViews_Attributes
  },
  sheets: {
    type: 'child',
    childAttributes: CT_Sheets_Attributes
  },
  functionGroups: {
    type: 'child',
    childAttributes: CT_FunctionGroups_Attributes
  },
  externalReferences: {
    type: 'child',
    childAttributes: CT_ExternalReferences_Attributes
  },
  definedNames: {
    type: 'child',
    childAttributes: CT_DefinedNames_Attributes
  },
  calcPr: {
    type: 'child',
    childAttributes: CT_CalcPr_Attributes
  },
  oleSize: {
    type: 'child',
    childAttributes: CT_OleSize_Attributes
  },
  customWorkbookViews: {
    type: 'child',
    childAttributes: CT_CustomWorkbookViews_Attributes
  },
  pivotCaches: {
    type: 'child',
    childAttributes: CT_PivotCaches_Attributes
  },
  smartTagPr: {
    type: 'child',
    childAttributes: CT_SmartTagPr_Attributes
  },
  smartTagTypes: {
    type: 'child',
    childAttributes: CT_SmartTagTypes_Attributes
  },
  webPublishing: {
    type: 'child',
    childAttributes: CT_WebPublishing_Attributes
  },
  fileRecoveryPr: {
    type: 'child',
    childAttributes: CT_FileRecoveryPr_Attributes,
    childIsArray: true
  },
  webPublishObjects: {
    type: 'child',
    childAttributes: CT_WebPublishObjects_Attributes
  },
  extLst: {
    type: 'child',
    childAttributes: CT_ExtensionList_Attributes
  },
  conformance: {
    type: 'string'
  }
};
