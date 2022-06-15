import {Button} from 'amis';
import React from 'react';
import {registerEditorPlugin} from 'amis-editor-core';
import {
  BaseEventContext,
  BasePlugin,
  ContextMenuEventContext,
  ContextMenuItem,
  PluginEvent,
  RendererJSONSchemaResolveEventContext,
  VRendererConfig,
  ResizeMoveEventContext
} from 'amis-editor-core';
import {defaultValue, getSchemaTpl} from 'amis-editor-core';
import {EditorNodeType} from 'amis-editor-core';
import {Schema} from 'amis/lib/types';
import {VRenderer} from 'amis-editor-core';
import {RegionWrapper as Region} from 'amis-editor-core';
import {JSONChangeInArray, JSONPipeIn, repeatArray} from 'amis-editor-core';
import {Icon} from 'amis-editor-core';

export class HBoxPlugin extends BasePlugin {
  // 关联渲染器名字
  rendererName = 'hbox';
  $schema = '/schemas/HBoxSchema.json';
  disabledRendererPlugin = true; // 组件面板不显示

  // 组件名称
  name = 'HBox';
  isBaseComponent = true;
  icon = 'fa fa-columns';
  description =
    '用来实现左右排版布局，默认平均分配，可以通过 columnClassName 配置某列的宽度。';
  docLink = '/amis/zh-CN/components/hbox';
  tags = ['容器'];
  scaffold = {
    type: 'hbox',
    gap: 'base',
    columns: [
      {
        body: []
      },
      {
        body: []
      }
    ]
  };
  previewSchema = {
    type: 'hbox',
    columns: [
      {
        type: 'tpl',
        tpl: '固定宽度<br />w-xs',
        columnClassName: 'bg-primary w-xs'
      },
      {
        type: 'tpl',
        tpl: '自动填满',
        columnClassName: 'bg-success'
      }
    ]
  };

  panelTitle = 'HBox';
  panelBodyCreator = (context: BaseEventContext) => [
    getSchemaTpl('tabs', [
      {
        title: '常规',
        body: [
          getSchemaTpl('fieldSet', {
            title: '插入',
            collapsable: false,
            body: [
              {
                type: 'wrapper',
                size: 'none',
                className: 'grid grid-cols-2 gap-4 mb-4',
                body: [
                  {
                    children: (
                      <Button
                        size="sm"
                        onClick={() => this.insertRowAfter(context.node)}
                      >
                        <Icon className="icon" icon="arrow-to-bottom" />
                        <span>下方插入新行</span>
                      </Button>
                    )
                  },
                  {
                    children: (
                      <Button
                        size="sm"
                        onClick={() => this.insertRowBefore(context.node)}
                      >
                        <Icon className="icon" icon="top-arrow-to-top" />
                        <span>上方插入新行</span>
                      </Button>
                    )
                  }
                ]
              },

              {
                label: '列数',
                name: 'columns',
                type: 'select',
                pipeIn: (value: any) =>
                  Array.isArray(value) ? value.length : undefined,
                pipeOut: (value: any, origin: any) => {
                  if (Array.isArray(origin)) {
                    if (origin.length > value) {
                      origin = origin.concat();
                      origin.splice(value - 1, origin.length - value);
                    } else {
                      origin = origin.concat(
                        repeatArray(
                          {
                            body: []
                          },
                          value - origin.length
                        )
                      );
                    }
                  }

                  return origin;
                },
                options: repeatArray(null, 12).map((_, index) => ({
                  label: `${index + 1}`,
                  value: index + 1
                }))
              }
            ]
          }),

          {
            type: 'list-select',
            name: 'gap',
            label: '列间距',
            size: 'sm',
            clearable: true,
            tiled: true,
            options: [
              {
                label: '极小',
                value: 'xs'
              },
              {
                label: '小',
                value: 'sm'
              },
              {
                label: '正常',
                value: 'base'
              },
              {
                label: '中',
                value: 'md'
              },
              {
                label: '大',
                value: 'lg'
              }
            ]
          },

          {
            name: 'columns',
            label: '列集合',
            type: 'combo',
            scaffold: {
              body: []
            },
            minLength: 1,
            multiple: true,
            // draggable: true,
            draggableTip: '',
            items: [
              {
                type: 'tpl',
                tpl:
                  '<span class="label label-default">列${index | plus}</span>',
                columnClassName: 'no-grow v-middle'
              },
              getSchemaTpl('className', {
                name: 'columnClassName',
                labelRemark: '',
                label: ''
              })
            ]
          },
          getSchemaTpl('fieldSet', {
            title: '水平对齐',
            collapsable: false,
            body: [
              {
                type: 'button-group-select',
                name: 'align',
                size: 'sm',
                label: false,
                tiled: true,
                pipeIn: defaultValue('left'),
                options: [
                  {
                    value: 'left',
                    label: '左对齐'
                  },
                  {
                    value: 'center',
                    label: '中间对齐'
                  },
                  {
                    value: 'right',
                    label: '右对齐'
                  },
                  {
                    value: 'between',
                    label: '两端对齐'
                  }
                ]
              }
            ]
          }),

          getSchemaTpl('fieldSet', {
            title: '垂直对齐',
            collapsable: false,
            body: [
              {
                type: 'button-group-select',
                name: 'valign',
                size: 'sm',
                label: false,
                tiled: true,
                pipeIn: defaultValue('top'),
                options: [
                  {
                    value: 'top',
                    label: '顶部对齐'
                  },
                  {
                    value: 'middle',
                    label: '中间对齐'
                  },
                  {
                    value: 'bottom',
                    label: '底部对齐'
                  },
                  {
                    value: 'between',
                    label: '两端对齐'
                  }
                ]
              }
            ]
          })
        ]
      },
      {
        title: '外观',
        body: [
          getSchemaTpl('className'),
          getSchemaTpl('subFormItemMode'),
          getSchemaTpl('subFormHorizontalMode'),
          getSchemaTpl('subFormHorizontal')
        ]
      },
      {
        title: '显隐',
        body: [getSchemaTpl('visible')]
      }
    ])
  ];

