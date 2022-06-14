/**
 * @file 边框圆角
 * @description 边框 & 圆角设置
 */
import { __assign, __decorate, __extends } from "tslib";
import cx from 'classnames';
import React, { useState } from 'react';
import camelCase from 'lodash/camelCase';
import { observer } from 'mobx-react';
import { render as amisRender, FormItem, Select, NumberInput } from 'amis';
var borderItems = [
    {
        item: 'left',
        tip: '左边框',
        content: '┣'
    },
    {
        item: 'top',
        tip: '上边框',
        content: '┳'
    },
    {
        item: 'right',
        tip: '右边框',
        content: '┫'
    },
    {
        item: 'bottom',
        tip: '下边框',
        content: '┻'
    },
    {
        item: 'all',
        tip: '全部',
        content: '╋'
    }
];
var radiusItems = [
    {
        item: 'top-left',
        tip: '左上角',
        content: '┏'
    },
    {
        item: 'top-right',
        tip: '右上角',
        content: '┓'
    },
    {
        item: 'bottom-left',
        tip: '左下角',
        content: '┗'
    },
    {
        item: 'bottom-right',
        tip: '右下角',
        content: '┛'
    },
    {
        item: 'all',
        tip: '全部',
        content: '╋'
    }
];
function BoxBorder(_a) {
    var _b = _a.disableBorder, disableBorder = _b === void 0 ? false : _b, _c = _a.disableRadius, disableRadius = _c === void 0 ? false : _c, onChange = _a.onChange, _d = _a.value, value = _d === void 0 ? {} : _d;
    var _e = useState('all'), borderItem = _e[0], setBorderItem = _e[1];
    var _f = useState('all'), radiusItem = _f[0], setRadiusItem = _f[1];
    function getKey(type, field) {
        var activeItem = field === 'radius' ? radiusItem : borderItem;
        // TODO: 获取全部的时候应该判断是否所有值都相等，不相等的话返回空或者返回组合提示？
        if (activeItem === 'all') {
            return field === 'radius'
                ? camelCase("".concat(type, "-top-left-").concat(field))
                : camelCase("".concat(type, "-left-").concat(field));
        }
        return camelCase("".concat(type, "-").concat(activeItem, "-").concat(field));
    }
    function changeItem(type, key) {
        return function (e) {
            var _a;
            var val = (e === null || e === void 0 ? void 0 : e.value) || e;
            var field = getKey(type, key);
            var isRadius = key === 'radius';
            var activeItem = isRadius ? radiusItem : borderItem;
            if (activeItem === 'all') {
                var newValue_1 = {};
                // 过滤掉all
                var items = (isRadius ? radiusItems : borderItems).filter(function (position) { return (position === null || position === void 0 ? void 0 : position.item) !== 'all'; });
                items.forEach(function (item) {
                    var itemKey = camelCase("".concat(type, "-").concat(item.item, "-").concat(key));
                    newValue_1[itemKey] = val;
                });
                onChange(__assign(__assign({}, value), newValue_1));
            }
            else {
                onChange(__assign(__assign({}, value), (_a = {}, _a[field] = val, _a)));
            }
        };
    }
    function renderRadius() {
        return (React.createElement("div", { className: "ae-border-wrap ae-border-radius flex items-center" },
            React.createElement("div", { className: "ae-border-items" }, radiusItems.map(function (item) {
                var valueKey = camelCase("border-".concat(item.item));
                return (React.createElement("div", { key: valueKey, className: cx("ae-border-item ".concat(item.item), {
                        active: radiusItem === item.item
                    }), onClick: function () { return setRadiusItem(item.item); } },
                    React.createElement("span", { "data-tooltip": item.tip, "data-position": "top" }, item.content)));
            })),
            React.createElement("div", { className: "ae-border-settings" },
                React.createElement("div", { className: "flex items-center" },
                    React.createElement("label", null, "\u5706\u89D2"),
                    React.createElement(NumberInput, { placeholder: "\u5706\u89D2\u5C3A\u5BF8", value: value[getKey('border', 'radius')], step: 1, min: 0, onChange: changeItem('border', 'radius') })))));
    }
    function renderBorder() {
        return (React.createElement("div", { className: "ae-border-wrap flex flex-top mb-2" },
            React.createElement("div", { className: "ae-border-items" }, borderItems.map(function (item) {
                var valueKey = camelCase("border-".concat(item.item));
                return (React.createElement("div", { key: valueKey, className: cx("ae-border-item ".concat(item.item), {
                        active: borderItem === item.item
                    }), onClick: function () { return setBorderItem(item.item); } },
                    React.createElement("span", { "data-tooltip": item.tip, "data-position": "top" }, item.content)));
            })),
            React.createElement("div", { className: "ae-border-settings" },
                React.createElement("div", { className: "flex items-center" },
                    React.createElement("label", null, "\u7EBF\u5F62"),
                    React.createElement(Select, { className: "ae-border-input", placeholder: "\u8FB9\u6846\u7EBF\u578B", onChange: changeItem('border', 'style'), value: value[getKey('border', 'style')], options: [
                            {
                                label: '无',
                                value: 'none'
                            },
                            {
                                label: '实线',
                                value: 'solid'
                            },
                            {
                                label: '点线',
                                value: 'dotted'
                            },
                            {
                                label: '虚线',
                                value: 'dashed'
                            }
                        ] })),
                React.createElement("div", { className: "flex items-center" },
                    React.createElement("label", null, "\u7EBF\u5BBD"),
                    React.createElement(NumberInput, { placeholder: "\u8FB9\u6846\u5BBD\u5EA6", value: value[getKey('border', 'width')], step: 1, min: 0, onChange: changeItem('border', 'width') })),
                React.createElement("div", { className: "flex items-center" },
                    React.createElement("label", null, "\u989C\u8272"),
                    amisRender({
                        type: 'input-color',
                        placeholder: '边框颜色',
                        clearable: true,
                        value: value[getKey('border', 'color')],
                        inputClassName: 'ae-border-colorpicker'
                    }, {
                        onChange: changeItem('border', 'color')
                    })))));
    }
    return (React.createElement("div", { className: "p-2 ae-border" },
        !disableBorder && renderBorder(),
        !disableRadius && renderRadius()));
}
export default observer(BoxBorder);
var BorderRenderer = /** @class */ (function (_super) {
    __extends(BorderRenderer, _super);
    function BorderRenderer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    BorderRenderer.prototype.render = function () {
        return React.createElement(BoxBorder, __assign({}, this.props));
    };
    BorderRenderer = __decorate([
        FormItem({ type: 'style-border', renderLabel: false })
    ], BorderRenderer);
    return BorderRenderer;
}(React.Component));
export { BorderRenderer };
