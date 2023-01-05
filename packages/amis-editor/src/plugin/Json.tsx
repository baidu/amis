import {registerEditorPlugin} from 'amis-editor-core';
import {BaseEventContext, BasePlugin} from 'amis-editor-core';
import {defaultValue, getSchemaTpl} from 'amis-editor-core';
import flatten from 'lodash/flatten';
export class JsonPlugin extends BasePlugin {
  // 关联渲染器名字
  rendererName = 'json';
  $schema = '/schemas/JsonSchema.json';

  // 组件名称
  name = 'JSON展示';
  isBaseComponent = true;
  description = '用来展示 JSON 数据。';
  docLink = '/amis/zh-CN/components/json';
  tags = ['展示'];
  icon = 'fa fa-code';
  pluginIcon = 'json-view-plugin';
  scaffold = {
    type: 'json'
  };
  previewSchema = {
    ...this.scaffold,
    name: 'json',
    value: {
      a: 1,
      b: {
        c: 2
      }
    }
  };

  panelTitle = 'JSON';
  panelJustify = true;
  panelBodyCreator = (context: BaseEventContext) => {
    const isUnderField = /\/field\/\w+$/.test(context.path as string);
    return [
      getSchemaTpl('tabs', [
        {
          title: '属性',
          body: getSchemaTpl('collapseGroup', [
            {
              title: '基本',
              body: [
                isUnderField
                  ? {
                      type: 'tpl',
                      inline: false,
                      className: 'text-info text-sm',
                      tpl: '<p>当前为字段内容节点配置，选择上层还有更多配置</p>'
                    }
                  : null,

                {
                  name: 'levelExpand',
                  type: 'input-number',
                  label: '默认展开级别',
                  pipeIn: defaultValue(1)
                }
              ]
            },
            getSchemaTpl('status')
          ])
        },
        getSchemaTpl('onlyClassNameTab')
      ])
    ];
  };
}

registerEditorPlugin(JsonPlugin);
