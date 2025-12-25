import {evaluate, parse} from '../src';

describe('对象操作函数', () => {
  // ============ KEYS 测试 ============
  describe('KEYS - 获取对象的所有属性名', () => {
    test('获取普通对象的属性名', () => {
      expect(
        evaluate('${KEYS(obj)}', {
          obj: {name: 'alice', age: 18, email: 'a@b.com'}
        })
      ).toEqual(['name', 'age', 'email']);
    });

    test('获取空对象的属性名', () => {
      expect(
        evaluate('${KEYS(obj)}', {
          obj: {}
        })
      ).toEqual([]);
    });

    test('非对象返回空数组', () => {
      expect(
        evaluate('${KEYS(arr)}', {
          arr: [1, 2, 3]
        })
      ).toEqual([]);
    });

    test('null 返回空数组', () => {
      expect(evaluate('${KEYS(null)}', {})).toEqual([]);
    });
  });

  // ============ VALUES 测试 ============
  describe('VALUES - 获取对象的所有属性值', () => {
    test('获取普通对象的属性值', () => {
      expect(
        evaluate('${VALUES(obj)}', {
          obj: {name: 'alice', age: 18}
        })
      ).toEqual(['alice', 18]);
    });

    test('获取空对象的属性值', () => {
      expect(
        evaluate('${VALUES(obj)}', {
          obj: {}
        })
      ).toEqual([]);
    });

    test('值为不同类型', () => {
      expect(
        evaluate('${VALUES(obj)}', {
          obj: {str: 'hello', num: 42, bool: true, nil: null}
        })
      ).toEqual(['hello', 42, true, null]);
    });
  });

  // ============ ENTRIES 测试 ============
  describe('ENTRIES - 获取对象的键值对数组', () => {
    test('获取普通对象的键值对', () => {
      expect(
        evaluate('${ENTRIES(obj)}', {
          obj: {name: 'alice', age: 18}
        })
      ).toEqual([
        ['name', 'alice'],
        ['age', 18]
      ]);
    });

    test('获取空对象的键值对', () => {
      expect(
        evaluate('${ENTRIES(obj)}', {
          obj: {}
        })
      ).toEqual([]);
    });

    test('键值对包含复杂值', () => {
      const result = evaluate('${ENTRIES(obj)}', {
        obj: {a: [1, 2], b: {x: 1}}
      });
      expect(result).toEqual([
        ['a', [1, 2]],
        ['b', {x: 1}]
      ]);
    });
  });

  // ============ PICK 测试 ============
  describe('PICK - 从对象中选择指定属性', () => {
    test('选择单个属性', () => {
      expect(
        evaluate('${PICK(obj, "name")}', {
          obj: {name: 'alice', age: 18, email: 'a@b.com'}
        })
      ).toEqual({name: 'alice'});
    });

    test('选择多个属性', () => {
      expect(
        evaluate('${PICK(obj, "name", "age")}', {
          obj: {name: 'alice', age: 18, email: 'a@b.com'}
        })
      ).toEqual({name: 'alice', age: 18});
    });

    test('选择不存在的属性被忽略', () => {
      expect(
        evaluate('${PICK(obj, "name", "phone")}', {
          obj: {name: 'alice', age: 18}
        })
      ).toEqual({name: 'alice'});
    });

    test('空对象返回空对象', () => {
      expect(
        evaluate('${PICK(obj, "name")}', {
          obj: {}
        })
      ).toEqual({});
    });

    test('非对象返回空对象', () => {
      expect(evaluate('${PICK(null, "name")}', {})).toEqual({});
    });
  });

  // ============ OMIT 测试 ============
  describe('OMIT - 从对象中排除指定属性', () => {
    test('排除单个属性', () => {
      expect(
        evaluate('${OMIT(obj, "email")}', {
          obj: {name: 'alice', age: 18, email: 'a@b.com'}
        })
      ).toEqual({name: 'alice', age: 18});
    });

    test('排除多个属性', () => {
      expect(
        evaluate('${OMIT(obj, "password", "token")}', {
          obj: {name: 'alice', password: '123', token: 'abc', email: 'a@b.com'}
        })
      ).toEqual({name: 'alice', email: 'a@b.com'});
    });

    test('排除不存在的属性', () => {
      expect(
        evaluate('${OMIT(obj, "phone")}', {
          obj: {name: 'alice', age: 18}
        })
      ).toEqual({name: 'alice', age: 18});
    });

    test('排除所有属性', () => {
      expect(
        evaluate('${OMIT(obj, "name", "age")}', {
          obj: {name: 'alice', age: 18}
        })
      ).toEqual({});
    });
  });

  // ============ MERGE 测试 ============
  describe('MERGE - 合并多个对象', () => {
    test('合并两个对象', () => {
      expect(
        evaluate('${MERGE(obj1, obj2)}', {
          obj1: {a: 1, b: 2},
          obj2: {c: 3}
        })
      ).toEqual({a: 1, b: 2, c: 3});
    });

    test('后者覆盖前者', () => {
      expect(
        evaluate('${MERGE(obj1, obj2)}', {
          obj1: {a: 1, b: 2},
          obj2: {a: 10}
        })
      ).toEqual({a: 10, b: 2});
    });

    test('合并多个对象', () => {
      expect(
        evaluate('${MERGE(obj1, obj2, obj3)}', {
          obj1: {a: 1},
          obj2: {b: 2},
          obj3: {c: 3}
        })
      ).toEqual({a: 1, b: 2, c: 3});
    });

    test('跳过非对象', () => {
      expect(
        evaluate('${MERGE(obj1, null, obj2)}', {
          obj1: {a: 1},
          obj2: {b: 2}
        })
      ).toEqual({a: 1, b: 2});
    });

    test('空调用返回空对象', () => {
      expect(evaluate('${MERGE()}', {})).toEqual({});
    });
  });

  // ============ MAPVALUES 测试 ============
  describe('MAPVALUES - 转换对象值', () => {
    test('简单的值转换', () => {
      expect(
        evaluate('${MAPVALUES(obj, item => item * 2)}', {
          obj: {a: 1, b: 2, c: 3}
        })
      ).toEqual({a: 2, b: 4, c: 6});
    });

    test('字符串转换', () => {
      expect(
        evaluate('${MAPVALUES(obj, item => UPPER(item))}', {
          obj: {name: 'alice', city: 'beijing'}
        })
      ).toEqual({name: 'ALICE', city: 'BEIJING'});
    });

    test('空对象', () => {
      expect(
        evaluate('${MAPVALUES(obj, item => item * 2)}', {
          obj: {}
        })
      ).toEqual({});
    });

    test('访问键和对象参数', () => {
      expect(
        evaluate('${MAPVALUES(obj, (v, k) => k)}', {
          obj: {a: 1, b: 2}
        })
      ).toEqual({a: 'a', b: 'b'});
    });

    test('非对象返回空对象', () => {
      expect(evaluate('${MAPVALUES(null, item => item)}', {})).toEqual({});
    });
  });

  // ============ HASKEY 测试 ============
  describe('HASKEY - 检查对象是否包含属性', () => {
    test('属性存在返回 true', () => {
      expect(
        evaluate('${HASKEY(obj, "name")}', {
          obj: {name: 'alice', age: 18}
        })
      ).toBe(true);
    });

    test('属性不存在返回 false', () => {
      expect(
        evaluate('${HASKEY(obj, "phone")}', {
          obj: {name: 'alice', age: 18}
        })
      ).toBe(false);
    });

    test('属性值为 null 仍返回 true', () => {
      expect(
        evaluate('${HASKEY(obj, "phone")}', {
          obj: {name: 'alice', phone: null}
        })
      ).toBe(true);
    });

    test('非对象返回 false', () => {
      expect(
        evaluate('${HASKEY(arr, "name")}', {
          arr: [1, 2, 3]
        })
      ).toBe(false);
    });
  });

  // ============ GROUPBY 测试 ============
  describe('GROUPBY - 按属性值分组', () => {
    test('按字符串属性分组', () => {
      expect(
        evaluate('${GROUPBY(items, "type")}', {
          items: [
            {type: 'a', val: 1},
            {type: 'a', val: 2},
            {type: 'b', val: 3}
          ]
        })
      ).toEqual({
        a: [
          {type: 'a', val: 1},
          {type: 'a', val: 2}
        ],
        b: [{type: 'b', val: 3}]
      });
    });

    test('按箭头函数分组', () => {
      expect(
        evaluate('${GROUPBY(items, item => item.val > 1 ? "big" : "small")}', {
          items: [{val: 1}, {val: 2}, {val: 3}]
        })
      ).toEqual({
        small: [{val: 1}],
        big: [{val: 2}, {val: 3}]
      });
    });

    test('空数组返回空对象', () => {
      expect(
        evaluate('${GROUPBY(items, "type")}', {
          items: []
        })
      ).toEqual({});
    });

    test('非数组返回空对象', () => {
      expect(evaluate('${GROUPBY(null, "type")}', {})).toEqual({});
    });
  });

  // ============ INDEXBY 测试 ============
  describe('INDEXBY - 数组转对象索引', () => {
    test('按字符串属性索引', () => {
      expect(
        evaluate('${INDEXBY(items, "id")}', {
          items: [
            {id: 1, name: 'alice'},
            {id: 2, name: 'bob'},
            {id: 3, name: 'charlie'}
          ]
        })
      ).toEqual({
        1: {id: 1, name: 'alice'},
        2: {id: 2, name: 'bob'},
        3: {id: 3, name: 'charlie'}
      });
    });

    test('按箭头函数索引', () => {
      expect(
        evaluate('${INDEXBY(items, item => item.code)}', {
          items: [
            {code: 'A', name: 'alice'},
            {code: 'B', name: 'bob'}
          ]
        })
      ).toEqual({
        A: {code: 'A', name: 'alice'},
        B: {code: 'B', name: 'bob'}
      });
    });

    test('重复键时后者覆盖前者', () => {
      expect(
        evaluate('${INDEXBY(items, "type")}', {
          items: [
            {type: 'a', val: 1},
            {type: 'a', val: 2}
          ]
        })
      ).toEqual({
        a: {type: 'a', val: 2}
      });
    });

    test('空数组返回空对象', () => {
      expect(
        evaluate('${INDEXBY(items, "id")}', {
          items: []
        })
      ).toEqual({});
    });
  });

  // ============ DEFAULTS 测试 ============
  describe('DEFAULTS - 设置默认值', () => {
    test('原对象有值，保留原值', () => {
      expect(
        evaluate('${DEFAULTS(obj, defaults)}', {
          obj: {a: 1},
          defaults: {a: 10, b: 2}
        })
      ).toEqual({a: 1, b: 2});
    });

    test('原对象缺少属性，使用默认值', () => {
      expect(
        evaluate('${DEFAULTS(obj, defaults)}', {
          obj: {},
          defaults: {status: 'pending', priority: 'normal'}
        })
      ).toEqual({status: 'pending', priority: 'normal'});
    });

    test('原对象属性为 undefined，使用默认值', () => {
      expect(
        evaluate('${DEFAULTS(obj, defaults)}', {
          obj: {a: undefined},
          defaults: {a: 10}
        })
      ).toEqual({a: 10});
    });

    test('原对象属性为 null，保留 null', () => {
      expect(
        evaluate('${DEFAULTS(obj, defaults)}', {
          obj: {a: null},
          defaults: {a: 10}
        })
      ).toEqual({a: null});
    });

    test('多个默认对象', () => {
      expect(
        evaluate('${DEFAULTS(obj, def1, def2)}', {
          obj: {a: 1},
          def1: {b: 2, c: 3},
          def2: {c: 30, d: 4}
        })
      ).toEqual({a: 1, b: 2, c: 3, d: 4});
    });

    test('原对象为空对象', () => {
      expect(
        evaluate('${DEFAULTS(obj, defaults)}', {
          obj: {},
          defaults: {name: 'default', age: 0}
        })
      ).toEqual({name: 'default', age: 0});
    });

    test('非对象返回默认值', () => {
      expect(
        evaluate('${DEFAULTS(null, defaults)}', {
          defaults: {a: 1}
        })
      ).toEqual({a: 1});
    });
  });

  // ============ INVERT 测试 ============
  describe('INVERT - 反转对象键值', () => {
    test('简单的键值反转', () => {
      expect(
        evaluate('${INVERT(obj)}', {
          obj: {name: 'alice', city: 'beijing'}
        })
      ).toEqual({alice: 'name', beijing: 'city'});
    });

    test('值为数字的反转', () => {
      expect(
        evaluate('${INVERT(obj)}', {
          obj: {a: 1, b: 2, c: 3}
        })
      ).toEqual({1: 'a', 2: 'b', 3: 'c'});
    });

    test('空对象返回空对象', () => {
      expect(
        evaluate('${INVERT(obj)}', {
          obj: {}
        })
      ).toEqual({});
    });

    test('非对象返回空对象', () => {
      expect(evaluate('${INVERT(null)}', {})).toEqual({});
    });

    test('重复值时后者覆盖前者', () => {
      expect(
        evaluate('${INVERT(obj)}', {
          obj: {a: 'same', b: 'same'}
        })
      ).toEqual({same: 'b'});
    });
  });

  // ============ FROMTUPLE 测试 ============
  describe('FROMTUPLE - 从键值对数组创建对象', () => {
    test('标准的键值对数组', () => {
      expect(
        evaluate('${FROMTUPLE(entries)}', {
          entries: [
            ['a', 1],
            ['b', 2],
            ['c', 3]
          ]
        })
      ).toEqual({a: 1, b: 2, c: 3});
    });

    test('混合数据类型的值', () => {
      expect(
        evaluate('${FROMTUPLE(entries)}', {
          entries: [
            ['str', 'hello'],
            ['num', 42],
            ['bool', true],
            ['null', null],
            ['arr', [1, 2]]
          ]
        })
      ).toEqual({
        str: 'hello',
        num: 42,
        bool: true,
        null: null,
        arr: [1, 2]
      });
    });

    test('空数组返回空对象', () => {
      expect(
        evaluate('${FROMTUPLE(entries)}', {
          entries: []
        })
      ).toEqual({});
    });

    test('非数组返回空对象', () => {
      expect(evaluate('${FROMTUPLE(null)}', {})).toEqual({});
    });

    test('忽略长度不足的项', () => {
      expect(
        evaluate('${FROMTUPLE(entries)}', {
          entries: [['a', 1], ['b'], ['c', 3]]
        })
      ).toEqual({a: 1, c: 3});
    });

    test('键值对超过两个元素时只取前两个', () => {
      expect(
        evaluate('${FROMTUPLE(entries)}', {
          entries: [
            ['a', 1, 'extra'],
            ['b', 2]
          ]
        })
      ).toEqual({a: 1, b: 2});
    });

    test('与 ENTRIES 互为逆操作', () => {
      const obj = {name: 'alice', age: 18};
      const entries = evaluate('${ENTRIES(obj)}', {obj});
      const result = evaluate('${FROMTUPLE(entries)}', {entries});
      expect(result).toEqual(obj);
    });
  });

  // ============ 对象字面量展开 =============
  describe('对象字面量展开', () => {
    test('支持展开合并并新增属性', () => {
      expect(
        evaluate('${{...origin, newKey: 123}}', {
          origin: {a: 1, b: 2}
        })
      ).toEqual({a: 1, b: 2, newKey: 123});
    });

    test('后续字面量属性覆盖展开值', () => {
      expect(
        evaluate('${{...origin, a: 10}}', {
          origin: {a: 1, b: 2}
        })
      ).toEqual({a: 10, b: 2});
    });

    test('展开覆盖先前的字面量属性', () => {
      expect(
        evaluate('${{a: 1, ...origin}}', {
          origin: {a: 2, b: 3}
        })
      ).toEqual({a: 2, b: 3});
    });

    test('多次展开按顺序合并', () => {
      expect(
        evaluate('${{...first, ...second, c: 3}}', {
          first: {a: 1, same: 1},
          second: {same: 2, b: 2}
        })
      ).toEqual({a: 1, same: 2, b: 2, c: 3});
    });

    test('展开非对象时忽略', () => {
      expect(
        evaluate('${{...invalid, a: 1}}', {
          invalid: null
        })
      ).toEqual({a: 1});
    });
  });

  // ============ 组合使用测试 ============
  describe('函数组合使用', () => {
    test('ENTRIES + FROMTUPLE', () => {
      const result = evaluate('${FROMTUPLE(ENTRIES(obj))}', {
        obj: {a: 1, b: 2, c: 3}
      });
      expect(result).toEqual({a: 1, b: 2, c: 3});
    });

    test('PICK + MERGE', () => {
      expect(
        evaluate('${MERGE(PICK(obj1, "a", "b"), PICK(obj2, "c"))}', {
          obj1: {a: 1, b: 2, x: 10},
          obj2: {c: 3, y: 20}
        })
      ).toEqual({a: 1, b: 2, c: 3});
    });

    test('GROUPBY + MAPVALUES', () => {
      expect(
        evaluate('${MAPVALUES(GROUPBY(items, "type"), arr => COUNT(arr))}', {
          items: [
            {type: 'a', val: 1},
            {type: 'a', val: 2},
            {type: 'b', val: 3}
          ]
        })
      ).toEqual({a: 2, b: 1});
    });

    test('OMIT + DEFAULTS + MERGE', () => {
      expect(
        evaluate(
          '${MERGE(OMIT(user, "password"), DEFAULTS(config, {role: "user"}))}',
          {
            user: {name: 'alice', age: 18, password: '123'},
            config: {role: 'admin'}
          }
        )
      ).toEqual({name: 'alice', age: 18, role: 'admin'});
    });

    test('INDEXBY + 访问元素', () => {
      const result = evaluate('${INDEXBY(users, "id")[2].name}', {
        users: [
          {id: 1, name: 'alice'},
          {id: 2, name: 'bob'},
          {id: 3, name: 'charlie'}
        ]
      });
      expect(result).toBe('bob');
    });
  });

  // ============ 边界条件测试 ============
  describe('边界条件', () => {
    test('对象包含特殊属性名', () => {
      const keys = evaluate('${KEYS(obj)}', {
        obj: {
          __proto__: 1,
          constructor: 2,
          toString: 3
        }
      });
      // Object.keys() 返回对象自身的可枚举属性
      expect(keys).toContain('constructor');
      expect(keys).toContain('toString');
    });

    test('对象值为函数（应保留引用）', () => {
      const fn = () => 'test';
      const result = evaluate('${VALUES(obj)}', {
        obj: {callback: fn}
      });
      expect(result[0]).toBe(fn);
    });

    test('大对象性能', () => {
      const largeObj: any = {};
      for (let i = 0; i < 1000; i++) {
        largeObj[`key${i}`] = i;
      }
      const start = Date.now();
      const keys = evaluate('${KEYS(obj)}', {obj: largeObj});
      const duration = Date.now() - start;
      expect(keys.length).toBe(1000);
      expect(duration).toBeLessThan(100); // 应该快速完成
    });

    test('嵌套对象（浅操作）', () => {
      const result = evaluate('${MERGE(obj1, obj2)}', {
        obj1: {a: {x: 1}},
        obj2: {a: {y: 2}}
      });
      // MERGE 是浅合并，所以 a 会被完全覆盖
      expect(result).toEqual({a: {y: 2}});
    });
  });
});
