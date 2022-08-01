import {getSchemaTpl, valuePipeOut} from 'amis-editor-core';
import {registerEditorPlugin} from 'amis-editor-core';
import {BasePlugin, BaseEventContext} from 'amis-editor-core';
import {formItemControl} from '../../component/BaseControl';
import {RendererPluginAction, RendererPluginEvent} from 'amis-editor-core';

export class ImageControlPlugin extends BasePlugin {
  // 关联渲染器名字
  rendererName = 'input-image';
  $schema = '/schemas/ImageControlSchema.json';

  // 组件名称
  name = '图片上传';
  isBaseComponent = true;
  description = `可以对图片实现裁剪，限制图片的宽高以及大小，支持自动上传及上传多张图片`;
  docLink = '/amis/zh-CN/components/form/input-image';
  tags = ['表单项'];
  icon = 'fa fa-crop';
  pluginIcon = 'input-image-plugin';
  scaffold = {
    type: 'input-image',
    label: '图片上传',
    name: 'image',
    imageClassName: 'r w-full'
  };
  previewSchema: any = {
    type: 'form',
    className: 'text-left',
    mode: 'horizontal',
    wrapWithPanel: false,
    body: [
      {
        ...this.scaffold
      }
    ]
  };

  // 事件定义
  events: RendererPluginEvent[] = [
    {
      eventName: 'change',
      eventLabel: '值变化',
      description: '文件值变化'
    },
    {
      eventName: 'remove',
      eventLabel: '移除文件',
      description: '移除文件'
    },
    {
      eventName: 'success',
      eventLabel: '上传成功',
      description: '上传成功'
    },
    {
      eventName: 'fail',
      eventLabel: '上传失败',
      description: '上传失败'
    }
  ];

  // 动作定义
  actions: RendererPluginAction[] = [
    {
      actionType: 'clear',
      actionLabel: '清空数据',
      description: '清除选择的文件'
    }
  ];

  panelTitle = '图片上传';
  panelBodyCreator = (context: BaseEventContext) => {
    return formItemControl(
      {
        common: {
          replace: true,
          body: [
            getSchemaTpl('switchDefaultValue'),

            {
              type: 'input-text',
              name: 'value',
              label: '默认值',
              visibleOn: 'typeof this.value !== "undefined"'
            },

            getSchemaTpl('multiple', {
              value: false,
              visibleOn: '!data.crop',
              description: '开启后，不能同时开启裁剪功能'
            }),
            getSchemaTpl('joinValues'),
            getSchemaTpl('delimiter'),
            getSchemaTpl('extractValue'),
            {
              name: 'maxSize',
              type: 'input-number',
              label: '图片最大体积',
              description: '超出大小不允许上传，单位字节'
            },
            {
              name: 'maxLength',
              type: 'input-number',
              label: '图片最大数量',
              visibleOn: 'data.multiple',
              description: '超出数量不允许上传'
            },
            getSchemaTpl('api', {
              label: '文件接收接口',
              name: 'receiver',
              description: '文件接收接口，默认不填则上传到 hiphoto',
              value: '/api/upload',
              __isUpload: true
            }),

            {
              type: 'input-text',
              value: '.jpeg, .jpg, .png, .gif',
              name: 'accept',
              label: '图片类型',
              description:
                '请填入图片的后缀或 <code>MimeType</code>，多个类型用<code>,</code>隔开'
            },

            {
              type: 'input-text',
              name: 'defaultImage',
              label: '占位图片地址'
            },

            getSchemaTpl('switch', {
              name: 'fixedSize',
              label: '是否开启固定尺寸',
              value: false
            }),

            getSchemaTpl('switch', {
              name: 'hideUploadButton',
              label: '隐藏上传按钮',
              value: false
            }),

            getSchemaTpl('switch', {
              name: 'autoUpload',
              label: '自动上传',
              value: false
            }),

            getSchemaTpl('switch', {
              name: 'compress',
              label: '开启压缩',
              value: true,
              description: '由 hiphoto 实现，自定义接口将无效'
            }),

            {
              type: 'combo',
              name: 'compressOptions',
              multiLine: true,
              label: '压缩配置',
              visibleOn: 'data.compress',
              items: [
                {
                  type: 'input-number',
                  label: '最大宽度',
                  name: 'maxWidth'
                },

                {
                  type: 'input-number',
                  label: '最大高度',
                  name: 'maxHeight'
                }
              ]
            },

            getSchemaTpl('switch', {
              name: 'showCompressOptions',
              label: '是否显示压缩选项'
            }),

            getSchemaTpl('switch', {
              name: 'crop',
              label: '是否开启裁剪',
              visibleOn: '!data.multiple',
              description: '开启后，不能同时开启多选模式',
              pipeIn: (value: any) => !!value
            }),

            {
              name: 'crop.aspectRatio',
              type: 'input-text',
              label: '裁剪比率',
              visibleOn: 'data.crop',
              pipeOut: valuePipeOut
            },

            getSchemaTpl('switch', {
              name: 'crop.rotatable',
              label: '裁剪时是否可旋转',
              visibleOn: 'data.crop',
              pipeOut: valuePipeOut
            }),

            getSchemaTpl('switch', {
              name: 'crop.scalable',
              label: '裁剪时否可缩放',
              visibleOn: 'data.crop',
              pipeOut: valuePipeOut
            }),

            {
              name: 'crop.viewMode',
              type: 'select',
              label: '裁剪区域限制',
              value: 1,
              options: [
                {label: '无限制', value: 0},
                {label: '绘图区域', value: 1}
              ],
              visibleOn: 'data.crop',
              pipeOut: valuePipeOut
            },

            {
              type: 'fieldSet',
              title: '图片限制',
              collapsed: true,
              collapsable: true,
              className: 'fieldset',
              body: [
                {
                  type: 'input-number',
                  name: 'limit.width',
                  label: '限制宽度'
                },

                {
                  type: 'input-number',
                  name: 'limit.height',
                  label: '限制高度'
                },

                {
                  type: 'input-number',
                  name: 'limit.maxWidth',
                  label: '限制最大宽度'
                },

                {
                  type: 'input-number',
                  name: 'limit.maxHeight',
                  label: '限制最大高度'
                },

                {
                  type: 'input-number',
                  name: 'limit.minWidth',
                  label: '限制最小宽度'
                },

                {
                  type: 'input-number',
                  name: 'limit.minHeight',
                  label: '限制最小高度'
                },

                {
                  type: 'input-number',
                  name: 'limit.aspectRatio',
                  label: '限制宽高比率'
                },

                {
                  type: 'input-text',
                  name: 'limit.限制最小高度',
                  label: '宽高比描述',
                  description:
                    '当宽高比没有满足条件时，此描述将作为提示信息显示'
                }
              ]
            },
            getSchemaTpl('autoFillApi', {
              visibleOn:
                '!this.autoFill || this.autoFill.scene && this.autoFill.action'
            }),
            getSchemaTpl('autoFill', {
              visibleOn:
                '!this.autoFill || !this.autoFill.scene && !this.autoFill.action'
            })
          ]
        }
      },
      context
    );
  };
}

registerEditorPlugin(ImageControlPlugin);
