/**
 * @file 标题文字颜色
 */

import {textStyleControls, createHierarchy} from './Common';

export default createHierarchy('title', [
  textStyleControls('textStyle', '主标题'),
  textStyleControls('subtextStyle', '副标题')
]);
