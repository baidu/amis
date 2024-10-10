import {
  registerEditorPlugin,
  BasePlugin,
  getSchemaTpl,
  tipedLabel
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
