import findLastIndex from 'lodash/findLastIndex';
import {
  BaseEventContext,
  InsertEventContext,
  MoveEventContext
} from '../plugin';
import {LayoutInterface} from './interface';
import {setDefaultColSize} from '../util';

export default class FlexLayout implements LayoutInterface {
  beforeInsert(context: InsertEventContext, store: any) {
    const region = context.region;
    const body = [...(context.schema?.[region] || [])];
    let row = 0;
    let beforeId = context.beforeId;
    let position = context.dragInfo?.position || 'bottom';

    if (body?.length) {
      const beforeNodeIndex = body.findIndex(
        (item: any) => item.$$id === beforeId
      );
      let beforeNode = body[beforeNodeIndex];
      let beforeRow = beforeNode?.row;
      const preNode =
        beforeNodeIndex > -1
          ? body[beforeNodeIndex - 1]
          : body[body.length - 1];
      const preRow = preNode?.row;

      // 处理直接点击组件添加的情况
      if (!context.dragInfo) {
        // 检查下插入的位置是否还有空间
        const rowNodes = body.filter((item: any) => item.row === preRow);
        if (rowNodes.find((item: any) => item.colSize === 'auto')) {
          position = 'bottom';
        } else {
          const leftSize = rowNodes.reduce((size: number, item: any) => {
            const split = item.colSize?.split('/');
            const colSize =
              split?.[0] && split?.[1] ? split[0] / split[1] : item.colSize;
            return size - colSize;
          }, 1);
          if (leftSize >= eval(context.data.$$defaultColSize || 1)) {
            position = 'right';
          } else {
            position = 'bottom';
          }
        }
        // 如果需要插入到下边，但是前后的row是一样的，则需要找下一行的第一个元素作为beforeNode
        if (position === 'bottom' && beforeRow === preRow) {
          const lastIndex = findLastIndex(
            body,
            (item: any) => item.row === preRow
          );
          beforeNode = body[lastIndex + 1];
          beforeId = beforeNode?.$$id;
          beforeRow = beforeNode?.row;
        }
      }
      if (position === 'left') {
        row = beforeRow;
      } else if (position === 'right') {
        row = preRow;
      } else if (position === 'top') {
        row = preRow + 1 || 0; // 如果往第一个元素上边插入，preRow为undefined，所以设置0
      } else if (position === 'bottom') {
        row = preRow + 1;
      }
    }

    return {
      ...context,
      position,
      beforeId,
      data: {
        ...context.data,
        row
      },
      schema: {
        ...context.schema,
        [region]: body
      }
    };
  }

  afterInsert(context: InsertEventContext, store: any) {
    const {isMobile} = store;
    const region = context.region;
    const body = [...(context.schema?.[region] || [])];
    const position = context.dragInfo?.position || context.position || 'bottom';
    const currentIndex = context.regionList.findIndex(
      (item: any) => item.$$id === context.data.$$id
    );
    let regionList = [...context.regionList];
    if (position === 'top' || position === 'bottom') {
      if (isMobile) {
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
          let lastIndex = findLastIndex(
            regionList,
            (item: any) => item.row === preBeforeRow
          );
          lastIndex = lastIndex === -1 ? currentIndex + 1 : lastIndex;
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
      context.data.$$defaultColSize &&
        (regionList[currentIndex].colSize = context.data.$$defaultColSize);
    } else {
      const rows = regionList.filter(
        (item: any) => item.row === context.data.row
      );
      regionList = regionList.map((item: any) => {
        if (item.row === context.data.row) {
          item = {
            ...item,
            colSize: `1/${rows.length}`
          };
        }
        return item;
      });
    }
    return {
      ...context,
      regionList
    };
  }

  afterMove(context: MoveEventContext, store: any) {
    const {isMobile} = store;
    const position = context.dragInfo?.position;
    const region = context.region;
    const body = [...(context.schema?.[region] || [])];
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

    let regionList = [...context.regionList];
    const currentIndex = regionList.findIndex(
      (item: any) => item.$$id === context.sourceId
    );
    let preCurrentRow = body[preCurrentIndex]?.row;

    // 如果preCurrentIndex为-1，说明是新增的元素，把他当做最后一个整行元素处理
    if (preCurrentIndex === -1 && currentIndex > -1) {
      preCurrentRow = body[body.length - 1].row + 1;
    }

    // 如果移动的元素是整行，则需要将后续的元素的row减1
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

    if (typeof beforeRow !== 'number') {
      return context;
    }

    let row = beforeRow;

    if (position === 'right') {
      const preNode = regionList[beforeIndex - 2];
      if (preNode && preNode.row !== beforeRow) {
        row = beforeRow - 1;
      }
    }
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

    regionList = setDefaultColSize(regionList, row, preCurrentRow);

    return {
      ...context,
      regionList
    };
  }
  afterDelete(context: BaseEventContext) {
    let regionList = [...context.regionList];
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
    regionList = setDefaultColSize(regionList, context.schema.row);
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
