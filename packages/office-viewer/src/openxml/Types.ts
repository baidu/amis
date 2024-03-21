import {Attributes} from './Attributes';

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

export interface CT_OfficeArtExtensionList {}

export interface CT_AudioFile {
  extLst: CT_OfficeArtExtensionList;
  contentType: string;
}

export interface CT_VideoFile {
  extLst: CT_OfficeArtExtensionList;
  contentType: string;
}

export interface CT_QuickTimeFile {
  extLst: CT_OfficeArtExtensionList;
}

export interface CT_AudioCDTime {
  track: number;
  time: number;
}

export interface CT_AudioCD {
  st: CT_AudioCDTime;
  end: CT_AudioCDTime;
  extLst: CT_OfficeArtExtensionList;
}

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

export type ST_HexColor = ST_HexColorAuto | ST_HexColorRGB;

export type ST_ThemeColor =
  | 'dark1'
  | 'light1'
  | 'dark2'
  | 'light2'
  | 'accent1'
  | 'accent2'
  | 'accent3'
  | 'accent4'
  | 'accent5'
  | 'accent6'
  | 'hyperlink'
  | 'followedHyperlink'
  | 'none'
  | 'background1'
  | 'text1'
  | 'background2'
  | 'text2';

export type ST_UcharHexNumber = string;

export interface CT_Color {
  val: ST_HexColor;
  themeColor: ST_ThemeColor;
  themeTint: string;
  themeShade: string;
}

export interface CT_ColorScheme {
  dk1: CT_Color;
  lt1: CT_Color;
  dk2: CT_Color;
  lt2: CT_Color;
  accent1: CT_Color;
  accent2: CT_Color;
  accent3: CT_Color;
  accent4: CT_Color;
  accent5: CT_Color;
  accent6: CT_Color;
  hlink: CT_Color;
  folHlink: CT_Color;
  extLst: CT_OfficeArtExtensionList;
  name: string;
}

export interface CT_CustomColor {
  name: string;
}

export type ST_TextTypeface = string;

export interface CT_SupplementalFont {
  script: string;
  typeface: string;
}

export interface CT_CustomColorList {
  custClr: CT_CustomColor[];
}

export type ST_PitchFamily = number;

export interface CT_TextFont {
  typeface: string;
  panose: string;
  pitchFamily: number;
  charset: number;
}

export interface CT_FontCollection {
  latin: CT_TextFont;
  ea: CT_TextFont;
  cs: CT_TextFont;
  font: CT_SupplementalFont[];
  extLst: CT_OfficeArtExtensionList;
}

export type ST_PositiveFixedAngle = ST_Angle;

export interface CT_SphereCoords {
  lat: number;
  lon: number;
  rev: number;
}

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
  rot: CT_SphereCoords;
  prst: ST_PresetCameraType;
  fov: number;
  zoom: ST_PositivePercentage;
}

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
  rot: CT_SphereCoords;
  rig: ST_LightRigType;
  dir: ST_LightRigDirection;
}

export type ST_Coordinate = ST_CoordinateUnqualified | ST_UniversalMeasure;

export interface CT_Point3D {
  x: ST_Coordinate;
  y: ST_Coordinate;
  z: ST_Coordinate;
}

export interface CT_Vector3D {
  dx: ST_Coordinate;
  dy: ST_Coordinate;
  dz: ST_Coordinate;
}

export interface CT_Backdrop {
  anchor: CT_Point3D;
  norm: CT_Vector3D;
  up: CT_Vector3D;
  extLst: CT_OfficeArtExtensionList;
}

export interface CT_Scene3D {
  camera: CT_Camera;
  lightRig: CT_LightRig;
  backdrop: CT_Backdrop;
  extLst: CT_OfficeArtExtensionList;
}

export type ST_PositiveCoordinate = number;

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
  w: number;
  h: number;
  prst: ST_BevelPresetType;
}

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
  bevelT: CT_Bevel;
  bevelB: CT_Bevel;
  extrusionClr: CT_Color;
  contourClr: CT_Color;
  extLst: CT_OfficeArtExtensionList;
  z: ST_Coordinate;
  extrusionH: number;
  contourW: number;
  prstMaterial: ST_PresetMaterialType;
}

export interface CT_EffectStyleItem {
  scene3d: CT_Scene3D;
  sp3d: CT_Shape3D;
}

export interface CT_FontScheme {
  majorFont: CT_FontCollection;
  minorFont: CT_FontCollection;
  extLst: CT_OfficeArtExtensionList;
  name: string;
}

export interface CT_FillStyleList {}

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
  type: ST_LineEndType;
  w: ST_LineEndWidth;
  len: ST_LineEndLength;
}

export type ST_LineWidth = ST_Coordinate32Unqualified;

export type ST_LineCap = 'rnd' | 'sq' | 'flat';

export type ST_CompoundLine = 'sng' | 'dbl' | 'thickThin' | 'thinThick' | 'tri';

export type ST_PenAlignment = 'ctr' | 'in';

export interface CT_LineProperties {
  headEnd: CT_LineEndProperties;
  tailEnd: CT_LineEndProperties;
  extLst: CT_OfficeArtExtensionList;
  w: number;
  cap: ST_LineCap;
  cmpd: ST_CompoundLine;
  algn: ST_PenAlignment;
}

export interface CT_LineStyleList {
  ln: CT_LineProperties[];
}

export interface CT_EffectStyleList {
  effectStyle: CT_EffectStyleItem[];
}

export interface CT_BackgroundFillStyleList {}

export interface CT_StyleMatrix {
  fillStyleLst: CT_FillStyleList;
  lnStyleLst: CT_LineStyleList;
  effectStyleLst: CT_EffectStyleList;
  bgFillStyleLst: CT_BackgroundFillStyleList;
  name: string;
}

export interface CT_BaseStyles {
  clrScheme: CT_ColorScheme;
  fontScheme: CT_FontScheme;
  fmtScheme: CT_StyleMatrix;
  extLst: CT_OfficeArtExtensionList;
}

export interface CT_OfficeArtExtension {
  uri: string;
}

export type ST_CoordinateUnqualified = number;

export type ST_Coordinate32 = ST_Coordinate32Unqualified | ST_UniversalMeasure;

export type ST_Coordinate32Unqualified = number;

export type ST_PositiveCoordinate32 = ST_Coordinate32Unqualified;

export type ST_Angle = number;

export interface CT_Angle {
  val: number;
}

export type ST_FixedAngle = ST_Angle;

export interface CT_PositiveFixedAngle {
  val: number;
}

export interface CT_Percentage {
  val: string;
}

export interface CT_PositivePercentage {
  val: ST_PositivePercentage;
}

export interface CT_FixedPercentage {
  val: ST_FixedPercentage;
}

export interface CT_PositiveFixedPercentage {
  val: ST_PositiveFixedPercentage;
}

export interface CT_Ratio {
  n: number;
  d: number;
}

export interface CT_Point2D {
  x: ST_Coordinate;
  y: ST_Coordinate;
}

export interface CT_PositiveSize2D {
  cx: number;
  cy: number;
}

export interface CT_ComplementTransform {}

export interface CT_InverseTransform {}

export interface CT_GrayscaleTransform {}

export interface CT_GammaTransform {}

export interface CT_InverseGammaTransform {}

export interface CT_ScRgbColor {
  r: string;
  g: string;
  b: string;
}

export interface CT_SRgbColor {
  val: string;
}

export interface CT_HslColor {
  hue: number;
  sat: string;
  lum: string;
}

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
  val: ST_SystemColorVal;
  lastClr: string;
}

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
  val: ST_SchemeColorVal;
}

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
  val: ST_PresetColorVal;
}

export interface CT_Scale2D {
  sx: CT_Ratio;
  sy: CT_Ratio;
}

export interface CT_Transform2D {
  off: CT_Point2D;
  ext: CT_PositiveSize2D;
  rot: number;
  flipH: boolean;
  flipV: boolean;
}

export interface CT_GroupTransform2D {
  off: CT_Point2D;
  ext: CT_PositiveSize2D;
  chOff: CT_Point2D;
  chExt: CT_PositiveSize2D;
  rot: number;
  flipH: boolean;
  flipV: boolean;
}

export interface CT_RelativeRect {
  l: string;
  t: string;
  r: string;
  b: string;
}

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

export interface CT_ColorMRU {}

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
  name: string;
}

export interface CT_Hyperlink {
  snd: CT_EmbeddedWAVAudioFile;
  extLst: CT_OfficeArtExtensionList;
  r_id: string;
  invalidUrl: string;
  action: string;
  tgtFrame: string;
  tooltip: string;
  history: boolean;
  highlightClick: boolean;
  endSnd: boolean;
}

export type ST_DrawingElementId = number;

export interface CT_ConnectorLocking {
  extLst: CT_OfficeArtExtensionList;
}

export interface CT_ShapeLocking {
  extLst: CT_OfficeArtExtensionList;
  noTextEdit: boolean;
}

export interface CT_PictureLocking {
  extLst: CT_OfficeArtExtensionList;
  noCrop: boolean;
}

export interface CT_GroupLocking {
  extLst: CT_OfficeArtExtensionList;
  noGrp: boolean;
  noUngrp: boolean;
  noSelect: boolean;
  noRot: boolean;
  noChangeAspect: boolean;
  noMove: boolean;
  noResize: boolean;
}

export interface CT_GraphicalObjectFrameLocking {
  extLst: CT_OfficeArtExtensionList;
  noGrp: boolean;
  noDrilldown: boolean;
  noSelect: boolean;
  noChangeAspect: boolean;
  noMove: boolean;
  noResize: boolean;
}

export interface CT_ContentPartLocking {
  extLst: CT_OfficeArtExtensionList;
}

export interface CT_NonVisualDrawingProps {
  hlinkClick: CT_Hyperlink;
  hlinkHover: CT_Hyperlink;
  extLst: CT_OfficeArtExtensionList;
  id: number;
  name: string;
  descr: string;
  hidden: boolean;
  title: string;
}

export interface CT_NonVisualDrawingShapeProps {
  spLocks: CT_ShapeLocking;
  extLst: CT_OfficeArtExtensionList;
  txBox: boolean;
}

export interface CT_Connection {
  id: number;
  idx: number;
}

export interface CT_NonVisualConnectorProperties {
  cxnSpLocks: CT_ConnectorLocking;
  stCxn: CT_Connection;
  endCxn: CT_Connection;
  extLst: CT_OfficeArtExtensionList;
}

export interface CT_NonVisualPictureProperties {
  picLocks: CT_PictureLocking;
  extLst: CT_OfficeArtExtensionList;
  preferRelativeResize: boolean;
}

export interface CT_NonVisualGroupDrawingShapeProps {
  grpSpLocks: CT_GroupLocking;
  extLst: CT_OfficeArtExtensionList;
}

export interface CT_NonVisualGraphicFrameProperties {
  graphicFrameLocks: CT_GraphicalObjectFrameLocking;
  extLst: CT_OfficeArtExtensionList;
}

export interface CT_NonVisualContentPartProperties {
  cpLocks: CT_ContentPartLocking;
  extLst: CT_OfficeArtExtensionList;
  isComment: boolean;
}

export interface CT_GraphicalObjectData {
  uri: string;
}

export interface CT_GraphicalObject {
  graphicData: CT_GraphicalObjectData[];
}

export type ST_ChartBuildStep =
  | 'category'
  | 'ptInCategory'
  | 'series'
  | 'ptInSeries'
  | 'allPts'
  | 'gridLegend';

export type ST_DgmBuildStep = 'sp' | 'bg';

export interface CT_AnimationDgmElement {
  id: string;
  bldStep: ST_DgmBuildStep;
}

export interface CT_AnimationChartElement {
  seriesIdx: number;
  categoryIdx: number;
  bldStep: ST_ChartBuildStep;
}

export interface CT_AnimationElementChoice {
  dgm: CT_AnimationDgmElement[];
  chart: CT_AnimationChartElement[];
}

export type ST_AnimationBuildType = 'allAtOnce';

export type ST_AnimationDgmOnlyBuildType = 'one' | 'lvlOne' | 'lvlAtOnce';

export type ST_AnimationDgmBuildType =
  | ST_AnimationBuildType
  | ST_AnimationDgmOnlyBuildType;

export interface CT_AnimationDgmBuildProperties {
  bld: ST_AnimationDgmBuildType;
  rev: boolean;
}

export type ST_AnimationChartOnlyBuildType =
  | 'series'
  | 'category'
  | 'seriesEl'
  | 'categoryEl';

export type ST_AnimationChartBuildType =
  | ST_AnimationBuildType
  | ST_AnimationChartOnlyBuildType;

export interface CT_AnimationChartBuildProperties {
  bld: ST_AnimationChartBuildType;
  animBg: boolean;
}

export interface CT_AnimationGraphicalObjectBuildProperties {
  bldDgm: CT_AnimationDgmBuildProperties[];
  bldChart: CT_AnimationChartBuildProperties[];
}

export interface CT_BackgroundFormatting {}

export interface CT_WholeE2oFormatting {
  ln: CT_LineProperties;
}

export interface CT_GvmlUseShapeRectangle {}

export type ST_GeomGuideName = string;

