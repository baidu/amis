import { __assign, __extends, __spreadArray } from "tslib";
import { registerEditorPlugin } from 'amis-editor-core';
import { BasePlugin } from 'amis-editor-core';
import { defaultValue, getSchemaTpl } from 'amis-editor-core';
var ContainerPlugin = /** @class */ (function (_super) {
    __extends(ContainerPlugin, _super);
    function ContainerPlugin() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        // 关联渲染器名字
        _this.rendererName = 'container';
        _this.$schema = '/schemas/ContainerSchema.json';
        // 组件名称
        _this.name = '容器';
        _this.isBaseComponent = true;
        _this.description = '一个简单的容器，可以将多个渲染器放置在一起。';
        _this.tags = ['容器'];
        _this.icon = 'fa fa-square-o';
        _this.scaffold = {
            type: 'container',
            body: '内容'
        };
        _this.previewSchema = __assign({}, _this.scaffold);
        _this.regions = [
            {
                key: 'body',
                label: '内容区'
            }
        ];
        _this.panelTitle = '容器';
        _this.panelJustify = true;
        _this.panelBodyCreator = function (context) {
            return getSchemaTpl('tabs', [
                {
                    title: '属性',
                    body: getSchemaTpl('collapseGroup', [
                        {
                            title: '常用',
                            body: [
                                {
                                    name: 'wrapperComponent',
                                    label: '容器标签',
                                    type: 'input-text',
                                    options: [
                                        'article',
                                        'aside',
                                        'code',
                                        'div',
                                        'footer',
                                        'header',
                                        'p',
                                        'section'
                                    ],
                                    pipeIn: defaultValue('div'),
                                    validations: {
                                        isAlphanumeric: true,
                                        matchRegexp: '/^(?!.*script).*$/' // 禁用一下script标签
                                    },
                                    validationErrors: {
                                        isAlpha: 'HTML标签不合法，请重新输入',
                                        matchRegexp: 'HTML标签不合法，请重新输入'
                                    },
                                    validateOnChange: false
                                }
                            ]
                        }
                    ])
                },
                {
                    title: '外观',
                    className: 'p-none',
                    body: getSchemaTpl('collapseGroup', __spreadArray(__spreadArray([], getSchemaTpl('style:common'), true), [
                        {
                            title: 'CSS 类名',
                            body: [
                                getSchemaTpl('className', { label: '外层CSS类名' }),
                                getSchemaTpl('className', {
                                    name: 'bodyClassName',
                                    label: '内容区CSS类名'
                                })
                            ]
                        }
                    ], false))
                }
            ]);
        };
        return _this;
    }
    return ContainerPlugin;
}(BasePlugin));
export { ContainerPlugin };
registerEditorPlugin(ContainerPlugin);
