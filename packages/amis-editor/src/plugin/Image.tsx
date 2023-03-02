import {registerEditorPlugin} from 'amis-editor-core';
import {
  ActiveEventContext,
  BaseEventContext,
  BasePlugin,
  PluginEvent,
  ResizeMoveEventContext
} from 'amis-editor-core';
import {defaultValue, getSchemaTpl} from 'amis-editor-core';
import {mockValue} from 'amis-editor-core';

export class ImagePlugin extends BasePlugin {
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
  panelBodyCreator = (context: BaseEventContext) => {
    const isUnderField = /\/field\/\w+$/.test(context.path as string);
    return [
      getSchemaTpl('tabs', [
        {
          title: '常规',
          body: [
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
              name: 'title',
              type: 'input-text',
              label: '图片标题'
            },
            {
              name: 'imageCaption',
              type: 'input-text',
              label: '图片描述'
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
                  type: 'input-text',
                  label: '缩略图地址',
                  description: '如果已绑定字段名，可以不用设置，支持用变量。'
                }),
            {
              type: 'input-text',
              label: '打开外部链接',
              name: 'href'
            },
            getSchemaTpl('imageUrl', {
              name: 'defaultImage',
              label: '无数据时显示的图片'
            })
          ]
        },
        {
          title: '外观',
          body: [
            getSchemaTpl('switch', {
              name: 'enlargeAble',
              label: '开启图片放大功能'
            }),

            getSchemaTpl('imageUrl', {
              name: 'originalSrc',
              visibleOn: 'this.enlargeAble',
              label: '原图地址',
              description: '如果不配置将默认使用缩略图地址。'
            }),

            getSchemaTpl('switch', {
              name: 'showDimensions',
              label: '是否显示图片尺寸'
            }),

            {
              name: 'thumbMode',
              type: 'button-group-select',
              label: '缩略图展示模式',
              size: 'sm',
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

            {
              name: 'thumbRatio',
              type: 'button-group-select',
              label: '缩略图比率',
              size: 'sm',
              pipeIn: defaultValue('1:1'),
              options: [
                {
                  label: '1:1',
                  value: '1:1'
                },

                {
                  label: '4:3',
                  value: '4:3'
                },

                {
                  label: '16:9',
                  value: '16:9'
                }
              ]
            },

            getSchemaTpl('className', {
              autoComplete: false
            }),

            getSchemaTpl('className', {
              name: 'imageClassName',
              label: '图片 CSS 类名'
            }),

            getSchemaTpl('className', {
              name: 'thumbClassName',
              label: '缩略图 CSS 类名'
            })
          ]
        },
        {
          title: '显隐',
          body: [
            // getSchemaTpl('ref'),
            getSchemaTpl('visible')
          ]
        }
      ])
    ];
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
