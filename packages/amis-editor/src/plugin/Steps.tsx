/**
 * @file Steps 步骤条
 */
import {registerEditorPlugin} from 'amis-editor-core';
import {BasePlugin} from 'amis-editor-core';
import {getSchemaTpl} from 'amis-editor-core';
import {
  inputStepStateTpl,
  inputSwitchStateTpl
} from '../renderer/style-control/helper';
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
              {
                name: '__editorStateStep',
                type: 'select',
                label: '步骤状态',
                value: 'Default',
                clearable: true,
                options: [
                  {
                    label: '常规',
                    value: 'Default'
                  },
                  {
                    label: '完成',
                    value: 'Finish'
                  },
                  {
                    label: '进行中',
                    value: 'Process'
                  },
                  {
                    label: '等待',
                    value: 'Wait'
                  },
                  {
                    label: '出错',
                    value: 'Error'
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
                ...inputSwitchStateTpl('themeCss.iconControlClassName', {}, [
                  getSchemaTpl('switch', {
                    name: 'themeCss.iconControlClassName.display',
                    label: '隐藏图标',
                    trueValue: 'none'
                  })
                ]),
                ...inputSwitchStateTpl(
                  'themeCss.iconControlClassName',
                  {
                    hiddenOn:
                      'themeCss.iconControlClassNameFinish.display ==="none"' +
                      '||' +
                      'themeCss.iconControlClassNameDefault.display ==="none"' +
                      '||' +
                      'themeCss.iconControlClassNameProcess.display ==="none"' +
                      '||' +
                      'themeCss.iconControlClassNameWait.display ==="none"' +
                      '||' +
                      'themeCss.iconControlClassNameError.display ==="none"'
                  },
                  [
                    getSchemaTpl('theme:select', {
                      label: '尺寸',
                      name: 'themeCss.iconControlClassName.iconSize'
                    }),
                    getSchemaTpl('theme:colorPicker', {
                      label: '颜色',
                      name: 'themeCss.iconControlClassName.backgroundColor',
                      labelMode: 'input'
                    })
                  ]
                )
              ]
            }
          ]),
          getSchemaTpl('collapseGroup', [
            {
              title: '标题样式',
              body: [
                ...inputSwitchStateTpl('themeCss.titleControlClassName', {}, [
                  getSchemaTpl('switch', {
                    name: 'themeCss.titleControlClassName.display',
                    label: '隐藏标题',
                    trueValue: 'none'
                  })
                ]),
                ...inputStepStateTpl('themeCss.titleControlClassName', '', {
                  hideFont: false,
                  hiddenOn:
                    'themeCss.titleControlClassNameFinish.display ==="none"' +
                    '||' +
                    'themeCss.titleControlClassNameDefault.display ==="none"' +
                    '||' +
                    'themeCss.titleControlClassNameProcess.display ==="none"' +
                    '||' +
                    'themeCss.titleControlClassNameWait.display ==="none"' +
                    '||' +
                    'themeCss.titleControlClassNameError.display ==="none"'
                })
              ]
            }
          ]),
          getSchemaTpl('collapseGroup', [
            {
              title: '副标题样式',
              body: [
                ...inputSwitchStateTpl(
                  'themeCss.subTitleControlClassName',
                  {},
                  [
                    getSchemaTpl('switch', {
                      name: 'themeCss.subTitleControlClassName.display',
                      label: '隐藏副标题',
                      trueValue: 'none'
                    })
                  ]
                ),
                ...inputStepStateTpl('themeCss.subTitleControlClassName', '', {
                  hideFont: false,
                  hiddenOn:
                    'themeCss.subTitleControlClassNameFinish.display ==="none"' +
                    '||' +
                    'themeCss.subTitleControlClassNameDefault.display ==="none"' +
                    '||' +
                    'themeCss.subTitleControlClassNameProcess.display ==="none"' +
                    '||' +
                    'themeCss.subTitleControlClassNameWait.display ==="none"' +
                    '||' +
                    'themeCss.subTitleControlClassNameError.display ==="none"'
                })
              ]
            }
          ]),
          getSchemaTpl('collapseGroup', [
            {
              title: '描述样式',
              body: [
                ...inputSwitchStateTpl(
                  'themeCss.descriptionControlClassName',
                  {},
                  [
                    getSchemaTpl('switch', {
                      name: 'themeCss.descriptionControlClassName.display',
                      label: '隐藏描述',
                      trueValue: 'none'
                    })
                  ]
                ),
                ...inputStepStateTpl(
                  'themeCss.descriptionControlClassName',
                  '',
                  {
                    hideFont: false,
                    hiddenOn:
                      'themeCss.descriptionControlClassNameFinish.display ==="none"' +
                      '||' +
                      'themeCss.descriptionControlClassNameDefault.display ==="none"' +
                      '||' +
                      'themeCss.descriptionControlClassNameProcess.display ==="none"' +
                      '||' +
                      'themeCss.descriptionControlClassNameWait.display ==="none"' +
                      '||' +
                      'themeCss.descriptionControlClassNameError.display ==="none"'
                  }
                )
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