export type ST_GeomGuideFormula = string;

export interface CT_GeomGuide {
  name: string;
  fmla: string;
}

export interface CT_GeomGuideList {
  gd: CT_GeomGuide[];
}

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
  avLst: CT_GeomGuideList;
  prst: ST_TextShapeType;
}

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
  prstTxWarp: CT_PresetTextShape;
  scene3d: CT_Scene3D;
  extLst: CT_OfficeArtExtensionList;
  rot: number;
  spcFirstLastPara: boolean;
  vertOverflow: ST_TextVertOverflowType;
  horzOverflow: ST_TextHorzOverflowType;
  vert: ST_TextVerticalType;
  wrap: ST_TextWrappingType;
  lIns: ST_Coordinate32;
  tIns: ST_Coordinate32;
  rIns: ST_Coordinate32;
  bIns: ST_Coordinate32;
  numCol: number;
  spcCol: number;
  rtlCol: boolean;
  fromWordArt: boolean;
  anchor: ST_TextAnchoringType;
  anchorCtr: boolean;
  forceAA: boolean;
  upright: boolean;
  compatLnSpc: boolean;
}

export type ST_TextSpacingPercentOrPercentString = string;

export interface CT_TextSpacingPercent {
  val: string;
}

export type ST_TextSpacingPoint = number;

export interface CT_TextSpacingPoint {
  val: number;
}

export interface CT_TextSpacing {
  spcPct: CT_TextSpacingPercent[];
  spcPts: CT_TextSpacingPoint[];
}

export type ST_TextTabAlignType = 'l' | 'ctr' | 'r' | 'dec';

export interface CT_TextTabStop {
  pos: ST_Coordinate32;
  algn: ST_TextTabAlignType;
}

export interface CT_TextTabStopList {
  tab: CT_TextTabStop[];
}

export interface CT_Boolean {
  val: ST_OnOff;
}

export type ST_TextFontSize = number;

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
  ln: CT_LineProperties;
  highlight: CT_Color;
  latin: CT_TextFont;
  ea: CT_TextFont;
  cs: CT_TextFont;
  sym: CT_TextFont;
  hlinkClick: CT_Hyperlink;
  hlinkMouseOver: CT_Hyperlink;
  rtl: CT_Boolean[];
  extLst: CT_OfficeArtExtensionList;
  kumimoji: boolean;
  lang: string;
  altLang: string;
  sz: number;
  b: boolean;
  i: boolean;
  u: ST_TextUnderlineType;
  strike: ST_TextStrikeType;
  kern: number;
  cap: ST_TextCapsType;
  spc: ST_TextPoint;
  normalizeH: boolean;
  baseline: string;
  noProof: boolean;
  dirty: boolean;
  err: boolean;
  smtClean: boolean;
  smtId: number;
  bmk: string;
}

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
  lnSpc: CT_TextSpacing;
  spcBef: CT_TextSpacing;
  spcAft: CT_TextSpacing;
  tabLst: CT_TextTabStopList;
  defRPr: CT_TextCharacterProperties;
  extLst: CT_OfficeArtExtensionList;
  marL: number;
  marR: number;
  lvl: number;
  indent: number;
  algn: ST_TextAlignType;
  defTabSz: ST_Coordinate32;
  rtl: boolean;
  eaLnBrk: boolean;
  fontAlgn: ST_TextFontAlignType;
  latinLnBrk: boolean;
  hangingPunct: boolean;
}

export interface CT_TextListStyle {
  defPPr: CT_TextParagraphProperties;
  lvl1pPr: CT_TextParagraphProperties;
  lvl2pPr: CT_TextParagraphProperties;
  lvl3pPr: CT_TextParagraphProperties;
  lvl4pPr: CT_TextParagraphProperties;
  lvl5pPr: CT_TextParagraphProperties;
  lvl6pPr: CT_TextParagraphProperties;
  lvl7pPr: CT_TextParagraphProperties;
  lvl8pPr: CT_TextParagraphProperties;
  lvl9pPr: CT_TextParagraphProperties;
  extLst: CT_OfficeArtExtensionList;
}

export interface CT_TextParagraph {
  pPr: CT_TextParagraphProperties;
  endParaRPr: CT_TextCharacterProperties;
}

export interface CT_TextBody {
  bodyPr: CT_TextBodyProperties;
  lstStyle: CT_TextListStyle;
  p: CT_TextParagraph[];
}

export interface CT_GvmlTextShape {
  txBody: CT_TextBody;
  extLst: CT_OfficeArtExtensionList;
}

export interface CT_GvmlShapeNonVisual {
  cNvPr: CT_NonVisualDrawingProps;
  cNvSpPr: CT_NonVisualDrawingShapeProps;
}

export interface CT_ShapeProperties {
  xfrm: CT_Transform2D;
  ln: CT_LineProperties;
  scene3d: CT_Scene3D;
  sp3d: CT_Shape3D;
  extLst: CT_OfficeArtExtensionList;
  bwMode: ST_BlackWhiteMode;
}

export interface CT_StyleMatrixReference {
  idx: number;
}

export interface CT_FontReference {
  idx: ST_FontCollectionIndex;
}

export interface CT_ShapeStyle {
  lnRef: CT_StyleMatrixReference;
  fillRef: CT_StyleMatrixReference;
  effectRef: CT_StyleMatrixReference;
  fontRef: CT_FontReference;
}

export interface CT_GvmlShape {
  nvSpPr: CT_GvmlShapeNonVisual;
  spPr: CT_ShapeProperties;
  txSp: CT_GvmlTextShape;
  style: CT_ShapeStyle;
  extLst: CT_OfficeArtExtensionList;
}

export interface CT_GvmlConnectorNonVisual {
  cNvPr: CT_NonVisualDrawingProps;
  cNvCxnSpPr: CT_NonVisualConnectorProperties;
}

export interface CT_GvmlConnector {
  nvCxnSpPr: CT_GvmlConnectorNonVisual;
  spPr: CT_ShapeProperties;
  style: CT_ShapeStyle;
  extLst: CT_OfficeArtExtensionList;
}

export interface CT_GvmlPictureNonVisual {
  cNvPr: CT_NonVisualDrawingProps;
  cNvPicPr: CT_NonVisualPictureProperties;
}

export type ST_BlipCompression =
  | 'email'
  | 'screen'
  | 'print'
  | 'hqprint'
  | 'none';

export interface CT_Blip {
  extLst: CT_OfficeArtExtensionList;
  cstate: ST_BlipCompression;
}

export interface CT_BlipFillProperties {
  blip: CT_Blip;
  srcRect: CT_RelativeRect;
  dpi: number;
  rotWithShape: boolean;
}

export interface CT_GvmlPicture {
  nvPicPr: CT_GvmlPictureNonVisual;
  blipFill: CT_BlipFillProperties;
  spPr: CT_ShapeProperties;
  style: CT_ShapeStyle;
  extLst: CT_OfficeArtExtensionList;
}

export interface CT_GvmlGraphicFrameNonVisual {
  cNvPr: CT_NonVisualDrawingProps;
  cNvGraphicFramePr: CT_NonVisualGraphicFrameProperties;
}

export interface CT_GvmlGraphicalObjectFrame {
  nvGraphicFramePr: CT_GvmlGraphicFrameNonVisual;
  xfrm: CT_Transform2D;
  extLst: CT_OfficeArtExtensionList;
}

export interface CT_GvmlGroupShapeNonVisual {
  cNvPr: CT_NonVisualDrawingProps;
  cNvGrpSpPr: CT_NonVisualGroupDrawingShapeProps;
}

export interface CT_GroupShapeProperties {
  xfrm: CT_GroupTransform2D;
  scene3d: CT_Scene3D;
  extLst: CT_OfficeArtExtensionList;
  bwMode: ST_BlackWhiteMode;
}

export interface CT_GvmlGroupShape {
  nvGrpSpPr: CT_GvmlGroupShapeNonVisual;
  grpSpPr: CT_GroupShapeProperties;
  extLst: CT_OfficeArtExtensionList;
}

export interface CT_FlatText {
  z: ST_Coordinate;
}

export interface CT_AlphaBiLevelEffect {
  thresh: ST_PositiveFixedPercentage;
}

export interface CT_AlphaCeilingEffect {}

export interface CT_AlphaFloorEffect {}

export interface CT_AlphaInverseEffect {}

export interface CT_AlphaModulateFixedEffect {
  amt: ST_PositivePercentage;
}

export interface CT_AlphaOutsetEffect {
  rad: ST_Coordinate;
}

export interface CT_AlphaReplaceEffect {
  a: ST_PositiveFixedPercentage;
}

export interface CT_BiLevelEffect {
  thresh: ST_PositiveFixedPercentage;
}

export interface CT_BlurEffect {
  rad: number;
  grow: boolean;
}

export interface CT_ColorChangeEffect {
  clrFrom: CT_Color;
  clrTo: CT_Color;
  useA: boolean;
}

export interface CT_ColorReplaceEffect {}

export interface CT_DuotoneEffect {}

export interface CT_GlowEffect {
  rad: number;
}

export interface CT_GrayscaleEffect {}

export interface CT_HSLEffect {
  hue: number;
  sat: ST_FixedPercentage;
  lum: ST_FixedPercentage;
}

export interface CT_InnerShadowEffect {
  blurRad: number;
  dist: number;
  dir: number;
}

export interface CT_LuminanceEffect {
  bright: ST_FixedPercentage;
  contrast: ST_FixedPercentage;
}

export interface CT_OuterShadowEffect {
  blurRad: number;
  dist: number;
  dir: number;
  sx: string;
  sy: string;
  kx: number;
  ky: number;
  algn: ST_RectAlignment;
  rotWithShape: boolean;
}

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
  prst: ST_PresetShadowVal;
  dist: number;
  dir: number;
}

export interface CT_ReflectionEffect {
  blurRad: number;
  stA: ST_PositiveFixedPercentage;
  stPos: ST_PositiveFixedPercentage;
  endA: ST_PositiveFixedPercentage;
  endPos: ST_PositiveFixedPercentage;
  dist: number;
  dir: number;
  fadeDir: number;
  sx: string;
  sy: string;
  kx: number;
  ky: number;
  algn: ST_RectAlignment;
  rotWithShape: boolean;
}

export interface CT_RelativeOffsetEffect {
  tx: string;
  ty: string;
}

export interface CT_SoftEdgesEffect {
  rad: number;
}

export interface CT_TintEffect {
  hue: number;
  amt: ST_FixedPercentage;
}

export interface CT_TransformEffect {
  sx: string;
  sy: string;
  kx: number;
  ky: number;
  tx: ST_Coordinate;
  ty: ST_Coordinate;
}

export interface CT_NoFillProperties {}

export interface CT_SolidColorFillProperties {}

export interface CT_LinearShadeProperties {
  ang: number;
  scaled: boolean;
}

export type ST_PathShadeType = 'shape' | 'circle' | 'rect';

export interface CT_PathShadeProperties {
  fillToRect: CT_RelativeRect;
  path: ST_PathShadeType;
}

export type ST_TileFlipMode = 'none' | 'x' | 'y' | 'xy';

export interface CT_GradientStop {
  pos: ST_PositiveFixedPercentage;
}

export interface CT_GradientStopList {
  gs: CT_GradientStop[];
}

export interface CT_GradientFillProperties {
  gsLst: CT_GradientStopList;
  tileRect: CT_RelativeRect;
  flip: ST_TileFlipMode;
  rotWithShape: boolean;
}

export interface CT_TileInfoProperties {
  tx: ST_Coordinate;
  ty: ST_Coordinate;
  sx: string;
  sy: string;
  flip: ST_TileFlipMode;
  algn: ST_RectAlignment;
}

export interface CT_StretchInfoProperties {
  fillRect: CT_RelativeRect;
}

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
  fgClr: CT_Color;
  bgClr: CT_Color;
  prst: ST_PresetPatternVal;
}

export interface CT_GroupFillProperties {}

export interface CT_FillProperties {}

export interface CT_FillEffect {}

export type ST_BlendMode = 'over' | 'mult' | 'screen' | 'darken' | 'lighten';

export interface CT_FillOverlayEffect {
  blend: ST_BlendMode;
}

export interface CT_EffectReference {
  ref: string;
}

export type ST_EffectContainerType = 'sib' | 'tree';

export interface CT_EffectContainer {
  type: ST_EffectContainerType;
  name: string;
}

export interface CT_AlphaModulateEffect {
  cont: CT_EffectContainer;
}

export interface CT_BlendEffect {
  cont: CT_EffectContainer;
  blend: ST_BlendMode;
}

export interface CT_EffectList {
  blur: CT_BlurEffect;
  fillOverlay: CT_FillOverlayEffect;
  glow: CT_GlowEffect;
  innerShdw: CT_InnerShadowEffect;
  outerShdw: CT_OuterShadowEffect;
  prstShdw: CT_PresetShadowEffect;
  reflection: CT_ReflectionEffect;
  softEdge: CT_SoftEdgesEffect;
}

export interface CT_EffectProperties {}

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

export type ST_AdjCoordinate = ST_Coordinate | ST_GeomGuideName;

export type ST_AdjAngle = ST_Angle | ST_GeomGuideName;

