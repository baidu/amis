/**
 * @file 表单项校验配置
 */

import React from 'react';
import {FormItem} from 'amis';

import {getSchemaTpl, tipedLabel} from 'amis-editor-core';

import type {FormControlProps} from 'amis-core';

export interface ValidationApiControlProps extends FormControlProps {}

export default class ValidationApiControl extends React.Component<ValidationApiControlProps> {
  constructor(props: ValidationApiControlProps) {
    super(props);
  }

  renderValidateApiControl() {
    const {onBulkChange, render} = this.props;
    return (
      <div className="ae-ValidationControl-item">
        {render('validate-api-control', {
          type: 'form',
          wrapWithPanel: false,
          className: 'w-full mb-2',
          bodyClassName: 'p-none',
          wrapperComponent: 'div',
          mode: 'horizontal',
          data: {
            switchStatus: this.props.data.validateApi !== undefined
          },
          preventEnterSubmit: true,
          submitOnChange: true,
          onSubmit: ({switchStatus, validateApi}: any) => {
            onBulkChange &&
              onBulkChange({
                validateApi: !switchStatus ? undefined : validateApi
              });
          },
          body: [
            getSchemaTpl('switch', {
              label: tipedLabel(
                '接口校验',
                `配置校验接口，对表单项进行远程校验，配置方式与普通接口一致<br />
              1. 接口返回 <span class="ae-ValidationControl-label-code">{status: 0}</span> 表示校验通过<br />
              2. 接口返回 <span class="ae-ValidationControl-label-code">{status: 422}</span> 表示校验不通过<br />
              3. 若校验失败时需要显示错误提示信息，还需返回 errors 字段，示例<br />
              <span class="ae-ValidationControl-label-code">{status: 422, errors: '错误提示消息'}</span>
              `
              ),
              name: 'switchStatus'
            }),
            {
              type: 'container',
              className: 'ae-ExtendMore ae-ValidationControl-item-input',
              bodyClassName: 'w-full',
              visibleOn: 'this.switchStatus',
              data: {
                // 放在form中则包含的表达式会被求值
                validateApi: this.props.data.validateApi
              },
              body: [
                getSchemaTpl('apiControl', {
                  name: 'validateApi',
                  renderLabel: true,
                  label: '',
                  mode: 'normal',
                  className: 'w-full'
                })
              ]
            }
          ]
        })}
      </div>
    );
  }

  render() {
    return <>{this.renderValidateApiControl()}</>;
  }
}

@FormItem({
  type: 'ae-validationApiControl',
  renderLabel: false,
  strictMode: false
})
export class ValidationApiControlRenderer extends ValidationApiControl {}
