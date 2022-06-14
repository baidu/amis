import {registerEditorPlugin} from '../manager';
import {BaseEventContext, BasePlugin} from '../plugin';
import {defaultValue, getSchemaTpl} from '../component/schemaTpl';
import flatten = require('lodash/flatten');
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
  panelBodyCreator = (context: BaseEventContext) => {
    const isUnderField = /\/field\/\w+$/.test(context.path as string);
    return [
      getSchemaTpl('tabs', [
        {
          title: '常规',
          body: flatten([
            isUnderField
              ? {
                  type: 'tpl',
                  inline: false,
                  className: 'text-info text-sm',
                  tpl: '<p>当前为字段内容节点配置，选择上层还有更多的配置。</p>'
                }
              : null,

            {
              name: 'levelExpand',
              type: 'input-number',
              label: '默认展开级别',
              pipeIn: defaultValue(1)
            }
          ])
        },
        {
          title: '外观',
          body: flatten([getSchemaTpl('className')])
        },
        {
          title: '显隐',
          body: flatten([getSchemaTpl('ref'), getSchemaTpl('visible')])
        }
      ])
    ];
  };
}

registerEditorPlugin(JsonPlugin);
