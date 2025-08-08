import {Button, JSONValueMap, isObject} from 'amis';
import React from 'react';
import {EditorNodeType, registerEditorPlugin} from 'amis-editor-core';
import {
  BaseEventContext,
  BasePlugin,
  BasicRendererInfo,
  PluginInterface,
  getI18nEnabled,
  RendererInfoResolveEventContext
} from 'amis-editor-core';
import {defaultValue, getSchemaTpl} from 'amis-editor-core';
import {repeatArray} from 'amis-editor-core';
import set from 'lodash/set';
import {escapeFormula, generateId, resolveArrayDatasource} from '../util';
import merge from 'lodash/merge';

export class List2Plugin extends BasePlugin {
  static id = 'List2Plugin';
  static scene = ['layout'];
  // 关联渲染器名字
  rendererName = 'cards';
  useLazyRender = true; // 使用懒渲染
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
              id: generateId()
            },
            {
              type: 'tpl',
              tpl: '/',
              inline: true,
              wrapperComponent: '',
              style: {},
              id: generateId(),
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
                  id: generateId()
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
                  id: generateId()
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
              id: generateId()
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
          id: generateId()
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
              id: generateId(),
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
              id: generateId()
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
          id: generateId()
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
              id: generateId()
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
          id: generateId()
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
      id: generateId()
    },
    placeholder: '',
    style: {
      gutterY: 10
    },
    id: generateId()
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
    const i18nEnabled = getI18nEnabled();

    return [
      getSchemaTpl('tabs', [
        {
          title: '属性',
          body: getSchemaTpl('collapseGroup', [
            {
              title: '基本',
              body: [
                {
                  type: i18nEnabled ? 'input-text-i18n' : 'input-text',
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
                  name: 'masonryLayout',
                  type: 'switch',
                  label: '瀑布流布局',
                  description: '开启后将以瀑布流的形式展示卡片'
                },
                {
                  type: 'select',
                  name: 'columnsSetting',
                  label: '列数设置方式',
                  visibleOn: 'this.masonryLayout',
                  value: 'columnsCount',
                  options: [
                    {
                      label: '固定列数',
                      value: 'columnsCount'
                    },
                    {
                      label: '响应式布局',
                      value: 'itemClassName'
                    }
                  ],
                  onChange: (
                    value: string,
                    oldValue: string,
                    model: any,
                    form: any
                  ) => {
                    if (value === 'columnsCount') {
                      form.setValueByName('itemClassName', '');
                    } else {
                      form.setValueByName('columnsCount', undefined);
                    }
                  }
                },
                {
                  name: 'columnsCount',
                  type: 'input-range',
                  visibleOn:
                    'this.masonryLayout && this.columnsSetting === "columnsCount"',
                  min: 1,
                  max: 12,
                  step: 1,
                  label: '每行列数'
                },
                {
                  type: 'container',
                  visibleOn:
                    'this.masonryLayout && this.columnsSetting === "itemClassName"',
                  label: '响应式列数',
                  body: [
                    {
                      type: 'select',
                      name: 'xs',
                      label: '超小屏幕 (xs)',
                      clearable: true,
                      options: [
                        {label: '1列', value: 'Grid-col--xs12'},
                        {label: '2列', value: 'Grid-col--xs6'},
                        {label: '3列', value: 'Grid-col--xs4'},
                        {label: '4列', value: 'Grid-col--xs3'}
                      ],
                      onChange: (
                        value: string,
                        oldValue: string,
                        model: any,
                        form: any
                      ) => {
                        let itemClassName = form.data.itemClassName || '';
                        itemClassName = itemClassName
                          .replace(/\bGrid-col--xs\d+\b/g, '')
                          .trim();
                        if (value) {
                          itemClassName = `${itemClassName} ${value}`.trim();
                        }
                        form.setValueByName('itemClassName', itemClassName);
                      }
                    },
                    {
                      type: 'select',
                      name: 'sm',
                      label: '小屏幕 (sm)',
                      clearable: true,
                      options: [
                        {label: '1列', value: 'Grid-col--sm12'},
                        {label: '2列', value: 'Grid-col--sm6'},
                        {label: '3列', value: 'Grid-col--sm4'},
                        {label: '4列', value: 'Grid-col--sm3'}
                      ],
                      onChange: (
                        value: string,
                        oldValue: string,
                        model: any,
                        form: any
                      ) => {
                        let itemClassName = form.data.itemClassName || '';
                        itemClassName = itemClassName
                          .replace(/\bGrid-col--sm\d+\b/g, '')
                          .trim();
                        if (value) {
                          itemClassName = `${itemClassName} ${value}`.trim();
                        }
                        form.setValueByName('itemClassName', itemClassName);
                      }
                    },
                    {
                      type: 'select',
                      name: 'md',
                      label: '中等屏幕 (md)',
                      clearable: true,
                      options: [
                        {label: '1列', value: 'Grid-col--md12'},
                        {label: '2列', value: 'Grid-col--md6'},
                        {label: '3列', value: 'Grid-col--md4'},
                        {label: '4列', value: 'Grid-col--md3'}
                      ],
                      onChange: (
                        value: string,
                        oldValue: string,
                        model: any,
                        form: any
                      ) => {
                        let itemClassName = form.data.itemClassName || '';
                        itemClassName = itemClassName
                          .replace(/\bGrid-col--md\d+\b/g, '')
                          .trim();
                        if (value) {
                          itemClassName = `${itemClassName} ${value}`.trim();
                        }
                        form.setValueByName('itemClassName', itemClassName);
                      }
                    },
                    {
                      type: 'select',
                      name: 'lg',
                      label: '大屏幕 (lg)',
                      clearable: true,
                      options: [
                        {label: '1列', value: 'Grid-col--lg12'},
                        {label: '2列', value: 'Grid-col--lg6'},
                        {label: '3列', value: 'Grid-col--lg4'},
                        {label: '4列', value: 'Grid-col--lg3'}
                      ],
                      onChange: (
                        value: string,
                        oldValue: string,
                        model: any,
                        form: any
                      ) => {
                        let itemClassName = form.data.itemClassName || '';
                        itemClassName = itemClassName
                          .replace(/\bGrid-col--lg\d+\b/g, '')
                          .trim();
                        if (value) {
                          itemClassName = `${itemClassName} ${value}`.trim();
                        }
                        form.setValueByName('itemClassName', itemClassName);
                      }
                    }
                  ]
                },
                {
                  type: 'input-number',
                  label: '左右间距',
                  name: 'style.gutterX',
                  visibleOn: 'this.masonryLayout && this.columnsCount > 1'
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

    if (scope) {
      const origin = this.manager.dataSchema.current;
      this.manager.dataSchema.switchTo(scope.parent!);
      const schema = this.manager.dataSchema.getSchemaByPath(field);
      this.manager.dataSchema.switchTo(origin);
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
    }

    return dataSchema;
  }

  filterProps(props: any, node: EditorNodeType) {
    // 编辑时显示两行假数据
    const count = (props.columnsCount || 3) * 2;
    if (!node.state.value) {
      node.updateState({
        value: repeatArray({}, count).map((item, index) => {
          return {
            ...item,
            id: index + 1
          };
        })
      });
    }

    props.className = `${props.className || ''} ae-Editor-list`;
    props.itemsClassName = `${props.itemsClassName || ''} cards-items`;
    if (props.card && !props.card.className?.includes('listItem')) {
      props.card = merge(
        {
          className: `${props.card.className || ''} ae-Editor-listItem`
        },
        props.card
      );
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
