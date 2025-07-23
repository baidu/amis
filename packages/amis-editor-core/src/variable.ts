/**
 * @file 变量管理
 * @desc 主要用于编辑器外部注入变量的管理，用于变量绑定
 */

import sortBy from 'lodash/sortBy';
import cloneDeep from 'lodash/cloneDeep';
import reverse from 'lodash/reverse';
import pick from 'lodash/pick';
import {
  JSONSchema,
  DataSchema,
  mapTree,
  findTree,
  eachTree,
  DATASCHEMA_TYPE_MAP
} from 'amis-core';
import type {Option} from 'amis-core';

export interface VariableGroup {
  /** 变量命名空间 */
  name: string;
  /** 标题显示名称 */
  title: string;
  /* 父节点scope id */
  parentId: string;
  /** 顺序 */
  order: number;
  /** 结构定义，根结点必须为object */
  schema: JSONSchema;
}

export interface VariableOptions {
  /** 变量Schema被添加到Scope之前触发 */
  beforeScopeInsert?: (
    context: VariableManager,
    schema: JSONSchema
  ) => JSONSchema;
  /** 事件：变量Schema被添加到Scope之后触发 */
  afterScopeInsert?: (context: VariableManager) => void;
  /** 获取上下文数据结构时触发，可以自定义返回的数据结构 */
  onContextSchemaChange?: (
    context: VariableManager,
    schema: JSONSchema[]
  ) => JSONSchema[];
  /** 获取上下文数据Options时触发，可以自定义返回的数据结构 */
  onContextOptionChange?: (
    context: VariableManager,
    option: Option[],
    type: 'normal' | 'formula'
  ) => Option[];
}

export class VariableManager {
  /* 变量列表 */
  readonly variables: VariableGroup[];
  /* 上下文结构 */
  readonly dataSchema: DataSchema;
  /* 变量管理配置 */
  readonly options: VariableOptions;

  constructor(
    dataSchema: DataSchema | undefined,
    variables: VariableGroup[] | undefined,
    options: VariableOptions | undefined
  ) {
    this.variables = Array.isArray(variables)
      ? sortBy(cloneDeep(variables), [item => item.order ?? 1])
      : [];
    this.dataSchema =
      dataSchema instanceof DataSchema ? dataSchema : new DataSchema([]);
    this.options = pick(options, [
      'beforeScopeInsert',
      'afterScopeInsert',
      'onContextSchemaChange',
      'onContextOptionChange'
    ]);

    this.init();
  }

  /**
   * 初始化变量，预期的结构类似：
   * ──系统变量(root)
   *   └── 组织变量
   *   └── 应用变量
   *   └── 页面变量
   *       └── ...
   */
  init() {
    const variables = this.variables;
    const dataSchema = this.dataSchema;
    const {beforeScopeInsert, afterScopeInsert} = this.options ?? {};

    variables.forEach(item => {
      const {parentId, name: scopeName, title: tagName} = item;
      let schema = item.schema;

      if (!dataSchema.hasScope(parentId)) {
        return;
      }

      dataSchema.switchTo(parentId);

      if (dataSchema.hasScope(scopeName)) {
        dataSchema.removeScope(scopeName);
      }

      if (beforeScopeInsert && typeof beforeScopeInsert === 'function') {
        schema = beforeScopeInsert(this, schema);
      }

      /** 初始化变量Scope */
      dataSchema.addScope(
        {
          type: 'object',
          $id: scopeName,
          properties: {
            [scopeName]: {
              ...schema,
              title: tagName
            }
          }
        },
        scopeName
      );
      dataSchema.switchTo(scopeName);

      if (afterScopeInsert && typeof afterScopeInsert === 'function') {
        afterScopeInsert(this);
      }
    });

    dataSchema.switchToRoot();
  }

