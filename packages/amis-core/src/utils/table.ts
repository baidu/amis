/**
 * @description 针对 table 的特定场景
 */

import {guid} from './helper';

export const tableKey = '__id'; // __id ?

export interface TreeNode {
  children?: TreeNode[];
  __isPlaceholder?: true;
  [tableKey]?: string;
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

/**
 * 为 table 中的每一条数据增加 key
 */
export const generateTableItemsKey = traverseTreeWith(item => {
  if (!item[tableKey as keyof typeof item]) {
    return {
      [tableKey]: guid(),
      ...item
    };
  }
  return item;
});

/**
 * 复制元素
 */
export const copyItemFromOrigin = <T extends TreeNode>(originItem: T) => {
  return {
    ...originItem,
    [tableKey]: guid(),
    children: originItem.children
      ? generateTableItemsKey(originItem.children)
      : []
  };
};
