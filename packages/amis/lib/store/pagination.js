"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaginationStore = void 0;
var helper_1 = require("../utils/helper");
var tpl_builtin_1 = require("../utils/tpl-builtin");
var iRenderer_1 = require("./iRenderer");
exports.PaginationStore = iRenderer_1.iRendererStore
    .named('PaginationStore')
    .props({
    page: 1,
    perPage: 10,
    inputName: '',
    outputName: '',
    mode: 'normal'
})
    .views(function (self) { return ({
    get inputItems() {
        var items = (0, tpl_builtin_1.resolveVariable)(self.inputName || 'items', self.data);
        if (!Array.isArray(items)) {
            return [];
        }
        return items;
    },
    get locals() {
        var _a;
        var skip = (self.page - 1) * self.perPage;
        return (0, helper_1.createObject)(self.data, (_a = {
                currentPage: self.page,
                lastPage: this.lastPage
            },
            _a[self.outputName || 'items'] = this.inputItems.slice(skip, skip + self.perPage),
            _a));
    },
    get lastPage() {
        return Math.ceil(this.inputItems.length / self.perPage);
    }
}); })
    .actions(function (self) { return ({
    switchTo: function (page, perPage) {
        self.page = page;
        if (typeof perPage === 'number') {
            self.perPage = perPage;
        }
    }
}); });
//# sourceMappingURL=./store/pagination.js.map
