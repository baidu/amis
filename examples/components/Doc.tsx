import React from 'react';
import makeMarkdownRenderer from './MdRenderer';
import {flattenTree, filterTree, mapTree} from '../../src/utils/helper';

export const docs = [
  {
    // prefix: ({classnames: cx}) => <li className={cx('AsideNav-divider')} />,
    label: '📌  开始',
    children: [
      {
        label: '介绍',
        path: '/docs/index',
        getComponent: () =>
          // @ts-ignore
          import('../../docs/index.md').then(makeMarkdownRenderer)
      },

      {
        label: '快速开始',
        path: '/docs/start/getting-started',

        getComponent: () =>
          // @ts-ignore
          import('../../docs/start/getting-started.md').then(
            makeMarkdownRenderer
          )
      },

      {
        label: '常见问题',
        path: '/docs/start/faq',
        getComponent: () =>
          // @ts-ignore
          import('../../docs/start/faq.md').then(makeMarkdownRenderer)
      }
    ]
  },

  {
    label: '💡  概念',
    children: [
      {
        label: '配置与组件',
        path: '/docs/concepts/schema',
        getComponent: () =>
          // @ts-ignore
          import('../../docs/concepts/schema.md').then(makeMarkdownRenderer)
      },
      {
        label: '数据域与数据链',
        path: '/docs/concepts/datascope-and-datachain',
        getComponent: () =>
          // @ts-ignore
          import('../../docs/concepts/datascope-and-datachain.md').then(
            makeMarkdownRenderer
          )
      },
      {
        label: '模板',
        path: '/docs/concepts/template',
        getComponent: () =>
          // @ts-ignore
          import('../../docs/concepts/template.md').then(makeMarkdownRenderer)
      },
      {
        label: '数据映射',
        path: '/docs/concepts/data-mapping',
        getComponent: () =>
          // @ts-ignore
          import('../../docs/concepts/data-mapping.md').then(
            makeMarkdownRenderer
          )
      },
      {
        label: '表达式',
        path: '/docs/concepts/expression',
        getComponent: () =>
          // @ts-ignore
          import('../../docs/concepts/expression.md').then(makeMarkdownRenderer)
      },
      {
        label: '联动',
        path: '/docs/concepts/linkage',
        getComponent: () =>
          // @ts-ignore
          import('../../docs/concepts/linkage.md').then(makeMarkdownRenderer)
      },
      {
        label: '行为',
        path: '/docs/concepts/action',
        getComponent: () =>
          // @ts-ignore
          import('../../docs/concepts/action.md').then(makeMarkdownRenderer)
      },
      {
        label: '样式',
        path: '/docs/concepts/style',
        getComponent: () =>
          // @ts-ignore
          import('../../docs/concepts/style.md').then(makeMarkdownRenderer)
      }
    ]
  },

  {
    label: '💎  高级',
    children: [
      {
        label: '工作原理',
        path: '/docs/extend/internal',
        getComponent: () =>
          // @ts-ignore
          import('../../docs/extend/internal.md').then(makeMarkdownRenderer)
      },
      {
        label: '自定义组件 - SDK',
        path: '/docs/extend/custom-sdk',
        getComponent: () =>
          // @ts-ignore
          import('../../docs/extend/custom-sdk.md').then(makeMarkdownRenderer)
      },
      {
        label: '自定义组件 - React',
        path: '/docs/extend/custom-react',
        getComponent: () =>
          // @ts-ignore
          import('../../docs/extend/custom-react.md').then(makeMarkdownRenderer)
      },
      {
        label: '扩展现有组件',
        path: '/docs/extend/addon',
        getComponent: () =>
          // @ts-ignore
          import('../../docs/extend/addon.md').then(makeMarkdownRenderer)
      },
      {
        label: '多语言',
        path: '/docs/extend/i18n',
        getComponent: () =>
          // @ts-ignore
          import('../../docs/extend/i18n.md').then(makeMarkdownRenderer)
      }
    ]
  },

  {
    label: '🎼  类型',
    children: [
      {
        label: 'SchemaNode',
        path: '/docs/types/schemanode',
        getComponent: () =>
          // @ts-ignore
          import('../../docs/types/schemanode.md').then(makeMarkdownRenderer)
      },
      {
        label: 'API',
        path: '/docs/types/api',
        getComponent: () =>
          // @ts-ignore
          import('../../docs/types/api.md').then(makeMarkdownRenderer)
      },
      {
        label: 'Definitions',
        path: '/docs/types/definitions',
        getComponent: () =>
          // @ts-ignore
          import('../../docs/types/definitions.md').then(makeMarkdownRenderer)
      }
    ]
  },

  {
    label: '⚙  组件',
    children: [
      {
        label: '组件介绍',
        path: '/docs/components/component',
        getComponent: () =>
          // @ts-ignore
          import('../../docs/components/component.md').then(
            makeMarkdownRenderer
          )
      },
      {
        label: 'Page 页面',
        path: '/docs/components/page',
        getComponent: () =>
          // @ts-ignore
          import('../../docs/components/page.md').then(makeMarkdownRenderer)
      },
      {
        label: 'Form 表单',
        path: '/docs/components/form/index',
        getComponent: () =>
          // @ts-ignore
          import('../../docs/components/form/index.md').then(
            makeMarkdownRenderer
          ),
        children: [
          {
            label: 'FormItem 表单项',
            path: '/docs/components/form/formitem',
            getComponent: () =>
              // @ts-ignore
              import('../../docs/components/form/formitem.md').then(
                makeMarkdownRenderer
              )
          },
          {
            label: 'Options 选择器表单项',
            path: '/docs/components/form/options',
            getComponent: () =>
              // @ts-ignore
              import('../../docs/components/form/options.md').then(
                makeMarkdownRenderer
              )
          },
          {
            label: 'Array 数组输入框',
            path: '/docs/components/form/array',
            getComponent: () =>
              // @ts-ignore
              import('../../docs/components/form/array.md').then(
                makeMarkdownRenderer
              )
          },
          {
            label: 'Button 按钮',
            path: '/docs/components/form/button',
            getComponent: () =>
              // @ts-ignore
              import('../../docs/components/form/button.md').then(
                makeMarkdownRenderer
              )
          },
          {
            label: 'Button-Toolbar 按钮工具栏',
            path: '/docs/components/form/button-toolbar',
            getComponent: () =>
              // @ts-ignore
              import('../../docs/components/form/button-toolbar.md').then(
                makeMarkdownRenderer
              )
          },
          {
            label: 'Button-Group 按钮集合',
            path: '/docs/components/form/button-group',
            getComponent: () =>
              // @ts-ignore
              import('../../docs/components/form/button-group.md').then(
                makeMarkdownRenderer
              )
          },
          {
            label: 'Chain-Select 链式下拉框',
            path: '/docs/components/form/chain-select',
            getComponent: () =>
              // @ts-ignore
              import('../../docs/components/form/chain-select.md').then(
                makeMarkdownRenderer
              )
          },
          {
            label: 'Checkbox 勾选框',
            path: '/docs/components/form/checkbox',
            getComponent: () =>
              // @ts-ignore
              import('../../docs/components/form/checkbox.md').then(
                makeMarkdownRenderer
              )
          },
          {
            label: 'Checkboxes 复选框',
            path: '/docs/components/form/checkboxes',
            getComponent: () =>
              // @ts-ignore
              import('../../docs/components/form/checkboxes.md').then(
                makeMarkdownRenderer
              )
          },
          {
            label: 'City 城市选择器',
            path: '/docs/components/form/city',
            getComponent: () =>
              // @ts-ignore
              import('../../docs/components/form/city.md').then(
                makeMarkdownRenderer
              )
          },
          {
            label: 'Color 颜色选择器',
            path: '/docs/components/form/color',
            getComponent: () =>
              // @ts-ignore
              import('../../docs/components/form/color.md').then(
                makeMarkdownRenderer
              )
          },
          {
            label: 'Combo 组合',
            path: '/docs/components/form/combo',
            getComponent: () =>
              // @ts-ignore
              import('../../docs/components/form/combo.md').then(
                makeMarkdownRenderer
              )
          },
          {
            label: 'Date 日期选择器',
            path: '/docs/components/form/date',
            getComponent: () =>
              // @ts-ignore
              import('../../docs/components/form/date.md').then(
                makeMarkdownRenderer
              )
          },
          {
            label: 'Datetime 日期时间选择器',
            path: '/docs/components/form/datetime',
            getComponent: () =>
              // @ts-ignore
              import('../../docs/components/form/datetime.md').then(
                makeMarkdownRenderer
              )
          },
          {
            label: 'Month 月份选择器',
            path: '/docs/components/form/month',
            getComponent: () =>
              // @ts-ignore
              import('../../docs/components/form/month.md').then(
                makeMarkdownRenderer
              )
          },
          {
            label: 'Date-Range 日期范围选择器',
            path: '/docs/components/form/date-range',
            getComponent: () =>
              // @ts-ignore
              import('../../docs/components/form/date-range.md').then(
                makeMarkdownRenderer
              )
          },
          {
            label: 'Datetime-Range 日期时间范围',
            path: '/docs/components/form/datetime-range',
            getComponent: () =>
              // @ts-ignore
              import('../../docs/components/form/datetime-range.md').then(
                makeMarkdownRenderer
              )
          },
          {
            label: 'DiffEditor 对比编辑器',
            path: '/docs/components/form/diff-editor',
            getComponent: () =>
              // @ts-ignore
              import('../../docs/components/form/diff-editor.md').then(
                makeMarkdownRenderer
              )
          },
          {
            label: 'Editor 代码编辑器',
            path: '/docs/components/form/editor',
            getComponent: () =>
              // @ts-ignore
              import('../../docs/components/form/editor.md').then(
                makeMarkdownRenderer
              )
          },
          {
            label: 'FieldSet 表单项集合',
            path: '/docs/components/form/fieldset',
            getComponent: () =>
              // @ts-ignore
              import('../../docs/components/form/fieldset.md').then(
                makeMarkdownRenderer
              )
          },
          {
            label: 'File 文件上传',
            path: '/docs/components/form/file',
            getComponent: () =>
              // @ts-ignore
              import('../../docs/components/form/file.md').then(
                makeMarkdownRenderer
              )
          },
          {
            label: 'Formula 公式',
            path: '/docs/components/form/formula',
            getComponent: () =>
              // @ts-ignore
              import('../../docs/components/form/formula.md').then(
                makeMarkdownRenderer
              )
          },
          {
            label: 'Grid 网格',
            path: '/docs/components/form/grid',
            getComponent: () =>
              // @ts-ignore
              import('../../docs/components/form/grid.md').then(
                makeMarkdownRenderer
              )
          },
          {
            label: 'Group 表单项组',
            path: '/docs/components/form/group',
            getComponent: () =>
              // @ts-ignore
              import('../../docs/components/form/group.md').then(
                makeMarkdownRenderer
              )
          },
          {
            label: 'HBox',
            path: '/docs/components/form/hbox',
            getComponent: () =>
              // @ts-ignore
              import('../../docs/components/form/hbox.md').then(
                makeMarkdownRenderer
              )
          },
          {
            label: 'Hidden 隐藏字段',
            path: '/docs/components/form/hidden',
            getComponent: () =>
              // @ts-ignore
              import('../../docs/components/form/hidden.md').then(
                makeMarkdownRenderer
              )
          },
          {
            label: 'Image 图片',
            path: '/docs/components/form/image',
            getComponent: () =>
              // @ts-ignore
              import('../../docs/components/form/image.md').then(
                makeMarkdownRenderer
              )
          },
          {
            label: 'Input-Group 输入框组合',
            path: '/docs/components/form/input-group',
            getComponent: () =>
              // @ts-ignore
              import('../../docs/components/form/input-group.md').then(
                makeMarkdownRenderer
              )
          },
          {
            label: 'List 列表',
            path: '/docs/components/form/list',
            getComponent: () =>
              // @ts-ignore
              import('../../docs/components/form/list.md').then(
                makeMarkdownRenderer
              )
          },
          {
            label: 'UUID 随机 ID',
            path: '/docs/components/form/uuid',
            getComponent: () =>
              // @ts-ignore
              import('../../docs/components/form/uuid.md').then(
                makeMarkdownRenderer
              )
          },
          {
            label: 'Matrix 矩阵',
            path: '/docs/components/form/matrix',
            getComponent: () =>
              // @ts-ignore
              import('../../docs/components/form/matrix.md').then(
                makeMarkdownRenderer
              )
          },
          {
            label: 'NestedSelect 级联选择器',
            path: '/docs/components/form/nestedselect',
            getComponent: () =>
              // @ts-ignore
              import('../../docs/components/form/nestedselect.md').then(
                makeMarkdownRenderer
              )
          },
          {
            label: 'Number 数字输入框',
            path: '/docs/components/form/number',
            getComponent: () =>
              // @ts-ignore
              import('../../docs/components/form/number.md').then(
                makeMarkdownRenderer
              )
          },
          {
            label: 'Panel 面板',
            path: '/docs/components/form/panel',
            getComponent: () =>
              // @ts-ignore
              import('../../docs/components/form/panel.md').then(
                makeMarkdownRenderer
              )
          },
          {
            label: 'Picker 列表选择器',
            path: '/docs/components/form/picker',
            getComponent: () =>
              // @ts-ignore
              import('../../docs/components/form/picker.md').then(
                makeMarkdownRenderer
              )
          },
          {
            label: 'Radios 单选框',
            path: '/docs/components/form/radios',
            getComponent: () =>
              // @ts-ignore
              import('../../docs/components/form/radios.md').then(
                makeMarkdownRenderer
              )
          },
          {
            label: 'Rating 评分',
            path: '/docs/components/form/rating',
            getComponent: () =>
              // @ts-ignore
              import('../../docs/components/form/rating.md').then(
                makeMarkdownRenderer
              )
          },
          {
            label: 'Range 滑块',
            path: '/docs/components/form/range',
            getComponent: () =>
              // @ts-ignore
              import('../../docs/components/form/range.md').then(
                makeMarkdownRenderer
              )
          },
          {
            label: 'Repeat 重复频率选择器',
            path: '/docs/components/form/repeat',
            getComponent: () =>
              // @ts-ignore
              import('../../docs/components/form/repeat.md').then(
                makeMarkdownRenderer
              )
          },
          {
            label: 'Rich-Text 富文本编辑器',
            path: '/docs/components/form/rich-text',
            getComponent: () =>
              // @ts-ignore
              import('../../docs/components/form/rich-text.md').then(
                makeMarkdownRenderer
              )
          },
          {
            label: 'Select 选择器',
            path: '/docs/components/form/select',
            getComponent: () =>
              // @ts-ignore
              import('../../docs/components/form/select.md').then(
                makeMarkdownRenderer
              )
          },
          {
            label: 'Service 功能容器',
            path: '/docs/components/form/service',
            getComponent: () =>
              // @ts-ignore
              import('../../docs/components/form/service.md').then(
                makeMarkdownRenderer
              )
          },
          {
            label: 'SubForm 子表单',
            path: '/docs/components/form/subform',
            getComponent: () =>
              // @ts-ignore
              import('../../docs/components/form/subform.md').then(
                makeMarkdownRenderer
              )
          },
          {
            label: 'Switch 开关',
            path: '/docs/components/form/switch',
            getComponent: () =>
              // @ts-ignore
              import('../../docs/components/form/switch.md').then(
                makeMarkdownRenderer
              )
          },
          {
            label: 'Static 静态展示',
            path: '/docs/components/form/static',
            getComponent: () =>
              // @ts-ignore
              import('../../docs/components/form/static.md').then(
                makeMarkdownRenderer
              )
          },
          {
            label: 'Tabs 选项卡',
            path: '/docs/components/form/tabs',
            getComponent: () =>
              // @ts-ignore
              import('../../docs/components/form/tabs.md').then(
                makeMarkdownRenderer
              )
          },
          {
            label: 'Table 表格',
            path: '/docs/components/form/table',
            getComponent: () =>
              // @ts-ignore
              import('../../docs/components/form/table.md').then(
                makeMarkdownRenderer
              )
          },
          {
            label: 'Tag 标签选择器',
            path: '/docs/components/form/tag',
            getComponent: () =>
              // @ts-ignore
              import('../../docs/components/form/tag.md').then(
                makeMarkdownRenderer
              )
          },
          {
            label: 'Text 输入框',
            path: '/docs/components/form/text',
            getComponent: () =>
              // @ts-ignore
              import('../../docs/components/form/text.md').then(
                makeMarkdownRenderer
              )
          },
          {
            label: 'Textarea 多行输入框',
            path: '/docs/components/form/textarea',
            getComponent: () =>
              // @ts-ignore
              import('../../docs/components/form/textarea.md').then(
                makeMarkdownRenderer
              )
          },
          {
            label: 'Time 时间',
            path: '/docs/components/form/time',
            getComponent: () =>
              // @ts-ignore
              import('../../docs/components/form/time.md').then(
                makeMarkdownRenderer
              )
          },
          {
            label: 'Transfer 穿梭器',
            path: '/docs/components/form/transfer',
            getComponent: () =>
              // @ts-ignore
              import('../../docs/components/form/transfer.md').then(
                makeMarkdownRenderer
              )
          },
          {
            label: 'TabsTransfer 组合穿梭器',
            path: '/docs/components/form/tabs-transfer',
            getComponent: () =>
              // @ts-ignore
              import('../../docs/components/form/tabs-transfer.md').then(
                makeMarkdownRenderer
              )
          },
          {
            label: 'Tree 树形选择框',
            path: '/docs/components/form/tree',
            getComponent: () =>
              // @ts-ignore
              import('../../docs/components/form/tree.md').then(
                makeMarkdownRenderer
              )
          },
          {
            label: 'TreeSelect 树形选择器',
            path: '/docs/components/form/treeselect',
            getComponent: () =>
              // @ts-ignore
              import('../../docs/components/form/treeselect.md').then(
                makeMarkdownRenderer
              )
          },
          {
            label: 'Year 年',
            path: '/docs/components/form/year',
            getComponent: () =>
              // @ts-ignore
              import('../../docs/components/form/year.md').then(
                makeMarkdownRenderer
              )
          },
          {
            label: 'Quarter 季度',
            path: '/docs/components/form/quarter',
            getComponent: () =>
              // @ts-ignore
              import('../../docs/components/form/quarter.md').then(
                makeMarkdownRenderer
              )
          }
        ]
      },
      {
        label: 'CRUD 增删改查',
        path: '/docs/components/crud',
        getComponent: () =>
          // @ts-ignore
          import('../../docs/components/crud.md').then(makeMarkdownRenderer)
      },
      {
        label: 'Custom 自定义组件',
        path: '/docs/components/custom',
        getComponent: () =>
          // @ts-ignore
          import('../../docs/components/custom.md').then(makeMarkdownRenderer)
      },
      {
        label: 'Table 表格',
        path: '/docs/components/table',
        getComponent: () =>
          // @ts-ignore
          import('../../docs/components/table.md').then(makeMarkdownRenderer)
      },
      {
        label: 'Action 行为按钮',
        path: '/docs/components/action',
        getComponent: () =>
          // @ts-ignore
          import('../../docs/components/action.md').then(makeMarkdownRenderer)
      },
      {
        label: 'Alert 提示',
        path: '/docs/components/alert',
        getComponent: () =>
          // @ts-ignore
          import('../../docs/components/alert.md').then(makeMarkdownRenderer)
      },
      {
        label: 'Audio 音频',
        path: '/docs/components/audio',
        getComponent: () =>
          // @ts-ignore
          import('../../docs/components/audio.md').then(makeMarkdownRenderer)
      },
      {
        label: 'Button 按钮',
        path: '/docs/components/button',
        getComponent: () =>
          // @ts-ignore
          import('../../docs/components/button.md').then(makeMarkdownRenderer)
      },
      {
        label: 'ButtonGroup 按钮组',
        path: '/docs/components/button-group',
        getComponent: () =>
          // @ts-ignore
          import('../../docs/components/button-group.md').then(
            makeMarkdownRenderer
          )
      },
      {
        label: 'Card 卡片',
        path: '/docs/components/card',
        getComponent: () =>
          // @ts-ignore
          import('../../docs/components/card.md').then(makeMarkdownRenderer)
      },
      {
        label: 'Cards 卡片组',
        path: '/docs/components/cards',
        getComponent: () =>
          // @ts-ignore
          import('../../docs/components/cards.md').then(makeMarkdownRenderer)
      },
      {
        label: 'Carousel 轮播图',
        path: '/docs/components/carousel',
        getComponent: () =>
          // @ts-ignore
          import('../../docs/components/carousel.md').then(makeMarkdownRenderer)
      },
      {
        label: 'Chart 图表',
        path: '/docs/components/chart',
        getComponent: () =>
          // @ts-ignore
          import('../../docs/components/chart.md').then(makeMarkdownRenderer)
      },
      {
        label: 'Collapse 折叠器',
        path: '/docs/components/collapse',
        getComponent: () =>
          // @ts-ignore
          import('../../docs/components/collapse.md').then(makeMarkdownRenderer)
      },
      {
        label: 'Color 颜色',
        path: '/docs/components/color',
        getComponent: () =>
          // @ts-ignore
          import('../../docs/components/color.md').then(makeMarkdownRenderer)
      },
      {
        label: 'Container 容器',
        path: '/docs/components/container',
        getComponent: () =>
          // @ts-ignore
          import('../../docs/components/container.md').then(
            makeMarkdownRenderer
          )
      },
      {
        label: 'Date 日期时间',
        path: '/docs/components/date',
        getComponent: () =>
          // @ts-ignore
          import('../../docs/components/date.md').then(makeMarkdownRenderer)
      },
      {
        label: 'Dialog 对话框',
        path: '/docs/components/dialog',
        getComponent: () =>
          // @ts-ignore
          import('../../docs/components/dialog.md').then(makeMarkdownRenderer)
      },
      {
        label: 'Divider 分割线',
        path: '/docs/components/divider',
        getComponent: () =>
          // @ts-ignore
          import('../../docs/components/divider.md').then(makeMarkdownRenderer)
      },
      {
        label: 'Drawer 抽屉',
        path: '/docs/components/drawer',
        getComponent: () =>
          // @ts-ignore
          import('../../docs/components/drawer.md').then(makeMarkdownRenderer)
      },
      {
        label: 'DropDownButton',
        path: '/docs/components/dropdown-button',
        getComponent: () =>
          // @ts-ignore
          import('../../docs/components/dropdown-button.md').then(
            makeMarkdownRenderer
          )
      },
      {
        label: 'Each 循环渲染器',
        path: '/docs/components/each',
        getComponent: () =>
          // @ts-ignore
          import('../../docs/components/each.md').then(makeMarkdownRenderer)
      },
      {
        label: 'Grid 网格布局',
        path: '/docs/components/grid',
        getComponent: () =>
          // @ts-ignore
          import('../../docs/components/grid.md').then(makeMarkdownRenderer)
      },
      {
        label: 'HBox 布局',
        path: '/docs/components/hbox',
        getComponent: () =>
          // @ts-ignore
          import('../../docs/components/hbox.md').then(makeMarkdownRenderer)
      },
      {
        label: 'Html',
        path: '/docs/components/html',
        getComponent: () =>
          // @ts-ignore
          import('../../docs/components/html.md').then(makeMarkdownRenderer)
      },
      {
        label: 'Icon 图标',
        path: '/docs/components/icon',
        getComponent: () =>
          // @ts-ignore
          import('../../docs/components/icon.md').then(makeMarkdownRenderer)
      },
      {
        label: 'iFrame',
        path: '/docs/components/iframe',
        getComponent: () =>
          // @ts-ignore
          import('../../docs/components/iframe.md').then(makeMarkdownRenderer)
      },
      {
        label: 'Image 图片',
        path: '/docs/components/image',
        getComponent: () =>
          // @ts-ignore
          import('../../docs/components/image.md').then(makeMarkdownRenderer)
      },
      {
        label: 'Images 图片集',
        path: '/docs/components/images',
        getComponent: () =>
          // @ts-ignore
          import('../../docs/components/images.md').then(makeMarkdownRenderer)
      },
      {
        label: 'Json',
        path: '/docs/components/json',
        getComponent: () =>
          // @ts-ignore
          import('../../docs/components/json.md').then(makeMarkdownRenderer)
      },
      {
        label: 'Link 链接',
        path: '/docs/components/link',
        getComponent: () =>
          // @ts-ignore
          import('../../docs/components/link.md').then(makeMarkdownRenderer)
      },
      {
        label: 'List 列表',
        path: '/docs/components/list',
        getComponent: () =>
          // @ts-ignore
          import('../../docs/components/list.md').then(makeMarkdownRenderer)
      },
      {
        label: 'Mapping 映射',
        path: '/docs/components/mapping',
        getComponent: () =>
          // @ts-ignore
          import('../../docs/components/mapping.md').then(makeMarkdownRenderer)
      },
      {
        label: 'Nav 导航',
        path: '/docs/components/nav',
        getComponent: () =>
          // @ts-ignore
          import('../../docs/components/nav.md').then(makeMarkdownRenderer)
      },
      {
        label: 'Panel 面板',
        path: '/docs/components/panel',
        getComponent: () =>
          // @ts-ignore
          import('../../docs/components/panel.md').then(makeMarkdownRenderer)
      },
      {
        label: 'PaginationWrapper',
        path: '/docs/components/pagination-wrapper',
        getComponent: () =>
          // @ts-ignore
          import('../../docs/components/pagination-wrapper.md').then(
            makeMarkdownRenderer
          )
      },
      {
        label: 'Progress 进度条',
        path: '/docs/components/progress',
        getComponent: () =>
          // @ts-ignore
          import('../../docs/components/progress.md').then(makeMarkdownRenderer)
      },
      {
        label: 'QRCode 二维码',
        path: '/docs/components/qrcode',
        getComponent: () =>
          // @ts-ignore
          import('../../docs/components/qrcode.md').then(makeMarkdownRenderer)
      },
      {
        label: 'Remark 标记',
        path: '/docs/components/remark',
        getComponent: () =>
          // @ts-ignore
          import('../../docs/components/remark.md').then(makeMarkdownRenderer)
      },
      {
        label: 'Service 功能型容器',
        path: '/docs/components/service',
        getComponent: () =>
          // @ts-ignore
          import('../../docs/components/service.md').then(makeMarkdownRenderer)
      },
      {
        label: 'Sparkline 走势图',
        path: '/docs/components/sparkline',
        getComponent: () =>
          // @ts-ignore
          import('../../docs/components/sparkline.md').then(
            makeMarkdownRenderer
          )
      },
      {
        label: 'Spinner 加载中',
        path: '/docs/components/spinner',
        getComponent: () =>
          // @ts-ignore
          import('../../docs/components/spinner.md').then(makeMarkdownRenderer)
      },
      {
        label: 'Status 状态',
        path: '/docs/components/status',
        getComponent: () =>
          // @ts-ignore
          import('../../docs/components/status.md').then(makeMarkdownRenderer)
      },
      {
        label: 'Switch 开关',
        path: '/docs/components/switch',
        getComponent: () =>
          // @ts-ignore
          import('../../docs/components/switch.md').then(makeMarkdownRenderer)
      },
      {
        label: 'Tabs 选项卡',
        path: '/docs/components/tabs',
        getComponent: () =>
          // @ts-ignore
          import('../../docs/components/tabs.md').then(makeMarkdownRenderer)
      },
      {
        label: 'Tasks 任务操作集合',
        path: '/docs/components/tasks',
        getComponent: () =>
          // @ts-ignore
          import('../../docs/components/tasks.md').then(makeMarkdownRenderer)
      },
      {
        label: 'Tpl 模板',
        path: '/docs/components/tpl',
        getComponent: () =>
          // @ts-ignore
          import('../../docs/components/tpl.md').then(makeMarkdownRenderer)
      },
      {
        label: 'Video 视频',
        path: '/docs/components/video',
        getComponent: () =>
          // @ts-ignore
          import('../../docs/components/video.md').then(makeMarkdownRenderer)
      },
      {
        label: 'Wrapper 包裹容器',
        path: '/docs/components/wrapper',
        getComponent: () =>
          // @ts-ignore
          import('../../docs/components/wrapper.md').then(makeMarkdownRenderer)
      },
      {
        label: 'Wizard 向导',
        path: '/docs/components/wizard',
        getComponent: () =>
          // @ts-ignore
          import('../../docs/components/wizard.md').then(makeMarkdownRenderer)
      }
    ]
  }
];

