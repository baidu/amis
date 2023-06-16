import {registerEditorPlugin, tipedLabel} from 'amis-editor-core';
import {BaseEventContext} from 'amis-editor-core';
import {defaultValue, getSchemaTpl} from 'amis-editor-core';
import {DatePlugin} from './Date';

const timeFormatOptions = [
  {
    label: 'HH:mm',
    value: 'HH:mm',
    timeFormat: 'HH:mm'
  },
  {
    label: 'HH:mm:ss',
    value: 'HH:mm:ss',
    timeFormat: 'HH:mm:ss'
  },
  {
    label: 'HH时mm分',
    value: 'HH时mm分',
    timeFormat: 'HH:mm'
  },
  {
    label: 'HH时mm分ss秒',
    value: 'HH时mm分ss秒',
    timeFormat: 'HH:mm:ss'
  }
];
// 暂仅提示时间戳，待input-time的timeFormat支持表达式后增加其他类型
const dateFormatOptions = [
  {
    label: 'X(时间戳)',
    value: 'X'
  }
];
export class TimePlugin extends DatePlugin {
  static id = 'TimePlugin';
  // 关联渲染器名字
  rendererName = 'time';
  name = '时间展示';
  isBaseComponent = true;

  pluginIcon = 'time-plugin';

  scaffold = {
    type: 'time',
    value: Math.round(Date.now() / 1000),
    format: 'HH:mm:ss'
  };

  previewSchema = {
    ...this.scaffold,
    format: 'HH:mm:ss',
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
                  type: 'input-time',
                  name: 'value',
                  inputFormat: 'HH:mm:ss',
                  timeFormat: 'HH:mm:ss',
                  label: '时间值'
                },
                {
                  type: 'input-text',
                  name: 'format',
                  label: tipedLabel(
                    '显示格式',
                    '请参考 <a href="https://momentjs.com/" target="_blank">moment</a> 中的格式用法。'
                  ),
                  clearable: true,
                  options: timeFormatOptions,
                  pipeIn: defaultValue('HH:mm:ss')
                },
                {
                  type: 'input-text',
                  name: 'valueFormat',
                  label: tipedLabel(
                    '值格式',
                    '请参考 <a href="https://momentjs.com/" target="_blank">moment</a> 中的格式用法。'
                  ),
                  clearable: true,
                  options: dateFormatOptions,
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

registerEditorPlugin(TimePlugin);
