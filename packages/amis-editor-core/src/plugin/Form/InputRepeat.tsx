import {getSchemaTpl} from '../../component/schemaTpl';
import {registerEditorPlugin} from '../../manager';
import {BasePlugin} from '../../plugin';

export class RepeatControlPlugin extends BasePlugin {
  // 关联渲染器名字
  rendererName = 'input-repeat';
  $schema = '/schemas/RepeatControlSchema.json';

  // 组件名称
  name = '重复周期选择';
  isBaseComponent = true;
  icon = 'fa fa-repeat';
  description = `选择重复的频率，如每时、每天、每周等`;
  docLink = '/amis/zh-CN/components/form/input-repeat';
  tags = ['表单项'];
  scaffold = {
    type: 'input-repeat',
    label: '周期',
    name: 'repeat'
  };
  previewSchema: any = {
    type: 'form',
    className: 'text-left',
    mode: 'horizontal',
    wrapWithPanel: false,
    body: [
      {
        ...this.scaffold
      }
    ]
  };

  panelTitle = '周期';
  panelBody = [
    getSchemaTpl('switchDefaultValue'),
    {
      type: 'input-text',
      name: 'value',
      label: '默认值',
      visibleOn: 'typeof this.value !== "undefined"'
    },

    {
      name: 'options',
      type: 'select',
      label: '启用单位',
      options: 'secondly,minutely,hourly,daily,weekdays,weekly,monthly,yearly'.split(
        ','
      ),
      value: 'hourly,daily,weekly,monthly',
      multiple: true
    }
  ];
}

registerEditorPlugin(RepeatControlPlugin);
