/**
 * from https://github.com/microsoft/vscode/blob/e587755905208e47725c5196539c4ca898255fe6/src/vs/base/common/map.ts
 */

import {LinkedMap, Touch} from './LinkedMap';

export class LRUCache<K, V> extends LinkedMap<K, V> {
  private _limit: number;
  private _ratio: number;

  constructor(limit: number, ratio: number = 1) {
    super();
    this._limit = limit;
    this._ratio = Math.min(Math.max(0, ratio), 1);
  }

  get limit(): number {
    return this._limit;
  }

  set limit(limit: number) {
    this._limit = limit;
    this.checkTrim();
  }

  get ratio(): number {
    return this._ratio;
  }

  set ratio(ratio: number) {
    this._ratio = Math.min(Math.max(0, ratio), 1);
    this.checkTrim();
  }

  override get(key: K, touch: Touch = Touch.AsNew): V | undefined {
    return super.get(key, touch);
  }

  peek(key: K): V | undefined {
    return super.get(key, Touch.None);
  }

  override set(key: K, value: V): this {
    super.set(key, value, Touch.AsNew);
    this.checkTrim();
    return this;
  }

  private checkTrim() {
    if (this.size > this._limit) {
      this.trimOld(Math.round(this._limit * this._ratio));
    }
  }
}
