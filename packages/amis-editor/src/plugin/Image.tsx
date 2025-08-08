import {
  RendererPluginAction,
  RendererPluginEvent,
  getI18nEnabled,
  registerEditorPlugin
} from 'amis-editor-core';
import {
  ActiveEventContext,
  BaseEventContext,
  BasePlugin,
  PluginEvent,
  ResizeMoveEventContext
} from 'amis-editor-core';
import {defaultValue, getSchemaTpl, tipedLabel} from 'amis-editor-core';
import {mockValue} from 'amis-editor-core';
import {
  buildLinkActionDesc,
  getArgsWrapper,
  getEventControlConfig
} from '../renderer/event-control/helper';
import React from 'react';

export class ImagePlugin extends BasePlugin {
  static id = 'ImagePlugin';
  static scene = ['layout'];
  // 关联渲染器名字
  rendererName = 'image';
  $schema = '/schemas/ImageSchema.json';

  // 组件名称
  name = '图片展示';
  isBaseComponent = true;
  description =
    '可以用来展示一张图片，支持静态设置图片地址，也可以配置 <code>name</code> 与变量关联。';
  docLink = '/amis/zh-CN/components/image';
  tags = ['展示'];
  icon = 'fa fa-photo';
  pluginIcon = 'image-plugin';
  scaffold = {
    type: 'image'
  };
  previewSchema = {
    ...this.scaffold,
    thumbMode: 'cover',
    value: mockValue({type: 'image'})
  };

  // 事件定义
  events: RendererPluginEvent[] = [
    {
      eventName: 'click',
      eventLabel: '点击',
      description: '点击时触发',
      defaultShow: true,
      dataSchema: [
        {
          type: 'object',
          properties: {
            context: {
              type: 'object',
              title: '上下文',
              properties: {
                nativeEvent: {
                  type: 'object',
                  title: '鼠标事件对象'
                }
              }
            }
          }
        }
      ]
    },
    {
      eventName: 'mouseenter',
      eventLabel: '鼠标移入',
      description: '鼠标移入时触发',
      dataSchema: [
        {
          type: 'object',
          properties: {
            context: {
              type: 'object',
              title: '上下文',
              properties: {
                nativeEvent: {
                  type: 'object',
                  title: '鼠标事件对象'
                }
              }
            }
          }
        }
      ]
    },
    {
      eventName: 'mouseleave',
      eventLabel: '鼠标移出',
      description: '鼠标移出时触发',
      dataSchema: [
        {
          type: 'object',
          properties: {
            context: {
              type: 'object',
              title: '上下文',
              properties: {
                nativeEvent: {
                  type: 'object',
                  title: '鼠标事件对象'
                }
              }
            }
          }
        }
      ]
    }
  ];

  // 动作定义
  actions: RendererPluginAction[] = [
    {
      actionType: 'preview',
      actionLabel: '预览',
      description: '预览图片',
      descDetail: (info: any, context: any, props: any) => {
        return (
          <div className="action-desc">
            预览
            {buildLinkActionDesc(props.manager, info)}
          </div>
        );
      }
    },
    {
      actionType: 'zoom',
      actionLabel: '调整图片比例',
      description: '将图片等比例放大或缩小',
      descDetail: (info: any, context: any, props: any) => {
        return (
          <div className="action-desc">
            调整
            {buildLinkActionDesc(props.manager, info)}
            图片比例
          </div>
        );
      },
      schema: {
        type: 'container',
        body: [
          getArgsWrapper([
            getSchemaTpl('formulaControl', {
              name: 'scale',
              mode: 'horizontal',
              variables: '${variables}',
              horizontal: {
                leftFixed: 4 // 需要设置下leftFixed，否则这个字段的控件没有与其他字段的控件左对齐
              },
              label: tipedLabel(
                '调整比例',
                '定义每次放大或缩小图片的百分比大小，正值为放大，负值为缩小，默认50'
              ),
              value: 50,
              size: 'lg'
            })
          ])
        ]
      }
    }
  ];

