import { __assign, __awaiter, __extends, __generator, __spreadArray } from "tslib";
import { registerEditorPlugin } from 'amis-editor-core';
import { BasePlugin } from 'amis-editor-core';
import { defaultValue, getSchemaTpl } from 'amis-editor-core';
import { jsonToJsonSchema } from 'amis-editor-core';
import { setVariable } from 'amis-core';
import { getEventControlConfig } from '../../util';
// 用于脚手架的常用表单控件
var formItemOptions = [
    {
        name: 'type',
        label: '控件类型',
        type: 'select',
        required: true,
        options: [
            {
                label: '单行文本框',
                value: 'input-text'
            },
            {
                label: '多行文本',
                value: 'textarea'
            },
            {
                label: '分组',
                value: 'group'
            },
            {
                label: '数字输入',
                value: 'input-number'
            },
            {
                label: '单选框',
                value: 'radios'
            },
            {
                label: '勾选框',
                value: 'checkbox'
            },
            {
                label: '复选框',
                value: 'checkboxes'
            },
            {
                label: '下拉框',
                value: 'select'
            },
            {
                label: '开关',
                value: 'switch'
            },
            {
                label: '日期',
                value: 'input-date'
            },
            {
                label: '表格',
                value: 'input-table'
            },
            {
                label: '文件上传',
                value: 'input-file'
            },
            {
                label: '图片上传',
                value: 'input-image'
            },
            {
                label: '富文本编辑器',
                value: 'input-rich-text'
            }
        ]
    },
    {
        name: 'label',
        label: '显示名称',
        type: 'input-text',
        hiddenOn: 'data.type === "group"'
    },
    {
        name: 'name',
        label: '提交字段名',
        required: true,
        type: 'input-text',
        hiddenOn: 'data.type === "group"'
    }
];
var FormPlugin = /** @class */ (function (_super) {
    __extends(FormPlugin, _super);
    function FormPlugin() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        // 关联渲染器名字
        _this.rendererName = 'form';
        _this.$schema = '/schemas/FormSchema.json';
        _this.order = -999;
        // 组件名称
        _this.name = '表单';
        _this.isBaseComponent = true;
        _this.description = '可用于新建、编辑或者展示数据，配置初始化接口可从远端加载数据，配置提交接口可将数据发送远端。另外也可以将数据提交给其他组件，与其他组件通信。';
        _this.docLink = '/amis/zh-CN/components/form/index';
        _this.tags = ['功能'];
        _this.icon = 'fa fa-list-alt';
        _this.scaffold = {
            type: 'form',
            title: '表单',
            body: [
                {
                    label: '文本框',
                    type: 'input-text',
                    name: 'text'
                }
            ]
        };
        _this.previewSchema = {
            type: 'form',
            panelClassName: 'Panel--default text-left m-b-none',
            mode: 'horizontal',
            body: [
                {
                    label: '文本',
                    name: 'a',
                    type: 'input-text'
                }
            ]
        };
        _this.scaffoldForm = {
            title: '快速创建表单',
            body: [
                getSchemaTpl('api', {
                    label: '提交地址'
                }),
                {
                    name: 'mode',
                    label: '文字与输入框展示模式',
                    type: 'button-group-select',
                    pipeIn: defaultValue('normal', false),
                    options: [
                        {
                            label: '上下',
                            value: 'normal'
                        },
                        {
                            label: '左右摆放',
                            value: 'horizontal'
                        },
                        {
                            label: '内联',
                            value: 'inline'
                        }
                    ]
                },
                {
                    label: '表单控件',
                    type: 'combo',
                    name: 'body',
                    multiple: true,
                    draggable: true,
                    multiLine: false,
                    items: __spreadArray(__spreadArray([], formItemOptions, true), [
                        {
                            visibleOn: 'data.type === "group"',
                            type: 'combo',
                            name: 'body',
                            label: '分组内的控件',
                            multiple: true,
                            draggable: true,
                            multiLine: true,
                            items: __spreadArray([], formItemOptions, true)
                        }
                    ], false)
                }
            ]
        };
        // scaffoldForm: ScaffoldForm = {
        //   title: '配置表单信息',
        //   body: [getSchemaTpl('api')],
        //   canRebuild: true
        // };
        // 容器配置
        _this.regions = [
            {
                key: 'body',
                label: '表单集合',
                matchRegion: function (elem) { return !!(elem === null || elem === void 0 ? void 0 : elem.props.noValidate); },
                renderMethod: 'renderBody',
                preferTag: '表单项'
            },
            {
                label: '按钮组',
                key: 'actions',
                preferTag: '按钮'
            }
        ];
        _this.panelTitle = '表单';
        // 事件定义
        _this.events = [
            {
                eventName: 'inited',
                eventLabel: '初始化完成',
                description: '远程初始化接口请求成功时触发',
                // 表单数据为表单变量
                dataSchema: [
                    {
                        type: 'object',
                        properties: {
                            'event.data': {
                                type: 'object',
                                title: 'initApi 远程请求返回的初始化数据'
                            }
                        }
                    }
                ]
            },
            {
                eventName: 'change',
                eventLabel: '数值变化',
                description: '表单值变化时触发',
                dataSchema: [
                    {
                        type: 'object',
                        properties: {
                            'event.data': {
                                type: 'object',
                                title: '当前表单数据'
                            }
                        }
                    }
                ]
            },
            {
                eventName: 'formItemValidateSucc',
                eventLabel: '表单项校验成功',
                description: '表单项校验成功后触发',
                dataSchema: [
                    {
                        type: 'object',
                        properties: {
                            'event.data': {
                                type: 'object',
                                title: '当前表单数据'
                            }
                        }
                    }
                ]
            },
            {
                eventName: 'formItemValidateError',
                eventLabel: '表单项校验失败',
                description: '表单项校验失败后触发',
                dataSchema: [
                    {
                        type: 'object',
                        properties: {
                            'event.data': {
                                type: 'object',
                                title: '当前表单数据'
                            }
                        }
                    }
                ]
            },
            {
                eventName: 'validateSucc',
                eventLabel: '表单校验成功',
                description: '表单校验成功后触发',
                dataSchema: [
                    {
                        type: 'object',
                        properties: {
                            'event.data': {
                                type: 'object',
                                title: '当前表单数据'
                            }
                        }
                    }
                ]
            },
            {
                eventName: 'validateError',
                eventLabel: '表单校验失败',
                description: '表单校验失败后触发',
                dataSchema: [
                    {
                        type: 'object',
                        properties: {
                            'event.data': {
                                type: 'object',
                                title: '当前表单数据'
                            }
                        }
                    }
                ]
            },
            {
                eventName: 'submitSucc',
                eventLabel: '提交成功',
                description: '表单提交请求成功后触发',
                dataSchema: [
                    {
                        type: 'object',
                        properties: {
                            'event.data.result': {
                                type: 'object',
                                title: '提交成功后返回的数据'
                            }
                        }
                    }
                ]
            },
            {
                eventName: 'submitFail',
                eventLabel: '提交失败',
                description: '表单提交请求失败后触发',
                dataSchema: [
                    {
                        type: 'object',
                        properties: {
                            'event.data.error': {
                                type: 'object',
                                title: '提交失败后返回的错误信息'
                            }
                        }
                    }
                ]
            }
        ];
        // 动作定义
        _this.actions = [
            {
                actionLabel: '提交表单',
                actionType: 'submit',
                description: '触发表单提交'
            },
            {
                actionLabel: '重置表单',
                actionType: 'reset',
                description: '触发表单重置'
            },
            {
                actionLabel: '清空表单',
                actionType: 'clear',
                description: '触发表单清空'
            },
            {
                actionLabel: '校验表单',
                actionType: 'validate',
                description: '触发表单校验'
            },
            {
                actionLabel: '重新加载',
                actionType: 'reload',
                description: '触发组件数据刷新并重新渲染'
            },
            {
                actionLabel: '更新数据',
                actionType: 'setValue',
                description: '触发组件数据更新'
            }
        ];
        _this.panelBodyCreator = function (context) {
            var isCRUDFilter = /\/crud\/filter\/form$/.test(context.path);
            var isInDialog = /(?:\/|^)dialog\/.+$/.test(context.path);
            return [
                getSchemaTpl('tabs', [
                    {
                        title: '常规',
                        body: [
                            {
                                name: 'title',
                                type: 'input-text',
                                label: '标题',
                                visibleOn: "this.wrapWithPanel !== false"
                            },
                            {
                                name: 'submitText',
                                type: 'input-text',
                                label: '提交按钮名称',
                                pipeIn: defaultValue('提交'),
                                visibleOn: "this.wrapWithPanel !== false && !this.actions && (!Array.isArray(this.body) || !this.body.some(function(item) {return !!~['submit','button','reset','button-group'].indexOf(item.type);}))",
                                description: '当没有自定义按钮时有效。'
                            },
                            getSchemaTpl('switch', {
                                name: 'autoFocus',
                                label: '自动聚焦',
                                labelRemark: {
                                    className: 'm-l-xs',
                                    trigger: 'click',
                                    rootClose: true,
                                    content: '设置后将让表单的第一个可输入的表单项获得焦点',
                                    placement: 'left'
                                }
                            }),
                            getSchemaTpl('submitOnChange'),
                            getSchemaTpl('switch', {
                                label: '提交完后重置表单',
                                name: 'resetAfterSubmit',
                                labelRemark: {
                                    className: 'm-l-xs',
                                    trigger: 'click',
                                    rootClose: true,
                                    content: '即表单提交完后，让所有表单项的值还原成初始值',
                                    placement: 'left'
                                }
                            }),
                            isCRUDFilter
                                ? null
                                : getSchemaTpl('switch', {
                                    label: '初始化后提交一次',
                                    name: 'submitOnInit',
                                    labelRemark: {
                                        className: 'm-l-xs',
                                        trigger: 'click',
                                        rootClose: true,
                                        content: '开启后，表单初始完成便会触发一次提交。',
                                        placement: 'left'
                                    }
                                }),
                            isInDialog
                                ? getSchemaTpl('switch', {
                                    label: '提交后是否关闭对话框',
                                    name: 'closeDialogOnSubmit',
                                    pipeIn: function (value) { return value !== false; }
                                })
                                : null,
                            isCRUDFilter
                                ? null
                                : {
                                    label: '提交给其他组件',
                                    name: 'target',
                                    type: 'input-text',
                                    description: '可以通过设置此属性，把当前表单的值提交给目标组件，而不是自己来通过接口保存，请填写目标组件的 <code>name</code> 属性，多个组件请用逗号隔开。当 <code>target</code> 为 <code>window</code> 时，则把表单数据附属到地址栏。'
                                },
                            getSchemaTpl('reload', {
                                test: !isCRUDFilter
                            }),
                            isCRUDFilter
                                ? null
                                : {
                                    label: '跳转',
                                    name: 'redirect',
                                    type: 'input-text',
                                    description: '当设置此值后，表单提交完后跳转到目标地址。'
                                },
                            getSchemaTpl('switch', {
                                name: 'canAccessSuperData',
                                label: '是否自动填充父级同名变量',
                                pipeIn: defaultValue(true)
                            }),
                            getSchemaTpl('switch', {
                                name: 'persistData',
                                label: '是否开启本地缓存',
                                pipeIn: defaultValue(false),
                                labelRemark: {
                                    className: 'm-l-xs',
                                    trigger: 'click',
                                    rootClose: true,
                                    content: '开启后，表单的数据会缓存在浏览器中，切换页面或关闭弹框不会清空当前表单内的数据',
                                    placement: 'left'
                                }
                            }),
                            getSchemaTpl('switch', {
                                name: 'clearPersistDataAfterSubmit',
                                label: '提交成功后清空本地缓存',
                                pipeIn: defaultValue(false),
                                visibleOn: 'data.persistData',
                                labelRemark: {
                                    className: 'm-l-xs',
                                    trigger: 'click',
                                    rootClose: true,
                                    content: '开启本地缓存并开启本配置项后，表单提交成功后，会自动清除浏览器中当前表单的缓存数据',
                                    placement: 'left'
                                }
                            }),
                            {
                                name: 'rules',
                                label: '表单组合校验',
                                type: 'combo',
                                multiple: true,
                                multiLine: true,
                                items: [
                                    {
                                        name: 'rule',
                                        label: '校验规则',
                                        type: 'input-text'
                                    },
                                    {
                                        name: 'message',
                                        label: '报错提示',
                                        type: 'input-text'
                                    }
                                ]
                            }
                        ]
                    },
                    isCRUDFilter
                        ? null
                        : {
                            title: '接口',
                            body: [
                                getSchemaTpl('api', {
                                    label: '保存接口',
                                    description: '用来保存表单数据',
                                    sampleBuilder: function (schema) { return "{\n    \"status\": 0,\n    \"msg\": \"\",\n\n    // \u53EF\u4EE5\u4E0D\u8FD4\u56DE\uFF0C\u5982\u679C\u8FD4\u56DE\u4E86\u6570\u636E\u5C06\u88AB merge \u8FDB\u6765\u3002\n    data: {}\n  }"; }
                                    // test: !this.isCRUDFilter
                                }),
                                getSchemaTpl('switch', {
                                    name: 'asyncApi',
                                    label: '采用异步方式?',
                                    visibleOn: 'data.api',
                                    labelRemark: {
                                        trigger: 'click',
                                        rootClose: true,
                                        title: '什么是异步方式？',
                                        content: '异步方式主要用来解决请求超时问题，启用异步方式后，程序会在请求完后，定时轮询请求额外的接口用来咨询操作是否完成。所以接口可以快速的返回，而不需要等待流程真正完成。',
                                        placement: 'left'
                                    },
                                    pipeIn: function (value) { return value != null; },
                                    pipeOut: function (value) { return (value ? '' : undefined); }
                                }),
                                getSchemaTpl('api', {
                                    name: 'asyncApi',
                                    label: '异步检测接口',
                                    visibleOn: 'data.asyncApi != null',
                                    description: '设置此属性后，表单提交发送保存接口后，还会继续轮训请求该接口，直到返回 finished 属性为 true 才 结束'
                                }),
                                {
                                    type: 'divider'
                                },
                                getSchemaTpl('api', {
                                    name: 'initApi',
                                    label: '初始化接口',
                                    description: '用来初始化表单数据',
                                    sampleBuilder: function (schema) {
                                        var data = {};
                                        if (Array.isArray(schema.body)) {
                                            schema.body.forEach(function (control) {
                                                if (control.name &&
                                                    !~['combo', 'input-array', 'form'].indexOf(control.type)) {
                                                    setVariable(data, control.name, 'sample');
                                                }
                                            });
                                        }
                                        return JSON.stringify({
                                            status: 0,
                                            msg: '',
                                            data: data
                                        }, null, 2);
                                    }
                                }),
                                getSchemaTpl('switch', {
                                    label: '开启定时刷新',
                                    name: 'interval',
                                    visibleOn: 'data.initApi',
                                    pipeIn: function (value) { return !!value; },
                                    pipeOut: function (value) { return (value ? 3000 : undefined); }
                                }),
                                {
                                    name: 'interval',
                                    type: 'input-number',
                                    visibleOn: 'data.interval',
                                    step: 500,
                                    className: 'm-t-n-sm',
                                    description: '设置后将自动定时刷新，单位 ms'
                                },
                                getSchemaTpl('switch', {
                                    name: 'silentPolling',
                                    label: '静默刷新',
                                    visibleOn: '!!data.interval',
                                    description: '设置自动定时刷新时是否显示loading'
                                }),
                                {
                                    name: 'stopAutoRefreshWhen',
                                    label: '停止定时刷新检测表达式',
                                    type: 'input-text',
                                    visibleOn: '!!data.interval',
                                    description: '定时刷新一旦设置会一直刷新，除非给出表达式，条件满足后则不刷新了。'
                                },
                                getSchemaTpl('switch', {
                                    label: '采用异步方式？',
                                    name: 'initAsyncApi',
                                    visibleOn: 'data.initApi',
                                    remark: {
                                        trigger: 'click',
                                        rootClose: true,
                                        title: '什么是异步方式？',
                                        content: '异步方式主要用来解决请求超时问题，启用异步方式后，程序会在请求完后，定时轮询请求额外的接口用来咨询操作是否完成。所以接口可以快速的返回，而不需要等待流程真正完成。',
                                        placement: 'left'
                                    },
                                    pipeIn: function (value) { return value != null; },
                                    pipeOut: function (value) { return (value ? '' : undefined); }
                                }),
                                getSchemaTpl('api', {
                                    name: 'initAsyncApi',
                                    label: '异步检测接口',
                                    visibleOn: 'data.initAsyncApi != null',
                                    description: '设置此属性后，表单请求 initApi 后，还会继续轮训请求该接口，直到返回 finished 属性为 true 才 结束'
                                }),
                                {
                                    type: 'divider'
                                },
                                isCRUDFilter
                                    ? {
                                        name: 'messages',
                                        pipeIn: defaultValue({
                                            fetchFailed: '初始化失败'
                                        }),
                                        label: '默认消息信息',
                                        type: 'combo',
                                        multiLine: true,
                                        description: '可以不设置，接口返回的 msg 字段，优先级更高',
                                        items: [
                                            {
                                                label: '获取成功提示',
                                                name: 'fetchSuccess',
                                                type: 'input-text'
                                            },
                                            {
                                                label: '获取失败提示',
                                                name: 'fetchFailed',
                                                type: 'input-text'
                                            }
                                        ]
                                    }
                                    : {
                                        name: 'messages',
                                        pipeIn: defaultValue({
                                            fetchFailed: '初始化失败',
                                            saveSuccess: '保存成功',
                                            saveFailed: '保存失败'
                                        }),
                                        label: '默认消息提示',
                                        type: 'combo',
                                        multiLine: true,
                                        description: '可以不设置，接口返回的 msg 字段，优先级更高',
                                        items: [
                                            {
                                                label: '获取成功提示',
                                                name: 'fetchSuccess',
                                                type: 'input-text'
                                            },
                                            {
                                                label: '获取失败提示',
                                                name: 'fetchFailed',
                                                type: 'input-text'
                                            },
                                            {
                                                label: '保存成功提示',
                                                name: 'saveSuccess',
                                                type: 'input-text'
                                            },
                                            {
                                                label: '保存失败提示',
                                                name: 'saveFailed',
                                                type: 'input-text'
                                            },
                                            {
                                                label: '验证失败提示',
                                                name: 'validateFailed',
                                                type: 'input-text'
                                            }
                                        ]
                                    }
                            ]
                        },
                    {
                        title: '外观',
                        body: [
                            getSchemaTpl('switch', {
                                name: 'wrapWithPanel',
                                label: '用 Panel 包裹',
                                pipeIn: defaultValue(true),
                                labelRemark: {
                                    className: 'm-l-xs',
                                    trigger: 'click',
                                    rootClose: true,
                                    content: '关闭后，表单只会展示表单项，标题和操作栏将不会显示。',
                                    placement: 'left'
                                }
                            }),
                            {
                                name: 'mode',
                                label: '展示模式',
                                type: 'button-group-select',
                                size: 'sm',
                                // mode: 'inline',
                                // className: 'block',
                                pipeIn: defaultValue('normal', false),
                                options: [
                                    {
                                        label: '默认',
                                        value: 'normal'
                                    },
                                    {
                                        label: '左右摆放',
                                        value: 'horizontal'
                                    },
                                    {
                                        label: '内联',
                                        value: 'inline'
                                    }
                                ]
                            },
                            getSchemaTpl('horizontal', {
                                visibleOn: 'this.mode == "horizontal"'
                            }),
                            getSchemaTpl('className'),
                            getSchemaTpl('className', {
                                name: 'panelClassName',
                                visibleOn: 'this.wrapWithPanel !== false',
                                label: 'Panel 的 CSS 类名',
                                description: '可以设置 Panel--info 之类的'
                            })
                        ]
                    },
                    {
                        title: '事件',
                        className: 'p-none',
                        body: [
                            getSchemaTpl('eventControl', __assign({ name: 'onEvent' }, getEventControlConfig(_this.manager, context)))
                        ]
                    },
                    {
                        title: '其他',
                        body: [
                            getSchemaTpl('ref'),
                            getSchemaTpl('name', {
                                test: !isCRUDFilter
                            }),
                            getSchemaTpl('switch', {
                                name: 'debug',
                                label: '开启调试',
                                labelRemark: '显示当前表单的数据在表单顶部'
                            }),
                            getSchemaTpl('disabled'),
                            getSchemaTpl('visible')
                        ]
                    }
                ])
            ];
        };
        return _this;
    }
    FormPlugin.prototype.afterUpdate = function (event) {
        var _a;
        var context = event.context;
        if (context.info.renderer.name === 'form' &&
            ((_a = context.diff) === null || _a === void 0 ? void 0 : _a.some(function (change) { var _a; return ((_a = change.path) === null || _a === void 0 ? void 0 : _a.join('.')) === 'wrapWithPanel'; }))) {
            this.manager.buildPanels();
        }
    };
    FormPlugin.prototype.buildDataSchemas = function (node, region) {
        var _a, _b, _c, _d, _e, _f;
        return __awaiter(this, void 0, void 0, function () {
            var jsonschema, pool, current, schema, _g, _h, _j, schema, _k, _l, _m;
            var _o;
            return __generator(this, function (_p) {
                switch (_p.label) {
                    case 0:
                        jsonschema = {
                            $id: 'formItems',
                            type: 'object',
                            properties: {}
                        };
                        pool = node.children.concat();
                        _p.label = 1;
                    case 1:
                        if (!pool.length) return [3 /*break*/, 13];
                        current = pool.shift();
                        if (!(((_a = current.rendererConfig) === null || _a === void 0 ? void 0 : _a.type) === 'combo')) return [3 /*break*/, 6];
                        schema = current.schema;
                        if (!schema.name) return [3 /*break*/, 5];
                        _g = jsonschema.properties;
                        _h = schema.name;
                        _o = {
                            type: 'array',
                            title: schema.label || schema.name
                        };
                        if (!((_c = (_b = current.info) === null || _b === void 0 ? void 0 : _b.plugin) === null || _c === void 0 ? void 0 : _c.buildDataSchemas)) return [3 /*break*/, 3];
                        return [4 /*yield*/, current.info.plugin.buildDataSchemas(current, region)];
                    case 2:
                        _j = _p.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        _j = {
                            type: 'object',
                            properties: {}
                        };
                        _p.label = 4;
                    case 4:
                        _g[_h] = (_o.items = _j,
                            _o);
                        _p.label = 5;
                    case 5: return [3 /*break*/, 12];
                    case 6:
                        if (!((_d = current.rendererConfig) === null || _d === void 0 ? void 0 : _d.isFormItem)) return [3 /*break*/, 11];
                        schema = current.schema;
                        if (!schema.name) return [3 /*break*/, 10];
                        _k = jsonschema.properties;
                        _l = schema.name;
                        if (!((_f = (_e = current.info) === null || _e === void 0 ? void 0 : _e.plugin) === null || _f === void 0 ? void 0 : _f.buildDataSchemas)) return [3 /*break*/, 8];
                        return [4 /*yield*/, current.info.plugin.buildDataSchemas(current, region)];
                    case 7:
                        _m = _p.sent();
                        return [3 /*break*/, 9];
                    case 8:
                        _m = {
                            type: 'string',
                            title: schema.label || schema.name,
                            originalValue: schema.value,
                            description: schema.description
                        };
                        _p.label = 9;
                    case 9:
                        _k[_l] = _m;
                        _p.label = 10;
                    case 10: return [3 /*break*/, 12];
                    case 11:
                        pool.push.apply(pool, current.children);
                        _p.label = 12;
                    case 12: return [3 /*break*/, 1];
                    case 13: return [2 /*return*/, jsonschema];
                }
            });
        });
    };
    FormPlugin.prototype.rendererBeforeDispatchEvent = function (node, e, data) {
        if (e === 'inited') {
            // 监听 form 的 inited 事件，把数据加入到上下文中
            var scope = this.manager.dataSchema.getScope("".concat(node.id, "-").concat(node.type));
            var jsonschema = __assign({ $id: 'formInitedData' }, jsonToJsonSchema(data));
            scope.removeSchema(jsonschema.$id);
            scope.addSchema(jsonschema);
        }
    };
    return FormPlugin;
}(BasePlugin));
export { FormPlugin };
registerEditorPlugin(FormPlugin);
