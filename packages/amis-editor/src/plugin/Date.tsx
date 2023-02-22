import {registerEditorPlugin} from 'amis-editor-core';
import {BaseEventContext, BasePlugin} from 'amis-editor-core';
import {defaultValue, getSchemaTpl} from 'amis-editor-core';

export class DatePlugin extends BasePlugin {
  // 关联渲染器名字
  rendererName = 'date';
  $schema = '/schemas/DateSchema.json';

  // 组件名称
  name = '日期展示';
  isBaseComponent = true;
  description =
    '主要用来关联字段名做日期展示，支持各种格式如：X（时间戳），YYYY-MM-DD HH:mm:ss。';
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
                  label: '日期数值'
                },
                {
                  type: 'input-text',
                  name: 'format',
                  label: '显示日期格式',
                  description: '请参考 moment 中的格式用法。',
                  pipeIn: defaultValue('YYYY-MM-DD')
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

registerEditorPlugin(DatePlugin);
