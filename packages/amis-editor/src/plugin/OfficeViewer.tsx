import {RendererPluginAction, registerEditorPlugin} from 'amis-editor-core';
import {BaseEventContext, BasePlugin} from 'amis-editor-core';
import {defaultValue, getSchemaTpl} from 'amis-editor-core';

export class OfficeViewerPlugin extends BasePlugin {
  static scene = ['layout'];
  // 关联渲染器名字
  rendererName = 'office-viewer';
  $schema = '/schemas/OfficeViewerSchema.json';

  // 组件名称
  name = '文档预览';
  isBaseComponent = true;
  description = 'Office 文档预览';
  docLink = '/amis/zh-CN/components/OfficeViewer';
  tags = ['展示'];
  icon = 'fa fa-file-word';
  pluginIcon = 'officeViewer-plugin';
  scaffold = {
    type: 'office-viewer'
  };
  previewSchema = {
    ...this.scaffold
  };

  panelTitle = '文档预览';

  panelJustify = true;

  actions: RendererPluginAction[] = [
    {
      actionType: 'print',
      actionLabel: '打印',
      description: '打印文档'
    },
    {
      actionType: 'saveAs',
      actionLabel: '下载',
      description: '下载文档'
    }
  ];

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
                  getSchemaTpl('officeUrl', {
                    name: 'src',
                    type: 'input-text',
                    label: '文档地址'
                  }),

                  getSchemaTpl('switch', {
                    type: 'switch',
                    label: '是否渲染',
                    name: 'display',
                    pipeIn: defaultValue(true),
                    inline: true
                  })
                ]
              },

              {
                title: 'Word 渲染配置',
                collapsed: true,
                body: [
                  {
                    type: 'combo',
                    name: 'wordOptions',
                    // panelJustify 下需要加这个
                    mode: 'normal',
                    noBorder: true,
                    multiLine: true,
                    items: [
                      getSchemaTpl('switch', {
                        label: '忽略宽度',
                        inline: true,
                        name: 'ignoreWidth'
                      }),
                      {
                        type: 'input-text',
                        label: '页面内边距',
                        name: 'padding'
                      },
                      getSchemaTpl('switch', {
                        label: '列表使用字体',
                        pipeIn: defaultValue(true),
                        name: 'bulletUseFont',
                        inline: true
                      }),
                      getSchemaTpl('switch', {
                        label: '变量替换',
                        name: 'enableVar',
                        inline: true
                      }),
                      {
                        type: 'input-text',
                        label: '强制行高',
                        name: 'forceLineHeight'
                      },
                      {
                        type: 'input-kv',
                        label: '字体映射',
                        name: 'fontMapping'
                      }
                    ]
                  }
                ]
              }
            ])
          ]
        },
        {
          title: '外观',
          className: 'p-none'
        }
      ])
    ];
  };
}

registerEditorPlugin(OfficeViewerPlugin);
