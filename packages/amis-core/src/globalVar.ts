/**
 * 全局变量
 *
 * 用于实现跨组件、跨页面的数据共享，支持持久化。
 */

import {JSONSchema} from './types';
import {isExpression} from './utils/formula';
import {reaction} from 'mobx';
import {resolveVariableAndFilter} from './utils/resolveVariableAndFilter';
import {IRootStore} from './store/root';
import isPlainObject from 'lodash/isPlainObject';

/**
 * 全局变量的定义
 */
export interface GlobalVariableItem {
  // 标识，用于区分不同的变量，不可重复
  id?: string;

  /**
   * 设计态属性。
   * 全局变量类型，不是数据体类型，而是用于区分不同的配置方式。
   * 这个字段运行时无含义，主要用于编辑器中的分类。
   *
   * 比如平台可能扩充：应用级别、页面级别、用户级别、数据字典关联、数据模型关联等。
   * amis 中内置了：builtin 为简单的客户端存储，服务端存储需要外部扩充。
   *
   * @default builtin
   */
  type?: string | 'builtin';

  /**
   * 变量名
   */
  key: string;

  /**
   * 变量标题
   */
  label?: string;

  /**
   * 变量描述
   */
  description?: string;

  /**
   * 默认值
   */
  defaultValue?: string;

  /**
   * 值的数据类型定义
   */
  valueSchema?: JSONSchema;

  /**
   * 数据作用域
   */
  scope?: 'page' | 'app';

  /**
   * 数据存储方式
   */
  storageOn?: 'client' | 'server' | 'session';

  /**
   * 是否只读，不允许修改，运行态属性。
   */
  readonly?: boolean;

  /**
   * @default true
   * 是否自动保存，如果不特殊配置，会自动保存
   */
  autoSave?: boolean;

  // todo: 以下是扩展字段，需要进一步定义
  validationErrors?: any;
  validations?: any;

  // 其他扩充数据
  [propName: string]: any;
}

export type GlobalVarGetter = (
  variable: GlobalVariableItem,
  context: GlobalVarContext
) => Promise<any>;
export type GlobalVarBulkGetter = (
  context: GlobalVarContext
) => Promise<Record<string, any>> | Record<string, any>;
export type GlobalVarSetter = (
  variable: GlobalVariableItem,
  value: Record<string, any>,
  context: GlobalVarContext
) => Promise<any>;
export type GlobalVarBulkSetter = (
  values: Record<string, any>,
  context: GlobalVarContext
) => Promise<any> | any;

export interface GlobalVariableItemFull extends GlobalVariableItem {
  /**
   * 校验数值是否合法
   * @param value
   * @returns
   */
  validate?: (value: any, values: Record<string, any>) => string | void;

  /**
   * 权重，用于排序
   */
  order?: number;

  /**
   * 单个数据初始化获取
   * @returns
   */
  getter?: GlobalVarGetter;

  /**
   * 批量数据初始化获取
   * @returns
   */
  bulkGetter?: GlobalVarBulkGetter;

  /**
   * 当个数据修改保存
   * @param value
   * @returns
   */
  setter?: GlobalVarSetter;

  /**
   * 批量全局变量数据保存，多个变量一起保存
   * @param values
   * @returns
   */
  bulkSetter?: GlobalVarBulkSetter;
}

/**
 * 全局变量的状态
 */
export interface GlobalVariableState {
  /**
   * 当前值
   */
  value: any;

  /**
   * 原始值
   */
  pristine: any;

  /**
   * 是否正在加载, 或者说正在获取
   */
  busy?: boolean;

  /**
   * 是否已经初始化
   */
  initialized: boolean;

  /**
   * 数据是否合法
   */
  valid: boolean;

  /**
   * 错误馨馨
   */
  errorMessages: string[];

  /**
   * 是否有变更
   */
  touched: boolean;

  /**
   * 是否有保存
   */
  saved: boolean;
}

export interface GlobalVarContext {
  variables: Array<GlobalVariableItem>;
  [propName: string]: any;
}
/**
 * 全局变量处理器, 可以处理全变量的初始化、校验、存储等操作
 */
