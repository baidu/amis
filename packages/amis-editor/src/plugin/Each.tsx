import {isObject} from 'amis';
import React from 'react';
import {EditorNodeType, registerEditorPlugin} from 'amis-editor-core';
import {BaseEventContext, BasePlugin} from 'amis-editor-core';
import {getSchemaTpl} from 'amis-editor-core';
import {escapeFormula, generateId} from '../util';
import merge from 'lodash/merge';
import set from 'lodash/set';

export class EachPlugin extends BasePlugin {
  static id = 'EachPlugin';
  static scene = ['layout'];
  // 关联渲染器名字
  rendererName = 'each';
  useLazyRender = true; // 使用懒渲染
  $schema = '/schemas/EachSchema.json';

  // 组件名称
  name = '循环 Each';
  isBaseComponent = true;
  isListComponent = true;
  memberImmutable = true;
  description = '功能渲染器，可以基于现有变量循环输出渲染器。';
  searchKeywords = '循环渲染器';
  docLink = '/amis/zh-CN/components/each';
  tags = ['功能'];
  icon = 'fa fa-repeat';
  pluginIcon = 'each-plugin';
  scaffold = {
    type: 'each',
    name: '',
    items: {
      type: 'container',
      body: [
        {
          type: 'container',
          body: [
            {
              type: 'icon',
              icon: 'fa fa-plane',
              vendor: '',
              themeCss: {
                className: {
                  'padding-and-margin:default': {
                    marginRight: '4px'
                  },
                  'font': {
                    color: '#2856ad',
                    fontSize: '20px'
                  }
                }
              },
              id: generateId()
            },
            {
              type: 'tpl',
              style: {},
              tpl: '回访数量TOP1',
              inline: true,
              wrapperComponent: '',
              themeCss: {
                baseControlClassName: {
                  'font:default': {
                    fontWeight: 'var(--fonts-weight-3)',
                    fontSize: '16px',
                    color: 'var(--colors-brand-6)'
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
            justifyContent: 'flex-start',
            alignItems: 'center'
          },
          wrapperBody: false,
          isFixedHeight: false,
          isFixedWidth: false,
          themeCss: {
            baseControlClassName: {
              'padding-and-margin:default': {
                marginBottom: '6px'
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
              tpl: '北京分公司',
              inline: true,
              wrapperComponent: '',
              style: {},
              themeCss: {
                baseControlClassName: {
                  'font:default': {
                    'fontSize': 'var(--fonts-size-4)',
                    'color': 'var(--colors-neutral-text-2)',
                    'fontWeight': 'var(--fonts-weight-3)',
                    'font-family': '-apple-system'
                  }
                }
              },
              id: generateId()
            }
          ],
          style: {
            position: 'static',
            display: 'block'
          },
          wrapperBody: false,
          id: generateId()
        }
      ],
      size: 'none',
      style: {
        position: 'static',
        display: 'block',
        flex: '0 0 150px',
        flexBasis: '250px',
        overflowX: 'auto',
        overflowY: 'auto'
      },
      wrapperBody: false,
      isFixedHeight: false,
      themeCss: {
        baseControlClassName: {
          'boxShadow:default': ' 0px 0px 8px 0px rgba(3, 3, 3, 0.1)',
          'radius:default': {
            'top-left-border-radius': 'var(--borders-radius-3)',
            'top-right-border-radius': 'var(--borders-radius-3)',
            'bottom-left-border-radius': 'var(--borders-radius-3)',
            'bottom-right-border-radius': 'var(--borders-radius-3)'
          },
          'padding-and-margin:default': {
            marginRight: '20px',
            paddingTop: '20px',
            paddingRight: '15px',
            paddingBottom: '20px',
            paddingLeft: '15px'
          }
        }
      },
      id: generateId()
    },
    placeholder: '',
    style: {
      position: 'static',
      display: 'flex',
      flexWrap: 'nowrap',
      justifyContent: 'flex-start',
      alignItems: 'center',
      marginTop: '10px',
      marginBottom: '10px'
    },
    isFixedHeight: false,
    isFixedWidth: false,
    size: 'none',
    id: generateId()
  };

  previewSchema = {
    ...this.scaffold,
    style: {
      ...this.scaffold.style,
      transform: 'scale(0.6)',
      width: '600px',
      transformOrigin: 'left top'
    },
    value: ['a', 'b']
  };

  panelTitle = '循环';
  panelJustify = true;

  panelBodyCreator = (context: BaseEventContext) => {
    const curRendererSchema = context?.schema;
    const isFreeContainer = curRendererSchema?.isFreeContainer || false;
    const isFlexItem = this.manager?.isFlexItem(context?.id);
    const isFlexColumnItem = this.manager?.isFlexColumnItem(context?.id);

    const displayTpl = [
      getSchemaTpl('layout:display'),

      getSchemaTpl('layout:flex-setting', {
        visibleOn:
          'this.style && (this.style.display === "flex" || this.style.display === "inline-flex")',
        direction: curRendererSchema.direction,
        justify: curRendererSchema.justify,
        alignItems: curRendererSchema.alignItems
      }),

      getSchemaTpl('layout:flex-wrap', {
        visibleOn:
          'this.style && (this.style.display === "flex" || this.style.display === "inline-flex")'
      })
    ];

    return getSchemaTpl('tabs', [
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
              getSchemaTpl('formItemName', {
                label: '绑定字段名',
                paramType: 'output'
              }),
              getSchemaTpl('valueFormula', {
                rendererSchema: {
                  type: 'input-number',
                  min: 1
                },
                name: 'maxLength',
                label: '最大显示个数',
                valueType: 'number'
              }),
              getSchemaTpl('valueFormula', {
                rendererSchema: {
                  type: 'input-text'
                },
                name: 'placeholder',
                label: '空数据提示'
              })
            ]
          },
          getSchemaTpl('status')
        ])
      },
      {
        title: '外观',
        body: getSchemaTpl('collapseGroup', [
          {
            title: '布局',
            body: [
              getSchemaTpl('layout:originPosition'),
              getSchemaTpl('layout:inset', {
                mode: 'vertical'
              }),

              // 自由容器不需要 display 相关配置项
              ...(!isFreeContainer ? displayTpl : []),

              isFlexItem
                ? getSchemaTpl('layout:flex', {
                    isFlexColumnItem,
                    label: isFlexColumnItem ? '高度设置' : '宽度设置',
                    visibleOn:
                      'this.style && (this.style.position === "static" || this.style.position === "relative")'
                  })
                : null,
              isFlexItem
                ? getSchemaTpl('layout:flex-grow', {
                    visibleOn:
                      'this.style && this.style.flex === "1 1 auto" && (this.style.position === "static" || this.style.position === "relative")'
                  })
                : null,
              isFlexItem
                ? getSchemaTpl('layout:flex-basis', {
                    label: isFlexColumnItem ? '弹性高度' : '弹性宽度',
                    visibleOn:
                      'this.style && (this.style.position === "static" || this.style.position === "relative") && this.style.flex === "1 1 auto"'
                  })
                : null,
              isFlexItem
                ? getSchemaTpl('layout:flex-basis', {
                    label: isFlexColumnItem ? '固定高度' : '固定宽度',
                    visibleOn:
                      'this.style && (this.style.position === "static" || this.style.position === "relative") && this.style.flex === "0 0 150px"'
                  })
                : null,

              getSchemaTpl('layout:overflow-x', {
                visibleOn: `${
                  isFlexItem && !isFlexColumnItem
                } && this.style.flex === '0 0 150px'`
              }),

              getSchemaTpl('layout:isFixedHeight', {
                visibleOn: `${!isFlexItem || !isFlexColumnItem}`,
                onChange: (value: boolean) => {
                  context?.node.setHeightMutable(value);
                }
              }),
              getSchemaTpl('layout:height', {
                visibleOn: `${!isFlexItem || !isFlexColumnItem}`
              }),
              getSchemaTpl('layout:max-height', {
                visibleOn: `${!isFlexItem || !isFlexColumnItem}`
              }),
              getSchemaTpl('layout:min-height', {
                visibleOn: `${!isFlexItem || !isFlexColumnItem}`
              }),
              getSchemaTpl('layout:overflow-y', {
                visibleOn: `${
                  !isFlexItem || !isFlexColumnItem
                } && (this.isFixedHeight || this.style && this.style.maxHeight) || (${
                  isFlexItem && isFlexColumnItem
                } && this.style.flex === '0 0 150px')`
              }),

              getSchemaTpl('layout:isFixedWidth', {
                visibleOn: `${!isFlexItem || isFlexColumnItem}`,
                onChange: (value: boolean) => {
                  context?.node.setWidthMutable(value);
                }
              }),
              getSchemaTpl('layout:width', {
                visibleOn: `${!isFlexItem || isFlexColumnItem}`
              }),
              getSchemaTpl('layout:max-width', {
                visibleOn: `${!isFlexItem || isFlexColumnItem}`
              }),
              getSchemaTpl('layout:min-width', {
                visibleOn: `${!isFlexItem || isFlexColumnItem}`
              }),

              getSchemaTpl('layout:overflow-x', {
                visibleOn: `${
                  !isFlexItem || isFlexColumnItem
                } && (this.isFixedWidth || this.style && this.style.maxWidth)`
              }),

              !isFlexItem ? getSchemaTpl('layout:margin-center') : null,
              !isFlexItem && !isFreeContainer
                ? getSchemaTpl('layout:textAlign', {
                    name: 'style.textAlign',
                    label: '内部对齐方式',
                    visibleOn:
                      'this.style && this.style.display !== "flex" && this.style.display !== "inline-flex"'
                  })
                : null,
              getSchemaTpl('layout:z-index'),
              getSchemaTpl('layout:sticky', {
                visibleOn:
                  'this.style && (this.style.position !== "fixed" && this.style.position !== "absolute")'
              }),
              getSchemaTpl('layout:stickyPosition')
            ]
          },
          ...getSchemaTpl('theme:common', {exclude: ['layout']})
        ])
      }
    ]);
  };

  filterProps(props: any, node: EditorNodeType) {
    // 列表类型内的文本元素显示{{公式}}或者自定义展位，不显示实际值
    props = escapeFormula(props);

    if (!node.state.value) {
      // 循环编辑态显示2个元素
      // props.value = [{}, {}];
      node.updateState({
        value: [{}, {}]
      });
    }

    props.className = `${props.className || ''} ae-Editor-list`;
    if (
      props.items &&
      !props.items.className?.includes('eachItem') &&
      !Array.isArray(props.items)
    ) {
      props.items = merge(
        {
          className: `${props.items.className || ''} ae-Editor-eachItem`
        },
        props.items
      );
    }

    return props;
  }

  buildDataSchemas(node: EditorNodeType, region?: EditorNodeType) {
    let dataSchema: any = {
      $id: 'each',
      type: 'object',
      title: '当前循环项',
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
}

registerEditorPlugin(EachPlugin);
