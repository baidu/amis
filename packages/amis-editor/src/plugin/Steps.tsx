/**
 * @file Steps 步骤条
 */
import {registerEditorPlugin} from 'amis-editor-core';
import {BasePlugin} from 'amis-editor-core';
import {getSchemaTpl} from 'amis-editor-core';

export class StepsPlugin extends BasePlugin {
  static id = 'StepsPlugin';
  // 关联渲染器名字
  rendererName = 'steps';
  $schema = '/schemas/StepsSchema.json';

  // 组件名称
  name = '步骤条';
  isBaseComponent = true;
  icon = 'fa fa-forward';
  pluginIcon = 'steps-plugin';
  description = 'Steps 步骤条';
  docLink = '/amis/zh-CN/components/steps';
  tags = ['展示'];
  scaffold = {
    type: 'steps',
    value: 1,
    steps: [
      {
        title: '第一步',
        subTitle: '副标题',
        description: '描述'
      },
      {
        title: '第二步'
      },
      {
        title: '第三步'
      }
    ]
  };
  previewSchema = {
    ...this.scaffold
  };

  panelTitle = 'Steps';
  panelBody = [
    getSchemaTpl('tabs', [
      {
        title: '常规',
        body: [
          getSchemaTpl('layout:originPosition', {value: 'left-top'}),
          getSchemaTpl('combo-container', {
            name: 'steps',
            label: '步骤列表',
            type: 'combo',
            scaffold: {
              type: 'wrapper',
              body: '子节点内容'
            },
            minLength: 2,
            multiple: true,
            draggable: true,
            items: [
              getSchemaTpl('title', {
                label: false,
                placeholder: '标题'
              }),
              getSchemaTpl('stepSubTitle'),
              getSchemaTpl('stepDescription')
            ]
          }),
          {
            name: 'value',
            type: 'input-text',
            label: '当前步骤',
            description: '以零为头部'
          },
          {
            name: 'status',
            type: 'select',
            label: '当前状态',
            creatable: true,
            value: 'finish',
            options: [
              {
                label: '进行中',
                value: 'process'
              },
              {
                label: '等待',
                value: 'wait'
              },
              {
                label: '完成',
                value: 'finish'
              },
              {
                label: '出错',
                value: 'error'
              }
            ]
          },
          getSchemaTpl('api', {
            name: 'source',
            label: '获取步骤接口'
          })
        ]
      },
      {
        title: '外观',
        body: [
          {
            name: 'mode',
            type: 'select',
            label: '模式',
            value: 'horizontal',
            options: [
              {
                label: '水平',
                value: 'horizontal'
              },
              {
                label: '竖直',
                value: 'vertical'
              },
              {
                label: '简单',
                value: 'simple'
              }
            ]
          },
          getSchemaTpl('className')
        ]
      },
      {
        title: '显隐',
        body: [getSchemaTpl('visible')]
      }
    ])
  ];
}

registerEditorPlugin(StepsPlugin);
