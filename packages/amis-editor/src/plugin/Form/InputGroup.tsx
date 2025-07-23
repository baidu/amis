import React from 'react';
import {
  defaultValue,
  getSchemaTpl,
  registerEditorPlugin,
  BasePlugin,
  BaseEventContext,
  tipedLabel
} from 'amis-editor-core';
import {ValidatorTag} from '../../validator';
import {generateId} from '../../util';

export class InputGroupControlPlugin extends BasePlugin {
  static id = 'InputGroupControlPlugin';
  static scene = ['layout'];
  // 关联渲染器名字
  rendererName = 'input-group';
  $schema = '/schemas/InputGroupControlSchema.json';

  // 组件名称
  name = '输入组合';
  isBaseComponent = true;
  icon = 'fa fa-object-group';
  pluginIcon = 'input-group-plugin';
  description = '输入组合，支持多种类型的控件组合';
  searchKeywords = '输入框组合';
  docLink = '/amis/zh-CN/components/form/input-group';
  tags = ['表单项'];
  scaffold = {
    type: 'input-group',
    name: 'input-group',
    label: 'input 组合',
    body: [
      {
        type: 'input-text',
        inputClassName: 'b-r-none p-r-none',
        id: generateId(),
        name: 'input-group'
      },
      {
        type: 'submit',
        label: '提交',
        id: generateId(),
        level: 'primary'
      }
    ]
  };
  previewSchema: any = {
    type: 'form',
    className: 'text-left',
    mode: 'horizontal',
    wrapWithPanel: false,
    body: [
      {
        ...this.scaffold
      }
    ]
  };

  panelTitle = 'Input 组合';

  regions = [
    {
      key: 'body',
      label: '内容区',
      preferTag: '内容区',
      renderMethod: 'render',
      matchRegion: (elem: JSX.Element) => !!elem
    }
  ];

  notRenderFormZone = true;

  panelJustify = true;

  panelBodyCreator = (context: BaseEventContext) => {
    return getSchemaTpl('tabs', [
      {
        title: '属性',
        body: getSchemaTpl('collapseGroup', [
          {
            title: '基本',
            body: [
              getSchemaTpl('label'),
              getSchemaTpl('labelRemark'),
              getSchemaTpl('remark'),
              getSchemaTpl('description')
            ]
          },
          getSchemaTpl('status', {isFormItem: true}),
          getSchemaTpl('validation', {tag: ValidatorTag.MultiSelect})
        ])
      },
      {
        title: '外观',
        body: [
          getSchemaTpl('collapseGroup', [
            getSchemaTpl('theme:formItem'),
            getSchemaTpl('style:classNames')
          ])
        ]
      }
    ]);
  };
}

registerEditorPlugin(InputGroupControlPlugin);