  /**
   * 获取外部变量的上下文数据结构
   */
  getVariableContextSchema() {
    let variableSchemas: JSONSchema[] = [];
    const {onContextSchemaChange} = this.options ?? {};

    if (this.variables && this.variables?.length > 0) {
      variableSchemas = this.variables
        .map(item => {
          if (this.dataSchema.hasScope(item.name)) {
            const varScope = this.dataSchema.getScope(item.name);

            /** 变量的Scope只有一个根结点 */
            return varScope.schemas.length > 0 ? varScope.schemas[0] : null;
          }
          return null;
        })
        .filter((item): item is JSONSchema => item !== null);
    }

    if (onContextSchemaChange && typeof onContextSchemaChange === 'function') {
      variableSchemas = onContextSchemaChange(this, variableSchemas);
    }

    return variableSchemas;
  }

  /**
   * 获取公式编辑器中变量的Option结构
   */
  getVariableFormulaOptions(reverseOrder: boolean = false) {
    const {onContextOptionChange} = this.options ?? {};
    let options: Option[] = [];

    if (this.variables && this.variables?.length > 0) {
      this.variables.forEach(item => {
        if (this.dataSchema.hasScope(item.name)) {
          const varScope = this.dataSchema.getScope(item.name);
          const children = mapTree(varScope.getDataPropsAsOptions(), item => ({
            ...item,
            /** tag默认会被赋值为description，这里得替换回来 */
            tag: DATASCHEMA_TYPE_MAP[item.type] ?? item.type
          }));

          if (varScope.tag) {
            options.push({label: varScope.tag, children});
          } else {
            options.push(...children);
          }
        }
      });
    }

    if (onContextOptionChange && typeof onContextOptionChange === 'function') {
      options = onContextOptionChange(this, options, 'formula');
    }
    eachTree(options, item => {
      if (item.type === 'array') {
        delete item.children;
      }
    });

    return reverseOrder ? options : (reverse(options as any) as Option[]);
  }

  /**
   * 获取通用的树形结构
   */
  getVariableOptions() {
    const {onContextOptionChange} = this.options ?? {};
    let options: Option[] =
      this.getVariableFormulaOptions(false)?.[0]?.children ?? [];

    options = mapTree(
      options,
      (item: Option, key: number, level: number, paths: Option[]) => {
        return {
          ...item,
          valueExpression:
            typeof item.value === 'string' && !item.value.startsWith('${')
              ? `\${${item.value}}`
              : item.value
        };
      }
    );

    if (onContextOptionChange && typeof onContextOptionChange === 'function') {
      options = onContextOptionChange(this, options, 'normal');
    }

    return options;
  }

  /**
   * 获取页面变量树形结构
   * @returns
   */
  getPageVariablesOptions() {
    let options: Option[] = [];

    const rootScope = this.dataSchema?.root;
    if (rootScope) {
      options = rootScope
        .getDataPropsAsOptions()
        .filter((item: any) => ['__query', '__page'].includes(item.value));
    }
    eachTree(options, item => {
      if (item.type === 'array') {
        delete item.children;
      }
    });
    return options;
  }

  /**
   * 根据变量路径获取变量名称
   */
  getNameByPath(path: string, valueField = 'value', labelField = 'label') {
    if (!path || typeof path !== 'string') {
      return '';
    }

    const options = [
      ...this.getVariableOptions(),
      ...this.getPageVariablesOptions(),
      ...this.getGlobalVariablesOptions()
    ];
    let nodePaths: Array<any> = [];
    const node = findTree(options, (item, key, level, paths) => {
      if (item[valueField ?? 'value'] === path) {
        nodePaths = paths.concat(item);
        return true;
      }
      return false;
    });
    return node
      ? nodePaths
          .map(
            node =>
              node[labelField ?? 'label'] ?? node[valueField ?? 'value'] ?? ''
          )
          .join(' / ')
      : '';
  }

  /**
   * 获取全局变量树形结构
   * @returns
   */
  getGlobalVariablesOptions() {
    let options: Option[] = [];

    const rootScope = this.dataSchema?.root;
    if (rootScope) {
      options = rootScope
        .getDataPropsAsOptions()
        .filter((item: any) => ['global'].includes(item.value));
    }
    eachTree(options, item => {
      if (item.type === 'array') {
        delete item.children;
      }
      if (item.value === 'global') {
        item.disabled = true;
      }
    });

    return options;
  }
}
