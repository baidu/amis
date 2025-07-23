import {Button} from 'amis';
import React from 'react';
import {
  BasePlugin,
  BaseEventContext,
  BasicPanelItem,
  RegionConfig,
  RendererInfo,
  BuildPanelEventContext,
  defaultValue,
  getSchemaTpl,
  registerEditorPlugin,
  PluginInterface
} from 'amis-editor-core';
import {InlineEditableElement} from 'amis-editor-core';

export class PanelPlugin extends BasePlugin {
  static id = 'PanelPlugin';
  // 关联渲染器名字
  rendererName = 'panel';
  useLazyRender = true; // 使用懒渲染
  $schema = '/schemas/panelSchema.json';

  name = '面板';
  isBaseComponent = true;
  icon = 'fa fa-window-maximize';
  pluginIcon = 'panel-plugin';
  description = '展示一个面板，可以配置标题，内容区。';
  docLink = '/amis/zh-CN/components/panel';
  tags = ['布局容器'];
  scaffold = {
    type: 'panel',
    title: '标题',
    body: '内容'
  };
  previewSchema = {
    type: 'panel',
    title: '这是一个面板',
    body: '这是内容区',
    className: 'Panel--default text-left m-b-none',
    actions: [
      {
        label: '按钮1',
        type: 'button'
      },
      {
        label: '按钮2',
        type: 'button'
      }
    ]
  };

  regions: Array<RegionConfig> = [
    {
      key: 'body',
      label: '内容区',

      // 复写渲染器里面的 renderBody 方法
      renderMethod: 'renderBody',

      // 这个 case 很另类，要自己写。form 里面直接复用了 Panel 来输出内容。
      // 这种 case 应该跳过包裹 Region
      // 只有他自己输出时才包裹，form 调用进来是下发了 children 来完成渲染
      // 自己的话是其他方式。
      renderMethodOverride: (regions, insertRegion) =>
        function (this: any, ...args: any[]) {
          const info: RendererInfo = this.props.$$editor;
          const dom = this.super(...args);

          if (info && !this.props.children) {
            return insertRegion(this, dom, regions, info, info.plugin.manager);
          }

          return dom;
        }
    },

    {
      key: 'actions',
      label: '按钮组',
      renderMethod: 'renderActions',
      preferTag: '按钮'
    }
  ];

  // 定义可以内联编辑的元素
  inlineEditableElements: Array<InlineEditableElement> = [
    {
      match: ':scope.cxd-Panel .cxd-Panel-title',
      key: 'title'
    }
  ];

  panelTitle = '面板';

  panelJustify = true;

  panelBodyCreator = (context: BaseEventContext) => {
    const isForm =
      /(?:^|\/)form$/.test(context.path) || context?.schema?.type === 'form';

    return [
      getSchemaTpl('tabs', [
        {
          title: '属性',
          body: [
            getSchemaTpl('collapseGroup', [
              {
                className: 'p-none',
                id: 'properties-basic',
                title: '基本',
                body: [
                  getSchemaTpl('layout:originPosition', {value: 'left-top'}),
                  getSchemaTpl('title'),
                  isForm
                    ? null
                    : {
                        children: (
                          <Button
                            size="sm"
                            level="info"
                            className="m-b"
                            onClick={() => {
                              // this.manager.showInsertPanel('body')
                              this.manager.showRendererPanel('');
                            }}
                            block
                          >
                            内容区新增内容
                          </Button>
                        )
                      }
                ]
              },
              getSchemaTpl('status')
            ])
          ]
        },
        {
          title: '外观',
          body: [
            getSchemaTpl('collapseGroup', [
              ...getSchemaTpl('theme:common', {
                exclude: ['layout'],
                classname: 'baseControlClassName',
                needState: false,
                baseTitle: '基本样式',
                extra: [
                  getSchemaTpl('theme:base', {
                    classname: 'headerControlClassName',
                    needState: false,
                    title: '标题区样式',
                    extra: [
                      getSchemaTpl('theme:font', {
                        label: '文字',
                        name: 'themeCss.titleControlClassName.font'
                      })
                    ]
                  }),
                  getSchemaTpl('theme:base', {
                    classname: 'bodyControlClassName',
                    needState: false,
                    title: '内容区样式',
                    extra: [
                      getSchemaTpl('subFormItemMode', {label: '表单展示模式'}),
                      getSchemaTpl('subFormHorizontalMode', {
                        label: '表单水平占比'
                      }),
                      getSchemaTpl('subFormHorizontal')
                    ]
                  }),
                  getSchemaTpl('theme:base', {
                    classname: 'footerControlClassName',
                    needState: false,
                    title: '底部区样式',
                    extra: [
                      getSchemaTpl('switch', {
                        name: 'affixFooter',
                        label: '固定底部',
                        value: false
                      })
                    ]
                  })
                ]
              }),
              getSchemaTpl('style:classNames', {
                isFormItem: false,
                schema: [
                  getSchemaTpl('className', {
                    name: 'headerClassName',
                    label: '头部区域'
                  }),

                  getSchemaTpl('className', {
                    name: 'bodyClassName',
                    label: '内容区域'
                  }),

                  getSchemaTpl('className', {
                    name: 'footerClassName',
                    label: '底部区域'
                  }),

                  getSchemaTpl('className', {
                    name: 'actionsClassName',
                    label: '按钮外层'
                  }),
                  {
                    name: isForm ? 'panelClassName' : 'className',
                    label: '主题',
                    type: 'select',
                    size: 'sm',
                    id: 'panel-settings-panelClassName',
                    pipeIn: (value: any) =>
                      typeof value === 'string' &&
                      /(?:^|\s)(Panel\-\-(\w+))(?:$|\s)/.test(value)
                        ? RegExp.$1
                        : 'Panel--default',
                    pipeOut: (value: string, origin: string) =>
                      origin
                        ? `${origin.replace(
                            /(?:^|\s)(Panel\-\-(\w+))(?=($|\s))/g,
                            ''
                          )} ${value}`
                            .replace(/\s+/g, ' ')
                            .trim()
                        : value,
                    options: [
                      {
                        label: '默认',
                        value: 'Panel--default'
                      },
                      {
                        label: '主色',
                        value: 'Panel--primary'
                      },
                      {
                        label: '提示',
                        value: 'Panel--info'
                      },
                      {
                        label: '成功',
                        value: 'Panel--success'
                      },
                      {
                        label: '警告',
                        value: 'Panel--warning'
                      },
                      {
                        label: '危险',
                        value: 'Panel--danger'
                      }
                    ]
                  }
                ]
              })
            ])
          ]
        }
      ])
    ];
  };

  buildEditorPanel(
    context: BuildPanelEventContext,
    panels: Array<BasicPanelItem>
  ) {
    const plugin: PluginInterface = this;
    const schema = context.schema;
    const store = this.manager.store;

    if (
      context.info.renderer.name === 'form' &&
      schema.wrapWithPanel !== false &&
      !context.selections.length &&
      false
    ) {
      /** Panel相关的配置融合到From中了 */
      panels.push({
        key: 'panel',
        icon: 'fa fa-list-alt',
        pluginIcon: plugin.pluginIcon,
        title: this.panelTitle,
        render: this.manager.makeSchemaFormRender({
          body: this.panelBodyCreator(context),
          panelById: store.activeId
        })
      });
    } else {
      super.buildEditorPanel(context, panels);
    }
  }
}

registerEditorPlugin(PanelPlugin);
