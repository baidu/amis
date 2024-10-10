/**
 * @file DSBuilderManager
 * @desc 数据源构造管理器
 */

import {builderFactory, DSBuilderInterface} from './DSBuilder';

import type {EditorManager} from 'amis-editor-core';
import type {GenericSchema} from './type';
import type {Option} from 'amis-core';

export class DSBuilderManager {
  private builders: Map<string, DSBuilderInterface>;

  constructor(manager: EditorManager) {
    this.builders = new Map();

    builderFactory.forEach((Builder, key) => {
      this.builders.set(key, new Builder(manager));
    });
  }

  get size() {
    return this.builders.size;
  }

  getBuilderByKey(key: string) {
    return this.builders.get(key);
  }

  getBuilderByScaffoldSetting(scaffoldConfig: any) {
    return this.builders.get(scaffoldConfig.dsType);
  }

  getBuilderBySchema(schema: any, sourceKey?: string) {
    let builder: DSBuilderInterface | undefined;

    for (let [key, value] of Array.from(this.builders.entries())) {
      if (value.match(schema, sourceKey)) {
        builder = value;
        break;
      }
    }

    return builder ? builder : this.getDefaultBuilder();
  }

  /**
   * 获取默认构建器Key
   *
   * @returns 返回默认构建器Key
   */
  getDefaultBuilderKey() {
    const collections = Array.from(this.builders.entries()).filter(
      ([_, builder]) => builder?.disabledOn?.() !== true
    );
    const [defaultKey, _] =
      collections.find(([_, builder]) => builder.isDefault === true) ??
      collections.sort((lhs, rhs) => {
        return (lhs[1].order ?? 0) - (rhs[1].order ?? 0);
      })?.[0] ??
      [];

    return defaultKey;
  }

  /**
   * 获取默认构建器
   *
   * @returns {Object} 默认构建器
   */
  getDefaultBuilder() {
    const collections = Array.from(this.builders.entries()).filter(
      ([_, builder]) => builder?.disabledOn?.() !== true
    );
    const [_, defaultBuilder] =
      collections.find(([_, builder]) => builder.isDefault === true) ??
      collections.sort((lhs, rhs) => {
        return (lhs[1].order ?? 0) - (rhs[1].order ?? 0);
      })?.[0] ??
      [];

    return defaultBuilder;
  }

  /**
   * 获取可用的构建器列表
   *
   * @returns 返回可用构建器的列表
   */
  getAvailableBuilders() {
    return Array.from(this.builders.entries())
      .filter(([_, builder]) => builder?.disabledOn?.() !== true)
      .sort((lhs, rhs) => {
        return (lhs[1].order ?? 0) - (rhs[1].order ?? 0);
      });
  }

  /**
   * 获取数据选择器Schema
   *
   * @param patch - 需要进行补丁修复的配置对象
   * @param config - 包含运行上下文和源键的配置对象
   * @returns 返回一个对象，包含类型、标签、名称、可见性、选项、默认值和pipeIn等属性
   */
  getDSSelectorSchema(
    patch: Record<string, any>,
    config?: {
      /** 组件 Schema */
      schema: GenericSchema;
      /** 组件数据源 Key */
      sourceKey: string;
      /** 获取默认值函数 */
      getDefautlValue?: (key: string, builder: DSBuilderInterface) => Boolean;
    }
  ) {
    const {schema, sourceKey, getDefautlValue} = config || {};
    const builders = this.getAvailableBuilders();
    let defaultValue: string | undefined = schema?.dsType;
    const options: Option[] = [];

    for (const [key, builder] of builders) {
      if (schema && !defaultValue) {
        if (
          getDefautlValue &&
          typeof getDefautlValue === 'function' &&
          getDefautlValue(key, builder)
        ) {
          defaultValue = key;
        } else if (builder.match(schema, sourceKey)) {
          defaultValue = key;
        }
      }

      options.push({
        label: builder.name,
        value: key
      });
    }

    return {
      type: 'radios',
      label: '数据来源',
      name: 'dsType',
      visible: options.length > 0,
      options: options,
      ...(defaultValue ? {value: defaultValue} : {}),
      ...patch
    };
  }

  /**
   * 从构建器中生成集合
   *
   * @param callback 回调函数，用于处理每个构建器、构建器键和索引
   * @returns 返回生成的集合
   */
  buildCollectionFromBuilders(
    callback: (
      builder: DSBuilderInterface,
      builderKey: string,
      index: number
    ) => any
  ) {
    const builders = this.getAvailableBuilders();
    const collection = builders
      .map(([key, builder], index) => {
        return callback(builder, key, index);
      })
      .filter(Boolean);

    return collection;
  }
}
