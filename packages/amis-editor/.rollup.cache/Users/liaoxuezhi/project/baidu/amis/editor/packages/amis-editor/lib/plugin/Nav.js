import { __assign, __extends } from "tslib";
import { registerEditorPlugin } from 'amis-editor-core';
import { BasePlugin } from 'amis-editor-core';
import { getSchemaTpl } from 'amis-editor-core';
var NavPlugin = /** @class */ (function (_super) {
    __extends(NavPlugin, _super);
    function NavPlugin() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        // 关联渲染器名字
        _this.rendererName = 'nav';
        _this.$schema = '/schemas/NavSchema.json';
        // 组件名称
        _this.name = '导航';
        _this.isBaseComponent = true;
        _this.description = '用来渲染导航菜单，支持横排和竖排。';
        _this.docLink = '/amis/zh-CN/components/nav';
        _this.tags = ['功能'];
        _this.icon = 'fa fa-map-signs';
        _this.scaffold = {
            type: 'nav',
            stacked: true,
            links: [
                {
                    label: '页面1',
                    to: '?id=1'
                },
                {
                    label: '页面2',
                    to: '?id=2'
                }
            ]
        };
        _this.previewSchema = __assign({}, _this.scaffold);
        _this.panelTitle = '导航';
        _this.panelDefinitions = {
            links: {
                label: '菜单管理',
                name: 'links',
                type: 'combo',
                multiple: true,
                draggable: true,
                addButtonText: '新增菜单',
                multiLine: true,
                messages: {
                    validateFailed: '菜单中存在配置错误，请仔细检查'
                },
                scaffold: {
                    label: '',
                    to: ''
                },
                items: [
                    {
                        type: 'input-text',
                        name: 'label',
                        label: '名称',
                        required: true
                    },
                    {
                        type: 'input-text',
                        name: 'to',
                        label: '跳转地址',
                        required: true
                    },
                    {
                        type: 'icon-picker',
                        name: 'icon',
                        label: '图标',
                        className: 'fix-icon-picker-overflow'
                    },
                    {
                        type: 'group',
                        label: '是否高亮',
                        direction: 'vertical',
                        className: 'm-b-none',
                        labelRemark: {
                            trigger: 'click',
                            rootClose: true,
                            className: 'm-l-xs',
                            content: '可以配置该菜单是否要高亮',
                            placement: 'left'
                        },
                        body: [
                            {
                                name: 'active',
                                type: 'radios',
                                inline: true,
                                // pipeIn: (value:any) => typeof value === 'boolean' ? value : '1'
                                options: [
                                    {
                                        label: '是',
                                        value: true
                                    },
                                    {
                                        label: '否',
                                        value: false
                                    },
                                    {
                                        label: '表达式',
                                        value: ''
                                    }
                                ]
                            },
                            {
                                name: 'activeOn',
                                autoComplete: false,
                                visibleOn: 'typeof this.active !== "boolean"',
                                type: 'input-text',
                                placeholder: '留空将自动分析菜单地址',
                                className: 'm-t-n-sm'
                            }
                        ]
                    },
                    getSchemaTpl('switch', {
                        label: '包含子菜单',
                        name: 'children',
                        mode: 'inline',
                        className: 'block',
                        pipeIn: function (value) { return !!value; },
                        pipeOut: function (value) { return (value ? [{ label: '', to: '' }] : undefined); },
                        messages: {
                            validateFailed: '子菜单中存在配置错误，请仔细检查'
                        }
                    }),
                    {
                        name: 'children',
                        $ref: 'links',
                        visibleOn: 'this.hasOwnProperty("children") && this.children',
                        label: '子菜单管理',
                        addButtonText: '新增子菜单'
                    }
                ]
            }
        };
        _this.panelBody = [
            getSchemaTpl('tabs', [
                {
                    title: '常规',
                    body: [
                        {
                            $ref: 'links',
                            name: 'links'
                        },
                        { type: 'divider' },
                        getSchemaTpl('api', {
                            name: 'source',
                            label: '获取菜单接口',
                            description: '如果菜单地址希望可以动态设置，请在此填入接口地址'
                        })
                    ]
                },
                {
                    title: '外观',
                    body: [
                        getSchemaTpl('switch', {
                            name: 'stacked',
                            label: '是否竖着摆放'
                        }),
                        getSchemaTpl('className')
                    ]
                },
                {
                    title: '显隐',
                    body: [getSchemaTpl('ref'), getSchemaTpl('visible')]
                }
            ])
        ];
        return _this;
    }
    return NavPlugin;
}(BasePlugin));
export { NavPlugin };
registerEditorPlugin(NavPlugin);