  vRendererConfig: VRendererConfig = {
    regions: {
      body: {
        key: 'body',
        label: '内容区',
        placeholder: '列',
        wrapperResolve: (dom: HTMLElement) => dom
      }
    },
    panelTitle: '列',
    panelBodyCreator: (context: BaseEventContext) => {
      return [
        getSchemaTpl('tabs', [
          {
            title: '常规',
            body: [
              getSchemaTpl('fieldSet', {
                title: '插入',
                collapsable: false,
                body: [
                  {
                    type: 'wrapper',
                    size: 'none',
                    className: 'grid grid-cols-2 gap-4',
                    body: [
                      {
                        children: (
                          <Button
                            size="sm"
                            onClick={() =>
                              this.insertRowAfter(context.node.host)
                            }
                          >
                            <Icon className="icon" icon="arrow-to-bottom" />
                            <span>下方插入新行</span>
                          </Button>
                        )
                      },
                      {
                        children: (
                          <Button
                            size="sm"
                            onClick={() =>
                              this.insertRowBefore(context.node.host)
                            }
                          >
                            <Icon className="icon" icon="top-arrow-to-top" />
                            <span>上方插入新行</span>
                          </Button>
                        )
                      },
                      {
                        children: (
                          <Button
                            size="sm"
                            onClick={() => this.insertColumnBefore(context)}
                          >
                            <Icon className="icon" icon="left-arrow-to-left" />
                            <span>左侧插入新列</span>
                          </Button>
                        )
                      },
                      {
                        children: (
                          <Button
                            size="sm"
                            onClick={() => this.insertColumnAfter(context)}
                          >
                            <Icon className="icon" icon="arrow-to-right" />
                            <span>右侧插入新列</span>
                          </Button>
                        )
                      }
                    ]
                  }
                ]
              }),

              getSchemaTpl('fieldSet', {
                title: '宽度设置',
                collapsable: false,
                body: [
                  {
                    type: 'button-group-select',
                    name: 'width',
                    size: 'sm',
                    label: false,
                    pipeIn: (value: any) =>
                      value && value !== 'auto' ? 'manual' : value || '',
                    pipeOut: (value: any) =>
                      value === 'manual' ? '20%' : value,
                    options: [
                      {
                        value: '',
                        label: '适配宽度'
                      },
                      {
                        value: 'auto',
                        label: '适配内容'
                      },
                      {
                        value: 'manual',
                        label: '手动'
                      }
                    ],
                    description:
                      '<% if (this.width && this.width !== "auto") {%>请按住高亮框右侧方块拖动调整宽度<%}%>'
                  }
                ]
              }),

              getSchemaTpl('fieldSet', {
                title: '垂直对齐',
                collapsable: false,
                body: [
                  {
                    type: 'button-group-select',
                    name: 'valign',
                    size: 'sm',
                    label: false,
                    tiled: true,
                    clearable: true,
                    options: [
                      {
                        value: 'top',
                        label: '顶部对齐'
                      },
                      {
                        value: 'middle',
                        label: '中间对齐'
                      },
                      {
                        value: 'bottom',
                        label: '底部对齐'
                      },
                      {
                        value: 'between',
                        label: '两端对齐'
                      }
                    ]
                  }
                ]
              })
            ]
          },
          {
            title: '外观',
            body: [
              getSchemaTpl('className', {
                name: 'columnClassName',
                label: '列 CSS 类名',
                description: '可以添加宽度类样式调整宽度，默认宽度为平均分配。'
              })
            ]
          }
        ])
      ];
    }
  };

