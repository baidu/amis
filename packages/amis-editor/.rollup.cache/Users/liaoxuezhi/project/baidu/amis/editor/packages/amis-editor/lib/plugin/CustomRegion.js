/**
 * @file 自定义代码
 */
import { __assign, __extends } from "tslib";
import { registerEditorPlugin } from 'amis-editor-core';
import { BasePlugin } from 'amis-editor-core';
import { getSchemaTpl } from 'amis-editor-core';
import isArray from 'lodash/isArray';
var CustomPlugin = /** @class */ (function (_super) {
    __extends(CustomPlugin, _super);
    function CustomPlugin() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        // 关联渲染器名字
        _this.rendererName = 'custom';
        _this.$schema = '/schemas/CustomSchema.json';
        // 组件名称
        _this.name = '自定义容器';
        _this.isBaseComponent = true;
        _this.disabledRendererPlugin = true; // 待完善，暂时隐藏
        _this.description = '通过自定义代码来实现容器组件';
        _this.docLink = '/amis/zh-CN/components/custom';
        _this.tags = ['功能', '容器'];
        _this.icon = 'fa fa-gears';
        _this.scaffold = {
            type: 'custom',
            html: '<div>\n<h2>hello, world!</h2>\n<div id="customBox">自定义容器区域</div>\n</div>',
            onMount: "this.renderChild('body', props.body, document.getElementById('customBox'));",
            body: [
                {
                    type: 'tpl',
                    tpl: '<p>自定义容器区域</p>'
                }
            ]
        };
        _this.previewSchema = __assign({}, _this.scaffold);
        _this.regions = [
            {
                key: 'body',
                label: '内容区'
            }
        ];
        _this.panelTitle = '自定义代码';
        _this.panelBody = [
            getSchemaTpl('fieldSet', {
                title: 'HTML 内容',
                body: [
                    {
                        label: 'HTML 内容',
                        name: 'html',
                        type: 'editor',
                        allowFullscreen: true
                    }
                ]
            }),
            getSchemaTpl('fieldSet', {
                title: 'onMount',
                body: [
                    {
                        name: 'onMount',
                        type: 'editor',
                        allowFullscreen: true,
                        size: 'xxl',
                        label: 'onMount 代码',
                        options: {
                            lineNumbers: 'off',
                            glyphMargin: false,
                            lineDecorationsWidth: 0,
                            lineNumbersMinChars: 0
                        }
                    }
                ]
            }),
            getSchemaTpl('fieldSet', {
                title: 'onUpdate',
                body: [
                    {
                        name: 'onUpdate',
                        type: 'editor',
                        allowFullscreen: true,
                        size: 'xxl',
                        label: 'onUpdate 代码'
                    }
                ]
            }),
            getSchemaTpl('fieldSet', {
                title: 'onUnmount',
                body: [
                    {
                        name: 'onUnmount',
                        type: 'editor',
                        allowFullscreen: true,
                        size: 'xxl',
                        label: 'onUnmount 代码'
                    }
                ]
            })
        ];
        return _this;
    }
    /**
     * 备注: 根据当前custom组件的schema中是否有body元素来启动容器模式，用于实现custom组件实现自定义容器类型
     */
    CustomPlugin.prototype.getRendererInfo = function (context) {
        var plugin = this;
        var renderer = context.renderer, schema = context.schema;
        if (schema.$$id &&
            plugin.name &&
            plugin.rendererName &&
            plugin.rendererName === renderer.name) {
            var regions = plugin.regions;
            if (!regions && schema && schema.body && isArray(schema.body)) {
                regions = [
                    {
                        key: 'body',
                        label: '自定义容器区'
                    }
                ];
            }
            return {
                name: plugin.name,
                regions: regions,
                patchContainers: plugin.patchContainers,
                // wrapper: plugin.wrapper,
                vRendererConfig: plugin.vRendererConfig,
                wrapperProps: plugin.wrapperProps,
                wrapperResolve: plugin.wrapperResolve,
                filterProps: plugin.filterProps,
                $schema: plugin.$schema,
                renderRenderer: plugin.renderRenderer,
                multifactor: plugin.multifactor,
                scaffoldForm: plugin.scaffoldForm,
                disabledRendererPlugin: plugin.disabledRendererPlugin,
                isBaseComponent: plugin.isBaseComponent,
                rendererName: plugin.rendererName
            };
        }
    };
    return CustomPlugin;
}(BasePlugin));
export { CustomPlugin };
registerEditorPlugin(CustomPlugin);
