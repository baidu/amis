import { __assign, __extends } from "tslib";
import { registerEditorPlugin } from 'amis-editor-core';
import { BasePlugin } from 'amis-editor-core';
import { defaultValue, getSchemaTpl } from 'amis-editor-core';
var QRCodePlugin = /** @class */ (function (_super) {
    __extends(QRCodePlugin, _super);
    function QRCodePlugin() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        // 关联渲染器名字
        _this.rendererName = 'qrcode';
        _this.$schema = '/schemas/QRCodeSchema.json';
        // 组件名称
        _this.name = '二维码';
        _this.isBaseComponent = true;
        _this.description = '可以用来生成二维码';
        _this.docLink = '/amis/zh-CN/components/qrcode';
        _this.tags = ['功能'];
        _this.icon = 'fa fa-qrcode';
        _this.scaffold = {
            type: 'qrcode',
            value: 'https://amis.baidu.com'
        };
        _this.previewSchema = __assign({}, _this.scaffold);
        _this.panelTitle = '二维码';
        _this.panelBody = [
            getSchemaTpl('tabs', [
                {
                    title: '常规',
                    body: [
                        {
                            name: 'value',
                            type: 'input-text',
                            label: '二维码值',
                            pipeIn: defaultValue('https://www.baidu.com'),
                            description: '支持使用 <code>\\${xxx}</code> 来获取变量'
                        },
                        {
                            name: 'level',
                            type: 'select',
                            label: '复杂度',
                            pipeIn: defaultValue('L'),
                            options: [
                                {
                                    label: 'L',
                                    value: 'L'
                                },
                                {
                                    label: 'M',
                                    value: 'M'
                                },
                                {
                                    label: 'Q',
                                    value: 'Q'
                                },
                                {
                                    label: 'H',
                                    value: 'H'
                                }
                            ]
                        }
                    ]
                },
                {
                    title: '外观',
                    body: [
                        {
                            name: 'codeSize',
                            type: 'input-number',
                            label: '宽高值',
                            pipeIn: defaultValue(128)
                        },
                        {
                            name: 'backgroundColor',
                            type: 'input-color',
                            label: '背景色',
                            pipeIn: defaultValue('#fff')
                        },
                        {
                            name: 'foregroundColor',
                            type: 'input-color',
                            label: '前景色',
                            pipeIn: defaultValue('#000')
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
        return _this;
    }
    return QRCodePlugin;
}(BasePlugin));
export { QRCodePlugin };
registerEditorPlugin(QRCodePlugin);
