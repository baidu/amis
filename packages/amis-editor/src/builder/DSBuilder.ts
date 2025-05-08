/**
 * @file DSBuilder.ts
 * @desc 数据源配置构建器
 */

import {EditorManager} from 'amis-editor-core';
import {getFeatValueByKey, getFeatLabelByKey} from './utils';

import type {EditorNodeType} from 'amis-editor-core';
import type {
  DSFeatureType,
  GenericSchema,
  CRUDScaffoldConfig,
  FormScaffoldConfig
} from './type';

export interface DSBuilderBaseOptions {
  /** 渲染器类型 */
  renderer: string;
  /** Form应用场景 */
  feat?: DSFeatureType;
  /** CRUD应用场景 */
  feats?: DSFeatureType[];
  /** 当前组件的 Schema */
  schema?: GenericSchema;
  /** 数据源字段名 */
  sourceKey?: string;
  /** 是否在脚手架环境中 */
  inScaffold?: boolean;
  /** 如果为列表类容器，则会返回对应的节点 */
  scopeNode?: EditorNodeType;
  /** 数据源控件配置项 */
  sourceSettings?: Record<string, any>;
  /** 字段控件配置项 */
  fieldSettings?: Record<string, any>;
  [propName: string]: any;
}

export interface DSBuilderInterface<
  T extends DSBuilderBaseOptions = DSBuilderBaseOptions
> {
  /** 数据源中文名称，主要用于前端展示 */
  readonly name: string;

  /** 构造器排序权重，数字越小排序越靠前，支持负数 */
  readonly order: number;

  /** 数据源支持的功能场景 */
  readonly features: DSFeatureType[];

  /** 是否为默认 */
  isDefault?: boolean;

  /** 实例获取数据源的key */
  key: string;

  /** 是否禁用 */
  disabledOn?: () => boolean;

  /** 获取功能场景的value */
  getFeatValueByKey(feat: DSFeatureType): string;

  /** 获取功能场景的label */
  getFeatLabelByKey(feat: DSFeatureType): string;

  /** 按照功能场景过滤 */
  filterByFeat(feat: any): boolean;

  /** 根据schema，判断是否匹配当前数据源  */
  match(schema?: any, key?: string): boolean;

  /** 当前上下文中使用的字段 */
  getContextFields(options: T): Promise<any>;

  /** 当前上下文可以使用的字段 */
  getAvailableContextFields(
    options: Omit<T, 'renderer'>,
    target: EditorNodeType
  ): Promise<any>;

  /** 获取CRUD列表字段 */
  getCRUDListFields?: <F extends Record<string, any>>(
    options: T
  ) => Promise<F[]>;

  /** 获取CRUD简单查询字段 */
  getCRUDSimpleQueryFields?: <F extends Record<string, any>>(
    options: T
  ) => Promise<F[]>;

  /** 构建简单查询表单项 */
  buildSimpleQueryCollectionSchema?: (
    options: T
  ) => Promise<GenericSchema[] | undefined>;

  /** 获取CRUD高级查询字段 */
  getCRUDAdvancedQueryFields?: <F extends Record<string, any>>(
    options: T
  ) => Promise<F[]>;

  /** 构建高级查询 */
  buildAdvancedQuerySchema?: (options: T) => Promise<GenericSchema | undefined>;

  /** 获取CRUD模糊查询字段 */
  getCRUDFuzzyQueryFields?: <F extends Record<string, any>>(
    options: T
  ) => Promise<F[]>;

  /** 构建模糊查询 */
  buildFuzzyQuerySchema?: (options: T) => Promise<GenericSchema | undefined>;

  /** 构造数据源的可视化配置表单 */
  makeSourceSettingForm(options: T): any[];

  /** 构造数据源字段的可视化配置表单 */
  makeFieldsSettingForm(options: T): any[];

  /** 新建数据 */
  buildInsertSchema(options: T, componentId?: string): Promise<any>;

  /** 编辑数据 */
  buildEditSchema(options: T, componentId?: string): Promise<any>;

  /** 批量编辑数据 */
  buildBulkEditSchema(options: T, componentId?: string): Promise<any>;

  /** 查看详情数据 */
  buildViewSchema(options: T, componentId?: string): Promise<any>;

  /** 删除数据 */
  buildCRUDDeleteSchema(options: T, componentId?: string): Promise<any>;

  /** 批量删除数据 */
  buildCRUDBulkDeleteSchema(options: T, componentId?: string): Promise<any>;

  /** 数据导出 */
  buildCRUDExportSchema(options: T, componentId?: string): Promise<any>;

  /** 构建 CRUD 的顶部工具栏 */
  buildCRUDHeaderToolbar?: (
    options: T,
    componentId?: string
  ) => Promise<GenericSchema>;

  /** 表格的表头查询 */
  buildCRUDFilterSchema(options: T, componentId?: string): Promise<any>;

  /** 表格单列 */
  buildCRUDColumn?: (
    field: Record<string, any>,
    options: T,
    componentId?: string
  ) => Promise<any>;

  /** 表格操作列 */
  buildCRUDOpColumn?: (options: T, componentId?: string) => Promise<any>;

  /** 表格列 */
  buildCRUDColumnsSchema(options: T, componentId?: string): Promise<any>;

  /** 表格构建 */
  buildCRUDSchema(options: T): Promise<any>;

  /** 表单构建 */
  buildFormSchema(options: T): Promise<any>;

  /** 基于 schema 还原CRUD脚手架配置 */
  guessCRUDScaffoldConfig<T extends CRUDScaffoldConfig<any, any>>(options: {
    schema: GenericSchema;
    [propName: string]: any;
  }): Promise<T> | T;

  /** 基于 schema 还原Form脚手架配置 */
  guessFormScaffoldConfig<T extends FormScaffoldConfig<any, any>>(options: {
    schema: GenericSchema;
    [propName: string]: any;
  }): Promise<T> | T;

  /** 重新构建 API 配置 */
  buildApiSchema(options: T): Promise<any>;
}

