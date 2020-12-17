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
        getComponent: (location, cb) =>
          require(['../../docs/index.md'], doc => {
            cb(null, makeMarkdownRenderer(doc));
          })
      },

      {
        label: '快速开始',
        path: '/docs/start/getting-started',
        getComponent: (location, cb) =>
          require(['../../docs/start/getting-started.md'], doc => {
            cb(null, makeMarkdownRenderer(doc));
          })
      },

      {
        label: '自定义',
        path: '/docs/start/custom',
        getComponent: (location, cb) =>
          require(['../../docs/start/custom.md'], doc => {
            cb(null, makeMarkdownRenderer(doc));
          })
      },

      {
        label: '常见问题',
        path: '/docs/start/faq',
        getComponent: (location, cb) =>
          require(['../../docs/start/faq.md'], doc => {
            cb(null, makeMarkdownRenderer(doc));
          })
      }

      // {
      //   label: '基本用法',
      //   icon: 'fa fa-file',
      //   path: '/docs/basic',
      //   getComponent: (location, cb) =>
      //     require(['../../docs/basic.md'], doc => {
      //       cb(null, makeMarkdownRenderer(doc));
      //     })
      // },

      // {
      //   label: '高级用法',
      //   icon: 'fa fa-rocket',
      //   path: '/docs/advanced',
      //   getComponent: (location, cb) =>
      //     require(['../../docs/advanced.md'], doc => {
      //       cb(null, makeMarkdownRenderer(doc));
      //     })
      // }
    ]
  },

  {
    label: '💡  概念',
    children: [
      {
        label: '配置与组件',
        path: '/docs/concepts/schema',
        getComponent: (location, cb) =>
          require(['../../docs/concepts/schema.md'], doc => {
            cb(null, makeMarkdownRenderer(doc));
          })
      },
      {
        label: '数据域与数据链',
        path: '/docs/concepts/datascope-and-datachain',
        getComponent: (location, cb) =>
          require(['../../docs/concepts/datascope-and-datachain.md'], doc => {
            cb(null, makeMarkdownRenderer(doc));
          })
      },
      {
        label: '模板',
        path: '/docs/concepts/template',
        getComponent: (location, cb) =>
          require(['../../docs/concepts/template.md'], doc => {
            cb(null, makeMarkdownRenderer(doc));
          })
      },
      {
        label: '数据映射',
        path: '/docs/concepts/data-mapping',
        getComponent: (location, cb) =>
          require(['../../docs/concepts/data-mapping.md'], doc => {
            cb(null, makeMarkdownRenderer(doc));
          })
      },
      {
        label: '表达式',
        path: '/docs/concepts/expression',
        getComponent: (location, cb) =>
          require(['../../docs/concepts/expression.md'], doc => {
            cb(null, makeMarkdownRenderer(doc));
          })
      },
      {
        label: '联动',
        path: '/docs/concepts/linkage',
        getComponent: (location, cb) =>
          require(['../../docs/concepts/linkage.md'], doc => {
            cb(null, makeMarkdownRenderer(doc));
          })
      },
      {
        label: '行为',
        path: '/docs/concepts/action',
        getComponent: (location, cb) =>
          require(['../../docs/concepts/action.md'], doc => {
            cb(null, makeMarkdownRenderer(doc));
          })
      },
      {
        label: '样式',
        path: '/docs/concepts/style',
        getComponent: (location, cb) =>
          require(['../../docs/concepts/style.md'], doc => {
            cb(null, makeMarkdownRenderer(doc));
          })
      }
    ]
  },

  {
    label: '🎼  类型',
    children: [
      {
        label: 'SchemaNode',
        path: '/docs/types/schemanode',
        getComponent: (location, cb) =>
          require(['../../docs/types/schemanode.md'], doc => {
            cb(null, makeMarkdownRenderer(doc));
          })
      },
      {
        label: 'API',
        path: '/docs/types/api',
        getComponent: (location, cb) =>
          require(['../../docs/types/api.md'], doc => {
            cb(null, makeMarkdownRenderer(doc));
          })
      },
      {
        label: 'Definitions',
        path: '/docs/types/definitions',
        getComponent: (location, cb) =>
          require(['../../docs/types/definitions.md'], doc => {
            cb(null, makeMarkdownRenderer(doc));
          })
      }
    ]
  },

  {
    label: '⚙  组件',
    children: [
      {
        label: '组件介绍',
        path: '/docs/components/component',
        getComponent: (location, cb) =>
          require(['../../docs/components/component.md'], doc => {
            cb(null, makeMarkdownRenderer(doc));
          })
      },
      {
        label: 'Page 页面',
        path: '/docs/components/page',
        getComponent: (location, cb) =>
          require(['../../docs/components/page.md'], doc => {
            cb(null, makeMarkdownRenderer(doc));
          })
      },
      {
        label: 'Form 表单',
        path: '/docs/components/form/index',
        getComponent: (location, cb) =>
          require(['../../docs/components/form/index.md'], doc => {
            cb(null, makeMarkdownRenderer(doc));
          }),
        children: [
          {
            label: 'FormItem 表单项',
            path: '/docs/components/form/formitem',
            getComponent: (location, cb) =>
              require(['../../docs/components/form/formitem.md'], doc => {
                cb(null, makeMarkdownRenderer(doc));
              })
          },
          {
            label: 'Options 选择器表单项',
            path: '/docs/components/form/options',
            getComponent: (location, cb) =>
              require(['../../docs/components/form/options.md'], doc => {
                cb(null, makeMarkdownRenderer(doc));
              })
          },
          {
            label: 'Array 数组输入框',
            path: '/docs/components/form/array',
            getComponent: (location, cb) =>
              require(['../../docs/components/form/array.md'], doc => {
                cb(null, makeMarkdownRenderer(doc));
              })
          },
          {
            label: 'Button 按钮',
            path: '/docs/components/form/button',
            getComponent: (location, cb) =>
              require(['../../docs/components/form/button.md'], doc => {
                cb(null, makeMarkdownRenderer(doc));
              })
          },
          {
            label: 'Button-Toolbar 按钮工具栏',
            path: '/docs/components/form/button-toolbar',
            getComponent: (location, cb) =>
              require(['../../docs/components/form/button-toolbar.md'], doc => {
                cb(null, makeMarkdownRenderer(doc));
              })
          },
          {
            label: 'Button-Group 按钮集合',
            path: '/docs/components/form/button-group',
            getComponent: (location, cb) =>
              require(['../../docs/components/form/button-group.md'], doc => {
                cb(null, makeMarkdownRenderer(doc));
              })
          },
          {
            label: 'Chain-Select 链式下拉框',
            path: '/docs/components/form/chain-select',
            getComponent: (location, cb) =>
              require(['../../docs/components/form/chain-select.md'], doc => {
                cb(null, makeMarkdownRenderer(doc));
              })
          },
          {
            label: 'Checkbox 勾选框',
            path: '/docs/components/form/checkbox',
            getComponent: (location, cb) =>
              require(['../../docs/components/form/checkbox.md'], doc => {
                cb(null, makeMarkdownRenderer(doc));
              })
          },
          {
            label: 'Checkboxes 复选框',
            path: '/docs/components/form/checkboxes',
            getComponent: (location, cb) =>
              require(['../../docs/components/form/checkboxes.md'], doc => {
                cb(null, makeMarkdownRenderer(doc));
              })
          },
          {
            label: 'City 城市选择器',
            path: '/docs/components/form/city',
            getComponent: (location, cb) =>
              require(['../../docs/components/form/city.md'], doc => {
                cb(null, makeMarkdownRenderer(doc));
              })
          },
          {
            label: 'Color 颜色选择器',
            path: '/docs/components/form/color',
            getComponent: (location, cb) =>
              require(['../../docs/components/form/color.md'], doc => {
                cb(null, makeMarkdownRenderer(doc));
              })
          },
          {
            label: 'Combo 组合',
            path: '/docs/components/form/combo',
            getComponent: (location, cb) =>
              require(['../../docs/components/form/combo.md'], doc => {
                cb(null, makeMarkdownRenderer(doc));
              })
          },
          {
            label: 'Date 日期选择器',
            path: '/docs/components/form/date',
            getComponent: (location, cb) =>
              require(['../../docs/components/form/date.md'], doc => {
                cb(null, makeMarkdownRenderer(doc));
              })
          },
          {
            label: 'Datetime 日期时间选择器',
            path: '/docs/components/form/datetime',
            getComponent: (location, cb) =>
              require(['../../docs/components/form/datetime.md'], doc => {
                cb(null, makeMarkdownRenderer(doc));
              })
          },
          {
            label: 'Month 月份选择器',
            path: '/docs/components/form/month',
            getComponent: (location, cb) =>
              require(['../../docs/components/form/month.md'], doc => {
                cb(null, makeMarkdownRenderer(doc));
              })
          },
          {
            label: 'Date-Range 日期范围选择器',
            path: '/docs/components/form/date-range',
            getComponent: (location, cb) =>
              require(['../../docs/components/form/date-range.md'], doc => {
                cb(null, makeMarkdownRenderer(doc));
              })
          },
          {
            label: 'Datetime-Range 日期时间范围',
            path: '/docs/components/form/datetime-range',
            getComponent: (location, cb) =>
              require(['../../docs/components/form/datetime-range.md'], doc => {
                cb(null, makeMarkdownRenderer(doc));
              })
          },
          {
            label: 'DiffEditor 对比编辑器',
            path: '/docs/components/form/diff-editor',
            getComponent: (location, cb) =>
              require(['../../docs/components/form/diff-editor.md'], doc => {
                cb(null, makeMarkdownRenderer(doc));
              })
          },
          {
            label: 'Editor 代码编辑器',
            path: '/docs/components/form/editor',
            getComponent: (location, cb) =>
              require(['../../docs/components/form/editor.md'], doc => {
                cb(null, makeMarkdownRenderer(doc));
              })
          },
          {
            label: 'FieldSet 表单项集合',
            path: '/docs/components/form/fieldset',
            getComponent: (location, cb) =>
              require(['../../docs/components/form/fieldset.md'], doc => {
                cb(null, makeMarkdownRenderer(doc));
              })
          },
          {
            label: 'File 文件上传',
            path: '/docs/components/form/file',
            getComponent: (location, cb) =>
              require(['../../docs/components/form/file.md'], doc => {
                cb(null, makeMarkdownRenderer(doc));
              })
          },
          {
            label: 'Formula 公式',
            path: '/docs/components/form/formula',
            getComponent: (location, cb) =>
              require(['../../docs/components/form/formula.md'], doc => {
                cb(null, makeMarkdownRenderer(doc));
              })
          },
          {
            label: 'Grid 网格',
            path: '/docs/components/form/grid',
            getComponent: (location, cb) =>
              require(['../../docs/components/form/grid.md'], doc => {
                cb(null, makeMarkdownRenderer(doc));
              })
          },
          {
            label: 'Group 表单项组',
            path: '/docs/components/form/group',
            getComponent: (location, cb) =>
              require(['../../docs/components/form/group.md'], doc => {
                cb(null, makeMarkdownRenderer(doc));
              })
          },
          {
            label: 'HBox',
            path: '/docs/components/form/hbox',
            getComponent: (location, cb) =>
              require(['../../docs/components/form/hbox.md'], doc => {
                cb(null, makeMarkdownRenderer(doc));
              })
          },
          {
            label: 'Hidden 隐藏字段',
            path: '/docs/components/form/hidden',
            getComponent: (location, cb) =>
              require(['../../docs/components/form/hidden.md'], doc => {
                cb(null, makeMarkdownRenderer(doc));
              })
          },
          {
            label: 'Image 图片',
            path: '/docs/components/form/image',
            getComponent: (location, cb) =>
              require(['../../docs/components/form/image.md'], doc => {
                cb(null, makeMarkdownRenderer(doc));
              })
          },
          {
            label: 'Input-Group 输入框组合',
            path: '/docs/components/form/input-group',
            getComponent: (location, cb) =>
              require(['../../docs/components/form/input-group.md'], doc => {
                cb(null, makeMarkdownRenderer(doc));
              })
          },
          {
            label: 'List 列表',
            path: '/docs/components/form/list',
            getComponent: (location, cb) =>
              require(['../../docs/components/form/list.md'], doc => {
                cb(null, makeMarkdownRenderer(doc));
              })
          },
          {
            label: 'Matrix 矩阵',
            path: '/docs/components/form/matrix',
            getComponent: (location, cb) =>
              require(['../../docs/components/form/matrix.md'], doc => {
                cb(null, makeMarkdownRenderer(doc));
              })
          },
          {
            label: 'NestedSelect 级联选择器',
            path: '/docs/components/form/nestedselect',
            getComponent: (location, cb) =>
              require(['../../docs/components/form/nestedselect.md'], doc => {
                cb(null, makeMarkdownRenderer(doc));
              })
          },
          {
            label: 'Number 数字输入框',
            path: '/docs/components/form/number',
            getComponent: (location, cb) =>
              require(['../../docs/components/form/number.md'], doc => {
                cb(null, makeMarkdownRenderer(doc));
              })
          },
          {
            label: 'Panel 面板',
            path: '/docs/components/form/panel',
            getComponent: (location, cb) =>
              require(['../../docs/components/form/panel.md'], doc => {
                cb(null, makeMarkdownRenderer(doc));
              })
          },
          {
            label: 'Picker 列表选择器',
            path: '/docs/components/form/picker',
            getComponent: (location, cb) =>
              require(['../../docs/components/form/picker.md'], doc => {
                cb(null, makeMarkdownRenderer(doc));
              })
          },
          {
            label: 'Radios 单选框',
            path: '/docs/components/form/radios',
            getComponent: (location, cb) =>
              require(['../../docs/components/form/radios.md'], doc => {
                cb(null, makeMarkdownRenderer(doc));
              })
          },
          {
            label: 'Rating 评分',
            path: '/docs/components/form/rating',
            getComponent: (location, cb) =>
              require(['../../docs/components/form/rating.md'], doc => {
                cb(null, makeMarkdownRenderer(doc));
              })
          },
          {
            label: 'Range 滑块',
            path: '/docs/components/form/range',
            getComponent: (location, cb) =>
              require(['../../docs/components/form/range.md'], doc => {
                cb(null, makeMarkdownRenderer(doc));
              })
          },
          {
            label: 'Repeat 重复频率选择器',
            path: '/docs/components/form/repeat',
            getComponent: (location, cb) =>
              require(['../../docs/components/form/repeat.md'], doc => {
                cb(null, makeMarkdownRenderer(doc));
              })
          },
          {
            label: 'Rich-Text 富文本编辑器',
            path: '/docs/components/form/rich-text',
            getComponent: (location, cb) =>
              require(['../../docs/components/form/rich-text.md'], doc => {
                cb(null, makeMarkdownRenderer(doc));
              })
          },
          {
            label: 'Select 选择器',
            path: '/docs/components/form/select',
            getComponent: (location, cb) =>
              require(['../../docs/components/form/select.md'], doc => {
                cb(null, makeMarkdownRenderer(doc));
              })
          },
          {
            label: 'Service 功能容器',
            path: '/docs/components/form/service',
            getComponent: (location, cb) =>
              require(['../../docs/components/form/service.md'], doc => {
                cb(null, makeMarkdownRenderer(doc));
              })
          },
          {
            label: 'SubForm 子表单',
            path: '/docs/components/form/subform',
            getComponent: (location, cb) =>
              require(['../../docs/components/form/subform.md'], doc => {
                cb(null, makeMarkdownRenderer(doc));
              })
          },
          {
            label: 'Switch 开关',
            path: '/docs/components/form/switch',
            getComponent: (location, cb) =>
              require(['../../docs/components/form/switch.md'], doc => {
                cb(null, makeMarkdownRenderer(doc));
              })
          },
          {
            label: 'Static 静态展示',
            path: '/docs/components/form/static',
            getComponent: (location, cb) =>
              require(['../../docs/components/form/static.md'], doc => {
                cb(null, makeMarkdownRenderer(doc));
              })
          },
          {
            label: 'Tabs 选项卡',
            path: '/docs/components/form/tabs',
            getComponent: (location, cb) =>
              require(['../../docs/components/form/tabs.md'], doc => {
                cb(null, makeMarkdownRenderer(doc));
              })
          },
          {
            label: 'Table 表格',
            path: '/docs/components/form/table',
            getComponent: (location, cb) =>
              require(['../../docs/components/form/table.md'], doc => {
                cb(null, makeMarkdownRenderer(doc));
              })
          },
          {
            label: 'Tag 标签选择器',
            path: '/docs/components/form/tag',
            getComponent: (location, cb) =>
              require(['../../docs/components/form/tag.md'], doc => {
                cb(null, makeMarkdownRenderer(doc));
              })
          },
          {
            label: 'Text 输入框',
            path: '/docs/components/form/text',
            getComponent: (location, cb) =>
              require(['../../docs/components/form/text.md'], doc => {
                cb(null, makeMarkdownRenderer(doc));
              })
          },
          {
            label: 'Textarea 多行输入框',
            path: '/docs/components/form/textarea',
            getComponent: (location, cb) =>
              require(['../../docs/components/form/textarea.md'], doc => {
                cb(null, makeMarkdownRenderer(doc));
              })
          },
          {
            label: 'Time 时间',
            path: '/docs/components/form/time',
            getComponent: (location, cb) =>
              require(['../../docs/components/form/time.md'], doc => {
                cb(null, makeMarkdownRenderer(doc));
              })
          },
          {
            label: 'Transfer 穿梭器',
            path: '/docs/components/form/transfer',
            getComponent: (location, cb) =>
              require(['../../docs/components/form/transfer.md'], doc => {
                cb(null, makeMarkdownRenderer(doc));
              })
          },
          {
            label: 'TabsTransfer 组合穿梭器',
            path: '/docs/components/form/tabs-transfer',
            getComponent: (location, cb) =>
              require(['../../docs/components/form/tabs-transfer.md'], doc => {
                cb(null, makeMarkdownRenderer(doc));
              })
          },
          {
            label: 'Tree 树形选择框',
            path: '/docs/components/form/tree',
            getComponent: (location, cb) =>
              require(['../../docs/components/form/tree.md'], doc => {
                cb(null, makeMarkdownRenderer(doc));
              })
          },
          {
            label: 'TreeSelect 树形选择器',
            path: '/docs/components/form/treeselect',
            getComponent: (location, cb) =>
              require(['../../docs/components/form/treeselect.md'], doc => {
                cb(null, makeMarkdownRenderer(doc));
              })
          }
        ]
      },
      {
        label: 'CRUD 增删改查',
        path: '/docs/components/crud',
        getComponent: (location, cb) =>
          require(['../../docs/components/crud.md'], doc => {
            cb(null, makeMarkdownRenderer(doc));
          })
      },
      {
        label: 'Table 表格',
        path: '/docs/components/table',
        getComponent: (location, cb) =>
          require(['../../docs/components/table.md'], doc => {
            cb(null, makeMarkdownRenderer(doc));
          })
      },
      {
        label: 'Action 行为按钮',
        path: '/docs/components/action',
        getComponent: (location, cb) =>
          require(['../../docs/components/action.md'], doc => {
            cb(null, makeMarkdownRenderer(doc));
          })
      },
      {
        label: 'Alert 提示',
        path: '/docs/components/alert',
        getComponent: (location, cb) =>
          require(['../../docs/components/alert.md'], doc => {
            cb(null, makeMarkdownRenderer(doc));
          })
      },
      {
        label: 'Audio 音频',
        path: '/docs/components/audio',
        getComponent: (location, cb) =>
          require(['../../docs/components/audio.md'], doc => {
            cb(null, makeMarkdownRenderer(doc));
          })
      },
      {
        label: 'Button 按钮',
        path: '/docs/components/button',
        getComponent: (location, cb) =>
          require(['../../docs/components/button.md'], doc => {
            cb(null, makeMarkdownRenderer(doc));
          })
      },
      {
        label: 'ButtonGroup 按钮组',
        path: '/docs/components/button-group',
        getComponent: (location, cb) =>
          require(['../../docs/components/button-group.md'], doc => {
            cb(null, makeMarkdownRenderer(doc));
          })
      },
      {
        label: 'Card 卡片',
        path: '/docs/components/card',
        getComponent: (location, cb) =>
          require(['../../docs/components/card.md'], doc => {
            cb(null, makeMarkdownRenderer(doc));
          })
      },
      {
        label: 'Cards 卡片组',
        path: '/docs/components/cards',
        getComponent: (location, cb) =>
          require(['../../docs/components/cards.md'], doc => {
            cb(null, makeMarkdownRenderer(doc));
          })
      },
      {
        label: 'Carousel 轮播图',
        path: '/docs/components/carousel',
        getComponent: (location, cb) =>
          require(['../../docs/components/carousel.md'], doc => {
            cb(null, makeMarkdownRenderer(doc));
          })
      },
      {
        label: 'Chart 图表',
        path: '/docs/components/chart',
        getComponent: (location, cb) =>
          require(['../../docs/components/chart.md'], doc => {
            cb(null, makeMarkdownRenderer(doc));
          })
      },
      {
        label: 'Collapse 折叠器',
        path: '/docs/components/collapse',
        getComponent: (location, cb) =>
          require(['../../docs/components/collapse.md'], doc => {
            cb(null, makeMarkdownRenderer(doc));
          })
      },
      {
        label: 'Color 颜色',
        path: '/docs/components/color',
        getComponent: (location, cb) =>
          require(['../../docs/components/color.md'], doc => {
            cb(null, makeMarkdownRenderer(doc));
          })
      },
      {
        label: 'Container 容器',
        path: '/docs/components/container',
        getComponent: (location, cb) =>
          require(['../../docs/components/container.md'], doc => {
            cb(null, makeMarkdownRenderer(doc));
          })
      },
      {
        label: 'Date 日期时间',
        path: '/docs/components/date',
        getComponent: (location, cb) =>
          require(['../../docs/components/date.md'], doc => {
            cb(null, makeMarkdownRenderer(doc));
          })
      },
      {
        label: 'Dialog 对话框',
        path: '/docs/components/dialog',
        getComponent: (location, cb) =>
          require(['../../docs/components/dialog.md'], doc => {
            cb(null, makeMarkdownRenderer(doc));
          })
      },
      {
        label: 'Divider 分割线',
        path: '/docs/components/divider',
        getComponent: (location, cb) =>
          require(['../../docs/components/divider.md'], doc => {
            cb(null, makeMarkdownRenderer(doc));
          })
      },
      {
        label: 'Drawer 抽屉',
        path: '/docs/components/drawer',
        getComponent: (location, cb) =>
          require(['../../docs/components/drawer.md'], doc => {
            cb(null, makeMarkdownRenderer(doc));
          })
      },
      {
        label: 'DropDownButton',
        path: '/docs/components/dropdown-button',
        getComponent: (location, cb) =>
          require(['../../docs/components/dropdown-button.md'], doc => {
            cb(null, makeMarkdownRenderer(doc));
          })
      },
      {
        label: 'Each 循环渲染器',
        path: '/docs/components/each',
        getComponent: (location, cb) =>
          require(['../../docs/components/each.md'], doc => {
            cb(null, makeMarkdownRenderer(doc));
          })
      },
      {
        label: 'Grid 网格布局',
        path: '/docs/components/grid',
        getComponent: (location, cb) =>
          require(['../../docs/components/grid.md'], doc => {
            cb(null, makeMarkdownRenderer(doc));
          })
      },
      {
        label: 'HBox 布局',
        path: '/docs/components/hbox',
        getComponent: (location, cb) =>
          require(['../../docs/components/hbox.md'], doc => {
            cb(null, makeMarkdownRenderer(doc));
          })
      },
      {
        label: 'Html',
        path: '/docs/components/html',
        getComponent: (location, cb) =>
          require(['../../docs/components/html.md'], doc => {
            cb(null, makeMarkdownRenderer(doc));
          })
      },
      {
        label: 'Icon 图标',
        path: '/docs/components/icon',
        getComponent: (location, cb) =>
          require(['../../docs/components/icon.md'], doc => {
            cb(null, makeMarkdownRenderer(doc));
          })
      },
      {
        label: 'iFrame',
        path: '/docs/components/iframe',
        getComponent: (location, cb) =>
          require(['../../docs/components/iframe.md'], doc => {
            cb(null, makeMarkdownRenderer(doc));
          })
      },
      {
        label: 'Image 图片',
        path: '/docs/components/image',
        getComponent: (location, cb) =>
          require(['../../docs/components/image.md'], doc => {
            cb(null, makeMarkdownRenderer(doc));
          })
      },
      {
        label: 'Images 图片集',
        path: '/docs/components/images',
        getComponent: (location, cb) =>
          require(['../../docs/components/images.md'], doc => {
            cb(null, makeMarkdownRenderer(doc));
          })
      },
      {
        label: 'Json',
        path: '/docs/components/json',
        getComponent: (location, cb) =>
          require(['../../docs/components/json.md'], doc => {
            cb(null, makeMarkdownRenderer(doc));
          })
      },
      {
        label: 'Link 链接',
        path: '/docs/components/link',
        getComponent: (location, cb) =>
          require(['../../docs/components/link.md'], doc => {
            cb(null, makeMarkdownRenderer(doc));
          })
      },
      {
        label: 'List 列表',
        path: '/docs/components/list',
        getComponent: (location, cb) =>
          require(['../../docs/components/list.md'], doc => {
            cb(null, makeMarkdownRenderer(doc));
          })
      },
      {
        label: 'Mapping 映射',
        path: '/docs/components/mapping',
        getComponent: (location, cb) =>
          require(['../../docs/components/mapping.md'], doc => {
            cb(null, makeMarkdownRenderer(doc));
          })
      },
      {
        label: 'Nav 导航',
        path: '/docs/components/nav',
        getComponent: (location, cb) =>
          require(['../../docs/components/nav.md'], doc => {
            cb(null, makeMarkdownRenderer(doc));
          })
      },
      {
        label: 'Panel 面板',
        path: '/docs/components/panel',
        getComponent: (location, cb) =>
          require(['../../docs/components/panel.md'], doc => {
            cb(null, makeMarkdownRenderer(doc));
          })
      },
      {
        label: 'Progress 进度条',
        path: '/docs/components/progress',
        getComponent: (location, cb) =>
          require(['../../docs/components/progress.md'], doc => {
            cb(null, makeMarkdownRenderer(doc));
          })
      },
      {
        label: 'QRCode 二维码',
        path: '/docs/components/qrcode',
        getComponent: (location, cb) =>
          require(['../../docs/components/qrcode.md'], doc => {
            cb(null, makeMarkdownRenderer(doc));
          })
      },
      {
        label: 'Remark 标记',
        path: '/docs/components/remark',
        getComponent: (location, cb) =>
          require(['../../docs/components/remark.md'], doc => {
            cb(null, makeMarkdownRenderer(doc));
          })
      },
      {
        label: 'Service 功能型容器',
        path: '/docs/components/service',
        getComponent: (location, cb) =>
          require(['../../docs/components/service.md'], doc => {
            cb(null, makeMarkdownRenderer(doc));
          })
      },
      {
        label: 'Sparkline 走势图',
        path: '/docs/components/sparkline',
        getComponent: (location, cb) =>
          require(['../../docs/components/sparkline.md'], doc => {
            cb(null, makeMarkdownRenderer(doc));
          })
      },
      {
        label: 'Spinner 加载中',
        path: '/docs/components/spinner',
        getComponent: (location, cb) =>
          require(['../../docs/components/spinner.md'], doc => {
            cb(null, makeMarkdownRenderer(doc));
          })
      },
      {
        label: 'Status 状态',
        path: '/docs/components/status',
        getComponent: (location, cb) =>
          require(['../../docs/components/status.md'], doc => {
            cb(null, makeMarkdownRenderer(doc));
          })
      },
      {
        label: 'Switch 开关',
        path: '/docs/components/switch',
        getComponent: (location, cb) =>
          require(['../../docs/components/switch.md'], doc => {
            cb(null, makeMarkdownRenderer(doc));
          })
      },
      {
        label: 'Tabs 选项卡',
        path: '/docs/components/tabs',
        getComponent: (location, cb) =>
          require(['../../docs/components/tabs.md'], doc => {
            cb(null, makeMarkdownRenderer(doc));
          })
      },
      {
        label: 'Tasks 任务操作集合',
        path: '/docs/components/tasks',
        getComponent: (location, cb) =>
          require(['../../docs/components/tasks.md'], doc => {
            cb(null, makeMarkdownRenderer(doc));
          })
      },
      {
        label: 'Tpl 模板',
        path: '/docs/components/tpl',
        getComponent: (location, cb) =>
          require(['../../docs/components/tpl.md'], doc => {
            cb(null, makeMarkdownRenderer(doc));
          })
      },
      {
        label: 'Video 视频',
        path: '/docs/components/video',
        getComponent: (location, cb) =>
          require(['../../docs/components/video.md'], doc => {
            cb(null, makeMarkdownRenderer(doc));
          })
      },
      {
        label: 'Wrapper 包裹容器',
        path: '/docs/components/wrapper',
        getComponent: (location, cb) =>
          require(['../../docs/components/wrapper.md'], doc => {
            cb(null, makeMarkdownRenderer(doc));
          })
      },
      {
        label: 'Wizard 向导',
        path: '/docs/components/wizard',
        getComponent: (location, cb) =>
          require(['../../docs/components/wizard.md'], doc => {
            cb(null, makeMarkdownRenderer(doc));
          })
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
