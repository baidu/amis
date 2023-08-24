import {EditorNodeType, getSchemaTpl} from 'amis-editor-core';
import {registerEditorPlugin} from 'amis-editor-core';
import {BasePlugin, BaseEventContext} from 'amis-editor-core';
import {ValidatorTag} from '../../validator';

export class LocationControlPlugin extends BasePlugin {
  static id = 'LocationControlPlugin';
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

  panelJustify = true;

  panelBodyCreator = (context: BaseEventContext) => {
    const renderer: any = context.info.renderer;

    return getSchemaTpl('tabs', [
      {
        title: '属性',
        body: [
          getSchemaTpl('collapseGroup', [
            {
              title: '基本',
              body: [
                getSchemaTpl('layout:originPosition', {value: 'left-top'}),
                getSchemaTpl('formItemName', {
                  required: true
                }),
                getSchemaTpl('label'),
                /* 备注: 暂时不开放
                getSchemaTpl('valueFormula', {
                  rendererSchema: context?.schema,
                }),
                */
                {
                  type: 'input-text',
                  name: 'ak',
                  label: '百度地图的 AK',
                  required: true,
                  validationErrors: {
                    isRequired:
                      'AK不能为空，请访问http://lbsyun.baidu.com/获取密钥(AK)'
                  },
                  description:
                    '请从<a href="http://lbsyun.baidu.com/" target="_blank" class="text-sm">百度地图开放平台</a>获取'
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
                },

                getSchemaTpl('clearable'),
                getSchemaTpl('labelRemark'),
                getSchemaTpl('remark'),
                getSchemaTpl('placeholder'),
                getSchemaTpl('description')
              ]
            },
            getSchemaTpl('status', {
              isFormItem: true,
              readonly: false
            }),
            getSchemaTpl('validation', {tag: ValidatorTag.Text})
          ])
        ]
      },
      {
        title: '外观',
        body: [
          getSchemaTpl('collapseGroup', [
            getSchemaTpl('style:formItem', {renderer}),
            getSchemaTpl('theme:classNames', {
              schema: [
                {
                  type: 'theme-classname',
                  label: '控件',
                  name: 'inputClassName'
                },
                {
                  type: 'theme-classname',
                  label: '表单项',
                  name: 'className'
                },
                {
                  type: 'theme-classname',
                  label: '静态表单项',
                  name: 'staticClassName'
                }
              ]
            })
          ])
        ]
      }
    ]);
  };

  buildDataSchemas(node: EditorNodeType, region: EditorNodeType) {
    return {
      type: 'object',
      title: node.schema?.label || node.schema?.name,
      properties: {
        city: {
          type: 'string',
          title: '城市'
        },
        address: {
          type: 'string',
          title: '地址'
        },
        lng: {
          type: 'number',
          title: '经度'
        },
        lat: {
          type: 'number',
          title: '纬度'
        },
        vendor: {
          type: 'string',
          title: '地图厂商'
        }
      },
      originalValue: node.schema?.value // 记录原始值，循环引用检测需要
    };
  }
}

registerEditorPlugin(LocationControlPlugin);
