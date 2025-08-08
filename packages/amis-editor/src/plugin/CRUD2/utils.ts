import isEmpty from 'lodash/isEmpty';
import isObject from 'lodash/isObject';
import remove from 'lodash/remove';
import pickBy from 'lodash/pickBy';
import cloneDeep from 'lodash/cloneDeep';

export function findAndUpdate<T = any>(
  arr: T[],
  compareFn: (item: T) => boolean,
  target?: T
) {
  if (!target) {
    return arr;
  }

  const result = cloneDeep(arr);
  const idx = result.findIndex(item => compareFn(item));

  if (~idx) {
    result.splice(idx, 1, target);
  }

  return result;
}

/** 深度删除 */
export const deepRemove = (
  obj: any,
  predicate: (obj: any) => boolean,
  checkAll: boolean = false
): any => {
  const waitProcess = [obj];
  let find = false;

  while (waitProcess.length) {
    if (find) {
      break;
    }

    let item: any = waitProcess.pop();
    if (Array.isArray(item)) {
      remove(item as any, (val: any) => {
        const res = predicate(val);

        if (res && !checkAll) {
          find = true;
        }

        return res;
      });
      waitProcess.push(...item);
      continue;
    }

    if (!isObject(item)) {
      continue;
    }

    Object.entries(item).forEach(([key, value]) => {
      if (isObject(value) && predicate(value)) {
        delete (item as any)[key];
        checkAll || (find = true);
      }
      waitProcess.push(value);
    });
  }

  return find;
};

export const findObj = (
  obj: any,
  predicate: (obj: any) => boolean,
  stop?: (obj: any) => boolean
): any | void => {
  const waitProcess = [obj];

  while (waitProcess.length) {
    let item: any = waitProcess.shift();
    if (Array.isArray(item)) {
      waitProcess.push(...item);
      continue;
    }

    if (!isObject(item) || (stop && stop(item))) {
      continue;
    }

    if (predicate(item)) {
      return item;
    }

    waitProcess.push(
      ...Object.values(
        pickBy(item, (val: any, key: string) => !String(key).startsWith('__'))
      )
    );
  }
};

/** schema 中查找 */
export const findSchema = (
  schema: any,
  predicate: (obj: any) => boolean,
  ...scope: string[]
) => {
  if (scope.length === 0) {
    return findObj(schema, predicate);
  }
  let region = null;
  while ((region = scope.shift())) {
    const res = findObj(schema[region], predicate);

    if (res) {
      return res;
    }
  }
  return null;
};

/** headerToolbar 和 footerToolbar 布局换成 flex 包裹 container */
export const addSchema2Toolbar = (
  schema: any,
  content: any,
  position: 'header' | 'footer',
  align: 'left' | 'right'
) => {
  const region = `${position}Toolbar`;
  const buildFlex = (items: any[] = []) => ({
    type: 'flex',
    items,
    style: {
      position: 'static'
    },
    direction: 'row',
    justify: 'flex-start',
    alignItems: 'stretch'
  });
  const buildContainer = (align?: 'left' | 'right', body: any[] = []) => ({
    type: 'container',
    body,
    wrapperBody: false,
    style: {
      flexGrow: 1,
      flex: '1 1 auto',
      position: 'static',
      display: 'flex',
      flexBasis: 'auto',
      flexDirection: 'row',
      flexWrap: 'nowrap',
      alignItems: 'stretch',
      ...(align
        ? {
            justifyContent: align === 'left' ? 'flex-start' : 'flex-end'
          }
        : {})
    }
  });

  if (
    !schema[region] ||
    isEmpty(schema[region]) ||
    !Array.isArray(schema[region])
  ) {
    const isArr = Array.isArray(schema[region]);
    const newSchema = buildFlex([
      buildContainer('left', isArr || !schema[region] ? [] : [schema[region]]),
      buildContainer('right')
    ]);

    (isArr && schema[region].push(newSchema)) || (schema[region] = [newSchema]);
  }

  // 尝试放到左面第一个，否则只能放外头了
  try {
    // 优先判断没有右边列的情况，避免都走到catch里造成嵌套层数过多的问题
    if (align === 'right' && schema[region][0].items.length < 2) {
      schema[region][0].items.push(buildContainer('right'));
    }

    schema[region][0].items[
      align === 'left' ? 0 : schema[region][0].items.length - 1
    ].body.push(content);
  } catch (e) {
    const olds = [...schema[region]];
    schema[region].length = 0;
    schema[region].push(
      buildFlex([
        buildContainer('left', olds),
        buildContainer('right', content)
      ])
    );
  }
};
