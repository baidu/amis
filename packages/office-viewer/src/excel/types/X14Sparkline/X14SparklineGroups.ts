import {Attributes} from '../../../openxml/Attributes';
import {
  X14SparklineGroup,
  X14SparklineGroup_Attributes
} from './X14SparklineGroup';

export type X14SparklineGroups = {
  'x14:sparklineGroup': X14SparklineGroup[];
};

export const X14SparklineGroups_Attributes: Attributes = {
  'x14:sparklineGroup': {
    type: 'child',
    childAttributes: X14SparklineGroup_Attributes,
    childIsArray: true
  }
};
