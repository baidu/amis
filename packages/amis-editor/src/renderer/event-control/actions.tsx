import {Button} from 'amis';
import {
  defaultValue,
  getSchemaTpl,
  RendererPluginAction
} from 'amis-editor-core';
import React from 'react';
import {
  FORMITEM_CMPTS,
  getArgsWrapper,
  IS_DATA_CONTAINER,
  renderCmptActionSelect,
  renderCmptSelect
} from './helper';

const MSG_TYPES: {[key: string]: string} = {
  info: '提示',
  warning: '警告',
  success: '成功',
  error: '错误'
};

const ACTION_TYPE_TREE = (manager: any): RendererPluginAction[] => {
  return [
    {
      actionLabel: '页面',
      actionType: 'page',
      children: [
        {
          actionLabel: '跳转链接',
          actionType: 'url',
          description: '跳转至指定链接的页面',
          innerArgs: ['url', 'params', 'blank'],
          descDetail: (info: any) => {
            return (
              <div>
                跳转至<span className="variable-left">{info?.args?.url}</span>
              </div>
            );
          },
          schema: getArgsWrapper([
            {
              type: 'wrapper',
              className: 'p-none',
              body: [
                {
                  label: '页面地址',
                  type: 'input-formula',
                  variables: '${variables}',
                  evalMode: false,
                  variableMode: 'tabs',
                  inputMode: 'input-group',
                  name: 'url',
                  placeholder: 'http://',
                  mode: 'horizontal',
                  size: 'lg',
                  required: true
                },
                {
                  type: 'combo',
                  name: 'params',
                  label: '页面参数',
                  multiple: true,
                  mode: 'horizontal',
                  items: [
                    {
                      name: 'key',
                      placeholder: '参数名',
                      type: 'input-text',
                      mode: 'inline',
                      size: 'xs'
                    },
                    {
                      name: 'val',
                      placeholder: '参数值',
                      type: 'input-formula',
                      variables: '${variables}',
                      evalMode: false,
                      variableMode: 'tabs',
                      inputMode: 'input-group',
                      size: 'xs'
                    }
                  ]
                },
                {
                  type: 'switch',
                  name: 'blank',
                  label: '新窗口打开',
                  onText: '是',
                  offText: '否',
                  mode: 'horizontal',
                  pipeIn: defaultValue(true)
                }
              ]
            }
          ])
        },
        {
          actionLabel: '打开页面',
          actionType: 'link',
          description: '打开指定页面',
          innerArgs: ['link', 'params'],
          descDetail: (info: any) => {
            return (
              <div>
                打开
                <span className="variable-left variable-right">
                  {info?.__pageName}
                </span>
                页面
              </div>
            );
          },
          schema: getArgsWrapper([
            {
              type: 'wrapper',
              className: 'p-none',
              body: [getSchemaTpl('app-page'), getSchemaTpl('app-page-args')]
            }
          ])
        },
        {
          actionLabel: '刷新页面',
          actionType: 'refresh',
          description: '触发浏览器刷新页面'
        },
        {
          actionLabel: '回退页面',
          actionType: 'goBack',
          description: '浏览器回退',
          descDetail: (info: any) => <div>返回上一页</div>
        }
      ]
    },
    {
      actionLabel: '弹框消息',
      actionType: 'dialogs',
      children: [
        {
          actionLabel: '打开弹窗',
          actionType: 'openDialog',
          description: '打开弹框，弹窗内支持复杂的交互设计',
          actions: [
            {
              actionType: 'dialog'
            },
            {
              actionType: 'drawer'
            }
          ],
          schema: [
            {
              type: 'radios',
              label: '类型',
              name: '__cmptActionType',
              mode: 'horizontal',
              value: 'dialog',
              required: true,
              pipeIn: defaultValue('dialog'),
              options: [
                {
                  label: '弹窗',
                  value: 'dialog'
                },
                {
                  label: '抽屉',
                  value: 'drawer'
                }
              ],
              visibleOn: 'data.actionType === "openDialog"'
            },
            {
              name: 'dialog',
              label: '弹框内容',
              mode: 'horizontal',
              required: true,
              pipeIn: defaultValue({
                title: '弹框标题',
                body: '<p>对，你刚刚点击了</p>'
              }),
              asFormItem: true,
              visibleOn: 'data.__cmptActionType === "dialog"',
              children: ({value, onChange, data}: any) => (
                <Button
                  size="sm"
                  className="action-btn-width"
                  onClick={() =>
                    manager.openSubEditor({
                      title: '配置弹框内容',
                      value: {type: 'dialog', ...value},
                      onChange: (value: any) => onChange(value)
                    })
                  }
                  block
                >
                  去配置
                </Button>
              )
            },
            {
              name: 'drawer',
              label: '抽屉内容',
              mode: 'horizontal',
              required: true,
              pipeIn: defaultValue({
                title: '弹框标题',
                body: '<p>对，你刚刚点击了</p>'
              }),
              asFormItem: true,
              visibleOn: 'data.__cmptActionType === "drawer"',
              children: ({value, onChange, data}: any) => (
                <Button
                  size="sm"
                  className="action-btn-width"
                  onClick={() =>
                    manager.openSubEditor({
                      title: '配置抽出式弹框内容',
                      value: {type: 'drawer', ...value},
                      onChange: (value: any) => onChange(value)
                    })
                  }
                  block
                >
                  去配置
                </Button>
              )
            }
          ]
        },
        {
          actionLabel: '关闭弹窗',
          actionType: 'closeDialog',
          description: '关闭当前弹窗', // 或者关闭指定弹窗
          schema: getArgsWrapper({
            type: 'wrapper',
            className: 'p-none',
            body: [
              {
                type: 'radios',
                label: '类型',
                name: '__cmptActionType',
                mode: 'horizontal',
                value: 'closeDialog',
                required: true,
                pipeIn: defaultValue('closeDialog'),
                options: [
                  {
                    label: '弹窗',
                    value: 'closeDialog'
                  },
                  {
                    label: '抽屉',
                    value: 'closeDrawer'
                  }
                ],
                visibleOn: 'data.actionType === "closeDialog"'
              }
            ]
          })
        },
        // 暂时下掉，看后面具体设计
        // {
        //   actionLabel: '打开提示对话框',
        //   actionType: 'alert',
        //   description: '弹个提示对话框'
        // },
        // {
        //   actionLabel: '打开确认对话框',
        //   actionType: 'confirm',
        //   description: '弹个确认对话框'
        // },
        {
          actionLabel: '消息提醒',
          actionType: 'toast',
          description: '弹出消息提醒',
          innerArgs: [
            'title',
            'msgType',
            'msg',
            'position',
            'timeout',
            'closeButton',
            'showIcon'
          ],
          descDetail: (info: any) => {
            return (
              <div>
                <span className="variable-right">
                  {MSG_TYPES[info?.args?.msgType] || ''}
                </span>
                提醒消息：
                <span className="variable-left">{info?.args?.msg}</span>
              </div>
            );
          },
          schema: getArgsWrapper({
            type: 'wrapper',
            className: 'p-none',
            body: [
              {
                type: 'button-group-select',
                name: 'msgType',
                label: '消息类型',
                value: 'info',
                required: true,
                mode: 'horizontal',
                options: Object.keys(MSG_TYPES).map(key => ({
                  label: MSG_TYPES[key],
                  value: key,
                  level: 'default'
                }))
              },
              {
                name: 'msg',
                label: '消息内容',
                mode: 'horizontal',
                type: 'input-formula',
                variables: '${variables}',
                evalMode: false,
                variableMode: 'tabs',
                inputMode: 'input-group',
                size: 'lg',
                required: true
              },
              {
                name: 'title',
                type: 'input-formula',
                variables: '${variables}',
                evalMode: false,
                variableMode: 'tabs',
                inputMode: 'input-group',
                label: '标题内容',
                size: 'lg',
                mode: 'horizontal'
              },
              {
                name: 'timeout',
                type: 'input-formula',
                variables: '${variables}',
                evalMode: false,
                variableMode: 'tabs',
                inputMode: 'input-group',
                label: '持续时间(ms)',
                size: 'lg',
                mode: 'horizontal'
              },
              {
                type: 'button-group-select',
                name: 'position',
                value: 'top-right',
                mode: 'horizontal',
                label: '显示位置',
                options: [
                  {
                    label: '左上',
                    value: 'top-left'
                  },

                  {
                    label: '中上',
                    value: 'top-center'
                  },

                  {
                    label: '右上',
                    value: 'top-right'
                  },

                  {
                    label: '左下',
                    value: 'bottom-left'
                  },
                  {
                    label: '中下',
                    value: 'bottom-center'
                  },

                  {
                    label: '右下',
                    value: 'bottom-right'
                  }
                ]
              },
              {
                type: 'switch',
                name: 'closeButton',
                value: true,
                label: '展示关闭按钮',
                mode: 'horizontal'
              },
              {
                type: 'switch',
                name: 'showIcon',
                value: true,
                label: '展示图标',
                mode: 'horizontal'
              }
            ]
          })
        }
      ]
    },
    {
      actionLabel: '服务',
      actionType: 'service',
      children: [
        {
          actionLabel: '发送请求',
          actionType: 'ajax',
          description: '配置并发送API请求',
          innerArgs: ['api'],
          descDetail: (info: any) => {
            return (
              <div>
                发送
                <span className="variable-right variable-left">
                  {info?.args?.api?.method}
                </span>
                请求：
                <span className="variable-left">{info?.args?.api?.url}</span>
              </div>
            );
          },
          schema: {
            type: 'wrapper',
            style: {padding: '0 0 0 32px'},
            body: [
              getArgsWrapper(
                getSchemaTpl('apiControl', {
                  name: 'api'
                })
              )
            ]
          }
        },
        {
          actionLabel: '下载文件',
          actionType: 'download',
          description: '触发下载文件',
          innerArgs: ['api'],
          schema: {
            type: 'wrapper',
            style: {padding: '0 0 0 32px'},
            body: [
              getArgsWrapper(
                getSchemaTpl('apiControl', {
                  name: 'api'
                })
              )
            ]
          }
        }
      ]
    },
    {
      actionLabel: '组件',
      actionType: 'cmpt',
      children: [
        {
          actionLabel: '组件可见性',
          actionType: 'visibility',
          description: '控制所选的组件的显示/隐藏',
          actions: [
            {
              actionType: 'show',
              descDetail: (info: any) => {
                return (
                  <div>
                    显示
                    <span className="variable-left variable-right">
                      {info?.__rendererLabel}
                    </span>
                    组件
                  </div>
                );
              }
            },
            {
              actionType: 'hidden',
              descDetail: (info: any) => {
                return (
                  <div>
                    隐藏
                    <span className="variable-left variable-right">
                      {info?.__rendererLabel}
                    </span>
                    组件
                  </div>
                );
              }
            }
          ],
          supportComponents: '*',
          schema: [
            ...renderCmptSelect('选择组件', true),
            {
              type: 'radios',
              label: '显示/隐藏',
              name: '__cmptActionType',
              mode: 'horizontal',
              value: 'show',
              required: true,
              pipeIn: defaultValue('show'),
              options: [
                {
                  label: '显示',
                  value: 'show'
                },
                {
                  label: '隐藏',
                  value: 'hidden'
                }
              ]
            }
          ]
        },
        {
          actionLabel: '组件可用性',
          actionType: 'usability',
          description: '控制所选的组件的启用/禁用',
          actions: [
            {
              actionType: 'enabled',
              descDetail: (info: any) => {
                return (
                  <div>
                    启用
                    <span className="variable-left variable-right">
                      {info?.__rendererLabel}
                    </span>
                    组件
                  </div>
                );
              }
            },
            {
              actionType: 'disabled',
              descDetail: (info: any) => {
                return (
                  <div>
                    禁用
                    <span className="variable-left variable-right">
                      {info?.__rendererLabel}
                    </span>
                    组件
                  </div>
                );
              }
            }
          ],
          supportComponents: ['form', ...FORMITEM_CMPTS],
          schema: [
            ...renderCmptSelect('选择组件', true),
            {
              type: 'radios',
              label: '启用/禁用',
              name: '__cmptActionType',
              mode: 'horizontal',
              value: 'enabled',
              required: true,
              pipeIn: defaultValue('enabled'),
              options: [
                {
                  label: '启用',
                  value: 'enabled'
                },
                {
                  label: '禁用',
                  value: 'disabled'
                }
              ]
            }
          ]
        },
        {
          actionLabel: '刷新组件',
          actionType: 'reload',
          description: '请求并重新加载所选组件的数据',
          descDetail: (info: any) => {
            return (
              <div>
                刷新
                <span className="variable-left variable-right">
                  {info?.__rendererLabel}
                </span>
                组件
              </div>
            );
          },
          supportComponents: [],
          schema: renderCmptSelect('选择组件', true)
        },
        {
          actionLabel: '设置组件数据',
          actionType: 'setValue',
          description: '设置数据容器或表单项的数据',
          innerArgs: ['value', 'valueInput'],
          descDetail: (info: any) => {
            return (
              <div>
                设置
                <span className="variable-left variable-right">
                  {info?.__rendererLabel}
                </span>
                的值为
                <span className="variable-left variable-right">
                  {info?.args?.value
                    ? JSON.stringify(info?.args?.value)
                    : info?.args?.valueInput}
                </span>
              </div>
            );
          },
          supportComponents: [],
          schema: [
            ...renderCmptSelect('选择组件', true),
            getArgsWrapper({
              type: 'wrapper',
              className: 'p-none',
              body: [
                {
                  type: 'combo',
                  name: 'value',
                  label: '字段赋值',
                  multiple: true,
                  removable: true,
                  required: true,
                  addable: true,
                  strictMode: false,
                  canAccessSuperData: true,
                  mode: 'horizontal',
                  items: [
                    {
                      name: 'key',
                      type: 'input-text',
                      placeholder: '变量名',
                      required: true
                    },
                    {
                      name: 'val',
                      type: 'input-formula',
                      placeholder: '变量值',
                      variables: '${variables}',
                      evalMode: false,
                      variableMode: 'tabs',
                      inputMode: 'input-group'
                    }
                  ],
                  visibleOn: `data.__rendererName && ${IS_DATA_CONTAINER}`
                },
                {
                  type: 'combo',
                  name: 'value',
                  label: '字段赋值',
                  multiple: true,
                  removable: true,
                  required: true,
                  addable: true,
                  strictMode: false,
                  canAccessSuperData: true,
                  mode: 'horizontal',
                  items: [
                    {
                      type: 'combo',
                      name: 'item',
                      label: false,
                      renderLabel: false,
                      multiple: true,
                      removable: true,
                      required: true,
                      addable: true,
                      strictMode: false,
                      canAccessSuperData: true,
                      className: 'm-l',
                      mode: 'horizontal',
                      items: [
                        {
                          name: 'key',
                          type: 'input-text',
                          required: true
                        },
                        {
                          name: 'val',
                          type: 'input-formula',
                          variables: '${variables}',
                          evalMode: false,
                          variableMode: 'tabs',
                          inputMode: 'input-group'
                        }
                      ]
                    }
                  ],
                  visibleOn: `data.__rendererName && __rendererName === 'combo'`
                },
                {
                  name: 'valueInput',
                  type: 'input-formula',
                  variables: '${variables}',
                  evalMode: false,
                  variableMode: 'tabs',
                  inputMode: 'input-group',
                  label: '赋值',
                  size: 'lg',
                  mode: 'horizontal',
                  visibleOn: `data.__rendererName && !${IS_DATA_CONTAINER} && __rendererName !== 'combo'`,
                  required: true
                }
              ]
            })
          ]
        },
        {
          actionLabel: '提交表单',
          actionType: 'submit',
          description: '提交表单数据至数据源',
          descDetail: (info: any) => {
            return (
              <div>
                <span className="variable-right">{info?.__rendererLabel}</span>
                提交
              </div>
            );
          },
          supportComponents: 'form',
          schema: renderCmptSelect('选择组件', true)
        },
        {
          actionLabel: '清空表单',
          actionType: 'clear',
          description: '清空表单数据',
          descDetail: (info: any) => {
            return (
              <div>
                <span className="variable-right">{info?.__rendererLabel}</span>
                清空
              </div>
            );
          },
          supportComponents: 'form',
          schema: renderCmptSelect('选择组件', true)
        },
        {
          actionLabel: '重置表单',
          actionType: 'reset',
          description: '重置表单数据',
          descDetail: (info: any) => {
            return (
              <div>
                <span className="variable-right">{info?.__rendererLabel}</span>
                重置
              </div>
            );
          },
          supportComponents: 'form',
          schema: renderCmptSelect('选择组件', true)
        },
        {
          actionLabel: '校验表单',
          actionType: 'validate',
          description: '校验表单数据',
          descDetail: (info: any) => {
            return (
              <div>
                <span className="variable-right">{info?.__rendererLabel}</span>
                校验
              </div>
            );
          },
          supportComponents: 'form',
          schema: renderCmptSelect('选择组件', true)
        },
        {
          actionLabel: '组件特性动作',
          actionType: 'component',
          description: '触发所选组件的特性动作',
          supportComponents: '*',
          actions: [],
          schema: renderCmptActionSelect('选择组件', true)
        }
      ]
    },
    {
      actionLabel: '其他',
      actionType: 'others',
      children: [
        {
          actionLabel: '复制内容',
          actionType: 'copy',
          description: '复制文本内容至粘贴板',
          innerArgs: ['content', 'copyFormat'],
          descDetail: (info: any) => {
            return (
              <div>
                复制内容：
                <span className="variable-left">{info?.args?.content}</span>
              </div>
            );
          },
          schema: getArgsWrapper({
            type: 'wrapper',
            className: 'p-none',
            body: [
              {
                name: 'content',
                type: 'input-formula',
                variables: '${variables}',
                evalMode: false,
                variableMode: 'tabs',
                inputMode: 'input-group',
                label: '内容模板',
                mode: 'horizontal',
                size: 'lg',
                required: true
              },
              {
                type: 'select',
                name: 'copyFormat',
                mode: 'horizontal',
                value: 'text/plain',
                size: 'lg',
                options: [
                  {
                    label: '纯文本',
                    value: 'text/plain'
                  },
                  {
                    label: '富文本',
                    value: 'text/html'
                  }
                ],
                label: '复制格式'
              }
            ]
          })
        },
        {
          actionLabel: '自定义JS',
          actionType: 'custom',
          description: '通过JavaScript自定义动作逻辑',
          schema: {
            type: 'js-editor',
            allowFullscreen: true,
            required: true,
            name: 'script',
            label: '自定义JS',
            mode: 'horizontal',
            className: 'ae-event-control-action-js-editor',
            value: `/* 自定义JS使用说明： 
  * 1.动作执行函数doAction，可以执行所有类型的动作
  * 2.通过上下文对象context可以获取当前组件实例，例如context.props可以获取该组件相关属性
  * 3.事件对象event，在doAction之后执行event.stopPropagation = true;可以阻止后续动作执行
*/
const myMsg = '我是自定义JS';
doAction({
  actionType: 'toast',
  args: {
    msg: myMsg
  }
});
`
          }
        }
        // {
        //   actionLabel: '广播',
        //   actionType: 'broadcast',
        //   description: '发送广播事件',
        //   schema: {
        //     type: 'wrapper',
        //     className: 'p-none',
        //     body: [
        //       {
        //         type: 'input-text',
        //         name: 'eventName',
        //         label: '广播标识',
        //         mode: 'horizontal',
        //         required: true,
        //         description: '广播事件标识派发出去后，其他组件可以进行监听并作出响应'
        //       },
        //       {
        //         type: 'input-text',
        //         label: '广播名称',
        //         name: 'eventLabel',
        //         mode: 'horizontal',
        //         required: true
        //       },
        //       {
        //         type: 'textarea',
        //         label: '描述',
        //         name: 'description',
        //         mode: 'horizontal',
        //         required: true
        //       }
        //     ]
        //   }
        // }
      ]
    }
  ];
};

export default ACTION_TYPE_TREE;
