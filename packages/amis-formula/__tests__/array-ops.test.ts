import {evaluate} from '../src';

describe('数组修改公式', () => {
  describe('ARRAYUPDATE', () => {
    test('更新指定索引，浅合并', () => {
      const result = evaluate(
        '${ARRAYUPDATE(arr, 1, {name: "bob2", extra: 1})}',
        {
          arr: [
            {id: 1, name: 'alice'},
            {id: 2, name: 'bob', keep: true}
          ]
        }
      );
      expect(result).toEqual([
        {id: 1, name: 'alice'},
        {id: 2, name: 'bob2', keep: true, extra: 1}
      ]);
    });

    test('索引越界返回原数组副本', () => {
      const input = [{id: 1}];
      const result = evaluate('${ARRAYUPDATE(arr, 2, {a: 1})}', {
        arr: input
      }) as any[];
      expect(result).toEqual(input);
      expect(result).not.toBe(input); // 返回副本
    });

    test('非对象更新被忽略', () => {
      const input = [{id: 1}];
      const result = evaluate('${ARRAYUPDATE(arr, 0, 123)}', {
        arr: input
      }) as any[];
      expect(result).toEqual(input);
    });
  });

  describe('ARRAYUPDATEBY', () => {
    test('按条件更新匹配元素', () => {
      const result = evaluate(
        '${ARRAYUPDATEBY(arr, item => item.status == "pending", {status: "done", flag: 1})}',
        {
          arr: [
            {id: 1, status: 'pending'},
            {id: 2, status: 'active'}
          ]
        }
      );
      expect(result).toEqual([
        {id: 1, status: 'done', flag: 1},
        {id: 2, status: 'active'}
      ]);
    });

    test('不匹配时返回原数组副本', () => {
      const input = [
        {id: 1, status: 'done'},
        {id: 2, status: 'active'}
      ];
      const result = evaluate(
        '${ARRAYUPDATEBY(arr, item => item.status == "pending", {status: "done"})}',
        {arr: input}
      ) as any[];
      expect(result).toEqual(input);
      expect(result).not.toBe(input);
    });

    test('非对象 updates 返回原数组副本', () => {
      const input = [{id: 1}];
      const result = evaluate(
        '${ARRAYUPDATEBY(arr, item => item.id == 1, 123)}',
        {arr: input}
      ) as any[];
      expect(result).toEqual(input);
    });
  });

  describe('组合使用', () => {
    test('ARRAYUPDATE + ARRAYUPDATEBY 组合', () => {
      const result = evaluate(
        '${ARRAYUPDATEBY(ARRAYUPDATE(arr, 0, {status: "old"}), item => item.id == 2, {status: "new"})}',
        {
          arr: [{id: 1}, {id: 2}]
        }
      );
      expect(result).toEqual([
        {id: 1, status: 'old'},
        {id: 2, status: 'new'}
      ]);
    });
  });
});
