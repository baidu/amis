import {RendererPluginAction, registerEditorPlugin} from 'amis-editor-core';
import {BaseEventContext, BasePlugin} from 'amis-editor-core';
import {defaultValue, getSchemaTpl} from 'amis-editor-core';
import React from 'react';
import {buildLinkActionDesc} from '../renderer/event-control';

export class OfficeViewerPlugin extends BasePlugin {
  static id = 'OfficeViewerPlugin';
  static scene = ['layout'];
  // 关联渲染器名字
  rendererName = 'office-viewer';
  $schema = '/schemas/OfficeViewerSchema.json';

  // 组件名称
  name = '文档预览';
  isBaseComponent = true;
  description = 'Office 文档预览';
  docLink = '/amis/zh-CN/components/office-viewer';
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
      description: '打印文档',
      descDetail: (info: any, context: any, props: any) => {
        return (
          <div className="action-desc">
            打印文档
            {buildLinkActionDesc(props.manager, info)}
          </div>
        );
      }
    },
    {
      actionType: 'saveAs',
      actionLabel: '下载',
      description: '下载文档',
      descDetail: (info: any, context: any, props: any) => {
        return (
          <div className="action-desc">
            下载文档
            {buildLinkActionDesc(props.manager, info)}
          </div>
        );
      }
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
                      },
                      getSchemaTpl('switch', {
                        label: '是否开启分页渲染',
                        name: 'page',
                        inline: true
                      }),
                      {
                        type: 'input-number',
                        label: '页上下边距',
                        name: 'pageMarginBottom',
                        visibleOn: 'this.page'
                      },
                      {
                        type: 'input-color',
                        label: '页背景色',
                        pipeIn: defaultValue('#FFFFFF'),
                        name: 'pageBackground',
                        visibleOn: 'this.page'
                      },
                      getSchemaTpl('switch', {
                        label: '是否显示页面阴影',
                        name: 'pageShadow',
                        inline: true,
                        visibleOn: 'this.page'
                      }),
                      getSchemaTpl('switch', {
                        label: '是否显示页面包裹',
                        name: 'pageWrap',
                        inline: true,
                        visibleOn: 'this.page'
                      }),
                      {
                        type: 'input-number',
                        label: '页面包裹宽度',
                        name: 'pageWrapPadding',
                        visibleOn: 'this.page'
                      },
                      {
                        type: 'input-color',
                        label: '页面包裹背景色',
                        pipeIn: defaultValue('#ECECEC'),
                        name: 'pageWrapBackground',
                        visibleOn: 'this.page'
                      },
                      {
                        type: 'input-number',
                        label: '缩放比例',
                        min: 0.1,
                        max: 1,
                        name: 'zoom',
                        visibleOn: 'this.page'
                      },
                      getSchemaTpl('switch', {
                        label: '自适应宽度',
                        name: 'zoomFitWidth',
                        inline: true,
                        visibleOn: 'this.page'
                      })
                    ]
                  }
                ]
              }
            ])
          ]
        },
        {
          title: '外观',
          body: getSchemaTpl('collapseGroup', [
            getSchemaTpl('style:classNames', {isFormItem: false})
          ])
        }
      ])
    ];
  };
}

registerEditorPlugin(OfficeViewerPlugin);
