import { __assign, __extends } from "tslib";
import React from 'react';
import { Button } from 'amis';
import { defaultValue, getSchemaTpl } from 'amis-editor-core';
import { registerEditorPlugin } from 'amis-editor-core';
import { BasePlugin } from 'amis-editor-core';
import { mockValue } from 'amis-editor-core';
var StaticControlPlugin = /** @class */ (function (_super) {
    __extends(StaticControlPlugin, _super);
    function StaticControlPlugin() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        // 关联渲染器名字
        _this.rendererName = 'static';
        _this.$schema = '/schemas/StaticControlSchema.json';
        _this.order = -390;
        // 组件名称
        _this.name = '静态展示框';
        _this.isBaseComponent = true;
        _this.icon = 'fa fa-info';
        _this.description = "\u7EAF\u7528\u6765\u5C55\u793A\u6570\u636E\uFF0C\u53EF\u7528\u6765\u5C55\u793A<code>json\u3001date\u3001image\u3001progress</code>\u7B49\u6570\u636E";
        _this.docLink = '/amis/zh-CN/components/form/static';
        _this.tags = ['表单项'];
        _this.scaffold = {
            type: 'static',
            label: '描述'
        };
        _this.previewSchema = {
            type: 'form',
            className: 'text-left',
            mode: 'horizontal',
            wrapWithPanel: false,
            body: [
                __assign(__assign({}, _this.scaffold), { value: '静态值' })
            ]
        };
        _this.multifactor = true;
        _this.notRenderFormZone = true;
        _this.panelTitle = '静态展示';
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
                                    required: false
                                }),
                                getSchemaTpl('label'),
                                // getSchemaTpl('value'),
                                getSchemaTpl('valueFormula', {
                                    rendererSchema: __assign(__assign({}, context === null || context === void 0 ? void 0 : context.schema), { type: 'textarea' // 改用多行文本编辑
                                     }),
                                    mode: 'vertical',
                                    name: 'tpl'
                                }),
                                getSchemaTpl('switch', {
                                    name: 'quickEdit',
                                    label: '可快速编辑',
                                    pipeIn: function (value) { return !!value; }
                                }),
                                {
                                    label: '快速编辑模式',
                                    name: 'quickEdit.mode',
                                    type: 'button-group-select',
                                    size: 'sm',
                                    mode: 'row',
                                    className: 'ae-buttonGroupSelect--justify',
                                    visibleOn: 'data.quickEdit',
                                    pipeIn: defaultValue('popOver'),
                                    options: [
                                        {
                                            label: '下拉',
                                            value: 'popOver'
                                        },
                                        {
                                            label: '内嵌',
                                            value: 'inline'
                                        }
                                    ]
                                },
                                getSchemaTpl('switch', {
                                    name: 'quickEdit.saveImmediately',
                                    label: '立即保存',
                                    visibleOn: 'data.quickEdit',
                                    description: '开启后修改即提交，而不是标记修改批量提交。',
                                    descriptionClassName: 'help-block m-b-none',
                                    pipeIn: function (value) { return !!value; }
                                }),
                                getSchemaTpl('apiControl', {
                                    name: 'quickEdit.saveImmediately.api',
                                    label: '立即保存接口',
                                    description: '是否单独给立即保存配置接口，如果不配置，则默认使用quickSaveItemApi。',
                                    visibleOn: 'this.quickEdit && this.quickEdit.saveImmediately'
                                }),
                                {
                                    name: 'quickEdit',
                                    asFormItem: true,
                                    visibleOn: 'data.quickEdit',
                                    children: function (_a) {
                                        var value = _a.value, onChange = _a.onChange, data = _a.data;
                                        if (value === true) {
                                            value = {};
                                        }
                                        var originMode = value.mode;
                                        value = __assign({ type: 'input-text', name: data.name }, value);
                                        delete value.mode;
                                        // todo 多个快速编辑表单模式看来只能代码模式编辑了。
                                        return (React.createElement(Button, { className: "m-b ae-Button--enhance", size: "sm", block: true, onClick: function () {
                                                _this.manager.openSubEditor({
                                                    title: '配置快速编辑类型',
                                                    value: value,
                                                    slot: {
                                                        type: 'form',
                                                        mode: 'normal',
                                                        body: ['$$'],
                                                        wrapWithPanel: false
                                                    },
                                                    onChange: function (value) {
                                                        return onChange(__assign(__assign({}, value), { mode: originMode }), 'quickEdit');
                                                    }
                                                });
                                            } }, "\u914D\u7F6E\u5FEB\u901F\u7F16\u8F91"));
                                    }
                                },
                                getSchemaTpl('switch', {
                                    name: 'popOver',
                                    label: '查看更多展示',
                                    pipeIn: function (value) { return !!value; }
                                }),
                                {
                                    label: '弹出模式',
                                    name: 'popOver.mode',
                                    type: 'button-group-select',
                                    size: 'sm',
                                    mode: 'row',
                                    className: 'ae-buttonGroupSelect--justify',
                                    visibleOn: 'data.popOver',
                                    pipeIn: defaultValue('popOver'),
                                    options: [
                                        {
                                            label: '浮层',
                                            value: 'popOver'
                                        },
                                        {
                                            label: '弹框',
                                            value: 'dialog'
                                        },
                                        {
                                            label: '抽屉',
                                            value: 'drawer'
                                        }
                                    ]
                                },
                                {
                                    name: 'popOver.position',
                                    label: '浮层位置',
                                    type: 'select',
                                    mode: 'row',
                                    visibleOn: 'data.popOver && data.popOver.mode === "popOver"',
                                    pipeIn: defaultValue('center'),
                                    options: [
                                        {
                                            label: '目标中部',
                                            value: 'center'
                                        },
                                        {
                                            label: '目标左上角',
                                            value: 'left-top'
                                        },
                                        {
                                            label: '目标右上角',
                                            value: 'right-top'
                                        },
                                        {
                                            label: '目标左下角',
                                            value: 'left-bottom'
                                        },
                                        {
                                            label: '目标右下角',
                                            value: 'right-bottom'
                                        },
                                        {
                                            label: '页面左上角',
                                            value: 'fixed-left-top'
                                        },
                                        {
                                            label: '页面右上角',
                                            value: 'fixed-right-top'
                                        },
                                        {
                                            label: '页面左下角',
                                            value: 'fixed-left-bottom'
                                        },
                                        {
                                            label: '页面右下角',
                                            value: 'fixed-right-bottom'
                                        }
                                    ]
                                },
                                {
                                    visibleOn: 'data.popOver',
                                    name: 'popOver',
                                    asFormItem: true,
                                    children: function (_a) {
                                        var value = _a.value, onChange = _a.onChange;
                                        value = __assign({ type: 'panel', title: '查看详情', body: '内容详情' }, value);
                                        return (React.createElement(Button, { className: "m-b ae-Button--enhance", size: "sm", block: true, onClick: function () {
                                                _this.manager.openSubEditor({
                                                    title: '配置查看更多展示内容',
                                                    value: value,
                                                    onChange: function (value) { return onChange(value, 'quickEdit'); }
                                                });
                                            } }, "\u67E5\u770B\u66F4\u591A\u5185\u5BB9\u914D\u7F6E"));
                                    }
                                },
                                getSchemaTpl('borderMode'),
                                getSchemaTpl('switch', {
                                    name: 'copyable',
                                    label: '可复制',
                                    pipeIn: function (value) { return !!value; }
                                }),
                                {
                                    label: '复制内容模板',
                                    name: 'copyable.content',
                                    type: 'textarea',
                                    mode: 'row',
                                    maxRow: 2,
                                    visibleOn: 'data.copyable',
                                    description: '默认为当前字段值，可定制。'
                                },
                                getSchemaTpl('labelRemark'),
                                getSchemaTpl('remark'),
                                getSchemaTpl('placeholder'),
                                getSchemaTpl('description')
                                /*{
                                    children: (
                                      <Button
                                        size="sm"
                                        level="info"
                                        className="m-b"
                                        block
                                        onClick={this.exchangeRenderer.bind(this, context.id)}
                                      >
                                        更改渲染器类型
                                      </Button>
                                    )
                                },*/
                            ]
                        },
                        getSchemaTpl('status', { isFormItem: true }),
                        getSchemaTpl('validation', { tag: '1' })
                    ])
                },
                {
                    title: '外观',
                    body: getSchemaTpl('collapseGroup', [
                        getSchemaTpl('style:formItem', { renderer: renderer }),
                        {
                            title: 'CSS类名',
                            body: [
                                getSchemaTpl('className', {
                                    label: '整体'
                                }),
                                getSchemaTpl('className', {
                                    label: '标签',
                                    name: 'labelClassName'
                                }),
                                getSchemaTpl('className', {
                                    label: '控件',
                                    name: 'inputClassName'
                                }),
                                getSchemaTpl('className', {
                                    label: '描述',
                                    name: 'descriptionClassName',
                                    visibleOn: 'this.description'
                                })
                            ]
                        }
                    ])
                }
            ]);
        };
        return _this;
        /*exchangeRenderer(id: string) {
          this.manager.showReplacePanel(id, '展示');
        }*/
    }
    StaticControlPlugin.prototype.filterProps = function (props, node) {
        props.$$id = node.id;
        if (typeof props.value === 'undefined') {
            props.value = mockValue(props);
        }
        return props;
    };
    return StaticControlPlugin;
}(BasePlugin));
export { StaticControlPlugin };
registerEditorPlugin(StaticControlPlugin);
