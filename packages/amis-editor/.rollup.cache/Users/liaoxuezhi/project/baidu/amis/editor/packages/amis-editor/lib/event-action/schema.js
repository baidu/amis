import { __assign } from "tslib";
import React from 'react';
import { Button } from 'amis';
import { defaultValue, getSchemaTpl } from 'amis-editor-core';
export var getComboWrapper = function (items, multiple) {
    if (multiple === void 0) { multiple = false; }
    return ({
        type: 'combo',
        name: 'args',
        // label: '动作参数',
        multiple: multiple,
        strictMode: false,
        items: Array.isArray(items) ? items : [items]
    });
};
/**
 * 获取动作配置项map
 * @param manager
 */
export function getActionConfigItemsMap(manager) {
    return {
        ajax: {
            config: ['api'],
            desc: function (info) {
                var _a, _b, _c, _d;
                return (React.createElement("div", null,
                    "\u53D1\u9001",
                    React.createElement("span", { className: "variable-right variable-left" }, (_b = (_a = info === null || info === void 0 ? void 0 : info.args) === null || _a === void 0 ? void 0 : _a.api) === null || _b === void 0 ? void 0 : _b.method),
                    "\u8BF7\u6C42\uFF1A",
                    React.createElement("span", { className: "variable-left" }, (_d = (_c = info === null || info === void 0 ? void 0 : info.args) === null || _c === void 0 ? void 0 : _c.api) === null || _d === void 0 ? void 0 : _d.url)));
            },
            schema: {
                type: 'wrapper',
                style: { padding: '0 0 0 32px' },
                body: [
                    getComboWrapper(getSchemaTpl('apiControl', {
                        name: 'api'
                    }))
                ]
            }
        },
        download: {
            config: ['api'],
            schema: {
                type: 'wrapper',
                style: { padding: '0 0 0 32px' },
                body: [
                    getComboWrapper(getSchemaTpl('apiControl', {
                        name: 'api'
                    }))
                ]
            }
        },
        dialog: {
            schema: {
                name: 'dialog',
                label: '弹框内容',
                mode: 'horizontal',
                required: true,
                pipeIn: defaultValue({
                    title: '弹框标题',
                    body: '<p>对，你刚刚点击了</p>'
                }),
                asFormItem: true,
                children: function (_a) {
                    var value = _a.value, onChange = _a.onChange, data = _a.data;
                    return (React.createElement(Button, { size: "sm", className: "action-btn-width", onClick: function () {
                            return manager.openSubEditor({
                                title: '配置弹框内容',
                                value: __assign({ type: 'dialog' }, value),
                                onChange: function (value) { return onChange(value); }
                            });
                        }, block: true }, "\u53BB\u914D\u7F6E"));
                }
            }
        },
        drawer: {
            schema: {
                name: 'drawer',
                label: '抽屉内容',
                mode: 'horizontal',
                required: true,
                pipeIn: defaultValue({
                    title: '弹框标题',
                    body: '<p>对，你刚刚点击了</p>'
                }),
                asFormItem: true,
                children: function (_a) {
                    var value = _a.value, onChange = _a.onChange, data = _a.data;
                    return (React.createElement(Button, { size: "sm", className: "action-btn-width", onClick: function () {
                            return manager.openSubEditor({
                                title: '配置抽出式弹框内容',
                                value: __assign({ type: 'drawer' }, value),
                                onChange: function (value) { return onChange(value); }
                            });
                        }, block: true }, "\u53BB\u914D\u7F6E"));
                }
            }
        },
        link: {
            config: ['link', 'params'],
            desc: function (info) {
                return (React.createElement("div", null,
                    "\u6253\u5F00",
                    React.createElement("span", { className: "variable-left variable-right" }, info === null || info === void 0 ? void 0 : info.__pageName),
                    "\u9875\u9762"));
            },
            schema: getComboWrapper([
                {
                    type: 'wrapper',
                    className: 'p-none',
                    body: [getSchemaTpl('app-page'), getSchemaTpl('app-page-args')]
                }
            ])
        }
    };
}
