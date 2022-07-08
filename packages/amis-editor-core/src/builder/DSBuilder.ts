/**
 * 数据源构造器，可用于对接当前amis中的扩展数据源
 */

import {ButtonSchema} from 'amis/lib/renderers/Action';
import {CRUD2Schema} from 'amis/lib/renderers/CRUD2';
import {FormSchema, SchemaObject} from 'amis/lib/Schema';

/**
 * 数据源所需操作，目前是因为schema从后端来
 */
export enum DSBehavior {
  create = 'create',
  view = 'view',
  update = 'update',
  table = 'table',
  filter = 'filter'
}

export interface DSField {
  value: string;
  label: string;
  [propKey: string]: any;
}

export interface DSFieldGroup {
  value: string;
  label: string;
  children: DSField[];
  [propKey: string]: any;
}

/**
 * 支持数据源配置的一些属性名
 */
export enum DSGrain {
  entity = 'entity',
  list = 'list',
  piece = 'piece'
}

export const DSFeature = {
  List: {
    value: 'list',
    label: '列表'
  },
  Insert: {
    value: 'insert',
    label: '新增'
  },
  View: {
    value: 'view',
    label: '详情'
  },
  Edit: {
    value: 'edit',
    label: '编辑'
  },
  Delete: {
    value: 'delete',
    label: '删除'
  },
  BulkEdit: {
    value: 'bulkEdit',
    label: '批量编辑'
  },
  BulkDelete: {
    value: 'bulkDelete',
    label: '批量删除'
  },
  Import: {
    value: 'import',
    label: '导入'
  },
  Export: {
    value: 'export',
    label: '导出'
  },
  SimpleQuery: {
    value: 'simpleQuery',
    label: '简单查询'
  },
  FuzzyQuery: {
    value: 'fuzzyQuery',
    label: '模糊查询'
  },
  AdvancedQuery: {
    value: 'advancedQuery',
    label: '高级查询'
  }
};

export type DSFeatureType = keyof typeof DSFeature;

export interface DSSourceSettingFormConfig {
  /** 数据源字段名 */
  name?: string;
  /** 数据源字段标题 */
  label?: string;
  /** 所需要配置的数据粒度 */
  grain?: DSGrain;
  /** 数据源所被使用的功能场景 */
  feat: DSFeatureType;
  /** 是否是在CRUD场景下，有的数据源在CRUD中可以统一设置 */
  inCrud?: boolean;
  /** 是否在脚手架中 */
  inScaffold?: boolean;
}

/**
 * 数据源选择构造器
 */
export abstract class DSBuilder {
  /**
   * 数据源名字，中文，可以覆盖同名
   */
  public static type: string;

  public name: string;

  // 数字越小排序越靠前
  public order: number;

  /**
   * 数据源schema运行前转换
   */
  public static schemaFilter?: (schema: any) => any;

  /**
   * 根据组件、属性名判断是否可以使用这个数据源
   */
  public static accessable: (controlType: string, propKey: string) => boolean;

  public features: Array<keyof typeof DSFeature>;

  /**
   * 根据值内容和schema配置状态，看是否是当前数据源
   */
  public abstract match(value: any, schema?: SchemaObject): boolean;

  /**
   * 生成数据源的配置表单
   */
  public abstract makeSourceSettingForm(
    config: DSSourceSettingFormConfig
  ): SchemaObject[];

  public abstract makeFieldsSettingForm(config: {
    /** 数据源字段名 */
    sourceKey?: string;
    feat: DSFeatureType;
    inCrud?: boolean;
    inScaffold?: boolean;
    /** 初次设置字段还是选择字段 */
    setting?: boolean;
  }): SchemaObject[];

  /**
   * 生成字段的筛选配置表单
   */
  public abstract makeFieldFilterSetting(config: {
    /** 数据源字段名 */
    sourceKey: string;
    schema: any;
    fieldName: string;
  }): Promise<SchemaObject[]>;

  /**
   * 数据源schema生成
   */
  abstract resolveSourceSchema(config: {
    /** schema */
    schema: SchemaObject;
    /** 数据源配置结果 */
    setting: any;
    /** 数据源字段名 */
    name?: string;
    feat?: DSFeatureType;
    /** 是否是在CRUD场景下，有的数据源在CRUD中可以统一设置 */
    inCrud?: boolean;
    inScaffold?: boolean;
  }): void;

  /**
   * 数据删除schema生成
   */
  abstract resolveDeleteSchema(config: {
    schema: ButtonSchema;
    setting: any;
    feat: 'BulkDelete' | 'Delete';
    name?: string;
  }): any;

