import {registerEditorPlugin} from 'amis-editor-core';
import {BaseEventContext} from 'amis-editor-core';
import {defaultValue, getSchemaTpl} from 'amis-editor-core';
import {DatePlugin} from './Date';

export class TimePlugin extends DatePlugin {
  // 关联渲染器名字
  rendererName = 'time';
  name = '时间展示';
  isBaseComponent = true;

  pluginIcon = 'time-plugin';

  scaffold = {
    type: 'time',
    value: Math.round(Date.now() / 1000)
  };

  previewSchema = {
    ...this.scaffold,
    format: 'HH:mm:ss',
    value: Math.round(Date.now() / 1000)
  };
  panelBodyCreator = (context: BaseEventContext) => {
    return [
      getSchemaTpl('tabs', [
        {
          title: '常规',
          body: [
            {
              type: 'input-time',
              name: 'value',
              inputFormat: 'HH:mm:ss',
              timeFormat: 'HH:mm:ss',
              label: '时间数值'
            },
            {
              type: 'input-text',
              name: 'format',
              label: '显示时间格式',
              description: '请参考 moment 中的格式用法。',
              pipeIn: defaultValue('HH:mm:ss')
            },
            {
              type: 'input-text',
              name: 'valueFormat',
              label: '数据日期格式',
              description: '请参考 moment 中的格式用法。',
              pipeIn: defaultValue('X')
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

registerEditorPlugin(TimePlugin);
