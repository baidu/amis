import {Button} from 'amis';
import {
  defaultValue,
  getSchemaTpl,
  RendererPluginAction
} from 'amis-editor-core';
import React from 'react';
import {normalizeApi} from 'amis-core';
import {
  FORMITEM_CMPTS,
  getArgsWrapper,
  IS_DATA_CONTAINER,
  SHOW_SELECT_PROP,
  renderCmptActionSelect,
  renderCmptSelect,
  SUPPORT_DISABLED_CMPTS
} from './helper';
import {BaseLabelMark} from '../../component/BaseControl';
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
                  required: true,
                  visibleOn: 'data.actionType === "url"'
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
                  {info?.args?.pageName}
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
              name: 'groupType',
              mode: 'horizontal',
              value: 'dialog',
              required: true,
              pipeIn: defaultValue('dialog'),
              inputClassName: 'event-action-radio',
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
              visibleOn: 'data.groupType === "dialog"',
              children: ({value, onChange, data}: any) => (
                <Button
                  size="sm"
                  className="action-btn-width"
                  onClick={() =>
                    manager.openSubEditor({
                      title: '配置弹框内容',
                      value: {type: 'dialog', ...value},
                      data,
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
              visibleOn: 'data.groupType === "drawer"',
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
                name: 'groupType',
                mode: 'horizontal',
                value: 'closeDialog',
                required: true,
                pipeIn: defaultValue('closeDialog'),
                inputClassName: 'event-action-radio',
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
                {MSG_TYPES[info?.args?.msgType] || ''}消息：
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
          innerArgs: ['api', 'options'],
          descDetail: (info: any) => {
            let apiInfo = info?.args?.api;
            if (typeof apiInfo === 'string') {
              apiInfo = normalizeApi(apiInfo);
            }
            return (
              <div>
                发送
                <span className="variable-right variable-left">
                  {apiInfo?.method}
                </span>
                请求：
                <span className="variable-left">{apiInfo?.url}</span>
              </div>
            );
          },
          schema: {
            type: 'wrapper',
            className: 'p-none',
            body: [
              getArgsWrapper(
                [
                  getSchemaTpl('apiControl', {
                    name: 'api',
                    label: '配置请求',
                    mode: 'horizontal',
                    size: 'lg',
                    inputClassName: 'm-b-none',
                    renderLabel: true,
                    required: true
                  }),
                  {
                    name: 'options',
                    type: 'combo',
                    label: false,
                    mode: 'horizontal',
                    items: [
                      {
                        type: 'checkbox',
                        name: 'silent',
                        option: '静默模式',
                        mode: 'inline',
                        className: 'm-r-none',
                        value: false,
                        remark: {
                          className: 'ae-BaseRemark',
                          icon: 'fa fa-question-circle',
                          shape: 'circle',
                          placement: 'left',
                          content:
                            '勾选后，服务请求将以静默模式发送，即不会弹出成功或报错提示。'
                        }
                      }
                    ]
                  }
                ],
                false,
                {
                  className: 'action-apiControl'
                }
              ),
              {
                name: 'outputVar',
                type: 'input-text',
                label: '存储结果',
                placeholder: '请输入存储请求结果的变量名称',
                description:
                  '如需执行多次发送请求，可以修改此变量名用于区分不同请求返回的结果',
                mode: 'horizontal',
                size: 'lg',
                value: 'responseResult',
                required: true
              }
            ]
          },
          outputVarDataSchema: [
            {
              type: 'object',
              properties: {
                'event.data.${outputVar}.responseData': {
                  type: 'object',
                  title: '数据'
                },
                'event.data.${outputVar}.responseStatus': {
                  type: 'number',
                  title: '状态标识'
                },
                'event.data.${outputVar}.responseMsg': {
                  type: 'string',
                  title: '提示信息'
                }
              }
            }
          ]
        },
        {
          actionLabel: '下载文件',
          actionType: 'download',
          description: '触发下载文件',
          innerArgs: ['api'],
          schema: {
            type: 'wrapper',
            style: {padding: '0'},
            body: [
              getArgsWrapper(
                getSchemaTpl('apiControl', {
                  name: 'api',
                  label: '配置请求',
                  mode: 'horizontal',
                  inputClassName: 'm-b-none',
                  size: 'lg',
                  renderLabel: true,
                  required: true
                }),
                false,
                {
                  className: 'action-apiControl'
                }
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
                      {info?.rendererLabel}
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
                      {info?.rendererLabel}
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
              name: 'groupType',
              mode: 'horizontal',
              value: 'show',
              required: true,
              pipeIn: defaultValue('show'),
              inputClassName: 'event-action-radio',
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
                      {info?.rendererLabel}
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
                      {info?.rendererLabel}
                    </span>
                    组件
                  </div>
                );
              }
            }
          ],
          supportComponents: [
            'form',
            ...FORMITEM_CMPTS,
            ...SUPPORT_DISABLED_CMPTS
          ],
          schema: [
            ...renderCmptSelect('选择组件', true),
            {
              type: 'radios',
              label: '启用/禁用',
              name: 'groupType',
              mode: 'horizontal',
              inputClassName: 'event-action-radio',
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
                  {info?.rendererLabel}
                </span>
                组件
              </div>
            );
          },
          supportComponents: 'byComponent',
          schema: renderCmptSelect('选择组件', true)
        },
        {
          actionLabel: '设置组件数据',
          actionType: 'setValue',
          description: '设置数据容器或表单项的数据',
          innerArgs: ['value', 'index', '__valueInput', '__comboType'],
          descDetail: (info: any) => {
            return (
              <div>
                设置
                <span className="variable-left variable-right">
                  {info?.rendererLabel}
                </span>
                的数据
                {/* 值为
                <span className="variable-left variable-right"> // 因为初始化时进行了格式化，会导致args的值发生变化并同步到右侧动作表，因此关闭详情
                  {info?.args?.value
                    ? JSON.stringify(info?.args?.value)
                    : info?.args?.valueInput}
                </span> */}
              </div>
            );
          },
          supportComponents: 'byComponent',
          schema: [
            ...renderCmptActionSelect('选择组件', true),
            getArgsWrapper({
              type: 'wrapper',
              className: 'p-none',
              body: [
                {
                  type: 'radios',
                  required: true,
                  name: '__comboType',
                  inputClassName: 'event-action-radio',
                  mode: 'horizontal',
                  label: '赋值方式',
                  visibleOn: `data.__rendererName && __rendererName === 'combo'`,
                  options: [
                    {
                      label: '全量',
                      value: 'all'
                    },
                    {
                      label: '指定序号',
                      value: 'appoint'
                    }
                  ],
                  onChange: (
                    value: string,
                    oldVal: any,
                    data: any,
                    form: any
                  ) => {
                    form.setValueByName('index', undefined);
                    form.setValueByName('value', []);
                    form.setValueByName('__valueInput', undefined);
                  }
                },
                {
                  type: 'input-number',
                  required: true,
                  name: 'index',
                  mode: 'horizontal',
                  label: '输入序号',
                  placeholder: '请输入待更新序号',
                  visibleOn: `data.__comboType && __comboType === 'appoint' && data.__rendererName && __rendererName === 'combo'`
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
                      name: 'key',
                      type: 'select',
                      placeholder: '变量名',
                      source: '${__setValueDs}',
                      labelField: 'label',
                      valueField: 'value',
                      required: true,
                      visibleOn: `data.__rendererName && ${SHOW_SELECT_PROP}`
                    },
                    {
                      name: 'key',
                      type: 'input-text',
                      placeholder: '变量名',
                      required: true,
                      visibleOn: `data.__rendererName && !${SHOW_SELECT_PROP} && __comboType === 'appoint'`
                    },
                    {
                      name: 'val',
                      type: 'input-formula',
                      placeholder: '字段值',
                      variables: '${variables}',
                      evalMode: false,
                      variableMode: 'tabs',
                      inputMode: 'input-group'
                    }
                  ],
                  visibleOn: `data.__rendererName && ${IS_DATA_CONTAINER} || (data.__comboType && __comboType === 'appoint')`
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
                          source: '${__setValueDs}',
                          labelField: 'label',
                          valueField: 'value',
                          required: true,
                          visibleOn: `data.__rendererName && ${SHOW_SELECT_PROP}`
                        },
                        {
                          name: 'key',
                          type: 'input-text',
                          required: true,
                          placeholder: '变量名',
                          visibleOn: `data.__rendererName && !${SHOW_SELECT_PROP}`
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
                  visibleOn: `data.__rendererName && __rendererName === 'combo' && data.__comboType && __comboType === 'all'`
                },
                {
                  name: '__valueInput',
                  type: 'input-formula',
                  variables: '${variables}',
                  evalMode: false,
                  variableMode: 'tabs',
                  inputMode: 'input-group',
                  label: '赋值',
                  size: 'lg',
                  mode: 'horizontal',
                  visibleOn: `data.__rendererName && !${IS_DATA_CONTAINER} && !${SHOW_SELECT_PROP} && __rendererName !== 'combo'`,
                  required: true
                }
              ]
            })
          ]
        },
        {
          actionLabel: '提交表单',
          actionType: 'submit',
          description: '触发表单提交',
          descDetail: (info: any) => {
            return (
              <div>
                提交
                <span className="variable-left variable-right">
                  {info?.rendererLabel}
                </span>
                的数据
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
                清空
                <span className="variable-left variable-right">
                  {info?.rendererLabel}
                </span>
                的数据
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
                重置
                <span className="variable-left variable-right">
                  {info?.rendererLabel}
                </span>
                的数据
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
                校验
                <span className="variable-left variable-right">
                  {info?.rendererLabel}
                </span>
                的数据
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
                visibleOn: 'data.actionType === "copy"',
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
            options: {
              automaticLayout: true,
              lineNumbers: 'off',
              glyphMargin: false,
              tabSize: 2,
              wordWrap: 'on',
              lineDecorationsWidth: 0,
              lineNumbersMinChars: 0,
              selectOnLineNumbers: true,
              scrollBeyondLastLine: false,
              folding: true
            },
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