export interface CT_AdjPoint2D {
  x: ST_AdjCoordinate;
  y: ST_AdjCoordinate;
}

export interface CT_GeomRect {
  l: ST_AdjCoordinate;
  t: ST_AdjCoordinate;
  r: ST_AdjCoordinate;
  b: ST_AdjCoordinate;
}

export interface CT_XYAdjustHandle {
  pos: CT_AdjPoint2D;
  gdRefX: string;
  minX: ST_AdjCoordinate;
  maxX: ST_AdjCoordinate;
  gdRefY: string;
  minY: ST_AdjCoordinate;
  maxY: ST_AdjCoordinate;
}

export interface CT_PolarAdjustHandle {
  pos: CT_AdjPoint2D;
  gdRefR: string;
  minR: ST_AdjCoordinate;
  maxR: ST_AdjCoordinate;
  gdRefAng: string;
  minAng: ST_AdjAngle;
  maxAng: ST_AdjAngle;
}

export interface CT_ConnectionSite {
  pos: CT_AdjPoint2D;
  ang: ST_AdjAngle;
}

export interface CT_AdjustHandleList {
  ahXY: CT_XYAdjustHandle;
  ahPolar: CT_PolarAdjustHandle;
}

export interface CT_ConnectionSiteList {
  cxn: CT_ConnectionSite[];
}

export interface CT_Path2DMoveTo {
  pt: CT_AdjPoint2D;
}

export interface CT_Path2DLineTo {
  pt: CT_AdjPoint2D;
}

export interface CT_Path2DArcTo {
  wR: ST_AdjCoordinate;
  hR: ST_AdjCoordinate;
  stAng: ST_AdjAngle;
  swAng: ST_AdjAngle;
}

export interface CT_Path2DQuadBezierTo {
  pt: CT_AdjPoint2D[];
}

export interface CT_Path2DCubicBezierTo {
  pt: CT_AdjPoint2D[];
}

export interface CT_Path2DClose {}

export type ST_PathFillMode =
  | 'none'
  | 'norm'
  | 'lighten'
  | 'lightenLess'
  | 'darken'
  | 'darkenLess';

export interface CT_Path2D {
  close: CT_Path2DClose;
  moveTo: CT_Path2DMoveTo;
  lnTo: CT_Path2DLineTo;
  arcTo: CT_Path2DArcTo;
  quadBezTo: CT_Path2DQuadBezierTo;
  cubicBezTo: CT_Path2DCubicBezierTo;
  w: number;
  h: number;
  fill: ST_PathFillMode;
  stroke: boolean;
  extrusionOk: boolean;
}

export interface CT_Path2DList {
  path: CT_Path2D[];
}

export interface CT_PresetGeometry2D {
  avLst: CT_GeomGuideList;
  prst: ST_ShapeType;
}

export interface CT_CustomGeometry2D {
  avLst: CT_GeomGuideList;
  gdLst: CT_GeomGuideList;
  ahLst: CT_AdjustHandleList;
  cxnLst: CT_ConnectionSiteList;
  rect: CT_GeomRect;
  pathLst: CT_Path2DList;
}

export interface CT_LineJoinBevel {}

export interface CT_LineJoinRound {}

export interface CT_LineJoinMiterProperties {
  lim: ST_PositivePercentage;
}

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
  val: ST_PresetLineDashVal;
}

export interface CT_DashStop {
  d: ST_PositivePercentage;
  sp: ST_PositivePercentage;
}

export interface CT_DashStopList {
  ds: CT_DashStop[];
}

export type ST_ShapeID = string;

export interface CT_DefaultShapeDefinition {
  spPr: CT_ShapeProperties;
  bodyPr: CT_TextBodyProperties;
  lstStyle: CT_TextListStyle;
  style: CT_ShapeStyle;
  extLst: CT_OfficeArtExtensionList;
}

export interface CT_ObjectStyleDefaults {
  spDef: CT_DefaultShapeDefinition;
  lnDef: CT_DefaultShapeDefinition;
  txDef: CT_DefaultShapeDefinition;
  extLst: CT_OfficeArtExtensionList;
}

export interface CT_EmptyElement {}

export interface CT_ColorMapping {
  extLst: CT_OfficeArtExtensionList;
  bg1: ST_ColorSchemeIndex;
  tx1: ST_ColorSchemeIndex;
  bg2: ST_ColorSchemeIndex;
  tx2: ST_ColorSchemeIndex;
  accent1: ST_ColorSchemeIndex;
  accent2: ST_ColorSchemeIndex;
  accent3: ST_ColorSchemeIndex;
  accent4: ST_ColorSchemeIndex;
  accent5: ST_ColorSchemeIndex;
  accent6: ST_ColorSchemeIndex;
  hlink: ST_ColorSchemeIndex;
  folHlink: ST_ColorSchemeIndex;
}

export interface CT_ColorMappingOverride {}

export interface CT_ColorSchemeAndMapping {
  clrScheme: CT_ColorScheme;
  clrMap: CT_ColorMapping;
}

export interface CT_ColorSchemeList {
  extraClrScheme: CT_ColorSchemeAndMapping[];
}

export interface CT_OfficeStyleSheet {
  themeElements: CT_BaseStyles;
  objectDefaults: CT_ObjectStyleDefaults;
  extraClrSchemeLst: CT_ColorSchemeList;
  custClrLst: CT_CustomColorList;
  extLst: CT_OfficeArtExtensionList;
  name: string;
}

export interface CT_BaseStylesOverride {
  clrScheme: CT_ColorScheme;
  fontScheme: CT_FontScheme;
  fmtScheme: CT_StyleMatrix;
}

export interface CT_ClipboardStyleSheet {
  themeElements: CT_BaseStyles;
  clrMap: CT_ColorMapping;
}

export interface CT_Cell3D {
  bevel: CT_Bevel;
  lightRig: CT_LightRig;
  extLst: CT_OfficeArtExtensionList;
  prstMaterial: ST_PresetMaterialType;
}

export interface CT_String {
  val: string;
}

export interface CT_Headers {
  header: CT_String[];
}

export interface CT_TableCellProperties {
  lnL: CT_LineProperties;
  lnR: CT_LineProperties;
  lnT: CT_LineProperties;
  lnB: CT_LineProperties;
  lnTlToBr: CT_LineProperties;
  lnBlToTr: CT_LineProperties;
  cell3D: CT_Cell3D;
  headers: CT_Headers[];
  extLst: CT_OfficeArtExtensionList;
  marL: ST_Coordinate32;
  marR: ST_Coordinate32;
  marT: ST_Coordinate32;
  marB: ST_Coordinate32;
  vert: ST_TextVerticalType;
  anchor: ST_TextAnchoringType;
  anchorCtr: boolean;
  horzOverflow: ST_TextHorzOverflowType;
}

export interface CT_TableCol {
  extLst: CT_OfficeArtExtensionList;
  w: ST_Coordinate;
}

export interface CT_TableGrid {
  gridCol: CT_TableCol[];
}

export interface CT_TableCell {
  txBody: CT_TextBody;
  tcPr: CT_TableCellProperties;
  extLst: CT_OfficeArtExtensionList;
  rowSpan: number;
  gridSpan: number;
  hMerge: boolean;
  vMerge: boolean;
  id: string;
}

export interface CT_TableRow {
  tc: CT_TableCell[];
  extLst: CT_OfficeArtExtensionList;
  h: ST_Coordinate;
}

export interface CT_TableProperties {
  extLst: CT_OfficeArtExtensionList;
  rtl: boolean;
  firstRow: boolean;
  firstCol: boolean;
  lastRow: boolean;
  lastCol: boolean;
  bandRow: boolean;
  bandCol: boolean;
}

export interface CT_Table {
  tblPr: CT_TableProperties;
  tblGrid: CT_TableGrid;
  tr: CT_TableRow[];
}

export interface CT_ThemeableLineStyle {
  ln: CT_LineProperties;
  lnRef: CT_StyleMatrixReference;
}

export type ST_OnOffStyleType = 'on' | 'off' | 'def';

export interface CT_TableStyleTextStyle {
  extLst: CT_OfficeArtExtensionList;
  b: ST_OnOffStyleType;
  i: ST_OnOffStyleType;
}

export interface CT_TableCellBorderStyle {
  left: CT_ThemeableLineStyle;
  right: CT_ThemeableLineStyle;
  top: CT_ThemeableLineStyle;
  bottom: CT_ThemeableLineStyle;
  insideH: CT_ThemeableLineStyle;
  insideV: CT_ThemeableLineStyle;
  tl2br: CT_ThemeableLineStyle;
  tr2bl: CT_ThemeableLineStyle;
  extLst: CT_OfficeArtExtensionList;
}

export interface CT_TableBackgroundStyle {}

export interface CT_TableStyleCellStyle {
  tcBdr: CT_TableCellBorderStyle;
  cell3D: CT_Cell3D;
}

export interface CT_TablePartStyle {
  tcTxStyle: CT_TableStyleTextStyle;
  tcStyle: CT_TableStyleCellStyle;
}

export interface CT_TableStyle {
  tblBg: CT_TableBackgroundStyle;
  wholeTbl: CT_TablePartStyle;
  band1H: CT_TablePartStyle;
  band2H: CT_TablePartStyle;
  band1V: CT_TablePartStyle;
  band2V: CT_TablePartStyle;
  lastCol: CT_TablePartStyle;
  firstCol: CT_TablePartStyle;
  lastRow: CT_TablePartStyle;
  seCell: CT_TablePartStyle;
  swCell: CT_TablePartStyle;
  firstRow: CT_TablePartStyle;
  neCell: CT_TablePartStyle;
  nwCell: CT_TablePartStyle;
  extLst: CT_OfficeArtExtensionList;
  styleId: string;
  styleName: string;
}

export interface CT_TableStyleList {
  tblStyle: CT_TableStyle[];
  def: string;
}

export type ST_TextFontScalePercentOrPercentString = string;

export interface CT_TextNormalAutofit {
  fontScale: string;
  lnSpcReduction: string;
}

export interface CT_TextShapeAutofit {}

export interface CT_TextNoAutofit {}

export type ST_TextBulletStartAtNum = number;

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

export interface CT_TextBulletColorFollowText {}

export type ST_TextBulletSize = string;

export type ST_TextBulletSizePercent = string;

export interface CT_TextBulletSizeFollowText {}

export interface CT_TextBulletSizePercent {
  val: string;
}

export interface CT_TextBulletSizePoint {
  val: number;
}

export interface CT_TextBulletTypefaceFollowText {}

export interface CT_TextAutonumberBullet {
  type: ST_TextAutonumberScheme;
  startAt: number;
}

export interface CT_TextCharBullet {
  char: string;
}

export interface CT_TextBlipBullet {
  blip: CT_Blip;
}

export interface CT_TextNoBullet {}

export type ST_TextPointUnqualified = number;

export interface CT_TextUnderlineLineFollowText {}

export interface CT_TextUnderlineFillFollowText {}

export interface CT_TextUnderlineFillGroupWrapper {}

export interface CT_TextLineBreak {
  rPr: CT_TextCharacterProperties;
}

export interface CT_TextField {
  rPr: CT_TextCharacterProperties;
  pPr: CT_TextParagraphProperties;
  t: string;
  id: string;
  type: string;
}

export interface CT_RegularTextRun {
  rPr: CT_TextCharacterProperties;
  t: string;
}

export interface CT_Empty {}

export interface CT_OnOff {
  val: ST_OnOff;
}

export type ST_LongHexNumber = string;

export interface CT_LongHexNumber {
  val: string;
}

export type ST_ShortHexNumber = string;

export interface CT_Charset {
  characterSet: string;
}

export type ST_DecimalNumberOrPercent = string;

export type ST_DecimalNumber = number;

export interface CT_DecimalNumber {
  val: number;
}

export interface CT_UnsignedDecimalNumber {
  val: number;
}

export interface CT_DecimalNumberOrPrecent {
  val: string;
}

export interface CT_TwipsMeasure {
  val: ST_TwipsMeasure;
}

export type ST_SignedTwipsMeasure = number | ST_UniversalMeasure;

export interface CT_SignedTwipsMeasure {
  val: ST_SignedTwipsMeasure;
}

export type ST_PixelsMeasure = ST_UnsignedDecimalNumber;

export interface CT_PixelsMeasure {
  val: number;
}

export type ST_HpsMeasure =
  | ST_UnsignedDecimalNumber
  | ST_PositiveUniversalMeasure;

export interface CT_HpsMeasure {
  val: ST_HpsMeasure;
}

export type ST_SignedHpsMeasure = number | ST_UniversalMeasure;

export interface CT_SignedHpsMeasure {
  val: ST_SignedHpsMeasure;
}

export type ST_DateTime = string;

export type ST_MacroName = string;

export interface CT_MacroName {
  val: string;
}

export type ST_EighthPointMeasure = ST_UnsignedDecimalNumber;

export type ST_PointMeasure = ST_UnsignedDecimalNumber;

export type ST_TextScale = string;

export type ST_TextScalePercent = string;

export interface CT_TextScale {
  val: string;
}

