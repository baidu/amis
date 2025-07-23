import {
  getSchemaTpl,
  valuePipeOut,
  RendererPluginAction,
  RendererPluginEvent,
  BasePlugin,
  BaseEventContext,
  registerEditorPlugin,
  tipedLabel
} from 'amis-editor-core';
import {
  getEventControlConfig,
  getActionCommonProps
} from '../../renderer/event-control/helper';
import {ValidatorTag} from '../../validator';

const addBtnCssClassName = 'themeCss.addBtnControlClassName';
const IconCssClassName = 'themeCss.iconControlClassName';
const editorPath = '--inputImage-base';
const inputStateFunc = (visibleOn: string, state: string) => {
  return [
    getSchemaTpl('theme:border', {
      name: `${addBtnCssClassName}.border:${state}`,
      visibleOn: visibleOn,
      editorValueToken: `${editorPath}-${state}`
    }),
    getSchemaTpl('theme:colorPicker', {
      label: '文字',
      name: `${addBtnCssClassName}.color:${state}`,
      labelMode: 'input',
      visibleOn: visibleOn,
      editorValueToken: `${editorPath}-${state}-color`
    }),
    getSchemaTpl('theme:colorPicker', {
      label: '背景',
      name: `${addBtnCssClassName}.background:${state}`,
      labelMode: 'input',
      needGradient: true,
      needImage: true,
      visibleOn: visibleOn,
      editorValueToken: `${editorPath}-${state}-bg-color`
    }),
    getSchemaTpl('theme:colorPicker', {
      label: '图标',
      name: `${addBtnCssClassName}.icon-color:${state}`,
      labelMode: 'input',
      visibleOn: visibleOn,
      editorValueToken: `${editorPath}-${state}-icon-color`
    })
  ];
};

export class ImageControlPlugin extends BasePlugin {
  static id = 'ImageControlPlugin';
  // 关联渲染器名字
  rendererName = 'input-image';
  $schema = '/schemas/ImageControlSchema.json';

