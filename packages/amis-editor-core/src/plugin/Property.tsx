/**
 * @file 属性表
 */
import {registerEditorPlugin} from '../manager';
import {BaseEventContext, BasePlugin} from '../plugin';
import {getSchemaTpl} from '../component/schemaTpl';

export class PropertyPlugin extends BasePlugin {
  // 关联渲染器名字
  rendererName = 'property';
  $schema = '/schemas/PropertySchema.json';

  // 组件名称
  name = '属性表';
  isBaseComponent = true;
  icon = 'fa fa-list';
  description = '属性表';
  docLink = '/amis/zh-CN/components/property';
  tags = ['其他'];
  scaffold = {
    type: 'property',
    title: '机器配置',
    items: [
      {
        label: 'cpu',
        content: '1 core'
      },
      {
        label: 'memory',
        content: '4G'
      },
      {
        label: 'disk',
        content: '80G'
      },
      {
        label: 'network',
        content: '4M',
        span: 2
      },
      {
        label: 'IDC',
        content: 'beijing'
      },
      {
        label: 'Note',
        content: '其它说明',
        span: 3
      }
    ]
  };
  previewSchema: any = {
    ...this.scaffold
  };

  panelTitle = '属性表';
  panelBody = [
    getSchemaTpl('tabs', [
      {
        title: '常规',
        body: [
          {
            label: '标题',
            type: 'input-text',
            name: 'title'
          },
          {
            label: '每行显示几列',
            type: 'input-number',
            value: 3,
            name: 'column'
          },
          {
            type: 'radios',
            name: 'mode',
            inline: true,
            value: 'table',
            label: '显示模式',
            options: ['table', 'simple']
          },
          {
            label: '分隔符',
            type: 'input-text',
            name: 'separator',
            visibleOn: 'data.mode === "simple"'
          },
          {
            label: '属性取自变量',
            type: 'input-text',
            name: 'source'
          },
          {
            label: '属性列表',
            name: 'items',
            type: 'combo',
            multiple: true,
            multiLine: true,
            draggable: true,
            addButtonText: '新增',
            items: [
              {
                type: 'input-text',
                mode: 'inline',
                size: 'sm',
                label: '属性名',
                name: 'label'
              },
              {
                type: 'input-text',
                mode: 'inline',
                size: 'sm',
                label: '属性值',
                name: 'content'
              },
              {
                type: 'input-number',
                mode: 'inline',
                size: 'sm',
                label: '跨几列',
                value: 1,
                name: 'span'
              }
            ]
          }
        ]
      },
      {
        title: '外观',
        body: [getSchemaTpl('className')]
      },
      {
        title: '显隐',
        body: [getSchemaTpl('ref'), getSchemaTpl('visible')]
      }
    ])
  ];
}

registerEditorPlugin(PropertyPlugin);
