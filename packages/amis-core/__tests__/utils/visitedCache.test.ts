import VisitedCache from '../../src/utils/visitedCache';

describe('VisitedCache', () => {
  let cache: VisitedCache<string, number>;

  beforeEach(() => {
    cache = new VisitedCache<string, number>(5);
  });

  it('should set and get values correctly', () => {
    cache.set('a', 1);
    cache.set('b', 2);
    cache.set('c', 3);

    expect(cache.get('a')).toBe(1);
    expect(cache.get('b')).toBe(2);
    expect(cache.get('c')).toBe(3);
  });

  it('should evict the least visited entry when cache is full', () => {
    cache.set('a', 1);
    cache.set('b', 2);
    cache.set('c', 3);
    cache.set('d', 4);
    cache.set('e', 5);

    // Access 'a' to increase its visit count
    cache.get('a');

    cache.set('f', 6);

    expect(cache.get('a')).toBe(1);
    expect(cache.get('b')).toBeUndefined();
  });

  it('should handle cache misses correctly', () => {
    expect(cache.get('non-existent-key')).toBeUndefined();
  });

  it('should handle multiple entries with the same visit count', () => {
    cache.set('a', 1);
    cache.set('b', 2);
    cache.set('c', 3);
    cache.set('d', 4);
    cache.set('e', 5);

    // Access 'a', 'b', 'c' to make them have the same visit count
    cache.get('a');
    cache.get('b');
    cache.get('c');

    cache.set('f', 6);

    // 动态清理的个数为1，清理掉最少访问最旧的d项
    expect(cache.get('a')).toBe(1);
    expect(cache.get('b')).toBe(2);
    expect(cache.get('c')).toBe(3);
    expect(cache.get('d')).toBeUndefined();
    expect(cache.get('e')).toBe(5);
    expect(cache.get('f')).toBe(6);
  });

  it('should handle dynamic release count', () => {
    cache = new VisitedCache<string, number>(10, 1 / 5);
    // 释放数量为 10 * 1/5 >> 0 || 1 = 2

    cache.set('a', 1);
    cache.set('b', 2);
    cache.set('c', 3);
    cache.set('d', 4);
    cache.set('e', 5);
    cache.set('f', 6);
    cache.set('g', 7);
    cache.set('h', 8);
    cache.set('i', 9);
    cache.set('j', 10);

    // 提升除了a之外的访问次数
    cache.get('b');
    cache.get('c');
    cache.get('d');
    cache.get('e');
    cache.get('f');
    cache.get('g');
    cache.get('h');
    cache.get('i');
    cache.get('j');

    // 再次提升高b的访问次数
    cache.get('b');

    // 此时应该清理掉两项,a和c
    cache.set('k', 11);

    expect(cache.get('a')).toBeUndefined();
    expect(cache.get('b')).toBe(2);
    expect(cache.get('c')).toBeUndefined();
    expect(cache.get('d')).toBe(4);
    expect(cache.get('e')).toBe(5);
    expect(cache.get('f')).toBe(6);
    expect(cache.get('g')).toBe(7);
    expect(cache.get('h')).toBe(8);
    expect(cache.get('i')).toBe(9);
    expect(cache.get('j')).toBe(10);
    expect(cache.get('k')).toBe(11);
  });
});
