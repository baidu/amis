import React from 'react';
import merge from 'lodash/merge';
import cloneDeep from 'lodash/cloneDeep';
import cx from 'classnames';
import {FormItem, InputBox} from 'amis';
import {PickerContainer} from 'amis-ui';

import {getEnv} from 'mobx-state-tree';
import {normalizeApi, isEffectiveApi, isApiOutdated} from 'amis-core';

import {isObject, autobind, createObject, anyChanged} from '../../util';
import {tipedLabel} from '../../component/control/BaseControl';

import type {SchemaObject, SchemaCollection, SchemaApi} from 'amis/lib/Schema';
import type {Api} from 'amis/lib/types';
import type {FormControlProps} from 'amis-core';
import type {ActionSchema} from 'amis/lib/renderers/Action';

export interface APIControlProps extends FormControlProps {
  name?: string;
  label?: string;
  value?: any;
  /**
   * 接口消息设置描述信息
   */
  messageDesc?: string;

  /**
   * 顶部按钮集合
   */
  actions?: Array<ActionSchema>;

  /**
   * 底部集合
   */
  footer?: Array<SchemaObject>;

  /**
   * 是否开启选择模式，开启后actions属性失效
   */
  enablePickerMode?: boolean;

  /**
   * 触发Picker的按钮配置
   */
  pickerBtnSchema?: ActionSchema;

  /**
   * picker标题
   */
  pickerTitle?: string;

  /**
   * Picker绑定的Name
   */
  pickerName?: string;

  /**
   * picker模式的Schema
   */
  pickerSchema?: SchemaCollection;

  /**
   * Picker数据源
   */
  pickerSource?: SchemaApi;

  /**
   * Picker弹窗大小
   */
  pickerSize?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'full';

  /**
   * Picker顶部的CSS类名
   */
  pickerHeaderClassName?: string;

  /**
   * Picker面板确认
   */
  onPickerConfirm: (values: any) => void | any;

  /**
   * Picker面板关闭
   */
  onPickerClose: () => void;

  /**
   * Picker面板选择
   */
  onPickerSelect: (values: any) => void | any;

  onAction: (
    schema: ActionSchema,
    e: React.MouseEvent<any> | void | null,
    action: object,
    data: any
  ) => void;
}

export interface APIControlState {
  apiStr: string;
  selectedItem?: any[];
  schema?: SchemaCollection;
}

export default class APIControl extends React.Component<
  APIControlProps,
  APIControlState