export type ST_HighlightColor =
  | 'black'
  | 'blue'
  | 'cyan'
  | 'green'
  | 'magenta'
  | 'red'
  | 'yellow'
  | 'white'
  | 'darkBlue'
  | 'darkCyan'
  | 'darkGreen'
  | 'darkMagenta'
  | 'darkRed'
  | 'darkYellow'
  | 'darkGray'
  | 'lightGray'
  | 'none';

export interface CT_Highlight {
  val: ST_HighlightColor;
}

export type ST_HexColorAuto = 'auto';

export interface CT_Lang {
  val: string;
}

export interface CT_Guid {
  val: string;
}

export type ST_Underline =
  | 'single'
  | 'words'
  | 'double'
  | 'thick'
  | 'dotted'
  | 'dottedHeavy'
  | 'dash'
  | 'dashedHeavy'
  | 'dashLong'
  | 'dashLongHeavy'
  | 'dotDash'
  | 'dashDotHeavy'
  | 'dotDotDash'
  | 'dashDotDotHeavy'
  | 'wave'
  | 'wavyHeavy'
  | 'wavyDouble'
  | 'none';

export interface CT_Underline {
  val: ST_Underline;
  color: ST_HexColor;
  themeColor: ST_ThemeColor;
  themeTint: string;
  themeShade: string;
}

export type ST_TextEffect =
  | 'blinkBackground'
  | 'lights'
  | 'antsBlack'
  | 'antsRed'
  | 'shimmer'
  | 'sparkle'
  | 'none';

export interface CT_TextEffect {
  val: ST_TextEffect;
}

export type ST_Border =
  | 'nil'
  | 'none'
  | 'single'
  | 'thick'
  | 'double'
  | 'dotted'
  | 'dashed'
  | 'dotDash'
  | 'dotDotDash'
  | 'triple'
  | 'thinThickSmallGap'
  | 'thickThinSmallGap'
  | 'thinThickThinSmallGap'
  | 'thinThickMediumGap'
  | 'thickThinMediumGap'
  | 'thinThickThinMediumGap'
  | 'thinThickLargeGap'
  | 'thickThinLargeGap'
  | 'thinThickThinLargeGap'
  | 'wave'
  | 'doubleWave'
  | 'dashSmallGap'
  | 'dashDotStroked'
  | 'threeDEmboss'
  | 'threeDEngrave'
  | 'outset'
  | 'inset'
  | 'apples'
  | 'archedScallops'
  | 'babyPacifier'
  | 'babyRattle'
  | 'balloons3Colors'
  | 'balloonsHotAir'
  | 'basicBlackDashes'
  | 'basicBlackDots'
  | 'basicBlackSquares'
  | 'basicThinLines'
  | 'basicWhiteDashes'
  | 'basicWhiteDots'
  | 'basicWhiteSquares'
  | 'basicWideInline'
  | 'basicWideMidline'
  | 'basicWideOutline'
  | 'bats'
  | 'birds'
  | 'birdsFlight'
  | 'cabins'
  | 'cakeSlice'
  | 'candyCorn'
  | 'celticKnotwork'
  | 'certificateBanner'
  | 'chainLink'
  | 'champagneBottle'
  | 'checkedBarBlack'
  | 'checkedBarColor'
  | 'checkered'
  | 'christmasTree'
  | 'circlesLines'
  | 'circlesRectangles'
  | 'classicalWave'
  | 'clocks'
  | 'compass'
  | 'confetti'
  | 'confettiGrays'
  | 'confettiOutline'
  | 'confettiStreamers'
  | 'confettiWhite'
  | 'cornerTriangles'
  | 'couponCutoutDashes'
  | 'couponCutoutDots'
  | 'crazyMaze'
  | 'creaturesButterfly'
  | 'creaturesFish'
  | 'creaturesInsects'
  | 'creaturesLadyBug'
  | 'crossStitch'
  | 'cup'
  | 'decoArch'
  | 'decoArchColor'
  | 'decoBlocks'
  | 'diamondsGray'
  | 'doubleD'
  | 'doubleDiamonds'
  | 'earth1'
  | 'earth2'
  | 'earth3'
  | 'eclipsingSquares1'
  | 'eclipsingSquares2'
  | 'eggsBlack'
  | 'fans'
  | 'film'
  | 'firecrackers'
  | 'flowersBlockPrint'
  | 'flowersDaisies'
  | 'flowersModern1'
  | 'flowersModern2'
  | 'flowersPansy'
  | 'flowersRedRose'
  | 'flowersRoses'
  | 'flowersTeacup'
  | 'flowersTiny'
  | 'gems'
  | 'gingerbreadMan'
  | 'gradient'
  | 'handmade1'
  | 'handmade2'
  | 'heartBalloon'
  | 'heartGray'
  | 'hearts'
  | 'heebieJeebies'
  | 'holly'
  | 'houseFunky'
  | 'hypnotic'
  | 'iceCreamCones'
  | 'lightBulb'
  | 'lightning1'
  | 'lightning2'
  | 'mapPins'
  | 'mapleLeaf'
  | 'mapleMuffins'
  | 'marquee'
  | 'marqueeToothed'
  | 'moons'
  | 'mosaic'
  | 'musicNotes'
  | 'northwest'
  | 'ovals'
  | 'packages'
  | 'palmsBlack'
  | 'palmsColor'
  | 'paperClips'
  | 'papyrus'
  | 'partyFavor'
  | 'partyGlass'
  | 'pencils'
  | 'people'
  | 'peopleWaving'
  | 'peopleHats'
  | 'poinsettias'
  | 'postageStamp'
  | 'pumpkin1'
  | 'pushPinNote2'
  | 'pushPinNote1'
  | 'pyramids'
  | 'pyramidsAbove'
  | 'quadrants'
  | 'rings'
  | 'safari'
  | 'sawtooth'
  | 'sawtoothGray'
  | 'scaredCat'
  | 'seattle'
  | 'shadowedSquares'
  | 'sharksTeeth'
  | 'shorebirdTracks'
  | 'skyrocket'
  | 'snowflakeFancy'
  | 'snowflakes'
  | 'sombrero'
  | 'southwest'
  | 'stars'
  | 'starsTop'
  | 'stars3d'
  | 'starsBlack'
  | 'starsShadowed'
  | 'sun'
  | 'swirligig'
  | 'tornPaper'
  | 'tornPaperBlack'
  | 'trees'
  | 'triangleParty'
  | 'triangles'
  | 'triangle1'
  | 'triangle2'
  | 'triangleCircle1'
  | 'triangleCircle2'
  | 'shapes1'
  | 'shapes2'
  | 'twistedLines1'
  | 'twistedLines2'
  | 'vine'
  | 'waveline'
  | 'weavingAngles'
  | 'weavingBraid'
  | 'weavingRibbon'
  | 'weavingStrips'
  | 'whiteFlowers'
  | 'woodwork'
  | 'xIllusions'
  | 'zanyTriangles'
  | 'zigZag'
  | 'zigZagStitch'
  | 'custom';

export interface CT_Border {
  val: ST_Border;
  color: ST_HexColor;
  themeColor: ST_ThemeColor;
  themeTint: string;
  themeShade: string;
  sz: number;
  space: number;
  shadow: ST_OnOff;
  frame: ST_OnOff;
}

export type ST_Shd =
  | 'nil'
  | 'clear'
  | 'solid'
  | 'horzStripe'
  | 'vertStripe'
  | 'reverseDiagStripe'
  | 'diagStripe'
  | 'horzCross'
  | 'diagCross'
  | 'thinHorzStripe'
  | 'thinVertStripe'
  | 'thinReverseDiagStripe'
  | 'thinDiagStripe'
  | 'thinHorzCross'
  | 'thinDiagCross'
  | 'pct5'
  | 'pct10'
  | 'pct12'
  | 'pct15'
  | 'pct20'
  | 'pct25'
  | 'pct30'
  | 'pct35'
  | 'pct37'
  | 'pct40'
  | 'pct45'
  | 'pct50'
  | 'pct55'
  | 'pct60'
  | 'pct62'
  | 'pct65'
  | 'pct70'
  | 'pct75'
  | 'pct80'
  | 'pct85'
  | 'pct87'
  | 'pct90'
  | 'pct95';

export interface CT_Shd {
  val: ST_Shd;
  color: ST_HexColor;
  themeColor: ST_ThemeColor;
  themeTint: string;
  themeShade: string;
  fill: ST_HexColor;
  themeFill: ST_ThemeColor;
  themeFillTint: string;
  themeFillShade: string;
}

export interface CT_VerticalAlignRun {
  val: ST_VerticalAlignRun;
}

export interface CT_FitText {
  val: ST_TwipsMeasure;
  id: number;
}

export type ST_Em = 'none' | 'dot' | 'comma' | 'circle' | 'underDot';

export interface CT_Em {
  val: ST_Em;
}

export interface CT_Language {
  val: string;
  eastAsia: string;
  bidi: string;
}

export type ST_CombineBrackets =
  | 'none'
  | 'round'
  | 'square'
  | 'angle'
  | 'curly';

export interface CT_EastAsianLayout {
  id: number;
  combine: ST_OnOff;
  combineBrackets: ST_CombineBrackets;
  vert: ST_OnOff;
  vertCompress: ST_OnOff;
}

export type ST_HeightRule = 'auto' | 'exact' | 'atLeast';

export type ST_Wrap =
  | 'auto'
  | 'notBeside'
  | 'around'
  | 'tight'
  | 'through'
  | 'none';

export type ST_VAnchor = 'text' | 'margin' | 'page';

export type ST_HAnchor = 'text' | 'margin' | 'page';

export type ST_DropCap = 'none' | 'drop' | 'margin';

export interface CT_FramePr {
  dropCap: ST_DropCap;
  lines: number;
  w: ST_TwipsMeasure;
  h: ST_TwipsMeasure;
  vSpace: ST_TwipsMeasure;
  hSpace: ST_TwipsMeasure;
  wrap: ST_Wrap;
  hAnchor: ST_HAnchor;
  vAnchor: ST_VAnchor;
  x: ST_SignedTwipsMeasure;
  xAlign: ST_XAlign;
  y: ST_SignedTwipsMeasure;
  yAlign: ST_YAlign;
  hRule: ST_HeightRule;
  anchorLock: ST_OnOff;
}

export type ST_TabJc =
  | 'clear'
  | 'start'
  | 'center'
  | 'end'
  | 'decimal'
  | 'bar'
  | 'num';

export type ST_TabTlc =
  | 'none'
  | 'dot'
  | 'hyphen'
  | 'underscore'
  | 'heavy'
  | 'middleDot';

export interface CT_TabStop {
  val: ST_TabJc;
  leader: ST_TabTlc;
  pos: ST_SignedTwipsMeasure;
}

export type ST_LineSpacingRule = 'auto' | 'exact' | 'atLeast';

export interface CT_Spacing {
  before: ST_TwipsMeasure;
  beforeLines: number;
  beforeAutospacing: ST_OnOff;
  after: ST_TwipsMeasure;
  afterLines: number;
  afterAutospacing: ST_OnOff;
  line: ST_SignedTwipsMeasure;
  lineRule: ST_LineSpacingRule;
}

export interface CT_Ind {
  start: ST_SignedTwipsMeasure;
  startChars: number;
  end: ST_SignedTwipsMeasure;
  endChars: number;
  hanging: ST_TwipsMeasure;
  hangingChars: number;
  firstLine: ST_TwipsMeasure;
  firstLineChars: number;
}

export type ST_Jc =
  | 'start'
  | 'center'
  | 'end'
  | 'both'
  | 'mediumKashida'
  | 'distribute'
  | 'numTab'
  | 'highKashida'
  | 'lowKashida'
  | 'thaiDistribute';

export type ST_JcTable = 'center' | 'end' | 'start';

export interface CT_Jc {
  val: ST_Jc;
}

export interface CT_JcTable {
  val: ST_JcTable;
}

export type ST_View =
  | 'none'
  | 'print'
  | 'outline'
  | 'masterPages'
  | 'normal'
  | 'web';

export interface CT_View {
  val: ST_View;
}

export type ST_Zoom = 'none' | 'fullPage' | 'bestFit' | 'textFit';

export interface CT_Zoom {
  val: ST_Zoom;
  percent: string;
}

export interface CT_WritingStyle {
  lang: string;
  vendorID: string;
  dllVersion: string;
  nlCheck: ST_OnOff;
  checkStyle: ST_OnOff;
  appName: string;
}

export type ST_Proof = 'clean' | 'dirty';

export interface CT_Proof {
  spelling: ST_Proof;
  grammar: ST_Proof;
}

export type ST_DocType = string;

export interface CT_DocType {
  val: string;
}

export type ST_DocProtect =
  | 'none'
  | 'readOnly'
  | 'comments'
  | 'trackedChanges'
  | 'forms';

export interface CT_DocProtect {
  edit: ST_DocProtect;
  formatting: ST_OnOff;
  enforcement: ST_OnOff;
}

export type ST_MailMergeDocType =
  | 'catalog'
  | 'envelopes'
  | 'mailingLabels'
  | 'formLetters'
  | 'email'
  | 'fax';

export interface CT_MailMergeDocType {
  val: ST_MailMergeDocType;
}

export type ST_MailMergeDataType = string;

export interface CT_MailMergeDataType {
  val: string;
}

