import {Button, JSONValueMap, isObject} from 'amis';
import React from 'react';
import {EditorNodeType, registerEditorPlugin} from 'amis-editor-core';
import {
  BaseEventContext,
  BasePlugin,
  BasicPanelItem,
  BasicRendererInfo,
  BasicToolbarItem,
  ContextMenuEventContext,
  ContextMenuItem,
  PluginInterface,
  RegionConfig,
  RendererInfo,
  RendererInfoResolveEventContext
} from 'amis-editor-core';
import {defaultValue, getSchemaTpl} from 'amis-editor-core';
import {diff, JSONPipeOut, repeatArray} from 'amis-editor-core';
import set from 'lodash/set';
import {escapeFormula, resolveArrayDatasource} from '../util';

export class CardsPlugin extends BasePlugin {
  static id = 'CardsPlugin';
  static scene = ['layout'];
  // 关联渲染器名字
  rendererName = 'cards';
  $schema = '/schemas/CardsSchema.json';

  // 组件名称
  name = '卡片列表';
  isBaseComponent = true;
  isListComponent = true;
  memberImmutable = true;
  description =
    '功能类似于表格，但是用一个个小卡片来展示数据。当前组件需要配置数据源，不自带数据拉取，请优先使用 「CRUD」 组件。';
  docLink = '/amis/zh-CN/components/cards';
  tags = ['展示'];
  icon = 'fa fa-window-maximize';
  pluginIcon = 'cards-plugin';
  scaffold = {
    type: 'cards',
    columnsCount: 4,
    card: {
      type: 'container',
      body: [
        {
          type: 'container',
          body: [
            {
              type: 'icon',
              icon: 'fa fa-check',
              vendor: '',
              themeCss: {
                className: {
                  'font': {
                    color: 'var(--colors-brand-6)',
                    fontSize: '20px'
                  },
                  'padding-and-margin:default': {
                    marginRight: '10px'
                  }
                }
              }
            },
            {
              type: 'tpl',
              tpl: '流水线任务实例 ',
              inline: true,
              wrapperComponent: '',
              editorSetting: {
                mock: {}
              },
              style: {
                fontSize: 'var(--fonts-size-6)',
                color: 'var(--colors-neutral-text-2)',
                fontWeight: 'var(--fonts-weight-3)'
              }
            }
          ],
          style: {
            position: 'static',
            display: 'flex',
            flexWrap: 'nowrap',
            alignItems: 'center',
            marginBottom: '15px'
          },
          wrapperBody: false,
          isFixedHeight: false,
          isFixedWidth: false,
          size: 'none'
        },
        {
          type: 'flex',
          className: 'p-1',
          items: [
            {
              type: 'container',
              body: [
                {
                  type: 'container',
                  body: [
                    {
                      type: 'tpl',
                      tpl: '12/',
                      inline: true,
                      wrapperComponent: '',
                      style: {
                        fontSize: 'var(--fonts-size-6)',
                        color: 'var(--colors-neutral-text-2)',
                        fontWeight: 'var(--fonts-weight-3)'
                      }
                    },
                    {
                      type: 'tpl',
                      tpl: '19',
                      inline: true,
                      wrapperComponent: '',
                      style: {
                        color: 'var(--colors-neutral-text-6)',
                        fontSize: 'var(--fonts-size-6)'
                      }
                    }
                  ],
                  style: {
                    position: 'static',
                    display: 'block',
                    flex: '0 0 auto',
                    marginTop: 'var(--sizes-size-0)',
                    marginRight: 'var(--sizes-size-0)',
                    marginBottom: 'var(--sizes-size-0)',
                    marginLeft: 'var(--sizes-size-0)'
                  },
                  wrapperBody: false,
                  isFixedWidth: false,
                  size: 'none'
                },
                {
                  type: 'container',
                  body: [
                    {
                      type: 'tpl',
                      tpl: '单元测试',
                      inline: true,
                      wrapperComponent: '',
                      style: {
                        color: 'var(--colors-neutral-text-5)'
                      }
                    }
                  ],
                  style: {
                    position: 'static',
                    display: 'flex',
                    flexWrap: 'nowrap',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    flex: '0 0 auto'
                  },
                  wrapperBody: false,
                  isFixedHeight: false,
                  isFixedWidth: false,
                  size: 'none'
                }
              ],
              size: 'xs',
              style: {
                position: 'static',
                display: 'flex',
                flex: '1 1 auto',
                flexGrow: 1,
                flexBasis: 'auto',
                flexWrap: 'nowrap',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center'
              },
              wrapperBody: false,
              isFixedHeight: false,
              isFixedWidth: false
            },
            {
              type: 'container',
              body: [
                {
                  type: 'tpl',
                  tpl: '100%',
                  inline: true,
                  wrapperComponent: '',
                  style: {
                    fontSize: 'var(--fonts-size-6)',
                    color: 'var(--colors-neutral-text-2)',
                    fontWeight: 'var(--fonts-weight-3)'
                  }
                },
                {
                  type: 'tpl',
                  tpl: '通过率',
                  inline: true,
                  wrapperComponent: '',
                  style: {
                    color: 'var(--colors-neutral-text-5)'
                  }
                }
              ],
              size: 'xs',
              style: {
                position: 'static',
                display: 'flex',
                flex: '1 1 auto',
                flexGrow: 1,
                flexBasis: 'auto',
                flexWrap: 'nowrap',
                flexDirection: 'column',
                justifyContent: 'flex-start',
                alignItems: 'center'
              },
              wrapperBody: false,
              isFixedHeight: false,
              isFixedWidth: false
            },
            {
              type: 'container',
              body: [
                {
                  type: 'tpl',
                  tpl: '99.9%',
                  inline: true,
                  wrapperComponent: '',
                  style: {
                    fontSize: 'var(--fonts-size-6)',
                    color: 'var(--colors-neutral-text-2)',
                    fontWeight: 'var(--fonts-weight-3)'
                  }
                },
                {
                  type: 'tpl',
                  tpl: '任务实例',
                  inline: true,
                  wrapperComponent: '',
                  style: {
                    color: 'var(--colors-neutral-text-5)'
                  }
                }
              ],
              size: 'xs',
              style: {
                position: 'static',
                display: 'flex',
                flex: '1 1 auto',
                flexGrow: 1,
                flexBasis: 'auto',
                flexWrap: 'nowrap',
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'column'
              },
              wrapperBody: false,
              isFixedHeight: false,
              isFixedWidth: false
            }
          ],
          style: {
            position: 'relative'
          }
        },
        {
          type: 'container',
          body: [
            {
              type: 'tpl',
              tpl: '报告',
              inline: true,
              wrapperComponent: '',
              style: {
                fontSize: '14px',
                color: 'var(--colors-neutral-text-5)'
              }
            },
            {
              type: 'tpl',
              tpl: '2023-01-01 12:00',
              inline: true,
              wrapperComponent: '',
              style: {
                fontSize: '12px',
                color: 'var(--colors-neutral-text-6)'
              }
            }
          ],
          style: {
            position: 'static',
            display: 'flex',
            flexWrap: 'nowrap',
            justifyContent: 'space-between',
            marginTop: '20px'
          },
          wrapperBody: false,
          isFixedHeight: false,
          isFixedWidth: false
        }
      ],
      size: 'none',
      style: {
        'position': 'static',
        'display': 'block',
        'paddingTop': '10px',
        'paddingRight': '10px',
        'paddingBottom': '10px',
        'paddingLeft': '10px',
        'radius': {
          'top-left-border-radius': '6px',
          'top-right-border-radius': '6px',
          'bottom-left-border-radius': '6px',
          'bottom-right-border-radius': '6px'
        },
        'top-border-width': 'var(--borders-width-4)',
        'left-border-width': 'var(--borders-width-2)',
        'right-border-width': 'var(--borders-width-2)',
        'bottom-border-width': 'var(--borders-width-2)',
        'top-border-style': 'var(--borders-style-2)',
        'left-border-style': 'var(--borders-style-2)',
        'right-border-style': 'var(--borders-style-2)',
        'bottom-border-style': 'var(--borders-style-2)',
        'top-border-color': 'var(--colors-brand-6)',
        'left-border-color': 'var(--colors-brand-10)',
        'right-border-color': 'var(--colors-brand-10)',
        'bottom-border-color': 'var(--colors-brand-10)',
        'flex': '0 0 150px',
        'marginRight': '15px',
        'flexBasis': '100%'
      },
      wrapperBody: false,
      isFixedHeight: false,
      isFixedWidth: true,
      onEvent: {
        click: {
          weight: 0,
          actions: []
        }
      }
    },
    placeholder: '',
    name: '',
    style: {
      gutterX: 15,
      gutterY: 15
    }
  };
  previewSchema = {
    ...this.scaffold,
    className: 'text-left',
    name: 'items',
    columnsCount: 2,
    style: {
      ...this.scaffold.style,
      transform: 'scale(0.5)',
      width: '600px',
      transformOrigin: 'left top'
    },
    items: [{}, {}, {}, {}]
  };

