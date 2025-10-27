import {registerEditorPlugin, tipedLabel} from 'amis-editor-core';
import {BaseEventContext, BasePlugin} from 'amis-editor-core';
import {defaultValue, getSchemaTpl} from 'amis-editor-core';

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
];
const valueDateFormatOptions = [
  {
    label: 'X(时间戳)',
    value: 'X'
  }
];
export class DatePlugin extends BasePlugin {
  static id = 'DatePlugin';
  static scene = ['layout'];
  // 关联渲染器名字
  rendererName = 'date';
  $schema = '/schemas/AMISDateSchema.json';

  // 组件名称
  name = '日期展示';
  isBaseComponent = true;
  disabledRendererPlugin = true; // 可用 DatetimePlugin 实现
  description =
    '主要用来关联字段名做日期展示，支持各种格式如：X（时间戳），YYYY-MM-DD HH:mm:ss。';
  docLink = '/amis/zh-CN/components/date';
  tags = ['展示'];
  icon = 'fa fa-calendar';
  pluginIcon = 'date-plugin';
  scaffold = {
    type: 'date',
    value: Math.round(Date.now() / 1000)
  };
  previewSchema = {
    ...this.scaffold,
    format: 'YYYY-MM-DD',
    value: Math.round(Date.now() / 1000)
  };

  panelTitle = '日期展示';
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
                  type: 'input-date',
                  name: 'value',
                  label: '日期值'
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
                  pipeIn: defaultValue('YYYY-MM-DD')
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

registerEditorPlugin(DatePlugin);
