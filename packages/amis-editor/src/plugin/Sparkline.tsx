/**
 * @file 走势图
 */

import {registerEditorPlugin} from 'amis-editor-core';
import {BasePlugin} from 'amis-editor-core';
import {defaultValue, getSchemaTpl} from 'amis-editor-core';

export class SparklinePlugin extends BasePlugin {
  // 关联渲染器名字
  rendererName = 'sparkline';
  $schema = '/schemas/SparklineSchema.json';

  // 组件名称
  name = '走势图';
  isBaseComponent = true;
  description = '用于内嵌展示简单图表';
  docLink = '/amis/zh-CN/components/sparkline';
  tags = ['展示'];
  icon = 'fa fa-area-chart';
  pluginIcon = 'sparkline-plugin';
  scaffold = {
    type: 'sparkline',
    height: 30,
    value: [3, 5, 2, 4, 1, 8, 3, 7]
  };
  previewSchema = {
    ...this.scaffold
  };

  panelTitle = '走势图';
  panelBody = [
    {
      name: 'height',
      type: 'input-number',
      label: '高度'
    }
  ];
}

registerEditorPlugin(SparklinePlugin);
