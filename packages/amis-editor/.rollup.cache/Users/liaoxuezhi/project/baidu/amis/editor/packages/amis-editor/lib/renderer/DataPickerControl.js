import { __assign, __awaiter, __decorate, __extends, __generator, __metadata } from "tslib";
import { Icon, InputBox, FormulaPicker, FormItem } from 'amis';
import React from 'react';
import { autobind } from 'amis-editor-core';
var DataPickerControl = /** @class */ (function (_super) {
    __extends(DataPickerControl, _super);
    function DataPickerControl() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    DataPickerControl.prototype.handleConfirm = function (value) {
        this.props.onChange(value);
    };
    DataPickerControl.prototype.handlePickerOpen = function () {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var _b, manager, node, variables;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _b = this.props, manager = _b.manager, node = _b.node;
                        variables = (_a = this.props.variables) !== null && _a !== void 0 ? _a : this.props.data.variables;
                        if (!!variables) return [3 /*break*/, 2];
                        return [4 /*yield*/, manager.getContextSchemas(node.info.id)];
                    case 1:
                        _c.sent();
                        variables = manager.dataSchema.getDataPropsAsOptions();
                        _c.label = 2;
                    case 2: return [2 /*return*/, {
                            variables: variables.map(function (item) { return (__assign(__assign({}, item), { selectMode: 'tree' })); }),
                            variableMode: 'tabs'
                        }];
                }
            });
        });
    };
    DataPickerControl.prototype.render = function () {
        var _a = this.props, cx = _a.classnames, value = _a.value, onChange = _a.onChange, disabled = _a.disabled, manager = _a.manager, node = _a.node;
        return (React.createElement(FormulaPicker, { onPickerOpen: this.handlePickerOpen, evalMode: false, onConfirm: this.handleConfirm, value: value, onChange: function () { }, header: '' }, function (_a) {
            var onClick = _a.onClick, isOpened = _a.isOpened, setState = _a.setState;
            return (React.createElement(InputBox, { className: "ae-InputVariable", clearable: false, value: value, onChange: onChange, disabled: disabled },
                React.createElement("span", { onClick: onClick },
                    React.createElement(Icon, { icon: "info", className: "icon" }))));
        }));
    };
    __decorate([
        autobind,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String]),
        __metadata("design:returntype", void 0)
    ], DataPickerControl.prototype, "handleConfirm", null);
    __decorate([
        autobind,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", Promise)
    ], DataPickerControl.prototype, "handlePickerOpen", null);
    return DataPickerControl;
}(React.Component));
var DataPickerControlRenderer = /** @class */ (function (_super) {
    __extends(DataPickerControlRenderer, _super);
    function DataPickerControlRenderer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    DataPickerControlRenderer = __decorate([
        FormItem({
            type: 'ae-DataPickerControl',
            renderLabel: false
        })
    ], DataPickerControlRenderer);
    return DataPickerControlRenderer;
}(DataPickerControl));
export { DataPickerControlRenderer };
