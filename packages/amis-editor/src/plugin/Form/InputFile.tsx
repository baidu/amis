import {defaultValue, getSchemaTpl, valuePipeOut} from 'amis-editor-core';
import {registerEditorPlugin, tipedLabel} from 'amis-editor-core';
import {BasePlugin, BaseEventContext} from 'amis-editor-core';
import {ValidatorTag} from '../../validator';
import {getEventControlConfig} from '../../renderer/event-control/helper';
import {RendererPluginAction, RendererPluginEvent} from 'amis-editor-core';

export class FileControlPlugin extends BasePlugin {
  static id = 'FileControlPlugin';
  // 关联渲染器名字
  rendererName = 'input-file';
  $schema = '/schemas/FileControlSchema.json';

  // 组件名称
  name = '文件上传';
  isBaseComponent = true;
  icon = 'fa fa-upload';
  pluginIcon = 'input-file-plugin';
  description = '可上传多个文件，可配置是否自动上传以及大文件分片上传';
  docLink = '/amis/zh-CN/components/form/input-file';
  tags = ['表单项'];
  scaffold = {
    type: 'input-file',
    label: '文件上传',
    autoUpload: true,
    proxy: true,
    uploadType: 'fileReceptor',
    name: 'file'
  };
  previewSchema: any = {
    type: 'form',
    className: 'text-left',
    wrapWithPanel: false,
    mode: 'horizontal',
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
      description: '清除选择的文件'
    },
    {
      actionType: 'setValue',
      actionLabel: '赋值',
      description: '触发组件数据更新'
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
              getSchemaTpl('btnLabel'),
              getSchemaTpl('multiple', {
                replace: true,
                body: [
                  {
                    name: 'maxLength',
                    label: '最大数量',
                    type: 'input-number'
                  }
                ]
              }),
              {
                type: 'input-group',
                name: 'maxSize',
                label: '最大体积',
                body: [
                  {
                    type: 'input-number',
                    name: 'maxSize'
                  },
                  {
                    type: 'tpl',
                    addOnclassName: 'border-0 bg-none',
                    tpl: 'B'
                  }
                ]
              },
              getSchemaTpl('uploadType', {
                options: [
                  {
                    label: '随表单提交',
                    value: 'asForm'
                  },
                  {
                    label: '文件接收器',
                    value: 'fileReceptor'
                  },
                  {
                    label: '对象存储',
                    value: 'bos'
                  }
                ],
                pipeIn: (value: any, form: any) => value || 'fileReceptor',
                pipeOut: (value: any, form: any) => value || 'fileReceptor',
                onChange: (
                  value: any,
                  oldValue: boolean,
                  model: any,
                  form: any
                ) => {
                  if (value === 'asForm') {
                    // 作为表单数据，自动上传开启
                    form.setValueByName('autoUpload', true);
                    const formType =
                      form.getValueByName('formType') || 'asBlob';
                    form.setValueByName(formType, true);
                  } else {
                    form.setValueByName('asBase64', false);
                    form.setValueByName('asBlob', false);
                  }
                }
              }),

              {
                name: 'formType',
                type: 'select',
                tiled: true,
                visibleOn: 'data.uploadType === "asForm"',
                value: 'asBlob',
                label: tipedLabel(
                  '数据格式',
                  '${formType ? asBase64 ? "小文件时可以使用，默认给 Form 提交的是文件下载地址，设置后给 Form 提交文件内容的 base64 格式字符串。" : "File 控件不接管文件上传，直接由表单的保存接口完成。和 Base64 选项二选一。" : ""}'
                ),
                options: [
                  {
                    label: 'Base64',
                    value: 'asBase64'
                  },

                  {
                    label: '二进制',
                    value: 'asBlob'
                  }
                ],
                onChange: (
                  value: any,
                  oldValue: boolean,
                  model: any,
                  form: any
                ) => {
                  form.setValueByName('asBase64', 'asBase64' === value);
                  form.setValueByName('asBlob', 'asBlob' === value);
                }
              },

              getSchemaTpl('bos', {
                visibleOn: 'data.uploadType === "bos"'
              }),

              getSchemaTpl('proxy', {
                value: true,
                visibleOn: 'data.uploadType !== "asForm" || !data.uploadType'
              }),

              getSchemaTpl('switch', {
                name: 'autoUpload',
                label: '自动上传',
                value: true,
                visibleOn: 'data.uploadType !== "asForm"'
              }),

              getSchemaTpl('switch', {
                name: 'useChunk',
                label: '开启分块',
                value: false,
                pipeIn: (value: any, form: any) => !!value, // 兼容auto
                visibleOn: 'data.uploadType !== "asForm"'
              }),

              {
                type: 'container',
                className: 'ae-ExtendMore mb-3',
                visibleOn:
                  'data.uploadType !== "asForm" && data.useChunk === true',
                body: [
                  {
                    type: 'input-group',
                    name: 'chunkSize',
                    label: '分块大小',
                    body: [
                      {
                        type: 'input-number',
                        name: 'chunkSize'
                      },
                      {
                        type: 'tpl',
                        addOnclassName: 'border-0 bg-none',
                        tpl: 'B'
                      }
                    ]
                  },
                  {
                    type: 'Container',
                    visibleOn:
                      'data.uploadType == "fileReceptor" && data.useChunk != false',
                    body: [
                      getSchemaTpl('apiControl', {
                        mode: 'row',
                        name: 'startChunkApi',
                        label: tipedLabel(
                          '分块准备接口',
                          '用来做分块前的准备工作，一个文件只会调用一次。如果出错了，后续的分块上传就会中断。'
                        ),
                        value: '/api/upload/startChunk'
                      }),
                      getSchemaTpl('apiControl', {
                        mode: 'row',
                        name: 'chunkApi',
                        label: tipedLabel(
                          '分块上传接口',
                          '用来接收每个分块上传，大文件会根据 chunkSize 分割成多块，然后每块上传都会调用这个接口。'
                        ),
                        value: '/api/upload/chunk'
                      }),
                      getSchemaTpl('apiControl', {
                        mode: 'row',
                        name: 'finishChunkApi',
                        label: tipedLabel(
                          '上传完成接口',
                          '等所有分块上传完后，将上传文件收集到的 `eTag` 信息合并一起，再次请求后端完成文件上传。'
                        ),
                        value: '/api/upload/finishChunk'
                      })
                    ]
                  }
                ]
              },

              getSchemaTpl('apiControl', {
                name: 'receiver',
                label: tipedLabel(
                  '文件接收器',
                  '默认不填写将上传到 bos，可以在系统配置中设置为自己的 bos 地址。'
                ),
                className: 'inputFile-apiControl',
                renderLabel: true,
                value: '/api/upload/file',
                __isUpload: true,
                visibleOn:
                  'data.uploadType === "fileReceptor" && !data.useChunk'
              }),
              {
                type: 'input-text',
                value: '',
                name: 'accept',
                label: tipedLabel(
                  '文件类型',
                  '请填入文件的后缀，多个类型用<code>,</code>隔开'
                )
              },
              getSchemaTpl('fileUrl', {
                name: 'templateUrl',
                label: tipedLabel(
                  '模板链接',
                  '适用于excel上传等有上传格式要求的场景，为用户提供一个模板下载入口'
                )
              }),
              getSchemaTpl('switch', {
                name: 'drag',
                label: '拖拽上传',
                value: false
              }),
              getSchemaTpl('remark'),
              getSchemaTpl('labelRemark'),
              getSchemaTpl('description'),
              getSchemaTpl('autoFillApi', {
                visibleOn:
                  '!this.autoFill || this.autoFill.scene && this.autoFill.action'
              }),
              getSchemaTpl('autoFill', {
                visibleOn:
                  '!this.autoFill || !this.autoFill.scene && !this.autoFill.action'
              })
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
        body: getSchemaTpl('collapseGroup', [
          getSchemaTpl('style:formItem', {renderer: context.info.renderer}),
          getSchemaTpl('style:classNames', {
            unsupportStatic: true,
            schema: [
              getSchemaTpl('className', {
                name: 'descriptionClassName',
                label: '描述'
              }),
              getSchemaTpl('className', {
                name: 'btnClassName',
                label: '选择按钮'
              }),
              getSchemaTpl('className', {
                name: 'btnUploadClassName',
                label: '上传按钮'
              })
            ]
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

registerEditorPlugin(FileControlPlugin);
