import {registerEditorPlugin} from 'amis-editor-core';
import {BaseEventContext, BasePlugin} from 'amis-editor-core';
import {defaultValue, getSchemaTpl} from 'amis-editor-core';

export class PlainPlugin extends BasePlugin {
  // 关联渲染器名字
  rendererName = 'plain';
  $schema = '/schemas/PlainSchema.json';
  disabledRendererPlugin = true; // 组件面板不显示

  // 组件名称
  name = '纯文本';
  isBaseComponent = true;
  icon = 'fa fa-file-text-o';
  pluginIcon = 'plain-plugin';
  description = '用来展示纯文字，html 标签会被转义。';
  docLink = '/amis/zh-CN/components/plain';
  tags = ['展示'];
  previewSchema = {
    type: 'plain',
    text: '这是纯文本',
    className: 'text-center',
    inline: false
  };
  scaffold: any = {
    type: 'plain',
    tpl: '内容',
    inline: false
  };

  panelTitle = '纯文本';
  panelBodyCreator = (context: BaseEventContext) => {
    const isTableCell = context.info.renderer.name === 'table-cell';

    return getSchemaTpl('tabs', [
      {
        title: '常规',
        body: [
          {
            label: '内容',
            type: 'textarea',
            pipeIn: (value: any, data: any) => value || (data && data.text),
            name: 'tpl',
            description:
              '如果当前字段有值，请不要设置，否则覆盖。支持使用 <code>\\${xxx}</code> 来获取变量，或者用 lodash.template 语法来写模板逻辑。<a target="_blank" href="/amis/zh-CN/docs/concepts/template">详情</a>'
          },

          {
            name: 'placeholder',
            label: '占位符',
            type: 'input-text',
            pipeIn: defaultValue('-')
          }
        ]
      },

      isTableCell
        ? null
        : {
            title: '外观',
            body: [
              getSchemaTpl('switch', {
                name: 'inline',
                label: '内联模式',
                value: true
              }),

              getSchemaTpl('className')
            ]
          },

      isTableCell
        ? null
        : {
            title: '显隐',
            body: [getSchemaTpl('ref'), getSchemaTpl('visible')]
          }
    ]);
  };
}

registerEditorPlugin(PlainPlugin);
