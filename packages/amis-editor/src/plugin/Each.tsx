import {isObject} from 'amis';
import React from 'react';
import {EditorNodeType, registerEditorPlugin} from 'amis-editor-core';
import {BaseEventContext, BasePlugin} from 'amis-editor-core';
import {getSchemaTpl} from 'amis-editor-core';
import {escapeFormula} from '../util';
import {set} from 'lodash';

export class EachPlugin extends BasePlugin {
  static id = 'EachPlugin';
  static scene = ['layout'];
  // 关联渲染器名字
  rendererName = 'each';
  $schema = '/schemas/EachSchema.json';

  // 组件名称
  name = '循环 Each';
  isBaseComponent = true;
  isListComponent = true;
  description = '功能渲染器，可以基于现有变量循环输出渲染器。';
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
              }
            },
            {
              type: 'tpl',
              style: {
                fontWeight: 'var(--fonts-weight-3)',
                fontSize: '16px',
                color: 'var(--colors-brand-6)'
              },
              tpl: '回访数量TOP1',
              inline: true,
              wrapperComponent: ''
            }
          ],
          style: {
            position: 'static',
            display: 'flex',
            flexWrap: 'nowrap',
            justifyContent: 'flex-start',
            alignItems: 'center',
            marginBottom: '6px'
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
              tpl: '北京分公司',
              inline: true,
              wrapperComponent: '',
              style: {
                'fontSize': 'var(--fonts-size-4)',
                'color': 'var(--colors-neutral-text-2)',
                'fontWeight': 'var(--fonts-weight-3)',
                'font-family': '-apple-system'
              }
            }
          ],
          style: {
            position: 'static',
            display: 'block'
          },
          wrapperBody: false
        }
      ],
      size: 'none',
      style: {
        position: 'static',
        display: 'block',
        flex: '0 0 150px',
        marginRight: '20px',
        paddingTop: '20px',
        paddingRight: '15px',
        paddingBottom: '20px',
        paddingLeft: '15px',
        flexBasis: '250px',
        overflowX: 'auto',
        overflowY: 'auto',
        boxShadow: ' 0px 0px 8px 0px rgba(3, 3, 3, 0.1)',
        radius: {
          'top-left-border-radius': 'var(--borders-radius-3)',
          'top-right-border-radius': 'var(--borders-radius-3)',
          'bottom-left-border-radius': 'var(--borders-radius-3)',
          'bottom-right-border-radius': 'var(--borders-radius-3)'
        }
      },
      wrapperBody: false,
      isFixedHeight: false
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
    size: 'none'
  };

  previewSchema = {
    ...this.scaffold,
    value: ['a', 'b', 'c']
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
          'data.style && (data.style.display === "flex" || data.style.display === "inline-flex")',
        direction: curRendererSchema.direction,
        justify: curRendererSchema.justify,
        alignItems: curRendererSchema.alignItems
      }),

      getSchemaTpl('layout:flex-wrap', {
        visibleOn:
          'data.style && (data.style.display === "flex" || data.style.display === "inline-flex")'
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
              getSchemaTpl('layout:padding'),
              getSchemaTpl('layout:position', {
                visibleOn: '!data.stickyStatus'
              }),
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
                      'data.style && (data.style.position === "static" || data.style.position === "relative")'
                  })
                : null,
              isFlexItem
                ? getSchemaTpl('layout:flex-grow', {
                    visibleOn:
                      'data.style && data.style.flex === "1 1 auto" && (data.style.position === "static" || data.style.position === "relative")'
                  })
                : null,
              isFlexItem
                ? getSchemaTpl('layout:flex-basis', {
                    label: isFlexColumnItem ? '弹性高度' : '弹性宽度',
                    visibleOn:
                      'data.style && (data.style.position === "static" || data.style.position === "relative") && data.style.flex === "1 1 auto"'
                  })
                : null,
              isFlexItem
                ? getSchemaTpl('layout:flex-basis', {
                    label: isFlexColumnItem ? '固定高度' : '固定宽度',
                    visibleOn:
                      'data.style && (data.style.position === "static" || data.style.position === "relative") && data.style.flex === "0 0 150px"'
                  })
                : null,

              getSchemaTpl('layout:overflow-x', {
                visibleOn: `${
                  isFlexItem && !isFlexColumnItem
                } && data.style.flex === '0 0 150px'`
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
                } && (data.isFixedHeight || data.style && data.style.maxHeight) || (${
                  isFlexItem && isFlexColumnItem
                } && data.style.flex === '0 0 150px')`
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
                } && (data.isFixedWidth || data.style && data.style.maxWidth)`
              }),

              !isFlexItem ? getSchemaTpl('layout:margin-center') : null,
              !isFlexItem && !isFreeContainer
                ? getSchemaTpl('layout:textAlign', {
                    name: 'style.textAlign',
                    label: '内部对齐方式',
                    visibleOn:
                      'data.style && data.style.display !== "flex" && data.style.display !== "inline-flex"'
                  })
                : null,
              getSchemaTpl('layout:z-index'),
              getSchemaTpl('layout:sticky', {
                visibleOn:
                  'data.style && (data.style.position !== "fixed" && data.style.position !== "absolute")'
              }),
              getSchemaTpl('layout:stickyPosition')
            ]
          },
          ...getSchemaTpl('theme:common', {exclude: ['layout']})
        ])
      }
    ]);
  };

  filterProps(props: any) {
    // 列表类型内的文本元素显示{{公式}}或者自定义展位，不显示实际值
    props = escapeFormula(props);
    // 循环编辑态显示2个元素
    props.value = [{}, {}];

    props.className = `${props.className || ''} ae-Editor-list`;
    if (props.items && !props.items.className?.includes('listItem')) {
      props.items.className = `${
        props.items.className || ''
      } ae-Editor-eachItem`;
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
    const schema = scope?.parent?.getSchemaByPath(field);

    if (isObject(schema?.items)) {
      dataSchema = {
        ...dataSchema,
        ...(schema!.items as any)
      };

      // 循环添加索引方便渲染序号
      set(dataSchema, 'properties.index', {
        type: 'number',
        title: '索引'
      });
    }

    return dataSchema;
  }
}

registerEditorPlugin(EachPlugin);
