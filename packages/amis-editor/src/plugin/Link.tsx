import {
  registerEditorPlugin,
  BasePlugin,
  getSchemaTpl,
  tipedLabel,
  defaultValue
} from 'amis-editor-core';

export class LinkPlugin extends BasePlugin {
  static id = 'LinkPlugin';
  static scene = ['layout'];
  // 关联渲染器名字
  rendererName = 'link';
  $schema = '/schemas/LinkSchema.json';

  // 组件名称
  name = '链接';
  isBaseComponent = true;
  description = '用来展示文字链接';
  tags = ['展示'];
  icon = 'fa fa-link';
  pluginIcon = 'url-plugin';
  scaffold = {
    type: 'link',
    value: 'http://www.baidu.com/'
  };
  previewSchema = {
    ...this.scaffold,
    label: this.name
  };

  panelTitle = '链接';
  panelJustify = true;
  panelBody = [
    getSchemaTpl('tabs', [
      {
        title: '属性',
        body: getSchemaTpl('collapseGroup', [
          {
            title: '基本',
            body: [
              getSchemaTpl('layout:originPosition', {value: 'left-top'}),
              getSchemaTpl('valueFormula', {
                name: 'href',
                label: tipedLabel(
                  '目标地址',
                  '支持取变量，如果已绑定字段名，可以不用设置'
                ),
                rendererSchema: {
                  type: 'input-text'
                }
              }),
              {
                type: 'input-number',
                label: '最大显示行数',
                name: 'maxLine',
                min: 0
              },
              {
                type: 'ae-switch-more',
                formType: 'extend',
                mode: 'normal',
                label: '气泡提示',
                form: {
                  body: [
                    getSchemaTpl('textareaFormulaControl', {
                      name: 'tooltip',
                      mode: 'normal',
                      label: tipedLabel(
                        '正常提示',
                        '正常状态下的提示内容，不填则不弹出提示。可从数据域变量中取值。'
                      )
                    }),
                    getSchemaTpl('textareaFormulaControl', {
                      name: 'disabledTip',
                      mode: 'normal',
                      label: tipedLabel(
                        '禁用提示',
                        '禁用状态下的提示内容，不填则弹出正常提示。可从数据域变量中取值。'
                      ),
                      clearValueOnHidden: true,
                      visibleOn: 'data.tooltipTrigger !== "focus"'
                    }),
                    {
                      type: 'button-group-select',
                      name: 'tooltipTrigger',
                      label: '触发方式',
                      size: 'sm',
                      options: [
                        {
                          label: '鼠标悬浮',
                          value: 'hover'
                        },
                        {
                          label: '聚焦',
                          value: 'focus'
                        }
                      ],
                      pipeIn: defaultValue('hover')
                    },
                    {
                      type: 'button-group-select',
                      name: 'tooltipPlacement',
                      label: '提示位置',
                      size: 'sm',
                      options: [
                        {
                          label: '上',
                          value: 'top'
                        },
                        {
                          label: '右',
                          value: 'right'
                        },
                        {
                          label: '下',
                          value: 'bottom'
                        },
                        {
                          label: '左',
                          value: 'left'
                        }
                      ],
                      pipeIn: defaultValue('bottom')
                    }
                  ]
                }
              },
              {
                label: tipedLabel('内容', '不填写时，自动使用目标地址值'),
                type: 'ae-textareaFormulaControl',
                mode: 'normal',
                pipeIn: (value: any, data: any) => value || (data && data.html),
                name: 'body'
              },
              getSchemaTpl('switch', {
                name: 'blank',
                label: '在新窗口打开'
              }),

              getSchemaTpl('iconLink', {
                name: 'icon',
                label: '左侧图标'
              }),

              getSchemaTpl('iconLink', {
                name: 'rightIcon',
                label: '右侧图标'
              })
            ]
          },
          getSchemaTpl('collapseGroup', [
            {
              title: '高级设置',
              body: [
                {
                  name: 'htmlTarget',
                  type: 'input-text',
                  label: tipedLabel(
                    '锚点',
                    'HTML &lt;a&gt; 元素的target属性，该属性指定在何处显示链接的资源'
                  )
                }
              ]
            }
          ]),
          getSchemaTpl('status', {
            disabled: true
          })
        ])
      },
      {
        title: '外观',
        body: getSchemaTpl('collapseGroup', [
          getSchemaTpl('style:classNames', {
            isFormItem: false,
            schema: [
              getSchemaTpl('className', {
                name: 'iconClassName',
                label: '左侧图标',
                visibleOn: 'this.icon'
              }),
              getSchemaTpl('className', {
                name: 'rightIconClassName',
                label: '右侧图标',
                visibleOn: 'this.rightIcon'
              })
            ]
          })
        ])
      }
    ])
  ];
}

registerEditorPlugin(LinkPlugin);
