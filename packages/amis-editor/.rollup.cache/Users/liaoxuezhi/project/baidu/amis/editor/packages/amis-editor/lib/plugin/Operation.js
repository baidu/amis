import { __extends } from "tslib";
import { Button } from 'amis';
import React from 'react';
import { registerEditorPlugin } from 'amis-editor-core';
import { BasePlugin } from 'amis-editor-core';
import { getSchemaTpl } from 'amis-editor-core';
var OperationPlugin = /** @class */ (function (_super) {
    __extends(OperationPlugin, _super);
    function OperationPlugin() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        // 关联渲染器名字
        _this.rendererName = 'operation';
        _this.$schema = '/schemas/OperationSchema.json';
        // 组件名称
        _this.name = '操作栏';
        _this.isBaseComponent = true;
        _this.description = '操作栏，用于表格。';
        _this.tags = ['展示'];
        _this.icon = '';
        _this.scaffold = {
            type: 'operation',
            label: '操作',
            buttons: [
                {
                    label: '按钮',
                    type: 'button'
                }
            ]
        };
        _this.previewSchema = {
            type: 'tpl',
            tpl: '操作栏'
        };
        _this.regions = [
            {
                key: 'buttons',
                label: '按钮集',
                renderMethod: 'render',
                insertPosition: 'inner',
                preferTag: '按钮'
            }
        ];
        _this.panelTitle = '操作栏';
        _this.panelBodyCreator = function (context) {
            return [
                getSchemaTpl('className', {
                    name: 'innerClassName'
                }),
                {
                    children: (React.createElement(Button, { level: "info", size: "sm", className: "m-b-sm", block: true, onClick: function () {
                            // this.manager.showInsertPanel('buttons', context.id, '按钮');
                            _this.manager.showRendererPanel('按钮', '请从左侧组件面板中点击添加新的按钮');
                        } }, "\u6DFB\u52A0\u6309\u94AE"))
                }
            ];
        };
        return _this;
    }
    OperationPlugin.prototype.buildSubRenderers = function (context, renderers) {
        if (context &&
            context.info &&
            context.info.renderer &&
            (context.info.renderer.name === 'table' ||
                context.info.renderer.name === 'crud')) {
            return _super.prototype.buildSubRenderers.apply(this, arguments);
        }
    };
    return OperationPlugin;
}(BasePlugin));
export { OperationPlugin };
registerEditorPlugin(OperationPlugin);
