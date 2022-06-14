import { __assign, __extends } from "tslib";
import { Button } from 'amis';
import React from 'react';
import { registerEditorPlugin } from 'amis-editor-core';
import { BasePlugin } from 'amis-editor-core';
import { defaultValue, getSchemaTpl } from 'amis-editor-core';
import { diff } from 'amis-editor-core';
import { BUTTON_DEFAULT_ACTION, tipedLabel } from '../component/BaseControl';
var DropDownButtonPlugin = /** @class */ (function (_super) {
    __extends(DropDownButtonPlugin, _super);
    function DropDownButtonPlugin() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        // 关联渲染器名字
        _this.rendererName = 'dropdown-button';
        _this.$schema = '/schemas/DropdownButtonSchema.json';
        // 组件名称
        _this.name = '下拉按钮';
        _this.isBaseComponent = true;
        _this.description = '下拉按钮，更多的按钮通过点击后展示开来。';
        _this.tags = ['按钮'];
        _this.icon = 'fa fa-chevron-down';
        _this.docLink = '/amis/zh-CN/components/dropdown-button';
        _this.scaffold = {
            type: 'dropdown-button',
            label: '下拉按钮',
            buttons: [
                __assign({ type: 'button', label: '按钮1' }, BUTTON_DEFAULT_ACTION),
                __assign({ type: 'button', label: '按钮2' }, BUTTON_DEFAULT_ACTION)
            ]
        };
        _this.previewSchema = __assign({}, _this.scaffold);
        _this.panelTitle = '下拉按钮';
        _this.panelJustify = true;
        _this.panelBodyCreator = function (context) {
            return getSchemaTpl('tabs', [
                {
                    title: '属性',
                    body: getSchemaTpl('collapseGroup', [
                        {
                            title: '基本',
                            body: [
                                {
                                    children: (React.createElement(Button, { level: "info", size: "sm", className: "m-b-sm", block: true, onClick: _this.editDetail.bind(_this, context.id) }, "\u914D\u7F6E\u4E0B\u62C9\u6309\u94AE\u96C6\u5408"))
                                },
                                {
                                    label: '按钮文案',
                                    type: 'input-text',
                                    name: 'label'
                                },
                                {
                                    type: 'button-group-select',
                                    name: 'trigger',
                                    label: '触发方式',
                                    size: 'sm',
                                    options: [
                                        {
                                            label: '点击',
                                            value: 'click'
                                        },
                                        {
                                            label: '鼠标经过',
                                            value: 'hover'
                                        }
                                    ],
                                    pipeIn: defaultValue('click')
                                },
                                getSchemaTpl('switch', {
                                    name: 'closeOnOutside',
                                    label: '点击外部关闭',
                                    pipeIn: defaultValue(true)
                                }),
                                getSchemaTpl('switch', {
                                    name: 'closeOnClick',
                                    label: '点击内容关闭'
                                }),
                                getSchemaTpl('switch', {
                                    label: tipedLabel('默认展开', '选择后下拉菜单会默认展开'),
                                    name: 'defaultIsOpened'
                                }),
                                {
                                    type: 'button-group-select',
                                    name: 'align',
                                    label: '菜单对齐方式',
                                    size: 'sm',
                                    options: [
                                        {
                                            label: '左对齐',
                                            value: 'left'
                                        },
                                        {
                                            label: '右对齐',
                                            value: 'right'
                                        }
                                    ],
                                    pipeIn: defaultValue('left')
                                }
                            ]
                        },
                        getSchemaTpl('status', {
                            disabled: true
                        })
                    ])
                },
                {
                    title: '外观',
                    body: [
                        getSchemaTpl('collapseGroup', [
                            {
                                title: '基本',
                                body: [
                                    getSchemaTpl('size', {
                                        label: '尺寸',
                                        pipeIn: defaultValue('md')
                                    }),
                                    getSchemaTpl('switch', {
                                        name: 'block',
                                        label: tipedLabel('块状显示', '选择后按钮占满父容器宽度')
                                    }),
                                    getSchemaTpl('buttonLevel', {
                                        label: '展示样式',
                                        name: 'level'
                                    })
                                ]
                            },
                            {
                                title: '图标',
                                body: [
                                    // getSchemaTpl('switch', {
                                    //   label: '只显示 icon',
                                    //   name: 'iconOnly'
                                    // }),
                                    getSchemaTpl('switch', {
                                        label: '隐藏下拉图标',
                                        name: 'hideCaret'
                                    }),
                                    getSchemaTpl('icon', {
                                        label: '左侧图标'
                                    }),
                                    getSchemaTpl('icon', {
                                        name: 'rightIcon',
                                        label: '右侧图标'
                                    })
                                ]
                            },
                            getSchemaTpl('style:classNames', {
                                isFormItem: false,
                                schema: [
                                    getSchemaTpl('className', {
                                        name: 'btnClassName',
                                        label: '按钮'
                                    }),
                                    getSchemaTpl('className', {
                                        name: 'menuClassName',
                                        label: '下拉菜单'
                                    })
                                ]
                            })
                        ])
                    ]
                }
            ]);
        };
        return _this;
    }
    DropDownButtonPlugin.prototype.buildEditorToolbar = function (_a, toolbars) {
        var id = _a.id, info = _a.info;
        if (info.renderer.name === 'dropdown-button') {
            toolbars.push({
                icon: 'fa fa-expand',
                order: 100,
                tooltip: '配置下拉按钮集合',
                onClick: this.editDetail.bind(this, id)
            });
        }
    };
    DropDownButtonPlugin.prototype.editDetail = function (id) {
        var manager = this.manager;
        var store = manager.store;
        var node = store.getNodeById(id);
        var value = store.getValueOf(id);
        node &&
            value &&
            this.manager.openSubEditor({
                title: '配置下拉按钮集合',
                value: value.buttons,
                slot: {
                    type: 'button-group',
                    buttons: '$$',
                    block: true
                },
                onChange: function (newValue) {
                    newValue = __assign(__assign({}, value), { buttons: newValue });
                    manager.panelChangeValue(newValue, diff(value, newValue));
                }
            });
    };
    DropDownButtonPlugin.prototype.buildEditorContextMenu = function (_a, menus) {
        var id = _a.id, schema = _a.schema, region = _a.region, info = _a.info, selections = _a.selections;
        if (selections.length || (info === null || info === void 0 ? void 0 : info.plugin) !== this) {
            return;
        }
        if (info.renderer.name === 'dropdown-button') {
            menus.push('|', {
                label: '配置下拉按钮集合',
                onSelect: this.editDetail.bind(this, id)
            });
        }
    };
    DropDownButtonPlugin.prototype.filterProps = function (props) {
        // trigger 为 hover 会影响编辑体验。
        props.trigger = 'click';
        return props;
    };
    return DropDownButtonPlugin;
}(BasePlugin));
export { DropDownButtonPlugin };
registerEditorPlugin(DropDownButtonPlugin);