  panelTitle = '卡片集';
  panelJustify = true;
  panelBodyCreator = (context: BaseEventContext) => {
    const isCRUDBody = context.schema.type === 'crud';
    const curPosition = context?.schema?.style?.position;
    const isAbsolute = curPosition === 'fixed' || curPosition === 'absolute';

    return [
      getSchemaTpl('tabs', [
        {
          title: '属性',
          body: getSchemaTpl('collapseGroup', [
            {
              title: '基本',
              body: [
                {
                  type: 'input-text',
                  label: '组件名称',
                  name: 'editorSetting.displayName'
                },
                isCRUDBody
                  ? null
                  : getSchemaTpl('formItemName', {
                      label: '绑定字段名'
                    }),
                getSchemaTpl('cardsPlaceholder')
              ]
            },
            getSchemaTpl('status')
          ])
        },
        {
          title: '外观',
          body: getSchemaTpl('collapseGroup', [
            {
              title: '组件',
              body: [
                {
                  name: 'columnsCount',
                  type: 'input-range',
                  visibleOn: '!this.leftFixed',
                  min: 0,
                  max: 12,
                  step: 1,
                  label: '每行个数',
                  description: '不设置时，由卡片 CSS 类名决定'
                },
                {
                  type: 'input-number',
                  label: '左右间距',
                  name: 'style.gutterX'
                },
                {
                  type: 'input-number',
                  label: '上下间距',
                  name: 'style.gutterY'
                },
                getSchemaTpl('switch', {
                  name: 'masonryLayout',
                  label: '启用瀑布流'
                }),
                getSchemaTpl('layout:originPosition', {
                  visibleOn: isAbsolute ? isAbsolute : undefined,
                  value: 'left-top'
                })
              ]
            },
            ...getSchemaTpl('theme:common', {exclude: ['layout']})
          ])
        }
      ])
    ];
  };

