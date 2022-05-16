"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QueryBuilder = void 0;
var tslib_1 = require("tslib");
var react_1 = (0, tslib_1.__importDefault)(require("react"));
var theme_1 = require("../../theme");
var locale_1 = require("../../locale");
var uncontrollable_1 = require("uncontrollable");
var Group_1 = (0, tslib_1.__importDefault)(require("./Group"));
var config_1 = (0, tslib_1.__importDefault)(require("./config"));
var helper_1 = require("../../utils/helper");
var Animation_1 = (0, tslib_1.__importDefault)(require("../../utils/Animation"));
var QueryBuilder = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(QueryBuilder, _super);
    function QueryBuilder() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.config = (0, tslib_1.__assign)((0, tslib_1.__assign)({}, config_1.default), _this.props.config);
        _this.lastMoveAt = 0;
        return _this;
    }
    QueryBuilder.prototype.handleDragStart = function (e) {
        var target = e.currentTarget;
        var item = target.closest('[data-id]');
        this.dragTarget = item;
        // this.dragNextSibling = item.nextElementSibling;
        this.host = item.closest('[data-group-id]');
        var ghost = item.cloneNode(true);
        ghost.classList.add('is-ghost');
        this.ghost = ghost;
        e.dataTransfer.setDragImage(item.firstChild, 0, 0);
        target.addEventListener('dragend', this.handleDragEnd);
        document.body.addEventListener('dragover', this.handleDragOver);
        document.body.addEventListener('drop', this.handleDragDrop);
        this.lastX = e.clientX;
        this.lastY = e.clientY;
        // 应该是 chrome 的一个bug，如果你马上修改，会马上执行 dragend
        setTimeout(function () {
            item.classList.add('is-dragging');
            // item.parentElement!.insertBefore(
            //   item,
            //   item.parentElement!.firstElementChild
            // ); // 挪到第一个，主要是因为样式问题。
        }, 5);
    };
    QueryBuilder.prototype.handleDragOver = function (e) {
        e.preventDefault();
        var item = e.target.closest('[data-id]');
        var dx = e.clientX - this.lastX;
        var dy = e.clientY - this.lastY;
        var d = Math.max(Math.abs(dx), Math.abs(dy));
        var now = Date.now();
        // 没移动还是不要处理，免得晃动个不停。
        if (d < 5) {
            if (this.lastMoveAt === 0) {
            }
            else if (now - this.lastMoveAt > 500) {
                var host = e.target.closest('[data-group-id]');
                if (host) {
                    this.host = host;
                    this.lastMoveAt = now;
                    this.lastX = 0;
                    this.lastY = 0;
                    this.handleDragOver(e);
                    return;
                }
            }
            return;
        }
        this.lastMoveAt = now;
        this.lastX = e.clientX;
        this.lastY = e.clientY;
        if (!item ||
            item.classList.contains('is-ghost') ||
            item.closest('[data-group-id]') !== this.host) {
            return;
        }
        var container = item.parentElement;
        var children = [].slice.apply(container.children);
        var idx = children.indexOf(item);
        if (this.ghost.parentElement !== container) {
            container.appendChild(this.ghost);
        }
        var rect = item.getBoundingClientRect();
        var isAfter = dy > 0 && e.clientY > rect.top + rect.height / 2;
        var gIdx = isAfter ? idx : idx - 1;
        var cgIdx = children.indexOf(this.ghost);
        if (gIdx !== cgIdx) {
            Animation_1.default.capture(container);
            if (gIdx === children.length - 1) {
                container.appendChild(this.ghost);
            }
            else {
                container.insertBefore(this.ghost, children[gIdx + 1]);
            }
            Animation_1.default.animateAll();
        }
    };
    QueryBuilder.prototype.handleDragDrop = function () {
        var onChange = this.props.onChange;
        var fromId = this.dragTarget.getAttribute('data-id');
        var toId = this.host.getAttribute('data-group-id');
        var children = [].slice.call(this.ghost.parentElement.children);
        var idx = children.indexOf(this.dragTarget);
        if (~idx) {
            children.splice(idx, 1);
        }
        var toIndex = children.indexOf(this.ghost);
        var value = this.props.value;
        var indexes = (0, helper_1.findTreeIndex)([value], function (item) { return item.id === fromId; });
        if (indexes) {
            var origin = (0, helper_1.getTree)([value], indexes.concat());
            value = (0, helper_1.spliceTree)([value], indexes, 1)[0];
            var indexes2 = (0, helper_1.findTreeIndex)([value], function (item) { return item.id === toId; });
            if (indexes2) {
                value = (0, helper_1.spliceTree)([value], indexes2.concat(toIndex), 0, origin)[0];
                onChange(value);
            }
        }
    };
    QueryBuilder.prototype.handleDragEnd = function (e) {
        var _a;
        var target = e.target;
        target.removeEventListener('dragend', this.handleDragEnd);
        document.body.removeEventListener('dragover', this.handleDragOver);
        document.body.removeEventListener('drop', this.handleDragDrop);
        this.dragTarget.classList.remove('is-dragging');
        // if (this.dragNextSibling) {
        //   this.dragTarget.parentElement!.insertBefore(
        //     this.dragTarget,
        //     this.dragNextSibling
        //   );
        // } else {
        //   this.dragTarget.parentElement!.appendChild(this.dragTarget);
        // }
        delete this.dragTarget;
        // delete this.dragNextSibling;
        (_a = this.ghost.parentElement) === null || _a === void 0 ? void 0 : _a.removeChild(this.ghost);
        delete this.ghost;
    };
    QueryBuilder.prototype.render = function () {
        var _a = this.props, cx = _a.classnames, fieldClassName = _a.fieldClassName, fields = _a.fields, funcs = _a.funcs, onChange = _a.onChange, value = _a.value, showNot = _a.showNot, showANDOR = _a.showANDOR, data = _a.data, disabled = _a.disabled, searchable = _a.searchable, builderMode = _a.builderMode, formula = _a.formula, popOverContainer = _a.popOverContainer, renderEtrValue = _a.renderEtrValue;
        var normalizedValue = Array.isArray(value === null || value === void 0 ? void 0 : value.children)
            ? (0, tslib_1.__assign)((0, tslib_1.__assign)({}, value), { children: (0, helper_1.mapTree)(value.children, function (value) {
                    if (value.id) {
                        return value;
                    }
                    return (0, tslib_1.__assign)((0, tslib_1.__assign)({}, value), { id: (0, helper_1.guid)() });
                }) }) : value;
        return (react_1.default.createElement(Group_1.default, { builderMode: builderMode, config: this.config, funcs: funcs || this.config.funcs, fields: fields || this.config.fields, value: normalizedValue, onChange: onChange, classnames: cx, fieldClassName: fieldClassName, removeable: false, onDragStart: this.handleDragStart, showANDOR: showANDOR, showNot: showNot, data: data, disabled: disabled, searchable: searchable, formula: formula, popOverContainer: popOverContainer, renderEtrValue: renderEtrValue }));
    };
    var _a, _b, _c;
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", [typeof (_a = typeof react_1.default !== "undefined" && react_1.default.DragEvent) === "function" ? _a : Object]),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], QueryBuilder.prototype, "handleDragStart", null);
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", [typeof (_b = typeof DragEvent !== "undefined" && DragEvent) === "function" ? _b : Object]),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], QueryBuilder.prototype, "handleDragOver", null);
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", []),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], QueryBuilder.prototype, "handleDragDrop", null);
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", [typeof (_c = typeof Event !== "undefined" && Event) === "function" ? _c : Object]),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], QueryBuilder.prototype, "handleDragEnd", null);
    return QueryBuilder;
}(react_1.default.Component));
exports.QueryBuilder = QueryBuilder;
exports.default = (0, theme_1.themeable)((0, locale_1.localeable)((0, uncontrollable_1.uncontrollable)(QueryBuilder, {
    value: 'onChange'
})));
//# sourceMappingURL=./components/condition-builder/index.js.map
