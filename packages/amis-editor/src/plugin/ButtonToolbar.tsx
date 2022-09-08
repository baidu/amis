import {BasePlugin} from 'amis-editor-core';
import {getSchemaTpl} from 'amis-editor-core';

export class ButtonToolbarPlugin extends BasePlugin {
  // 关联渲染器名字
  rendererName = 'button-toolbar';
  $schema = '/schemas/ButtonToolbarSchema.json';
  // 组件名称
  name = '按钮工具栏';
  isBaseComponent = true;
  description = '可以用来放置多个按钮或者按钮组，按钮之间会存在一定的间隔';
  tags = ['按钮'];
  icon = 'fa fa-ellipsis-h';
  pluginIcon = 'btn-toolbar-plugin';
  /**
   * 组件选择面板中隐藏，和ButtonGroup合并
   */
  disabledRendererPlugin = true;

  scaffold = {
    type: 'button-toolbar',
    buttons: [
      {
        type: 'button',
        label: '按钮1'
      },
      {
        type: 'button',
        label: '按钮2'
      }
    ]
  };
  previewSchema = {
    ...this.scaffold
  };

  panelTitle = '按钮工具栏';
  panelBody = [
    getSchemaTpl('tabs', [
      {
        title: '常规',
        body: [
          {
            name: 'buttons',
            type: 'combo',
            label: '按钮管理',
            multiple: true,
            addable: true,
            draggable: true,
            draggableTip: '可排序、可移除、如要编辑请在预览区选中编辑',
            editable: false,
            visibleOn: 'this.buttons && this.buttons.length',
            items: [
              {
                type: 'tpl',
                inline: false,
                className: 'p-t-xs',
                tpl: `<span class="label label-default"><% if (data.type === "button-group") { %> ${'按钮组'} <% } else { %><%= data.label %><% if (data.icon) { %><i class="<%= data.icon %>"/><% }%><% } %></span>`
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
// 和plugin/Form/ButtonToolbar.tsx的重复了
// registerEditorPlugin(ButtonToolbarPlugin);
