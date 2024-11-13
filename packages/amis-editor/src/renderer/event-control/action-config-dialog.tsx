/**
 * 动作配置面板
 */

import {
  PluginActions,
  RendererPluginAction,
  tipedLabel,
  getSchemaTpl,
  defaultValue,
  persistGet
} from 'amis-editor-core';
import React from 'react';
import {ActionConfig, ComponentInfo} from './types';
import ActionConfigPanel from './action-config-panel';
import {BASE_ACTION_PROPS} from './comp-action-select';
import {findActionNode} from './eventControlConfigHelper';
import {PlainObject, SchemaNode, Option} from 'amis-core';
import {i18n as _i18n} from 'i18n-runtime';
import './actionsPanelPlugins';

interface ActionDialogProp {
  show: boolean;
  type: string;
  data: any;
  closeOnEsc?: boolean;
  pluginActions: PluginActions; // 组件的动作列表
  actionTree: RendererPluginAction[]; // 动作树
  commonActions?: {[propName: string]: RendererPluginAction}; // 公共动作Map
  onSubmit: (type: string, config: any) => void;
  onClose: () => void;
  getComponents: (action: RendererPluginAction) => ComponentInfo[]; // 当前页面组件树
  actionConfigInitFormatter?: (actionConfig: ActionConfig) => ActionConfig; // 动作配置初始化时格式化
  actionConfigSubmitFormatter?: (
    actionConfig: ActionConfig,
    type?: string
  ) => ActionConfig; // 动作配置提交时格式化
  render: (
    region: string,
    node: SchemaNode,
    props?: PlainObject
  ) => JSX.Element;

  subscribeSchemaSubmit: (
    fn: (schema: any, value: any, id: string, diff?: any) => any,
    once?: boolean
  ) => () => void;
  subscribeActionSubmit: (fn: (value: any) => any) => () => void;
}

export default class ActionDialog extends React.Component<ActionDialogProp> {
  /**
   * 获取组件树搜索列表
   * @param tree
   * @param keywords
   * @returns
   */
  getTreeSearchList(tree: RendererPluginAction[], keywords: string): any {
    if (!keywords) {
      return tree;
    }
    let result: any[] = [];
    const getSearchList = (
      result: any[],
      array: RendererPluginAction[],
      keywords: string
    ) => {
      array.forEach(node => {
        if (node.children) {
          getSearchList(result, node.children, keywords);
        } else if (node.actionLabel!.includes(keywords)) {
          result.push({...node});
        }
      });
    };
    getSearchList(result, tree, keywords);
    return result;
  }

