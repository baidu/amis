"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaginationWrapperRenderer = exports.PaginationWrapper = void 0;
var tslib_1 = require("tslib");
var react_1 = (0, tslib_1.__importDefault)(require("react"));
var factory_1 = require("../factory");
var pagination_1 = require("../store/pagination");
var PaginationWrapper = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(PaginationWrapper, _super);
    function PaginationWrapper(props) {
        var _this = _super.call(this, props) || this;
        props.store.syncProps(props, undefined, [
            'perPage',
            'mode',
            'inputName',
            'outputName'
        ]);
        return _this;
    }
    PaginationWrapper.prototype.componentDidUpdate = function (prevProps) {
        var store = this.props.store;
        store.syncProps(this.props, prevProps, [
            'perPage',
            'mode',
            'inputName',
            'outputName'
        ]);
    };
    PaginationWrapper.prototype.render = function () {
        var _a = this.props, position = _a.position, render = _a.render, store = _a.store, cx = _a.classnames, body = _a.body, __ = _a.translate;
        var pagination = position !== 'none'
            ? render('pager', {
                type: 'pagination'
            }, {
                activePage: store.page,
                lastPage: store.lastPage,
                mode: store.mode,
                onPageChange: store.switchTo,
                className: 'PaginationWrapper-pager'
            })
            : null;
        return (react_1.default.createElement("div", { className: cx('PaginationWrapper') },
            position === 'top' ? pagination : null,
            body ? (render('body', body, {
                data: store.locals
            })) : (react_1.default.createElement("span", null, __('PaginationWrapper.placeholder'))),
            position === 'bottom' ? pagination : null));
    };
    PaginationWrapper.defaultProps = {
        inputName: 'items',
        outputName: 'items',
        perPage: 10,
        position: 'top'
    };
    return PaginationWrapper;
}(react_1.default.Component));
exports.PaginationWrapper = PaginationWrapper;
var PaginationWrapperRenderer = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(PaginationWrapperRenderer, _super);
    function PaginationWrapperRenderer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    PaginationWrapperRenderer = (0, tslib_1.__decorate)([
        (0, factory_1.Renderer)({
            type: 'pagination-wrapper',
            storeType: pagination_1.PaginationStore.name
        })
    ], PaginationWrapperRenderer);
    return PaginationWrapperRenderer;
}(PaginationWrapper));
exports.PaginationWrapperRenderer = PaginationWrapperRenderer;
//# sourceMappingURL=./renderers/PaginationWrapper.js.map
