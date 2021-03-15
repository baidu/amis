import React from 'react';
import makeMarkdownRenderer from './MdRenderer';

export const components = [
  {
    label: '布局',
    children: [
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
        label: 'Array 数组输入框',
        path: '/zh-CN/components/form/array',
        getComponent: () =>
          // @ts-ignore
          import('../../docs/zh-CN/components/form/array.md').then(
            makeMarkdownRenderer
          )
      },
      {
        label: 'Button 按钮',
        path: '/zh-CN/components/form/button',
        getComponent: () =>
          // @ts-ignore
          import('../../docs/zh-CN/components/form/button.md').then(
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
        label: 'Button-Group 按钮集合',
        path: '/zh-CN/components/form/button-group',
        getComponent: () =>
          // @ts-ignore
          import('../../docs/zh-CN/components/form/button-group.md').then(
            makeMarkdownRenderer
          )
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
        label: 'City 城市选择器',
        path: '/zh-CN/components/form/city',
        getComponent: () =>
          // @ts-ignore
          import('../../docs/zh-CN/components/form/city.md').then(
            makeMarkdownRenderer
          )
      },
      {
        label: 'Color 颜色选择器',
        path: '/zh-CN/components/form/color',
        getComponent: () =>
          // @ts-ignore
          import('../../docs/zh-CN/components/form/color.md').then(
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
        label: 'Date 日期选择器',
        path: '/zh-CN/components/form/date',
        getComponent: () =>
          // @ts-ignore
          import('../../docs/zh-CN/components/form/date.md').then(
            makeMarkdownRenderer
          )
      },
      {
        label: 'Datetime 日期时间选择器',
        path: '/zh-CN/components/form/datetime',
        getComponent: () =>
          // @ts-ignore
          import('../../docs/zh-CN/components/form/datetime.md').then(
            makeMarkdownRenderer
          )
      },
      {
        label: 'Month 月份选择器',
        path: '/zh-CN/components/form/month',
        getComponent: () =>
          // @ts-ignore
          import('../../docs/zh-CN/components/form/month.md').then(
            makeMarkdownRenderer
          )
      },
      {
        label: 'Date-Range 日期范围选择器',
        path: '/zh-CN/components/form/date-range',
        getComponent: () =>
          // @ts-ignore
          import('../../docs/zh-CN/components/form/date-range.md').then(
            makeMarkdownRenderer
          )
      },
      {
        label: 'Datetime-Range 日期时间范围',
        path: '/zh-CN/components/form/datetime-range',
        getComponent: () =>
          // @ts-ignore
          import('../../docs/zh-CN/components/form/datetime-range.md').then(
            makeMarkdownRenderer
          )
      },
      {
        label: 'Month-Range 月份范围',
        path: '/zh-CN/components/form/month-range',
        getComponent: () =>
          // @ts-ignore
          import('../../docs/zh-CN/components/form/month-range.md').then(
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
        label: 'File 文件上传',
        path: '/zh-CN/components/form/file',
        getComponent: () =>
          // @ts-ignore
          import('../../docs/zh-CN/components/form/file.md').then(
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
        label: 'Grid 水平布局',
        path: '/zh-CN/components/form/grid',
        getComponent: () =>
          // @ts-ignore
          import('../../docs/zh-CN/components/form/grid.md').then(
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
        label: 'HBox',
        path: '/zh-CN/components/form/hbox',
        getComponent: () =>
          // @ts-ignore
          import('../../docs/zh-CN/components/form/hbox.md').then(
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
        label: 'Image 图片',
        path: '/zh-CN/components/form/image',
        getComponent: () =>
          // @ts-ignore
          import('../../docs/zh-CN/components/form/image.md').then(
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
        label: 'List 选择器',
        path: '/zh-CN/components/form/list',
        getComponent: () =>
          // @ts-ignore
          import('../../docs/zh-CN/components/form/list.md').then(
            makeMarkdownRenderer
          )
      },
      {
        label: 'Location 地理位置',
        path: '/zh-CN/components/form/location',
        getComponent: () =>
          // @ts-ignore
          import('../../docs/zh-CN/components/form/location.md').then(
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
        label: 'Matrix 矩阵',
        path: '/zh-CN/components/form/matrix',
        getComponent: () =>
          // @ts-ignore
          import('../../docs/zh-CN/components/form/matrix.md').then(
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
        label: 'Number 数字输入框',
        path: '/zh-CN/components/form/number',
        getComponent: () =>
          // @ts-ignore
          import('../../docs/zh-CN/components/form/number.md').then(
            makeMarkdownRenderer
          )
      },
      {
        label: 'Panel 面板',
        path: '/zh-CN/components/form/panel',
        getComponent: () =>
          // @ts-ignore
          import('../../docs/zh-CN/components/form/panel.md').then(
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
        label: 'Quarter 季度',
        path: '/zh-CN/components/form/quarter',
        getComponent: () =>
          // @ts-ignore
          import('../../docs/zh-CN/components/form/quarter.md').then(
            makeMarkdownRenderer
          )
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
        label: 'Rating 评分',
        path: '/zh-CN/components/form/rating',
        getComponent: () =>
          // @ts-ignore
          import('../../docs/zh-CN/components/form/rating.md').then(
            makeMarkdownRenderer
          )
      },
      {
        label: 'Range 滑块',
        path: '/zh-CN/components/form/range',
        getComponent: () =>
          // @ts-ignore
          import('../../docs/zh-CN/components/form/range.md').then(
            makeMarkdownRenderer
          )
      },
      {
        label: 'Repeat 重复频率选择器',
        path: '/zh-CN/components/form/repeat',
        getComponent: () =>
          // @ts-ignore
          import('../../docs/zh-CN/components/form/repeat.md').then(
            makeMarkdownRenderer
          )
      },
      {
        label: 'Rich-Text 富文本编辑器',
        path: '/zh-CN/components/form/rich-text',
        getComponent: () =>
          // @ts-ignore
          import('../../docs/zh-CN/components/form/rich-text.md').then(
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
        label: 'Service 功能容器',
        path: '/zh-CN/components/form/service',
        getComponent: () =>
          // @ts-ignore
          import('../../docs/zh-CN/components/form/service.md').then(
            makeMarkdownRenderer
          )
      },
      {
        label: 'SubForm 子表单',
        path: '/zh-CN/components/form/subform',
        getComponent: () =>
          // @ts-ignore
          import('../../docs/zh-CN/components/form/subform.md').then(
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
        label: 'Tabs 选项卡',
        path: '/zh-CN/components/form/tabs',
        getComponent: () =>
          // @ts-ignore
          import('../../docs/zh-CN/components/form/tabs.md').then(
            makeMarkdownRenderer
          )
      },
      {
        label: 'Table 表格',
        path: '/zh-CN/components/form/table',
        getComponent: () =>
          // @ts-ignore
          import('../../docs/zh-CN/components/form/table.md').then(
            makeMarkdownRenderer
          )
      },
      {
        label: 'Tag 标签选择器',
        path: '/zh-CN/components/form/tag',
        getComponent: () =>
          // @ts-ignore
          import('../../docs/zh-CN/components/form/tag.md').then(
            makeMarkdownRenderer
          )
      },
      {
        label: 'Text 输入框',
        path: '/zh-CN/components/form/text',
        getComponent: () =>
          // @ts-ignore
          import('../../docs/zh-CN/components/form/text.md').then(
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
        label: 'Time 时间',
        path: '/zh-CN/components/form/time',
        getComponent: () =>
          // @ts-ignore
          import('../../docs/zh-CN/components/form/time.md').then(
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
        label: 'Tree 树形选择框',
        path: '/zh-CN/components/form/tree',
        getComponent: () =>
          // @ts-ignore
          import('../../docs/zh-CN/components/form/tree.md').then(
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
        label: 'Year 年',
        path: '/zh-CN/components/form/year',
        getComponent: () =>
          // @ts-ignore
          import('../../docs/zh-CN/components/form/year.md').then(
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
        label: 'Progress 进度条',
        path: '/zh-CN/components/progress',
        getComponent: () =>
          // @ts-ignore
          import('../../docs/zh-CN/components/progress.md').then(
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
        label: 'Switch 开关',
        path: '/zh-CN/components/switch',
        getComponent: () =>
          // @ts-ignore
          import('../../docs/zh-CN/components/switch.md').then(
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
        label: 'Wizard 向导',
        path: '/zh-CN/components/wizard',
        getComponent: () =>
          // @ts-ignore
          import('../../docs/zh-CN/components/wizard.md').then(
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