export type GlobalVariableHandler = (
  variable: GlobalVariableItem | GlobalVariableItemFull,
  context: GlobalVarContext
) =>
  | GlobalVariableItemFull
  | void
  | ((
      variable: GlobalVariableItem | GlobalVariableItemFull,
      context: GlobalVarContext
    ) => GlobalVariableItemFull | void);

const handlers: Array<GlobalVariableHandler> = [];

/**
 * 注册全局变量处理器
 * @param handler
 */
export function registerGlobalVariableHandler(handler: GlobalVariableHandler) {
  handlers.push(handler);
}

/**
 * 通过处理器构建全局变量细节对象，用于后续的初始化、校验、存储等操作
 * @param variable
 * @param context
 * @returns
 */
export function buildGlobalVariable(
  variable: GlobalVariableItem | GlobalVariableItemFull,
  context: GlobalVarContext
): GlobalVariableItemFull {
  const postHandlers: Array<
    (
      variable: GlobalVariableItem | GlobalVariableItemFull,
      context: GlobalVarContext
    ) => GlobalVariableItemFull | void
  > = [];

  let result = handlers.reduce((item, handler) => {
    const result = handler(item, context);

    if (typeof result === 'function') {
      postHandlers.push(result);
    }

    return (result ?? item) as GlobalVariableItemFull;
  }, variable);

  result = postHandlers.reduce(
    (item, handler) => handler(item, context) ?? item,
    result
  );

  return result;
}

/**
 * 构建变量初始状态
 * @returns
 */
export function createGlobalVarState(): GlobalVariableState {
  return {
    value: undefined,
    pristine: undefined,
    initialized: false,
    valid: true,
    errorMessages: [],
    touched: false,
    saved: false
  };
}

// 前两个是历史遗留，后两个是新的
const globalVarFields = ['__page.', 'appVariables.', 'global.', 'globalState.'];
export function isGlobalVarExpression(value: string) {
  return (
    typeof value === 'string' &&
    isExpression(value) &&
    globalVarFields.some(k => value.includes(k))
  );
}

/**
 * 监控组件的全局变量
 * @param schema
 * @param topStore
 * @param callback
 * @returns
 */
export function observeGlobalVars(
  schema: any,
  topStore: IRootStore,
  callback: () => void
) {
  let expressions: Array<{
    key: string;
    value: string;
  }> = [];
  Object.keys(schema).forEach(key => {
    const value = schema[key];

    if (isGlobalVarExpression(value)) {
      expressions.push({
        key,
        value
      });
    } else if (isPlainObject(value) && !value.type) {
      // 最多支持两层，多了可能就会有性能问题了
      // 再多一层主要是为了支持某些 api 配置的是对象形式
      Object.keys(value).forEach(k => {
        if (isGlobalVarExpression(value[k])) {
          expressions.push({
            key: `${key}.${k}`,
            value: value[k]
          });
        }
      });
    } else if (
      [
        'items',
        'body',
        'buttons',
        'header',
        'columns',
        'tabs',
        'footer',
        'actions',
        'toolbar'
      ].includes(key)
    ) {
      const items = Array.isArray(value) ? value : [value];
      items.forEach(item => {
        if (isGlobalVarExpression(item?.visibleOn)) {
          expressions.push({
            key: `${key}.x.visibleOn`,
            value: item.visibleOn
          });
        } else if (isGlobalVarExpression(item?.hiddenOn)) {
          expressions.push({
            key: `${key}.x.hiddenOn`,
            value: item.hiddenOn
          });
        }
      });
    }
  });
  if (!expressions.length) {
    return () => {};
  }

  const unReaction = reaction(
    () =>
      expressions
        .map(
          exp =>
            `${exp.key}:${resolveVariableAndFilter(
              exp.value,
              topStore.nextGlobalData,
              '| json' // 如果用了复杂对象，要靠这个来比较
            )}`
        )
        .join(','),
    callback
  );

  return unReaction;
}
