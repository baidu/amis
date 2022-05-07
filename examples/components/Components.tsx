import React from 'react';
import {Switch} from 'react-router-dom';
import {navigations2route} from './App';
import makeMarkdownRenderer from './MdRenderer';
function wrapDoc(doc: any) {
  return {
    default: makeMarkdownRenderer(doc)
  };
}

export const components = [
  {
    label: '布局',
    children: [
      {
        label: '组件介绍',
        path: '/zh-CN/components/index',
        component: React.lazy(() =>
          import('../../docs/zh-CN/components/index.md').then(wrapDoc)
        )
      },
      {
        label: 'Page 页面',
        path: '/zh-CN/components/page',
        component: React.lazy(() =>
          import('../../docs/zh-CN/components/page.md').then(wrapDoc)
        )
      },
      {
        label: 'Container 容器',
        path: '/zh-CN/components/container',
        component: React.lazy(() =>
          import('../../docs/zh-CN/components/container.md').then(wrapDoc)
        )
      },
      {
        label: 'Collapse 折叠器',
        path: '/zh-CN/components/collapse',
        component: React.lazy(() =>
          import('../../docs/zh-CN/components/collapse.md').then(wrapDoc)
        )
      },
      {
        label: 'Divider 分割线',
        path: '/zh-CN/components/divider',
        component: React.lazy(() =>
          import('../../docs/zh-CN/components/divider.md').then(wrapDoc)
        )
      },
      {
        label: 'Flex 布局',
        path: '/zh-CN/components/flex',
        component: React.lazy(() =>
          import('../../docs/zh-CN/components/flex.md').then(wrapDoc)
        )
      },
      {
        label: 'Grid 水平分栏',
        path: '/zh-CN/components/grid',
        component: React.lazy(() =>
          import('../../docs/zh-CN/components/grid.md').then(wrapDoc)
        )
      },
      {
        label: 'Grid 2D 布局',
        path: '/zh-CN/components/grid-2d',
        component: React.lazy(() =>
          import('../../docs/zh-CN/components/grid-2d.md').then(wrapDoc)
        )
      },
      {
        label: 'HBox 布局',
        path: '/zh-CN/components/hbox',
        component: React.lazy(() =>
          import('../../docs/zh-CN/components/hbox.md').then(wrapDoc)
        )
      },
      {
        label: 'Pagination分页',
        path: '/zh-CN/components/pagination',
        component: React.lazy(() =>
          import('../../docs/zh-CN/components/pagination.md').then(
            wrapDoc
          )
        )
      },
      {
        label: 'PaginationWrapper 分页容器',
        path: '/zh-CN/components/pagination-wrapper',
        component: React.lazy(() =>
          import('../../docs/zh-CN/components/pagination-wrapper.md').then(
            wrapDoc
          )
        )
      },
      {
        label: 'Panel 面板',
        path: '/zh-CN/components/panel',
        component: React.lazy(() =>
          import('../../docs/zh-CN/components/panel.md').then(wrapDoc)
        )
      },
      {
        label: 'Tabs 选项卡',
        path: '/zh-CN/components/tabs',
        component: React.lazy(() =>
          import('../../docs/zh-CN/components/tabs.md').then(wrapDoc)
        )
      },
      {
        label: 'Wrapper 包裹容器',
        path: '/zh-CN/components/wrapper',
        component: React.lazy(() =>
          import('../../docs/zh-CN/components/wrapper.md').then(wrapDoc)
        )
      },
      {
        label: 'Portlet 门户栏目',
        path: '/zh-CN/components/portlet',
        component: React.lazy(() =>
          import('../../docs/zh-CN/components/portlet.md').then(wrapDoc)
        )
      }
    ]
  },
  {
    label: '功能',
    children: [
      {
        label: 'Action 行为按钮',
        path: '/zh-CN/components/action',
        component: React.lazy(() =>
          import('../../docs/zh-CN/components/action.md').then(wrapDoc)
        )
      },
      {
        label: 'App 多页应用',
        path: '/zh-CN/components/app',
        component: React.lazy(() =>
          import('../../docs/zh-CN/components/app.md').then(wrapDoc)
        )
      },
      {
        label: 'Button 按钮',
        path: '/zh-CN/components/button',
        component: React.lazy(() =>
          import('../../docs/zh-CN/components/button.md').then(wrapDoc)
        )
      },
      {
        label: 'ButtonGroup 按钮组',
        path: '/zh-CN/components/button-group',
        component: React.lazy(() =>
          import('../../docs/zh-CN/components/button-group.md').then(wrapDoc)
        )
      },
      {
        label: 'Breadcrumb 面包屑',
        path: '/zh-CN/components/breadcrumb',
        component: React.lazy(() =>
          import('../../docs/zh-CN/components/breadcrumb.md').then(wrapDoc)
        )
      },
      {
        label: 'Custom 自定义组件',
        path: '/zh-CN/components/custom',
        component: React.lazy(() =>
          import('../../docs/zh-CN/components/custom.md').then(wrapDoc)
        )
      },
      {
        label: 'DropDownButton 下拉按钮',
        path: '/zh-CN/components/dropdown-button',
        component: React.lazy(() =>
          import('../../docs/zh-CN/components/dropdown-button.md').then(wrapDoc)
        )
      },
      {
        label: 'Service 功能型容器',
        path: '/zh-CN/components/service',
        component: React.lazy(() =>
          import('../../docs/zh-CN/components/service.md').then(wrapDoc)
        )
      },
      {
        label: 'Nav 导航',
        path: '/zh-CN/components/nav',
        component: React.lazy(() =>
          import('../../docs/zh-CN/components/nav.md').then(wrapDoc)
        )
      },
      {
        label: 'AnchorNav 锚点导航',
        path: '/zh-CN/components/anchor-nav',
        component: React.lazy(() =>
          import('../../docs/zh-CN/components/anchor-nav.md').then(wrapDoc)
        )
      },
      {
        label: 'TooltipWrapper 文字提示容器',
        path: '/zh-CN/components/tooltip',
        component: React.lazy(() =>
          import('../../docs/zh-CN/components/tooltip-wrapper.md').then(wrapDoc)
        )
      },
      {
        label: 'PopOver 弹出提示',
        path: '/zh-CN/components/popover',
        component: React.lazy(() =>
          import('../../docs/zh-CN/components/popover.md').then(wrapDoc)
        )
      }
    ]
  },

  {
    label: '数据输入',
    children: [
      {
        label: 'Form 表单',
        path: '/zh-CN/components/form/index',
        component: React.lazy(() =>
          import('../../docs/zh-CN/components/form/index.md').then(wrapDoc)
        )
      },
      {
        label: 'FormItem 表单项通用',
        path: '/zh-CN/components/form/formitem',
        component: React.lazy(() =>
          import('../../docs/zh-CN/components/form/formitem.md').then(wrapDoc)
        )
      },
      {
        label: 'Options 选择器表单项',
        path: '/zh-CN/components/form/options',
        component: React.lazy(() =>
          import('../../docs/zh-CN/components/form/options.md').then(wrapDoc)
        )
      },
      {
        label: 'InputArray 数组输入框',
        path: '/zh-CN/components/form/input-array',
        component: React.lazy(() =>
          import('../../docs/zh-CN/components/form/input-array.md').then(
            wrapDoc
          )
        )
      },
      {
        label: 'ButtonToolbar 按钮工具栏',
        path: '/zh-CN/components/form/button-toolbar',
        component: React.lazy(() =>
          import('../../docs/zh-CN/components/form/button-toolbar.md').then(
            wrapDoc
          )
        )
      },
      {
        label: 'ButtonGroupSelect 按钮点选',
        path: '/zh-CN/components/form/button-group-select',
        component: React.lazy(() =>
          import(
            '../../docs/zh-CN/components/form/button-group-select.md'
          ).then(wrapDoc)
        )
      },
      {
        label: 'ChainedSelect 链式下拉框',
        path: '/zh-CN/components/form/chain-select',
        component: React.lazy(() =>
          import('../../docs/zh-CN/components/form/chain-select.md').then(
            wrapDoc
          )
        )
      },
      {
        label: 'Checkbox 勾选框',
        path: '/zh-CN/components/form/checkbox',
        component: React.lazy(() =>
          import('../../docs/zh-CN/components/form/checkbox.md').then(wrapDoc)
        )
      },
      {
        label: 'Checkboxes 复选框',
        path: '/zh-CN/components/form/checkboxes',
        component: React.lazy(() =>
          import('../../docs/zh-CN/components/form/checkboxes.md').then(wrapDoc)
        )
      },
      {
        label: 'InputCity 城市选择器',
        path: '/zh-CN/components/form/input-city',
        component: React.lazy(() =>
          import('../../docs/zh-CN/components/form/input-city.md').then(wrapDoc)
        )
      },
      {
        label: 'InputColor 颜色选择器',
        path: '/zh-CN/components/form/input-color',
        component: React.lazy(() =>
          import('../../docs/zh-CN/components/form/input-color.md').then(
            wrapDoc
          )
        )
      },
      {
        label: 'Combo 组合',
        path: '/zh-CN/components/form/combo',
        component: React.lazy(() =>
          import('../../docs/zh-CN/components/form/combo.md').then(wrapDoc)
        )
      },
      {
        label: 'ConditionBuilder 条件组合',
        path: '/zh-CN/components/form/condition-builder',
        component: React.lazy(() =>
          import('../../docs/zh-CN/components/form/condition-builder.md').then(
            wrapDoc
          )
        )
      },
      {
        label: 'InputDate 日期选择器',
        path: '/zh-CN/components/form/input-date',
        component: React.lazy(() =>
          import('../../docs/zh-CN/components/form/input-date.md').then(wrapDoc)
        )
      },
      {
        label: 'InputDatetime 日期时间选择器',
        path: '/zh-CN/components/form/input-datetime',
        component: React.lazy(() =>
          import('../../docs/zh-CN/components/form/input-datetime.md').then(
            wrapDoc
          )
        )
      },
      {
        label: 'InputMonth 月份选择器',
        path: '/zh-CN/components/form/input-month',
        component: React.lazy(() =>
          import('../../docs/zh-CN/components/form/input-month.md').then(
            wrapDoc
          )
        )
      },
      {
        label: 'InputDateRange 日期范围选择器',
        path: '/zh-CN/components/form/input-date-range',
        component: React.lazy(() =>
          import('../../docs/zh-CN/components/form/input-date-range.md').then(
            wrapDoc
          )
        )
      },
      {
        label: 'InputDatetimeRange 日期时间范围',
        path: '/zh-CN/components/form/input-datetime-range',
        component: React.lazy(() =>
          import(
            '../../docs/zh-CN/components/form/input-datetime-range.md'
          ).then(wrapDoc)
        )
      },
      {
        label: 'InputMonthRange 月份范围',
        path: '/zh-CN/components/form/input-month-range',
        component: React.lazy(() =>
          import('../../docs/zh-CN/components/form/input-month-range.md').then(
            wrapDoc
          )
        )
      },
      {
        label: 'InputKV 键值对',
        path: '/zh-CN/components/form/input-kv',
        component: React.lazy(() =>
          import('../../docs/zh-CN/components/form/input-kv.md').then(wrapDoc)
        )
      },
      {
        label: 'InputFormula 公式编辑器',
        path: '/zh-CN/components/form/input-formula',
        component: React.lazy(() =>
          import('../../docs/zh-CN/components/form/input-formula.md').then(
            wrapDoc
          )
        )
      },
      {
        label: 'DiffEditor 对比编辑器',
        path: '/zh-CN/components/form/diff-editor',
        component: React.lazy(() =>
          import('../../docs/zh-CN/components/form/diff-editor.md').then(
            wrapDoc
          )
        )
      },
      {
        label: 'Editor 代码编辑器',
        path: '/zh-CN/components/form/editor',
        component: React.lazy(() =>
          import('../../docs/zh-CN/components/form/editor.md').then(wrapDoc)
        )
      },
      {
        label: 'FieldSet 表单项集合',
        path: '/zh-CN/components/form/fieldset',
        component: React.lazy(() =>
          import('../../docs/zh-CN/components/form/fieldset.md').then(wrapDoc)
        )
      },
      {
        label: 'InputExcel Excel 解析',
        path: '/zh-CN/components/form/input-excel',
        component: React.lazy(() =>
          import('../../docs/zh-CN/components/form/input-excel.md').then(
            wrapDoc
          )
        )
      },
      {
        label: 'InputFile 文件上传',
        path: '/zh-CN/components/form/input-file',
        component: React.lazy(() =>
          import('../../docs/zh-CN/components/form/input-file.md').then(wrapDoc)
        )
      },
      {
        label: 'Formula 公式',
        path: '/zh-CN/components/form/formula',
        component: React.lazy(() =>
          import('../../docs/zh-CN/components/form/formula.md').then(wrapDoc)
        )
      },
      {
        label: 'Group 表单项组',
        path: '/zh-CN/components/form/group',
        component: React.lazy(() =>
          import('../../docs/zh-CN/components/form/group.md').then(wrapDoc)
        )
      },
      {
        label: 'Hidden 隐藏字段',
        path: '/zh-CN/components/form/hidden',
        component: React.lazy(() =>
          import('../../docs/zh-CN/components/form/hidden.md').then(wrapDoc)
        )
      },
      {
        label: 'InputImage 图片',
        path: '/zh-CN/components/form/input-image',
        component: React.lazy(() =>
          import('../../docs/zh-CN/components/form/input-image.md').then(
            wrapDoc
          )
        )
      },
      {
        label: 'InputGroup 输入框组合',
        path: '/zh-CN/components/form/input-group',
        component: React.lazy(() =>
          import('../../docs/zh-CN/components/form/input-group.md').then(
            wrapDoc
          )
        )
      },
      {
        label: 'ListSelect 选择器',
        path: '/zh-CN/components/form/list-select',
        component: React.lazy(() =>
          import('../../docs/zh-CN/components/form/list-select.md').then(
            wrapDoc
          )
        )
      },
      {
        label: 'LocationPicker 地理位置',
        path: '/zh-CN/components/form/location-picker',
        component: React.lazy(() =>
          import('../../docs/zh-CN/components/form/location-picker.md').then(
            wrapDoc
          )
        )
      },
      {
        label: 'UUID 随机 ID',
        path: '/zh-CN/components/form/uuid',
        component: React.lazy(() =>
          import('../../docs/zh-CN/components/form/uuid.md').then(wrapDoc)
        )
      },
      {
        label: 'MatrixCheckboxes 矩阵勾选',
        path: '/zh-CN/components/form/matrix-checkboxes',
        component: React.lazy(() =>
          import('../../docs/zh-CN/components/form/matrix-checkboxes.md').then(
            wrapDoc
          )
        )
      },
      {
        label: 'NestedSelect 级联选择器',
        path: '/zh-CN/components/form/nestedselect',
        component: React.lazy(() =>
          import('../../docs/zh-CN/components/form/nestedselect.md').then(
            wrapDoc
          )
        )
      },
      {
        label: 'InputNumber 数字输入',
        path: '/zh-CN/components/form/input-number',
        component: React.lazy(() =>
          import('../../docs/zh-CN/components/form/input-number.md').then(
            wrapDoc
          )
        )
      },
      {
        label: 'InputPassword 密码输入框',
        path: '/zh-CN/components/form/input-password',
        component: React.lazy(() =>
          import('../../docs/zh-CN/components/form/input-password.md').then(
            wrapDoc
          )
        )
      },
      {
        label: 'Picker 列表选择器',
        path: '/zh-CN/components/form/picker',
        component: React.lazy(() =>
          import('../../docs/zh-CN/components/form/picker.md').then(wrapDoc)
        )
      },
      {
        label: 'InputQuarter 季度',
        path: '/zh-CN/components/form/input-quarter',
        component: React.lazy(() =>
          import('../../docs/zh-CN/components/form/input-quarter.md').then(
            wrapDoc
          )
        )
      },
      {
        label: 'InputQuarterRange 季度范围',
        path: '/zh-CN/components/form/input-quarter-range',
        component: React.lazy(() =>
          import(
            '../../docs/zh-CN/components/form/input-quarter-range.md'
          ).then(wrapDoc)
        )
      },
      {
        label: 'Radios 单选框',
        path: '/zh-CN/components/form/radios',
        component: React.lazy(() =>
          import('../../docs/zh-CN/components/form/radios.md').then(wrapDoc)
        )
      },

      {
        label: ' ChartRadios 图表单选框',
        path: '/zh-CN/components/form/chart-radios',
        component: React.lazy(() =>
          import('../../docs/zh-CN/components/form/chart-radios.md').then(
            wrapDoc
          )
        )
      },
      {
        label: 'InputRating 评分',
        path: '/zh-CN/components/form/input-rating',
        component: React.lazy(() =>
          import('../../docs/zh-CN/components/form/input-rating.md').then(
            wrapDoc
          )
        )
      },
      {
        label: 'InputRange 滑块',
        path: '/zh-CN/components/form/input-range',
        component: React.lazy(() =>
          import('../../docs/zh-CN/components/form/input-range.md').then(
            wrapDoc
          )
        )
      },
      {
        label: 'InputRepeat 重复频率选择器',
        path: '/zh-CN/components/form/input-repeat',
        component: React.lazy(() =>
          import('../../docs/zh-CN/components/form/input-repeat.md').then(
            wrapDoc
          )
        )
      },
      {
        label: 'InputRichText 富文本编辑器',
        path: '/zh-CN/components/form/input-rich-text',
        component: React.lazy(() =>
          import('../../docs/zh-CN/components/form/input-rich-text.md').then(
            wrapDoc
          )
        )
      },
      {
        label: 'Select 下拉框',
        path: '/zh-CN/components/form/select',
        component: React.lazy(() =>
          import('../../docs/zh-CN/components/form/select.md').then(wrapDoc)
        )
      },
      {
        label: 'InputSubForm 子表单',
        path: '/zh-CN/components/form/input-sub-form',
        component: React.lazy(() =>
          import('../../docs/zh-CN/components/form/input-sub-form.md').then(
            wrapDoc
          )
        )
      },
      {
        label: 'Switch 开关',
        path: '/zh-CN/components/form/switch',
        component: React.lazy(() =>
          import('../../docs/zh-CN/components/form/switch.md').then(wrapDoc)
        )
      },
      {
        label: 'Static 静态展示',
        path: '/zh-CN/components/form/static',
        component: React.lazy(() =>
          import('../../docs/zh-CN/components/form/static.md').then(wrapDoc)
        )
      },
      {
        label: 'InputTable 表格',
        path: '/zh-CN/components/form/input-table',
        component: React.lazy(() =>
          import('../../docs/zh-CN/components/form/input-table.md').then(
            wrapDoc
          )
        )
      },
      {
        label: 'InputTag 标签选择器',
        path: '/zh-CN/components/form/input-tag',
        component: React.lazy(() =>
          import('../../docs/zh-CN/components/form/input-tag.md').then(wrapDoc)
        )
      },
      {
        label: 'InputText 输入框',
        path: '/zh-CN/components/form/input-text',
        component: React.lazy(() =>
          import('../../docs/zh-CN/components/form/input-text.md').then(wrapDoc)
        )
      },
      {
        label: 'Textarea 多行输入框',
        path: '/zh-CN/components/form/textarea',
        component: React.lazy(() =>
          import('../../docs/zh-CN/components/form/textarea.md').then(wrapDoc)
        )
      },
      {
        label: 'InputTime 时间',
        path: '/zh-CN/components/form/input-time',
        component: React.lazy(() =>
          import('../../docs/zh-CN/components/form/input-time.md').then(wrapDoc)
        )
      },
      {
        label: 'InputTimeRange 时间',
        path: '/zh-CN/components/form/input-time-range',
        component: React.lazy(() =>
          import('../../docs/zh-CN/components/form/input-time-range.md').then(
            wrapDoc
          )
        )
      },
      {
        label: 'Transfer 穿梭器',
        path: '/zh-CN/components/form/transfer',
        component: React.lazy(() =>
          import('../../docs/zh-CN/components/form/transfer.md').then(wrapDoc)
        )
      },
      {
        label: 'TransferPicker 穿梭选择器',
        path: '/zh-CN/components/form/transfer-picker',
        component: React.lazy(() =>
          import('../../docs/zh-CN/components/form/transfer-picker.md').then(
            wrapDoc
          )
        )
      },
      {
        label: 'TabsTransfer 组合穿梭器',
        path: '/zh-CN/components/form/tabs-transfer',
        component: React.lazy(() =>
          import('../../docs/zh-CN/components/form/tabs-transfer.md').then(
            wrapDoc
          )
        )
      },
      {
        label: 'TabsTransferPicker 组合穿梭选择器',
        path: '/zh-CN/components/form/tabs-transfer-picker',
        component: React.lazy(() =>
          import(
            '../../docs/zh-CN/components/form/tabs-transfer-picker.md'
          ).then(wrapDoc)
        )
      },
      {
        label: 'InputTree 树形选择框',
        path: '/zh-CN/components/form/input-tree',
        component: React.lazy(() =>
          import('../../docs/zh-CN/components/form/input-tree.md').then(wrapDoc)
        )
      },
      {
        label: 'TreeSelect 树形选择器',
        path: '/zh-CN/components/form/treeselect',
        component: React.lazy(() =>
          import('../../docs/zh-CN/components/form/treeselect.md').then(wrapDoc)
        )
      },
      {
        label: 'InputYear 年输入',
        path: '/zh-CN/components/form/input-year',
        component: React.lazy(() =>
          import('../../docs/zh-CN/components/form/input-year.md').then(wrapDoc)
        )
      },
      {
        label: 'InputYearRange 年份范围',
        path: '/zh-CN/components/form/input-year-range',
        component: React.lazy(() =>
          import('../../docs/zh-CN/components/form/input-year-range.md').then(
            wrapDoc
          )
        )
      },

      {
        label: 'JsonSchema Editor',
        path: '/zh-CN/components/form/json-schema-editor',
        component: React.lazy(() =>
          import('../../docs/zh-CN/components/form/json-schema-editor.md').then(
            wrapDoc
          )
        )
      }
    ]
  },

  {
    label: '数据展示',
    children: [
      {
        label: 'CRUD 增删改查',
        path: '/zh-CN/components/crud',
        component: React.lazy(() =>
          import('../../docs/zh-CN/components/crud.md').then(wrapDoc)
        )
      },

      {
        label: 'Table 表格',
        path: '/zh-CN/components/table',
        component: React.lazy(() =>
          import('../../docs/zh-CN/components/table.md').then(wrapDoc)
        )
      },
      // {
      //   label: 'Table v2 表格',
      //   path: '/zh-CN/components/table-v2',
      //   component: React.lazy(() =>
      //     import('../../docs/zh-CN/components/table-v2.md').then(wrapDoc)
      //   )
      // },
      {
        label: 'Table View 表格视图',
        path: '/zh-CN/components/table-view',
        component: React.lazy(() =>
          import('../../docs/zh-CN/components/table-view.md').then(wrapDoc)
        )
      },
      {
        label: 'Calendar 日历日程',
        path: '/zh-CN/components/calendar',
        component: React.lazy(() =>
          import('../../docs/zh-CN/components/calendar.md').then(wrapDoc)
        )
      },
      {
        label: 'Card 卡片',
        path: '/zh-CN/components/card',
        component: React.lazy(() =>
          import('../../docs/zh-CN/components/card.md').then(wrapDoc)
        )
      },
      {
        label: 'Cards 卡片组',
        path: '/zh-CN/components/cards',
        component: React.lazy(() =>
          import('../../docs/zh-CN/components/cards.md').then(wrapDoc)
        )
      },
      {
        label: 'Carousel 轮播图',
        path: '/zh-CN/components/carousel',
        component: React.lazy(() =>
          import('../../docs/zh-CN/components/carousel.md').then(wrapDoc)
        )
      },
      {
        label: 'Chart 图表',
        path: '/zh-CN/components/chart',
        component: React.lazy(() =>
          import('../../docs/zh-CN/components/chart.md').then(wrapDoc)
        )
      },

      {
        label: 'Code 代码高亮',
        path: '/zh-CN/components/code',
        component: React.lazy(() =>
          import('../../docs/zh-CN/components/code.md').then(wrapDoc)
        )
      },

      {
        label: 'Color 颜色',
        path: '/zh-CN/components/color',
        component: React.lazy(() =>
          import('../../docs/zh-CN/components/color.md').then(wrapDoc)
        )
      },

      {
        label: 'Date 日期时间',
        path: '/zh-CN/components/date',
        component: React.lazy(() =>
          import('../../docs/zh-CN/components/date.md').then(wrapDoc)
        )
      },
      {
        label: 'Each 循环渲染器',
        path: '/zh-CN/components/each',
        component: React.lazy(() =>
          import('../../docs/zh-CN/components/each.md').then(wrapDoc)
        )
      },

      {
        label: 'Html',
        path: '/zh-CN/components/html',
        component: React.lazy(() =>
          import('../../docs/zh-CN/components/html.md').then(wrapDoc)
        )
      },

      {
        label: 'Icon 图标',
        path: '/zh-CN/components/icon',
        component: React.lazy(() =>
          import('../../docs/zh-CN/components/icon.md').then(wrapDoc)
        )
      },
      {
        label: 'iFrame',
        path: '/zh-CN/components/iframe',
        component: React.lazy(() =>
          import('../../docs/zh-CN/components/iframe.md').then(wrapDoc)
        )
      },
      {
        label: 'Image 图片',
        path: '/zh-CN/components/image',
        component: React.lazy(() =>
          import('../../docs/zh-CN/components/image.md').then(wrapDoc)
        )
      },
      {
        label: 'Images 图片集',
        path: '/zh-CN/components/images',
        component: React.lazy(() =>
          import('../../docs/zh-CN/components/images.md').then(wrapDoc)
        )
      },
      {
        label: 'GridNav 宫格导航',
        path: '/zh-CN/components/grid-nav',
        component: React.lazy(() =>
          import('../../docs/zh-CN/components/grid-nav.md').then(wrapDoc)
        )
      },
      {
        label: 'Json',
        path: '/zh-CN/components/json',
        component: React.lazy(() =>
          import('../../docs/zh-CN/components/json.md').then(wrapDoc)
        )
      },
      {
        label: 'Link 链接',
        path: '/zh-CN/components/link',
        component: React.lazy(() =>
          import('../../docs/zh-CN/components/link.md').then(wrapDoc)
        )
      },
      {
        label: 'List 列表',
        path: '/zh-CN/components/list',
        component: React.lazy(() =>
          import('../../docs/zh-CN/components/list.md').then(wrapDoc)
        )
      },
      {
        label: 'Log 实时日志',
        path: '/zh-CN/components/log',
        component: React.lazy(() =>
          import('../../docs/zh-CN/components/log.md').then(wrapDoc)
        )
      },
      {
        label: 'Mapping 映射',
        path: '/zh-CN/components/mapping',
        component: React.lazy(() =>
          import('../../docs/zh-CN/components/mapping.md').then(wrapDoc)
        )
      },
      {
        label: 'Markdown 渲染',
        path: '/zh-CN/components/markdown',
        component: React.lazy(() =>
          import('../../docs/zh-CN/components/markdown.md').then(wrapDoc)
        )
      },
      {
        label: 'Progress 进度条',
        path: '/zh-CN/components/progress',
        component: React.lazy(() =>
          import('../../docs/zh-CN/components/progress.md').then(wrapDoc)
        )
      },
      {
        label: 'Steps 步骤条',
        path: '/zh-CN/components/steps',
        component: React.lazy(() =>
          import('../../docs/zh-CN/components/steps.md').then(wrapDoc)
        )
      },
      {
        label: 'Property 属性表',
        path: '/zh-CN/components/property',
        component: React.lazy(() =>
          import('../../docs/zh-CN/components/property.md').then(wrapDoc)
        )
      },
      {
        label: 'QRCode 二维码',
        path: '/zh-CN/components/qrcode',
        component: React.lazy(() =>
          import('../../docs/zh-CN/components/qrcode.md').then(wrapDoc)
        )
      },
      {
        label: 'BarCode 条形码',
        path: '/zh-CN/components/barcode',
        component: React.lazy(() =>
          import('../../docs/zh-CN/components/barcode.md').then(wrapDoc)
        )
      },
      {
        label: 'Remark 标记',
        path: '/zh-CN/components/remark',
        component: React.lazy(() =>
          import('../../docs/zh-CN/components/remark.md').then(wrapDoc)
        )
      },

      {
        label: 'SearchBox 搜索框',
        path: '/zh-CN/components/search-box',
        component: React.lazy(() =>
          import('../../docs/zh-CN/components/search-box.md').then(wrapDoc)
        )
      },

      {
        label: 'Sparkline 走势图',
        path: '/zh-CN/components/sparkline',
        component: React.lazy(() =>
          import('../../docs/zh-CN/components/sparkline.md').then(wrapDoc)
        )
      },
      {
        label: 'Status 状态',
        path: '/zh-CN/components/status',
        component: React.lazy(() =>
          import('../../docs/zh-CN/components/status.md').then(wrapDoc)
        )
      },
      {
        label: 'Tpl 模板',
        path: '/zh-CN/components/tpl',
        component: React.lazy(() =>
          import('../../docs/zh-CN/components/tpl.md').then(wrapDoc)
        )
      },
      {
        label: 'Tag 标签',
        path: '/zh-CN/components/tag',
        component: React.lazy(() =>
          import('../../docs/zh-CN/components/tag.md').then(wrapDoc)
        )
      },
      {
        label: 'Video 视频',
        path: '/zh-CN/components/video',
        component: React.lazy(() =>
          import('../../docs/zh-CN/components/video.md').then(wrapDoc)
        )
      },
      {
        label: 'Timeline 时间轴',
        path: '/zh-CN/components/timeline',
        component: React.lazy(() =>
          import('../../docs/zh-CN/components/timeline.md').then(wrapDoc)
        )
      }
    ]
  },

  {
    label: '反馈',
    children: [
      {
        label: 'Alert 提示',
        path: '/zh-CN/components/alert',
        component: React.lazy(() =>
          import('../../docs/zh-CN/components/alert.md').then(wrapDoc)
        )
      },
      {
        label: 'Dialog 对话框',
        path: '/zh-CN/components/dialog',
        component: React.lazy(() =>
          import('../../docs/zh-CN/components/dialog.md').then(wrapDoc)
        )
      },
      {
        label: 'Drawer 抽屉',
        path: '/zh-CN/components/drawer',
        component: React.lazy(() =>
          import('../../docs/zh-CN/components/drawer.md').then(wrapDoc)
        )
      },
      {
        label: 'Spinner 加载中',
        path: '/zh-CN/components/spinner',
        component: React.lazy(() =>
          import('../../docs/zh-CN/components/spinner.md').then(wrapDoc)
        )
      },
      {
        label: 'Toast 轻提示',
        path: '/zh-CN/components/toast',
        component: React.lazy(() =>
          import('../../docs/zh-CN/components/toast.md').then(wrapDoc)
        )
      }
    ]
  },

  {
    label: '其他',
    children: [
      {
        label: 'Avatar 头像',
        path: '/zh-CN/components/avatar',
        component: React.lazy(() =>
          import('../../docs/zh-CN/components/avatar.md').then(wrapDoc)
        )
      },

      {
        label: 'Audio 音频',
        path: '/zh-CN/components/audio',
        component: React.lazy(() =>
          import('../../docs/zh-CN/components/audio.md').then(wrapDoc)
        )
      },

      {
        label: 'Tasks 任务操作集合',
        path: '/zh-CN/components/tasks',
        component: React.lazy(() =>
          import('../../docs/zh-CN/components/tasks.md').then(wrapDoc)
        )
      },
      {
        label: 'Badge 角标',
        path: '/zh-CN/components/badge',
        component: React.lazy(() =>
          import('../../docs/zh-CN/components/badge.md').then(wrapDoc)
        )
      },
      {
        label: 'Wizard 向导',
        path: '/zh-CN/components/wizard',
        component: React.lazy(() =>
          import('../../docs/zh-CN/components/wizard.md').then(wrapDoc)
        )
      },
      {
        label: 'Web Component',
        path: '/zh-CN/components/web-component',
        component: React.lazy(() =>
          import('../../docs/zh-CN/components/web-component.md').then(wrapDoc)
        )
      }
    ]
  }
];

export default class Components extends React.PureComponent<any> {
  componentDidMount() {
    this.props.setNavigations(components);
  }

  componentDidUpdate(preProps: any) {
    if (this.props.location.pathname !== preProps.location.pathname) {
      this.props.setNavigations(components, false);
    }
  }

  render() {
    return (
      <Switch>
        {navigations2route(components, {
          theme: this.props.theme,
          classPrefix: this.props.classPrefix,
          locale: this.props.locale,
          viewMode: this.props.viewMode,
          offScreen: this.props.offScreen
        })}
        {/* {React.cloneElement(this.props.children as any, {
          ...(this.props.children as any).props,
          theme: this.props.theme,
          classPrefix: this.props.classPrefix,
          locale: this.props.locale,
          viewMode: this.props.viewMode,
          offScreen: this.props.offScreen
        })} */}
      </Switch>
    );
  }
}