export type ST_MailMergeDest = 'newDocument' | 'printer' | 'email' | 'fax';

export interface CT_MailMergeDest {
  val: ST_MailMergeDest;
}

export type ST_MailMergeOdsoFMDFieldType = 'null' | 'dbColumn';

export interface CT_MailMergeOdsoFMDFieldType {
  val: ST_MailMergeOdsoFMDFieldType;
}

export interface CT_TrackChangesView {
  markup: ST_OnOff;
  comments: ST_OnOff;
  insDel: ST_OnOff;
  formatting: ST_OnOff;
  inkAnnotations: ST_OnOff;
}

export interface CT_Kinsoku {
  lang: string;
  val: string;
}

export type ST_TextDirection = 'tb' | 'rl' | 'lr' | 'tbV' | 'rlV' | 'lrV';

export interface CT_TextDirection {
  val: ST_TextDirection;
}

export type ST_TextAlignment =
  | 'top'
  | 'center'
  | 'baseline'
  | 'bottom'
  | 'auto';

export interface CT_TextAlignment {
  val: ST_TextAlignment;
}

export type ST_DisplacedByCustomXml = 'next' | 'prev';

export type ST_AnnotationVMerge = 'cont' | 'rest';

export interface CT_Markup {
  id: number;
}

export interface CT_TrackChange {}

export interface CT_CellMergeTrackChange {}

export interface CT_TrackChangeRange {}

export interface CT_MarkupRange {}

export interface CT_BookmarkRange {}

export interface CT_Bookmark {}

export interface CT_MoveBookmark {}

export interface CT_Comment {}

export interface CT_TblPrExChange {}

export interface CT_TcPrChange {}

export interface CT_TrPrChange {}

export interface CT_TblGridChange {}

export interface CT_TblPrChange {}

export interface CT_SectPrChange {}

export interface CT_PPrChange {}

export interface CT_RPrChange {}

export interface CT_ParaRPrChange {}

export interface CT_RunTrackChange {}

export interface CT_NumPr {
  ilvl: CT_DecimalNumber[];
  numId: CT_DecimalNumber[];
  ins: CT_TrackChange[];
}

export interface CT_PBdr {
  top: CT_Border[];
  left: CT_Border[];
  bottom: CT_Border[];
  right: CT_Border[];
  between: CT_Border[];
  bar: CT_Border[];
}

export interface CT_Tabs {
  tab: CT_TabStop[];
}

export type ST_TextboxTightWrap =
  | 'none'
  | 'allLines'
  | 'firstAndLastLine'
  | 'firstLineOnly'
  | 'lastLineOnly';

export interface CT_TextboxTightWrap {
  val: ST_TextboxTightWrap;
}

export interface CT_PPr {}

export interface CT_Cnf {
  firstRow: ST_OnOff;
  lastRow: ST_OnOff;
  firstColumn: ST_OnOff;
  lastColumn: ST_OnOff;
  oddVBand: ST_OnOff;
  evenVBand: ST_OnOff;
  oddHBand: ST_OnOff;
  evenHBand: ST_OnOff;
  firstRowFirstColumn: ST_OnOff;
  firstRowLastColumn: ST_OnOff;
  lastRowFirstColumn: ST_OnOff;
  lastRowLastColumn: ST_OnOff;
}

export interface CT_PPrBase {
  pStyle: CT_String[];
  keepNext: CT_OnOff[];
  keepLines: CT_OnOff[];
  pageBreakBefore: CT_OnOff[];
  framePr: CT_FramePr[];
  widowControl: CT_OnOff[];
  numPr: CT_NumPr[];
  suppressLineNumbers: CT_OnOff[];
  pBdr: CT_PBdr[];
  shd: CT_Shd[];
  tabs: CT_Tabs[];
  suppressAutoHyphens: CT_OnOff[];
  kinsoku: CT_OnOff[];
  wordWrap: CT_OnOff[];
  overflowPunct: CT_OnOff[];
  topLinePunct: CT_OnOff[];
  autoSpaceDE: CT_OnOff[];
  autoSpaceDN: CT_OnOff[];
  bidi: CT_OnOff[];
  adjustRightInd: CT_OnOff[];
  snapToGrid: CT_OnOff[];
  spacing: CT_Spacing[];
  ind: CT_Ind[];
  contextualSpacing: CT_OnOff[];
  mirrorIndents: CT_OnOff[];
  suppressOverlap: CT_OnOff[];
  jc: CT_Jc[];
  textDirection: CT_TextDirection[];
  textAlignment: CT_TextAlignment[];
  textboxTightWrap: CT_TextboxTightWrap[];
  outlineLvl: CT_DecimalNumber[];
  divId: CT_DecimalNumber[];
  cnfStyle: CT_Cnf;
}

export interface CT_PPrGeneral {}

export interface CT_Control {
  name: string;
  shapeid: string;
  r_id: string;
}

export interface CT_Drawing {}

export interface CT_Background {
  drawing: CT_Drawing[];
  color: ST_HexColor;
  themeColor: ST_ThemeColor;
  themeTint: string;
  themeShade: string;
}

export interface CT_Rel {
  r_id: string;
}

export interface CT_Object {
  drawing: CT_Drawing[];
  dxaOrig: ST_TwipsMeasure;
  dyaOrig: ST_TwipsMeasure;
}

export type ST_ObjectDrawAspect = 'content' | 'icon';

export interface CT_ObjectEmbed {
  drawAspect: ST_ObjectDrawAspect;
  r_id: string;
  progId: string;
  shapeId: string;
  fieldCodes: string;
}

export interface CT_ObjectLink {}

export type ST_ObjectUpdateMode = 'always' | 'onCall';

export interface CT_SimpleField {
  instr: string;
  fldLock: ST_OnOff;
  dirty: ST_OnOff;
}

export type ST_FldCharType = 'begin' | 'separate' | 'end';

export type ST_InfoTextType = 'text' | 'autoText';

export type ST_FFHelpTextVal = string;

export type ST_FFStatusTextVal = string;

export type ST_FFName = string;

export type ST_FFTextType =
  | 'regular'
  | 'number'
  | 'date'
  | 'currentTime'
  | 'currentDate'
  | 'calculated';

export interface CT_FFTextType {
  val: ST_FFTextType;
}

export interface CT_FFName {
  val: string;
}

export interface CT_FFHelpText {
  type: ST_InfoTextType;
  val: string;
}

export interface CT_FFStatusText {
  type: ST_InfoTextType;
  val: string;
}

export interface CT_FFData {
  name: CT_FFName[];
  label: CT_DecimalNumber[];
  tabIndex: CT_UnsignedDecimalNumber[];
  enabled: CT_OnOff[];
  calcOnExit: CT_OnOff[];
  entryMacro: CT_MacroName;
  exitMacro: CT_MacroName;
  helpText: CT_FFHelpText;
  statusText: CT_FFStatusText;
}

export interface CT_FldChar {
  ffData: CT_FFData;
  fldCharType: ST_FldCharType;
  fldLock: ST_OnOff;
  dirty: ST_OnOff;
}

export interface CT_FFCheckBox {
  default: CT_OnOff[];
  checked: CT_OnOff[];
}

export interface CT_FFDDList {
  result: CT_DecimalNumber[];
  default: CT_DecimalNumber[];
  listEntry: CT_String[];
}

export interface CT_FFTextInput {
  type: CT_FFTextType[];
  default: CT_String[];
  maxLength: CT_DecimalNumber[];
  format: CT_String[];
}

export type ST_SectionMark =
  | 'nextPage'
  | 'nextColumn'
  | 'continuous'
  | 'evenPage'
  | 'oddPage';

export interface CT_SectType {
  val: ST_SectionMark;
}

export interface CT_PaperSource {
  first: number;
  other: number;
}

export type ST_NumberFormat =
  | 'decimal'
  | 'upperRoman'
  | 'lowerRoman'
  | 'upperLetter'
  | 'lowerLetter'
  | 'ordinal'
  | 'cardinalText'
  | 'ordinalText'
  | 'hex'
  | 'chicago'
  | 'ideographDigital'
  | 'japaneseCounting'
  | 'aiueo'
  | 'iroha'
  | 'decimalFullWidth'
  | 'decimalHalfWidth'
  | 'japaneseLegal'
  | 'japaneseDigitalTenThousand'
  | 'decimalEnclosedCircle'
  | 'decimalFullWidth2'
  | 'aiueoFullWidth'
  | 'irohaFullWidth'
  | 'decimalZero'
  | 'bullet'
  | 'ganada'
  | 'chosung'
  | 'decimalEnclosedFullstop'
  | 'decimalEnclosedParen'
  | 'decimalEnclosedCircleChinese'
  | 'ideographEnclosedCircle'
  | 'ideographTraditional'
  | 'ideographZodiac'
  | 'ideographZodiacTraditional'
  | 'taiwaneseCounting'
  | 'ideographLegalTraditional'
  | 'taiwaneseCountingThousand'
  | 'taiwaneseDigital'
  | 'chineseCounting'
  | 'chineseLegalSimplified'
  | 'chineseCountingThousand'
  | 'koreanDigital'
  | 'koreanCounting'
  | 'koreanLegal'
  | 'koreanDigital2'
  | 'vietnameseCounting'
  | 'russianLower'
  | 'russianUpper'
  | 'none'
  | 'numberInDash'
  | 'hebrew1'
  | 'hebrew2'
  | 'arabicAlpha'
  | 'arabicAbjad'
  | 'hindiVowels'
  | 'hindiConsonants'
  | 'hindiNumbers'
  | 'hindiCounting'
  | 'thaiLetters'
  | 'thaiNumbers'
  | 'thaiCounting'
  | 'bahtText'
  | 'dollarText'
  | 'custom';

export type ST_PageOrientation = 'portrait' | 'landscape';

export interface CT_PageSz {
  w: ST_TwipsMeasure;
  h: ST_TwipsMeasure;
  orient: ST_PageOrientation;
  code: number;
}

export interface CT_PageMar {
  top: ST_SignedTwipsMeasure;
  right: ST_TwipsMeasure;
  bottom: ST_SignedTwipsMeasure;
  left: ST_TwipsMeasure;
  header: ST_TwipsMeasure;
  footer: ST_TwipsMeasure;
  gutter: ST_TwipsMeasure;
}

export type ST_PageBorderZOrder = 'front' | 'back';

export type ST_PageBorderDisplay = 'allPages' | 'firstPage' | 'notFirstPage';

export type ST_PageBorderOffset = 'page' | 'text';

export interface CT_TopPageBorder {}

export interface CT_PageBorder {}

export interface CT_BottomPageBorder {}

export interface CT_PageBorders {
  top: CT_TopPageBorder[];
  left: CT_PageBorder[];
  bottom: CT_BottomPageBorder[];
  right: CT_PageBorder[];
  zOrder: ST_PageBorderZOrder;
  display: ST_PageBorderDisplay;
  offsetFrom: ST_PageBorderOffset;
}

export type ST_ChapterSep = 'hyphen' | 'period' | 'colon' | 'emDash' | 'enDash';

export type ST_LineNumberRestart = 'newPage' | 'newSection' | 'continuous';

export interface CT_LineNumber {
  countBy: number;
  start: number;
  distance: ST_TwipsMeasure;
  restart: ST_LineNumberRestart;
}

export interface CT_PageNumber {
  fmt: ST_NumberFormat;
  start: number;
  chapStyle: number;
  chapSep: ST_ChapterSep;
}

export interface CT_Column {
  w: ST_TwipsMeasure;
  space: ST_TwipsMeasure;
}

export interface CT_Columns {
  col: CT_Column[];
  equalWidth: ST_OnOff;
  space: ST_TwipsMeasure;
  num: number;
  sep: ST_OnOff;
}

export type ST_VerticalJc = 'top' | 'center' | 'both' | 'bottom';

export interface CT_VerticalJc {
  val: ST_VerticalJc;
}

export type ST_DocGrid = 'default' | 'lines' | 'linesAndChars' | 'snapToChars';

export interface CT_DocGrid {
  type: ST_DocGrid;
  linePitch: number;
  charSpace: number;
}

export type ST_HdrFtr = 'even' | 'default' | 'first';

export type ST_FtnEdn =
  | 'normal'
  | 'separator'
  | 'continuationSeparator'
  | 'continuationNotice';

export interface CT_HdrFtrRef {}

export interface CT_HdrFtr {}

export interface CT_SectPrBase {}

export interface CT_SectPr {
  sectPrChange: CT_SectPrChange[];
}

export type ST_BrType = 'page' | 'column' | 'textWrapping';

export type ST_BrClear = 'none' | 'left' | 'right' | 'all';

export interface CT_Br {
  type: ST_BrType;
  clear: ST_BrClear;
}

export type ST_PTabAlignment = 'left' | 'center' | 'right';

export type ST_PTabRelativeTo = 'margin' | 'indent';

export type ST_PTabLeader =
  | 'none'
  | 'dot'
  | 'hyphen'
  | 'underscore'
  | 'middleDot';

export interface CT_PTab {
  alignment: ST_PTabAlignment;
  relativeTo: ST_PTabRelativeTo;
  leader: ST_PTabLeader;
}

