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
  name = '手写签';
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
                type: 'button-group-select',
                label: '签字模式',
                name: 'embed',
                tiled: true,
                value: false,
                options: [
                  {
                    label: '内嵌',
                    value: false
                  },
                  {
                    label: '弹窗',
                    value: true
                  }
                ]
              },
              {
                type: 'control',
                label: '功能按钮配置',
                mode: 'normal',
                body: [
                  {
                    type: 'container',
                    wrapperComponent: 'div',
                    className: 'px-3 py-2',
                    style: {
                      backgroundColor: '#f7f7f9'
                    },
                    body: [
                      {
                        type: 'wrapper',
                        size: 'none',
                        visibleOn: 'this.embed === true',
                        body: [
                          getSchemaTpl('signBtn', {
                            label: '确认签名',
                            name: 'embedConfirmLabel',
                            icon: 'embedConfirmIcon'
                          })
                        ]
                      },
                      {
                        type: 'wrapper',
                        size: 'none',
                        visibleOn: 'this.embed === false',
                        body: [
                          getSchemaTpl('signBtn', {
                            label: '确认签名',
                            name: 'confirmBtnLabel',
                            icon: 'confirmBtnIcon'
                          })
                        ]
                      },
                      {
                        type: 'wrapper',
                        size: 'none',
                        visibleOn: 'this.embed === true',
                        body: [
                          getSchemaTpl('signBtn', {
                            label: '取消签名',
                            name: 'ebmedCancelLabel',
                            icon: 'ebmedCancelIcon'
                          })
                        ]
                      },
                      getSchemaTpl('signBtn', {
                        label: '撤销签名',
                        name: 'undoBtnLabel',
                        icon: 'undoBtnIcon'
                      }),
                      getSchemaTpl('signBtn', {
                        label: '清空签名',
                        name: 'clearBtnLabel',
                        icon: 'clearBtnIcon'
                      }),
                      {
                        type: 'wrapper',
                        size: 'none',
                        visibleOn: 'this.embed === true',
                        body: [
                          getSchemaTpl('signBtn', {
                            label: '签名按钮',
                            name: 'embedBtnLabel',
                            icon: 'embedBtnIcon'
                          })
                        ]
                      }
                    ]
                  }
                ]
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
            getSchemaTpl('theme:formItem'),
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
