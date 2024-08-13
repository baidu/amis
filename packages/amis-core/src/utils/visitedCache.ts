/**
 * @description 缓存值的单元
 */
export type CacheEntry<V> = {
  value: V;
  visitCount: number;
};

/**
 * 自动清理访问次数最少key的Map，次数相同时优先淘汰旧项
 * 每次触发清理的计数基于容量的百分比
 * @class VisitedCache
 * @template K - 缓存key的类型
 * @template V - 缓存value的类型
 */
export default class VisitedCache<K, V> {
  private capacity: number;
  private cache: Map<K, CacheEntry<V>>;
  private visitCountOrder: number[] = [];
  private keyOrderMatrixForByCount: Record<number, K[]> = {};
  private releaseCount: number;

  /**
   *
   * @param capacity 容量
   * @param releasePercent 清理数量占容量百分比
   */
  constructor(capacity: number, releasePercent?: number) {
    this.capacity = capacity;
    this.cache = new Map();
    this.releaseCount = (this.capacity * (releasePercent || 1 / 8)) >> 0 || 1;
  }

  /**
   * 更新现存项目的缓存顺序
   * @param key
   * @param entry
   */
  private updateCacheEntryOrder(
    key: K,
    entry: CacheEntry<V>,
    nextVisitCount: number
  ) {
    const {visitCount: oldVisitCount} = entry;

    const oldKeyOrder = this.keyOrderMatrixForByCount[oldVisitCount];

    if (Array.isArray(oldKeyOrder)) {
      // 从key为旧访问次数的顺序数组中删除
      const oldKeyIndex = oldKeyOrder.indexOf(key);

      if (oldKeyIndex !== -1) {
        oldKeyOrder.splice(oldKeyIndex, 1);
      }
    }

    // 相同访问量，更新访问顺序
    this.keyOrderMatrixForByCount[nextVisitCount] = Array.isArray(
      this.keyOrderMatrixForByCount[nextVisitCount]
    )
      ? [...this.keyOrderMatrixForByCount[nextVisitCount], key]
      : [key];

    entry.visitCount = nextVisitCount;

    // 重新按照访问量排序
    this.visitCountOrder = [
      ...new Set([...this.visitCountOrder, nextVisitCount])
    ].sort((a, b) => a - b);
  }

  /**
   *
   * @param {K} key
   * @returns {(V | undefined)}
   */
  get(key: K): V | undefined {
    if (this.cache.has(key)) {
      const entry = this.cache.get(key);

      if (entry !== undefined) {
        const {visitCount} = entry;
        // 更新访问顺序
        this.updateCacheEntryOrder(key, entry, visitCount + 1);

        return entry.value;
      }
    }
    return undefined;
  }

  /**
   *
   * @param {K} key
   * @param {V} value
   */
  set(key: K, value: V): void {
    // 更新现存项的值和访问次数及新鲜度
    if (this.cache.has(key)) {
      const entry = this.cache.get(key);

      if (entry !== undefined) {
        const {visitCount} = entry;

        this.updateCacheEntryOrder(key, entry, visitCount + 1);

        entry.value = value;
      }
    } else {
      // 先进行清理
      if (this.cache.size === this.capacity) {
        // TODO 依据最大容量的1/10进行释放,试试效果
        const dynamicReleaseCount = this.releaseCount;

        // const dynamicReleaseCount =
        // 	(this.keyOrderMatrixForByCount[this.visitCountOrder[this.visitCountOrder.length - 1]].length / (this.capacity)) >>
        // 		0 || 1

        let findIndex = 0;
        let released = 0;

        while (
          released < dynamicReleaseCount &&
          findIndex <= this.visitCountOrder.length - 1
        ) {
          // 最少访问的次数
          const targetCount = this.visitCountOrder[findIndex];
          // 查看其中有没有项
          const targetKeyOrder = this.keyOrderMatrixForByCount[targetCount];

          if (!targetKeyOrder.length) {
            findIndex++;
          } else {
            while (
              targetKeyOrder.length > 0 &&
              released < dynamicReleaseCount
            ) {
              this.cache.delete(targetKeyOrder.shift()!);
              released++;
            }
          }
        }
      }

      const newEntry: CacheEntry<V> = {
        visitCount: 1,
        value
      };

      this.cache.set(key, newEntry);

      this.updateCacheEntryOrder(key, newEntry, 1);
    }
  }

  has(key: K): boolean {
    return this.cache.has(key);
  }
}