export interface CT_Sym {
  font: string;
  char: string;
}

export type ST_ProofErr = 'spellStart' | 'spellEnd' | 'gramStart' | 'gramEnd';

export interface CT_ProofErr {
  type: ST_ProofErr;
}

export type ST_EdGrp =
  | 'none'
  | 'everyone'
  | 'administrators'
  | 'contributors'
  | 'editors'
  | 'owners'
  | 'current';

export interface CT_Perm {
  id: string;
  displacedByCustomXml: ST_DisplacedByCustomXml;
}

export interface CT_PermStart {}

export interface CT_Text {}

export interface CT_R {
  rsidRPr: string;
  rsidDel: string;
  rsidR: string;
}

export type ST_Hint = 'default' | 'eastAsia';

export type ST_Theme =
  | 'majorEastAsia'
  | 'majorBidi'
  | 'majorAscii'
  | 'majorHAnsi'
  | 'minorEastAsia'
  | 'minorBidi'
  | 'minorAscii'
  | 'minorHAnsi';

export interface CT_Fonts {
  hint: ST_Hint;
  ascii: string;
  hAnsi: string;
  eastAsia: string;
  cs: string;
  asciiTheme: ST_Theme;
  hAnsiTheme: ST_Theme;
  eastAsiaTheme: ST_Theme;
  cstheme: ST_Theme;
}

export interface CT_RPr {}

export interface CT_MathCtrlIns {}

export interface CT_MathCtrlDel {}

export interface CT_RPrOriginal {}

export interface CT_ParaRPrOriginal {}

export interface CT_ParaRPr {
  rPrChange: CT_ParaRPrChange[];
}

export interface CT_AltChunkPr {
  matchSrc: CT_OnOff;
}

export interface CT_AltChunk {
  altChunkPr: CT_AltChunkPr;
  r_id: string;
}

export type ST_RubyAlign =
  | 'center'
  | 'distributeLetter'
  | 'distributeSpace'
  | 'left'
  | 'right'
  | 'rightVertical';

export interface CT_RubyAlign {
  val: ST_RubyAlign;
}

export interface CT_RubyPr {
  rubyAlign: CT_RubyAlign[];
  hps: CT_HpsMeasure[];
  hpsRaise: CT_HpsMeasure[];
  hpsBaseText: CT_HpsMeasure[];
  lid: CT_Lang[];
  dirty: CT_OnOff[];
}

export interface CT_RubyContent {}

export interface CT_Ruby {
  rubyPr: CT_RubyPr[];
  rt: CT_RubyContent[];
  rubyBase: CT_RubyContent[];
}

export type ST_Lock =
  | 'sdtLocked'
  | 'contentLocked'
  | 'unlocked'
  | 'sdtContentLocked';

export interface CT_Lock {
  val: ST_Lock;
}

export interface CT_SdtListItem {
  displayText: string;
  value: string;
}

export type ST_SdtDateMappingType = 'text' | 'date' | 'dateTime';

export interface CT_SdtDateMappingType {
  val: ST_SdtDateMappingType;
}

export interface CT_CalendarType {
  val: ST_CalendarType;
}

export interface CT_SdtDate {
  dateFormat: CT_String[];
  lid: CT_Lang[];
  storeMappedDataAs: CT_SdtDateMappingType[];
  calendar: CT_CalendarType[];
  fullDate: string;
}

export interface CT_SdtComboBox {
  listItem: CT_SdtListItem[];
  lastValue: string;
}

export interface CT_SdtDocPart {
  docPartGallery: CT_String[];
  docPartCategory: CT_String[];
  docPartUnique: CT_OnOff[];
}

export interface CT_SdtDropDownList {
  listItem: CT_SdtListItem[];
  lastValue: string;
}

export interface CT_Placeholder {
  docPart: CT_String[];
}

export interface CT_SdtText {
  multiLine: ST_OnOff;
}

export interface CT_DataBinding {
  prefixMappings: string;
  xpath: string;
  storeItemID: string;
}

export interface CT_SdtPr {
  rPr: CT_RPr[];
  alias: CT_String[];
  tag: CT_String[];
  id: CT_DecimalNumber[];
  lock: CT_Lock[];
  placeholder: CT_Placeholder[];
  temporary: CT_OnOff[];
  showingPlcHdr: CT_OnOff[];
  dataBinding: CT_DataBinding[];
  label: CT_DecimalNumber[];
  tabIndex: CT_UnsignedDecimalNumber[];
}

export interface CT_SdtEndPr {
  rPr: CT_RPr[];
}

export type ST_Direction = 'ltr' | 'rtl';

export interface CT_DirContentRun {
  val: ST_Direction;
}

export interface CT_BdoContentRun {
  val: ST_Direction;
}

export interface CT_SdtContentRun {}

export interface CT_SdtContentBlock {}

export interface CT_SdtContentRow {}

export interface CT_SdtContentCell {}

export interface CT_SdtBlock {
  sdtPr: CT_SdtPr;
  sdtEndPr: CT_SdtEndPr;
  sdtContent: CT_SdtContentBlock;
}

export interface CT_SdtRun {
  sdtPr: CT_SdtPr;
  sdtEndPr: CT_SdtEndPr;
  sdtContent: CT_SdtContentRun;
}

export interface CT_SdtCell {
  sdtPr: CT_SdtPr;
  sdtEndPr: CT_SdtEndPr;
  sdtContent: CT_SdtContentCell;
}

export interface CT_SdtRow {
  sdtPr: CT_SdtPr;
  sdtEndPr: CT_SdtEndPr;
  sdtContent: CT_SdtContentRow;
}

export interface CT_Attr {
  uri: string;
  name: string;
  val: string;
}

export interface CT_CustomXmlPr {
  placeholder: CT_String[];
  attr: CT_Attr[];
}

export interface CT_CustomXmlRun {
  customXmlPr: CT_CustomXmlPr;
  uri: string;
  element: string;
}

export interface CT_SmartTagPr {
  attr: CT_Attr[];
}

export interface CT_SmartTagRun {
  smartTagPr: CT_SmartTagPr;
  uri: string;
  element: string;
}

export interface CT_CustomXmlBlock {
  customXmlPr: CT_CustomXmlPr;
  uri: string;
  element: string;
}

export interface CT_CustomXmlRow {
  customXmlPr: CT_CustomXmlPr;
  uri: string;
  element: string;
}

export interface CT_CustomXmlCell {
  customXmlPr: CT_CustomXmlPr;
  uri: string;
  element: string;
}

export interface CT_P {
  pPr: CT_PPr[];
  rsidRPr: string;
  rsidR: string;
  rsidDel: string;
  rsidP: string;
  rsidRDefault: string;
}

export type ST_TblWidth = 'nil' | 'pct' | 'dxa' | 'auto';

export interface CT_Height {
  val: ST_TwipsMeasure;
  hRule: ST_HeightRule;
}

export type ST_MeasurementOrPercent =
  | ST_DecimalNumberOrPercent
  | ST_UniversalMeasure;

export interface CT_TblWidth {
  w: ST_MeasurementOrPercent;
  type: ST_TblWidth;
}

export interface CT_TblGridCol {
  w: ST_TwipsMeasure;
}

export interface CT_TblGridBase {
  gridCol: CT_TblGridCol[];
}

export interface CT_TblGrid {}

export interface CT_TcBorders {
  top: CT_Border[];
  start: CT_Border[];
  bottom: CT_Border[];
  end: CT_Border[];
  insideH: CT_Border[];
  insideV: CT_Border[];
  tl2br: CT_Border[];
  tr2bl: CT_Border[];
}

export interface CT_TcMar {
  top: CT_TblWidth;
  start: CT_TblWidth;
  bottom: CT_TblWidth;
  end: CT_TblWidth;
}

export type ST_Merge = 'continue' | 'restart';

export interface CT_VMerge {
  val: ST_Merge;
}

export interface CT_TcPrBase {
  cnfStyle: CT_Cnf;
  tcW: CT_TblWidth;
  gridSpan: CT_DecimalNumber[];
  vMerge: CT_VMerge[];
  tcBorders: CT_TcBorders;
  shd: CT_Shd[];
  noWrap: CT_OnOff[];
  tcMar: CT_TcMar;
  textDirection: CT_TextDirection;
  tcFitText: CT_OnOff;
  vAlign: CT_VerticalJc[];
  hideMark: CT_OnOff[];
  headers: CT_Headers[];
}

export interface CT_TcPr {}

export interface CT_TcPrInner {}

export interface CT_Tc {
  tcPr: CT_TcPr;
  id: string;
}

export interface CT_TrPrBase {
  cnfStyle: CT_Cnf;
  divId: CT_DecimalNumber[];
  gridBefore: CT_DecimalNumber[];
  gridAfter: CT_DecimalNumber[];
  wBefore: CT_TblWidth;
  wAfter: CT_TblWidth;
  cantSplit: CT_OnOff[];
  trHeight: CT_Height[];
  tblHeader: CT_OnOff[];
  tblCellSpacing: CT_TblWidth;
  jc: CT_JcTable;
  hidden: CT_OnOff[];
}

export interface CT_TrPr {}

export interface CT_TblPrEx {}

export interface CT_Row {
  tblPrEx: CT_TblPrEx;
  trPr: CT_TrPr;
  rsidRPr: string;
  rsidR: string;
  rsidDel: string;
  rsidTr: string;
}

export type ST_TblLayoutType = 'fixed' | 'autofit';

export interface CT_TblLayoutType {
  type: ST_TblLayoutType;
}

export type ST_TblOverlap = 'never' | 'overlap';

export interface CT_TblOverlap {
  val: ST_TblOverlap;
}

export interface CT_TblPPr {
  leftFromText: ST_TwipsMeasure;
  rightFromText: ST_TwipsMeasure;
  topFromText: ST_TwipsMeasure;
  bottomFromText: ST_TwipsMeasure;
  vertAnchor: ST_VAnchor;
  horzAnchor: ST_HAnchor;
  tblpXSpec: ST_XAlign;
  tblpX: ST_SignedTwipsMeasure;
  tblpYSpec: ST_YAlign;
  tblpY: ST_SignedTwipsMeasure;
}

export interface CT_TblCellMar {
  top: CT_TblWidth;
  start: CT_TblWidth;
  bottom: CT_TblWidth;
  end: CT_TblWidth;
}

export interface CT_TblBorders {
  top: CT_Border[];
  start: CT_Border[];
  bottom: CT_Border[];
  end: CT_Border[];
  insideH: CT_Border[];
  insideV: CT_Border[];
}

export interface CT_TblLook {
  firstRow: ST_OnOff;
  lastRow: ST_OnOff;
  firstColumn: ST_OnOff;
  lastColumn: ST_OnOff;
  noHBand: ST_OnOff;
  noVBand: ST_OnOff;
}

export interface CT_TblPrBase {
  tblStyle: CT_String[];
  tblpPr: CT_TblPPr;
  tblOverlap: CT_TblOverlap;
  bidiVisual: CT_OnOff;
  tblStyleRowBandSize: CT_DecimalNumber;
  tblStyleColBandSize: CT_DecimalNumber;
  tblW: CT_TblWidth;
  jc: CT_JcTable;
  tblCellSpacing: CT_TblWidth;
  tblInd: CT_TblWidth;
  tblBorders: CT_TblBorders;
  shd: CT_Shd;
  tblLayout: CT_TblLayoutType;
  tblCellMar: CT_TblCellMar;
  tblLook: CT_TblLook;
  tblCaption: CT_String;
  tblDescription: CT_String;
}

export interface CT_TblPr {}

export interface CT_TblPrExBase {
  tblW: CT_TblWidth;
  jc: CT_JcTable;
  tblCellSpacing: CT_TblWidth;
  tblInd: CT_TblWidth;
  tblBorders: CT_TblBorders;
  shd: CT_Shd;
  tblLayout: CT_TblLayoutType;
  tblCellMar: CT_TblCellMar;
  tblLook: CT_TblLook;
}

export interface CT_Tbl {
  tblPr: CT_TblPr[];
  tblGrid: CT_TblGrid[];
}

export type ST_FtnPos = 'pageBottom' | 'beneathText' | 'sectEnd' | 'docEnd';

export interface CT_FtnPos {
  val: ST_FtnPos;
}

export type ST_EdnPos = 'sectEnd' | 'docEnd';

export interface CT_EdnPos {
  val: ST_EdnPos;
}

export interface CT_NumFmt {
  val: ST_NumberFormat;
  format: string;
}

export type ST_RestartNumber = 'continuous' | 'eachSect' | 'eachPage';

export interface CT_NumRestart {
  val: ST_RestartNumber;
}

export interface CT_FtnEdnRef {
  customMarkFollows: ST_OnOff;
  id: number;
}

export interface CT_FtnEdnSepRef {
  id: number;
}

export interface CT_FtnEdn {
  type: ST_FtnEdn;
  id: number;
}

export interface CT_FtnProps {
  pos: CT_FtnPos[];
  numFmt: CT_NumFmt[];
}

export interface CT_EdnProps {
  pos: CT_EdnPos[];
  numFmt: CT_NumFmt[];
}

export interface CT_FtnDocProps {}

export interface CT_EdnDocProps {}

export interface CT_Base64Binary {
  val: string;
}

