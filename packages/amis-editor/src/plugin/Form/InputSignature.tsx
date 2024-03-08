import {EditorNodeType, getSchemaTpl} from 'amis-editor-core';
import {registerEditorPlugin} from 'amis-editor-core';
import {BasePlugin, BaseEventContext} from 'amis-editor-core';
import {ValidatorTag} from '../../validator';
import {getEventControlConfig} from '../../renderer/event-control/helper';
import {RendererPluginAction, RendererPluginEvent} from 'amis-editor-core';

export class SignaturePlugin extends BasePlugin {
  static id = 'SignaturePlugin';
  // 关联渲染器名字
  rendererName = 'input-signature';
  $schema = '/schemas/InputSignatureSchema.json';

  // 组件名称
  name = '签名面板';
  isBaseComponent = true;
  icon = 'fa fa-star-o';
  pluginIcon = 'input-signature-plugin';
  description = '手写签名面板';
  docLink = '/amis/zh-CN/components/form/input-signature';
  tags = ['表单项'];
  scaffold = {
    type: 'input-signature',
    label: '签名',
    name: 'signature'
  };
  previewSchema: any = {
    type: 'form',
    className: 'text-left',
    mode: 'horizontal',
    wrapWithPanel: false,
    body: [
      {
        ...this.scaffold,
        embed: true
      }
    ]
  };
  notRenderFormZone = true;

  panelTitle = '签名面板';

  // 事件定义
  events: RendererPluginEvent[] = [];

  // 动作定义
  actions: RendererPluginAction[] = [];

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
              getSchemaTpl('formItemName', {
                required: true
              }),
              getSchemaTpl('label'),
              getSchemaTpl('labelRemark'),
              {
                name: 'embed',
                label: '弹窗展示',
                type: 'ae-switch-more',
                mode: 'normal',
                formType: 'extend',
                title: '弹窗展示',
                bulk: true,
                form: {
                  body: [
                    {
                      label: '按钮文案',
                      name: 'embedBtnLabel',
                      type: 'input-text'
                    },
                    getSchemaTpl('icon', {
                      label: '按钮图标',
                      name: 'embedBtnIcon'
                    }),
                    {
                      label: '确认按钮',
                      name: 'embedConfirmLabel',
                      type: 'input-text'
                    },
                    {
                      label: '确认按钮',
                      name: 'ebmedCancelLabel',
                      type: 'input-text'
                    }
                  ]
                }
              },
              {
                label: '确认按钮',
                name: 'confirmBtnLabel',
                type: 'input-text'
              },
              {
                label: '撤销按钮',
                name: 'undoBtnLabel',
                type: 'input-text'
              },
              {
                label: '清空按钮',
                name: 'clearBtnLabel',
                type: 'input-text'
              }
            ]
          },
          getSchemaTpl('status', {
            isFormItem: true,
            unsupportStatic: true
          }),
          getSchemaTpl('validation', {
            tag: ValidatorTag.Check
          })
        ])
      },
      {
        title: '外观',
        body: [
          getSchemaTpl('collapseGroup', [
            getSchemaTpl('style:formItem', {
              renderer: context.info.renderer
            }),
            getSchemaTpl('style:classNames', {unsupportStatic: true})
          ])
        ]
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

  buildDataSchemas(node: EditorNodeType, region: EditorNodeType) {
    return {
      type: 'number',
      title: node.schema?.label || node.schema?.name,
      originalValue: node.schema?.value // 记录原始值，循环引用检测需要
    };
  }
}

registerEditorPlugin(SignaturePlugin);
