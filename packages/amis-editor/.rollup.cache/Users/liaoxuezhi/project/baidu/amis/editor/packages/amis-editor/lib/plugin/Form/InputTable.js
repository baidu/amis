import { __assign, __extends } from "tslib";
import { resolveVariable } from 'amis';
import flatten from 'lodash/flatten';
import { defaultValue, getSchemaTpl } from 'amis-editor-core';
import { registerEditorPlugin } from 'amis-editor-core';
import { BasePlugin } from 'amis-editor-core';
import { setVariable } from 'amis-core';
import { repeatArray } from 'amis-editor-core';
import { mockValue } from 'amis-editor-core';
var TableControlPlugin = /** @class */ (function (_super) {
    __extends(TableControlPlugin, _super);
    function TableControlPlugin() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        // 关联渲染器名字
        _this.rendererName = 'input-table';
        _this.$schema = '/schemas/TableControlSchema.json';
        // 组件名称
        _this.name = '表格编辑框';
        _this.isBaseComponent = true;
        _this.icon = 'fa fa-table';
        _this.description = "\u53EF\u4EE5\u7528\u6765\u5C55\u73B0\u6570\u636E\u7684,\u53EF\u4EE5\u7528\u6765\u5C55\u793A\u6570\u7EC4\u7C7B\u578B\u7684\u6570\u636E\uFF0C\u6BD4\u5982 <code>multiple</code> \u7684\u5B50 <code>form</code>";
        _this.docLink = '/amis/zh-CN/components/form/input-table';
        _this.tags = ['表单项'];
        _this.scaffold = {
            type: 'input-table',
            name: 'table',
            label: '表格表单',
            columns: [
                {
                    label: 'color',
                    name: 'color',
                    quickEdit: {
                        type: 'input-color'
                    }
                },
                {
                    label: '说明文字',
                    name: 'name',
                    quickEdit: {
                        type: 'input-text',
                        mode: 'inline'
                    }
                }
            ],
            strictMode: true
        };
        _this.regions = [
            {
                key: 'columns',
                label: '列集合',
                renderMethod: 'renderTableContent',
                preferTag: '展示',
                dndMode: 'position-h'
            }
        ];
        _this.previewSchema = {
            type: 'form',
            className: 'text-left',
            wrapWithPanel: false,
            mode: 'horizontal',
            body: __assign(__assign({}, _this.scaffold), { value: [{ color: 'green', name: '绿色' }] })
        };
        _this.scaffoldForm = {
            title: '快速构建表格',
            body: [
                {
                    name: 'columns',
                    type: 'combo',
                    multiple: true,
                    label: false,
                    addButtonText: '新增一列',
                    draggable: true,
                    items: [
                        {
                            type: 'input-text',
                            name: 'label',
                            placeholder: '标题'
                        },
                        {
                            type: 'input-text',
                            name: 'name',
                            placeholder: '绑定字段名'
                        },
                        {
                            type: 'select',
                            name: 'type',
                            placeholder: '类型',
                            value: 'text',
                            options: [
                                {
                                    value: 'text',
                                    label: '纯文本'
                                },
                                {
                                    value: 'tpl',
                                    label: '模板'
                                },
                                {
                                    value: 'image',
                                    label: '图片'
                                },
                                {
                                    value: 'date',
                                    label: '日期'
                                },
                                // {
                                //     value: 'datetime',
                                //     label: '日期时间'
                                // },
                                // {
                                //     value: 'time',
                                //     label: '时间'
                                // },
                                {
                                    value: 'progress',
                                    label: '进度'
                                },
                                {
                                    value: 'status',
                                    label: '状态'
                                },
                                {
                                    value: 'mapping',
                                    label: '映射'
                                },
                                {
                                    value: 'operation',
                                    label: '操作栏'
                                }
                            ]
                        }
                    ]
                }
            ],
            canRebuild: true
        };
        _this.panelTitle = '表格编辑';
        _this.panelBodyCreator = function (context) {
            var isCRUDBody = context.schema.type === 'crud';
            return getSchemaTpl('tabs', [
                {
                    title: '常规',
                    body: flatten([
                        // {
                        //   children: (
                        //     <div className="m-b">
                        //       <Button
                        //         level="success"
                        //         size="sm"
                        //         block
                        //         onClick={() => this.handleEditFormItem()}
                        //       >
                        //         配置列信息
                        //       </Button>
                        //     </div>
                        //   )
                        // },
                        getSchemaTpl('formItemName', {
                            required: true
                        }),
                        getSchemaTpl('label'),
                        getSchemaTpl('description'),
                        getSchemaTpl('switch', {
                            label: '是否可新增',
                            name: 'addable'
                        }),
                        {
                            type: 'input-text',
                            name: 'addBtnLabel',
                            label: '增加按钮名称',
                            visibleOn: 'data.addable',
                            pipeIn: defaultValue('')
                        },
                        {
                            name: 'addBtnIcon',
                            label: '增加按钮图标',
                            type: 'icon-picker',
                            className: 'fix-icon-picker-overflow',
                            visibleOn: 'data.addable'
                        },
                        getSchemaTpl('api', {
                            name: 'addApi',
                            label: '新增时提交的 API',
                            visibleOn: 'data.addable'
                        }),
                        getSchemaTpl('switch', {
                            label: '是否可删除',
                            name: 'removable'
                        }),
                        {
                            type: 'input-text',
                            name: 'deleteBtnLabel',
                            label: '删除按钮名称',
                            visibleOn: 'data.removable',
                            pipeIn: defaultValue('')
                        },
                        {
                            name: 'deleteBtnIcon',
                            label: '删除按钮图标',
                            type: 'icon-picker',
                            className: 'fix-icon-picker-overflow',
                            visibleOn: 'data.removable'
                        },
                        getSchemaTpl('api', {
                            name: 'deleteApi',
                            label: '删除时提交的 API',
                            visibleOn: 'data.removable'
                        }),
                        getSchemaTpl('switch', {
                            label: '是否可编辑',
                            name: 'editable'
                        }),
                        {
                            type: 'input-text',
                            name: 'editBtnLabel',
                            label: '编辑按钮名称',
                            visibleOn: 'data.editable',
                            pipeIn: defaultValue('')
                        },
                        {
                            name: 'editBtnIcon',
                            label: '编辑按钮图标',
                            type: 'icon-picker',
                            className: 'fix-icon-picker-overflow',
                            visibleOn: 'data.editable'
                        },
                        getSchemaTpl('switch', {
                            label: '是否可复制',
                            name: 'copyable'
                        }),
                        {
                            type: 'input-text',
                            name: 'copyBtnLabel',
                            label: '复制按钮名称',
                            visibleOn: 'data.copyable',
                            pipeIn: defaultValue('')
                        },
                        {
                            name: 'copyBtnIcon',
                            label: '复制按钮图标',
                            type: 'icon-picker',
                            className: 'fix-icon-picker-overflow',
                            visibleOn: 'data.copyable'
                        },
                        getSchemaTpl('api', {
                            name: 'updateApi',
                            label: '修改时提交的 API',
                            visibleOn: 'data.editable'
                        }),
                        {
                            type: 'input-text',
                            name: 'confirmBtnLabel',
                            label: '确认编辑按钮名称',
                            visibleOn: 'data.editable',
                            pipeIn: defaultValue('')
                        },
                        {
                            name: 'confirmBtnIcon',
                            label: '确认编辑按钮图标',
                            type: 'icon-picker',
                            className: 'fix-icon-picker-overflow',
                            visibleOn: 'data.editable'
                        },
                        {
                            type: 'input-text',
                            name: 'cancelBtnLabel',
                            label: '取消编辑按钮名称',
                            visibleOn: 'data.editable',
                            pipeIn: defaultValue('')
                        },
                        {
                            name: 'cancelBtnIcon',
                            label: '取消编辑按钮图标',
                            type: 'icon-picker',
                            className: 'fix-icon-picker-overflow',
                            visibleOn: 'data.editable'
                        },
                        getSchemaTpl('switch', {
                            label: '是否可拖拽排序',
                            name: 'draggable'
                        }),
                        getSchemaTpl('switch', {
                            label: '确认模式',
                            name: 'needConfirm'
                        }),
                        getSchemaTpl('switch', {
                            label: '严格模式',
                            name: 'strictMode',
                            value: true
                        }),
                        getSchemaTpl('switch', {
                            label: '获取父级数据',
                            labelRemark: {
                                trigger: 'click',
                                className: 'm-l-xs',
                                rootClose: true,
                                content: '配置"canAccessSuperData": true 同时配置 "strictMode": false 开启此特性，初始会自动映射父级数据域的同名变量。需要注意的是，这里只会初始会映射，一旦修改过就是当前行数据为主了。也就是说，表单项类型的，只会起到初始值的作用',
                                placement: 'left'
                            },
                            onChange: function (value, oldValue, model, form) {
                                if (value && !oldValue) {
                                    form.setValues({ strictMode: false });
                                }
                                else {
                                    form.setValues({ strictMode: true });
                                }
                            },
                            name: 'canAccessSuperData' // 同时需要配置strictMode
                        })
                    ])
                },
                {
                    title: '外观',
                    body: [
                        getSchemaTpl('formItemMode'),
                        getSchemaTpl('horizontalMode'),
                        getSchemaTpl('horizontal', {
                            label: '',
                            visibleOn: '(data.$$formMode == "horizontal" || data.mode == "horizontal") && data.label !== false && data.horizontal'
                        }),
                        getSchemaTpl('className'),
                        getSchemaTpl('className', {
                            label: 'Label CSS 类名',
                            name: 'labelClassName'
                        }),
                        getSchemaTpl('className', {
                            label: 'Input CSS 类名',
                            name: 'inputClassName'
                        }),
                        getSchemaTpl('className', {
                            label: '描述 CSS 类名',
                            name: 'descriptionClassName',
                            visibleOn: 'data.description'
                        })
                    ]
                },
                {
                    title: '显隐',
                    body: [getSchemaTpl('disabled'), getSchemaTpl('visible')]
                },
                {
                    title: '其他',
                    body: [
                        getSchemaTpl('required'),
                        getSchemaTpl('validateOnChange'),
                        getSchemaTpl('submitOnChange')
                    ]
                }
            ]);
        };
        return _this;
    }
    TableControlPlugin.prototype.filterProps = function (props) {
        var arr = Array.isArray(props.value)
            ? props.value
            : typeof props.source === 'string'
                ? resolveVariable(props.source, props.data)
                : resolveVariable('items', props.data);
        if (!Array.isArray(arr) || !arr.length) {
            var mockedData_1 = {};
            if (Array.isArray(props.columns)) {
                props.columns.forEach(function (column) {
                    if (column.name) {
                        setVariable(mockedData_1, column.name, mockValue(column));
                    }
                });
            }
            props.value = repeatArray(mockedData_1, 1).map(function (item, index) { return (__assign(__assign({}, item), { id: index + 1 })); });
        }
        else {
            // 只取10条预览，否则太多卡顿
            props.value = arr.slice(0, 10);
        }
        return props;
    };
    // 自动插入 label
    TableControlPlugin.prototype.beforeInsert = function (event) {
        var _a, _b, _c, _d;
        var context = event.context;
        if ((context.info.plugin === this ||
            ((_a = context.node.sameIdChild) === null || _a === void 0 ? void 0 : _a.info.plugin) === this) &&
            context.region === 'columns') {
            context.data = __assign(__assign({}, context.data), { label: (_d = (_b = context.data.label) !== null && _b !== void 0 ? _b : (_c = context.subRenderer) === null || _c === void 0 ? void 0 : _c.name) !== null && _d !== void 0 ? _d : '列名称' });
        }
    };
    return TableControlPlugin;
}(BasePlugin));
export { TableControlPlugin };
registerEditorPlugin(TableControlPlugin);
