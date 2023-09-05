import {registerEditorPlugin} from 'amis-editor-core';
import {BasePlugin} from 'amis-editor-core';
import {getSchemaTpl} from 'amis-editor-core';

export class DividerPlugin extends BasePlugin {
  static id = 'DividerPlugin';
  static scene = ['layout'];
  // 关联渲染器名字
  rendererName = 'divider';
  $schema = '/schemas/DividerSchema.json';

  // 组件名称
  name = '分隔线';
  isBaseComponent = true;
  icon = 'fa fa-minus';
  pluginIcon = 'divider-plugin';
  description = '用来展示一个分割线，可用来做视觉上的隔离。';
  scaffold = {
    type: 'divider'
  };
  previewSchema: any = {
    type: 'divider',
    className: 'm-t-none m-b-none'
  };

  panelTitle = '分隔线';
  panelJustify = true;
  tags = ['展示'];

  panelBody = getSchemaTpl('tabs', [
    {
      title: '外观',
      body: getSchemaTpl('collapseGroup', [
        {
          title: '基本样式',
          body: [
            getSchemaTpl('layout:originPosition', {value: 'left-top'}),
            getSchemaTpl('layout:width:v2', {
              visibleOn:
                'data.style && data.style.position && (data.style.position === "fixed" || data.style.position === "absolute")'
            }),
            {
              mode: 'horizontal',
              type: 'button-group-select',
              label: '类型',
              name: 'lineStyle',
              value: 'dashed',
              options: [
                {
                  value: 'dashed',
                  label: '虚线'
                },
                {
                  value: 'solid',
                  label: '实线'
                }
              ]
            },
            {
              mode: 'horizontal',
              type: 'button-group-select',
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
            getSchemaTpl('theme:select', {
              mode: 'horizontal',
              label: '长度',
              name: 'style.width',
              placeholder: '100%',
              visibleOn: 'direction !== "vertical"',
              clearValueOnHidden: true
            }),
            getSchemaTpl('theme:select', {
              mode: 'horizontal',
              label: '长度',
              name: 'style.height',
              placeholder: 'var(--sizes-base-15)',
              visibleOn: 'direction === "vertical"',
              clearValueOnHidden: true
            }),
            getSchemaTpl('theme:select', {
              mode: 'horizontal',
              label: '宽度',
              name: 'style.borderWidth',
              placeholder: '1px'
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
            }),
            {
              mode: 'horizontal',
              type: 'input-number',
              label: '角度',
              name: 'rotate',
              value: 0
            }
          ]
        }
      ])
    },
    {
      title: '显隐',
      body: [getSchemaTpl('ref'), getSchemaTpl('visible')]
    }
  ]);
}

registerEditorPlugin(DividerPlugin);
