import {registerEditorPlugin} from 'amis-editor-core';
import {getSchemaTpl} from 'amis-editor-core';
import {ValidatorTag} from '../../validator';
import {BasePlugin, BaseEventContext} from 'amis-editor-core';
import {getEventControlConfig} from '../../util';
import {tipedLabel} from '../../component/BaseControl';
import tinyColor from 'tinycolor2';

function convertColor(value: string[], format: string): string[];
function convertColor(value: string, format: string): string;
function convertColor(value: any, format: string): any {
  format = format.toLocaleLowerCase();

  function convert(v: string) {
    const color = tinyColor(v);
    if (!color.isValid()) {
      return '';
    }
    if (format !== 'rgba') {
      color.setAlpha(1);
    }
    switch (format) {
      case 'hex':
        return color.toHexString();
      case 'hsl':
        return color.toHslString();
      case 'rgb':
        return color.toRgbString();
      case 'rgba':
        const {r, g, b, a} = color.toRgb();
        return `rgba(${r}, ${g}, ${b}, ${a})`;
      default:
        return color.toString();
    }
  }

  return Array.isArray(value) ? value.map(convert) : convert(value);
}

const presetColors = [
  '#ffffff',
  '#000000',
  '#d0021b',
  '#f5a623',
  '#f8e71c',
  '#7ED321',
  '#4A90E2',
  '#9013fe'
];

const colorFormat = ['hex', 'rgb', 'rgba', 'hsl'];
const presetColorsByFormat = colorFormat.reduce<{
  [propsName: string]: string[];
}>((res, fmt) => {
  res[fmt] = convertColor(presetColors, fmt);
  return res;
}, {});
export class ColorControlPlugin extends BasePlugin {
  // 关联渲染器名字
  rendererName = 'input-color';
  $schema = '/schemas/ColorControlSchema.json';

