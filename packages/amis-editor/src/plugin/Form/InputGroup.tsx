import React from 'react';
import {Button} from 'amis';
import {getSchemaTpl} from 'amis-editor-core';
import {registerEditorPlugin} from 'amis-editor-core';
import {BasePlugin} from 'amis-editor-core';

export class InputGroupControlPlugin extends BasePlugin {
  // 关联渲染器名字
  rendererName = 'input-group';
  $schema = '/schemas/InputGroupControlSchema.json';

  // 组件名称
  name = '输入组合';
  isBaseComponent = true;
  icon = 'fa fa-object-group';
  description = `输入组合，支持多种类型的控件组合`;
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
        name: 'input-group'
      },
      {
        type: 'submit',
        label: '提交',
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
  panelBody = [
    [
      {
        name: 'body',
        type: 'combo',
        // label: '子按钮',
        multiple: true,
        addable: false,
        draggable: true,
        draggableTip: '可排序、可移除、如要编辑请在预览区选中编辑',
        editable: false,
        visibleOn: 'this.body && this.body.length',
        items: [
          {
            type: 'tpl',
            inline: false,
            className: 'p-t-xs',
            tpl:
              '<%= data.label %><% if (data.icon) { %><i class="<%= data.icon %>"/><% }%>'
          }
        ]
      },
      {
        children: (
          <Button
            className="m-b"
            // TODO：需要限制一下 body 的类型，之前是这些 'text', 'url', 'email', 'password', 'select', 'date', 'time', 'date-time', 'date-range', 'formula', 'color', 'city', 'icon', 'plain', 'tpl', 'button', 'submit', 'reset'
            onClick={() => {
              // this.manager.showInsertPanel('body')
              this.manager.showRendererPanel('表单项'); // '请从左侧组件面板中点击添加表单项'
            }}
            level="danger"
            tooltip="插入一个新的元素"
            size="sm"
            block
          >
            新增元素
          </Button>
        )
      },
      getSchemaTpl('formItemName', {
        required: true
      })
    ]
  ];
}

registerEditorPlugin(InputGroupControlPlugin);
