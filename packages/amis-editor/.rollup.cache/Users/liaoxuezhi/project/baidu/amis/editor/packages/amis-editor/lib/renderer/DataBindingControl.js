import { __awaiter, __decorate, __extends, __generator, __metadata } from "tslib";
import { Icon, InputBox, SchemaVariableListPicker, FormItem } from 'amis';
import React from 'react';
import { autobind } from 'amis-editor-core';
var DataBindingControl = /** @class */ (function (_super) {
    __extends(DataBindingControl, _super);
    function DataBindingControl() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    DataBindingControl.prototype.handleConfirm = function (result) {
        var _a, _b;
        var _c = this.props, manager = _c.manager, data = _c.data;
        if (result === null || result === void 0 ? void 0 : result.value) {
            this.props.onChange("".concat(result.value));
            (_b = (_a = manager.config) === null || _a === void 0 ? void 0 : _a.dataBindingChange) === null || _b === void 0 ? void 0 : _b.call(_a, result.value, data, manager);
        }
    };
    DataBindingControl.prototype.handlePickerOpen = function () {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function () {
            var _c, manager, node, withSuper, schemas;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        _c = this.props, manager = _c.manager, node = _c.node;
                        withSuper = (_b = (_a = manager.config) === null || _a === void 0 ? void 0 : _a.withSuperDataSchema) !== null && _b !== void 0 ? _b : false;
                        return [4 /*yield*/, manager.getContextSchemas(node.info.id, !withSuper)];
                    case 1:
                        schemas = _d.sent();
                        return [2 /*return*/, { schemas: schemas }];
                }
            });
        });
    };
    DataBindingControl.prototype.render = function () {
        var _this = this;
        var _a = this.props, cx = _a.classnames, value = _a.value, onChange = _a.onChange, disabled = _a.disabled;
        return (React.createElement(SchemaVariableListPicker, { onPickerOpen: this.handlePickerOpen, onConfirm: this.handleConfirm, title: "\u7ED1\u5B9A\u53D8\u91CF" }, function (_a) {
            var onClick = _a.onClick, isOpened = _a.isOpened, setState = _a.setState;
            return (React.createElement(InputBox, { className: "ae-InputVariable", clearable: false, value: value, onChange: onChange, disabled: disabled },
                React.createElement("span", { onClick: function (e) { return __awaiter(_this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            onClick(e);
                            return [2 /*return*/];
                        });
                    }); } },
                    React.createElement(Icon, { icon: "info", className: "icon cursor-pointer" }))));
        }));
    };
    __decorate([
        autobind,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object]),
        __metadata("design:returntype", void 0)
    ], DataBindingControl.prototype, "handleConfirm", null);
    __decorate([
        autobind,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", Promise)
    ], DataBindingControl.prototype, "handlePickerOpen", null);
    return DataBindingControl;
}(React.Component));
export { DataBindingControl };
var DataBindingControlRenderer = /** @class */ (function (_super) {
    __extends(DataBindingControlRenderer, _super);
    function DataBindingControlRenderer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    DataBindingControlRenderer = __decorate([
        FormItem({
            type: 'ae-DataBindingControl'
        })
    ], DataBindingControlRenderer);
    return DataBindingControlRenderer;
}(DataBindingControl));
export { DataBindingControlRenderer };
