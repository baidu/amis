/**
 * 动作配置面板
 */

import {render as amisRender} from 'amis-core';
import {PluginActions, RendererPluginAction} from 'amis-editor-core';
import React from 'react';
import {ActionConfig, ComponentInfo} from './types';
import ActionConfigPanel from './action-config-panel';
import {BASE_ACTION_PROPS} from './comp-action-select';

interface ActionDialogProp {
  show: boolean;
  type: string;
  data: any;
  pluginActions: PluginActions; // 组件的动作列表
  actionTree: RendererPluginAction[]; // 动作树
  commonActions?: {[propName: string]: RendererPluginAction}; // 公共动作Map
  onSubmit: (type: string, config: any) => void;
  onClose: () => void;
  getComponents: (action: RendererPluginAction) => ComponentInfo[]; // 当前页面组件树
  actionConfigInitFormatter?: (actionConfig: ActionConfig) => ActionConfig; // 动作配置初始化时格式化
  actionConfigSubmitFormatter?: (actionConfig: ActionConfig) => ActionConfig; // 动作配置提交时格式化
}

export default class ActionDialog extends React.Component<ActionDialogProp> {
  render() {
    const {
      data,
      show,
      type,
      actionTree,
      pluginActions,
      getComponents,
      commonActions,
      onClose
    } = this.props;

    return amisRender(
          {
            type: 'dialog',
            title: '动作配置',
            headerClassName: 'font-bold',
            className: 'action-config-dialog',
            closeOnEsc: true,
            closeOnOutside: false,
            show,
            showCloseButton: true,
            size: 'lg',
            body: [
              {
                type: 'form',
                title: '',
                mode: 'normal',
                wrapperComponent: 'div',
                submitText: '保存',
                autoFocus: true,
                preventEnterSubmit: true,
                // debug: true,
                onSubmit: this.props.onSubmit?.bind(this, type),
                body: [
                  {
                    type: 'grid',
                    className: 'h-full',
                    columns: [
                      {
                        body: [
                          {
                            type: 'tpl',
                            tpl: '执行动作',
                            className: 'action-panel-title',
                            inline: false
                          },
                          {
                            type: 'input-tree',
                            name: 'actionType',
                            disabled: false,
                            options: actionTree,
                            showIcon: false,
                            className: 'action-tree',
                            mode: 'normal',
                            labelField: 'actionLabel',
                            valueField: 'actionType',
                            inputClassName: 'no-border action-tree-control',
                            onChange: (
                              value: string,
                              oldVal: any,
                              data: any,
                              form: any
                            ) => {
                              // 因为不知道动作都有哪些字段，这里只保留基础配置
                              let removeKeys: {
                                [key: string]: any;
                              } = {};
                              let __cmptActionType = '';

                              Object.keys(form.data).forEach((key: string) => {
                                if (!BASE_ACTION_PROPS.includes(key)) {
                                  removeKeys[key] = undefined;
                                }
                              });

                              if (
                                value === 'openDialog' &&
                                !['dialog', 'drawer'].includes(__cmptActionType)
                              ) {
                                __cmptActionType = 'dialog';
                              }

                              if (
                                value === 'closeDialog' &&
                                !['closeDialog', 'closeDrawer'].includes(
                                  __cmptActionType
                                )
                              ) {
                                __cmptActionType = 'closeDialog';
                              }

                              if (
                                value === 'visibility' &&
                                !['show', 'hidden'].includes(__cmptActionType)
                              ) {
                                __cmptActionType = 'show';
                              }

                              if (
                                value === 'usability' &&
                                !['enabled', 'disabled'].includes(
                                  __cmptActionType
                                )
                              ) {
                                __cmptActionType = 'enabled';
                              }

                              const action = data.selectedOptions[0];
                              form.setValues({
                                ...removeKeys,
                                componentId: form.data.componentId
                                  ? ''
                                  : undefined,
                                __cmptActionType,
                                __actionDesc: action.description,
                                __actionSchema: action.schema,
                                __subActions: action.actions,
                                __cmptTreeSource: action.supportComponents
                                  ? getComponents?.(action) ?? []
                                  : []
                              });
                            }
                          }
                        ],
                        md: 3,
                        columnClassName: 'left-panel'
                      },
                      {
                        body: [
                          {
                            type: 'tpl',
                            tpl: '动作说明',
                            className: 'action-panel-title',
                            visibleOn: 'data.actionType',
                            inline: false
                          },
                          {
                            type: 'tpl',
                            className: 'action-desc',
                            tpl: '${__actionDesc}',
                            visibleOn: 'data.actionType'
                          },
                          {
                            type: 'tpl',
                            tpl: '基础设置',
                            className: 'action-panel-title',
                            visibleOn: 'data.actionType',
                            inline: false
                          },
                          {
                            type: 'container',
                            className: 'right-panel-container',
                            body: [
                              {
                                asFormItem: true,
                                component: ActionConfigPanel,
                                pluginActions,
                                commonActions
                              },
                              {
                                type: 'tpl',
                                tpl: '高级设置',
                                inline: false,
                                className: 'action-panel-title',
                                visibleOn: 'data.actionType'
                              },
                              {
                                name: 'expression',
                                title: '',
                                type: 'input-formula',
                                variableMode: 'tabs',
                                inputMode: 'input-group',
                                variables: '${variables}',
                                className: 'action-exec-on',
                                label: '执行条件',
                                mode: 'horizontal',
                                size: 'lg',
                                placeholder: '不设置条件，默认执行该动作',
                                visibleOn: 'data.actionType'
                              }
                            ]
                          }
                        ],
                        columnClassName: 'right-panel'
                      }
                    ]
                  }
                ],
                style: {
                  borderStyle: 'solid'
                },
                className: 'action-config-panel'
              }
            ],
            onClose
          },
          {
            data // 必须这样，不然变量会被当作数据映射处理掉
          }
        )
    //   : null;
  }
}
