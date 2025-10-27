import {AMISPageSchema} from './renderers/Page';
import {AMISFormSchema} from 'amis-core';
import {
  AMISFormItem,
  AMISFormItemWithOptions,
  AMISClassName,
  SchemaExpression,
  AMISSchema,
  AMISSchemaType,
  AMISSchemaCollection
} from 'amis-core';
import type {
  AMISApi,
  AMISApiObject,
  AMISButtonSchema,
  AMISDefaultData,
  AMISFeedbackDialog,
  AMISFunction,
  AMISIcon,
  AMISLegacyActionSchema,
  AMISMessageConfig,
  AMISOption,
  AMISRedirect,
  AMISReloadTarget,
  AMISRemarkBase,
  AMISSchemaBase,
  AMISTemplate,
  AMISToastBase,
  AMISTokenizeableString,
  AMISTooltip,
  AMISUrlPath,
  AMISVariableName
} from 'amis-core';

export type SchemaType = AMISSchemaType;
export type SchemaObject = AMISSchema;

export type SchemaCollection = AMISSchemaCollection;
export type SchemaApiObject = AMISApiObject;
export type SchemaApi = AMISApi;
export type SchemaName = AMISVariableName;
export type SchemaReload = AMISReloadTarget;
export type SchemaRedirect = AMISRedirect;
export type SchemaTpl = AMISTemplate;
export type SchemaDefaultData = AMISDefaultData;

/**
 * 用来关联 json schema 的，不用管。
 */
export type SchemaSchema = string;
export type SchemaIcon = AMISIcon;
export type SchemaTokenizeableString = AMISTokenizeableString;
export type SchemaUrlPath = AMISUrlPath;

export type SchemaTooltip = AMISTooltip;

/**
 * 消息文案配置，记住这个优先级是最低的，如果你的接口返回了 msg，接口返回的优先。
 */
export type SchemaMessage = AMISMessageConfig;
export type SchemaFunction = AMISFunction;

export interface BaseSchema extends AMISSchemaBase {}

export interface Option extends AMISOption {
  /**
   * 标记正在加载。只有 defer 为 true 时有意义。内部字段不可以外部设置
   */
  loading?: boolean;

  /**
   * 只有设置了 defer 才有意义，内部字段不可以外部设置
   */
  loaded?: boolean;

  [propName: string]: any;
}
export interface Options extends Array<Option> {}

export type FeedbackDialog = AMISFeedbackDialog;
export type ToastSchemaBase = AMISToastBase;
export type FormBaseControlSchema = AMISFormItem;

export interface FormOptionsSchema extends AMISFormItemWithOptions {}

export {AMISClassName, SchemaExpression};

export type RootSchema = AMISPageSchema;

export type RootRenderer = AMISPageSchema;
export {AMISFormSchema, AMISFormSchema as FormSchema};
