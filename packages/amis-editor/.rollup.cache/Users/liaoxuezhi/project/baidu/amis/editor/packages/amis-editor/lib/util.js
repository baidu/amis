import { __assign, __awaiter, __generator } from "tslib";
import ACTION_TYPE_TREE from './event-action/actions';
import { getActionConfigItemsMap } from './event-action/schema';
import { mapTree } from 'amis';
/**
 * 获取事件动作面板所需属性配置
 */
export var getEventControlConfig = function (manager, context) {
    var _a, _b, _c, _d;
    return ({
        actions: manager === null || manager === void 0 ? void 0 : manager.pluginActions,
        events: manager === null || manager === void 0 ? void 0 : manager.pluginEvents,
        getContextSchemas: function (id, withoutSuper) { return __awaiter(void 0, void 0, void 0, function () {
            var dataSchema;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, manager.getContextSchemas(id !== null && id !== void 0 ? id : context.id, withoutSuper)];
                    case 1:
                        dataSchema = _a.sent();
                        // 存在指定id时，只需要当前层上下文
                        if (id) {
                            return [2 /*return*/, dataSchema];
                        }
                        return [2 /*return*/, manager.dataSchema];
                }
            });
        }); },
        getComponents: function () {
            var _a, _b;
            return mapTree((_b = (_a = manager === null || manager === void 0 ? void 0 : manager.store) === null || _a === void 0 ? void 0 : _a.outline) !== null && _b !== void 0 ? _b : [], function (item) {
                var _a;
                var schema = (_a = manager === null || manager === void 0 ? void 0 : manager.store) === null || _a === void 0 ? void 0 : _a.getSchema(item.id);
                return {
                    id: item.id,
                    label: item.label,
                    value: schema.id || item.id,
                    type: schema.type,
                    schema: schema,
                    disabled: !!item.region,
                    children: item === null || item === void 0 ? void 0 : item.children
                };
            }, 1, true);
        },
        actionTree: ((_a = manager === null || manager === void 0 ? void 0 : manager.config.actionOptions) === null || _a === void 0 ? void 0 : _a.actionTreeGetter)
            ? (_b = manager === null || manager === void 0 ? void 0 : manager.config.actionOptions) === null || _b === void 0 ? void 0 : _b.actionTreeGetter(ACTION_TYPE_TREE)
            : ACTION_TYPE_TREE,
        actionConfigItemsMap: __assign(__assign({}, getActionConfigItemsMap(manager)), (_d = (_c = manager === null || manager === void 0 ? void 0 : manager.config.actionOptions) === null || _c === void 0 ? void 0 : _c.customActionGetter) === null || _d === void 0 ? void 0 : _d.call(_c, manager)),
        owner: '',
        addBroadcast: manager === null || manager === void 0 ? void 0 : manager.addBroadcast,
        removeBroadcast: manager === null || manager === void 0 ? void 0 : manager.removeBroadcast
    });
};
