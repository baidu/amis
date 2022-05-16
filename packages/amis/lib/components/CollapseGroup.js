"use strict";
/**
 * @file CollapseGroup
 * @description 折叠面板group
 * @author hongyang03
 */
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var react_1 = (0, tslib_1.__importDefault)(require("react"));
var theme_1 = require("../theme");
var CollapseGroup = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(CollapseGroup, _super);
    function CollapseGroup(props) {
        var _this = _super.call(this, props) || this;
        _this.getItems = function (children) {
            if (!Array.isArray(children)) {
                return children;
            }
            return children.map(function (child, index) {
                var props = child.props;
                var id = props.propKey || String(index);
                var collapsed = _this.state.activeKey.indexOf(id) === -1;
                return react_1.default.cloneElement(child, (0, tslib_1.__assign)((0, tslib_1.__assign)({}, props), { key: id, id: id, collapsed: collapsed, expandIcon: _this.props.expandIcon, propsUpdate: true, onCollapse: function (item, collapsed) {
                        return _this.collapseChange(item, collapsed);
                    } }));
            });
        };
        // 传入的activeKey会被自动转换为defaultActiveKey
        var activeKey = props.defaultActiveKey;
        if (!Array.isArray(activeKey)) {
            activeKey = activeKey ? [activeKey] : [];
        }
        if (props.accordion) {
            // 手风琴模式下只展开第一个元素
            activeKey = activeKey.length ? [activeKey[0]] : [];
        }
        _this.state = {
            activeKey: activeKey.map(function (key) { return String(key); })
        };
        return _this;
    }
    CollapseGroup.prototype.collapseChange = function (item, collapsed) {
        var activeKey = this.state.activeKey;
        if (collapsed) {
            if (this.props.accordion) {
                activeKey = [];
            }
            else {
                for (var i = 0; i < activeKey.length; i++) {
                    if (activeKey[i] === item.id) {
                        activeKey.splice(i, 1);
                        break;
                    }
                }
            }
        }
        else {
            if (this.props.accordion) {
                activeKey = [item.id];
            }
            else {
                activeKey.push(item.id);
            }
        }
        this.setState({
            activeKey: activeKey
        });
    };
    CollapseGroup.prototype.render = function () {
        var _a = this.props, cx = _a.classnames, className = _a.className, expandIconPosition = _a.expandIconPosition, children = _a.children;
        return (react_1.default.createElement("div", { className: cx("CollapseGroup", {
                'icon-position-right': expandIconPosition === 'right'
            }, className) }, this.getItems(children)));
    };
    CollapseGroup.defaultProps = {
        className: '',
        accordion: false,
        expandIconPosition: 'left'
    };
    return CollapseGroup;
}(react_1.default.Component));
exports.default = (0, theme_1.themeable)(CollapseGroup);
//# sourceMappingURL=./components/CollapseGroup.js.map