export default class Doc extends React.PureComponent {
  state = {
    prevDoc: null,
    nextDoc: null
  };

  componentDidMount() {
    this.props.setNavigations(docs);
    this.setDocFooter();
  }

  componentDidUpdate(preProps) {
    if (this.props.location.pathname !== preProps.location.pathname) {
      this.props.setNavigations(docs);
      this.setDocFooter();
    }
  }

  setDocFooter() {
    const newDocs = mapTree(docs, doc => ({
      ...doc,
      children:
        Array.isArray(doc.children) && doc.children.length
          ? doc.children.map(item => ({
              ...item,
              group: doc.group || doc.label
            }))
          : null
    }));
    const flattenDocs = flattenTree(newDocs).filter(i => !!i.path);
    const docIndex = flattenDocs.findIndex(
      d => `${this.props.ContextPath}${d.path}` === location.pathname
    );
    this.setState({
      prevDoc: flattenDocs[docIndex - 1],
      nextDoc: flattenDocs[docIndex + 1]
    });
  }

  render() {
    return (
      <>
        {React.cloneElement(this.props.children, {
          ...this.props.children.props,
          theme: this.props.theme,
          classPrefix: this.props.classPrefix,
          locale: this.props.locale,
          viewMode: this.props.viewMode,
          offScreen: this.props.offScreen,
          ContextPath: this.props.ContextPath,
          prevDoc: this.state.prevDoc,
          nextDoc: this.state.nextDoc
        })}
      </>
    );
  }
}
