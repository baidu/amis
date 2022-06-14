/**
 * @file Steps 步骤条
 */
import {registerEditorPlugin} from '../manager';
import {BasePlugin} from '../plugin';
import {getSchemaTpl} from '../component/schemaTpl';

export class StepsPlugin extends BasePlugin {
  // 关联渲染器名字
  rendererName = 'steps';
  $schema = '/schemas/StepsSchema.json';

  // 组件名称
  name = 'Steps 步骤条';
  isBaseComponent = true;
  icon = 'fa fa-forward';
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
          {
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
              {
                type: 'input-text',
                name: 'title',
                label: false,
                placeholder: '标题'
              },
              {
                type: 'input-text',
                name: 'subTitle',
                label: false,
                placeholder: '副标题'
              },
              {
                type: 'input-text',
                name: 'description',
                label: false,
                placeholder: '描述'
              }
            ]
          },
          {
            name: 'value',
            type: 'input-text',
            label: '当前步骤',
            description: '以零为起点'
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
        body: [getSchemaTpl('className')]
      },
      {
        title: '显隐',
        body: [getSchemaTpl('visible')]
      }
    ])
  ];
}

registerEditorPlugin(StepsPlugin);
