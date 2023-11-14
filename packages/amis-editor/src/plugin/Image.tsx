import {getI18nEnabled, registerEditorPlugin} from 'amis-editor-core';
import {
  ActiveEventContext,
  BaseEventContext,
  BasePlugin,
  PluginEvent,
  ResizeMoveEventContext
} from 'amis-editor-core';
import {defaultValue, getSchemaTpl, tipedLabel} from 'amis-editor-core';
import {mockValue} from 'amis-editor-core';

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
                    label: '缩率图',
                    value: 'thumb'
                  },
                  {
                    label: '原图',
                    value: 'original'
                  }
                ]
              },
              {
                name: 'width',
                label: '宽度',
                type: 'input-number'
              },
              {
                name: 'height',
                label: '高度',
                type: 'input-number'
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
                name: 'themeCss.imageControlClassName.size:default'
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
                editorThemePath: 'image.image.default.normal.body.font'
              }),
              getSchemaTpl('theme:paddingAndMargin', {
                label: '标题边距',
                name: 'themeCss.titleControlClassName.padding-and-margin'
              }),
              getSchemaTpl('theme:font', {
                label: '描述文字',
                name: 'themeCss.desControlClassName.font',
                editorThemePath: 'image.image.default.description.body.font'
              }),
              getSchemaTpl('theme:paddingAndMargin', {
                label: '描述边距',
                name: 'themeCss.desControlClassName.padding-and-margin'
              }),
              {
                name: 'themeCss.iconControlClassName.--image-image-normal-icon',
                label: '放大图标',
                type: 'icon-select',
                returnSvg: true
              },
              {
                name: 'themeCss.galleryControlClassName.--image-images-prev-icon',
                label: '左切换图标',
                type: 'icon-select',
                returnSvg: true
              },
              {
                name: 'themeCss.galleryControlClassName.--image-images-next-icon',
                label: '右切换图标',
                type: 'icon-select',
                returnSvg: true
              },
              getSchemaTpl('theme:select', {
                label: '切换图标大小',
                name: 'themeCss.galleryControlClassName.--image-images-item-size'
              })
            ]
          },
          getSchemaTpl('theme:cssCode')
        ])
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
        requestAnimationFrame(() => {
          node.calculateHighlightBox();
        });
      }
    });
  }
}

registerEditorPlugin(ImagePlugin);
