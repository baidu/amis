import {registerEditorPlugin} from 'amis-editor-core';
import {
  BasePlugin,
  RegionConfig,
  RendererInfo,
  BaseEventContext
} from 'amis-editor-core';
import {defaultValue, getSchemaTpl, valuePipeOut} from 'amis-editor-core';
import {formItemControl, tipedLabel} from '../component/BaseControl';

export class IFramePlugin extends BasePlugin {
  // 关联渲染器名字
  rendererName = 'iframe';
  $schema = '/schemas/IFrameSchema.json';

  // 组件名称
  name = 'iFrame';
  isBaseComponent = true;
  description = '可以用来嵌入现有页面。';
  tags = ['容器'];
  icon = 'fa fa-window-maximize';
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
              {
                name: 'src',
                label: '页面地址',
                type: 'input-text'
              }
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
                {
                  name: 'width',
                  label: tipedLabel(
                    '宽度',
                    '默认宽度为父容器宽度，值单位默认为 px，也支持百分比等单位 ，如：100%'
                  ),
                  type: 'input-text',
                  pipeIn: defaultValue('100%'),
                  pipeOut: valuePipeOut
                },
                {
                  name: 'height',
                  label: tipedLabel(
                    '高度',
                    '默认高度为父容器高度，值单位默认为 px，也支持百分比等单位 ，如：100%'
                  ),
                  type: 'input-text',
                  pipeOut: valuePipeOut
                }
              ]
            },
            getSchemaTpl('style:classNames', {
              isFormItem: false
            }),
            ...getSchemaTpl('style:common', [], 'border')
          ])
        ]
      }
    ]);
  };

  renderRenderer(props: any) {
    return this.renderPlaceholder(`IFrame 页面（${props.src}）`);
  }
}

registerEditorPlugin(IFramePlugin);
