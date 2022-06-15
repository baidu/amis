import {registerEditorPlugin} from 'amis-editor-core';
import {BasePlugin, RegionConfig, BaseEventContext} from 'amis-editor-core';
import {getSchemaTpl} from 'amis-editor-core';

import {
  BUTTON_DEFAULT_ACTION,
  formItemControl
} from '../../component/BaseControl';

export class ButtonToolbarControlPlugin extends BasePlugin {
  // 关联渲染器名字
  rendererName = 'button-toolbar';
  $schema = '/schemas/ButtonToolbarControlSchema.json';

  // 组件名称
  name = '按钮工具栏';
  isBaseComponent = true;
  icon = 'fa fa-ellipsis-h';
  description = '可以用来放置多个按钮或者按钮组，按钮之间会存在一定的间隔';
  docLink = '/amis/zh-CN/components/form/button-toolbar';
  tags = ['表单项', '按钮'];
  scaffold = {
    type: 'button-toolbar',
    buttons: [
      {
        type: 'button',
        label: '按钮1',
        ...BUTTON_DEFAULT_ACTION
      },
      {
        type: 'button',
        label: '按钮2',
        ...BUTTON_DEFAULT_ACTION
      }
    ]
  };
  previewSchema: any = {
    type: 'form',
    wrapWithPanel: false,
    mode: 'horizontal',
    body: {
      ...this.scaffold,
      label: '按钮工具栏'
    }
  };

  // 容器配置
  regions: Array<RegionConfig> = [
    {
      key: 'buttons',
      label: '按钮集合',
      preferTag: '按钮',
      renderMethod: 'renderButtons'
    }
  ];

  notRenderFormZone = true;

  panelTitle = '工具栏';

  panelBodyCreator = (context: BaseEventContext) => {
    return formItemControl(
      {
        common: {
          replace: true,
          body: [
            getSchemaTpl('formItemName', {
              required: true
            }),
            getSchemaTpl('label'),
            getSchemaTpl('remark'),
            getSchemaTpl('labelRemark'),
            getSchemaTpl('description')
          ]
        },
        option: {
          title: '按钮管理',
          replace: true,
          body: [
            {
              name: 'buttons',
              type: 'combo',
              label: '',
              multiple: true,
              addable: true,
              minLength: 1,
              draggable: true,
              draggableTip: '',
              editable: false,
              visibleOn: 'this.buttons && this.buttons.length',
              items: [
                {
                  type: 'tpl',
                  inline: false,
                  tpl:
                    '<span class="label label-default"><% if (data.type === "button-group") { %> 按钮组 <% } else { %><%= data.label %><% if (data.icon) { %><i class="<%= data.icon %>"/><% }%><% } %></span>'
                }
              ],
              addButtonText: '新增按钮',
              scaffold: {
                type: 'button',
                label: '按钮'
              }
            }
          ]
        },
        event: {
          hidden: false
        }
      },
      context
    );
  };
}

registerEditorPlugin(ButtonToolbarControlPlugin);
