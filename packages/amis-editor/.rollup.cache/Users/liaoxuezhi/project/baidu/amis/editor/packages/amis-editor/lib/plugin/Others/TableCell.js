import { __assign, __extends } from "tslib";
import { Button } from 'amis';
import React from 'react';
import { registerEditorPlugin } from 'amis-editor-core';
import { BasePlugin } from 'amis-editor-core';
import { defaultValue, getSchemaTpl } from 'amis-editor-core';
import { getVariable } from 'amis-core';
var TableCellPlugin = /** @class */ (function (_super) {
    __extends(TableCellPlugin, _super);
    function TableCellPlugin() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.panelTitle = '列配置';
        _this.panelIcon = 'fa fa-columns';
        _this.panelBodyCreator = function (context) {
            return [
                getSchemaTpl('tabs', [
                    {
                        title: '常规',
                        body: [
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
                            {
                                name: 'label',
                                label: '列名称',
                                type: 'input-text'
                            },
                            {
                                name: 'name',
                                type: 'input-text',
                                label: '绑定字段名'
                            },
                            {
                                name: 'remark',
                                label: '提示',
                                type: 'input-text',
                                description: '显示一个提示图标，鼠标放上去会提示该内容。'
                            },
                            {
                                name: 'placeholder',
                                type: 'input-text',
                                label: '占位符',
                                value: '-',
                                description: '当没有值时用这个来替代展示'
                            },
                            getSchemaTpl('switch', {
                                name: 'sortable',
                                label: '是否可排序',
                                description: '开启后可以根据当前列排序(后端排序)。'
                            })
                        ]
                    },
                    {
                        title: '高级',
                        body: [
                            {
                                name: 'groupName',
                                label: '列分组名称',
                                type: 'input-text',
                                description: '当多列的分组名称设置一致时，表格会在显示表头的上层显示超级表头，<a href="https://baidu.github.io/amis/crud/header-group" target="_blank">示例</a>'
                            },
                            getSchemaTpl('switch', {
                                name: 'quickEdit',
                                label: '启用快速编辑',
                                pipeIn: function (value) { return !!value; }
                            }),
                            {
                                visibleOn: 'data.quickEdit',
                                name: 'quickEdit.mode',
                                type: 'button-group-select',
                                value: 'popOver',
                                label: '快速编辑模式',
                                size: 'xs',
                                mode: 'inline',
                                className: 'w-full',
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
                                label: '是否立即保存',
                                visibleOn: 'data.quickEdit',
                                description: '开启后修改即提交，而不是标记修改批量提交。',
                                descriptionClassName: 'help-block m-b-none',
                                pipeIn: function (value) { return !!value; }
                            }),
                            getSchemaTpl('api', {
                                label: '立即保存接口',
                                description: '是否单独给立即保存配置接口，如果不配置，则默认使用quickSaveItemApi。',
                                name: 'quickEdit.saveImmediately.api',
                                visibleOn: 'this.quickEdit && this.quickEdit.saveImmediately'
                            }),
                            {
                                visibleOn: 'data.quickEdit',
                                name: 'quickEdit',
                                asFormItem: true,
                                children: function (_a) {
                                    var value = _a.value, onChange = _a.onChange, data = _a.data;
                                    if (value === true) {
                                        value = {};
                                    }
                                    else if (typeof value === 'undefined') {
                                        value = getVariable(data, 'quickEdit');
                                    }
                                    var originMode = value.mode;
                                    value = __assign({ type: 'input-text', name: data.name }, value);
                                    delete value.mode;
                                    // todo 多个快速编辑表单模式看来只能代码模式编辑了。
                                    return (React.createElement(Button, { level: "info", className: "m-b", size: "sm", block: true, onClick: function () {
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
                                label: '启用查看更多展示',
                                pipeIn: function (value) { return !!value; }
                            }),
                            {
                                name: 'popOver.mode',
                                label: '查看更多弹出模式',
                                type: 'select',
                                visibleOn: 'data.popOver',
                                pipeIn: defaultValue('popOver'),
                                options: [
                                    {
                                        label: '默认',
                                        value: 'popOver'
                                    },
                                    {
                                        label: '弹框',
                                        value: 'dialog'
                                    },
                                    {
                                        label: '抽出式弹框',
                                        value: 'drawer'
                                    }
                                ]
                            },
                            {
                                name: 'popOver.position',
                                label: '查看更多弹出模式',
                                type: 'select',
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
                                    return (React.createElement(Button, { level: "info", className: "m-b", size: "sm", block: true, onClick: function () {
                                            _this.manager.openSubEditor({
                                                title: '配置查看更多展示内容',
                                                value: value,
                                                onChange: function (value) { return onChange(value, 'popOver'); }
                                            });
                                        } }, "\u67E5\u770B\u66F4\u591A\u5185\u5BB9\u914D\u7F6E"));
                                }
                            },
                            getSchemaTpl('switch', {
                                name: 'copyable',
                                label: '启用内容复制功能',
                                pipeIn: function (value) { return !!value; }
                            }),
                            {
                                visibleOn: 'data.copyable',
                                name: 'copyable.content',
                                type: 'textarea',
                                label: '复制内容模板',
                                description: '默认为当前字段值，可定制。'
                            }
                        ]
                    },
                    {
                        title: '外观',
                        body: [
                            {
                                name: 'fixed',
                                type: 'button-group-select',
                                label: '固定位置',
                                pipeIn: defaultValue(''),
                                size: 'xs',
                                mode: 'inline',
                                className: 'w-full',
                                options: [
                                    {
                                        value: '',
                                        label: '不固定'
                                    },
                                    {
                                        value: 'left',
                                        label: '左侧'
                                    },
                                    {
                                        value: 'right',
                                        label: '右侧'
                                    }
                                ]
                            },
                            getSchemaTpl('switch', {
                                name: 'toggled',
                                label: '默认展示',
                                pipeIn: defaultValue(true)
                            }),
                            {
                                name: 'breakpoint',
                                type: 'button-group-select',
                                label: '触发底部显示条件',
                                visibleOn: 'data.tableFootableEnabled',
                                size: 'xs',
                                multiple: true,
                                options: [
                                    {
                                        label: '总是',
                                        value: '*'
                                    },
                                    {
                                        label: '手机端',
                                        value: 'xs'
                                    },
                                    {
                                        label: '平板',
                                        value: 'sm'
                                    },
                                    {
                                        label: 'PC小屏',
                                        value: 'md'
                                    },
                                    {
                                        label: 'PC大屏',
                                        value: 'lg'
                                    }
                                ],
                                pipeIn: function (value) {
                                    return value ? (typeof value === 'string' ? value : '*') : '';
                                },
                                pipeOut: function (value) {
                                    return typeof value === 'string' &&
                                        ~value.indexOf('*') &&
                                        /xs|sm|md|lg/.test(value)
                                        ? value.replace(/\*\s*,\s*|\s*,\s*\*/g, '')
                                        : value;
                                }
                            },
                            getSchemaTpl('switch', {
                                name: 'className',
                                label: '内容强制换行',
                                pipeIn: function (value) {
                                    return typeof value === 'string' && /\word\-break\b/.test(value);
                                },
                                pipeOut: function (value, originValue) {
                                    return (value ? 'word-break ' : '') +
                                        (originValue || '').replace(/\bword\-break\b/g, '').trim();
                                }
                            }),
                            getSchemaTpl('className'),
                            getSchemaTpl('className', {
                                name: 'innerClassName',
                                label: '内部 CSS 类名'
                            }),
                            {
                                name: 'width',
                                type: 'input-number',
                                label: '列宽',
                                description: '固定列的宽度，不推荐设置。'
                            }
                        ]
                    }
                ])
            ];
        };
        return _this;
    }
    // filterProps(props: any) {
    //   props = JSONPipeOut(props, true);
    //   return props;
    // }
    TableCellPlugin.prototype.getRendererInfo = function (_a) {
        var renderer = _a.renderer, schema = _a.schema;
        if (renderer.name === 'table-cell') {
            return {
                name: schema.label ? "<".concat(schema.label, ">\u5217") : '匿名列',
                $schema: '/schemas/TableColumn.json',
                multifactor: true,
                wrapperResolve: function (dom) {
                    var siblings = [].slice.call(dom.parentElement.children);
                    var index = siblings.indexOf(dom) + 1;
                    var table = dom.closest('table');
                    return [].slice.call(table.querySelectorAll("th:nth-child(".concat(index, "):not([data-editor-id=\"").concat(schema.id, "\"]),\n              td:nth-child(").concat(index, "):not([data-editor-id=\"").concat(schema.id, "\"])")));
                }
                // filterProps: this.filterProps
            };
        }
    };
    /*exchangeRenderer(id: string) {
      this.manager.showReplacePanel(id, '展示');
    }*/
    TableCellPlugin.prototype.beforeReplace = function (event) {
        var context = event.context;
        // 替换字段的时候保留 label 和 name 值。
        if (context.info.plugin === this && context.data) {
            context.data.label = context.data.label || context.schema.label;
            context.data.name = context.data.name || context.schema.name;
        }
    };
    return TableCellPlugin;
}(BasePlugin));
export { TableCellPlugin };
registerEditorPlugin(TableCellPlugin);