  buildDataSchemas(node: EditorNodeType, region: EditorNodeType) {
    let dataSchema: any = {
      $id: 'cards',
      type: 'object',
      title: '当前列表项',
      properties: {}
    };

    let match =
      node.schema.source && String(node.schema.source).match(/{([\w-_]+)}/);
    let field = node.schema.name || match?.[1];
    const scope = this.manager.dataSchema.getScope(`${node.id}-${node.type}`);
    const schema = scope?.parent?.getSchemaByPath(field);
    if (isObject(schema?.items)) {
      dataSchema = {
        ...dataSchema,
        ...(schema!.items as any)
      };

      // 列表添加序号方便处理
      set(dataSchema, 'properties.index', {
        type: 'number',
        title: '索引'
      });
    }

    return dataSchema;
  }

  filterProps(props: any) {
    // 编辑时显示两行假数据
    const count = (props.columnsCount || 3) * 2;
    props.value = repeatArray({}, count).map((item, index) => {
      return {
        ...item,
        id: index + 1
      };
    });

    props.className = `${props.className || ''} ae-Editor-list`;
    props.itemsClassName = `${props.itemsClassName || ''} cards-items`;
    if (props.card && !props.card.className?.includes('listItem')) {
      props.card.className = `${props.card.className || ''} ae-Editor-listItem`;
    }

    // 列表类型内的文本元素显示原始公式
    props = escapeFormula(props);

    return props;
  }

  getRendererInfo(
    context: RendererInfoResolveEventContext
  ): BasicRendererInfo | void {
    const plugin: PluginInterface = this;
    const {renderer, schema} = context;
    if (
      !schema.$$id &&
      schema.$$editor?.renderer.name === 'crud' &&
      renderer.name === 'cards'
    ) {
      return {
        ...({id: schema.$$editor.id} as any),
        name: plugin.name!,
        regions: plugin.regions,
        patchContainers: plugin.patchContainers,
        vRendererConfig: plugin.vRendererConfig,
        wrapperProps: plugin.wrapperProps,
        wrapperResolve: plugin.wrapperResolve,
        filterProps: plugin.filterProps,
        $schema: plugin.$schema,
        renderRenderer: plugin.renderRenderer,
        memberImmutable: plugin.memberImmutable
      };
    }

    return super.getRendererInfo(context);
  }
}

registerEditorPlugin(CardsPlugin);