export interface CT_RecipientData {
  active: CT_OnOff[];
  column: CT_DecimalNumber[];
  uniqueTag: CT_Base64Binary[];
}

export interface CT_Recipients {
  recipientData: CT_RecipientData[];
}

export interface CT_OdsoFieldMapData {
  type: CT_MailMergeOdsoFMDFieldType[];
  name: CT_String[];
  mappedName: CT_String[];
  column: CT_DecimalNumber[];
  lid: CT_Lang[];
  dynamicAddress: CT_OnOff[];
}

export type ST_MailMergeSourceType =
  | 'database'
  | 'addressBook'
  | 'document1'
  | 'document2'
  | 'text'
  | 'email'
  | 'native'
  | 'legacy'
  | 'master';

export interface CT_MailMergeSourceType {
  val: ST_MailMergeSourceType;
}

export interface CT_Odso {
  udl: CT_String[];
  table: CT_String[];
  src: CT_Rel[];
  colDelim: CT_DecimalNumber[];
  type: CT_MailMergeSourceType[];
  fHdr: CT_OnOff[];
  fieldMapData: CT_OdsoFieldMapData[];
  recipientData: CT_Rel[];
}

export interface CT_MailMerge {
  mainDocumentType: CT_MailMergeDocType[];
  linkToQuery: CT_OnOff[];
  dataType: CT_MailMergeDataType[];
  connectString: CT_String[];
  query: CT_String[];
  dataSource: CT_Rel[];
  headerSource: CT_Rel[];
  doNotSuppressBlankLines: CT_OnOff[];
  destination: CT_MailMergeDest[];
  addressFieldName: CT_String[];
  mailSubject: CT_String[];
  mailAsAttachment: CT_OnOff[];
  viewMergedData: CT_OnOff[];
  activeRecord: CT_DecimalNumber[];
  checkErrors: CT_DecimalNumber[];
  odso: CT_Odso[];
}

export type ST_TargetScreenSz =
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

export interface CT_TargetScreenSz {
  val: ST_TargetScreenSz;
}

export interface CT_CompatSetting {
  name: string;
  uri: string;
  val: string;
}

export interface CT_Compat {
  spaceForUL: CT_OnOff[];
  balanceSingleByteDoubleByteWidth: CT_OnOff[];
  doNotLeaveBackslashAlone: CT_OnOff[];
  ulTrailSpace: CT_OnOff[];
  doNotExpandShiftReturn: CT_OnOff[];
  adjustLineHeightInTable: CT_OnOff[];
  applyBreakingRules: CT_OnOff[];
  compatSetting: CT_CompatSetting[];
}

export interface CT_DocVar {
  name: string;
  val: string;
}

export interface CT_DocVars {
  docVar: CT_DocVar[];
}

export interface CT_DocRsids {
  rsidRoot: CT_LongHexNumber;
  rsid: CT_LongHexNumber[];
}

export type ST_CharacterSpacing =
  | 'doNotCompress'
  | 'compressPunctuation'
  | 'compressPunctuationAndJapaneseKana';

export interface CT_CharacterSpacing {
  val: ST_CharacterSpacing;
}

export interface CT_SaveThroughXslt {
  r_id: string;
  solutionID: string;
}

export interface CT_RPrDefault {
  rPr: CT_RPr[];
}

export interface CT_PPrDefault {
  pPr: CT_PPrGeneral[];
}

export interface CT_DocDefaults {
  rPrDefault: CT_RPrDefault[];
  pPrDefault: CT_PPrDefault[];
}

export type ST_WmlColorSchemeIndex =
  | 'dark1'
  | 'light1'
  | 'dark2'
  | 'light2'
  | 'accent1'
  | 'accent2'
  | 'accent3'
  | 'accent4'
  | 'accent5'
  | 'accent6'
  | 'hyperlink'
  | 'followedHyperlink';

export interface CT_ColorSchemeMapping {
  bg1: ST_WmlColorSchemeIndex;
  t1: ST_WmlColorSchemeIndex;
  bg2: ST_WmlColorSchemeIndex;
  t2: ST_WmlColorSchemeIndex;
  accent1: ST_WmlColorSchemeIndex;
  accent2: ST_WmlColorSchemeIndex;
  accent3: ST_WmlColorSchemeIndex;
  accent4: ST_WmlColorSchemeIndex;
  accent5: ST_WmlColorSchemeIndex;
  accent6: ST_WmlColorSchemeIndex;
  hyperlink: ST_WmlColorSchemeIndex;
  followedHyperlink: ST_WmlColorSchemeIndex;
}

export interface CT_ReadingModeInkLockDown {
  actualPg: ST_OnOff;
  w: number;
  h: number;
  fontSz: string;
}

export interface CT_WriteProtection {
  recommended: ST_OnOff;
}

export interface CT_StylePaneFilter {
  allStyles: ST_OnOff;
  customStyles: ST_OnOff;
  latentStyles: ST_OnOff;
  stylesInUse: ST_OnOff;
  headingStyles: ST_OnOff;
  numberingStyles: ST_OnOff;
  tableStyles: ST_OnOff;
  directFormattingOnRuns: ST_OnOff;
  directFormattingOnParagraphs: ST_OnOff;
  directFormattingOnNumbering: ST_OnOff;
  directFormattingOnTables: ST_OnOff;
  clearFormatting: ST_OnOff;
  top3HeadingStyles: ST_OnOff;
  visibleStyles: ST_OnOff;
  alternateStyleNames: ST_OnOff;
}

export type ST_StyleSort =
  | 'name'
  | 'priority'
  | 'default'
  | 'font'
  | 'basedOn'
  | 'type';

export interface CT_StyleSort {
  val: ST_StyleSort;
}

export type ST_CaptionPos = 'above' | 'below' | 'left' | 'right';

export interface CT_Caption {
  name: string;
  pos: ST_CaptionPos;
  chapNum: ST_OnOff;
  heading: number;
  noLabel: ST_OnOff;
  numFmt: ST_NumberFormat;
  sep: ST_ChapterSep;
}

export interface CT_AutoCaption {
  name: string;
  caption: string;
}

export interface CT_AutoCaptions {
  autoCaption: CT_AutoCaption[];
}

export interface CT_Captions {
  caption: CT_Caption[];
  autoCaptions: CT_AutoCaptions;
}

export interface CT_SmartTagType {
  namespaceuri: string;
  name: string;
  url: string;
}

export interface CT_Settings {
  writeProtection: CT_WriteProtection[];
  view: CT_View[];
  zoom: CT_Zoom[];
  removePersonalInformation: CT_OnOff[];
  removeDateAndTime: CT_OnOff[];
  doNotDisplayPageBoundaries: CT_OnOff[];
  displayBackgroundShape: CT_OnOff[];
  printPostScriptOverText: CT_OnOff[];
  printFractionalCharacterWidth: CT_OnOff[];
  printFormsData: CT_OnOff[];
  embedTrueTypeFonts: CT_OnOff[];
  embedSystemFonts: CT_OnOff[];
  saveSubsetFonts: CT_OnOff[];
  saveFormsData: CT_OnOff[];
  mirrorMargins: CT_OnOff[];
  alignBordersAndEdges: CT_OnOff[];
  bordersDoNotSurroundHeader: CT_OnOff[];
  bordersDoNotSurroundFooter: CT_OnOff[];
  gutterAtTop: CT_OnOff[];
  hideSpellingErrors: CT_OnOff[];
  hideGrammaticalErrors: CT_OnOff[];
  activeWritingStyle: CT_WritingStyle[];
  proofState: CT_Proof[];
  formsDesign: CT_OnOff[];
  attachedTemplate: CT_Rel[];
  linkStyles: CT_OnOff[];
  stylePaneFormatFilter: CT_StylePaneFilter[];
  stylePaneSortMethod: CT_StyleSort[];
  documentType: CT_DocType[];
  mailMerge: CT_MailMerge[];
  revisionView: CT_TrackChangesView[];
  trackRevisions: CT_OnOff[];
  doNotTrackMoves: CT_OnOff[];
  doNotTrackFormatting: CT_OnOff[];
  documentProtection: CT_DocProtect[];
  autoFormatOverride: CT_OnOff[];
  styleLockTheme: CT_OnOff[];
  styleLockQFSet: CT_OnOff[];
  defaultTabStop: CT_TwipsMeasure[];
  autoHyphenation: CT_OnOff[];
  consecutiveHyphenLimit: CT_DecimalNumber[];
  hyphenationZone: CT_TwipsMeasure[];
  doNotHyphenateCaps: CT_OnOff[];
  showEnvelope: CT_OnOff[];
  summaryLength: CT_DecimalNumberOrPrecent[];
  clickAndTypeStyle: CT_String[];
  defaultTableStyle: CT_String[];
  evenAndOddHeaders: CT_OnOff[];
  bookFoldRevPrinting: CT_OnOff[];
  bookFoldPrinting: CT_OnOff[];
  bookFoldPrintingSheets: CT_DecimalNumber[];
  drawingGridHorizontalSpacing: CT_TwipsMeasure[];
  drawingGridVerticalSpacing: CT_TwipsMeasure[];
  displayHorizontalDrawingGridEvery: CT_DecimalNumber[];
  displayVerticalDrawingGridEvery: CT_DecimalNumber[];
  doNotUseMarginsForDrawingGridOrigin: CT_OnOff[];
  drawingGridHorizontalOrigin: CT_TwipsMeasure[];
  drawingGridVerticalOrigin: CT_TwipsMeasure[];
  doNotShadeFormData: CT_OnOff[];
  noPunctuationKerning: CT_OnOff[];
  characterSpacingControl: CT_CharacterSpacing[];
  printTwoOnOne: CT_OnOff[];
  strictFirstAndLastChars: CT_OnOff[];
  noLineBreaksAfter: CT_Kinsoku[];
  noLineBreaksBefore: CT_Kinsoku[];
  savePreviewPicture: CT_OnOff[];
  doNotValidateAgainstSchema: CT_OnOff[];
  saveInvalidXml: CT_OnOff[];
  ignoreMixedContent: CT_OnOff[];
  alwaysShowPlaceholderText: CT_OnOff[];
  doNotDemarcateInvalidXml: CT_OnOff[];
  saveXmlDataOnly: CT_OnOff[];
  useXSLTWhenSaving: CT_OnOff[];
  saveThroughXslt: CT_SaveThroughXslt[];
  showXMLTags: CT_OnOff[];
  alwaysMergeEmptyNamespace: CT_OnOff[];
  updateFields: CT_OnOff[];
  footnotePr: CT_FtnDocProps[];
  endnotePr: CT_EdnDocProps[];
  compat: CT_Compat[];
  docVars: CT_DocVars[];
  rsids: CT_DocRsids[];
  attachedSchema: CT_String[];
  themeFontLang: CT_Language;
  clrSchemeMapping: CT_ColorSchemeMapping[];
  doNotIncludeSubdocsInStats: CT_OnOff[];
  doNotAutoCompressPictures: CT_OnOff[];
  forceUpgrade: CT_Empty;
  captions: CT_Captions;
  readModeInkLockDown: CT_ReadingModeInkLockDown[];
  smartTagType: CT_SmartTagType[];
  doNotEmbedSmartTags: CT_OnOff[];
  decimalSymbol: CT_String;
  listSeparator: CT_String;
}

export interface CT_FramesetSplitbar {
  w: CT_TwipsMeasure[];
  color: CT_Color[];
  noBorder: CT_OnOff[];
  flatBorders: CT_OnOff[];
}

export type ST_FrameLayout = 'rows' | 'cols' | 'none';

export interface CT_FrameLayout {
  val: ST_FrameLayout;
}

export interface CT_Frameset {
  sz: CT_String[];
  framesetSplitbar: CT_FramesetSplitbar[];
  frameLayout: CT_FrameLayout[];
  title: CT_String[];
}

export interface CT_OptimizeForBrowser {}

export interface CT_WebSettings {
  frameset: CT_Frameset[];
  divs: CT_Divs[];
  encoding: CT_String[];
  optimizeForBrowser: CT_OptimizeForBrowser[];
  allowPNG: CT_OnOff[];
  doNotRelyOnCSS: CT_OnOff[];
  doNotSaveAsSingleFile: CT_OnOff[];
  doNotOrganizeInFolder: CT_OnOff[];
  doNotUseLongFileNames: CT_OnOff[];
  pixelsPerInch: CT_DecimalNumber[];
  targetScreenSz: CT_TargetScreenSz[];
  saveSmartTagsAsXml: CT_OnOff[];
}

export type ST_FrameScrollbar = 'on' | 'off' | 'auto';

export interface CT_FrameScrollbar {
  val: ST_FrameScrollbar;
}

export interface CT_Frame {
  sz: CT_String[];
  name: CT_String[];
  title: CT_String[];
  longDesc: CT_Rel[];
  sourceFileName: CT_Rel[];
  marW: CT_PixelsMeasure[];
  marH: CT_PixelsMeasure[];
  scrollbar: CT_FrameScrollbar[];
  noResizeAllowed: CT_OnOff[];
  linkedToFile: CT_OnOff[];
}

export interface CT_NumPicBullet {
  drawing: CT_Drawing[];
  numPicBulletId: number;
}

