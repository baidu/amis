"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.autobindMethod = exports.bind = void 0;
var defineProperty = Object.defineProperty, getPrototypeOf = Object.getPrototypeOf;
function bind(fn, context) {
    if (fn.bind) {
        return fn.bind(context);
    }
    else {
        return function __autobind__() {
            return fn.apply(context, arguments);
        };
    }
}
exports.bind = bind;
var mapStore;
function getBoundSuper(obj, fn) {
    if (typeof WeakMap === 'undefined') {
        throw new Error("Using @autobind on ".concat(fn.name, "() requires WeakMap support due to its use of super.").concat(fn.name, "()\n        See https://github.com/jayphelps/core-decorators.js/issues/20"));
    }
    if (!mapStore) {
        mapStore = new WeakMap();
    }
    if (mapStore.has(obj) === false) {
        mapStore.set(obj, new WeakMap());
    }
    var superStore = mapStore.get(obj);
    if (superStore.has(fn) === false) {
        superStore.set(fn, bind(fn, obj));
    }
    return superStore.get(fn);
}
function createDefaultSetter(key) {
    return function set(newValue) {
        Object.defineProperty(this, key, {
            configurable: true,
            writable: true,
            // IS enumerable when reassigned by the outside word
            enumerable: true,
            value: newValue
        });
        return newValue;
    };
}
function autobindMethod(target, key, _a) {
    var fn = _a.value, configurable = _a.configurable, enumerable = _a.enumerable;
    if (typeof fn !== 'function') {
        throw new SyntaxError("@autobind can only be used on functions, not: ".concat(fn));
    }
    var constructor = target.constructor;
    return {
        configurable: configurable,
        enumerable: enumerable,
        get: function () {
            // Class.prototype.key lookup
            // Someone accesses the property directly on the prototype on which it is
            // actually defined on, i.e. Class.prototype.hasOwnProperty(key)
            if (this === target) {
                return fn;
            }
            // Class.prototype.key lookup
            // Someone accesses the property directly on a prototype but it was found
            // up the chain, not defined directly on it
            // i.e. Class.prototype.hasOwnProperty(key) == false && key in Class.prototype
            if (this.constructor !== constructor &&
                getPrototypeOf(this).constructor === constructor) {
                return fn;
            }
            // Autobound method calling super.sameMethod() which is also autobound and so on.
            if (this.constructor !== constructor &&
                key in this.constructor.prototype) {
                return getBoundSuper(this, fn);
            }
            var boundFn = bind(fn, this);
            defineProperty(this, key, {
                configurable: true,
                writable: true,
                // NOT enumerable when it's a bound method
                enumerable: false,
                value: boundFn
            });
            return boundFn;
        },
        set: createDefaultSetter(key)
    };
}
exports.autobindMethod = autobindMethod;
//# sourceMappingURL=./utils/autobind.js.map
