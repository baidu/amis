/**
 * @file type.ts
 * @desc builder 相关声明
 */

import {DSFeature} from './constants';
import type {BaseApiObject} from 'amis-core';

export interface DSField {
  value: string;
  label: string;
  [propKey: string]: any;
}

/** 数据源字段集合 */
export interface DSFieldGroup {
  value: string;
  label: string;
  children: DSField[];
  [propKey: string]: any;
}

export type DSFeatureType = keyof typeof DSFeature;

export type GenericSchema = Record<string, any>;

export type DSRendererType = 'form' | 'crud' | 'service';

export interface ScaffoldField {
  /** 标题 */
  label: string;
  /** 字段名 */
  name: string;
  /** 展示控件类型 */
  displayType: string;
  /** 输入控件类型 */
  inputType: string;
  typeKey?: string;
  /** 是否启用 */
  checked?: boolean;
}

/** 表单操作 */
export type ApiConfig = string | BaseApiObject;

/** 表单操作 */
export type FormOperatorValue = 'cancel' | 'reset' | 'submit';

/** 表单操作按钮 */
export interface FormOperator {
  label: string;
  value: FormOperatorValue;
  order: number;
  schema: Record<string, any>;
}

export interface ScaffoldConfigBase {
  /** 数据源类型 */
  dsType: string;
  /** 重新构建时用户的原始 Schema */
  __pristineSchema?: Record<string, any>;
  [propName: string]: any;
}

export interface FormScaffoldConfig<
  Fields extends Record<string, any> = ScaffoldField,
  API extends any = ApiConfig
> extends ScaffoldConfigBase {
  /** Form功能场景 */
  feat?: DSFeatureType;
  /** 表单初始化接口 */
  initApi?: API;
  insertApi?: API;
  editApi?: API;
  bulkEditApi?: API;
  insertFields?: Fields[];
  editFields?: Fields[];
  bulkEditFields?: Fields[];
  operators?: FormOperator[];
}

export interface CRUDScaffoldConfig<
  Fields extends Record<string, any> = ScaffoldField,
  API extends any = ApiConfig
> extends ScaffoldConfigBase {
  /** 工具栏 */
  tools?: Extract<
    DSFeatureType,
    'Insert' | 'BulkDelete' | 'BulkEdit' | 'Export'
  >[];
  /** 数据操作 */
  operators?: Extract<DSFeatureType, 'View' | 'Edit' | 'Delete'>[];
  /** 条件查询 */
  filters?: Extract<
    DSFeatureType,
    'FuzzyQuery' | 'SimpleQuery' | 'AdvancedQuery'
  >[];
  /** 表格 list 接口 */
  listApi?: API;
  viewApi?: API;
  editApi?: API;
  /** 编辑表单的初始化接口 */
  initApi?: API;
  bulkEditApi?: API;
  deleteApi?: API;
  bulkDeleteApi?: API;
  exportApi?: API;
  insertApi?: API;
  listFields?: Fields[];
  insertFields?: Fields[];
  viewFields?: Fields[];
  editFields?: Fields[];
  bulkEditFields?: Fields[];
  fuzzyQueryFields?: Fields[];
  simpleQueryFields?: Fields[];
  advancedQueryFields?: Fields[];
  importFields?: Fields[];
  exportFields?: Fields[];
  /** 表格脚手架时的主键 */
  primaryField?: string;
}

export type ScaffoldConfig<
  Fields extends Record<string, any> = ScaffoldField,
  API extends any = ApiConfig
> = FormScaffoldConfig<Fields, API> | CRUDScaffoldConfig<Fields, API>;
