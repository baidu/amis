/**
 * @file  BoxModel
 * @description 盒模型控件，支持编辑 margin & padding
 */
import { __assign, __decorate, __extends } from "tslib";
import cx from 'classnames';
import React from 'react';
import { observer } from 'mobx-react';
import camelCase from 'lodash/camelCase';
import { FormItem } from 'amis';
import { isNumeric } from 'amis-editor-core';
function BoxModel(_a) {
    var value = _a.value, onChange = _a.onChange;
    var directions = ['left', 'right', 'top', 'bottom'];
    function handleChange(styleName) {
        return function (e) {
            var _a, _b;
            var inputValue = e.target.value;
            if (!inputValue) {
                onChange(__assign(__assign({}, value), (_a = {}, _a[styleName] = undefined, _a)));
                return;
            }
            // 数字类型或带有合法单位的字符串都支持
            if (isNumeric(inputValue) ||
                /^(-?(\d*\.)?\d+)((px)|(em)|(%)|(ex)|(ch)|(rem)|(vw)|(vh)|(vmin)|(vmax)|(cm)|(mm)|(in)|(pt)|(pc))$/.test(inputValue)) {
                onChange(__assign(__assign({}, value), (_b = {}, _b[styleName] = inputValue, _b)));
            }
        };
    }
    function renderBoxItem(item) {
        return (React.createElement(React.Fragment, null,
            directions.map(function (direction) {
                var propsName = camelCase("".concat(item, "-").concat(direction));
                return (React.createElement("input", { key: propsName, placeholder: "0", className: "ae-BoxModel-input ".concat(direction), type: "text", onChange: handleChange(propsName), value: (value === null || value === void 0 ? void 0 : value[propsName]) || '' }));
            }),
            React.createElement("div", { className: "ae-BoxModel-title" }, item.toUpperCase()),
            ['lt', 'lb', 'rt', 'rb'].map(function (position) { return (React.createElement("div", { key: position, className: cx('ae-BoxModel-line', position) })); })));
    }
    return (React.createElement("div", { className: "mx-2 ae-BoxModel" },
        React.createElement("div", { className: "ae-BoxModel-inner" },
            React.createElement("div", { className: "ae-BoxModel" },
                React.createElement("div", { className: "ae-BoxModel-inner" }),
                renderBoxItem('padding'))),
        renderBoxItem('margin')));
}
export default observer(BoxModel);
var BoxModelRenderer = /** @class */ (function (_super) {
    __extends(BoxModelRenderer, _super);
    function BoxModelRenderer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    BoxModelRenderer.prototype.render = function () {
        return React.createElement(BoxModel, __assign({}, this.props));
    };
    BoxModelRenderer = __decorate([
        FormItem({ type: 'style-box-model' })
    ], BoxModelRenderer);
    return BoxModelRenderer;
}(React.Component));
export { BoxModelRenderer };
