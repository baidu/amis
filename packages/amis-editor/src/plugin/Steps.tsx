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
        title: '属性',
        body: getSchemaTpl('collapseGroup', [
          {
            title: '基本',
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
              getSchemaTpl('apiControl', {
                name: 'source',
                label: '获取步骤接口'
              })
            ]
          },
          getSchemaTpl('status')
        ])
      },
      {
        title: '外观',
        body: getSchemaTpl('collapseGroup', [
          {
            title: '基本',
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
              getSchemaTpl('switch', {
                name: 'iconPosition',
                label: '图标文字垂直展示',
                value: false
              })
            ]
          },
          getSchemaTpl('theme:base', {
            label: '基本样式',
            name: 'themeCss.base'
          }),
          getSchemaTpl('collapseGroup', [
            {
              title: '图标样式',
              body: [
                getSchemaTpl('switch', {
                  name: 'stepIcon',
                  label: '显示图标'
                }),
                {
                  type: 'select',
                  name: 'stepIconType',
                  label: '类型',
                  options: [
                    {
                      label: '默认',
                      value: ''
                    },
                    {
                      label: '成功',
                      value: 'success'
                    },
                    {
                      label: '错误',
                      value: 'error'
                    },
                    {
                      label: '警告',
                      value: 'warning'
                    }
                  ]
                },
                {
                  type: 'select',
                  name: 'stepIconSize',
                  label: '尺寸',
                  options: [
                    {
                      label: '小号',
                      value: 'xs'
                    },
                    {
                      label: '默认',
                      value: ''
                    },
                    {
                      label: '大号',
                      value: 'lg'
                    }
                  ]
                },
                getSchemaTpl('theme:colorPicker', {
                  label: '颜色',
                  name: 'themeCss.iconControlClassName.colorPicker',
                  labelMode: 'input'
                }),
                getSchemaTpl('switch', {
                  name: 'stepIconCustom',
                  label: '自定义图标',
                  // 依赖 stepIcon
                  dependencies: {
                    stepIcon: true
                  }
                })
              ]
            }
          ]),
          getSchemaTpl('collapseGroup', [
            {
              title: '标题样式',
              body: [
                getSchemaTpl('switch', {
                  name: 'stepTitle',
                  label: '显示标题'
                }),
                getSchemaTpl('theme:font', {
                  label: '文字',
                  name: 'themeCss.titleControlClassName.font'
                })
              ]
            }
          ]),
          getSchemaTpl('collapseGroup', [
            {
              title: '副标题样式',
              body: [
                getSchemaTpl('switch', {
                  name: 'stepSubTitle',
                  label: '显示副标题'
                }),
                getSchemaTpl('theme:font', {
                  label: '文字',
                  name: 'themeCss.subTitleControlClassName.font'
                })
              ]
            }
          ]),
          getSchemaTpl('collapseGroup', [
            {
              title: '描述样式',
              body: [
                getSchemaTpl('switch', {
                  name: 'stepDescription',
                  label: '显示描述'
                }),
                {
                  type: 'select',
                  name: 'stepDescriptionPosition',
                  label: '描述位置',
                  options: [
                    {
                      label: '顶部',
                      value: 'top'
                    },
                    {
                      label: '底部',
                      value: 'bottom'
                    }
                  ]
                },
                getSchemaTpl('theme:font', {
                  label: '文字',
                  name: 'themeCss.descriptionControlClassName.font'
                })
              ]
            }
          ]),
          getSchemaTpl('theme:cssCode'),
          getSchemaTpl('style:classNames', {isFormItem: false})
        ])
      }
    ])
  ];
}

registerEditorPlugin(StepsPlugin);