  vWrapperResolve = (dom: HTMLElement) => dom;
  overrides = {
    renderColumn: function (this: any, node: Schema, index: number) {
      const dom = this.super(node, index);
      const info = this.props.$$editor;

      if (info && node.$$id) {
        const plugin: HBoxPlugin = info.plugin as any;
        const region = plugin.vRendererConfig?.regions?.body;
        if (!region) {
          return dom;
        }

        return (
          <VRenderer
            key={node.$$id}
            type={info.type}
            plugin={info.plugin}
            renderer={info.renderer}
            $schema="" // /schemas/GridColumn.json
            hostId={info.id}
            memberIndex={index}
            name={`第${index + 1}列`}
            id={node.$$id}
            draggable={false}
            schemaPath={`${info.schemaPath}/hbox/${index}`}
            wrapperResolve={plugin.vWrapperResolve}
            path={`${this.props.$path}/${index}`} // 好像没啥用
            data={this.props.data} // 好像没啥用
            widthMutable
          >
            {region ? (
              <Region
                key={region.key}
                preferTag={region.preferTag}
                name={region.key}
                label={region.label}
                regionConfig={region}
                placeholder={region.placeholder}
                editorStore={plugin.manager.store}
                manager={plugin.manager}
                children={dom}
                wrapperResolve={region.wrapperResolve}
                rendererName={info.renderer.name}
              />
            ) : (
              dom
            )}
          </VRenderer>
        );
      }
      return dom;
    }
  };

  // buildEditorPanel(context: BaseEventContext, panels: Array<BasicPanelItem>) {
  //   super.buildEditorPanel(context, panels);
  //   const parent = context.node.parent?.host as EditorNodeType;

  //   if (
  //     parent?.info?.plugin === this &&
  //     (this.vRendererConfig.panelControls ||
  //       this.vRendererConfig.panelControlsCreator)
  //   ) {
  //     panels.push({
  //       key: 'grid',
  //       order: 100,
  //       icon: this.vRendererConfig.panelIcon || 'fa fa-tablet',
  //       title: this.vRendererConfig.panelTitle || '格子',
  //       render: this.manager.makeSchemaFormRender({
  //         body: this.vRendererConfig.panelControlsCreator
  //           ? this.vRendererConfig.panelControlsCreator(context)
  //           : this.vRendererConfig.panelControls!
  //       })
  //     });
  //   }
  // }

  afterResolveJsonSchema(
    event: PluginEvent<RendererJSONSchemaResolveEventContext>
  ) {
    const context = event.context;
    const parent = context.node.parent?.host as EditorNodeType;

    if (parent?.info?.plugin === this) {
      event.setData('/schemas/HBoxColumn.json');
    }
  }

