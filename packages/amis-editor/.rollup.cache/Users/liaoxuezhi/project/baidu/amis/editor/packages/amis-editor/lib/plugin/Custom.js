/**
 * @file 自定义代码
 */
import { __assign, __extends } from "tslib";
import { registerEditorPlugin } from 'amis-editor-core';
import { BasePlugin } from 'amis-editor-core';
import { getSchemaTpl } from 'amis-editor-core';
var CustomPlugin = /** @class */ (function (_super) {
    __extends(CustomPlugin, _super);
    function CustomPlugin() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        // 关联渲染器名字
        _this.rendererName = 'custom';
        _this.$schema = '/schemas/CustomSchema.json';
        // 组件名称
        _this.name = '自定义代码';
        _this.isBaseComponent = true;
        _this.description = '通过内嵌代码来实现功能';
        _this.tags = ['功能'];
        _this.icon = 'fa fa-gears';
        _this.docLink = '/amis/zh-CN/components/custom';
        _this.scaffold = {
            type: 'custom',
            html: '<div><h2>hello, world!</h2></div>',
            onMount: "\n      const button = document.createElement('button');\n      button.innerText = '\u70B9\u51FB\u4FEE\u6539\u59D3\u540D';\n      button.onclick = event => {\n        event.preventDefault();\n      };\n      dom.appendChild(button);"
        };
        _this.previewSchema = __assign({}, _this.scaffold);
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
    CustomPlugin.prototype.buildSubRenderers = function (context, renderers) {
        var info = _super.prototype.buildSubRenderers.apply(this, arguments);
        // 只有 form 下才调 onChange
        // if (
        //   context.info.renderer.name === 'form' ||
        //   context.node.childRegions.some(i => i.region === 'body')
        // ) {
        info.scaffold.onMount = "\n        const button = document.createElement('button');\n        button.innerText = '\u70B9\u51FB\u4FEE\u6539\u59D3\u540Dddd';\n        button.onclick = event => {\n          onChange('new name');\n          event.preventDefault();\n        };\n        dom.appendChild(button);";
        // }
        return info;
    };
    return CustomPlugin;
}(BasePlugin));
export { CustomPlugin };
registerEditorPlugin(CustomPlugin);
