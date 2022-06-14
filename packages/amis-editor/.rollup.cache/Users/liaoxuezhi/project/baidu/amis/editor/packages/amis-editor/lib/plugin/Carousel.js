import { __assign, __extends } from "tslib";
import { registerEditorPlugin } from 'amis-editor-core';
import { BasePlugin } from 'amis-editor-core';
import { defaultValue, getSchemaTpl } from 'amis-editor-core';
import { mockValue } from 'amis-editor-core';
var CarouselPlugin = /** @class */ (function (_super) {
    __extends(CarouselPlugin, _super);
    function CarouselPlugin() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        // 关联渲染器名字
        _this.rendererName = 'carousel';
        _this.$schema = '/schemas/CarouselSchema.json';
        // 组件名称
        _this.name = '轮播图';
        _this.isBaseComponent = true;
        _this.description = '用来渲染轮播图，可以配置每一页的内容（不只是图片），可以配置过渡动画。';
        _this.docLink = '/amis/zh-CN/components/carousel';
        _this.tags = ['展示'];
        _this.icon = 'fa fa-images';
        _this.scaffold = {
            type: 'carousel',
            options: [
                {
                    image: mockValue({ type: 'image' })
                },
                {
                    html: '<div style="width: 100%; height: 300px; background: #e3e3e3; text-align: center; line-height: 300px;">carousel data</div>'
                },
                {
                    image: mockValue({ type: 'image' })
                }
            ]
        };
        _this.previewSchema = __assign({}, _this.scaffold);
        _this.panelTitle = '轮播图';
        _this.panelBodyCreator = function (context) {
            var isUnderField = /\/field\/\w+$/.test(context.path);
            return [
                getSchemaTpl('tabs', [
                    {
                        title: '常规',
                        body: [
                            isUnderField
                                ? {
                                    type: 'tpl',
                                    inline: false,
                                    className: 'text-info text-sm',
                                    tpl: '<p>当前为字段内容节点配置，选择上层还有更多的配置。</p>'
                                }
                                : null,
                            {
                                type: 'formula',
                                name: '__mode',
                                autoSet: false,
                                formula: '!this.name && !this.source && Array.isArray(this.options) ? 2 : 1'
                            },
                            {
                                label: '数据源',
                                name: '__mode',
                                type: 'button-group-select',
                                size: 'xs',
                                mode: 'inline',
                                className: 'w-full',
                                options: [
                                    {
                                        label: '关联字段',
                                        value: 1
                                    },
                                    {
                                        label: '静态设置',
                                        value: 2
                                    }
                                ]
                            },
                            {
                                label: '字段名',
                                name: 'name',
                                type: 'input-text',
                                description: '设置字段名，关联当前数据作用域中的数据。',
                                visibleOn: 'this.__mode == 1'
                            },
                            {
                                type: 'combo',
                                name: 'options',
                                visibleOn: 'this.__mode == 2',
                                label: '轮播选项内容',
                                multiple: true,
                                multiLine: true,
                                addable: true,
                                removable: true,
                                typeSwitchable: false,
                                conditions: [
                                    {
                                        label: '图片',
                                        test: 'this.type === "image"',
                                        items: [
                                            getSchemaTpl('imageUrl', {
                                                name: 'content'
                                            }),
                                            {
                                                type: 'input-text',
                                                label: '图片标题',
                                                name: 'title',
                                                visibleOn: 'this.type == "image"'
                                            },
                                            getSchemaTpl('className', {
                                                label: '图片标题类名',
                                                name: 'titleClassName',
                                                visibleOn: 'this.type == "image"'
                                            }),
                                            {
                                                type: 'textarea',
                                                label: '图片描述',
                                                name: 'description',
                                                visibleOn: 'this.type == "image"'
                                            },
                                            getSchemaTpl('className', {
                                                label: '图片描述类名',
                                                name: 'descriptionClassName',
                                                visibleOn: 'this.type == "image"'
                                            }),
                                            {
                                                type: 'input-text',
                                                label: '打开外部链接',
                                                name: 'href',
                                                visibleOn: 'this.type == "image"'
                                            }
                                        ],
                                        scaffold: {
                                            type: 'input-image',
                                            image: ''
                                        }
                                    },
                                    {
                                        label: 'HTML',
                                        test: 'this.type === "html"',
                                        items: [
                                            getSchemaTpl('richText', {
                                                label: '内容',
                                                name: 'content'
                                            })
                                        ],
                                        scaffold: {
                                            type: 'html',
                                            content: '<p>html 片段</p>'
                                        }
                                    }
                                ],
                                pipeIn: function (value) {
                                    return Array.isArray(value) && value.length
                                        ? value.map(function (item) {
                                            return item && item.hasOwnProperty('html')
                                                ? {
                                                    type: 'html',
                                                    content: item.html
                                                }
                                                : {
                                                    type: 'image',
                                                    content: item.image,
                                                    title: item.title,
                                                    titleClassName: item.titleClassName,
                                                    description: item.description,
                                                    descriptionClassName: item.descriptionClassName
                                                };
                                        })
                                        : [];
                                },
                                pipeOut: function (value, originValue, data) {
                                    return Array.isArray(value) && value.length
                                        ? value.map(function (item) {
                                            return item.type === 'html'
                                                ? {
                                                    html: item.content
                                                }
                                                : {
                                                    image: item.content,
                                                    title: item.title,
                                                    titleClassName: item.titleClassName,
                                                    description: item.description,
                                                    descriptionClassName: item.descriptionClassName
                                                };
                                        })
                                        : [];
                                }
                            }
                        ]
                    },
                    {
                        title: '外观',
                        body: [
                            {
                                name: 'auto',
                                type: 'switch',
                                mode: 'inline',
                                className: 'w-full',
                                label: '自动轮播',
                                pipeIn: defaultValue(true)
                            },
                            {
                                name: 'interval',
                                type: 'input-range',
                                label: '动画间隔',
                                min: 1,
                                max: 100,
                                step: 1,
                                unit: 's',
                                pipeIn: function (value) { return (value !== null && value !== void 0 ? value : 3000) / 1000; },
                                pipeOut: function (value, originValue, data) { return value * 1000; }
                            },
                            {
                                name: 'duration',
                                type: 'input-range',
                                label: '动画时长',
                                min: 100,
                                max: 2000,
                                step: 10,
                                pipeIn: defaultValue(500),
                                unit: 'ms'
                            },
                            {
                                name: 'animation',
                                label: '动画效果',
                                type: 'button-group-select',
                                mode: 'inline',
                                className: 'w-full',
                                size: 'sm',
                                pipeIn: defaultValue('fade'),
                                options: [
                                    {
                                        label: 'fade',
                                        value: 'fade'
                                    },
                                    {
                                        label: 'slide',
                                        value: 'slide'
                                    }
                                ]
                            },
                            {
                                name: 'controlsTheme',
                                label: '控制按钮主题',
                                type: 'button-group-select',
                                size: 'sm',
                                pipeIn: defaultValue('light'),
                                mode: 'inline',
                                className: 'w-full',
                                options: [
                                    {
                                        label: 'light',
                                        value: 'light'
                                    },
                                    {
                                        label: 'dark',
                                        value: 'dark'
                                    }
                                ]
                            },
                            {
                                name: 'controls',
                                label: '控制显示',
                                type: 'button-group-select',
                                size: 'sm',
                                mode: 'inline',
                                className: 'w-full',
                                pipeIn: defaultValue('dots,arrows'),
                                multiple: true,
                                options: [
                                    {
                                        label: '底部圆点',
                                        value: 'dots'
                                    },
                                    {
                                        label: '左右箭头',
                                        value: 'arrows'
                                    }
                                ]
                            },
                            {
                                name: 'width',
                                type: 'input-text',
                                label: '宽度',
                                validations: 'isNumeric',
                                addOn: {
                                    type: 'button',
                                    label: 'px'
                                }
                            },
                            {
                                name: 'height',
                                type: 'input-text',
                                label: '高度',
                                validations: 'isNumeric',
                                addOn: {
                                    type: 'button',
                                    label: 'px'
                                }
                            },
                            getSchemaTpl('className')
                        ]
                    },
                    {
                        title: '显隐',
                        body: [getSchemaTpl('ref'), getSchemaTpl('visible')]
                    }
                ])
            ];
        };
        return _this;
    }
    CarouselPlugin.prototype.filterProps = function (props) {
        // 编辑的时候别自动轮播，影响编辑
        props.auto = false;
        return props;
    };
    /**
     * 补充切换的 toolbar
     * @param context
     * @param toolbars
     */
    CarouselPlugin.prototype.buildEditorToolbar = function (context, toolbars) {
        if (context.info.plugin === this &&
            context.info.renderer.name === 'carousel' &&
            !context.info.hostId) {
            var node_1 = context.node;
            toolbars.push({
                level: 'secondary',
                icon: 'fa fa-chevron-left',
                tooltip: '上个卡片',
                onClick: function () {
                    var _a;
                    var control = node_1.getComponent();
                    (_a = control === null || control === void 0 ? void 0 : control.prev) === null || _a === void 0 ? void 0 : _a.call(control);
                }
            });
            toolbars.push({
                level: 'secondary',
                icon: 'fa fa-chevron-right',
                tooltip: '下个卡片',
                onClick: function () {
                    var _a;
                    var control = node_1.getComponent();
                    (_a = control === null || control === void 0 ? void 0 : control.next) === null || _a === void 0 ? void 0 : _a.call(control);
                }
            });
        }
    };
    return CarouselPlugin;
}(BasePlugin));
export { CarouselPlugin };
registerEditorPlugin(CarouselPlugin);
