import {registerEditorPlugin} from 'amis-editor-core';
import {BasePlugin, BaseEventContext} from 'amis-editor-core';
import {defaultValue, getSchemaTpl} from 'amis-editor-core';

export class StatusPlugin extends BasePlugin {
  // 关联渲染器名字
  rendererName = 'status';
  $schema = '/schemas/StatusSchema.json';

  // 组件名称
  name = '状态显示';
  isBaseComponent = true;
  description =
    '用图标更具关联字段来展示状态，比如 1 展示 √、0 展示 x。这块可以自定义配置';
  docLink = '/amis/zh-CN/components/status';
  tags = ['展示'];
  icon = 'fa fa-check-square-o';
  scaffold = {
    type: 'status',
    value: 1
  };
  previewSchema = {
    ...this.scaffold
  };

  panelTitle = '状态';
  panelBodyCreator = (context: BaseEventContext) => {
    const isUnderField: boolean = /\/field\/\w+$/.test(context.path as string);
    return [
      getSchemaTpl('tabs', [
        {
          title: '常规',
          body: [
            isUnderField
              ? {
                  type: 'tpl',
                  inline: false,
                  className: 'text-info text-sm',
                  tpl: '<p>当前为字段内容节点配置，选择上层还有更多的配置。</p>'
                }
              : null,
            {
              name: 'map',
              label: '图标配置',
              type: 'input-array',
              items: {
                type: 'input-text'
              },
              descrition: '配置不通的值段，用不通的样式提示用户',
              pipeIn: defaultValue([
                'fa fa-times text-danger',
                'fa fa-check text-success'
              ])
            },
            {
              name: 'placeholder',
              type: 'input-text',
              pipeIn: defaultValue('-'),
              label: '占位符'
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
  };
}

registerEditorPlugin(StatusPlugin);
