import {Button, JSONValueMap, isObject} from 'amis';
import React from 'react';
import {EditorNodeType, registerEditorPlugin} from 'amis-editor-core';
import {
  BaseEventContext,
  BasePlugin,
  BasicRendererInfo,
  PluginInterface,
  RendererInfoResolveEventContext
} from 'amis-editor-core';
import {defaultValue, getSchemaTpl} from 'amis-editor-core';
import {repeatArray} from 'amis-editor-core';
import set from 'lodash/set';
import {escapeFormula, resolveArrayDatasource} from '../util';

export class List2Plugin extends BasePlugin {
  static id = 'List2Plugin';
  static scene = ['layout'];
  // 关联渲染器名字
  rendererName = 'cards';
  $schema = '/schemas/CardsSchema.json';

  // 组件名称
  name = '列表';
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
    columnsCount: 1,
    card: {
      type: 'container',
      body: [
        {
          type: 'container',
          body: [
            {
              type: 'tpl',
              tpl: '01',
              inline: true,
              wrapperComponent: '',
              style: {},
              themeCss: {
                baseControlClassName: {
                  'padding-and-margin:default': {
                    marginRight: '10px'
                  },
                  'font:default': {
                    color: 'var(--colors-neutral-text-2)',
                    fontSize: 'var(--fonts-size-3)',
                    fontWeight: 'var(--fonts-weight-5)'
                  }
                }
              },
              id: 'u:0597d8ab5c3a'
            },
            {
              type: 'tpl',
              tpl: '/',
              inline: true,
              wrapperComponent: '',
              style: {},
              id: 'u:95d2a3ac3e70',
              themeCss: {
                baseControlClassName: {
                  'padding-and-margin:default': {
                    marginRight: '10px'
                  },
                  'font:default': {
                    fontSize: 'var(--fonts-size-3)',
                    color: '#cccccc'
                  }
                }
              }
            },
            {
              type: 'container',
              body: [
                {
                  type: 'tpl',
                  tpl: '3月',
                  inline: true,
                  wrapperComponent: '',
                  style: {},
                  themeCss: {
                    baseControlClassName: {
                      'font:default': {
                        fontSize: 'var(--fonts-size-6)'
                      }
                    }
                  },
                  id: 'u:d153d5c33ebf'
                },
                {
                  type: 'tpl',
                  tpl: '2023',
                  inline: true,
                  wrapperComponent: '',
                  style: {},
                  themeCss: {
                    baseControlClassName: {
                      'font:default': {
                        fontSize: 'var(--fonts-size-6)'
                      }
                    }
                  },
                  id: 'u:4e03af905add'
                }
              ],
              style: {
                position: 'static',
                display: 'flex',
                flexWrap: 'nowrap',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center'
              },
              wrapperBody: false,
              isFixedHeight: false,
              isFixedWidth: false,
              id: 'u:3e3e5dc43b6a'
            }
          ],
          size: 'none',
          style: {
            position: 'static',
            display: 'flex',
            flex: '1 1 auto',
            flexGrow: 0,
            flexBasis: 'auto',
            flexWrap: 'nowrap',
            justifyContent: 'flex-start',
            alignItems: 'center'
          },
          wrapperBody: false,
          isFixedHeight: false,
          isFixedWidth: false,
          themeCss: {
            baseControlClassName: {
              'border:default': {
                'right-border-width': 'var(--borders-width-2)',
                'right-border-style': 'var(--borders-style-2)',
                'right-border-color': '#ececec'
              },
              'padding-and-margin:default': {
                paddingLeft: '20px',
                paddingRight: '40px',
                marginRight: '40px'
              }
            }
          },
          id: 'u:7a02e453c997'
        },
        {
          type: 'container',
          body: [
            {
              type: 'tpl',
              tpl: '列表标题',
              inline: true,
              wrapperComponent: '',
              style: {},
              maxLine: 1,
              id: 'u:105ca9cda3ef',
              themeCss: {
                baseControlClassName: {
                  'padding-and-margin:default': {
                    marginBottom: '10px'
                  },
                  'font:default': {
                    fontSize: 'var(--fonts-size-5)',
                    color: 'var(--colors-neutral-text-4)',
                    fontWeight: 'var(--fonts-weight-4)'
                  }
                }
              }
            },
            {
              type: 'tpl',
              tpl: '这是内容简介，可以设置显示行数',
              inline: true,
              wrapperComponent: '',
              maxLine: 1,
              style: {},
              themeCss: {
                baseControlClassName: {
                  'font:default': {
                    fontSize: '13px',
                    color: 'var(--colors-neutral-text-5)'
                  }
                }
              },
              id: 'u:d8e3f4be33db'
            }
          ],
          size: 'none',
          style: {
            position: 'static',
            display: 'flex',
            flex: '1 1 auto',
            flexGrow: 1,
            flexBasis: 'auto',
            flexWrap: 'nowrap',
            flexDirection: 'column',
            alignItems: 'flex-start'
          },
          wrapperBody: false,
          isFixedHeight: false,
          isFixedWidth: false,
          id: 'u:0c0b56fd0c17'
        },
        {
          type: 'container',
          body: [
            {
              type: 'button',
              label: '查看详情',
              onEvent: {
                click: {
                  actions: []
                }
              },
              level: 'default',
              size: 'default',
              themeCss: {
                className: {
                  'border:default': {
                    'top-border-width': 'var(--borders-width-2)',
                    'left-border-width': 'var(--borders-width-2)',
                    'right-border-width': 'var(--borders-width-2)',
                    'bottom-border-width': 'var(--borders-width-2)',
                    'top-border-style': 'var(--borders-style-2)',
                    'left-border-style': 'var(--borders-style-2)',
                    'right-border-style': 'var(--borders-style-2)',
                    'bottom-border-style': 'var(--borders-style-2)',
                    'top-border-color': 'var(--colors-brand-6)',
                    'left-border-color': 'var(--colors-brand-6)',
                    'right-border-color': 'var(--colors-brand-6)',
                    'bottom-border-color': 'var(--colors-brand-6)'
                  },
                  'padding-and-margin:default': {
                    paddingLeft: '20px',
                    paddingRight: '20px'
                  },
                  'radius:default': {
                    'top-left-border-radius': '20px',
                    'top-right-border-radius': '20px',
                    'bottom-left-border-radius': '20px',
                    'bottom-right-border-radius': '20px'
                  },
                  'font:default': {
                    color: 'var(--colors-brand-6)'
                  }
                }
              },
              id: 'u:0a2fe27eb501'
            }
          ],
          size: 'xs',
          style: {
            position: 'static',
            display: 'flex',
            flex: '1 1 auto',
            flexGrow: 0,
            flexBasis: 'auto',
            flexWrap: 'nowrap',
            flexDirection: 'column',
            justifyContent: 'center'
          },
          wrapperBody: false,
          isFixedHeight: false,
          isFixedWidth: false,
          id: 'u:77cb3edb2288'
        }
      ],
      wrapperBody: false,
      style: {
        position: 'relative',
        display: 'flex',
        width: '100%'
      },
      themeCss: {
        baseControlClassName: {
          'radius:default': {
            'top-left-border-radius': '6px',
            'top-right-border-radius': '6px',
            'bottom-left-border-radius': '6px',
            'bottom-right-border-radius': '6px'
          },
          'boxShadow:default': ' 0px 0px 10px 0px var(--colors-neutral-line-8)',
          'border:default': {
            'top-border-width': 'var(--borders-width-1)',
            'left-border-width': 'var(--borders-width-1)',
            'right-border-width': 'var(--borders-width-1)',
            'bottom-border-width': 'var(--borders-width-1)',
            'top-border-style': 'var(--borders-style-1)',
            'left-border-style': 'var(--borders-style-1)',
            'right-border-style': 'var(--borders-style-1)',
            'bottom-border-style': 'var(--borders-style-1)',
            'top-border-color': '#3be157',
            'left-border-color': '#3be157',
            'right-border-color': '#3be157',
            'bottom-border-color': '#3be157'
          },
          'padding-and-margin:default': {
            paddingTop: '10px',
            paddingRight: '10px',
            paddingBottom: '10px',
            paddingLeft: '10px'
          }
        }
      },
      id: 'u:bb14c60372c6'
    },
    placeholder: '',
    style: {
      gutterY: 10
    },
    id: 'u:0fb820345fc1'
  };

  previewSchema = {
    ...this.scaffold,
    className: 'text-left ',
    items: [{}, {}, {}],
    style: {
      gutterY: 10,
      transform: 'scale(0.7)',
      width: '1200px',
      transformOrigin: 'left top'
    },
    name: 'items'
  };

  panelTitle = '列表';
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
                  min: 1,
                  max: 12,
                  step: 1,
                  label: '每行个数'
                },
                {
                  type: 'input-number',
                  label: '左右间距',
                  name: 'style.gutterX',
                  visibleOn: 'this.columnsCount > 1'
                },
                {
                  type: 'input-number',
                  label: '上下间距',
                  name: 'style.gutterY'
                },
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

registerEditorPlugin(List2Plugin);
