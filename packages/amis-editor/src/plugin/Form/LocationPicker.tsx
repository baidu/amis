import {getSchemaTpl} from 'amis-editor-core';
import {registerEditorPlugin} from 'amis-editor-core';
import {BasePlugin, BaseEventContext} from 'amis-editor-core';

export class LocationControlPlugin extends BasePlugin {
  // 关联渲染器名字
  rendererName = 'location-picker';
  $schema = '/schemas/LocationControlSchema.json';

  // 组件名称
  name = '地理位置选择';
  isBaseComponent = true;
  icon = 'fa fa-location-arrow';
  pluginIcon = 'location-picker-plugin';
  description = '地理位置选择';
  docLink = '/amis/zh-CN/components/form/location-picker';
  tags = ['表单项'];
  scaffold = {
    type: 'location-picker',
    name: 'location',
    label: '位置选择'
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

  panelTitle = '地理位置选择';

  panelBodyCreator = (context: BaseEventContext) => {
    return [
      getSchemaTpl('clearable'),
      {
        type: 'input-text',
        name: 'ak',
        label: '百度地图的 AK',
        description:
          '请从<a href="http://lbsyun.baidu.com/" target="_blank">百度地图开放平台</a>获取'
      },
      {
        type: 'select',
        name: 'coordinatesType',
        label: '坐标格式',
        value: 'bd09',
        options: [
          {label: '百度坐标', value: 'bd09'},
          {label: '国测局坐标', value: 'gcj02'}
        ]
      }
      /* 备注: 暂时不开放
      getSchemaTpl('valueFormula', {
        rendererSchema: context?.schema,
      }),
      */
    ];
  };
}

registerEditorPlugin(LocationControlPlugin);
