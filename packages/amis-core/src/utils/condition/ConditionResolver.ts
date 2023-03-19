import get from 'lodash/get';
import {resolveVariableAndFilterForAsync} from '../resolveVariableAndFilterForAsync';

export interface BaseOpPlugin {
  compute: (left: any, right?: any) => boolean;
}

export interface PluginClass {
  op: string;
  factory: BaseOpPlugin;
}

const pluginsFactory: Array<PluginClass> = [];

export function registerOpPlugin(op: string, factory: BaseOpPlugin) {
  pluginsFactory.push({
    op,
    factory
  });
}

export function unregisterOpPlugin(op: string) {
  const idx = pluginsFactory.findIndex(p => p.op === op);
  if (idx !== -1) {
    pluginsFactory.splice(idx, 1);
  }
}

export function getPlugins() {
  return pluginsFactory.concat();
}

export interface ConditionResolverOptions {
  /**
   * 插件黑名单
   */
  disablePluginList?:
    | Array<string>
    | ((id: string, plugin: PluginClass) => boolean);

  /**
   * 外部插件
   */
  plugins?: Array<PluginClass>;
}

export class ConditionResolver {
  static instance: ConditionResolver;
  readonly plugins: Array<PluginClass> = [];

  static create(options: ConditionResolverOptions = {}) {
    return this.instance || (this.instance = new ConditionResolver(options));
  }

  constructor(readonly options: ConditionResolverOptions = {}) {
    let list = getPlugins();
    const blackList = options.disablePluginList;

    if (Array.isArray(blackList)) {
      list = list.filter(plugin => blackList.indexOf(plugin.op) === -1);
    } else if (typeof blackList === 'function') {
      list = list.filter(plugin => !blackList(plugin.op, plugin));
    }

    this.plugins = list.concat(options.plugins || []);
  }

  async resolve(conditions: any, data: any) {
    if (
      !conditions ||
      !conditions.conjunction ||
      !Array.isArray(conditions.children) ||
      !conditions.children.length
    ) {
      return Promise.resolve();
    }

    const expression = await this.computeConditions(
      conditions.children,
      conditions.conjunction,
      data
    );

    return eval(expression.join(' '));
  }

  async computeConditions(
    conditions: any[],
    conjunction: 'or' | 'and' = 'and',
    data: any
  ): Promise<any[]> {
    const CONJUNCTION_MAP = {
      and: '&&',
      or: '||'
    };

    return await conditions.reduce(async (prev, item, index) => {
      const prevResult = await prev;
      if (
        item.conjunction &&
        Array.isArray(item.children) &&
        item.children.length
      ) {
        const result = await this.computeConditions(
          item.children,
          item.conjunction,
          data
        );

        return prevResult.concat('(', result, ')');
      } else {
        // get result
        const result = await this.computeCondition(item, index, data);

        if (prevResult[prevResult.length - 1] === ')') {
          // operator
          prev = prevResult.concat(CONJUNCTION_MAP[conjunction], result);
        } else {
          prev = prevResult.concat(result);
        }

        // operator
        if (index < conditions.length - 1) {
          prev = prev.concat(CONJUNCTION_MAP[conjunction]);
        }

        return prev;
      }
    }, []);
  }

  async computeCondition(
    rule: {
      op: string;
      left: {
        type: string;
        field: string;
      };
      right: any;
    },
    index: number,
    data: any
  ) {
    if (
      rule.op !== 'is_not_empty' &&
      rule.op !== 'is_empty' &&
      rule.right === undefined
    ) {
      return Promise.resolve();
    }

    const leftValue = get(data, rule.left.field);
    const rightValue: any = await resolveVariableAndFilterForAsync(
      rule.right,
      data
    );

    const plugin = this.plugins.find(
      (item: PluginClass) => item.op === rule.op
    );

    return plugin ? plugin.factory.compute?.(leftValue, rightValue) : false;
  }
}
