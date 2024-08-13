/**
 * @description 缓存值的单元
 */
export type CacheEntry<V> = {
  value: V;
  visitCount: number;
};

/**
 * 自动清理访问次数最少key的Map
 * //TODO 考虑上次访问时间？
 * @class CombinedCache
 * @template K - 缓存key的类型
 * @template V - 缓存value的类型
 */
export default class CombinedCache<K, V> {
  private capacity: number;
  private cache: Map<K, CacheEntry<V>>;
  private leastVisitedKey: K | undefined;
  private leastVisitedCount: number = Infinity;

  /**
   * Creates an instance of CombinedCache
   * @param {number} capacity - 最大缓存容量
   */
  constructor(capacity: number) {
    this.capacity = capacity;
    this.cache = new Map();
  }

  /**
   * 从Map中获取value，并更新访问次数与最少访问项
   * @param {K} key
   * @returns {(V | undefined)}
   */
  get(key: K): V | undefined {
    if (this.cache.has(key)) {
      const entry = this.cache.get(key)!;
      this.cache.delete(key);
      this.cache.set(key, entry);
      entry.visitCount++;

      if (entry.visitCount < this.leastVisitedCount) {
        this.leastVisitedKey = key;
        this.leastVisitedCount = entry.visitCount;
      }

      return entry.value;
    }
    return undefined;
  }

  /**
   * @param {K} key
   * @param {V} value
   */
  set(key: K, value: V): void {
    if (this.cache.has(key)) {
      const entry = this.cache.get(key)!;
      this.cache.delete(key);
      entry.value = value;
      entry.visitCount++;

      // Update the least visited entry
      if (entry.visitCount < this.leastVisitedCount) {
        this.leastVisitedKey = key;
        this.leastVisitedCount = entry.visitCount;
      }

      this.cache.set(key, entry);
    } else {
      if (this.cache.size === this.capacity) {
        // 删除最少访问项
        if (this.leastVisitedKey) {
          this.cache.delete(this.leastVisitedKey);
        }
      }

      this.cache.set(key, {value, visitCount: 1});

      // 更新最少访问的key及次数
      this.leastVisitedKey = key;
      this.leastVisitedCount = 1;
    }
  }

  has(key: K): boolean {
    return this.cache.has(key);
  }
}
