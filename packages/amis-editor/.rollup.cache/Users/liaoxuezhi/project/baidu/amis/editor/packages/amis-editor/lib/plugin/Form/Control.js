import { __assign, __extends } from "tslib";
import React from 'react';
import { Button } from 'amis';
import { getSchemaTpl } from 'amis-editor-core';
import { registerEditorPlugin } from 'amis-editor-core';
import { BasePlugin } from 'amis-editor-core';
import { formItemControl } from '../../component/BaseControl';
var ControlPlugin = /** @class */ (function (_super) {
    __extends(ControlPlugin, _super);
    function ControlPlugin() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        // 关联渲染器名字
        _this.rendererName = 'control';
        _this.$schema = '/schemas/FormControlSchema.json';
        // 组件名称
        _this.name = '表单项容器';
        _this.isBaseComponent = true;
        _this.icon = 'fa fa-object-group';
        _this.description = "\u8868\u5355\u9879\u5BB9\u5668";
        _this.docLink = '/amis/zh-CN/components/form/group';
        _this.tags = ['容器'];
        /**
         * 组件选择面板中隐藏，和Container合并
         */
        _this.disabledRendererPlugin = true;
        _this.scaffold = {
            type: 'control',
            label: '表单项容器',
            body: [
                {
                    type: 'tpl',
                    tpl: 'a'
                }
            ]
        };
        _this.previewSchema = {
            type: 'form',
            className: 'text-left',
            mode: 'horizontal',
            wrapWithPanel: false,
            body: [
                __assign({}, _this.scaffold)
            ]
        };
        // 容器配置
        _this.regions = [
            {
                key: 'body',
                label: '元素集合',
                preferTag: '表单项'
            }
        ];
        _this.panelTitle = '表单项容器';
        _this.panelBodyCreator = function (context) {
            return formItemControl({
                common: {
                    replace: true,
                    body: [
                        {
                            children: (React.createElement(Button, { className: "m-b", onClick: function () { return _this.manager.showRendererPanel('表单项'); }, level: "danger", tooltip: "\u63D2\u5165\u4E00\u4E2A\u65B0\u7684\u5143\u7D20", size: "sm", block: true }, "\u65B0\u589E\u5143\u7D20"))
                        },
                        getSchemaTpl('labelRemark'),
                        getSchemaTpl('remark'),
                        getSchemaTpl('placeholder'),
                        getSchemaTpl('description')
                    ]
                }
            });
        };
        return _this;
    }
    return ControlPlugin;
}(BasePlugin));
export { ControlPlugin };
registerEditorPlugin(ControlPlugin);
