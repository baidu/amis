/**
 * @description 生成不同的key
 */

class Key {
  private _lastKey: number;

  generate() {
    if (this._lastKey) {
      this._lastKey++;
    } else {
      this._lastKey = new Date().getTime();
    }
    return this._lastKey;
  }
}

export const tableKeyGenerator = new Key();

export const tableKey = '__id'; // __id ?

export interface TreeNode {
  children?: TreeNode[];
  [tableKey]?: number;
  [x: string]: any;
}

/**
 * 遍历树
 * @param callback item处理函数
 * @returns TreeNode[]
 */
export function traverseTreeWith(
  callback: (params: TreeNode) => TreeNode | void | TreeNode[]
) {
  const traversesTree: (items: TreeNode[]) => TreeNode[] = (
    items: TreeNode[]
  ) => {
    const newItems: TreeNode[] = [];

    for (const item of items) {
      let newItem = callback(item);
      if (typeof newItem === 'undefined') {
        // 过滤掉 callback 返回为空的
        item.children && traversesTree(item.children);
        continue;
      }
      if (newItem instanceof Array) {
        // callback 返回了 TreeNode[]
        newItem = newItem.map(node =>
          node.children
            ? {...node, children: traversesTree(node.children!)}
            : node
        );
        newItems.push(...(newItem as TreeNode[]));
      } else {
        // callback 返回了 TreeNode
        if (newItem.children) {
          newItem = {...newItem, children: traversesTree(newItem.children)};
        }
        newItems.push(newItem);
      }
    }
    return newItems;
  };

  return traversesTree;
}

export const generateTableItemsKey = traverseTreeWith(item => {
  if (!item[tableKey as keyof typeof item]) {
    return {
      [tableKey]: tableKeyGenerator.generate(),
      ...item
    };
  }
  return item;
});

export const copyItemFromOrigin = <T extends TreeNode>(originItem: T) => {
  return {
    ...originItem,
    [tableKey]: tableKeyGenerator.generate(),
    children: originItem.children
      ? generateTableItemsKey(originItem.children)
      : []
  };
};
