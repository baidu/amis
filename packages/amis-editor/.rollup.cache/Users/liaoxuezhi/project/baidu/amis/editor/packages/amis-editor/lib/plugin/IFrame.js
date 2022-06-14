import { __extends } from "tslib";
import { registerEditorPlugin } from 'amis-editor-core';
import { BasePlugin } from 'amis-editor-core';
import { defaultValue, getSchemaTpl, valuePipeOut } from 'amis-editor-core';
import { formItemControl } from '../component/BaseControl';
var IFramePlugin = /** @class */ (function (_super) {
    __extends(IFramePlugin, _super);
    function IFramePlugin() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        // 关联渲染器名字
        _this.rendererName = 'iframe';
        _this.$schema = '/schemas/IFrameSchema.json';
        // 组件名称
        _this.name = 'iFrame';
        _this.isBaseComponent = true;
        _this.description = '可以用来嵌入现有页面。';
        _this.tags = ['容器'];
        _this.icon = 'fa fa-window-maximize';
        _this.scaffold = {
            type: 'iframe',
            src: '//www.baidu.com'
        };
        _this.previewSchema = {
            type: 'tpl',
            tpl: 'iFrame'
        };
        _this.panelTitle = 'iFrame';
        _this.panelBodyCreator = function (context) {
            return formItemControl({
                common: {
                    replace: true,
                    body: [
                        {
                            name: 'src',
                            label: '页面地址',
                            type: 'input-text',
                            description: ''
                        }
                    ]
                },
                status: {
                    replace: true,
                    body: [getSchemaTpl('visible')]
                },
                style: {
                    replace: true,
                    body: [
                        {
                            name: 'width',
                            label: 'iFrame 宽度',
                            type: 'input-text',
                            pipeIn: defaultValue('100%'),
                            pipeOut: valuePipeOut
                        },
                        {
                            name: 'height',
                            label: 'iFrame 高度',
                            type: 'input-text',
                            pipeOut: valuePipeOut
                        },
                        getSchemaTpl('className')
                    ]
                },
                validation: {
                    hidden: true
                }
            });
        };
        return _this;
    }
    IFramePlugin.prototype.renderRenderer = function (props) {
        return this.renderPlaceholder("IFrame \u9875\u9762\uFF08".concat(props.src, "\uFF09"));
    };
    return IFramePlugin;
}(BasePlugin));
export { IFramePlugin };
registerEditorPlugin(IFramePlugin);
