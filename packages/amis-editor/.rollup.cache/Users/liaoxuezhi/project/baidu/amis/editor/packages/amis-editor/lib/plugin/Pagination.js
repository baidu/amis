import { __assign, __extends, __spreadArray } from "tslib";
import { registerEditorPlugin } from 'amis-editor-core';
import { BasePlugin } from 'amis-editor-core';
import { tipedLabel } from '../component/BaseControl';
import { getEventControlConfig } from '../util';
import { defaultValue, getSchemaTpl } from 'amis-editor-core';
var PaginationPlugin = /** @class */ (function (_super) {
    __extends(PaginationPlugin, _super);
    function PaginationPlugin() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        // 关联渲染器名字
        _this.rendererName = 'pagination';
        _this.$schema = '/schemas/PaginationSchema.json';
        // 组件名称
        _this.name = '分页组件';
        _this.isBaseComponent = false;
        _this.description = '分页组件，可以对列表进行分页展示，提高页面性能';
        _this.tags = ['容器'];
        _this.icon = 'fa fa-window-minimize';
        _this.baseLayoutLIst = [
            { text: '总数', value: 'total', checked: false },
            { text: '每页条数', value: 'perPage', checked: false },
            { text: '分页', value: 'pager', checked: true },
            { text: '跳转', value: 'go', checked: false }
        ];
        _this.scaffold = {
            type: 'pagination',
            mode: 'normal',
            layout: ['pager'],
            activePage: 1,
            lastPage: 1,
            total: 1,
            hasNext: false,
            disabled: false,
            showPerPage: false,
            perPageAvailable: [10, 20, 50, 100],
            perPage: 10,
            maxButton: 7,
            showPageInput: false
        };
        _this.previewSchema = __assign({}, _this.scaffold);
        _this.panelTitle = '分页器';
        // 事件定义
        _this.events = [
            {
                eventName: 'pageChange',
                eventLabel: '分页改变',
                description: '分页改变'
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
                                {
                                    name: 'mode',
                                    label: '分页类型',
                                    type: 'button-group-select',
                                    size: 'sm',
                                    pipeIn: defaultValue('normal'),
                                    options: [
                                        {
                                            label: 'normal',
                                            value: 'normal'
                                        },
                                        {
                                            label: 'simple',
                                            value: 'simple'
                                        }
                                    ]
                                },
                                {
                                    name: 'hasNext',
                                    label: '是否有下一页',
                                    mode: 'row',
                                    inputClassName: 'inline-flex justify-between flex-row-reverse',
                                    type: 'switch',
                                    visibleOn: 'data.mode === "simple"'
                                },
                                {
                                    name: 'activePage',
                                    label: tipedLabel('当前页', '支持使用 \\${xxx} 来获取变量'),
                                    type: 'input-text'
                                },
                                {
                                    name: 'lastPage',
                                    label: tipedLabel('最后页码', '支持使用 \\${xxx} 来获取变量'),
                                    type: 'input-text',
                                    visibleOn: 'data.mode === "normal"'
                                },
                                {
                                    name: 'total',
                                    label: tipedLabel('总条数', '支持使用 \\${xxx} 来获取变量'),
                                    type: 'input-text',
                                    visibleOn: 'data.mode === "normal"'
                                },
                                getSchemaTpl('combo-container', {
                                    name: 'layout',
                                    type: 'combo',
                                    label: tipedLabel('分页布局', '选中表示渲染该项，可以拖拽排序调整显示的顺序'),
                                    visibleOn: 'data.mode === "normal"',
                                    mode: 'normal',
                                    multiple: true,
                                    multiLine: false,
                                    addable: false,
                                    removable: false,
                                    draggable: true,
                                    editable: false,
                                    minLength: 1,
                                    tabsStyle: 'inline',
                                    formClassName: 'ae-pagination-layout-item',
                                    items: [
                                        {
                                            type: 'checkbox',
                                            name: 'checked',
                                            className: 'm-t-n-xxs'
                                        },
                                        {
                                            type: 'tpl',
                                            name: 'text',
                                            className: 'p-t-xs'
                                        }
                                    ],
                                    pipeIn: function (value) {
                                        var layoutList = [];
                                        if (Array.isArray(value)) {
                                            layoutList = value;
                                        }
                                        else if (typeof value === 'string') {
                                            layoutList = value.split(',');
                                        }
                                        var layout = _this.baseLayoutLIst.map(function (v) { return (__assign(__assign({}, v), { checked: layoutList.includes(v.value) })); });
                                        return layout;
                                    },
                                    pipeOut: function (value) {
                                        _this.baseLayoutLIst = __spreadArray([], value, true);
                                        return value.filter(function (v) { return v.checked; }).map(function (v) { return v.value; });
                                    }
                                }),
                                {
                                    name: 'showPerPage',
                                    label: '显示每页条数',
                                    mode: 'row',
                                    inputClassName: 'inline-flex justify-between flex-row-reverse',
                                    type: 'switch',
                                    visibleOn: 'data.mode === "normal"'
                                },
                                getSchemaTpl('combo-container', {
                                    name: 'perPageAvailable',
                                    type: 'combo',
                                    label: '每页条数选项',
                                    visibleOn: 'data.mode === "normal"',
                                    mode: 'normal',
                                    multiple: true,
                                    multiLine: false,
                                    addable: true,
                                    removable: true,
                                    draggable: true,
                                    editable: true,
                                    minLength: 1,
                                    tabsStyle: 'inline',
                                    addButtonClassName: 'm-b-sm',
                                    items: [
                                        {
                                            type: 'input-number',
                                            name: 'value',
                                            min: 1
                                        }
                                    ],
                                    pipeIn: function (value) {
                                        return value.map(function (v) { return ({ value: v }); });
                                    },
                                    pipeOut: function (value) {
                                        return value.map(function (v) { return v.value; });
                                    }
                                }),
                                {
                                    name: 'perPage',
                                    type: 'input-text',
                                    label: '默认每页条数',
                                    visibleOn: 'data.mode === "normal"'
                                },
                                {
                                    name: 'maxButton',
                                    label: '最多按钮数',
                                    type: 'input-number',
                                    min: 5,
                                    max: 20,
                                    visibleOn: 'data.mode === "normal"'
                                },
                                {
                                    name: 'showPageInput',
                                    label: '显示页面跳转',
                                    mode: 'row',
                                    inputClassName: 'inline-flex justify-between flex-row-reverse',
                                    type: 'switch',
                                    visibleOn: 'data.mode === "normal"'
                                }
                            ]
                        },
                        {
                            title: '状态',
                            body: [getSchemaTpl('disabled')]
                        }
                    ])
                },
                {
                    title: '外观',
                    body: getSchemaTpl('collapseGroup', [
                        getSchemaTpl('style:classNames', { isFormItem: false })
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
        _this.regions = [
            {
                key: 'body',
                label: '内容区'
            }
        ];
        return _this;
    }
    return PaginationPlugin;
}(BasePlugin));
export { PaginationPlugin };
registerEditorPlugin(PaginationPlugin);
