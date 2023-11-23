/**
 * @file API 适配器
 */

import React from 'react';
import cx from 'classnames';
import {autobind, getSchemaTpl, setSchemaTpl} from 'amis-editor-core';
import {tipedLabel} from 'amis-editor-core';
import {FormControlProps} from 'amis-core';
import {FormItem, Icon, TooltipWrapper} from 'amis';
import {TooltipObject} from 'amis-ui/lib/components/TooltipWrapper';

interface AdaptorFuncParam {
  label: string;
  tip?: string | TooltipObject;
}

export interface APIAdaptorControlProps extends FormControlProps {
  /**
   * 适配器函数参数
   */
  params?: AdaptorFuncParam[];
  /**
   * 复用适配器 函数参数提示
   */
  mergeParams?: (params: AdaptorFuncParam[]) => AdaptorFuncParam[];
  /**
   * 代码编辑器底部的 description
   */
  editorDesc?: any;
  /**
   * 代码编辑器开启时 需要预置的代码
   */
  defaultCode?: string;
  /**
   * 代码编辑器开启 的 placeHolder
   */
  editorPlaceholder?: string;
  /**
   * 开关右侧旁边的提示
   */
  switchTip?: string | React.ReactNode;
  /**
   * 自定义提示参数
   */
  tooltipProps?: TooltipObject;
}

export interface APIAdaptorControlState {
  switch: boolean;
}

export default class APIAdaptorControl extends React.Component<
  APIAdaptorControlProps,
  APIAdaptorControlState
> {
  static defaultProps: Pick<APIAdaptorControlProps, 'params'> = {
    params: []
  };

  constructor(props: APIAdaptorControlProps) {
    super(props);
    this.state = {
      switch: !!this.props.value
    };
  }

  @autobind
  onChange(value: any = '') {
    this.props.onChange?.(value);
  }

  // 生成tooltip 的参数
  genTooltipProps(content: any, othersProps?: TooltipObject) {
    const {render} = this.props;
    return {
      tooltipTheme: 'light',
      trigger: 'hover',
      rootClose: true,
      placement: 'top',
      tooltipClassName: 'ae-AdaptorControl-desc-tooltip',
      ...(typeof content === 'string'
        ? {content}
        : {
            content: ' ', // amis缺陷，必须有这个字段，否则显示不出来
            children: () =>
              React.isValidElement(content)
                ? content
                : render('content', content)
          }),
      ...(this.props.tooltipProps || {}),
      ...(othersProps || {})
    };
  }

  renderEditor() {
    if (!this.state.switch) {
      return null;
    }

    const {
      render,
      params = [],
      allowFullscreen,
      value,
      editorPlaceholder,
      editorDesc,
      mergeParams,
      mode
    } = this.props;

    return (
      <>
        {render(
          'api-adaptor-control-editor',
          {
            type: 'ae-functionEditorControl',
            name: 'functionEditorControl',
            placeholder: editorPlaceholder,
            desc: editorDesc,
            allowFullscreen,
            params,
            mode: mode || 'normal'
          },
          {
            value,
            mergeParams,
            onChange: this.onChange
          }
        )}
      </>
    );
  }

  renderSwitch() {
    const {render, defaultCode = '', switchTip, name, value} = this.props;
    return render('api-adaptor-control-switch', {
      type: 'flex',
      className: 'mb-2',
      alignItems: 'center',
      direction: 'row',
      justify: 'flex-start',
      items: [
        {
          type: 'switch',
          label: '',
          mode: 'inline',
          name: '__editorSwitch_' + name,
          key: 'switch',
          className: 'mb-1',
          value: this.state.switch,
          onChange: (checked: any) => {
            this.setState({switch: checked}, () => {
              this.onChange(!checked ? '' : value || defaultCode);
            });
          }
        },
        ...(switchTip
          ? [
              <TooltipWrapper
                key="TooltipWrapper"
                tooltip={
                  this.genTooltipProps(switchTip, {
                    placement: 'right'
                  }) as any
                }
              >
                <span className="leading-3 cursor-pointer">
                  <Icon icon="editor-help" className="icon" color="#84868c" />
                </span>
              </TooltipWrapper>
            ]
          : [])
      ]
    });
  }

  render() {
    const {className} = this.props;

    return (
      <div className={cx('ae-ApiAdaptorControl', className)}>
        {this.renderSwitch()}
        {this.renderEditor()}
      </div>
    );
  }
}
@FormItem({
  type: 'ae-apiAdaptorControl'
})
export class APIAdaptorControlRenderer extends APIAdaptorControl {}

/**
 * 渲染 代码高亮 节点
 * @param code 代码字符串
 * @param size 渲染区域的width, height, 代码区域是异步渲染，tooltip时计算会偏移
 * @returns
 */
export const genCodeSchema = (code: string, size?: string[]) => ({
  type: 'container',
  ...(!size
    ? {}
    : {
        style: {
          width: size[0],
          height: size[1]
        }
      }),
  body: {
    type: 'code',
    language: 'typescript',
    className: 'bg-white text-xs m-0',
    value: code
  }
});

// 请求适配器 示例代码
export const requestAdaptorDefaultCode = `api.data.count = api.data.count + 1;
return api;`;

// 适配器 适配器 api 参数说明
export const adaptorApiStruct = `{
  url: string; // 当前接口地址
  method: 'get' | 'post' | 'put' | 'delete';
  data?: Object; // 请求体
  headers?: Object; // 请求头
  ...
}`;

// 适配器 适配器 context 参数说明
export const adaptorContextStruct = `{
  // 上下文数据
  [key: string]: any;
}`;

export const adaptorApiStructTooltip = genCodeSchema(adaptorApiStruct, [
  '350px',
  '128px'
]);