  // 组件名称
  name = '颜色框';
  isBaseComponent = true;
  icon = 'fa fa-eyedropper';
  pluginIcon = 'input-color-plugin';
  description =
    '支持<code>hex、hls、rgb、rgba</code>格式，默认为<code>hex</code>格式';
  docLink = '/amis/zh-CN/components/form/input-color';
  tags = ['表单项'];
  scaffold = {
    type: 'input-color',
    label: '颜色',
    name: 'color'
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
  panelTitle = '颜色框';
  notRenderFormZone = true;
  events = [
    {
      eventName: 'change',
      eventLabel: '值变化',
      description: '输入框内容变化'
    },
    {
      eventName: 'focus',
      eventLabel: '获取焦点',
      description: '输入框获取焦点'
    },
    {
      eventName: 'blur',
      eventLabel: '失去焦点',
      description: '输入框失去焦点'
    }
  ];
  actions = [
    {
      actionType: 'clear',
      actionLabel: '清空',
      description: '清空输入框内容'
    },
    {
      actionType: 'focus',
      actionLabel: '获取焦点',
      description: '输入框获取焦点'
    }
  ];
  panelJustify = true;
  getConditionalColorPanel(format: string) {
    const visibleOnNoFormat = format === 'hex' ? ' || !this.format' : '';
    return {
      label: '默认值',
      name: 'value',
      type: 'input-color',
      format,
      clearable: true,
      visibleOn: `this.format==="${format}"${visibleOnNoFormat}`,
      presetColors: presetColorsByFormat[format]
    };
  }
  getConditionalColorComb(format: string) {
    const visibleOnNoFormat = format === 'hex' ? ' || !this.format' : '';
    return getSchemaTpl('combo-container', {
      type: 'combo',
      mode: 'normal',
      name: 'presetColors',
      items: [
        {
          type: 'input-color',
          format,
          name: 'color',
          clearable: false,
          presetColors: presetColorsByFormat[format]
        }
      ],
      draggable: false,
      multiple: true,
      visibleOn: `this.presetColors !== undefined && (this.format === "${format}"${visibleOnNoFormat})`,
      onChange: (colors: any, oldValue: any, model: any, form: any) => {
        if (Array.isArray(colors) && colors.length === 0) {
          form.setValueByName('allowCustomColor', true);
        }
      },
      pipeIn: (value: any) =>
        value.map((color = '', index: number) => ({
          key: `${color}-${index}`,
          color: convertColor(color, format)
        })),
      pipeOut: (value: any[]) => value.map(({color = ''}) => color)
    });
  }

  panelBodyCreator = (context: BaseEventContext) => {
    const renderer: any = context.info.renderer;
    const formatOptions = colorFormat.map(value => ({
      label: value.toUpperCase(),
      value
    }));

    return getSchemaTpl('tabs', [
      {
        title: '属性',
        body: getSchemaTpl('collapseGroup', [
          {
            title: '基本',
            body: [
              getSchemaTpl('formItemName', {
                required: true
              }),
              getSchemaTpl('label'),
              {
                type: 'select',
                label: '值格式',
                name: 'format',
                value: 'hex',
                options: formatOptions,
                onChange: (
                  format: any,
                  oldFormat: any,
                  model: any,
                  form: any
                ) => {
                  const {value, presetColors} = form.data;
                  if (value) {
                    form.setValueByName('value', convertColor(value, format));
                  }
                  if (Array.isArray(presetColors)) {
                    form.setValueByName(
                      'presetColors',
                      convertColor(presetColors, format)
                    );
                  }
                }
              },
              // todo: 待优化
              [
                ...formatOptions.map(({value}) =>
                  this.getConditionalColorPanel(value)
                )
              ],
              // {
              //   label: '默认值',
              //   name: 'value',
              //   type: 'input-color',
              //   format: '${format}'
              // },
              getSchemaTpl('clearable'),
              getSchemaTpl('labelRemark'),
              getSchemaTpl('remark'),
              getSchemaTpl('placeholder'),
              getSchemaTpl('description')
            ]
          },
          {
            title: '拾色器',
            body: [
              getSchemaTpl('switch', {
                label: tipedLabel(
                  '隐藏调色盘',
                  '开启时，禁止手动输入颜色，只能从备选颜色中选择'
                ),
                name: 'allowCustomColor',
                disabledOn:
                  'Array.isArray(presetColors) && presetColors.length === 0',
                pipeIn: (value: any) =>
                  typeof value === 'undefined' ? false : !value,
                pipeOut: (value: boolean) => !value
              }),
              getSchemaTpl('switch', {
                label: tipedLabel('备选色', '拾色器底部的备选颜色'),
                name: 'presetColors',
                onText: '自定义',
                offText: '默认',
                pipeIn: (value: any) =>
                  typeof value === 'undefined' ? false : true,
                pipeOut: (
                  value: any,
                  originValue: any,
                  {format = 'hex'}: any
                ) => {
                  return !value ? undefined : presetColorsByFormat[format];
                },
                onChange: (
                  colors: any,
                  oldValue: any,
                  model: any,
                  form: any
                ) => {
                  if (Array.isArray(colors) && colors.length === 0) {
                    form.setValueByName('allowCustomColor', true);
                  }
                }
              }),
              ...formatOptions.map(({value}) =>
                this.getConditionalColorComb(value)
              )
            ]
          },
          getSchemaTpl('status', {
            isFormItem: true
          }),
          getSchemaTpl('validation', {
            tag: ValidatorTag.MultiSelect
          })
        ], {...context?.schema, configTitle: 'props'})
      },
      {
        title: '外观',
        body: getSchemaTpl('collapseGroup', [
          getSchemaTpl('style:formItem', {renderer}),
          getSchemaTpl('style:classNames', {
            schema: [
              getSchemaTpl('className', {
                label: '描述',
                name: 'descriptionClassName',
                visibleOn: 'this.description'
              })
            ]
          })
        ],  {...context?.schema, configTitle: 'style'})
      },
      {
        title: '事件',
        className: 'p-none',
        body: [
          getSchemaTpl('eventControl', {
            name: 'onEvent',
            ...getEventControlConfig(this.manager, context)
          })
        ]
      }
    ]);
  };
}

registerEditorPlugin(ColorControlPlugin);
