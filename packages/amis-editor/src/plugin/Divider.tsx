import {
  BasePlugin,
  BaseEventContext,
  defaultValue,
  getI18nEnabled,
  getSchemaTpl,
  registerEditorPlugin,
  tipedLabel,
  valuePipeOut
} from 'amis-editor-core';

export class DividerPlugin extends BasePlugin {
  static id = 'DividerPlugin';
  static scene = ['layout'];
  // 关联渲染器名字
  rendererName = 'divider';
  $schema = '/schemas/AMISDividerSchema.json';

  // 组件名称
  name = '分隔线';
  isBaseComponent = true;
  icon = 'fa fa-minus';
  pluginIcon = 'divider-plugin';
  description = '用来展示一个分割线，可用来做视觉上的隔离。';
  docLink = '/amis/zh-CN/components/divider';
  scaffold = {
    type: 'divider',
    $$dragMode: 'hv'
  };
  previewSchema: any = {
    type: 'divider',
    className: 'm-t-none m-b-none'
  };

  panelTitle = '分隔线';
  panelJustify = true;
  tags = ['展示'];

  panelBodyCreator = (context: BaseEventContext) => {
    const i18nEnabled = getI18nEnabled();
    return getSchemaTpl('tabs', [
      {
        title: '属性',
        body: getSchemaTpl('collapseGroup', [
          {
            title: '基本',
            body: [
              i18nEnabled
                ? {
                    type: 'input-text-i18n',
                    name: 'title',
                    label: '标题',
                    placeholder: '请输入标题'
                  }
                : getSchemaTpl('valueFormula', {
                    name: 'title',
                    label: '标题',
                    placeholder: '请输入标题',
                    rendererSchema: {
                      type: 'input-text'
                    }
                  })
            ]
          },
          getSchemaTpl('status')
        ])
      },
      {
        title: '外观',
        body: getSchemaTpl('collapseGroup', [
          {
            title: '基本样式',
            body: [
              getSchemaTpl('layout:originPosition', {value: 'left-top'}),
              getSchemaTpl('layout:width:v2', {
                visibleOn:
                  'this.style && this.style.position && (this.style.position === "fixed" || this.style.position === "absolute")'
              }),
              {
                mode: 'horizontal',
                type: 'select',
                label: '类型',
                name: 'lineStyle',
                value: 'solid',
                options: [
                  {
                    value: 'solid',
                    label: '实线'
                  },
                  {
                    value: 'dashed',
                    label: '虚线'
                  }
                ]
              },
              {
                mode: 'horizontal',
                type: 'select',
                label: '方向',
                name: 'direction',
                value: 'horizontal',
                options: [
                  {
                    value: 'horizontal',
                    label: '水平'
                  },
                  {
                    value: 'vertical',
                    label: '垂直'
                  }
                ]
              },
              {
                mode: 'horizontal',
                type: 'input-number',
                label: '角度',
                name: 'rotate',
                value: 0,
                min: -360,
                max: 360
              },
              getSchemaTpl('theme:select', {
                mode: 'horizontal',
                label: '线长',
                name: 'style.width',
                placeholder: '100%',
                visibleOn: 'this.direction !== "vertical"',
                clearValueOnHidden: true
              }),
              getSchemaTpl('theme:select', {
                mode: 'horizontal',
                label: '线长',
                name: 'style.height',
                placeholder: 'var(--sizes-base-15)',
                visibleOn: 'this.direction === "vertical"',
                clearValueOnHidden: true
              }),
              getSchemaTpl('theme:select', {
                mode: 'horizontal',
                label: '线宽',
                name: 'style.borderWidth',
                placeholder: '1px',
                visibleOn: '!this.title || this.direction === "vertical"'
              }),
              getSchemaTpl('theme:select', {
                mode: 'horizontal',
                label: '线宽',
                name: 'themeCss.titleWrapperControlClassName.border-bottom-width',
                placeholder: '1px',
                visibleOn: '!!this.title && this.direction !== "vertical"',
                clearValueOnHidden: true,
                pipeIn: (value: any, form: any) => {
                  if (
                    value === undefined &&
                    form.data?.style?.borderWidth !== undefined
                  ) {
                    const bwidth = form.data.style.borderWidth;
                    setTimeout(() =>
                      form.setValueByName(
                        'themeCss.titleWrapperControlClassName.border-bottom-width',
                        bwidth
                      )
                    );
                    return bwidth;
                  }
                  return value;
                }
              }),
              getSchemaTpl('theme:colorPicker', {
                mode: 'horizontal',
                label: '颜色',
                name: 'color',
                placeholder: 'var(--colors-neutral-line-8)',
                labelMode: 'input',
                needGradient: true
              }),
              getSchemaTpl('theme:paddingAndMargin', {
                name: 'style',
                hidePadding: true
              })
            ]
          },
          {
            title: '标题样式',
            visibleOn: '!!this.title && this.direction !== "vertical"',
            body: [
              {
                type: 'select',
                name: 'titlePosition',
                label: '位置',
                pipeIn: defaultValue('center'),
                options: [
                  {
                    value: 'left',
                    label: '居左'
                  },
                  {
                    value: 'center',
                    label: '居中'
                  },
                  {
                    value: 'right',
                    label: '居右'
                  }
                ],
                clearValueOnHidden: true
              },
              getSchemaTpl('theme:select', {
                label: tipedLabel(
                  '距离',
                  '标题和最近左、右边框之间的距离，默认值5%'
                ),
                name: 'themeCss.titleWrapperControlClassName.flex-basis',
                placeholder: '5%',
                visibleOn:
                  'this.titlePosition === "left" || this.titlePosition === "right"',
                clearValueOnHidden: true
              }),
              getSchemaTpl('theme:font', {
                title: '文字',
                name: 'themeCss.titleControlClassName.font',
                textAlign: false,
                clearValueOnHidden: true
              }),
              getSchemaTpl('theme:paddingAndMargin', {
                name: 'themeCss.titleControlClassName.padding-and-margin',
                hidePadding: true,
                clearValueOnHidden: true
              })
            ]
          }
        ])
      }
    ]);
  };
}

registerEditorPlugin(DividerPlugin);
