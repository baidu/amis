/**
 * @file 走势图
 */

import {registerEditorPlugin} from 'amis-editor-core';
import {BasePlugin, BaseEventContext} from 'amis-editor-core';
import {defaultValue, getSchemaTpl} from 'amis-editor-core';

export class SparklinePlugin extends BasePlugin {
  static id = 'SparklinePlugin';
  // 关联渲染器名字
  rendererName = 'sparkline';
  $schema = '/schemas/AMISSparkLineSchema.json';

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

  panelJustify = true;
  panelBodyCreator = (context: BaseEventContext) => {
    return [
      getSchemaTpl('tabs', [
        {
          title: '属性',
          body: [
            getSchemaTpl('collapseGroup', [
              {
                title: '基本',
                body: [
                  getSchemaTpl('layout:originPosition', {value: 'left-top'}),
                  getSchemaTpl('name')
                ]
              },
              {
                title: '宽高设置',
                body: [
                  {
                    name: 'width',
                    type: 'input-number',
                    label: '宽度'
                  },
                  {
                    name: 'height',
                    type: 'input-number',
                    label: '高度'
                  }
                ]
              },
              getSchemaTpl('status')
            ])
          ]
        },
        {
          title: '外观',
          body: getSchemaTpl('collapseGroup', [
            ...getSchemaTpl('theme:common', {exclude: ['layout']})
          ])
        }
      ])
    ];
  };
}

registerEditorPlugin(SparklinePlugin);