export abstract class DSBuilder<T extends DSBuilderBaseOptions>
  implements DSBuilderInterface<T>
{
  static key: string;
  readonly name: string;
  readonly order: number;
  /** 是否为默认 */
  readonly isDefault?: boolean;

  features: DSFeatureType[];

  constructor(readonly manager: EditorManager) {}

  /** 实例获取数据源的key */
  get key() {
    return (this.constructor as typeof DSBuilder<T>).key;
  }

  /** 获取功能场景的value */
  getFeatValueByKey(feat: DSFeatureType) {
    return getFeatValueByKey(feat);
  }

  /** 获取功能场景的label */
  getFeatLabelByKey(feat: DSFeatureType) {
    return getFeatLabelByKey(feat);
  }

  filterByFeat(feat: any) {
    return feat && this.features.includes(feat);
  }

  abstract match(schema?: any, key?: string): boolean;

  abstract getContextFields(options: T): Promise<any>;

  abstract getAvailableContextFields(
    options: Omit<T, 'renderer'>,
    target: EditorNodeType
  ): Promise<any>;

  abstract makeSourceSettingForm(options: T): any[];

  abstract makeFieldsSettingForm(options: T): any[];

  /** 新建数据 */
  abstract buildInsertSchema(options: T): Promise<any>;

  /** 查看详情数据 */
  abstract buildViewSchema(options: T): Promise<any>;

  /** 编辑数据 */
  abstract buildEditSchema(options: T): Promise<any>;

  /** 批量编辑数据 */
  abstract buildBulkEditSchema(options: T): Promise<any>;

  /** 删除数据 */
  abstract buildCRUDDeleteSchema(options: T): Promise<any>;

  /** 批量删除数据 */
  abstract buildCRUDBulkDeleteSchema(options: T): Promise<any>;

  /** 数据导出 */
  abstract buildCRUDExportSchema(options: T): Promise<any>;

  /** 表格的表头查询 */
  abstract buildCRUDFilterSchema(options: T): Promise<any>;

  /** 表格列 */
  abstract buildCRUDColumnsSchema(options: T): Promise<any>;

  /** 表格 */
  abstract buildCRUDSchema(options: T): Promise<any>;

  /** 表单 */
  abstract buildFormSchema(options: T): Promise<any>;

  /** 基于 schema 还原CRUD脚手架配置 */
  abstract guessCRUDScaffoldConfig<
    T extends CRUDScaffoldConfig<any, any>
  >(options: {schema: GenericSchema; [propName: string]: any}): Promise<T> | T;

  /** 基于 schema 还原Form脚手架配置 */
  abstract guessFormScaffoldConfig<
    T extends FormScaffoldConfig<any, any>
  >(options: {schema: GenericSchema; [propName: string]: any}): Promise<T> | T;

  abstract buildApiSchema(options: T): Promise<any>;
}

export interface DSBuilderClass {
  new (manager: EditorManager): DSBuilderInterface;
  /** 数据源类型，使用英文，可以覆盖同名 */
  key: string;
}

export const builderFactory = new Map<string, DSBuilderClass>();

/** 注册数据源构造器 */
export const registerDSBuilder = (klass: DSBuilderClass) => {
  if (builderFactory.has(klass.key)) {
    console.warn(
      `[amis-editor][DSBuilder] duplicate DSBuilder「${klass.key}」`
    );
  }

  /** 重名覆盖 */
  builderFactory.set(klass.key, klass);
};
