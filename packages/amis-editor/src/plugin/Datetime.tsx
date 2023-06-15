import {registerEditorPlugin, tipedLabel} from 'amis-editor-core';
import {BaseEventContext} from 'amis-editor-core';
import {defaultValue, getSchemaTpl} from 'amis-editor-core';
import {DatePlugin} from './Date';

const dateFormatOptions = [
  {
    label: 'X(时间戳)',
    value: 'X'
  },
  {
    label: 'x(毫秒时间戳)',
    value: 'x'
  },
  {
    label: 'YYYY-MM-DD HH:mm:ss',
    value: 'YYYY-MM-DD HH:mm:ss'
  },
  {
    label: 'YYYY/MM/DD HH:mm:ss',
    value: 'YYYY/MM/DD HH:mm:ss'
  },
  {
    label: 'YYYY年MM月DD日 HH时mm分ss秒',
    value: 'YYYY年MM月DD日 HH时mm分ss秒'
  }
];
const valueDateFormatOptions = [
  {
    label: 'X(时间戳)',
    value: 'X'
  }
];
export class DatetimePlugin extends DatePlugin {
  static id = 'DatetimePlugin';
  static scene = ['layout'];
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
                  label: '日期时间值'
                },
                {
                  type: 'input-text',
                  name: 'format',
                  label: tipedLabel(
                    '显示格式',
                    '请参考 <a href="https://momentjs.com/" target="_blank">moment</a> 中的格式用法。'
                  ),
                  clearable: true,
                  options: dateFormatOptions,
                  pipeIn: defaultValue('YYYY-MM-DD HH:mm:ss')
                },
                {
                  type: 'input-text',
                  name: 'valueFormat',
                  label: tipedLabel(
                    '值格式',
                    '请参考 <a href="https://momentjs.com/" target="_blank">moment</a> 中的格式用法。'
                  ),
                  clearable: true,
                  options: valueDateFormatOptions,
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
