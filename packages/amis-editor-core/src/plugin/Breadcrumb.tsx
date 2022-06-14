/**
 * @file 面包屑
 */
import {registerEditorPlugin} from '../manager';
import {BaseEventContext, BasePlugin} from '../plugin';
import {getSchemaTpl} from '../component/schemaTpl';

export class BreadcrumbPlugin extends BasePlugin {
  // 关联渲染器名字
  rendererName = 'breadcrumb';
  $schema = '/schemas/BreadcrumbSchema.json';
  disabledRendererPlugin = true;

  // 组件名称
  name = '面包屑';
  isBaseComponent = true;
  icon = 'fa fa-list';
  description = '面包屑导航';
  docLink = '/amis/zh-CN/components/breadcrumb';
  tags = ['其他'];
  scaffold = {
    type: 'breadcrumb',
    items: [
      {
        label: '首页',
        href: '/',
        icon: 'fa fa-home'
      },
      {
        label: '上级页面'
      },
      {
        label: '<b>当前页面</b>'
      }
    ]
  };
  previewSchema: any = {
    ...this.scaffold
  };

  panelTitle = '面包屑';
  panelBody = [
    getSchemaTpl('tabs', [
      {
        title: '常规',
        body: [
          {
            label: '分隔符',
            type: 'input-text',
            name: 'separator'
          },
          getSchemaTpl('api', {
            label: '动态数据',
            name: 'source'
          }),
          {
            label: '面包屑',
            name: 'items',
            type: 'combo',
            multiple: true,
            multiLine: true,
            draggable: true,
            addButtonText: '新增',
            items: [
              {
                type: 'input-text',
                placeholder: '文本',
                name: 'label'
              },
              {
                type: 'input-text',
                name: 'href',
                placeholder: '链接'
              },
              {
                name: 'icon',
                label: '图标',
                type: 'icon-picker',
                className: 'fix-icon-picker-overflow',
              }
            ]
          }
        ]
      },
      {
        title: '外观',
        body: [
          getSchemaTpl('className'),
          getSchemaTpl('className', {
            name: 'itemClassName',
            label: '面包屑的 CSS 类名'
          }),
          ,
          getSchemaTpl('className', {
            name: 'separatorClassName',
            label: '分隔符的 CSS 类名'
          })
        ]
      },
      {
        title: '显隐',
        body: [getSchemaTpl('ref'), getSchemaTpl('visible')]
      }
    ])
  ];
}

registerEditorPlugin(BreadcrumbPlugin);
