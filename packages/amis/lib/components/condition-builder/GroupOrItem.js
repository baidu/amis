"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CBGroupOrItem = void 0;
var tslib_1 = require("tslib");
var theme_1 = require("../../theme");
var react_1 = (0, tslib_1.__importDefault)(require("react"));
var icons_1 = require("../icons");
var helper_1 = require("../../utils/helper");
var Group_1 = (0, tslib_1.__importDefault)(require("./Group"));
var Item_1 = (0, tslib_1.__importDefault)(require("./Item"));
var Button_1 = (0, tslib_1.__importDefault)(require("../Button"));
var CBGroupOrItem = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(CBGroupOrItem, _super);
    function CBGroupOrItem() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.state = {
            hover: false
        };
        return _this;
    }
    CBGroupOrItem.prototype.handleItemChange = function (value) {
        this.props.onChange(value, this.props.index);
    };
    CBGroupOrItem.prototype.handleItemRemove = function () {
        var _a, _b;
        (_b = (_a = this.props).onRemove) === null || _b === void 0 ? void 0 : _b.call(_a, this.props.index);
    };
    CBGroupOrItem.prototype.handlerHoverIn = function (e) {
        e.stopPropagation();
        this.setState({
            hover: true
        });
    };
    CBGroupOrItem.prototype.handlerHoverOut = function (e) {
        this.setState({
            hover: false
        });
    };
    CBGroupOrItem.prototype.render = function () {
        var _a = this.props, builderMode = _a.builderMode, cx = _a.classnames, fieldClassName = _a.fieldClassName, value = _a.value, config = _a.config, fields = _a.fields, funcs = _a.funcs, draggable = _a.draggable, data = _a.data, disabled = _a.disabled, searchable = _a.searchable, onDragStart = _a.onDragStart, formula = _a.formula, popOverContainer = _a.popOverContainer, renderEtrValue = _a.renderEtrValue;
        return (react_1.default.createElement("div", { className: cx("CBGroupOrItem".concat(builderMode === 'simple' ? '-simple' : '')), "data-id": value === null || value === void 0 ? void 0 : value.id },
            react_1.default.createElement("div", { className: cx('CBGroupOrItem-body') }, (value === null || value === void 0 ? void 0 : value.conjunction) ? (react_1.default.createElement("div", { className: cx('CBGroupOrItem-body-group', this.state.hover && 'CBGroupOrItem-body-group--hover'), onMouseOver: this.handlerHoverIn, onMouseOut: this.handlerHoverOut },
                draggable ? (react_1.default.createElement("a", { draggable: true, onDragStart: onDragStart, className: cx('CBGroupOrItem-dragbar') },
                    react_1.default.createElement(icons_1.Icon, { icon: "drag-bar", className: "icon" }))) : null,
                react_1.default.createElement(Group_1.default, { disabled: disabled, searchable: searchable, onDragStart: onDragStart, config: config, fields: fields, value: value, onChange: this.handleItemChange, fieldClassName: fieldClassName, funcs: funcs, removeable: true, onRemove: this.handleItemRemove, data: data, renderEtrValue: renderEtrValue }))) : (react_1.default.createElement("div", { className: cx('CBGroupOrItem-body-item') },
                draggable ? (react_1.default.createElement("a", { draggable: true, onDragStart: onDragStart, className: cx('CBGroupOrItem-dragbar') },
                    react_1.default.createElement(icons_1.Icon, { icon: "drag-bar", className: "icon" }))) : null,
                react_1.default.createElement(Item_1.default, { disabled: disabled, searchable: searchable, config: config, fields: fields, value: value, onChange: this.handleItemChange, fieldClassName: fieldClassName, funcs: funcs, data: data, formula: formula, popOverContainer: popOverContainer, renderEtrValue: renderEtrValue }),
                react_1.default.createElement(Button_1.default, { className: cx('CBDelete'), onClick: this.handleItemRemove },
                    react_1.default.createElement(icons_1.Icon, { icon: "remove", className: "icon" })))))));
    };
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", [Object]),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], CBGroupOrItem.prototype, "handleItemChange", null);
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", []),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], CBGroupOrItem.prototype, "handleItemRemove", null);
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", [Object]),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], CBGroupOrItem.prototype, "handlerHoverIn", null);
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", [Object]),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], CBGroupOrItem.prototype, "handlerHoverOut", null);
    return CBGroupOrItem;
}(react_1.default.Component));
exports.CBGroupOrItem = CBGroupOrItem;
exports.default = (0, theme_1.themeable)(CBGroupOrItem);
//# sourceMappingURL=./components/condition-builder/GroupOrItem.js.map
