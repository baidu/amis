/**
 * @file constants.ts
 * @desc builder 相关常量
 */

import {FormOperatorValue, FormOperator} from './type';

/**
 * 数据源所需操作，目前是因为schema从后端来
 */
export enum DSBehavior {
  /** 创建操作 */
  create = 'create',
  /** 查询操作 */
  view = 'view',
  /** 更新操作 */
  update = 'update',
  table = 'table',
  filter = 'filter'
}

/** 数据粒度 */
export enum DSGrain {
  /** 实体 */
  entity = 'entity',
  /** 多条数据 */
  list = 'list',
  /** 单条数据 */
  piece = 'piece'
}

/** 数据源所使用的功能场景 */
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
    label: '数据导出'
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

export enum DSFeatureEnum {
  List = 'List',
  Insert = 'Insert',
  View = 'View',
  Edit = 'Edit',
  Delete = 'Delete',
  BulkEdit = 'BulkEdit',
  BulkDelete = 'BulkDelete',
  Import = 'Import',
  Export = 'Export',
  SimpleQuery = 'SimpleQuery',
  FuzzyQuery = 'FuzzyQuery',
  AdvancedQuery = 'AdvancedQuery'
}

export const DSFeatureList = Object.keys(
  DSFeature
) as (keyof typeof DSFeature)[];

export const FormOperatorMap: Record<FormOperatorValue, FormOperator> = {
  cancel: {
    label: '取消',
    value: 'cancel',
    order: 0,
    schema: {
      level: 'default'
    }
  },
  reset: {
    label: '重置',
    value: 'reset',
    order: 1,
    schema: {
      level: 'default'
    }
  },
  submit: {
    label: '提交',
    value: 'submit',
    order: 2,
    schema: {
      level: 'primary'
    }
  }
};

export const ModelDSBuilderKey = 'model-entity';

export const ApiDSBuilderKey = 'api';

export const ApiCenterDSBuilderKey = 'apicenter';
