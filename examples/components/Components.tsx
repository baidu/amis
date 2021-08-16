import React from 'react';
import makeMarkdownRenderer from './MdRenderer';

export const components = [
  {
    label: '布局',
    children: [
      {
        label: '组件介绍',
        path: '/zh-CN/components/index',
        getComponent: () =>
          // @ts-ignore
          import('../../docs/zh-CN/components/index.md').then(
            makeMarkdownRenderer
          )
      },
      {
        label: 'Page 页面',
        path: '/zh-CN/components/page',
        getComponent: () =>
          // @ts-ignore
          import('../../docs/zh-CN/components/page.md').then(
            makeMarkdownRenderer
          )
      },
      {
        label: 'Container 容器',
        path: '/zh-CN/components/container',
        getComponent: () =>
          // @ts-ignore
          import('../../docs/zh-CN/components/container.md').then(
            makeMarkdownRenderer
          )
      },
      {
        label: 'Collapse 折叠器',
        path: '/zh-CN/components/collapse',
        getComponent: () =>
          // @ts-ignore
          import('../../docs/zh-CN/components/collapse.md').then(
            makeMarkdownRenderer
          )
      },
      {
        label: 'Divider 分割线',
        path: '/zh-CN/components/divider',
        getComponent: () =>
          // @ts-ignore
          import('../../docs/zh-CN/components/divider.md').then(
            makeMarkdownRenderer
          )
      },
      {
        label: 'Flex 布局',
        path: '/zh-CN/components/flex',
        getComponent: () =>
          // @ts-ignore
          import('../../docs/zh-CN/components/flex.md').then(
            makeMarkdownRenderer
          )
      },
      {
        label: 'Grid 水平布局',
        path: '/zh-CN/components/grid',
        getComponent: () =>
          // @ts-ignore
          import('../../docs/zh-CN/components/grid.md').then(
            makeMarkdownRenderer
          )
      },
      {
        label: 'Grid 2D 布局',
        path: '/zh-CN/components/grid-2d',
        getComponent: () =>
          // @ts-ignore
          import('../../docs/zh-CN/components/grid-2d.md').then(
            makeMarkdownRenderer
          )
      },
      {
        label: 'HBox 布局',
        path: '/zh-CN/components/hbox',
        getComponent: () =>
          // @ts-ignore
          import('../../docs/zh-CN/components/hbox.md').then(
            makeMarkdownRenderer
          )
      },
      {
        label: 'PaginationWrapper 分页容器',
        path: '/zh-CN/components/pagination-wrapper',
        getComponent: () =>
          // @ts-ignore
          import('../../docs/zh-CN/components/pagination-wrapper.md').then(
            makeMarkdownRenderer
          )
      },
      {
        label: 'Panel 面板',
        path: '/zh-CN/components/panel',
        getComponent: () =>
          // @ts-ignore
          import('../../docs/zh-CN/components/panel.md').then(
            makeMarkdownRenderer
          )
      },
      {
        label: 'Tabs 选项卡',
        path: '/zh-CN/components/tabs',
        getComponent: () =>
          // @ts-ignore
          import('../../docs/zh-CN/components/tabs.md').then(
            makeMarkdownRenderer
          )
      },
      {
        label: 'Wrapper 包裹容器',
        path: '/zh-CN/components/wrapper',
        getComponent: () =>
          // @ts-ignore
          import('../../docs/zh-CN/components/wrapper.md').then(
            makeMarkdownRenderer
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
        getComponent: () =>
          // @ts-ignore
          import('../../docs/zh-CN/components/action.md').then(
            makeMarkdownRenderer
          )
      },
      {
        label: 'App 多页应用',
        path: '/zh-CN/components/app',
        getComponent: () =>
          // @ts-ignore
          import('../../docs/zh-CN/components/app.md').then(
            makeMarkdownRenderer
          )
      },
      {
        label: 'Button 按钮',
        path: '/zh-CN/components/button',
        getComponent: () =>
          // @ts-ignore
          import('../../docs/zh-CN/components/button.md').then(
            makeMarkdownRenderer
          )
      },
      {
        label: 'ButtonGroup 按钮组',
        path: '/zh-CN/components/button-group',
        getComponent: () =>
          // @ts-ignore
          import('../../docs/zh-CN/components/button-group.md').then(
            makeMarkdownRenderer
          )
      },
      {
        label: 'Breadcrumb 面包屑',
        path: '/zh-CN/components/breadcrumb',
        getComponent: () =>
          // @ts-ignore
          import('../../docs/zh-CN/components/breadcrumb.md').then(
            makeMarkdownRenderer
          )
      },
      {
        label: 'Custom 自定义组件',
        path: '/zh-CN/components/custom',
        getComponent: () =>
          // @ts-ignore
          import('../../docs/zh-CN/components/custom.md').then(
            makeMarkdownRenderer
          )
      },
      {
        label: 'DropDownButton 下拉按钮',
        path: '/zh-CN/components/dropdown-button',
        getComponent: () =>
          // @ts-ignore
          import('../../docs/zh-CN/components/dropdown-button.md').then(
            makeMarkdownRenderer
          )
      },
      {
        label: 'Service 功能型容器',
        path: '/zh-CN/components/service',
        getComponent: () =>
          // @ts-ignore
          import('../../docs/zh-CN/components/service.md').then(
            makeMarkdownRenderer
          )
      },

      {
        label: 'Nav 导航',
        path: '/zh-CN/components/nav',
        getComponent: () =>
          // @ts-ignore
          import('../../docs/zh-CN/components/nav.md').then(
            makeMarkdownRenderer
          )
      },

      {
        label: 'AnchorNav 锚点导航',
        path: '/zh-CN/components/anchor-nav',
        getComponent: () =>
          // @ts-ignore
          import('../../docs/zh-CN/components/anchor-nav.md').then(
            makeMarkdownRenderer
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
        getComponent: () =>
          // @ts-ignore
          import('../../docs/zh-CN/components/form/index.md').then(
            makeMarkdownRenderer
          )
      },
      {
        label: 'FormItem 表单项通用',
        path: '/zh-CN/components/form/formitem',
        getComponent: () =>
          // @ts-ignore
          import('../../docs/zh-CN/components/form/formitem.md').then(
            makeMarkdownRenderer
          )
      },
      {
        label: 'Options 选择器表单项',
        path: '/zh-CN/components/form/options',
        getComponent: () =>
          // @ts-ignore
          import('../../docs/zh-CN/components/form/options.md').then(
            makeMarkdownRenderer
          )
      },
      {
        label: 'InputArray 数组输入框',
        path: '/zh-CN/components/form/input-array',
        getComponent: () =>
          // @ts-ignore
          import('../../docs/zh-CN/components/form/input-array.md').then(
            makeMarkdownRenderer
          )
      },
      {
        label: 'Button-Toolbar 按钮工具栏',
        path: '/zh-CN/components/form/button-toolbar',
        getComponent: () =>
          // @ts-ignore
          import('../../docs/zh-CN/components/form/button-toolbar.md').then(
            makeMarkdownRenderer
          )
      },
      {
        label: 'Button-Group-Select 按钮点选',
        path: '/zh-CN/components/form/button-group-select',
        getComponent: () =>
          import(
            // @ts-ignore
            '../../docs/zh-CN/components/form/button-group-select.md'
          ).then(makeMarkdownRenderer)
      },
      {
        label: 'Chain-Select 链式下拉框',
        path: '/zh-CN/components/form/chain-select',
        getComponent: () =>
          // @ts-ignore
          import('../../docs/zh-CN/components/form/chain-select.md').then(
            makeMarkdownRenderer
          )
      },
      {
        label: 'Checkbox 勾选框',
        path: '/zh-CN/components/form/checkbox',
        getComponent: () =>
          // @ts-ignore
          import('../../docs/zh-CN/components/form/checkbox.md').then(
            makeMarkdownRenderer
          )
      },
      {
        label: 'Checkboxes 复选框',
        path: '/zh-CN/components/form/checkboxes',
        getComponent: () =>
          // @ts-ignore
          import('../../docs/zh-CN/components/form/checkboxes.md').then(
            makeMarkdownRenderer
          )
      },
      {
        label: 'InputCity 城市选择器',
        path: '/zh-CN/components/form/input-city',
        getComponent: () =>
          // @ts-ignore
          import('../../docs/zh-CN/components/form/input-city.md').then(
            makeMarkdownRenderer
          )
      },
      {
        label: 'InputColor 颜色选择器',
        path: '/zh-CN/components/form/input-color',
        getComponent: () =>
          // @ts-ignore
          import('../../docs/zh-CN/components/form/input-color.md').then(
            makeMarkdownRenderer
          )
      },
      {
        label: 'Combo 组合',
        path: '/zh-CN/components/form/combo',
        getComponent: () =>
          // @ts-ignore
          import('../../docs/zh-CN/components/form/combo.md').then(
            makeMarkdownRenderer
          )
      },
      {
        label: 'Condition-Builder 条件组合',
        path: '/zh-CN/components/form/condition-builder',
        getComponent: () =>
          // @ts-ignore
          import('../../docs/zh-CN/components/form/condition-builder.md').then(
            makeMarkdownRenderer
          )
      },
      {
        label: 'InputDate 日期选择器',
        path: '/zh-CN/components/form/input-date',
        getComponent: () =>
          // @ts-ignore
          import('../../docs/zh-CN/components/form/input-date.md').then(
            makeMarkdownRenderer
          )
      },
      {
        label: 'InputDatetime 日期时间选择器',
        path: '/zh-CN/components/form/input-datetime',
        getComponent: () =>
          // @ts-ignore
          import('../../docs/zh-CN/components/form/input-datetime.md').then(
            makeMarkdownRenderer
          )
      },
      {
        label: 'InputMonth 月份选择器',
        path: '/zh-CN/components/form/input-month',
        getComponent: () =>
          // @ts-ignore
          import('../../docs/zh-CN/components/form/input-month.md').then(
            makeMarkdownRenderer
          )
      },
      {
        label: 'InputDateRange 日期范围选择器',
        path: '/zh-CN/components/form/input-date-range',
        getComponent: () =>
          // @ts-ignore
          import('../../docs/zh-CN/components/form/input-date-range.md').then(
            makeMarkdownRenderer
          )
      },
      {
        label: 'InputDatetimeRange 日期时间范围',
        path: '/zh-CN/components/form/input-datetime-range',
        getComponent: () =>
          import(
            // @ts-ignore
            '../../docs/zh-CN/components/form/input-datetime-range.md'
          ).then(makeMarkdownRenderer)
      },
      {
        label: 'InputMonthRange 月份范围',
        path: '/zh-CN/components/form/input-month-range',
        getComponent: () =>
          // @ts-ignore
          import('../../docs/zh-CN/components/form/input-month-range.md').then(
            makeMarkdownRenderer
          )
      },
      {
        label: 'DiffEditor 对比编辑器',
        path: '/zh-CN/components/form/diff-editor',
        getComponent: () =>
          // @ts-ignore
          import('../../docs/zh-CN/components/form/diff-editor.md').then(
            makeMarkdownRenderer
          )
      },
      {
        label: 'Editor 代码编辑器',
        path: '/zh-CN/components/form/editor',
        getComponent: () =>
          // @ts-ignore
          import('../../docs/zh-CN/components/form/editor.md').then(
            makeMarkdownRenderer
          )
      },
      {
        label: 'FieldSet 表单项集合',
        path: '/zh-CN/components/form/fieldset',
        getComponent: () =>
          // @ts-ignore
          import('../../docs/zh-CN/components/form/fieldset.md').then(
            makeMarkdownRenderer
          )
      },
      {
        label: 'InputFile 文件上传',
        path: '/zh-CN/components/form/input-file',
        getComponent: () =>
          // @ts-ignore
          import('../../docs/zh-CN/components/form/input-file.md').then(
            makeMarkdownRenderer
          )
      },
      {
        label: 'Formula 公式',
        path: '/zh-CN/components/form/formula',
        getComponent: () =>
          // @ts-ignore
          import('../../docs/zh-CN/components/form/formula.md').then(
            makeMarkdownRenderer
          )
      },
      {
        label: 'Group 表单项组',
        path: '/zh-CN/components/form/group',
        getComponent: () =>
          // @ts-ignore
          import('../../docs/zh-CN/components/form/group.md').then(
            makeMarkdownRenderer
          )
      },
      {
        label: 'Hidden 隐藏字段',
        path: '/zh-CN/components/form/hidden',
        getComponent: () =>
          // @ts-ignore
          import('../../docs/zh-CN/components/form/hidden.md').then(
            makeMarkdownRenderer
          )
      },
      {
        label: 'InputImage 图片',
        path: '/zh-CN/components/form/input-image',
        getComponent: () =>
          // @ts-ignore
          import('../../docs/zh-CN/components/form/input-image.md').then(
            makeMarkdownRenderer
          )
      },
      {
        label: 'Input-Group 输入框组合',
        path: '/zh-CN/components/form/input-group',
        getComponent: () =>
          // @ts-ignore
          import('../../docs/zh-CN/components/form/input-group.md').then(
            makeMarkdownRenderer
          )
      },
      {
        label: 'ListSelect 选择器',
        path: '/zh-CN/components/form/list-select',
        getComponent: () =>
          // @ts-ignore
          import('../../docs/zh-CN/components/form/list-select.md').then(
            makeMarkdownRenderer
          )
      },
      {
        label: 'LocationPicker 地理位置',
        path: '/zh-CN/components/form/location-picker',
        getComponent: () =>
          // @ts-ignore
          import('../../docs/zh-CN/components/form/location-picker.md').then(
            makeMarkdownRenderer
          )
      },
      {
        label: 'UUID 随机 ID',
        path: '/zh-CN/components/form/uuid',
        getComponent: () =>
          // @ts-ignore
          import('../../docs/zh-CN/components/form/uuid.md').then(
            makeMarkdownRenderer
          )
      },
      {
        label: 'MatrixCheckboxes 矩阵勾选',
        path: '/zh-CN/components/form/matrix-checkboxes',
        getComponent: () =>
          // @ts-ignore
          import('../../docs/zh-CN/components/form/matrix-checkboxes.md').then(
            makeMarkdownRenderer
          )
      },
      {
        label: 'NestedSelect 级联选择器',
        path: '/zh-CN/components/form/nestedselect',
        getComponent: () =>
          // @ts-ignore
          import('../../docs/zh-CN/components/form/nestedselect.md').then(
            makeMarkdownRenderer
          )
      },
      {
        label: 'InputNumber 数字输入',
        path: '/zh-CN/components/form/input-number',
        getComponent: () =>
          // @ts-ignore
          import('../../docs/zh-CN/components/form/input-number.md').then(
            makeMarkdownRenderer
          )
      },
      {
        label: 'Password 密码输入框',
        path: '/zh-CN/components/form/password',
        getComponent: () =>
          // @ts-ignore
          import('../../docs/zh-CN/components/form/password.md').then(
            makeMarkdownRenderer
          )
      },
      {
        label: 'Picker 列表选择器',
        path: '/zh-CN/components/form/picker',
        getComponent: () =>
          // @ts-ignore
          import('../../docs/zh-CN/components/form/picker.md').then(
            makeMarkdownRenderer
          )
      },
      {
        label: 'InputQuarter 季度',
        path: '/zh-CN/components/form/input-quarter',
        getComponent: () =>
          // @ts-ignore
          import('../../docs/zh-CN/components/form/input-quarter.md').then(
            makeMarkdownRenderer
          )
      },
      {
        label: 'InputQuarterRange 季度范围',
        path: '/zh-CN/components/form/input-quarter-range',
        getComponent: () =>
          import(
            // @ts-ignore
            '../../docs/zh-CN/components/form/input-quarter-range.md'
          ).then(makeMarkdownRenderer)
      },
      {
        label: 'Radios 单选框',
        path: '/zh-CN/components/form/radios',
        getComponent: () =>
          // @ts-ignore
          import('../../docs/zh-CN/components/form/radios.md').then(
            makeMarkdownRenderer
          )
      },
      {
        label: 'InputRating 评分',
        path: '/zh-CN/components/form/input-rating',
        getComponent: () =>
          // @ts-ignore
          import('../../docs/zh-CN/components/form/input-rating.md').then(
            makeMarkdownRenderer
          )
      },
      {
        label: 'InputRange 滑块',
        path: '/zh-CN/components/form/input-range',
        getComponent: () =>
          // @ts-ignore
          import('../../docs/zh-CN/components/form/input-range.md').then(
            makeMarkdownRenderer
          )
      },
      {
        label: 'InputRepeat 重复频率选择器',
        path: '/zh-CN/components/form/input-repeat',
        getComponent: () =>
          // @ts-ignore
          import('../../docs/zh-CN/components/form/input-repeat.md').then(
            makeMarkdownRenderer
          )
      },
      {
        label: 'InpuRichText 富文本编辑器',
        path: '/zh-CN/components/form/input-rich-text',
        getComponent: () =>
          // @ts-ignore
          import('../../docs/zh-CN/components/form/input-rich-text.md').then(
            makeMarkdownRenderer
          )
      },
      {
        label: 'Select 下拉框',
        path: '/zh-CN/components/form/select',
        getComponent: () =>
          // @ts-ignore
          import('../../docs/zh-CN/components/form/select.md').then(
            makeMarkdownRenderer
          )
      },
      {
        label: 'InputSubForm 子表单',
        path: '/zh-CN/components/form/input-sub-form',
        getComponent: () =>
          // @ts-ignore
          import('../../docs/zh-CN/components/form/input-subform.md').then(
            makeMarkdownRenderer
          )
      },
      {
        label: 'Switch 开关',
        path: '/zh-CN/components/form/switch',
        getComponent: () =>
          // @ts-ignore
          import('../../docs/zh-CN/components/form/switch.md').then(
            makeMarkdownRenderer
          )
      },
      {
        label: 'Static 静态展示',
        path: '/zh-CN/components/form/static',
        getComponent: () =>
          // @ts-ignore
          import('../../docs/zh-CN/components/form/static.md').then(
            makeMarkdownRenderer
          )
      },
      {
        label: 'InputTable 表格',
        path: '/zh-CN/components/form/input-table',
        getComponent: () =>
          // @ts-ignore
          import('../../docs/zh-CN/components/form/input-table.md').then(
            makeMarkdownRenderer
          )
      },
      {
        label: 'InputTag 标签选择器',
        path: '/zh-CN/components/form/input-tag',
        getComponent: () =>
          // @ts-ignore
          import('../../docs/zh-CN/components/form/input-tag.md').then(
            makeMarkdownRenderer
          )
      },
      {
        label: 'InputText 输入框',
        path: '/zh-CN/components/form/input-text',
        getComponent: () =>
          // @ts-ignore
          import('../../docs/zh-CN/components/form/input-text.md').then(
            makeMarkdownRenderer
          )
      },
      {
        label: 'Textarea 多行输入框',
        path: '/zh-CN/components/form/textarea',
        getComponent: () =>
          // @ts-ignore
          import('../../docs/zh-CN/components/form/textarea.md').then(
            makeMarkdownRenderer
          )
      },
      {
        label: 'InputTime 时间',
        path: '/zh-CN/components/form/input-time',
        getComponent: () =>
          // @ts-ignore
          import('../../docs/zh-CN/components/form/input-time.md').then(
            makeMarkdownRenderer
          )
      },
      {
        label: 'InputTimeRange 时间',
        path: '/zh-CN/components/form/input-time-range',
        getComponent: () =>
          // @ts-ignore
          import('../../docs/zh-CN/components/form/input-time-range.md').then(
            makeMarkdownRenderer
          )
      },
      {
        label: 'Transfer 穿梭器',
        path: '/zh-CN/components/form/transfer',
        getComponent: () =>
          // @ts-ignore
          import('../../docs/zh-CN/components/form/transfer.md').then(
            makeMarkdownRenderer
          )
      },
      {
        label: 'TabsTransfer 组合穿梭器',
        path: '/zh-CN/components/form/tabs-transfer',
        getComponent: () =>
          // @ts-ignore
          import('../../docs/zh-CN/components/form/tabs-transfer.md').then(
            makeMarkdownRenderer
          )
      },
      {
        label: 'InputTree 树形选择框',
        path: '/zh-CN/components/form/input-tree',
        getComponent: () =>
          // @ts-ignore
          import('../../docs/zh-CN/components/form/input-tree.md').then(
            makeMarkdownRenderer
          )
      },
      {
        label: 'TreeSelect 树形选择器',
        path: '/zh-CN/components/form/treeselect',
        getComponent: () =>
          // @ts-ignore
          import('../../docs/zh-CN/components/form/treeselect.md').then(
            makeMarkdownRenderer
          )
      },
      {
        label: 'InputYear 年输入',
        path: '/zh-CN/components/form/input-year',
        getComponent: () =>
          // @ts-ignore
          import('../../docs/zh-CN/components/form/input-year.md').then(
            makeMarkdownRenderer
          )
      },
      {
        label: 'InputYearRange 年份范围',
        path: '/zh-CN/components/form/input-year-range',
        getComponent: () =>
          // @ts-ignore
          import('../../docs/zh-CN/components/form/input-year-range.md').then(
            makeMarkdownRenderer
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
        getComponent: () =>
          // @ts-ignore
          import('../../docs/zh-CN/components/crud.md').then(
            makeMarkdownRenderer
          )
      },

      {
        label: 'Table 表格',
        path: '/zh-CN/components/table',
        getComponent: () =>
          // @ts-ignore
          import('../../docs/zh-CN/components/table.md').then(
            makeMarkdownRenderer
          )
      },
      {
        label: 'Table View 表格视图',
        path: '/zh-CN/components/table-view',
        getComponent: () =>
          // @ts-ignore
          import('../../docs/zh-CN/components/table-view.md').then(
            makeMarkdownRenderer
          )
      },
      {
        label: 'Card 卡片',
        path: '/zh-CN/components/card',
        getComponent: () =>
          // @ts-ignore
          import('../../docs/zh-CN/components/card.md').then(
            makeMarkdownRenderer
          )
      },
      {
        label: 'Cards 卡片组',
        path: '/zh-CN/components/cards',
        getComponent: () =>
          // @ts-ignore
          import('../../docs/zh-CN/components/cards.md').then(
            makeMarkdownRenderer
          )
      },
      {
        label: 'Carousel 轮播图',
        path: '/zh-CN/components/carousel',
        getComponent: () =>
          // @ts-ignore
          import('../../docs/zh-CN/components/carousel.md').then(
            makeMarkdownRenderer
          )
      },
      {
        label: 'Chart 图表',
        path: '/zh-CN/components/chart',
        getComponent: () =>
          // @ts-ignore
          import('../../docs/zh-CN/components/chart.md').then(
            makeMarkdownRenderer
          )
      },

      {
        label: 'Code 代码高亮',
        path: '/zh-CN/components/code',
        getComponent: () =>
          // @ts-ignore
          import('../../docs/zh-CN/components/code.md').then(
            makeMarkdownRenderer
          )
      },

      {
        label: 'Color 颜色',
        path: '/zh-CN/components/color',
        getComponent: () =>
          // @ts-ignore
          import('../../docs/zh-CN/components/color.md').then(
            makeMarkdownRenderer
          )
      },

      {
        label: 'Date 日期时间',
        path: '/zh-CN/components/date',
        getComponent: () =>
          // @ts-ignore
          import('../../docs/zh-CN/components/date.md').then(
            makeMarkdownRenderer
          )
      },
      {
        label: 'Each 循环渲染器',
        path: '/zh-CN/components/each',
        getComponent: () =>
          // @ts-ignore
          import('../../docs/zh-CN/components/each.md').then(
            makeMarkdownRenderer
          )
      },

      {
        label: 'Html',
        path: '/zh-CN/components/html',
        getComponent: () =>
          // @ts-ignore
          import('../../docs/zh-CN/components/html.md').then(
            makeMarkdownRenderer
          )
      },

      {
        label: 'Icon 图标',
        path: '/zh-CN/components/icon',
        getComponent: () =>
          // @ts-ignore
          import('../../docs/zh-CN/components/icon.md').then(
            makeMarkdownRenderer
          )
      },
      {
        label: 'iFrame',
        path: '/zh-CN/components/iframe',
        getComponent: () =>
          // @ts-ignore
          import('../../docs/zh-CN/components/iframe.md').then(
            makeMarkdownRenderer
          )
      },
      {
        label: 'Image 图片',
        path: '/zh-CN/components/image',
        getComponent: () =>
          // @ts-ignore
          import('../../docs/zh-CN/components/image.md').then(
            makeMarkdownRenderer
          )
      },
      {
        label: 'Images 图片集',
        path: '/zh-CN/components/images',
        getComponent: () =>
          // @ts-ignore
          import('../../docs/zh-CN/components/images.md').then(
            makeMarkdownRenderer
          )
      },
      {
        label: 'Json',
        path: '/zh-CN/components/json',
        getComponent: () =>
          // @ts-ignore
          import('../../docs/zh-CN/components/json.md').then(
            makeMarkdownRenderer
          )
      },
      {
        label: 'Link 链接',
        path: '/zh-CN/components/link',
        getComponent: () =>
          // @ts-ignore
          import('../../docs/zh-CN/components/link.md').then(
            makeMarkdownRenderer
          )
      },
      {
        label: 'List 列表',
        path: '/zh-CN/components/list',
        getComponent: () =>
          // @ts-ignore
          import('../../docs/zh-CN/components/list.md').then(
            makeMarkdownRenderer
          )
      },
      {
        label: 'Log 实时日志',
        path: '/zh-CN/components/log',
        getComponent: () =>
          // @ts-ignore
          import('../../docs/zh-CN/components/log.md').then(
            makeMarkdownRenderer
          )
      },
      {
        label: 'Mapping 映射',
        path: '/zh-CN/components/mapping',
        getComponent: () =>
          // @ts-ignore
          import('../../docs/zh-CN/components/mapping.md').then(
            makeMarkdownRenderer
          )
      },
      {
        label: 'Markdown 渲染',
        path: '/zh-CN/components/markdown',
        getComponent: () =>
          // @ts-ignore
          import('../../docs/zh-CN/components/markdown.md').then(
            makeMarkdownRenderer
          )
      },
      {
        label: 'Progress 进度条',
        path: '/zh-CN/components/progress',
        getComponent: () =>
          // @ts-ignore
          import('../../docs/zh-CN/components/progress.md').then(
            makeMarkdownRenderer
          )
      },
      {
        label: 'Steps 步骤条',
        path: '/zh-CN/components/steps',
        getComponent: () =>
          // @ts-ignore
          import('../../docs/zh-CN/components/steps.md').then(
            makeMarkdownRenderer
          )
      },
      {
        label: 'Property 属性表',
        path: '/zh-CN/components/property',
        getComponent: () =>
          // @ts-ignore
          import('../../docs/zh-CN/components/property.md').then(
            makeMarkdownRenderer
          )
      },
      {
        label: 'QRCode 二维码',
        path: '/zh-CN/components/qrcode',
        getComponent: () =>
          // @ts-ignore
          import('../../docs/zh-CN/components/qrcode.md').then(
            makeMarkdownRenderer
          )
      },
      {
        label: 'Remark 标记',
        path: '/zh-CN/components/remark',
        getComponent: () =>
          // @ts-ignore
          import('../../docs/zh-CN/components/remark.md').then(
            makeMarkdownRenderer
          )
      },

      {
        label: 'SearchBox 搜索框',
        path: '/zh-CN/components/search-box',
        getComponent: () =>
          // @ts-ignore
          import('../../docs/zh-CN/components/search-box.md').then(
            makeMarkdownRenderer
          )
      },

      {
        label: 'Sparkline 走势图',
        path: '/zh-CN/components/sparkline',
        getComponent: () =>
          // @ts-ignore
          import('../../docs/zh-CN/components/sparkline.md').then(
            makeMarkdownRenderer
          )
      },
      {
        label: 'Status 状态',
        path: '/zh-CN/components/status',
        getComponent: () =>
          // @ts-ignore
          import('../../docs/zh-CN/components/status.md').then(
            makeMarkdownRenderer
          )
      },
      {
        label: 'Tpl 模板',
        path: '/zh-CN/components/tpl',
        getComponent: () =>
          // @ts-ignore
          import('../../docs/zh-CN/components/tpl.md').then(
            makeMarkdownRenderer
          )
      },
      {
        label: 'Video 视频',
        path: '/zh-CN/components/video',
        getComponent: () =>
          // @ts-ignore
          import('../../docs/zh-CN/components/video.md').then(
            makeMarkdownRenderer
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
        getComponent: () =>
          // @ts-ignore
          import('../../docs/zh-CN/components/alert.md').then(
            makeMarkdownRenderer
          )
      },
      {
        label: 'Dialog 对话框',
        path: '/zh-CN/components/dialog',
        getComponent: () =>
          // @ts-ignore
          import('../../docs/zh-CN/components/dialog.md').then(
            makeMarkdownRenderer
          )
      },
      {
        label: 'Drawer 抽屉',
        path: '/zh-CN/components/drawer',
        getComponent: () =>
          // @ts-ignore
          import('../../docs/zh-CN/components/drawer.md').then(
            makeMarkdownRenderer
          )
      },
      {
        label: 'Spinner 加载中',
        path: '/zh-CN/components/spinner',
        getComponent: () =>
          // @ts-ignore
          import('../../docs/zh-CN/components/spinner.md').then(
            makeMarkdownRenderer
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
        getComponent: () =>
          // @ts-ignore
          import('../../docs/zh-CN/components/avatar.md').then(
            makeMarkdownRenderer
          )
      },

      {
        label: 'Audio 音频',
        path: '/zh-CN/components/audio',
        getComponent: () =>
          // @ts-ignore
          import('../../docs/zh-CN/components/audio.md').then(
            makeMarkdownRenderer
          )
      },

      {
        label: 'Tasks 任务操作集合',
        path: '/zh-CN/components/tasks',
        getComponent: () =>
          // @ts-ignore
          import('../../docs/zh-CN/components/tasks.md').then(
            makeMarkdownRenderer
          )
      },
      {
        label: 'Badge 角标',
        path: '/zh-CN/components/badge',
        getComponent: () =>
          // @ts-ignore
          import('../../docs/zh-CN/components/badge.md').then(
            makeMarkdownRenderer
          )
      },
      {
        label: 'Wizard 向导',
        path: '/zh-CN/components/wizard',
        getComponent: () =>
          // @ts-ignore
          import('../../docs/zh-CN/components/wizard.md').then(
            makeMarkdownRenderer
          )
      },
      {
        label: 'Web Component',
        path: '/zh-CN/components/web-component',
        getComponent: () =>
          // @ts-ignore
          import('../../docs/zh-CN/components/web-component.md').then(
            makeMarkdownRenderer
          )
      }
    ]
  }
];

export default class Components extends React.PureComponent<any> {
  componentDidMount() {
    this.props.setNavigations(components);
  }

  componentDidUpdate() {
    this.props.setNavigations(components);
  }

  render() {
    return (
      <>
        {React.cloneElement(this.props.children as any, {
          ...(this.props.children as any).props,
          theme: this.props.theme,
          classPrefix: this.props.classPrefix,
          locale: this.props.locale,
          viewMode: this.props.viewMode,
          offScreen: this.props.offScreen
        })}
      </>
    );
  }
}
