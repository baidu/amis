import {findLastIndex} from 'lodash';
import {
  BaseEventContext,
  InsertEventContext,
  MoveEventContext
} from '../plugin';
import {LayoutInterface} from './interface';

export default class FlexLayout implements LayoutInterface {
  beforeInsert(context: InsertEventContext, store: any) {
    const {isMobile} = store;
    const body = [...context.schema.body];
    let row = 0;
    if (body?.length) {
      const beforeId = context.beforeId;
      const beforeNodeIndex = body.findIndex(
        (item: any) => item.$$id === beforeId
      );
      const beforeNode = body[beforeNodeIndex] || body[body.length - 1];
      const beforeRow = beforeNode?.row;
      const position = context.dragInfo?.position || 'bottom';
      row = beforeRow; // left、bottom、top使用beforeRow，bottom、top后续行需要加1

      if (position === 'right') {
        const preNode = body[beforeNodeIndex - 1];
        // 如果前一个节点的row和beforeRow不一样，需要减1
        if (preNode && preNode.row !== beforeRow) {
          row = beforeRow - 1;
        }
      }
      if (position === 'bottom') {
        if (beforeNodeIndex < 0) {
          row = beforeRow + 1;
        }
      }
    }

    return {
      ...context,
      data: {
        ...context.data,
        row
      },
      schema: {
        ...context.schema,
        body
      }
    };
  }

  afterInsert(context: InsertEventContext, store: any) {
    const {isMobile} = store;
    const position = context.dragInfo?.position || 'bottom';
    const currentIndex = context.regionList.findIndex(
      (item: any) => item.$$id === context.data.$$id
    );
    const regionList = [...context.regionList];
    if (position === 'top' || position === 'bottom') {
      if (isMobile) {
        const body = context.schema.body;
        //  const currentRow = regionList[currentIndex].row;
        const preBeforeIndex = body.findIndex(
          (item: any) => item.$$id === context.beforeId
        );
        const preBeforeRow = body[preBeforeIndex]?.row;
        // 插入到了一行最后一个元素的后边，所以该元素独占用一行，后续元素的row都加1
        if (preBeforeRow !== body[preBeforeIndex - 1]?.row) {
          for (let i = currentIndex + 1; i < regionList.length; i++) {
            regionList[i] = {
              ...regionList[i],
              row: regionList[i].row + 1
            };
          }
        } else {
          // 插入到了一行的中间，这一行的最后一个元素的row加1，后续元素的row都加1
          const lastIndex = findLastIndex(
            regionList,
            (item: any) => item.row === preBeforeRow
          );
          for (let i = lastIndex; i < regionList.length; i++) {
            regionList[i] = {
              ...regionList[i],
              row: regionList[i].row + 1
            };
          }
        }
      } else {
        for (let i = currentIndex + 1; i < regionList.length; i++) {
          regionList[i] = {
            ...regionList[i],
            row: regionList[i].row + 1
          };
        }
      }
    }
    return {
      ...context,
      regionList
    };
  }

