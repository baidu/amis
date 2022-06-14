import { __assign, __extends } from "tslib";
import { getSchemaTpl } from 'amis-editor-core';
import { registerEditorPlugin } from 'amis-editor-core';
import { BasePlugin } from 'amis-editor-core';
import { tipedLabel } from '../../component/BaseControl';
import { ValidatorTag } from '../../validator';
import { getEventControlConfig } from '../../util';
var FileControlPlugin = /** @class */ (function (_super) {
    __extends(FileControlPlugin, _super);
    function FileControlPlugin() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        // 关联渲染器名字
        _this.rendererName = 'input-file';
        _this.$schema = '/schemas/FileControlSchema.json';
        // 组件名称
        _this.name = '文件上传';
        _this.isBaseComponent = true;
        _this.icon = 'fa fa-upload';
        _this.description = "\u53EF\u4E0A\u4F20\u591A\u4E2A\u6587\u4EF6\uFF0C\u53EF\u914D\u7F6E\u662F\u5426\u81EA\u52A8\u4E0A\u4F20\u4EE5\u53CA\u5927\u6587\u4EF6\u5206\u7247\u4E0A\u4F20";
        _this.docLink = '/amis/zh-CN/components/form/input-file';
        _this.tags = ['表单项'];
        _this.scaffold = {
            type: 'input-file',
            label: '文件上传',
            name: 'file'
        };
        _this.previewSchema = {
            type: 'form',
            className: 'text-left',
            wrapWithPanel: false,
            mode: 'horizontal',
            body: [
                __assign({}, _this.scaffold)
            ]
        };
        _this.notRenderFormZone = true;
        // 事件定义
        _this.events = [
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
        _this.actions = [
            {
                actionType: 'clear',
                actionLabel: '清空数据',
                description: '清除选择的文件'
            }
        ];
        _this.panelJustify = true;
        _this.panelBodyCreator = function (context) {
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
                                    name: 'btnLabel',
                                    label: '按钮名称',
                                    value: '文件上传'
                                },
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
                                {
                                    label: '提交方式',
                                    name: 'submitType',
                                    type: 'select',
                                    tiled: true,
                                    value: 'asUpload',
                                    options: [
                                        {
                                            label: '随表单提交',
                                            value: 'asForm'
                                        },
                                        {
                                            label: '独立上传',
                                            value: 'asUpload'
                                        }
                                    ],
                                    pipeIn: function (value, form) { return value || 'asUpload'; },
                                    pipeOut: function (value, form) { return value || 'asUpload'; },
                                    onChange: function (value, oldValue, model, form) {
                                        if (value === 'asUpload') {
                                            form.setValueByName('asBase64', false);
                                            form.setValueByName('asBlob', false);
                                        }
                                        else if (value === 'asForm') {
                                            // 作为表单数据，自动上传开启
                                            form.setValueByName('autoUpload', true);
                                            var formType = form.getValueByName('formType') || 'asBlob';
                                            form.setValueByName(formType, true);
                                        }
                                    }
                                },
                                getSchemaTpl('uploadType', {
                                    visibleOn: 'data.submitType === "asUpload" || !data.submitType',
                                    pipeIn: function (value, form) { return value || 'fileReceptor'; },
                                    pipeOut: function (value, form) { return value || 'fileReceptor'; }
                                }),
                                {
                                    name: 'formType',
                                    type: 'select',
                                    tiled: true,
                                    visibleOn: 'data.submitType === "asForm"',
                                    value: 'asBlob',
                                    label: tipedLabel('数据格式', '${formType ? asBase64 ? "小文件时可以使用，默认给 Form 提交的是文件下载地址，设置后给 Form 提交文件内容的 base64 格式字符串。" : "File 控件不接管文件上传，直接由表单的保存接口完成。和 Base64 选项二选一。" : ""}'),
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
                                    onChange: function (value, oldValue, model, form) {
                                        form.setValueByName('asBase64', 'asBase64' === value);
                                        form.setValueByName('asBlob', 'asBlob' === value);
                                    }
                                },
                                getSchemaTpl('bos', {
                                    visibleOn: '(data.submitType === "asUpload" || !data.submitType) && data.uploadType === "bos"'
                                }),
                                getSchemaTpl('proxy', {
                                    value: false,
                                    visibleOn: 'data.submitType === "asUpload" || !data.submitType'
                                }),
                                getSchemaTpl('switch', {
                                    name: 'autoUpload',
                                    label: '自动上传',
                                    value: true,
                                    visibleOn: 'data.submitType === "asUpload"'
                                }),
                                getSchemaTpl('switch', {
                                    name: 'useChunk',
                                    label: '开启分块',
                                    value: false,
                                    pipeIn: function (value, form) { return !!value; },
                                    visibleOn: 'data.submitType == "asUpload"'
                                }),
                                {
                                    type: 'container',
                                    className: 'ae-ExtendMore mb-3',
                                    visibleOn: 'data.submitType === "asUpload" && data.useChunk != false',
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
                                            visibleOn: 'data.submitType === "asUpload" && data.uploadType == "fileReceptor" && data.useChunk != false',
                                            body: [
                                                getSchemaTpl('apiControl', {
                                                    name: 'startChunkApi',
                                                    label: tipedLabel('分块准备接口', '用来做分块前的准备工作，一个文件只会调用一次。如果出错了，后续的分块上传就会中断。'),
                                                    value: '/api/upload/startChunk'
                                                }),
                                                getSchemaTpl('apiControl', {
                                                    name: 'chunkApi',
                                                    label: tipedLabel('分块上传接口', '用来接收每个分块上传，大文件会根据 chunkSize 分割成多块，然后每块上传都会调用这个接口。'),
                                                    value: '/api/upload/chunk'
                                                }),
                                                getSchemaTpl('apiControl', {
                                                    name: 'finishChunkApi',
                                                    label: tipedLabel('上传完成接口', '等所有分块上传完后，将上传文件收集到的 `eTag` 信息合并一起，再次请求后端完成文件上传。'),
                                                    value: '/api/upload/finishChunk'
                                                })
                                            ]
                                        }
                                    ]
                                },
                                getSchemaTpl('apiControl', {
                                    name: 'receiver',
                                    label: tipedLabel('文件接收器', '默认不填写将上传到 bos，可以在系统配置中设置为自己的 bos 地址。'),
                                    value: '/api/upload/file',
                                    __isUpload: true,
                                    visibleOn: 'data.submitType === "asUpload" && data.uploadType === "fileReceptor" && !data.useChunk'
                                }),
                                getSchemaTpl('fileUrl', {
                                    name: 'templateUrl',
                                    label: tipedLabel('模板链接', '适用于excel上传等有上传格式要求的场景，为用户提供一个模板下载入口')
                                }),
                                getSchemaTpl('switch', {
                                    name: 'drag',
                                    label: '拖拽上传',
                                    value: false
                                }),
                                getSchemaTpl('remark'),
                                getSchemaTpl('labelRemark'),
                                getSchemaTpl('description')
                                // getSchemaTpl('autoFill')
                            ]
                        },
                        getSchemaTpl('status', { isFormItem: true }),
                        getSchemaTpl('validation', { tag: ValidatorTag.File })
                    ])
                },
                {
                    title: '外观',
                    body: getSchemaTpl('collapseGroup', [
                        getSchemaTpl('style:formItem', { renderer: context.info.renderer }),
                        getSchemaTpl('style:classNames', {
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
                        getSchemaTpl('eventControl', __assign({ name: 'onEvent' }, getEventControlConfig(_this.manager, context)))
                    ]
                }
            ]);
        };
        return _this;
    }
    return FileControlPlugin;
}(BasePlugin));
export { FileControlPlugin };
registerEditorPlugin(FileControlPlugin);
