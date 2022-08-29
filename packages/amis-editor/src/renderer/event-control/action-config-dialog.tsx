/**
 * 动作配置面板
 */

import {render as amisRender} from 'amis-core';
import {PluginActions, RendererPluginAction} from 'amis-editor-core';
import React from 'react';
import {ActionConfig, ComponentInfo} from './types';
import ActionConfigPanel from './action-config-panel';
import {BASE_ACTION_PROPS} from './comp-action-select';
import {findActionNode} from './helper';

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

        if (value === 'visibility' && !['show', 'hidden'].includes(groupType)) {
          groupType = 'show';
        }

        if (
          value === 'usability' &&
          !['enabled', 'disabled'].includes(groupType)
        ) {
          groupType = 'enabled';
        }

        const actionNode = findActionNode(actionTree, value);
        form.setValues({
          ...removeKeys,
          __keywords: form.data.__keywords,
          __resultActionTree: form.data.__resultActionTree,
          componentId: form.data.componentId ? '' : undefined,
          args: {},
          groupType,
          __actionDesc: actionNode?.description,
          __actionSchema: actionNode?.schema,
          __subActions: actionNode?.actions,
          __cmptTreeSource: actionNode?.supportComponents
            ? getComponents?.(actionNode) ?? []
            : []
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
        bodyClassName: "action-config-dialog-body",
        closeOnEsc: true,
        closeOnOutside: false,
        show,
        showCloseButton: true,
        size: "md",
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
                            placeholder: '默认执行该动作',
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
    );
    //   : null;
  }
}
