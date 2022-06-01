import find from 'lodash/find';
import findIndex from 'lodash/findIndex';

export class SimpleMap<V = any, K = any> {
  private readonly list: Array<{
    key: K;
    value: V;
  }> = [];

  has(key: K) {
    const resolved = find(this.list, item => item.key === key);
    return !!resolved;
  }

  set(key: K, value: V) {
    this.list.push({
      key,
      value
    });
  }

  get(key: K) {
    const resolved = find(this.list, item => item.key === key);
    return resolved ? resolved.value : null;
  }

  delete(key: K) {
    const idx = findIndex(this.list, item => item.key === key);
    ~idx && this.list.splice(idx, 1);
  }

  dispose() {
    this.list.splice(0, this.list.length);
  }
}