  /**
   * 生成数据创建表单schema
   */
  abstract resolveCreateSchema(config: {
    /** schema */
    schema: FormSchema;
    /** 脚手架配置数据 */
    setting: any;
    feat: 'Insert' | 'Edit' | 'BulkEdit';
    /** 数据源字段名 */
    name?: string;
    /** 是否是在CRUD场景下，有的数据源在CRUD中可以统一设置 */
    inCrud?: boolean;
  }): void;

  /**
   * 生成数据表格列
   */
  abstract resolveTableSchema(config: {
    /** schema */
    schema: CRUD2Schema;
    /** 脚手架配置数据 */
    setting: any;
    /** 数据源字段名 */
    name?: string;
    /** 是否是在CRUD场景下，有的数据源在CRUD中可以统一设置 */
    inCrud?: boolean;
  }): void;

  /**
   * 生成数据表格列
   */
  abstract resolveViewSchema(config: {
    /** 脚手架配置数据 */
    setting: any;
    feat?: DSFeatureType;
  }): SchemaObject[];

  abstract resolveSimpleFilterSchema(config: {setting: any}): SchemaObject[];

  abstract resolveAdvancedFilterSchema(config: {
    setting: any;
  }): SchemaObject | void;

  abstract makeTableColumnsByFields(fields: any[]): SchemaObject[];

  /**
   * 当前上下文中使用的字段
   */
  abstract getContextFileds(config: {
    schema: any;
    sourceKey: string;
    feat: DSFeatureType;
  }): Promise<DSField[] | void>;

  /**
   * 上下文可以使用的字段
   */
  abstract getAvailableContextFileds(config: {
    schema: any;
    sourceKey: string;
    feat: DSFeatureType;
  }): Promise<DSFieldGroup[] | void>;
}

/**
 * 所有的数据源构造器
 */
const __builders: {
  [key: string]: any;
} = {};

export const registerDSBuilder = (builderKClass: any) => {
  __builders[builderKClass.type] = builderKClass;
};

/**
 * 构造器管理工具，便于更好的缓存
 */
export class DSBuilderManager {
  /** 所有可用的数据源构造器实例 */
  builders: {
    [key: string]: DSBuilder;
  } = {};

  get builderNum() {
    return Object.keys(this.builders).length;
  }

  constructor(type: string, propKey: string) {
    Object.values(__builders)
      .filter(builder => builder.accessable?.(type, propKey) ?? true)
      .forEach(Builder => {
        this.builders[Builder.type] = new Builder();
      });
  }

  resolveBuilderBySetting(setting: any) {
    return this.builders[setting.dsType] || Object.values(this.builders)[0];
  }

  resolveBuilderBySchema(schema: any, propKey: string) {
    const builders = Object.values(this.builders);
    return (
      builders.find(builder => builder.match(schema[propKey])) || builders[0]
    );
  }

  getDefaultBuilderName() {
    // 先返回第一个，之后可以加一些order之类的
    const builderOptions = Object.entries(this.builders)
      .map(([key, builder]) => {
        return {
          value: key,
          order: builder.order
        };
      })
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
    return builderOptions[0].value;
  }

  getDSSwitch(setting: any = {}) {
    const multiSource = this.builderNum > 1;
    const builderOptions = Object.entries(this.builders).map(
      ([key, builder]) => ({
        label: builder.name,
        value: key,
        order: builder.order
      })
    );
    builderOptions.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

    return {
      type: 'radios',
      label: '数据来源',
      name: 'dsType',
      visible: multiSource,
      selectFirst: true,
      options: builderOptions,
      ...setting
    };
  }

  // getDSSwitchFormForPanel(
  //   propKey: string,
  //   label: string
  // ) {
  //   return Object.keys(this.builders).length > 1 ? {
  //     type: Object.keys(this.builders).length > 3 ? 'select' : 'button-group-select',
  //     options: Object.keys(this.builders).map(name => ({
  //       label: name,
  //       value: name
  //     })),
  //     name: propKey,
  //     label: label,
  //     pipeIn: (value: string) => {
  //       const builders = Object.entries(this.builders);
  //       return (builders.find(([, builder]) => {
  //         return builder.match(value);
  //       }) || builders[0])[0];
  //     },
  //     pipeOut: (value: string) => {
  //       return this.builders[value].defaultSchema || {};
  //     }
  //   } : null;
  // }

  collectFromBuilders(
    callee: (builder: DSBuilder, builderName: string) => any
  ) {
    return Object.entries(this.builders).map(([name, builder]) => {
      return callee(builder, name);
    });
  }
}