  /**
   * 获取组件树配置schema
   * @param isSearch 是否是搜索
   * @param actionTree 原数据源
   * @param getComponents
   * @returns
   */
  getInputTreeSchema(
    isSearch: boolean,
    actionTree: RendererPluginAction[],
    getComponents: (action: RendererPluginAction) => ComponentInfo[]
  ) {
    const inputTreeSchema = {
      type: 'input-tree',
      name: 'actionType',
      visibleOn: isSearch ? '__keywords' : '!__keywords',
      disabled: false,
      onlyLeaf: true,
      showIcon: false,
      className: 'action-tree',
      mode: 'normal',
      labelField: 'actionLabel',
      valueField: 'actionType',
      inputClassName: 'no-border action-tree-control',
      placeholder: '未匹配到数据',
      onChange: (value: string, oldVal: any, data: any, form: any) => {
        // 因为不知道动作都有哪些字段，这里只保留基础配置
        let removeKeys: {
          [key: string]: any;
        } = {};
        let groupType = '';
        let __statusType = '';
        Object.keys(form.data).forEach((key: string) => {
          if (!BASE_ACTION_PROPS.includes(key)) {
            removeKeys[key] = undefined;
          }
        });

        if (
          value === 'openDialog' &&
          !['dialog', 'drawer'].includes(groupType)
        ) {
          groupType = 'dialog';
        }

        if (
          value === 'closeDialog' &&
          !['closeDialog', 'closeDrawer'].includes(groupType)
        ) {
          groupType = 'closeDialog';
        }
        if (
          value === 'visibility' &&
          !['show', 'hidden', 'visibility'].includes(groupType)
        ) {
          groupType = 'static';
          // 多个动作共用字段需要处理一下默认值，否则设为undefined会导致视觉上勾选，但是value实际为空
          __statusType = 'show';
        }

        if (
          value === 'usability' &&
          !['enabled', 'disabled', 'usability'].includes(groupType)
        ) {
          groupType = 'static';
          __statusType = 'enabled';
        }

        const actionNode = findActionNode(actionTree, value);
        form.setValues({
          ...removeKeys,
          __keywords: form.data.__keywords,
          __resultActionTree: form.data.__resultActionTree,
          componentId: form.data.componentId ? '' : undefined,
          ...(form.data.args ? {args: {}} : {}), // 切换动作时清空args
          groupType,
          __statusType,
          __actionDesc: actionNode?.description,
          __actionSchema: actionNode?.schema,
          __subActions: actionNode?.actions,
          __cmptTreeSource: actionNode?.supportComponents
            ? getComponents?.(actionNode) ?? []
            : [],
          ignoreError: false
        });
      }
    };
    if (isSearch) {
      return {
        ...inputTreeSchema,
        source: '${__resultActionTree}',
        highlightTxt: '${__keywords}'
      };
    } else {
      return {
        ...inputTreeSchema,
        options: actionTree
      };
    }
  }

  // 获取常用动作列表schema
  getCommonUseActionSchema() {
    const commonUseActions = persistGet('common-use-actions', []).slice(0, 5);
    return commonUseActions.map((action: Option) => {
      return {
        type: 'tag',
        label: _i18n(action.label as string),
        displayMode: 'rounded',
        color: 'active',
        style: {
          borderColor: '#2468f2',
          cursor: 'pointer',
          maxWidth: '16%'
        },
        onEvent: {
          click: {
            actions: [
              {
                actionType: 'setValue',
                componentName: 'actionType',
                args: {
                  value: action.value
                }
              },
              {
                actionType: 'custom',
                script:
                  "document.querySelector('.action-tree li .is-checked')?.scrollIntoView()"
              }
            ]
          }
        }
      };
    });
  }

