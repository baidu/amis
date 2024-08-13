import VisitedCache from '../../src/utils/visitedCache';

describe('测试访问次数缓存store', () => {
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

  it('should update the least visited entry when an existing entry is set', () => {
    cache.set('a', 1);
    cache.set('b', 2);
    cache.set('c', 3);

    // Access 'b' to increase its visit count
    cache.get('b');

    cache.set('a', 10);

    expect(cache.get('a')).toBe(10);
    expect(cache.get('b')).toBe(2);
    expect(cache.get('c')).toBeUndefined();
  });

  it('should handle cache misses correctly', () => {
    expect(cache.get('non-existent-key')).toBeUndefined();
  });
});
