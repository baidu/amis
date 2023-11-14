import {registerEditorPlugin, tipedLabel} from 'amis-editor-core';
import {BaseEventContext} from 'amis-editor-core';
import {defaultValue, getSchemaTpl} from 'amis-editor-core';
import {DatePlugin} from './Date';

const dateFormatOptions = [
  {
    label: '时间戳',
    children: [
      {
        label: 'X(时间戳)',
        value: 'X'
      },
      {
        label: 'x(毫秒时间戳)',
        value: 'x'
      }
    ]
  },
  {
    label: '日期格式',
    children: [
      {
        label: 'YYYY-MM-DD',
        value: 'YYYY-MM-DD'
      },
      {
        label: 'YYYY/MM/DD',
        value: 'YYYY/MM/DD'
      },
      {
        label: 'YYYY年MM月DD日',
        value: 'YYYY年MM月DD日'
      }
    ]
  },
  {
    label: '时间格式',
    children: [
      {
        label: 'HH:mm:ss',
        value: 'HH:mm:ss',
        timeFormat: 'HH:mm:ss'
      },
      {
        label: 'HH:mm',
        value: 'HH:mm',
        timeFormat: 'HH:mm'
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
    ]
  },
  {
    label: '日期时间格式',
    children: [
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
    ]
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
    format: 'YYYY-MM-DD HH:mm:ss',
    value: Math.round(Date.now() / 1000)
  };

  name = '日期时间展示';
  isBaseComponent = true;
  disabledRendererPlugin = false; // 避免被 DatePlugin 覆盖
  pluginIcon = 'datetime-plugin';
  docLink = '/amis/zh-CN/components/date';
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
                  type: 'nested-select',
                  name: 'format',
                  // searchable: true,
                  // selectMode: 'chained', // tree、chained
                  hideNodePathLabel: true,
                  onlyLeaf: true,
                  label: tipedLabel(
                    '显示格式',
                    '请参考 <a href="https://momentjs.com/" target="_blank">moment</a> 中的格式用法。'
                  ),
                  clearable: true,
                  // creatable: true,
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
        {
          title: '外观',
          body: getSchemaTpl('collapseGroup', [
            ...getSchemaTpl('theme:common', {
              exclude: ['layout'],
              baseExtra: [
                getSchemaTpl('theme:font', {
                  label: '文字',
                  name: 'themeCss.baseControlClassName.font'
                })
              ]
            }),
            {
              title: 'CSS类名',
              body: [getSchemaTpl('className')]
            }
          ])
        }
      ])
    ];
  };
}

registerEditorPlugin(DatetimePlugin);
