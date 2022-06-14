import { __assign, __extends } from "tslib";
import { registerEditorPlugin } from 'amis-editor-core';
import { BasePlugin } from 'amis-editor-core';
import { defaultValue, getSchemaTpl } from 'amis-editor-core';
import { mockValue } from 'amis-editor-core';
var ImagePlugin = /** @class */ (function (_super) {
    __extends(ImagePlugin, _super);
    function ImagePlugin() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        // 关联渲染器名字
        _this.rendererName = 'image';
        _this.$schema = '/schemas/ImageSchema.json';
        // 组件名称
        _this.name = '图片展示';
        _this.isBaseComponent = true;
        _this.description = '可以用来展示一张图片，支持静态设置图片地址，也可以配置 <code>name</code> 与变量关联。';
        _this.tags = ['展示'];
        _this.icon = 'fa fa-photo';
        _this.scaffold = {
            type: 'image'
        };
        _this.previewSchema = __assign(__assign({}, _this.scaffold), { thumbMode: 'cover', value: mockValue({ type: 'image' }) });
        _this.panelTitle = '图片';
        _this.panelBodyCreator = function (context) {
            var isUnderField = /\/field\/\w+$/.test(context.path);
            return [
                getSchemaTpl('tabs', [
                    {
                        title: '常规',
                        body: [
                            {
                                name: 'imageMode',
                                label: '展示模式',
                                type: 'select',
                                pipeIn: defaultValue('thumb'),
                                options: [
                                    {
                                        label: '缩率图',
                                        value: 'thumb'
                                    },
                                    {
                                        label: '原图',
                                        value: 'original'
                                    }
                                ]
                            },
                            {
                                name: 'title',
                                type: 'input-text',
                                label: '图片标题'
                            },
                            {
                                name: 'imageCaption',
                                type: 'input-text',
                                label: '图片描述'
                            },
                            {
                                name: 'width',
                                label: '宽度',
                                type: 'input-number'
                            },
                            {
                                name: 'height',
                                label: '高度',
                                type: 'input-number'
                            },
                            isUnderField
                                ? null
                                : getSchemaTpl('imageUrl', {
                                    name: 'src',
                                    type: 'input-text',
                                    label: '缩略图地址',
                                    description: '如果已绑定字段名，可以不用设置，支持用变量。'
                                }),
                            {
                                type: 'input-text',
                                label: '打开外部链接',
                                name: 'href'
                            },
                            getSchemaTpl('imageUrl', {
                                name: 'defaultImage',
                                label: '无数据时显示的图片'
                            })
                        ]
                    },
                    {
                        title: '外观',
                        body: [
                            getSchemaTpl('switch', {
                                name: 'enlargeAble',
                                label: '开启图片放大功能'
                            }),
                            getSchemaTpl('imageUrl', {
                                name: 'originalSrc',
                                visibleOn: 'this.enlargeAble',
                                label: '原图地址',
                                description: '如果不配置将默认使用缩略图地址。'
                            }),
                            getSchemaTpl('switch', {
                                name: 'showDimensions',
                                label: '是否显示图片尺寸'
                            }),
                            {
                                name: 'thumbMode',
                                type: 'button-group-select',
                                label: '缩略图展示模式',
                                size: 'sm',
                                pipeIn: defaultValue('contain'),
                                options: [
                                    {
                                        label: '宽度占满',
                                        value: 'w-full'
                                    },
                                    {
                                        label: '高度占满',
                                        value: 'h-full'
                                    },
                                    {
                                        label: '包含',
                                        value: 'contain'
                                    },
                                    {
                                        label: '铺满',
                                        value: 'cover'
                                    }
                                ]
                            },
                            {
                                name: 'thumbRatio',
                                type: 'button-group-select',
                                label: '缩略图比率',
                                size: 'sm',
                                pipeIn: defaultValue('1:1'),
                                options: [
                                    {
                                        label: '1:1',
                                        value: '1:1'
                                    },
                                    {
                                        label: '4:3',
                                        value: '4:3'
                                    },
                                    {
                                        label: '16:9',
                                        value: '16:9'
                                    }
                                ]
                            },
                            getSchemaTpl('className', {
                                autoComplete: false
                            }),
                            getSchemaTpl('className', {
                                name: 'imageClassName',
                                label: '图片 CSS 类名'
                            }),
                            getSchemaTpl('className', {
                                name: 'thumbClassName',
                                label: '缩略图 CSS 类名'
                            })
                        ]
                    },
                    {
                        title: '显隐',
                        body: [
                            // getSchemaTpl('ref'),
                            getSchemaTpl('visible')
                        ]
                    }
                ])
            ];
        };
        return _this;
    }
    ImagePlugin.prototype.onActive = function (event) {
        var _a;
        var context = event.context;
        if (((_a = context.info) === null || _a === void 0 ? void 0 : _a.plugin) !== this || !context.node) {
            return;
        }
        var node = context.node;
        node.setHeightMutable(true);
        node.setWidthMutable(true);
    };
    ImagePlugin.prototype.onWidthChangeStart = function (event) {
        return this.onSizeChangeStart(event, 'horizontal');
    };
    ImagePlugin.prototype.onHeightChangeStart = function (event) {
        return this.onSizeChangeStart(event, 'vertical');
    };
    ImagePlugin.prototype.onSizeChangeStart = function (event, direction) {
        var _a;
        if (direction === void 0) { direction = 'both'; }
        var context = event.context;
        var node = context.node;
        if (((_a = node.info) === null || _a === void 0 ? void 0 : _a.plugin) !== this) {
            return;
        }
        var resizer = context.resizer;
        var dom = context.dom;
        var frameRect = dom.parentElement.getBoundingClientRect();
        var rect = dom.getBoundingClientRect();
        var startX = context.nativeEvent.pageX;
        var startY = context.nativeEvent.pageY;
        event.setData({
            onMove: function (e) {
                var dy = e.pageY - startY;
                var dx = e.pageX - startX;
                var height = Math.max(50, rect.height + dy);
                var width = Math.max(100, Math.min(rect.width + dx, frameRect.width));
                var state = {
                    width: width,
                    height: height
                };
                if (direction === 'both') {
                    resizer.setAttribute('data-value', "".concat(width, "px x ").concat(height, "px"));
                }
                else if (direction === 'vertical') {
                    resizer.setAttribute('data-value', "".concat(height, "px"));
                    delete state.width;
                }
                else {
                    resizer.setAttribute('data-value', "".concat(width, "px"));
                    delete state.height;
                }
                node.updateState(state);
                requestAnimationFrame(function () {
                    node.calculateHighlightBox();
                });
            },
            onEnd: function (e) {
                var dy = e.pageY - startY;
                var dx = e.pageX - startX;
                var height = Math.max(50, rect.height + dy);
                var width = Math.max(100, Math.min(rect.width + dx, frameRect.width));
                var state = {
                    width: width,
                    height: height
                };
                if (direction === 'vertical') {
                    delete state.width;
                }
                else if (direction === 'horizontal') {
                    delete state.height;
                }
                resizer.removeAttribute('data-value');
                node.updateSchema(state);
                requestAnimationFrame(function () {
                    node.calculateHighlightBox();
                });
            }
        });
    };
    return ImagePlugin;
}(BasePlugin));
export { ImagePlugin };
registerEditorPlugin(ImagePlugin);
