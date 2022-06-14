import {Button} from 'amis';
import React from 'react';
import {registerEditorPlugin} from '../manager';
import {
  BaseEventContext,
  BasePlugin,
  ContextMenuEventContext,
  ContextMenuItem,
  PluginEvent,
  ResizeMoveEventContext,
  RendererJSONSchemaResolveEventContext,
  VRendererConfig
} from '../plugin';
import {defaultValue, getSchemaTpl} from '../component/schemaTpl';
import {EditorNodeType} from '../store/node';
import {Schema} from 'amis/lib/types';
import {VRenderer} from '../component/VRenderer';
import {RegionWrapper as Region} from '../component/RegionWrapper';
import {Icon} from '../icons/index';
import {JSONChangeInArray, JSONPipeIn, repeatArray} from '../util';

export class GridPlugin extends BasePlugin {
  // 关联渲染器名字
  rendererName = 'grid';
  $schema = '/schemas/GridSchema.json';

  // 组件名称
  name = '分栏';
  isBaseComponent = true;
  description = '分栏布局';
  docLink = '/amis/zh-CN/components/grid';
  tags = ['容器'];
  icon = 'fa fa-th';

  /*
  scaffolds = [
    {
      name: '两栏',
      description: '两栏布局',
      scaffold: {
        type: 'grid',
        columns: [
          {
            body: []
          },
          {
            body: []
          }
        ]
      },

      previewSchema: {
        type: 'grid',
        columns: [
          {
            body: [
              {
                type: 'tpl',
                tpl: '栏',
                inline: false,
                className: 'bg-light wrapper'
              }
            ]
          },
          {
            body: [
              {
                type: 'tpl',
                tpl: '栏',
                className: 'bg-light wrapper',
                inline: false
              }
            ]
          }
        ]
      }
    },

    {
      name: '三栏',
      description: '三栏布局',
      scaffold: {
        type: 'grid',
        columns: [
          {
            body: []
          },
          {
            body: []
          },
          {
            body: []
          }
        ]
      },

      previewSchema: {
        type: 'grid',
        columns: [
          {
            body: [
              {
                type: 'tpl',
                tpl: '栏',
                inline: false,
                className: 'bg-light wrapper'
              }
            ]
          },
          {
            body: [
              {
                type: 'tpl',
                tpl: '栏',
                className: 'bg-light wrapper',
                inline: false
              }
            ]
          },
          {
            body: [
              {
                type: 'tpl',
                tpl: '栏',
                className: 'bg-light wrapper',
                inline: false
              }
            ]
          }
        ]
      }
    }
  ];
  */

  // 仅保留一个分栏布局
  scaffold = {
    type: 'grid',
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
    type: 'grid',
    columns: [
      {
        body: [
          {
            type: 'tpl',
            tpl: '栏',
            inline: false,
            className: 'bg-light wrapper'
          }
        ]
      },
      {
        body: [
          {
            type: 'tpl',
            tpl: '栏',
            className: 'bg-light wrapper',
            inline: false
          }
        ]
      }
    ]
  };

