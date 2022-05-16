"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ModalStore = void 0;
var service_1 = require("./service");
var mobx_state_tree_1 = require("mobx-state-tree");
var helper_1 = require("../utils/helper");
exports.ModalStore = service_1.ServiceStore.named('ModalStore')
    .props({
    form: mobx_state_tree_1.types.frozen(),
    entered: false,
    resizeCoord: 0,
    schema: mobx_state_tree_1.types.frozen()
})
    .views(function (self) {
    return {
        get formData() {
            return (0, helper_1.createObject)(self.data, self.form);
        }
    };
})
    .actions(function (self) {
    return {
        setEntered: function (value) {
            self.entered = value;
        },
        setFormData: function (obj) {
            self.form = obj;
        },
        reset: function () {
            self.form = {};
            self.reInitData({}, true);
        },
        setResizeCoord: function (value) {
            self.resizeCoord = value;
        },
        setSchema: function (schema) {
            if (schema && schema.then) {
                schema.then(function (value) { return (0, mobx_state_tree_1.isAlive)(self) && self.setSchema(value); });
                return;
            }
            self.schema = schema;
        }
    };
});
//# sourceMappingURL=./store/modal.js.map
