import {registerEditorPlugin} from 'amis-editor-core';
import {
  BasePlugin,
  RegionConfig,
  RendererInfo,
  BaseEventContext,
  tipedLabel
} from 'amis-editor-core';
import {defaultValue, getSchemaTpl, valuePipeOut} from 'amis-editor-core';

export class IFramePlugin extends BasePlugin {
  static id = 'IFramePlugin';
  // 关联渲染器名字
  rendererName = 'iframe';
  $schema = '/schemas/AMISIFrameSchema.json';

  // 组件名称
  name = 'iFrame';
  isBaseComponent = true;
  description = '可以用来嵌入现有页面。';
  docLink = '/amis/zh-CN/components/iframe';
  tags = ['功能'];
  icon = 'fa fa-window-maximize';
  pluginIcon = 'iframe-plugin';
  scaffold = {
    type: 'iframe',
    src: '//www.baidu.com'
  };
  previewSchema = {
    type: 'tpl',
    tpl: 'iFrame'
  };

  panelTitle = 'iFrame';
  panelJustify = true;

  panelBodyCreator = (context: BaseEventContext) => {
    return getSchemaTpl('tabs', [
      {
        title: '属性',
        body: getSchemaTpl('collapseGroup', [
          {
            title: '基本',
            body: [
              getSchemaTpl('layout:originPosition', {value: 'left-top'}),
              getSchemaTpl('textareaFormulaControl', {
                name: 'src',
                mode: 'normal',
                label: '页面地址'
              })
            ]
          },
          getSchemaTpl('status')
        ])
      },
      {
        title: '外观',
        body: [
          getSchemaTpl('collapseGroup', [
            {
              title: '基本',
              body: [
                getSchemaTpl('style:widthHeight', {
                  widthSchema: {
                    label: tipedLabel(
                      '宽度',
                      '默认宽度为父容器宽度，值单位默认为 px，也支持百分比等单位 ，如：100%'
                    ),
                    pipeIn: defaultValue('100%')
                  },
                  heightSchema: {
                    label: tipedLabel(
                      '高度',
                      '默认高度为父容器高度，值单位默认为 px，也支持百分比等单位 ，如：100%'
                    ),
                    pipeIn: defaultValue('100%')
                  }
                })
              ]
            },
            ...getSchemaTpl('theme:common', {exclude: ['layout']})
          ])
        ]
      }
    ]);
  };

  renderRenderer(props: any) {
    return this.renderPlaceholder(
      `IFrame 页面（${props.src}）`,
      props.key,
      props.style
    );
  }
}

registerEditorPlugin(IFramePlugin);