  // 组件名称
  name = '图片上传';
  isBaseComponent = true;
  description =
    '可以对图片实现裁剪，限制图片的宽高以及大小，支持自动上传及上传多张图片';
  docLink = '/amis/zh-CN/components/form/input-image';
  tags = ['表单项'];
  icon = 'fa fa-crop';
  pluginIcon = 'input-image-plugin';
  scaffold = {
    type: 'input-image',
    label: '图片上传',
    name: 'image',
    autoUpload: true,
    proxy: true,
    uploadType: 'fileReceptor',
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
            data: {
              type: 'object',
              title: '数据',
              properties: {
                file: {
                  type: 'object',
                  title: '上传的文件'
                }
              }
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
            data: {
              type: 'object',
              title: '数据',
              properties: {
                item: {
                  type: 'object',
                  title: '被移除的文件'
                }
              }
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
            data: {
              type: 'object',
              title: '数据',
              properties: {
                item: {
                  type: 'object',
                  title: '上传的文件'
                },
                result: {
                  type: 'object',
                  title: '远程上传请求成功后返回的响应数据'
                }
              }
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
            data: {
              type: 'object',
              title: '数据',
              properties: {
                item: {
                  type: 'object',
                  title: '上传的文件'
                },
                error: {
                  type: 'object',
                  title: '远程上传请求失败后返回的错误信息'
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
      actionType: 'clear',
      actionLabel: '清空数据',
      description: '清除选择的文件',
      ...getActionCommonProps('clear')
    },
    {
      actionType: 'setValue',
      actionLabel: '赋值',
      description: '触发组件数据更新',
      ...getActionCommonProps('setValue')
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
              getSchemaTpl('layout:originPosition', {value: 'left-top'}),
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
                visibleOn: 'this.submitType === "asUpload" || !this.submitType',
                pipeIn: (value: any, form: any) => value || 'fileReceptor',
                pipeOut: (value: any, form: any) => value || 'fileReceptor'
              }),

              getSchemaTpl('apiControl', {
                mode: 'row',
                name: 'receiver',
                label: tipedLabel(
                  '文件接收器',
                  '文件接收接口，默认不填则上传到 hiphoto'
                ),
                visibleOn: 'this.uploadType === "fileReceptor"',
                value: '/api/upload',
                __isUpload: true
              }),

              getSchemaTpl('bos', {
                visibleOn: 'this.uploadType === "bos"'
              }),

              getSchemaTpl('proxy', {
                value: true
              }),
              // getSchemaTpl('autoFill'),

              getSchemaTpl('multiple', {
                patch: {
                  value: false,
                  visibleOn: '!this.crop',
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
              //   visibleOn: 'this.compress',
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
                visibleOn: '!this.multiple',
                label: tipedLabel('开启裁剪', '开启后，不能同时开启多选模式'),
                pipeIn: (value: any) => !!value
              }),

              {
                type: 'container',
                className: 'ae-ExtendMore mb-3',
                visibleOn: 'this.crop',
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
                  },
                  {
                    name: 'cropQuality',
                    type: 'input-number',
                    label: tipedLabel(
                      '压缩质量',
                      '裁剪后会重新生成，体积可能会变大，需要设置压缩质量降低体积，数值越小压缩率越高'
                    ),
                    step: 0.1,
                    min: 0.1,
                    max: 1,
                    value: 0.7
                  }
                ]
              },

              getSchemaTpl('switch', {
                name: 'limit',
                label: '图片限制',
                pipeIn: (value: any) => !!value,
                onChange: (
                  value: any,
                  oldValue: boolean,
                  model: any,
                  form: any
                ) => {
                  if (!value) {
                    form.setValues({
                      maxSize: undefined
                    });
                  }
                }
              }),

              {
                type: 'container',
                className: 'ae-ExtendMore mb-3',
                visibleOn: 'this.limit',
                body: [
                  {
                    name: 'maxSize',
                    type: 'input-number',
                    suffix: 'B',
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
          getSchemaTpl('status', {
            isFormItem: true,
            unsupportStatic: true
          }),
          getSchemaTpl('validation', {tag: ValidatorTag.File})
        ])
      },
      {
        title: '外观',
        body: getSchemaTpl(
          'collapseGroup',
          [
            getSchemaTpl('theme:formItem'),
            {
              title: '基本样式',
              body: [
                {
                  type: 'select',
                  name: '__editorState',
                  label: '状态',
                  selectFirst: true,
                  options: [
                    {
                      label: '常规',
                      value: 'default'
                    },
                    {
                      label: '悬浮',
                      value: 'hover'
                    },
                    {
                      label: '点击',
                      value: 'active'
                    }
                  ]
                },
                ...inputStateFunc(
                  "${__editorState == 'default' || !__editorState}",
                  'default'
                ),
                ...inputStateFunc("${__editorState == 'hover'}", 'hover'),
                ...inputStateFunc("${__editorState == 'active'}", 'active'),
                getSchemaTpl('theme:radius', {
                  name: `${addBtnCssClassName}.border-radius`,
                  label: '圆角',
                  editorValueToken: `${editorPath}-default`
                }),
                {
                  name: `${addBtnCssClassName}.--inputImage-base-default-icon`,
                  label: '选择图标',
                  type: 'icon-select',
                  returnSvg: true
                },
                getSchemaTpl('theme:select', {
                  name: `${IconCssClassName}.iconSize`,
                  label: '图标大小',
                  editorValueToken: `${editorPath}-default-icon-size`
                }),
                getSchemaTpl('theme:select', {
                  name: `${IconCssClassName}.margin-bottom`,
                  label: '图标底边距',
                  editorValueToken: `${editorPath}-default-icon-margin`
                })
              ]
            },
            getSchemaTpl('theme:cssCode', {
              themeClass: [
                {
                  name: '图片上传按钮',
                  value: 'addOn',
                  className: 'addBtnControlClassName',
                  state: ['default', 'hover', 'active']
                },
                {
                  name: '上传图标',
                  value: 'icon',
                  className: 'iconControlClassName'
                }
              ],
              isFormItem: true
            })
          ],
          {...context?.schema, configTitle: 'style'}
        )
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
