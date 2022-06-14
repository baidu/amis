import { __assign, __extends } from "tslib";
import { registerEditorPlugin } from 'amis-editor-core';
import { BasePlugin } from 'amis-editor-core';
import { defaultValue, getSchemaTpl } from 'amis-editor-core';
import { tipedLabel } from '../../component/BaseControl';
import { ValidatorTag } from '../../validator';
import { getEventControlConfig } from '../../util';
var isText = 'data.type === "input-text"';
var isPassword = 'data.type === "input-password"';
var isEmail = 'data.type === "input-email"';
var isUrl = 'data.type === "input-url"';
function isTextShow(value, name) {
    return ['input-text'].includes(value) ? !!name : false;
}
var TextControlPlugin = /** @class */ (function (_super) {
    __extends(TextControlPlugin, _super);
    function TextControlPlugin() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        // 关联渲染器名字
        _this.rendererName = 'input-text';
        _this.$schema = '/schemas/TextControlSchema.json';
        _this.order = -500;
        // 添加源对应组件中文名称 & type字段
        _this.searchKeywords = '文本框、邮箱框、input-email、URL框、input-url、密码框、input-password';
        // 组件名称
        _this.name = '输入框';
        _this.isBaseComponent = true;
        _this.icon = 'fa fa-terminal';
        _this.description = '文本输入框，支持普通文本、密码、URL、邮箱等多种内容输入';
        _this.docLink = '/amis/zh-CN/components/form/text';
        _this.tags = ['表单项'];
        _this.scaffold = {
            type: 'input-text',
            label: '文本',
            name: 'text'
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
        _this.panelTitle = '文本框';
        _this.events = [
            // {
            //   eventName: 'click',
            //   eventLabel: '点击',
            //   description: '点击事件'
            // },
            {
                eventName: 'change',
                eventLabel: '值变化',
                description: '输入框内容变化',
                dataSchema: [
                    {
                        type: 'object',
                        properties: {
                            'event.data.value': {
                                type: 'string',
                                title: '输入值'
                            }
                        }
                    }
                ]
            },
            {
                eventName: 'focus',
                eventLabel: '获取焦点',
                description: '输入框获取焦点',
                dataSchema: [
                    {
                        type: 'object',
                        properties: {
                            'event.data.value': {
                                type: 'string',
                                title: '输入值'
                            }
                        }
                    }
                ]
            },
            {
                eventName: 'blur',
                eventLabel: '失去焦点',
                description: '输入框失去焦点',
                dataSchema: [
                    {
                        type: 'object',
                        properties: {
                            'event.data.value': {
                                type: 'string',
                                title: '输入值'
                            }
                        }
                    }
                ]
            }
            // 貌似无效，先下掉
            // {
            //   eventName: 'enter',
            //   eventLabel: '回车',
            //   description: '按键回车'
            // }
        ];
        _this.actions = [
            {
                actionType: 'clear',
                actionLabel: '清空',
                description: '清空输入框内容'
            },
            {
                actionType: 'reset',
                actionLabel: '重置',
                description: '将值重置为resetValue，若没有配置resetValue，则清空'
            },
            {
                actionType: 'reload',
                actionLabel: '重新加载',
                description: '触发组件数据刷新并重新渲染'
            },
            {
                actionType: 'setValue',
                actionLabel: '赋值',
                description: '触发组件数据更新'
            }
        ];
        _this.panelJustify = true;
        _this.panelBodyCreator = function (context) {
            var renderer = context.info.renderer;
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
                                getSchemaTpl('inputType', {
                                    value: _this.scaffold.type,
                                    onChange: function (value, oldValue, model, form) {
                                        var _a = form.data, showCounter = _a.showCounter, validations = _a.validations, _b = _a.validationErrors, validationErrors = _b === void 0 ? {} : _b, autoComplete = _a.autoComplete;
                                        var is_old_email = oldValue === 'input-email';
                                        var is_old_url = oldValue === 'input-url';
                                        if (is_old_email) {
                                            validations && delete validations.isEmail;
                                            validationErrors && delete validationErrors.isEmail;
                                        }
                                        if (is_old_url) {
                                            validations && delete validations.isUrl;
                                            validationErrors && delete validationErrors.isUrl;
                                        }
                                        form.setValues({
                                            type: value,
                                            showCounter: ['input-url', 'input-email'].includes(value)
                                                ? undefined
                                                : !!showCounter,
                                            autoComplete: ['input-text'].includes(value)
                                                ? autoComplete
                                                : undefined
                                        });
                                        form.changeValue('validations', __assign({}, validations));
                                        form.changeValue('validationErrors', __assign({}, validationErrors));
                                    }
                                }),
                                // getSchemaTpl('value'),
                                getSchemaTpl('valueFormula', {
                                    rendererSchema: context === null || context === void 0 ? void 0 : context.schema
                                }),
                                getSchemaTpl('clearable'),
                                // getSchemaTpl('multiple',{
                                //   visibleOn: `${isText} || ${isUrl}`
                                // }),
                                getSchemaTpl('showCounter', {
                                    visibleOn: "".concat(isText, " || ").concat(isPassword)
                                }),
                                {
                                    name: 'addOn',
                                    label: tipedLabel('AddOn', '输入框左侧或右侧的附加挂件'),
                                    type: 'ae-Switch-More',
                                    mode: 'normal',
                                    formType: 'extend',
                                    title: 'AddOn',
                                    bulk: false,
                                    defaultData: {
                                        label: '按钮',
                                        type: 'button'
                                    },
                                    form: {
                                        body: [
                                            {
                                                name: 'type',
                                                label: '类型',
                                                type: 'button-group-select',
                                                inputClassName: 'items-center',
                                                pipeIn: defaultValue('button'),
                                                options: [
                                                    {
                                                        label: '文本',
                                                        value: 'text'
                                                    },
                                                    {
                                                        label: '按钮',
                                                        value: 'button'
                                                    },
                                                    {
                                                        label: '提交',
                                                        value: 'submit'
                                                    }
                                                ]
                                            },
                                            getSchemaTpl('horizontal-align', {
                                                name: 'position',
                                                pipeIn: defaultValue('right')
                                            }),
                                            {
                                                name: 'label',
                                                label: '文字',
                                                type: 'input-text'
                                            },
                                            getSchemaTpl('icon')
                                        ]
                                    }
                                },
                                // {
                                //   type: 'ae-Switch-More',
                                //   mode: 'normal',
                                //   label: tipedLabel(
                                //     '自动补全',
                                //     '根据输入内容，调用接口提供选项。当前输入值可用${term}变量'
                                //     ),
                                //   visibleOn: isText,
                                //   formType: 'extend',
                                //   defaultData: {
                                //     autoComplete: {
                                //       method: 'get',
                                //       url: ''
                                //     }
                                //   },
                                //   form: {
                                //     body: [
                                //       getSchemaTpl('apiControl', {
                                //         name: 'autoComplete',
                                //         label: '接口',
                                //         description: '',
                                //         visibleOn: 'data.autoComplete !== false',
                                //         footer: []
                                //       })
                                //     ]
                                //   }
                                // },
                                getSchemaTpl('labelRemark'),
                                getSchemaTpl('remark'),
                                getSchemaTpl('placeholder'),
                                getSchemaTpl('description')
                            ]
                        },
                        getSchemaTpl('status', {
                            isFormItem: true,
                            readonly: true
                        }),
                        getSchemaTpl('validation', {
                            tag: function (data) {
                                switch (data.type) {
                                    case 'input-password':
                                        return ValidatorTag.Password;
                                    case 'input-email':
                                        return ValidatorTag.Email;
                                    case 'input-url':
                                        return ValidatorTag.URL;
                                    default:
                                        return ValidatorTag.Text;
                                }
                            }
                        })
                        // {
                        //   title: '高级',
                        //   body: [
                        //     getSchemaTpl('autoFill')
                        //   ]
                        // }
                    ], __assign(__assign({}, context === null || context === void 0 ? void 0 : context.schema), { configTitle: 'props' }))
                },
                {
                    title: '外观',
                    body: getSchemaTpl('collapseGroup', [
                        getSchemaTpl('style:formItem', { renderer: renderer }),
                        getSchemaTpl('style:classNames', {
                            schema: [
                                getSchemaTpl('className', {
                                    label: '描述',
                                    name: 'descriptionClassName',
                                    visibleOn: 'this.description'
                                }),
                                getSchemaTpl('className', {
                                    name: 'addOn.className',
                                    label: 'AddOn',
                                    visibleOn: 'this.addOn && this.addOn.type === "text"'
                                })
                            ]
                        })
                    ], __assign(__assign({}, context === null || context === void 0 ? void 0 : context.schema), { configTitle: 'style' }))
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
    return TextControlPlugin;
}(BasePlugin));
export { TextControlPlugin };
registerEditorPlugin(TextControlPlugin);
