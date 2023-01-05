import {registerEditorPlugin} from 'amis-editor-core';
import {BaseEventContext} from 'amis-editor-core';
import {defaultValue, getSchemaTpl} from 'amis-editor-core';
import {DatePlugin} from './Date';

export class DatetimePlugin extends DatePlugin {
  // 关联渲染器名字
  rendererName = 'datetime';

  scaffold = {
    type: 'datetime',
    value: Math.round(Date.now() / 1000)
  };

  name = '日期时间展示';
  isBaseComponent = true;
  pluginIcon = 'datetime-plugin';

  previewSchema = {
    ...this.scaffold,
    format: 'YYYY-MM-DD HH:mm:ss',
    value: Math.round(Date.now() / 1000)
  };
  panelJustify = true;
  panelBodyCreator = (context: BaseEventContext) => {
    return [
      getSchemaTpl('tabs', [
        {
          title: '属性',
          body: getSchemaTpl('collapseGroup', [
            {
              title: '基本',
              body: [
                {
                  type: 'input-datetime',
                  name: 'value',
                  label: '日期时间数值'
                },
                {
                  type: 'input-text',
                  name: 'format',
                  label: '显示日期时间格式',
                  description: '请参考 moment 中的格式用法。',
                  pipeIn: defaultValue('YYYY-MM-DD HH:mm:ss')
                },
                {
                  type: 'input-text',
                  name: 'valueFormat',
                  label: '数据日期格式',
                  description: '请参考 moment 中的格式用法。',
                  pipeIn: defaultValue('X')
                },
                getSchemaTpl('placeholder', {
                  pipeIn: defaultValue('-'),
                  label: '占位符'
                })
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

registerEditorPlugin(DatetimePlugin);