export const adaptorContextStructTooltip = genCodeSchema(adaptorContextStruct, [
  '350px',
  '128px'
]);

// 适配器 response 参数说明
export const adaptorResponseStruct = `{
  data: Object; // 接口返回数据,
  request: XMLHttpRequest;
  headers?: Object; // 请求头
  status: number; // 状态码 200, 404, 500..
  statusText: string; // 状态信息
  ...
}`;

export const adaptorResponseStructTooltip = genCodeSchema(
  adaptorResponseStruct,
  ['345px', '144px']
);

// 接收适配器 示例代码
export const adaptorDefaultCode = `// API响应或自定义处理后需要符合以下格式
return {
    status: 0, // 0 表示请求成功，否则按错误处理
    msg: '请求成功',
    data: {
        text: 'world',
        items: [
            {label: '张三', value: 1}
        ]
    }
}`;

export const validateApiAdaptorDefaultCode = `// 校验成功
return {
    status: 0
};

// 校验失败
return {
  status: 422,
  errors: '当前用户已存在'
}`;

// 接收适配器 正确返回格式 示例
export const adaptorReturnStruct = `{
  "status": 0,
  "msg": "",
  "data": {
    // ...其他字段
  }
}`;

// 接收适配器 正确返回格式说明
export const adaptorEditorDescSchema = {
  type: 'container',
  className: 'text-xs',
  style: {
    width: '458px',
    height: '315px'
  },
  body: [
    '接口返回数据需要符合以下格式, status、msg、data 为必要字段',
    genCodeSchema(adaptorReturnStruct),
    {
      type: 'table',
      className: 'mt-1 mb-0',
      data: {
        items: [
          {
            label: 'status',
            desc: '返回 0 表示当前接口正确返回，否则按错误请求处理'
          },
          {
            label: 'msg',
            desc: '返回接口处理信息，主要用于表单提交或请求失败时的 toast 显示'
          },
          {
            label: 'data',
            desc: '必须返回一个具有 key-value 结构的对象'
          }
        ]
      },
      columns: [
        {
          name: 'label',
          label: '字段'
        },
        {
          name: 'desc',
          label: '说明'
        }
      ]
    }
  ]
};

// 表单项校验接收适配器 正确返回格式说明
export const validateApiAdaptorEditorDescSchema = {
  type: 'container',
  className: 'text-xs',
  body: [
    '校验接口返回格式字段说明：',
    {
      type: 'table',
      className: 'mt-1 mb-0',
      data: {
        items: [
          {
            label: 'status',
            desc: '返回 0 表示校验成功，422 表示校验失败'
          },
          {
            label: 'errors',
            desc: '返回 status 为 422 时，显示的校验失败信息'
          }
        ]
      },
      columns: [
        {
          name: 'label',
          label: '字段'
        },
        {
          name: 'desc',
          label: '说明'
        }
      ]
    }
  ]
};

setSchemaTpl('apiRequestAdaptor', {
  label: tipedLabel(
    '发送适配器',
    `可基于 JavaScript 语言直接录入发送适配器的函数体，在该函数体内，您可以对 <span style="color: #108CEE">api</span> 进行处理或者返回新的内容，最后需要 <span style="color: #108CEE">return</span> <span style="color: #108CEE">api</span>。<br><br/>
    函数体内可访问的变量如下：<br/>
    &nbsp;1. <span style="color: #108CEE">api</span>：接口的schema配置对象<br/>
    &nbsp;2. <span style="color: #108CEE">api.data</span>：请求数据<br/>
    &nbsp;3. <span style="color: #108CEE">api.query</span>：请求查询参数<br/>
    &nbsp;4. <span style="color: #108CEE">api.headers</span>：请求头<br/>
    &nbsp;5. <span style="color: #108CEE">api.url</span>：请求地址<br/>`
  ),
  name: 'requestAdaptor',
  type: 'ae-apiAdaptorControl',
  editorDesc: '必须将修改好的 api 对象 return 出去。',
  editorPlaceholder: requestAdaptorDefaultCode,
  params: [
    {
      label: 'api',
      tip: adaptorApiStructTooltip
    },
    {
      label: 'context',
      tip: adaptorContextStructTooltip
    }
  ]
});

setSchemaTpl('apiAdaptor', {
  label: tipedLabel(
    '返回适配器',
    `可基于 JavaScript 语言直接录入返回适配器的函数体，在函数体内，您可以对 <span style="color: #108CEE">payload</span> 进行处理或者返回新的内容，最后需要 <span style="color: #108CEE">return</span> 接口最终的返回结果。<br><br/>
    函数体内可访问的变量如下：<br/>
    &nbsp;1. <span style="color: #108CEE">payload</span>：接口的返回结果<br/>
    &nbsp;2. <span style="color: #108CEE">response</span>：接口的response对象<br/>
    &nbsp;3. <span style="color: #108CEE">api</span>：接口的schema配置对象<br/>`
  ),
  type: 'ae-apiAdaptorControl',
  name: 'adaptor',
  params: [
    {
      label: 'payload',
      tip: '当前请求的响应 payload，即 response.data'
    },
    {
      label: 'response',
      tip: adaptorResponseStructTooltip
    },
    {
      label: 'api',
      tip: adaptorApiStructTooltip
    }
  ],
  editorPlaceholder: adaptorDefaultCode,
  switchTip: adaptorEditorDescSchema
});

setSchemaTpl('validateApiAdaptor', {
  ...getSchemaTpl('apiAdaptor'),
  editorPlaceholder: validateApiAdaptorDefaultCode,
  switchTip: validateApiAdaptorEditorDescSchema
});
