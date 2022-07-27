/**
 * @file 头像
 */
import {registerEditorPlugin} from 'amis-editor-core';
import {BaseEventContext, BasePlugin} from 'amis-editor-core';
import {getSchemaTpl, defaultValue} from 'amis-editor-core';
import {tipedLabel} from 'amis-editor-core';

const DefaultSize = 40;
const DefaultBorderRadius = 20;

const widthOrheightPipeIn = (curValue: string, rest: any) =>
  curValue ? curValue : rest.data?.size ?? DefaultSize;

export class AvatarPlugin extends BasePlugin {
  // 关联渲染器名字
  rendererName = 'avatar';
  $schema = '/schemas/AvatarSchema.json';

  // 组件名称
  name = '头像';
  isBaseComponent = true;
  icon = 'fa fa-user';
  pluginIcon = 'avatar-plugin';
  description = '用户头像';
  docLink = '/amis/zh-CN/components/avatar';
  tags = ['展示'];
  scaffold = {
    type: 'avatar',
    showtype: 'image',
    icon: '',
    fit: 'cover',
    style: {
      width: DefaultSize,
      height: DefaultSize,
      borderRadius: DefaultBorderRadius
    }
  };
  previewSchema: any = {
    ...this.scaffold
  };

  notRenderFormZone = true;

  panelJustify = true;

  panelTitle = '头像';

  panelBodyCreator = (context: BaseEventContext) => {
    return getSchemaTpl('tabs', [
      {
        title: '属性',
        body: [
          getSchemaTpl('collapseGroup', [
            {
              className: 'p-none',
              title: '常用',
              body: [
                // 如果同时存在 src、text 和 icon，会优先用 src、接着 text、最后 icon
                {
                  type: 'button-group-select',
                  label: '内容',
                  name: 'showtype',
                  tiled: true,
                  inputClassName: 'items-center',
                  options: [
                    {label: '图片', value: 'image'},
                    {label: '图标', value: 'icon'},
                    {label: '文字', value: 'text'}
                  ],
                  pipeIn: (value: string, form: any) => {
                    if (value) {
                      return value;
                    }
                    const showType = form.data?.text
                      ? 'text'
                      : form.data?.icon
                      ? 'icon'
                      : 'image';
                    // 使用setTimeout跳过react更新检测，推进showtype更新
                    setTimeout(() => form.setValueByName('showtype', showType));
                    return showType;
                  },
                  onChange: (value: any, origin: any, item: any, form: any) => {
                    form.setValues({
                      src: undefined,
                      fit: 'cover',
                      text: undefined,
                      gap: 4,
                      icon: ''
                    });
                  }
                },
                {
                  type: 'container',
                  className: 'ae-ExtendMore mb-3',
                  body: [
                    // 图标
                    {
                      label: '图标',
                      name: 'icon',
                      type: 'icon-picker',
                      className: 'fix-icon-picker-overflow',
                      visibleOn: 'data.showtype === "icon"'
                    },
                    // 图片
                    getSchemaTpl('valueFormula', {
                      rendererSchema: {
                        type: 'input-url'
                      },
                      name: 'src',
                      label: '链接',
                      visibleOn: 'data.showtype === "image"'
                    }),
                    {
                      label: tipedLabel(
                        '填充方式',
                        '图片大小与控件大小不一致的图片处理方式'
                      ),
                      name: 'fit',
                      type: 'select',
                      pipeIn: defaultValue('cover'),
                      options: [
                        {
                          label: '等比例裁剪长边',
                          value: 'cover'
                        },
                        {
                          label: '等比例留空短边',
                          value: 'contain'
                        },
                        {
                          label: '拉伸图片填满',
                          value: 'fill'
                        },
                        {
                          label: '按原尺寸裁剪',
                          value: 'none'
                        }
                      ],
                      visibleOn: 'data.showtype === "image"'
                    },

                    // 文字
                    {
                      label: '文字',
                      name: 'text',
                      type: 'input-text',
                      pipeOut: (value: any) =>
                        value === '' ? undefined : value,
                      visibleOn: 'data.showtype === "text"'
                    },
                    {
                      type: 'input-group',
                      name: 'gap',
                      value: 4,
                      label: tipedLabel(
                        '边框距离',
                        '文字居中，文字过多时保持与边框最小的距离'
                      ),
                      body: [
                        {
                          type: 'input-number',
                          name: 'gap',
                          min: 0
                        },
                        {
                          type: 'tpl',
                          addOnclassName: 'border-0 bg-none',
                          tpl: 'px'
                        }
                      ],
                      visibleOn: 'data.showtype === "text"'
                    }
                  ]
                },
                getSchemaTpl('badge')
              ]
            },
            getSchemaTpl('status')
          ])
        ]
      },
      {
        title: '外观',
        className: 'p-none',
        body: getSchemaTpl('collapseGroup', [
          {
            title: '基本',
            body: [
              {
                type: 'input-number',
                label: '长度',
                min: 0,
                name: 'style.width',
                pipeIn: widthOrheightPipeIn
              },
              {
                type: 'input-number',
                label: '高度',
                min: 1,
                name: 'style.height',
                pipeIn: widthOrheightPipeIn
              },
              {
                type: 'input-number',
                label: '圆角',
                min: 0,
                name: 'style.borderRadius',
                pipeIn: (curValue: string, rest: any) => {
                  if (curValue) {
                    return curValue;
                  }
                  // 如果是圆形，说明是旧的，直接设置shape为长方形后，返回50%
                  if (rest.data?.shape === 'circle') {
                    rest.setValueByName('shape', 'square');
                    return +(rest.data?.size || DefaultSize) * 0.5;
                  }
                  return rest.data?.size ? 0 : DefaultBorderRadius;
                }
              }
            ]
          },
          // 兼容旧的外观面板
          {
            header: '文字',
            key: 'font',
            body: [
              {
                type: 'style-font',
                label: false,
                name: 'style'
              }
            ]
          },
          {
            header: '内外边距',
            key: 'box-model',
            body: [
              {
                type: 'style-box-model',
                label: false,
                name: 'style'
              }
            ]
          },
          {
            header: '边框',
            key: 'border',
            body: [
              {
                type: 'style-border',
                label: false,
                name: 'style',
                disableRadius: true
              }
            ]
          },
          {
            title: '背景',
            body: [
              {
                type: 'style-background',
                label: false,
                name: 'style',
                noImage: true
              }
            ]
          },
          {
            header: '阴影',
            key: 'box-shadow',
            body: [
              {
                type: 'style-box-shadow',
                label: false,
                name: 'style.boxShadow'
              }
            ]
          },
          {
            header: '其他',
            key: 'other',
            body: [
              {
                label: '透明度',
                name: 'style.opacity',
                min: 0,
                max: 1,
                step: 0.05,
                type: 'input-range',
                pipeIn: defaultValue(1),
                marks: {
                  '0%': '0',
                  '50%': '0.5',
                  '100%': '1'
                }
              }
            ]
          },
          getSchemaTpl('style:classNames', {isFormItem: false})
        ])
      }
    ]);
  };
}

registerEditorPlugin(AvatarPlugin);