> {
  static defaultProps: Pick<APIControlProps, 'pickerBtnSchema'> = {
    pickerBtnSchema: {
      type: 'button',
      level: 'link',
      size: 'sm',
      label: '点击选择'
    }
  };
  constructor(props: APIControlProps) {
    super(props);

    this.state = {
      apiStr: this.transformApi2Str(props.value),
      selectedItem: [],
      schema: props.pickerSchema
    };
  }

  componentDidUpdate(prevProps: APIControlProps) {
    const props = this.props;

    if (prevProps.value !== props.value) {
      this.setState({apiStr: this.transformApi2Str(props.value)});
    }

    if (anyChanged(['enablePickerMode', 'pickerSchema'], prevProps, props)) {
      this.setState({schema: props.pickerSchema});
    }

    if (
      isApiOutdated(
        prevProps?.pickerSource,
        props?.pickerSource,
        prevProps.data,
        props.data
      )
    ) {
      this.fetchOptions();
    }
  }

  transformApi2Str(value: any) {
    const api = normalizeApi(value);

    return api.url ? `${api.method ? `${api.method}:` : ''}${api.url}` : '';
  }

  async fetchOptions() {
    const {value, data, env} = this.props;
    let {pickerSource} = this.props;
    const apiObj = normalizeApi(value);
    const apiKey = apiObj?.url.split('api://')?.[1];

    if (!pickerSource) {
      return;
    }

    const ctx = createObject(data, {value, op: 'loadOptions'});
    const schemaFilter = getEnv((window as any).editorStore).schemaFilter;

    // 基于爱速搭的规则转换一下
    if (schemaFilter) {
      pickerSource = schemaFilter({api: pickerSource}).api;
    }

    if (isEffectiveApi(pickerSource, ctx)) {
      const res = await env.fetcher(pickerSource, ctx);
      const items: any[] = res.data?.items || res?.data?.rows;
      if (items.length) {
        const selectedItem = items.find(item => item.key === apiKey);

        this.setState({selectedItem: selectedItem ? [selectedItem] : []});
      }
    }
  }

  @autobind
  handleSubmit(values: SchemaApi, action: any) {
    const {onChange, value} = this.props;
    let api: Api = values;

    // Picker未做选择
    if (!values && action === 'picker-submit') {
      return;
    }

    if (typeof value !== 'string' || typeof values !== 'string') {
      api = merge({}, normalizeApi(value), normalizeApi(values));
    }

    onChange?.(api);
  }

  handleAction(
    schema: ActionSchema,
    e: React.MouseEvent<any> | void | null,
    action: object,
    data: any
  ) {
    const {onAction} = this.props;

    onAction?.(schema, e, action, data);
  }

  normalizeValue(value: any, callback: (value: any) => any) {
    let transformedValue = cloneDeep(value);

    if (typeof callback === 'function') {
      transformedValue = callback(value);
    }

    return transformedValue;
  }

  @autobind
  handlePickerConfirm(value: any) {
    const {onPickerConfirm} = this.props;

    this.handleSubmit(
      this.normalizeValue(value, onPickerConfirm),
      'picker-submit'
    );
  }

  @autobind
  handlePickerClose() {
    const {onPickerClose} = this.props;

    onPickerClose?.();
  }

  renderHeader() {
    const {render, actions, enablePickerMode} = this.props;

    const actionsDom =
      Array.isArray(actions) && actions.length > 0
        ? actions.map((action, index) => {
            return render(`action/${index}`, action, {
              key: index,
              onAction: this.handleAction.bind(this, action)
            });
          })
        : null;

    return actionsDom || enablePickerMode ? (
      <header className="ae-ApiControl-header" key="header">
        {enablePickerMode ? this.renderPickerSchema() : actionsDom}
      </header>
    ) : null;
  }

  renderPickerSchema() {
    const {
      render,
      pickerTitle,
      pickerName = 'apiPicker',
      pickerSize,
      pickerHeaderClassName,
      pickerBtnSchema,
      enablePickerMode,
      onPickerSelect
    } = this.props;
    const {selectedItem, schema} = this.state;

    if (!schema) {
      return null;
    }

    return (
      <PickerContainer
        title={pickerTitle}
        value={selectedItem}
        headerClassName={cx(pickerHeaderClassName, 'font-bold')}
        onConfirm={this.handlePickerConfirm}
        onCancel={this.handlePickerClose}
        size={pickerSize}
        bodyRender={({value, onClose, onChange, setState, ...states}) => {
          return render('api-control-picker', schema!, {
            data: {[pickerName]: selectedItem},
            onSelect: (items: Array<any>) => {
              setState({selectedItem: items});
              onChange(this.normalizeValue(items, onPickerSelect));
            }
          });
        }}
      >
        {({onClick, isOpened}) =>
          render('picker-action', pickerBtnSchema!, {
            onClick: async (e: React.MouseEvent<any>) => {
              if (!isOpened && enablePickerMode) {
                try {
                  await this.fetchOptions();
                } catch {}
              }

              onClick(e);
            }
          })
        }
      </PickerContainer>
    );
  }

  renderApiDialog() {
    const {messageDesc: string} = this.props;

    return {
      label: '',
      type: 'action',
      acitonType: 'dialog',
      size: 'sm',
      icon: 'fa fa-code',
      actionType: 'dialog',
      dialog: {
        title: '高级设置',
        size: 'md',
        className: 'ae-ApiControl-dialog',
        headerClassName: 'font-bold',
        bodyClassName: 'ae-ApiControl-dialog-body',
        closeOnEsc: true,
        closeOnOutside: false,
        showCloseButton: true,
        body: [this.renderApiConfigTabs(this.props.messageDesc)]
      }
    };
  }

  renderApiConfigTabs(messageDesc?: string, submitOnChange: boolean = false) {
    return {
      type: 'form',
      className: 'ae-ApiControl-form',
      mode: 'horizontal',
      submitOnChange,
      wrapWithPanel: false,
      onSubmit: this.handleSubmit,
      body: [
        {
          type: 'tabs',
          className: 'ae-ApiControl-tabs',
          contentClassName: 'ae-ApiControl-tabContent',
          tabs: [
            {
              title: '接口设置',
              tab: [
                {
                  label: '发送方式',
                  name: 'method',
                  value: 'get',
                  type: 'button-group-select',
                  mode: 'horizontal',
                  options: [
                    {
                      value: 'get',
                      label: 'GET'
                    },
                    {
                      value: 'post',
                      label: 'POST'
                    },
                    {
                      value: 'put',
                      label: 'PUT'
                    },
                    {
                      value: 'patch',
                      label: 'PATCH'
                    },
                    {
                      value: 'delete',
                      label: 'DELETE'
                    }
                  ]
                },
                {
                  label: '接口地址',
                  type: 'input-text',
                  name: 'url',
                  mode: 'horizontal',
                  size: 'lg',
                  placeholder: 'http://',
                  required: true
                },
                {
                  label: '发送条件',
                  type: 'input-text',
                  name: 'sendOn',
                  mode: 'horizontal',
                  size: 'lg',
                  placeholder: '如：this.type == "123"',
                  description: '用表达式来设置该请求的发送条件'
                },
                {
                  label: '数据格式',
                  type: 'button-group-select',
                  name: 'dataType',
                  size: 'sm',
                  mode: 'horizontal',
                  description:
                    '发送体格式为：<%= data.dataType === "json" ? "application/json" : data.dataType === "form-data" ? "multipart/form-data" : data.dataType === "form" ? "application/x-www-form-urlencoded" : "" %>，当发送内容中存在文件时会自动使用 form-data 格式。',
                  options: [
                    {
                      label: 'JSON',
                      value: 'json'
                    },
                    {
                      label: 'FormData',
                      value: 'form-data'
                    },
                    {
                      label: 'Form',
                      value: 'form'
                    }
                  ],
                  disabled: false
                },
                {
                  type: 'switch',
                  label: '是否设置缓存',
                  name: 'cache',
                  mode: 'horizontal',
                  pipeIn: (value: any) => !!value,
                  pipeOut: (value: any) => (value ? 3000 : undefined)
                },
                {
                  label: '',
                  type: 'input-number',
                  name: 'cache',
                  mode: 'horizontal',
                  size: 'md',
                  min: 0,
                  step: 500,
                  visibleOn: 'this.cache',
                  description: '设置该请求缓存有效时间，单位 ms',
                  pipeIn: (value: any) =>
                    typeof value === 'number' ? value : 0
                },
                {
                  label: '文件下载',
                  name: 'responseType',
                  type: 'switch',
                  mode: 'horizontal',
                  description:
                    '当接口为二进制文件下载时请勾选，否则会文件乱码。',
                  pipeIn: (value: any) => value === 'blob',
                  pipeOut: (value: any) => (value ? 'blob' : undefined)
                },
                {
                  label: '数据替换',
                  name: 'replaceData',
                  type: 'switch',
                  mode: 'horizontal',
                  description: '默认数据为追加方式，开启后完全替换当前数据'
                },
                {
                  label: tipedLabel(
                    '初始加载',
                    '当配置初始化接口后，组件初始就会拉取接口数据，可以通过以下配置修改'
                  ),
                  type: 'group',
                  visibleOn: 'this.initApi',
                  mode: 'horizontal',
                  direction: 'vertical',
                  // labelRemark: {
                  //   trigger: 'hover',
                  //   rootClose: true,
                  //   content:
                  //     '当配置初始化接口后，组件初始就会拉取接口数据，可以通过以下配置修改',
                  //   placement: 'top'
                  // },

                  body: [
                    {
                      name: 'initFetch',
                      type: 'radios',
                      inline: true,
                      mode: 'normal',
                      renderLabel: false,
                      onChange: () => {
                        document.getElementsByClassName(
                          'ae-Settings-content'
                        )[0].scrollTop = 0;
                      },
                      // pipeIn: (value:any) => typeof value === 'boolean' ? value : '1'
                      options: [
                        {
                          label: '是',
                          value: true
                        },

                        {
                          label: '否',
                          value: false
                        },

                        {
                          label: '表达式',
                          value: ''
                        }
                      ]
                    },
                    {
                      name: 'initFetchOn',
                      autoComplete: false,
                      visibleOn: 'typeof this.initFetch !== "boolean"',
                      type: 'input-text',
                      mode: 'normal',
                      size: 'lg',
                      renderLabel: false,
                      placeholder: '如：this.id 表示有 id 值时初始加载',
                      className: 'm-t-n-sm'
                    }
                  ]
                },
                {
                  label: '定时刷新',
                  name: 'interval',
                  type: 'switch',
                  mode: 'horizontal',
                  visibleOn: 'data.initApi',
                  pipeIn: (value: any) => !!value,
                  pipeOut: (value: any) => (value ? 3000 : undefined)
                },
                {
                  label: '',
                  name: 'interval',
                  type: 'input-number',
                  mode: 'horizontal',
                  size: 'md',
                  visibleOn: 'typeof this.interval === "number"',
                  step: 500,
                  description: '定时刷新间隔，单位 ms'
                },
                {
                  label: '静默刷新',
                  name: 'silentPolling',
                  type: 'switch',
                  mode: 'horizontal',
                  visibleOn: '!!data.interval',
                  description: '设置自动定时刷新时是否显示loading'
                },
                {
                  label: tipedLabel(
                    '定时刷新停止',
                    '定时刷新一旦设置会一直刷新，除非给出表达式，条件满足后则停止刷新'
                  ),
                  name: 'stopAutoRefreshWhen',
                  type: 'input-text',
                  mode: 'horizontal',
                  horizontal: {
                    leftFixed: 'md'
                  },
                  size: 'lg',
                  visibleOn: '!!data.interval',
                  placeholder: '停止定时刷新检测表达式'
                  // labelRemark: {
                  //   trigger: 'hover',
                  //   rootClose: true,
                  //   content:
                  //     '定时刷新一旦设置会一直刷新，除非给出表达式，条件满足后则停止刷新',
                  //   placement: 'top'
                  // }
                }
              ]
            },
            {
              title: 'HTTP配置',
              tab: [
                {
                  type: 'fieldSet',
                  title: 'Body',
                  headingClassName: 'ae-ApiControl-title',
                  body: [
                    {
                      type: 'switch',
                      label: tipedLabel(
                        '发送数据映射',
                        '当没开启数据映射时，发送 API 的时候会发送尽可能多的数据，如果你想自己控制发送的数据，或者需要额外的数据处理，请开启此选项'
                      ),
                      name: 'data',
                      mode: 'row',
                      // labelRemark: {
                      //   trigger: 'hover',
                      //   rootClose: true,
                      //   content:
                      //     '当没开启数据映射时，发送 API 的时候会发送尽可能多的数据，如果你想自己控制发送的数据，或者需要额外的数据处理，请开启此选项',
                      //   placement: 'top'
                      // },
                      pipeIn: (value: any) => !!value,
                      pipeOut: (value: any) => (value ? {'&': '$$'} : null)
                    },
                    {
                      type: 'combo',
                      syncDefaultValue: false,
                      name: 'data',
                      mode: 'normal',
                      renderLabel: false,
                      visibleOn: 'this.data',
                      descriptionClassName: 'help-block text-xs m-b-none',
                      description:
                        '<p>当没开启数据映射时，发送数据自动切成白名单模式，配置啥发送啥，请绑定数据。如：<code>{"a": "\\${a}", "b": 2}</code></p><p>如果希望在默认的基础上定制，请先添加一个 Key 为 `&` Value 为 `\\$$` 作为第一行。</p><div>当值为 <code>__undefined</code>时，表示删除对应的字段，可以结合<code>{"&": "\\$$"}</code>来达到黑名单效果。</div>',
                      multiple: true,
                      pipeIn: (value: any) => {
                        if (!isObject(value)) {
                          return value;
                        }

                        let arr: Array<any> = [];

                        Object.keys(value).forEach(key => {
                          arr.push({
                            key: key || '',
                            value:
                              typeof value[key] === 'string'
                                ? value[key]
                                : JSON.stringify(value[key])
                          });
                        });
                        return arr;
                      },
                      pipeOut: (value: any) => {
                        if (!Array.isArray(value)) {
                          return value;
                        }
                        let obj: any = {};

                        value.forEach((item: any) => {
                          let key: string = item.key || '';
                          let value: any = item.value;
                          try {
                            value = JSON.parse(value);
                          } catch (e) {}

                          obj[key] = value;
                        });
                        return obj;
                      },
                      items: [
                        {
                          placeholder: 'Key',
                          type: 'input-text',
                          unique: true,
                          name: 'key',
                          required: true
                        },

                        {
                          placeholder: 'Value',
                          type: 'input-text',
                          name: 'value'
                        }
                      ]
                    },
                    {
                      type: 'switch',
                      label: tipedLabel(
                        '返回结果映射',
                        '如果需要对返回结果做额外的数据处理，请开启此选项'
                      ),
                      name: 'responseData',
                      mode: 'row',
                      // labelRemark: {
                      //   trigger: 'hover',
                      //   rootClose: true,
                      //   content:
                      //     '如果需要对返回结果做额外的数据处理，请开启此选项',
                      //   placement: 'top'
                      // },
                      pipeIn: (value: any) => !!value,
                      pipeOut: (value: any) => (value ? {'&': '$$'} : null)
                    },
                    {
                      type: 'combo',
                      syncDefaultValue: false,
                      name: 'responseData',
                      mode: 'normal',
                      renderLabel: false,
                      visibleOn: 'this.responseData',
                      descriptionClassName: 'help-block text-xs m-b-none',
                      multiple: true,
                      pipeIn: (value: any) => {
                        if (!isObject(value)) {
                          return value;
                        }

                        let arr: Array<any> = [];

                        Object.keys(value).forEach(key => {
                          arr.push({
                            key: key || '',
                            value:
                              typeof value[key] === 'string'
                                ? value[key]
                                : JSON.stringify(value[key])
                          });
                        });
                        return arr;
                      },
                      pipeOut: (value: any) => {
                        if (!Array.isArray(value)) {
                          return value;
                        }
                        let obj: any = {};

                        value.forEach((item: any) => {
                          let key: string = item.key || '';
                          let value: any = item.value;
                          try {
                            value = JSON.parse(value);
                          } catch (e) {}

                          obj[key] = value;
                        });
                        return obj;
                      },
                      items: [
                        {
                          placeholder: 'Key',
                          type: 'input-text',
                          unique: true,
                          name: 'key',
                          required: true
                        },

                        {
                          placeholder: 'Value',
                          type: 'input-text',
                          name: 'value'
                        }
                      ]
                    },
                    {
                      label: '发送适配器',
                      name: 'requestAdaptor',
                      type: 'js-editor',
                      mode: 'horizontal',
                      horizontal: {justify: true},
                      clasName: 'm-t-sm',
                      allowFullscreen: true,
                      description:
                        '函数签名：(api) => api， 数据在 api.data 中，修改后返回 api 对象。'
                    },
                    {
                      label: '接收适配器',
                      name: 'adaptor',
                      type: 'js-editor',
                      mode: 'horizontal',
                      horizontal: {justify: true},
                      clasName: 'm-t-sm',
                      allowFullscreen: true,
                      description:
                        '函数签名: (payload, response, api) => payload'
                    }
                  ]
                },
                {
                  type: 'fieldSet',
                  title: 'Header',
                  headingClassName: 'ae-ApiControl-title',
                  body: [
                    {
                      type: 'switch',
                      label: tipedLabel(
                        '请求头',
                        '可以配置headers对象，添加自定义请求头'
                      ),
                      name: 'headers',
                      mode: 'row',
                      className: 'm-b-xs',
                      // labelRemark: {
                      //   trigger: 'hover',
                      //   rootClose: true,
                      //   content:
                      //     '可以配置<code>headers</code>对象，添加自定义请求头',
                      //   placement: 'top'
                      // },
                      pipeIn: (value: any) => !!value,
                      pipeOut: (value: any) => (value ? {'': ''} : null)
                    },
                    {
                      type: 'combo',
                      name: 'headers',
                      mode: 'row',
                      syncDefaultValue: false,
                      multiple: true,
                      visibleOn: 'this.headers',
                      items: [
                        {
                          type: 'input-text',
                          name: 'key',
                          placeholder: 'Key',
                          unique: true,
                          required: true,
                          options: [
                            {
                              label: 'Content-Encoding',
                              value: 'Content-Encoding'
                            },
                            {
                              label: 'Content-Type',
                              value: 'Content-Type'
                            }
                          ]
                        },
                        {
                          type: 'input-text',
                          name: 'value',
                          placeholder: 'Value',
                          disabled: false
                        }
                      ],
                      pipeIn: (value: any) => {
                        if (!isObject(value)) {
                          return value;
                        }

                        let arr: Array<any> = [];

                        Object.keys(value).forEach(key => {
                          arr.push({
                            key: key || '',
                            value:
                              typeof value[key] === 'string'
                                ? value[key]
                                : JSON.stringify(value[key])
                          });
                        });
                        return arr;
                      },
                      pipeOut: (value: any) => {
                        if (!Array.isArray(value)) {
                          return value;
                        }
                        let obj: any = {};

                        value.forEach((item: any) => {
                          let key: string = item.key || '';
                          let value: any = item.value;
                          try {
                            value = JSON.parse(value);
                          } catch (e) {}

                          obj[key] = value;
                        });
                        return obj;
                      }
                    }
                  ]
                }
              ]
            },
            {
              title: '其他',
              tab: [
                {
                  label: '默认消息提示',
                  type: 'combo',
                  name: 'messages',
                  mode: 'normal',
                  multiLine: true,
                  description:
                    messageDesc ||
                    '设置 ajax 默认提示信息，当 ajax 没有返回 msg 信息时有用，如果 ajax 返回携带了 msg 值，则还是以 ajax 返回为主',
                  items: [
                    {
                      label: '获取成功提示',
                      type: 'input-text',
                      name: 'success'
                    },

                    {
                      label: '获取失败提示',
                      type: 'input-text',
                      name: 'failed'
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    };
    // return
  }

  render() {
    const {
      render,
      className,
      value,
      footer,
      border = false,
      messageDesc
    } = this.props;

    return (
      <div className={cx('ae-ApiControl', className, {border})}>
        {this.renderHeader()}

        <div className="ae-ApiControl-content" key="content">
          <InputBox
            className="ae-ApiControl-input m-b-none"
            value={this.state.apiStr}
            clearable={false}
            placeholder="http://"
            onChange={(value: string) => this.handleSubmit(value, 'input')}
          />
          {render('api-control-dialog', this.renderApiDialog(), {
            data: normalizeApi(value)
          })}
        </div>

        {Array.isArray(footer) && footer.length !== 0 ? (
          <footer className="mt-3" key="footer">
            {render('api-control-footer', footer)}
          </footer>
        ) : null}
      </div>
    );
  }
}

@FormItem({
  type: 'ae-actionApiControl'
})
export class APIControlRenderer extends APIControl {}
