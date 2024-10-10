/**
 * 图标定义
 */

import {ST_IconSetType} from '../../../../openxml/ExcelTypes';
import {IconNames} from './presetIcons';

export const presetIconSet: Record<ST_IconSetType, IconNames[]> = {
  '3Arrows': ['down', 'side', 'up'],
  '3ArrowsGray': ['downGray', 'sideGray', 'upGray'],
  '3Flags': ['flagRed', 'flagYellow', 'flagGreen'],
  '3Signs': ['diamondRed', 'triangleYellow', 'circleGreen'],
  '3Symbols': ['crossRed', 'exclamationYellow', 'checkGreen'],
  '3Symbols2': [
    'crossSymbolRed',
    'exclamationSymbolYellow',
    'checkSymbolGreen'
  ],
  '3TrafficLights1': ['circleRed', 'circleYellow', 'circleGreen'],
  '3TrafficLights2': [
    'trafficLightRed',
    'trafficLightYellow',
    'trafficLightGreen'
  ],
  '4Arrows': ['down', 'downIncline', 'upIncline', 'up'],
  '4ArrowsGray': ['downGray', 'downInclineGray', 'upInclineGray', 'upGray'],
  '4Rating': [
    'oneFilledBars',
    'twoFilledBars',
    'threeFilledBars',
    'fourFilledBars'
  ],
  '4RedToBlack': ['circleBlack', 'circleGray', 'circleLightRed', 'circleRed'],
  '4TrafficLights': ['circleBlack', 'circleRed', 'circleYellow', 'circleGreen'],
  '5Arrows': ['down', 'downIncline', 'side', 'upIncline', 'up'],
  '5ArrowsGray': [
    'downGray',
    'downInclineGray',
    'sideGray',
    'upInclineGray',
    'upGray'
  ],
  '5Quarters': [
    'circleWhite',
    'circleThreeWhiteQuarters',
    'circleTwoWhiteQuarters',
    'circleOneWhiteQuarter',
    'circleBlack'
  ],
  '5Rating': [
    'zeroFilledBars',
    'oneFilledBars',
    'twoFilledBars',
    'threeFilledBars',
    'fourFilledBars'
  ]
};