  afterMove(context: MoveEventContext, store: any) {
    const {isMobile} = store;
    const position = context.dragInfo?.position;
    const body = context.schema.body;
    const preCurrentIndex = body.findIndex(
      (item: any) => item.$$id === context.sourceId
    );

    // 如果是最后一个元素往自己的上边移动，不做处理
    if (
      position === 'top' &&
      preCurrentIndex === body.length - 1 &&
      !context.beforeId
    ) {
      return context;
    }

    const regionList = [...context.regionList];
    const currentIndex = regionList.findIndex(
      (item: any) => item.$$id === context.sourceId
    );
    // 如果移动的元素是整行，则需要将后续的元素的row减1
    const preCurrentRow = body[preCurrentIndex].row;
    if (body.filter((item: any) => item.row === preCurrentRow).length === 1) {
      for (let i = preCurrentIndex; i < regionList.length; i++) {
        if (regionList[i].row > preCurrentRow) {
          regionList[i] = {
            ...regionList[i],
            row: regionList[i].row - 1
          };
        }
      }
    }

    const beforeIndex = regionList.findIndex(
      (item: any) => item.$$id === context.beforeId
    );
    const beforeNode =
      regionList[beforeIndex] || regionList[regionList.length - 2];
    const beforeRow = beforeNode?.row;

    let row = beforeRow;

    if (position === 'right') {
      const preNode = regionList[beforeIndex - 2];
      if (preNode && preNode.row !== beforeRow) {
        row = beforeRow - 1;
      }
    }
    // if (position === 'top') {
    //   if (isMobile) {
    //     // 独占一行
    //     if (beforeRow !== body[beforeIndex - 1]?.row) {
    //       for (let i = currentIndex + 1; i < regionList.length; i++) {
    //         regionList[i] = {
    //           ...regionList[i],
    //           row: regionList[i].row + 1
    //         };
    //       }
    //     } else {
    //       const lastIndex = findLastIndex(
    //         regionList,
    //         (item: any) => item.row === beforeRow
    //       );
    //       for (let i = lastIndex; i < regionList.length; i++) {
    //         regionList[i] = {
    //           ...regionList[i],
    //           row: regionList[i].row + 1
    //         };
    //       }
    //     }
    //   } else {
    //     for (let i = currentIndex + 1; i < regionList.length; i++) {
    //       regionList[i] = {
    //         ...regionList[i],
    //         row: regionList[i].row + 1
    //       };
    //     }
    //   }
    // }
    // if (position === 'bottom') {
    //   if (beforeIndex < 0) {
    //     row = beforeRow + 1;
    //   }
    //   if (isMobile) {
    //     if (beforeRow !== body[beforeIndex - 1]?.row) {
    //       for (let i = currentIndex + 1; i < regionList.length; i++) {
    //         regionList[i] = {
    //           ...regionList[i],
    //           row: regionList[i].row + 1
    //         };
    //       }
    //     } else {

    //     }
    //   } else {
    //     for (let i = currentIndex + 1; i < regionList.length; i++) {
    //       regionList[i] = {
    //         ...regionList[i],
    //         row: regionList[i].row + 1
    //       };
    //     }
    //   }

    // }
    if (position === 'bottom') {
      if (beforeIndex < 0) {
        row = beforeRow + 1;
      }
    }

    if (position === 'top' || position === 'bottom') {
      if (isMobile) {
        const preBeforeIndex = body.findIndex(
          (item: any) => item.$$id === context.beforeId
        );
        // 独占一行
        if (beforeRow !== body[preBeforeIndex - 1]?.row) {
          for (let i = currentIndex + 1; i < regionList.length; i++) {
            regionList[i] = {
              ...regionList[i],
              row: regionList[i].row + 1
            };
          }
        } else {
          const lastIndex = findLastIndex(
            regionList,
            (item: any) => item.row === beforeRow
          );
          for (let i = lastIndex; i < regionList.length; i++) {
            regionList[i] = {
              ...regionList[i],
              row: regionList[i].row + 1
            };
          }
        }
      } else {
        for (let i = currentIndex + 1; i < regionList.length; i++) {
          regionList[i] = {
            ...regionList[i],
            row: regionList[i].row + 1
          };
        }
      }
    }
    regionList[currentIndex] = {
      ...regionList[currentIndex],
      row
    };

    return {
      ...context,
      regionList
    };
  }
  afterDelete(context: BaseEventContext) {
    const regionList = [...context.regionList];
    let preRow = -1;
    for (let i = 0; i < regionList.length; i++) {
      const row = regionList[i].row;
      if (row - preRow >= 2) {
        regionList[i] = {
          ...regionList[i],
          row: row - 1
        };
      }
      if (regionList[i + 1]?.row !== row) {
        preRow = regionList[i].row;
      }
    }
    return {
      ...context,
      regionList
    };
  }
  afterMoveDown(context: BaseEventContext) {
    const regionList = [...context.regionList];
    const sourceId = context.sourceId;
    const currentIndex = regionList.findIndex(n => n.$$id === sourceId);
    const currentItem = regionList[currentIndex];
    const changeItem = regionList[currentIndex - 1];
    const tempRow = currentItem.row;
    currentItem.row = changeItem.row;
    changeItem.row = tempRow;

    return {
      ...context,
      regionList
    };
  }
  afterMoveUp(context: BaseEventContext) {
    const regionList = [...context.regionList];
    const sourceId = context.sourceId;
    const currentIndex = regionList.findIndex(n => n.$$id === sourceId);
    const currentItem = regionList[currentIndex];
    const changeItem = regionList[currentIndex + 1];
    const tempRow = currentItem.row;
    currentItem.row = changeItem.row;
    changeItem.row = tempRow;

    return {
      ...context,
      regionList
    };
  }
}
