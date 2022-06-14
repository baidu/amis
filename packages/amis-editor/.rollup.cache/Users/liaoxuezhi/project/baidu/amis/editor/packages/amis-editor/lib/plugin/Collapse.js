import { __assign, __extends } from "tslib";
import { registerEditorPlugin } from 'amis-editor-core';
import { BasePlugin } from 'amis-editor-core';
import { defaultValue, getSchemaTpl } from 'amis-editor-core';
import { tipedLabel } from '../component/BaseControl';
var CollapsePlugin = /** @class */ (function (_super) {
    __extends(CollapsePlugin, _super);
    function CollapsePlugin() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        // 关联渲染器名字
        _this.rendererName = 'collapse';
        _this.$schema = '/schemas/CollapseSchema.json';
        // 组件名称
        _this.name = '折叠器';
        _this.isBaseComponent = true;
        _this.description = '折叠器，可以将内容区展开或隐藏，保持页面的整洁';
        _this.docLink = '/amis/zh-CN/components/collapse';
        _this.tags = ['展示'];
        _this.icon = 'fa fa-window-minimize';
        _this.scaffold = {
            type: 'collapse',
            header: '标题',
            body: [
                {
                    type: 'tpl',
                    tpl: '内容',
                    inline: false
                }
            ]
        };
        _this.previewSchema = __assign({}, _this.scaffold);
        _this.panelTitle = '折叠器';
        _this.panelJustify = true;
        _this.panelBodyCreator = function (context) {
            var _a, _b;
            return getSchemaTpl('tabs', [
                {
                    title: '属性',
                    body: getSchemaTpl('collapseGroup', [
                        {
                            title: '基本',
                            body: [
                                {
                                    name: 'header',
                                    label: '标题',
                                    type: 'input-text',
                                    pipeIn: defaultValue(((_a = context === null || context === void 0 ? void 0 : context.schema) === null || _a === void 0 ? void 0 : _a.title) || ((_b = context === null || context === void 0 ? void 0 : context.schema) === null || _b === void 0 ? void 0 : _b.header) || ''),
                                    onChange: function (value, oldValue, model, form) {
                                        // 转换一下旧版本的title字段
                                        form.setValueByName('header', value);
                                        form.setValueByName('title', undefined);
                                    }
                                },
                                {
                                    name: 'collapseHeader',
                                    label: tipedLabel('展开标题', '折叠器处于展开状态时的标题'),
                                    type: 'input-text'
                                },
                                {
                                    name: 'headerPosition',
                                    label: '标题位置',
                                    type: 'button-group-select',
                                    size: 'sm',
                                    pipeIn: defaultValue('top'),
                                    options: [
                                        {
                                            label: '顶部',
                                            value: 'top',
                                            icon: 'fa fa-arrow-up'
                                        },
                                        {
                                            label: '底部',
                                            value: 'bottom',
                                            icon: 'fa fa-arrow-down'
                                        }
                                    ]
                                },
                                {
                                    name: 'showArrow',
                                    label: '显示图标',
                                    mode: 'row',
                                    inputClassName: 'inline-flex justify-between flex-row-reverse',
                                    type: 'switch',
                                    pipeIn: defaultValue(true)
                                },
                                getSchemaTpl('switch', {
                                    name: 'collapsable',
                                    label: '可折叠',
                                    pipeIn: defaultValue(true)
                                })
                            ]
                        },
                        getSchemaTpl('status', {
                            disabled: true
                        })
                    ])
                },
                {
                    title: '外观',
                    body: getSchemaTpl('collapseGroup', [
                        getSchemaTpl('style:classNames', {
                            isFormItem: false,
                            schema: [
                                getSchemaTpl('className', {
                                    name: 'headingClassName',
                                    label: '标题类名'
                                }),
                                getSchemaTpl('className', {
                                    name: 'bodyClassName',
                                    label: '内容类名'
                                })
                            ]
                        })
                    ])
                }
            ]);
        };
        _this.regions = [
            {
                key: 'body',
                label: '内容区'
            }
        ];
        return _this;
    }
    return CollapsePlugin;
}(BasePlugin));
export { CollapsePlugin };
registerEditorPlugin(CollapsePlugin);