export type ST_LevelSuffix = 'tab' | 'space' | 'nothing';

export interface CT_LevelSuffix {
  val: ST_LevelSuffix;
}

export interface CT_LevelText {
  val: string;
  null: ST_OnOff;
}

export interface CT_Lvl {
  start: CT_DecimalNumber[];
  numFmt: CT_NumFmt[];
  lvlRestart: CT_DecimalNumber[];
  pStyle: CT_String[];
  isLgl: CT_OnOff[];
  suff: CT_LevelSuffix[];
  lvlText: CT_LevelText[];
  lvlPicBulletId: CT_DecimalNumber[];
  lvlJc: CT_Jc[];
  pPr: CT_PPrGeneral[];
  rPr: CT_RPr[];
  ilvl: number;
  tplc: string;
  tentative: ST_OnOff;
}

export type ST_MultiLevelType =
  | 'singleLevel'
  | 'multilevel'
  | 'hybridMultilevel';

export interface CT_MultiLevelType {
  val: ST_MultiLevelType;
}

export interface CT_AbstractNum {
  nsid: CT_LongHexNumber[];
  multiLevelType: CT_MultiLevelType[];
  tmpl: CT_LongHexNumber[];
  name: CT_String[];
  styleLink: CT_String[];
  numStyleLink: CT_String[];
  lvl: CT_Lvl[];
  abstractNumId: number;
}

export interface CT_NumLvl {
  startOverride: CT_DecimalNumber[];
  lvl: CT_Lvl;
  ilvl: number;
}

export interface CT_Num {
  abstractNumId: CT_DecimalNumber[];
  lvlOverride: CT_NumLvl[];
  numId: number;
}

export interface CT_Numbering {
  numPicBullet: CT_NumPicBullet[];
  abstractNum: CT_AbstractNum[];
  num: CT_Num[];
  numIdMacAtCleanup: CT_DecimalNumber[];
}

export type ST_TblStyleOverrideType =
  | 'wholeTable'
  | 'firstRow'
  | 'lastRow'
  | 'firstCol'
  | 'lastCol'
  | 'band1Vert'
  | 'band2Vert'
  | 'band1Horz'
  | 'band2Horz'
  | 'neCell'
  | 'nwCell'
  | 'seCell'
  | 'swCell';

export interface CT_TblStylePr {
  pPr: CT_PPrGeneral[];
  rPr: CT_RPr[];
  tblPr: CT_TblPrBase[];
  trPr: CT_TrPr;
  tcPr: CT_TcPr;
  type: ST_TblStyleOverrideType;
}

export type ST_StyleType = 'paragraph' | 'character' | 'table' | 'numbering';

export interface CT_Style {
  name: CT_String;
  aliases: CT_String[];
  basedOn: CT_String[];
  next: CT_String[];
  link: CT_String[];
  autoRedefine: CT_OnOff[];
  hidden: CT_OnOff[];
  uiPriority: CT_DecimalNumber[];
  semiHidden: CT_OnOff[];
  unhideWhenUsed: CT_OnOff[];
  qFormat: CT_OnOff[];
  locked: CT_OnOff[];
  personal: CT_OnOff[];
  personalCompose: CT_OnOff[];
  personalReply: CT_OnOff[];
  rsid: CT_LongHexNumber[];
  pPr: CT_PPrGeneral;
  rPr: CT_RPr;
  tblPr: CT_TblPrBase;
  trPr: CT_TrPr;
  tcPr: CT_TcPr;
  tblStylePr: CT_TblStylePr[];
  type: ST_StyleType;
  styleId: string;
  default: ST_OnOff;
  customStyle: ST_OnOff;
}

export interface CT_LsdException {
  name: string;
  locked: ST_OnOff;
  uiPriority: number;
  semiHidden: ST_OnOff;
  unhideWhenUsed: ST_OnOff;
  qFormat: ST_OnOff;
}

export interface CT_LatentStyles {
  lsdException: CT_LsdException[];
  defLockedState: ST_OnOff;
  defUIPriority: number;
  defSemiHidden: ST_OnOff;
  defUnhideWhenUsed: ST_OnOff;
  defQFormat: ST_OnOff;
  count: number;
}

export interface CT_Styles {
  docDefaults: CT_DocDefaults[];
  latentStyles: CT_LatentStyles;
  style: CT_Style[];
}

export interface CT_Panose {
  val: string;
}

export type ST_FontFamily =
  | 'decorative'
  | 'modern'
  | 'roman'
  | 'script'
  | 'swiss'
  | 'auto';

export interface CT_FontFamily {
  val: ST_FontFamily;
}

export type ST_Pitch = 'fixed' | 'variable' | 'default';

export interface CT_Pitch {
  val: ST_Pitch;
}

export interface CT_FontSig {
  usb0: string;
  usb1: string;
  usb2: string;
  usb3: string;
  csb0: string;
  csb1: string;
}

export interface CT_FontRel {}

export interface CT_Font {
  altName: CT_String;
  panose1: CT_Panose;
  charset: CT_Charset;
  family: CT_FontFamily;
  notTrueType: CT_OnOff;
  pitch: CT_Pitch;
  sig: CT_FontSig;
  embedRegular: CT_FontRel;
  embedBold: CT_FontRel;
  embedItalic: CT_FontRel;
  embedBoldItalic: CT_FontRel;
  name: string;
}

export interface CT_FontsList {
  font: CT_Font[];
}

export interface CT_DivBdr {
  top: CT_Border[];
  left: CT_Border[];
  bottom: CT_Border[];
  right: CT_Border[];
}

export interface CT_Div {
  blockQuote: CT_OnOff[];
  bodyDiv: CT_OnOff[];
  marLeft: CT_SignedTwipsMeasure[];
  marRight: CT_SignedTwipsMeasure[];
  marTop: CT_SignedTwipsMeasure[];
  marBottom: CT_SignedTwipsMeasure[];
  divBdr: CT_DivBdr[];
  divsChild: CT_Divs[];
  id: number;
}

export interface CT_Divs {
  div: CT_Div[];
}

export interface CT_Body {
  sectPr: CT_SectPr;
}

export interface CT_Comments {
  comment: CT_Comment[];
}

export interface CT_Footnotes {
  footnote: CT_FtnEdn[];
}

export interface CT_Endnotes {
  endnote: CT_FtnEdn[];
}

export type ST_DocPartBehavior = 'content' | 'p' | 'pg';

export interface CT_DocPartBehavior {
  val: ST_DocPartBehavior;
}

export interface CT_DocPartBehaviors {
  behavior: CT_DocPartBehavior[];
}

export type ST_DocPartType =
  | 'none'
  | 'normal'
  | 'autoExp'
  | 'toolbar'
  | 'speller'
  | 'formFld'
  | 'bbPlcHdr';

export interface CT_DocPartType {
  val: ST_DocPartType;
}

export interface CT_DocPartTypes {
  type: CT_DocPartType[];
  all: ST_OnOff;
}

export type ST_DocPartGallery =
  | 'placeholder'
  | 'any'
  | 'default'
  | 'docParts'
  | 'coverPg'
  | 'eq'
  | 'ftrs'
  | 'hdrs'
  | 'pgNum'
  | 'tbls'
  | 'watermarks'
  | 'autoTxt'
  | 'txtBox'
  | 'pgNumT'
  | 'pgNumB'
  | 'pgNumMargins'
  | 'tblOfContents'
  | 'bib'
  | 'custQuickParts'
  | 'custCoverPg'
  | 'custEq'
  | 'custFtrs'
  | 'custHdrs'
  | 'custPgNum'
  | 'custTbls'
  | 'custWatermarks'
  | 'custAutoTxt'
  | 'custTxtBox'
  | 'custPgNumT'
  | 'custPgNumB'
  | 'custPgNumMargins'
  | 'custTblOfContents'
  | 'custBib'
  | 'custom1'
  | 'custom2'
  | 'custom3'
  | 'custom4'
  | 'custom5';

export interface CT_DocPartGallery {
  val: ST_DocPartGallery;
}

export interface CT_DocPartCategory {
  name: CT_String;
  gallery: CT_DocPartGallery;
}

export interface CT_DocPartName {
  val: string;
  decorated: ST_OnOff;
}

export interface CT_DocPartPr {}

export interface CT_DocPart {
  docPartPr: CT_DocPartPr[];
  docPartBody: CT_Body[];
}

export interface CT_DocParts {
  docPart: CT_DocPart[];
}

export interface CT_DocumentBase {
  background: CT_Background[];
}

export interface CT_Document {}

export interface CT_GlossaryDocument {}

export interface CT_EffectExtent {
  l: ST_Coordinate;
  t: ST_Coordinate;
  r: ST_Coordinate;
  b: ST_Coordinate;
}

export type ST_WrapDistance = number;

export interface CT_Inline {
  extent: CT_PositiveSize2D[];
  effectExtent: CT_EffectExtent[];
  docPr: CT_NonVisualDrawingProps;
  cNvGraphicFramePr: CT_NonVisualGraphicFrameProperties;
  distT: number;
  distB: number;
  distL: number;
  distR: number;
}

export type ST_WrapText = 'bothSides' | 'left' | 'right' | 'largest';

export interface CT_WrapPath {
  start: CT_Point2D;
  lineTo: CT_Point2D[];
  edited: boolean;
}

export interface CT_WrapNone {}

export interface CT_WrapSquare {
  effectExtent: CT_EffectExtent[];
  wrapText: ST_WrapText;
  distT: number;
  distB: number;
  distL: number;
  distR: number;
}

export interface CT_WrapTight {
  wrapPolygon: CT_WrapPath;
  wrapText: ST_WrapText;
  distL: number;
  distR: number;
}

export interface CT_WrapThrough {
  wrapPolygon: CT_WrapPath;
  wrapText: ST_WrapText;
  distL: number;
  distR: number;
}

export interface CT_WrapTopBottom {
  effectExtent: CT_EffectExtent[];
  distT: number;
  distB: number;
}

export type ST_PositionOffset = number;

export type ST_AlignH = 'left' | 'right' | 'center' | 'inside' | 'outside';

export type ST_RelFromH =
  | 'margin'
  | 'page'
  | 'column'
  | 'character'
  | 'leftMargin'
  | 'rightMargin'
  | 'insideMargin'
  | 'outsideMargin';

export interface CT_PosH {
  relativeFrom: ST_RelFromH;
}

export type ST_AlignV = 'top' | 'bottom' | 'center' | 'inside' | 'outside';

export type ST_RelFromV =
  | 'margin'
  | 'page'
  | 'paragraph'
  | 'line'
  | 'topMargin'
  | 'bottomMargin'
  | 'insideMargin'
  | 'outsideMargin';

export interface CT_PosV {
  relativeFrom: ST_RelFromV;
}

export interface CT_Anchor {
  simplePos: boolean;
  positionH: CT_PosH[];
  positionV: CT_PosV[];
  extent: CT_PositiveSize2D[];
  effectExtent: CT_EffectExtent[];
  docPr: CT_NonVisualDrawingProps;
  cNvGraphicFramePr: CT_NonVisualGraphicFrameProperties;
  distT: number;
  distB: number;
  distL: number;
  distR: number;
  relativeHeight: number;
  behindDoc: boolean;
  locked: boolean;
  layoutInCell: boolean;
  hidden: boolean;
  allowOverlap: boolean;
}

export interface CT_TxbxContent {}

export interface CT_TextboxInfo {
  txbxContent: CT_TxbxContent;
  extLst: CT_OfficeArtExtensionList;
  id: number;
}

export interface CT_LinkedTextboxInformation {
  extLst: CT_OfficeArtExtensionList;
  id: number;
  seq: number;
}

export interface CT_WordprocessingShape {
  cNvPr: CT_NonVisualDrawingProps;
  spPr: CT_ShapeProperties;
  style: CT_ShapeStyle;
  extLst: CT_OfficeArtExtensionList;
  bodyPr: CT_TextBodyProperties;
  normalEastAsianFlow: boolean;
}

export interface CT_GraphicFrame {
  cNvPr: CT_NonVisualDrawingProps;
  cNvFrPr: CT_NonVisualGraphicFrameProperties;
  xfrm: CT_Transform2D;
  extLst: CT_OfficeArtExtensionList;
}

export interface CT_WordprocessingContentPartNonVisual {
  cNvPr: CT_NonVisualDrawingProps;
  cNvContentPartPr: CT_NonVisualContentPartProperties;
}

export interface CT_WordprocessingContentPart {
  nvContentPartPr: CT_WordprocessingContentPartNonVisual;
  xfrm: CT_Transform2D;
  extLst: CT_OfficeArtExtensionList;
  bwMode: ST_BlackWhiteMode;
  r_id: string;
}

export interface CT_WordprocessingGroup {
  cNvPr: CT_NonVisualDrawingProps;
  cNvGrpSpPr: CT_NonVisualGroupDrawingShapeProps;
  grpSpPr: CT_GroupShapeProperties;
  extLst: CT_OfficeArtExtensionList;
}

export interface CT_WordprocessingCanvas {
  bg: CT_BackgroundFormatting;
  whole: CT_WholeE2oFormatting;
  extLst: CT_OfficeArtExtensionList;
}