  render() {
    const {
      data,
      subscribeSchemaSubmit,
      subscribeActionSubmit,
      show,
      type,
      actionTree,
      pluginActions,
      getComponents,
      commonActions,
      onClose,
      render,
      closeOnEsc
    } = this.props;
    const commonUseActionSchema = this.getCommonUseActionSchema();

    return render(
      'inner',
      {
        type: 'dialog',
        title: '动作配置',
        headerClassName: 'font-bold',
        className: 'ae-action-config-dialog',
        bodyClassName: 'action-config-dialog-body',
        closeOnEsc: closeOnEsc,
        closeOnOutside: false,
        show,
        showCloseButton: true,
        size: 'md',
        body: [
          {
            type: 'form',
            title: '',
            mode: 'normal',
            wrapperComponent: 'div',
            submitText: '保存',
            autoFocus: true,
            data: {
              __keywords: '',
              __resultActionTree: []
            },
            preventEnterSubmit: true,
            // debug: true,
            onSubmit: this.props.onSubmit?.bind(this, type),
            body: [
              {
                type: 'flex',
                className: 'common-actions',
                justify: 'flex-start',
                visibleOn: `${commonUseActionSchema.length}`,
                items: [
                  {
                    type: 'tpl',
                    tpl: '常用动作：',
                    className: 'common-actions-label'
                  },
                  ...commonUseActionSchema
                ]
              },
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
                        type: 'input-text',
                        name: '__keywords',
                        className: 'action-tree-search',
                        inputClassName: 'action-tree-search-input',
                        placeholder: '请搜索执行动作',
                        clearable: true,
                        onChange: (
                          value: string,
                          oldVal: any,
                          data: any,
                          form: any
                        ) => {
                          if (value) {
                            const list = this.getTreeSearchList(
                              actionTree,
                              value
                            );
                            form.setValueByName('__resultActionTree', list);
                          } else {
                            form.setValueByName(
                              '__resultActionTree',
                              actionTree
                            );
                          }
                        }
                      },
                      // actionTree中包含function及class类型的属性，直接传入form的data中解析会报错
                      // 故采用两棵树分别使用静态及动态选项组
                      this.getInputTreeSchema(false, actionTree, getComponents),
                      this.getInputTreeSchema(true, actionTree, getComponents)
                    ],
                    md: 3,
                    columnClassName: 'left-panel'
                  },
                  {
                    body: [
                      {
                        type: 'container',
                        className: 'right-panel-container',
                        body: [
                          {
                            type: 'container',
                            className: 'action-panel-title',
                            body: [
                              {
                                type: 'tpl',
                                tpl: '动作说明',
                                visibleOn: 'this.actionType'
                              },
                              {
                                type: 'tooltip-wrapper',
                                content: '${__actionDesc}',
                                visibleOn: 'this.actionType',
                                body: {
                                  type: 'icon',
                                  icon: 'far fa-question-circle',
                                  vendor: '',
                                  className: 'ml-0.5'
                                },
                                className: 'inline-block ml-0.5 mb-1'
                              }
                            ]
                          },
                          {
                            name: 'description',
                            type: 'textarea',
                            label: '动作描述',
                            mode: 'horizontal',
                            visibleOn: 'this.actionType'
                          },
                          {
                            type: 'tpl',
                            tpl: '基础设置',
                            className: 'action-panel-title',
                            visibleOn: 'this.actionType',
                            inline: false
                          },
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
                            visibleOn: 'this.actionType'
                          },
                          {
                            type: 'button-group-select',
                            name: 'ignoreError',
                            visibleOn: 'this.actionType',
                            label: tipedLabel(
                              '错误忽略',
                              '动作发生错误时，是否忽略错误继续执行'
                            ),
                            mode: 'horizontal',
                            pipeIn: (value: any, data: any) =>
                              value === true
                                ? '1'
                                : value === false
                                ? '2'
                                : '3',
                            pipeOut: (value: any) =>
                              value === '1'
                                ? true
                                : value === '2'
                                ? false
                                : undefined,
                            options: [
                              {
                                label: '忽略',
                                value: '1'
                              },
                              {
                                label: '不忽略',
                                value: '2'
                              },
                              {
                                label: '预设',
                                value: '3'
                              }
                            ],
                            description:
                              '<%= this.ignoreError === false ? "找不到组件和动作执行失败都中断" : typeof this.ignoreError === "undefined" ? "找不到组件容忍，动作执行失败才中断" : ""%>'
                          },
                          getSchemaTpl('expressionFormulaControl', {
                            name: 'stopPropagation',
                            label: tipedLabel(
                              '阻断条件',
                              '满足条件时，将会阻断当前事件的后续动作的执行'
                            ),
                            evalMode: true,
                            variables: '${variables}',
                            mode: 'horizontal',
                            size: 'lg',
                            visibleOn: 'this.actionType'
                          }),
                          getSchemaTpl('expressionFormulaControl', {
                            name: 'expression',
                            label: '执行条件',
                            evalMode: true,
                            variables: '${variables}',
                            mode: 'horizontal',
                            size: 'lg',
                            placeholder: '默认执行该动作',
                            visibleOn: 'this.actionType'
                          })
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
            className: 'action-config-panel :AMISCSSWrapper'
          }
        ],
        onClose
      },
      {
        data, // 必须这样，不然变量会被当作数据映射处理掉

        subscribeActionSubmit,
        subscribeSchemaSubmit
      }
    );
    //   : null;
  }
}
