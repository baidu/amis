/**
 * @file constants.ts
 * @desc CRUD 配置相关常量
 */

import {DSFeatureEnum} from '../../builder/constants';

export const ToolsConfig = {
  groupName: 'tools',
  options: [
    {
      label: '新增记录',
      value: 'Insert',
      align: 'left',
      icon: 'fa fa-layer-group',
      order: 10
    },
    {
      label: '批量编辑',
      value: 'BulkEdit',
      align: 'left',
      icon: 'fa fa-layer-group',
      order: 20
    },
    {
      label: '批量删除',
      value: 'BulkDelete',
      align: 'left',
      icon: 'fa fa-layer-group',
      order: 30
    },
    {
      label: '数据导出',
      value: 'Export',
      align: 'left',
      icon: 'fa fa-layer-group',
      order: 40
    }
  ]
};

export const FiltersConfig = {
  groupName: 'filters',
  options: [
    {label: '模糊查询', value: 'FuzzyQuery', icon: 'fa fa-search', order: 10},
    {label: '简单查询', value: 'SimpleQuery', icon: 'fa fa-search', order: 20},
    {label: '高级查询', value: 'AdvancedQuery', icon: 'fa fa-search', order: 30}
  ]
};

export const OperatorsConfig = {
  groupName: 'operators',
  options: [
    {label: '查看详情', value: 'View', icon: 'fa fa-database', order: 10},
    {label: '编辑记录', value: 'Edit', icon: 'fa fa-database', order: 20},
    {label: '删除记录', value: 'Delete', icon: 'fa fa-database', order: 30}
  ]
};

/** 表格数据展示的默认最大行数 */
export const DefaultMaxDisplayRows = 5;