  buildEditorContextMenu(
    context: ContextMenuEventContext,
    menus: Array<ContextMenuItem>
  ) {
    if (context.selections.length || context.info?.plugin !== this) {
      return;
    }

    if (context.node.isVitualRenderer) {
      menus.push('|');

      menus.push({
        label: '左侧插入一列',
        onSelect: () => this.insertColumnBefore(context)
      });

      menus.push({
        label: '右侧插入一列',
        onSelect: () => this.insertColumnAfter(context)
      });

      menus.push('|');

      menus.push({
        label: '上方插入一行',
        onSelect: () => this.insertRowBefore(context.node.host)
      });

      menus.push({
        label: '下方插入一行',
        onSelect: () => this.insertRowAfter(context.node.host)
      });
    } else {
      menus.push('|');

      menus.push({
        label: '上方插入一行',
        onSelect: () => this.insertRowBefore(context.node)
      });

      menus.push({
        label: '下方插入一行',
        onSelect: () => this.insertRowAfter(context.node)
      });
    }
  }

  onWidthChangeStart(
    event: PluginEvent<
      ResizeMoveEventContext,
      {
        onMove(e: MouseEvent): void;
        onEnd(e: MouseEvent): void;
      }
    >
  ) {
    const context = event.context;
    const node = context.node;
    if (node.info?.plugin !== this) {
      return;
    }
    const host = node.host;
    if (!host || host.info?.plugin !== this) {
      return;
    }

    const dom = context.dom;
    const parent = dom.parentElement as HTMLElement;
    if (!parent) {
      return;
    }
    const resizer = context.resizer;
    const frameRect = parent.getBoundingClientRect();
    let columns = host.schema.columns;
    const index = node.index;
    let finalWidth = columns[index].width;
    const rect = dom.getBoundingClientRect();

    event.setData({
      onMove: (e: MouseEvent) => {
        const width = e.pageX - rect.left;
        const percent = (finalWidth = `${Math.max(
          1,
          Math.min(99, Math.round((100 * width) / frameRect.width))
        )}%`);
        columns = columns.concat();
        columns[index] = {
          ...columns[index],
          width: percent
        };
        resizer.setAttribute('data-value', percent);

        host.updateState({
          columns
        });
        requestAnimationFrame(() => {
          node.calculateHighlightBox();
        });
      },
      onEnd: () => {
        host.updateState({}, true);
        resizer.removeAttribute('data-value');
        node.updateSchema({
          width: finalWidth
        });
        requestAnimationFrame(() => {
          node.calculateHighlightBox();
        });
      }
    });
  }

  insertRowAfter(node: EditorNodeType) {
    if (node.info?.plugin !== this) {
      return;
    }
    const store = this.manager.store;
    const schema = store.schema;
    const id = node.id;
    store.traceableSetSchema(
      JSONChangeInArray(schema, id, (arr: any[], node: any, index: number) => {
        arr.splice(
          index + 1,
          0,
          JSONPipeIn({
            type: 'hbox',
            align: node.align,
            valign: node.valign,
            columns: node.columns.map((column: any) => ({
              body: [],
              width: column?.width
            }))
          })
        );
      })
    );
  }
  insertRowBefore(node: EditorNodeType) {
    if (node.info?.plugin !== this) {
      return;
    }
    const store = this.manager.store;
    const id = node.id;
    const schema = store.schema;
    store.traceableSetSchema(
      JSONChangeInArray(schema, id, (arr: any[], node: any, index: number) => {
        arr.splice(
          index,
          0,
          JSONPipeIn({
            type: 'hbox',
            align: node.align,
            valign: node.valign,
            columns: node.columns.map((column: any) => ({
              body: [],
              width: column?.width
            }))
          })
        );
      })
    );
  }
  insertColumnBefore(context: BaseEventContext) {
    const node = context.node;
    if (node.info?.plugin !== this) {
      return;
    }
    const store = this.manager.store;
    const schema = store.schema;
    const id = context.id;
    store.traceableSetSchema(
      JSONChangeInArray(schema, id, (arr: any[], node: any, index: number) => {
        arr.splice(
          index,
          0,
          JSONPipeIn({
            body: []
          })
        );
      })
    );
  }
  insertColumnAfter(context: BaseEventContext) {
    const node = context.node;
    if (node.info?.plugin !== this) {
      return;
    }
    const id = context.id;
    const store = this.manager.store;
    const schema = store.schema;
    store.traceableSetSchema(
      JSONChangeInArray(schema, id, (arr: any[], node: any, index: number) => {
        arr.splice(
          index + 1,
          0,
          JSONPipeIn({
            body: []
          })
        );
      })
    );
  }
}

registerEditorPlugin(HBoxPlugin);