  panelTitle = '图片';
  panelJustify = true;
  panelBodyCreator = (context: BaseEventContext) => {
    const isUnderField = /\/field\/\w+$/.test(context.path as string);
    const i18nEnabled = getI18nEnabled();
    return getSchemaTpl('tabs', [
      {
        title: '属性',
        body: getSchemaTpl('collapseGroup', [
          {
            title: '基本',
            body: [
              {
                name: 'title',
                type: i18nEnabled ? 'input-text-i18n' : 'input-text',
                label: '图片标题'
              },
              {
                name: 'imageCaption',
                type: i18nEnabled ? 'input-text-i18n' : 'input-text',
                label: '图片描述'
              },
              {
                name: 'imageMode',
                label: '展示模式',
                type: 'select',
                pipeIn: defaultValue('thumb'),
                options: [
                  {
                    label: '缩略图',
                    value: 'thumb'
                  },
                  {
                    label: '原图',
                    value: 'original'
                  }
                ]
              },
              isUnderField
                ? null
                : getSchemaTpl('imageUrl', {
                    name: 'src',
                    label: '缩略图地址',
                    description: '如果已绑定字段名，可以不用设置，支持用变量。'
                  }),

              getSchemaTpl('backgroundImageUrl', {
                name: 'editorSetting.mock.src',
                label: tipedLabel(
                  '假数据图片',
                  '只在编辑区显示的模拟图片，运行时将显示图片实际内容'
                )
              }),
              {
                type: 'ae-switch-more',
                mode: 'normal',
                name: 'enlargeAble',
                label: tipedLabel(
                  '图片放大功能',
                  '放大功能和打开外部链接功能是冲突的，若要点击时打开外部链接请先关闭此功能'
                ),
                value: false,
                hiddenOnDefault: false,
                formType: 'extend',
                pipeIn: (value: any) => !!value,
                form: {
                  body: [
                    getSchemaTpl('imageUrl', {
                      name: 'originalSrc',
                      label: '原图地址',
                      description: '如果不配置将默认使用缩略图地址。'
                    })
                  ]
                }
              },
              {
                type: 'input-text',
                label: '打开外部链接',
                name: 'href',
                hiddenOn: 'this.enlargeAble',
                clearValueOnHidden: true
              },
              getSchemaTpl('imageUrl', {
                name: 'defaultImage',
                label: tipedLabel('占位图', '无数据时显示的图片')
              }),
              getSchemaTpl('formulaControl', {
                name: 'maxScale',
                mode: 'horizontal',
                label: tipedLabel(
                  '放大极限',
                  '定义动作调整图片大小的最大百分比，默认200'
                ),
                value: 200
              }),
              getSchemaTpl('formulaControl', {
                name: 'minScale',
                mode: 'horizontal',
                label: tipedLabel(
                  '缩小极限',
                  '定义动作调整图片大小的最小百分比，默认50'
                ),
                value: 50
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
            title: '基本',
            body: [
              // amis 已废弃
              // getSchemaTpl('switch', {
              //   name: 'showDimensions',
              //   label: '显示图片尺寸'
              // }),
              getSchemaTpl('layout:display', {
                flexHide: true,
                value: 'inline-block',
                label: '显示类型'
              }),

              {
                name: 'thumbMode',
                visibleOn: '${!imageMode || imageMode ===  "thumb"}',
                type: 'select',
                label: '展示模式',
                mode: 'horizontal',
                labelAlign: 'left',
                horizontal: {
                  left: 5,
                  right: 7
                },
                pipeIn: defaultValue('contain'),
                options: [
                  {
                    label: '宽度占满',
                    value: 'w-full'
                  },

                  {
                    label: '高度占满',
                    value: 'h-full'
                  },

                  {
                    label: '包含',
                    value: 'contain'
                  },

                  {
                    label: '铺满',
                    value: 'cover'
                  }
                ]
              },

              getSchemaTpl('theme:size', {
                label: '尺寸',
                name: 'themeCss.imageContentClassName.size:default'
              })
            ]
          },
          getSchemaTpl('theme:base', {
            classname: 'imageControlClassName',
            title: '图片'
          }),
          {
            title: '其他',
            body: [
              getSchemaTpl('theme:font', {
                label: '标题文字',
                name: 'themeCss.titleControlClassName.font',
                editorValueToken: '--image-image-normal'
              }),
              getSchemaTpl('theme:paddingAndMargin', {
                label: '标题边距',
                name: 'themeCss.titleControlClassName.padding-and-margin',
                editorValueToken: '--image-image-normal-title'
              }),
              getSchemaTpl('theme:font', {
                label: '描述文字',
                name: 'themeCss.desControlClassName.font',
                editorValueToken: '--image-image-description'
              }),
              getSchemaTpl('theme:paddingAndMargin', {
                label: '描述边距',
                name: 'themeCss.desControlClassName.padding-and-margin',
                editorValueToken: '--image-image-description'
              }),
              getSchemaTpl('icon', {
                name: 'themeCss.iconControlClassName.--image-image-normal-icon',
                label: '放大图标',
                returnSvg: true
              }),
              getSchemaTpl('icon', {
                name: 'themeCss.galleryControlClassName.--image-images-prev-icon',
                label: '左切换图标',
                returnSvg: true
              }),
              getSchemaTpl('icon', {
                name: 'themeCss.galleryControlClassName.--image-images-next-icon',
                label: '右切换图标',
                returnSvg: true
              }),
              getSchemaTpl('theme:select', {
                label: '切换图标大小',
                name: 'themeCss.galleryControlClassName.--image-images-item-size'
              })
            ]
          },
          getSchemaTpl('theme:cssCode')
        ])
      },
      {
        title: '事件',
        className: 'p-none',
        body: [
          getSchemaTpl('eventControl', {
            name: 'onEvent',
            ...getEventControlConfig(this.manager, context)
          })
        ]
      }
    ]);
  };

  onActive(event: PluginEvent<ActiveEventContext>) {
    const context = event.context;

    if (context.info?.plugin !== this || !context.node) {
      return;
    }

    const node = context.node!;
    node.setHeightMutable(true);
    node.setWidthMutable(true);
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
    return this.onSizeChangeStart(event, 'horizontal');
  }

  onHeightChangeStart(
    event: PluginEvent<
      ResizeMoveEventContext,
      {
        onMove(e: MouseEvent): void;
        onEnd(e: MouseEvent): void;
      }
    >
  ) {
    return this.onSizeChangeStart(event, 'vertical');
  }

  onSizeChangeStart(
    event: PluginEvent<
      ResizeMoveEventContext,
      {
        onMove(e: MouseEvent): void;
        onEnd(e: MouseEvent): void;
      }
    >,
    direction: 'both' | 'vertical' | 'horizontal' = 'both'
  ) {
    const context = event.context;
    const node = context.node;
    if (node.info?.plugin !== this) {
      return;
    }

    const resizer = context.resizer;
    const dom = context.dom;
    const frameRect = dom.parentElement!.getBoundingClientRect();
    const rect = dom.getBoundingClientRect();
    const startX = context.nativeEvent.pageX;
    const startY = context.nativeEvent.pageY;

    event.setData({
      onMove: (e: MouseEvent) => {
        const dy = e.pageY - startY;
        const dx = e.pageX - startX;
        const height = Math.max(50, rect.height + dy);
        const width = Math.max(100, Math.min(rect.width + dx, frameRect.width));
        const state: any = {
          width,
          height
        };

        if (direction === 'both') {
          resizer.setAttribute('data-value', `${width}px x ${height}px`);
        } else if (direction === 'vertical') {
          resizer.setAttribute('data-value', `${height}px`);
          delete state.width;
        } else {
          resizer.setAttribute('data-value', `${width}px`);
          delete state.height;
        }

        node.updateState(state);

        requestAnimationFrame(() => {
          node.calculateHighlightBox();
        });
      },
      onEnd: (e: MouseEvent) => {
        const dy = e.pageY - startY;
        const dx = e.pageX - startX;
        const height = Math.max(50, rect.height + dy);
        const width = Math.max(100, Math.min(rect.width + dx, frameRect.width));
        const state: any = {
          width,
          height
        };

        if (direction === 'vertical') {
          delete state.width;
        } else if (direction === 'horizontal') {
          delete state.height;
        }

        resizer.removeAttribute('data-value');
        node.updateSchema(state);
        node.updateState({}, true);
        requestAnimationFrame(() => {
          node.calculateHighlightBox();
        });
      }
    });
  }
}

registerEditorPlugin(ImagePlugin);
