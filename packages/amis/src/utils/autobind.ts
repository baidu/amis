const {defineProperty, getPrototypeOf} = Object;

export function bind(fn: Function, context: any) {
  if (fn.bind) {
    return fn.bind(context);
  } else {
    return function __autobind__() {
      return fn.apply(context, arguments);
    };
  }
}

let mapStore: WeakMap<Object, any>;
function getBoundSuper(obj: Object, fn: Function) {
  if (typeof WeakMap === 'undefined') {
    throw new Error(
      `Using @autobind on ${fn.name}() requires WeakMap support due to its use of super.${fn.name}()
        See https://github.com/jayphelps/core-decorators.js/issues/20`
    );
  }

  if (!mapStore) {
    mapStore = new WeakMap();
  }

  if (mapStore.has(obj) === false) {
    mapStore.set(obj, new WeakMap());
  }

  const superStore = mapStore.get(obj);

  if (superStore.has(fn) === false) {
    superStore.set(fn, bind(fn, obj));
  }

  return superStore.get(fn);
}

function createDefaultSetter(key: string) {
  return function set(this: any, newValue: any) {
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

export function autobindMethod(
  target: Object,
  key: string,
  {value: fn, configurable, enumerable}: TypedPropertyDescriptor<Function>
) {
  if (typeof fn !== 'function') {
    throw new SyntaxError(
      `@autobind can only be used on functions, not: ${fn}`
    );
  }

  const {constructor} = target;

  return {
    configurable,
    enumerable,

    get() {
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
      if (
        this.constructor !== constructor &&
        getPrototypeOf(this).constructor === constructor
      ) {
        return fn;
      }

      // Autobound method calling super.sameMethod() which is also autobound and so on.
      if (
        this.constructor !== constructor &&
        key in this.constructor.prototype
      ) {
        return getBoundSuper(this, fn);
      }

      const boundFn = bind(fn, this);

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
