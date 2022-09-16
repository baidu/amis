import {
  getSchemaTpl,
  valuePipeOut,
  RendererPluginAction,
  RendererPluginEvent,
  BasePlugin,
  BaseEventContext,
  registerEditorPlugin
} from 'amis-editor-core';
import {tipedLabel} from 'amis-editor-core';
import {getEventControlConfig} from '../../renderer/event-control/helper';
import {ValidatorTag} from '../../validator';

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
    imageClassName: 'r w-full',
    receiver: {
      url: 'object-upload://default',
      method: 'post'
    }
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
  notRenderFormZone = true;

  // 事件定义
  events: RendererPluginEvent[] = [
    {
      eventName: 'change',
      eventLabel: '值变化',
      description: '上传文件值变化时触发（上传失败同样会触发）',
      dataSchema: [
        {
          type: 'object',
          properties: {
            'event.data.value': {
              type: 'object',
              title: '上传的文件'
            }
          }
        }
      ]
    },
    {
      eventName: 'remove',
      eventLabel: '移除文件',
      description: '移除文件时触发',
      dataSchema: [
        {
          type: 'object',
          properties: {
            'event.data.value': {
              type: 'object',
              title: '被移除的文件'
            }
          }
        }
      ]
    },
    {
      eventName: 'success',
      eventLabel: '上传成功',
      description: '上传文件成功时触发',
      dataSchema: [
        {
          type: 'object',
          properties: {
            'event.data.value': {
              type: 'object',
              title: '远程上传请求成功后返回的结果数据'
            }
          }
        }
      ]
    },
    {
      eventName: 'fail',
      eventLabel: '上传失败',
      description: '上传文件失败时触发',
      dataSchema: [
        {
          type: 'object',
          properties: {
            'event.data.file': {
              type: 'object',
              title: '上传的文件'
            },
            'event.data.error': {
              type: 'object',
              title: '远程上传请求失败后返回的错误信息'
            }
          }
        }
      ]
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

  panelJustify = true;

  panelBodyCreator = (context: BaseEventContext) => {
    return getSchemaTpl('tabs', [
      {
        title: '属性',
        body: getSchemaTpl('collapseGroup', [
          {
            title: '基本',
            body: [
              getSchemaTpl('formItemName', {
                required: true
              }),
              getSchemaTpl('label'),

              {
                type: 'input-text',
                name: 'value',
                label: '默认值',
                visibleOn: 'typeof this.value !== "undefined"'
              },

              {
                type: 'input-text',
                value: '.jpeg, .jpg, .png, .gif',
                name: 'accept',
                label: tipedLabel(
                  '图片类型',
                  '请填入图片的后缀或 <code>MimeType</code>，多个类型用<code>,</code>隔开'
                )
              },

              {
                type: 'input-text',
                name: 'frameImage',
                label: '占位图片地址'
              },

              getSchemaTpl('uploadType', {
                visibleOn: 'data.submitType === "asUpload" || !data.submitType',
                pipeIn: (value: any, form: any) => value || 'fileReceptor',
                pipeOut: (value: any, form: any) => value || 'fileReceptor'
              }),

              getSchemaTpl('apiControl', {
                name: 'receiver',
                label: tipedLabel(
                  '文件接收器',
                  '文件接收接口，默认不填则上传到 hiphoto'
                ),
                visibleOn: 'data.uploadType === "fileReceptor"',
                value: '/api/upload',
                __isUpload: true
              }),

              getSchemaTpl('bos', {
                visibleOn: 'data.uploadType === "bos"'
              }),

              getSchemaTpl('proxy', {
                value: false
              }),
              // getSchemaTpl('autoFill'),

              getSchemaTpl('multiple', {
                patch: {
                  value: false,
                  visibleOn: '!data.crop',
                  label: tipedLabel('可多选', '开启后，不能同时开启裁剪功能')
                },
                body: [
                  {
                    name: 'maxLength',
                    label: '最大数量',
                    type: 'input-number'
                  }
                ]
              }),

              getSchemaTpl('switch', {
                name: 'fixedSize',
                label: tipedLabel(
                  '固定尺寸',
                  '开启后需同时设置 fixedSizeClassName'
                ),
                value: false
              }),

              {
                type: 'container',
                className: 'ae-ExtendMore mb-3',
                visibleOn: 'data.fixedSize',
                body: [
                  {
                    type: 'input-text',
                    name: 'fixedSizeClassName',
                    label: tipedLabel(
                      'CSS类名',
                      '开启固定尺寸时，根据此值控制展示尺寸'
                    )
                  }
                ]
              },

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

              // getSchemaTpl('switch', {
              //   name: 'compress',
              //   value: true,
              //   label: tipedLabel(
              //     '开启压缩',
              //     '由 hiphoto 实现，自定义接口将无效'
              //   )
              // }),
              // {
              //   type: 'container',
              //   className: 'ae-ExtendMore mb-3',
              //   visibleOn: 'data.compress',
              //   name: 'compressOptions',
              //   body: [
              //     {
              //       type: 'input-number',
              //       label: '最大宽度',
              //       name: 'compressOptions.maxWidth'
              //     },

              //     {
              //       type: 'input-number',
              //       label: '最大高度',
              //       name: 'compressOptions.maxHeight'
              //     }
              //   ]
              // },

              // getSchemaTpl('switch', {
              //   name: 'showCompressOptions',
              //   label: '显示压缩选项'
              // }),

              getSchemaTpl('switch', {
                name: 'crop',
                visibleOn: '!data.multiple',
                label: tipedLabel('开启裁剪', '开启后，不能同时开启多选模式'),
                pipeIn: (value: any) => !!value
              }),

              {
                type: 'container',
                className: 'ae-ExtendMore mb-3',
                visibleOn: 'data.crop',
                body: [
                  {
                    name: 'crop.aspectRatio',
                    type: 'input-text',
                    label: '裁剪比率',
                    pipeOut: valuePipeOut
                  },

                  getSchemaTpl('switch', {
                    name: 'crop.rotatable',
                    label: '裁剪时可旋转',
                    pipeOut: valuePipeOut
                  }),

                  getSchemaTpl('switch', {
                    name: 'crop.scalable',
                    label: '裁剪时可缩放',
                    pipeOut: valuePipeOut
                  }),

                  {
                    name: 'crop.viewMode',
                    type: 'select',
                    label: '裁剪区域',
                    value: 1,
                    options: [
                      {label: '无限制', value: 0},
                      {label: '绘图区域', value: 1}
                    ],
                    pipeOut: valuePipeOut
                  }
                ]
              },

              getSchemaTpl('switch', {
                name: 'limit',
                label: '图片限制',
                pipeIn: (value: any) => !!value
              }),

              {
                type: 'container',
                className: 'ae-ExtendMore mb-3',
                visibleOn: 'data.limit',
                body: [
                  {
                    name: 'maxSize',
                    type: 'input-number',
                    label: tipedLabel(
                      '最大体积',
                      '超出大小不允许上传，单位字节'
                    )
                  },
                  {
                    type: 'input-number',
                    name: 'limit.width',
                    label: tipedLabel(
                      '宽度',
                      '校验优先级比最大宽度和最大宽度高'
                    )
                  },

                  {
                    type: 'input-number',
                    name: 'limit.height',
                    label: tipedLabel(
                      '高度',
                      '校验优先级比最大高度和最大高度高'
                    )
                  },

                  {
                    type: 'input-number',
                    name: 'limit.maxWidth',
                    label: '最大宽度'
                  },

                  {
                    type: 'input-number',
                    name: 'limit.maxHeight',
                    label: '最大高度'
                  },

                  {
                    type: 'input-number',
                    name: 'limit.minWidth',
                    label: '最小宽度'
                  },

                  {
                    type: 'input-number',
                    name: 'limit.minHeight',
                    label: '最小高度'
                  },

                  {
                    type: 'input-number',
                    name: 'limit.aspectRatio',
                    label: '宽高比率'
                  },

                  {
                    type: 'input-text',
                    name: 'limit.aspectRatioLabel',
                    label: tipedLabel(
                      '宽高比描述',
                      '当宽高比没有满足条件时，此描述将作为提示信息显示'
                    )
                  }
                ]
              }
            ]
          },
          getSchemaTpl('status', {isFormItem: true}),
          getSchemaTpl('validation', {tag: ValidatorTag.File})
        ])
      },
      {
        title: '外观',
        body: getSchemaTpl('collapseGroup', [
          getSchemaTpl('style:formItem', {renderer: context.info.renderer}),
          getSchemaTpl('style:classNames', {
            schema: []
          })
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
}

registerEditorPlugin(ImageControlPlugin);
