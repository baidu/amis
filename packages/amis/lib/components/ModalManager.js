"use strict";
/**
 * @file ModalManager
 * @description
 * @author fex
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeModal = exports.addModal = exports.currentModal = exports.current = void 0;
var tslib_1 = require("tslib");
var keycode_1 = (0, tslib_1.__importDefault)(require("keycode"));
var modals = [];
function current() {
    return modals.length;
}
exports.current = current;
function currentModal() {
    return modals[modals.length - 1];
}
exports.currentModal = currentModal;
function addModal(modal) {
    modals.push(modal);
}
exports.addModal = addModal;
function removeModal(modal) {
    modals = modals.filter(function (el) { return el !== modal; });
}
exports.removeModal = removeModal;
window.addEventListener('keydown', handleWindowKeyDown);
function handleWindowKeyDown(e) {
    var code = (0, keycode_1.default)(e);
    if (code !== 'esc') {
        return;
    }
    var modal = currentModal();
    if (!modal) {
        return;
    }
    var _a = modal.props, disabled = _a.disabled, closeOnEsc = _a.closeOnEsc;
    if (closeOnEsc && !disabled && !e.defaultPrevented) {
        modal.props.onHide(e);
    }
}
//# sourceMappingURL=./components/ModalManager.js.map