  panelTitle = '分栏布局';
  panelWithOutOthers = false;
  panelBodyCreator(context: BaseEventContext) {
    const asSecondFactor = context.secondFactor;

    return [
      getSchemaTpl('tabs', [
        {
          title: '属性',
          className: 'p-none',
          body: [
            getSchemaTpl('collapseGroup', [
              {
                title: '插入',
                body: [
                  asSecondFactor
                    ? null
                    : {
                        type: 'wrapper',
                        size: 'none',
                        className: 'grid grid-cols-2 gap-4 mb-4',
                        body: [
                          {
                            children: (
                              <Button
                                size="sm"
                                onClick={() =>
                                  this.insertRowAfter(context.node)
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
                                  this.insertRowBefore(context.node)
                                }
                              >
                                <Icon
                                  className="icon"
                                  icon="top-arrow-to-top"
                                />
                                <span>上方插入新行</span>
                              </Button>
                            )
                          }
                        ]
                      }
                ].filter(item => item)
              },
              {
                title: '布局',
                body: [
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
                  },

                  {
                    type: 'button-group-select',
                    name: 'gap',
                    label: '列间距',
                    size: 'sm',
                    clearable: true,
                    tiled: true,
                    options: [
                      {
                        label: '无',
                        value: 'none'
                      },
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
                    type: 'button-group-select',
                    name: 'align',
                    size: 'sm',
                    label: '水平对齐',
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
                  },
                  {
                    type: 'button-group-select',
                    name: 'valign',
                    size: 'sm',
                    label: '垂直对齐',
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
              }
            ])
          ]
        },
        this.panelWithOutOthers
          ? null
          : {
              title: '外观',
              body: [
                getSchemaTpl('className'),
                getSchemaTpl('subFormItemMode'),
                getSchemaTpl('subFormHorizontalMode'),
                getSchemaTpl('subFormHorizontal')
              ]
            }
      ])
    ];
  }

  vRendererConfig: VRendererConfig = {
    regions: {
      body: {
        key: 'body',
        label: '内容区',
        placeholder: '栏',
        wrapperResolve: (dom: HTMLElement) => dom
      }
    },
    panelTitle: '栏',
    panelBodyCreator: (context: BaseEventContext) => {
      const host = context.node.host;

      return [
        getSchemaTpl('tabs', [
          {
            title: '属性',
            className: 'p-none',
            body: [
              getSchemaTpl('collapseGroup', [
                {
                  title: '插入',
                  body: [
                    {
                      type: 'wrapper',
                      size: 'none',
                      className: 'grid grid-cols-2 gap-4',
                      body: [
                        host.isSecondFactor
                          ? null
                          : {
                              children: (
                                <Button
                                  size="sm"
                                  onClick={() =>
                                    this.insertRowAfter(context.node.host)
                                  }
                                >
                                  <Icon
                                    className="icon"
                                    icon="arrow-to-bottom"
                                  />
                                  <span>下方插入新行</span>
                                </Button>
                              )
                            },
                        host.isSecondFactor
                          ? null
                          : {
                              children: (
                                <Button
                                  size="sm"
                                  onClick={() =>
                                    this.insertRowBefore(context.node.host)
                                  }
                                >
                                  <Icon
                                    className="icon"
                                    icon="top-arrow-to-top"
                                  />
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
                              <Icon
                                className="icon"
                                icon="left-arrow-to-left"
                              />
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
                      ].filter(item => item)
                    }
                  ]
                },
                {
                  title: '宽度',
                  body: [
                    {
                      type: 'button-group-select',
                      name: 'md',
                      size: 'sm',
                      label: false,
                      pipeIn: (value: any) =>
                        typeof value === 'number' ? 'manual' : value || '',
                      pipeOut: (value: any) => (value === 'manual' ? 1 : value),
                      tiled: true,
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
                      ]
                    },
                    {
                      visibleOn: 'typeof this.md === "number"',
                      label: '宽度占比',
                      type: 'input-range',
                      name: 'md',
                      min: 1,
                      max: 12,
                      step: 1
                    }
                  ]
                },
                {
                  title: '布局',
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
                }
              ])
            ]
          },
          {
            title: '外观',
            body: [
              this.panelWithOutOthers
                ? null
                : getSchemaTpl('className', {
                    label: '栏 CSS 类名',
                    name: 'columnClassName'
                  })
            ]
          }
        ])
      ];
    }
  };

  vWrapperResolve = (dom: HTMLElement) => dom;
  overrides = {
    renderColumn: function (
      this: any,
      node: Schema,
      index: number,
      length: number
    ) {
      let dom = this.super(node, index, length);
      const info = this.props.$$editor;

      if (info && node.$$id) {
        const plugin: GridPlugin = info.plugin as any;
        const region = plugin.vRendererConfig?.regions?.body;
        if (!region) {
          return dom;
        }

        return (
          <VRenderer
            key={`${node.$$id}-${index}`}
            type={info.type}
            plugin={info.plugin}
            renderer={info.renderer}
            $schema="/schemas/GridColumn.json"
            hostId={info.id}
            memberIndex={index}
            name={`第${index + 1}栏`}
            id={node.$$id}
            draggable={false}
            schemaPath={`${info.schemaPath}/grid/${index}`}
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

  afterResolveJsonSchema(
    event: PluginEvent<RendererJSONSchemaResolveEventContext>
  ) {
    const context = event.context;
    const parent = context.node.parent?.host as EditorNodeType;

    if (parent?.info?.plugin === this) {
      event.setData('/schemas/GridColumn.json');
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
        label: '左侧插入一栏',
        onSelect: () => this.insertColumnBefore(context)
      });

      menus.push({
        label: '右侧插入一栏',
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
    let finalMd = columns[index].md;
    const rect = dom.getBoundingClientRect();

    event.setData({
      onMove: (e: MouseEvent) => {
        const width = e.pageX - rect.left;
        const md = (finalMd = Math.max(
          1,
          Math.min(12, Math.round((12 * width) / frameRect.width))
        ));
        columns = columns.concat();
        columns[index] = {
          ...columns[index],
          md
        };
        resizer.setAttribute('data-value', `${md}`);

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
          md: finalMd
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
            type: this.rendererName || 'grid',
            align: node.align,
            valign: node.valign,
            columns: node.columns.map((column: any) => ({
              body: [],
              md: column?.md
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
    const schema = store.schema;
    const id = node.id;
    store.traceableSetSchema(
      JSONChangeInArray(schema, id, (arr: any[], node: any, index: number) => {
        arr.splice(
          index,
          0,
          JSONPipeIn({
            type: this.rendererName || 'grid',
            align: node.align,
            valign: node.valign,
            columns: node.columns.map((column: any) => ({
              body: [],
              md: column?.md
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
    const id = context.id;
    const schema = store.schema;
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
    const store = this.manager.store;
    const schema = store.schema;
    const id = context.id;
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

registerEditorPlugin(GridPlugin);
