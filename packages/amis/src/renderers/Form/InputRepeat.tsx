/**
 * @file filter
 * @author fex
 *
 * 不建议用，以后可能会删除。可以直接用组合出来，不需要新建一个组件。
 */
/**
 * Repeat
 * 文档：https://baidu.gitee.io/amis/docs/components/form/repeat
 */
import React from 'react';
import cx from 'classnames';
import {FormItem, FormControlProps, FormBaseControl} from 'amis-core';
import {Select} from 'amis-ui';
import {Range as InputRange} from 'amis-ui';
import {Option} from 'amis-core';
import {FormBaseControlSchema} from '../../Schema';

export interface RepeatControlSchema extends FormBaseControlSchema {
  type: 'input-repeat';

  options?: string;
}

const LANG: {
  [propName: string]: string;
} = {
  secondly: '秒',
  minutely: '分',
  hourly: '时',
  daily: '天',
  weekdays: '周中',
  weekly: '周',
  monthly: '月',
  yearly: '年'
};

const UN_REPEAT_VALUE = '';

export interface RepeatProps extends FormControlProps {
  options?: string;
  placeholder?: string;
}

export default class RepeatControl extends React.Component<RepeatProps, any> {
  static defaultProps = {
    // options: 'secondly,minutely,hourly,daily,weekdays,weekly,monthly,yearly'
    options: 'hourly,daily,weekly,monthly',
    placeholder: '不重复'
  };

  constructor(props: RepeatProps) {
    super(props);

    this.handleOptionChange = this.handleOptionChange.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleOptionChange(option: Option) {
    this.props.onChange(option.value);
  }

  handleChange(value: string) {
    const option = this.props.value;
    const parts = option ? option.split(':') : [];

    this.props.onChange(`${parts[0]}:${value}`);
  }

  renderInput() {
    const value = this.props.value;
    const parts = value ? value.split(':') : [];
    let {
      options,
      placeholder,
      disabled,
      classPrefix: ns,
      translate: __
    } = this.props;

    let optionsArray: Array<Option> = [];

    optionsArray = (options as string).split(',').map(key => ({
      label: LANG[key] || '不支持',
      value: key
    }));

    optionsArray.unshift({
      label: __(placeholder as string),
      value: UN_REPEAT_VALUE
    });

    let input;

    parts[1] = parseInt(parts[1], 10) || 1;
    switch (parts[0]) {
      case 'secondly':
        input = (
          <InputRange
            key="input"
            classPrefix={ns}
            value={parts[1]}
            min={1}
            step={5}
            max={60}
            disabled={disabled}
            onChange={(value: any) => this.handleChange(value)}
          />
        );
        break;
      case 'minutely':
        input = (
          <InputRange
            key="input"
            classPrefix={ns}
            value={parts[1]}
            min={1}
            step={5}
            max={60}
            disabled={disabled}
            onChange={(value: any) => this.handleChange(value)}
          />
        );
        break;
      case 'hourly':
        input = (
          <InputRange
            key="input"
            classPrefix={ns}
            value={parts[1]}
            min={1}
            step={1}
            max={24}
            disabled={disabled}
            onChange={(value: any) => this.handleChange(value)}
          />
        );
        break;
      case 'daily':
        input = (
          <InputRange
            key="input"
            classPrefix={ns}
            value={parts[1]}
            min={1}
            step={1}
            max={30}
            disabled={disabled}
            onChange={(value: any) => this.handleChange(value)}
          />
        );
        break;
      case 'weekly':
        input = (
          <InputRange
            key="input"
            classPrefix={ns}
            value={parts[1]}
            min={1}
            step={1}
            max={12}
            disabled={disabled}
            onChange={(value: any) => this.handleChange(value)}
          />
        );
        break;
      case 'monthly':
        input = (
          <InputRange
            key="input"
            classPrefix={ns}
            value={parts[1]}
            min={1}
            step={1}
            max={12}
            disabled={disabled}
            onChange={(value: any) => this.handleChange(value)}
          />
        );
        break;
      case 'yearly':
        input = (
          <InputRange
            classPrefix={ns}
            key="input"
            className="v-middle"
            value={parts[1]}
            min={1}
            step={1}
            max={20}
            disabled={disabled}
            onChange={(value: any) => this.handleChange(value)}
          />
        );
        break;
    }

    const selectedValue =
      !input && value === UN_REPEAT_VALUE ? value : parts[0];

    return (
      <div className="repeat-control hbox">
        {input ? (
          <div className="col v-middle" style={{width: 30}}>
            <span>{__('Repeat.pre')}</span>
          </div>
        ) : null}

        {input ? <div className="col v-middle">{input}</div> : null}

        <div className="col v-middle repeat-btn">
          <Select
            classPrefix={ns}
            className={input ? 'pull-right' : ''}
            options={optionsArray}
            placeholder={__(placeholder)}
            onChange={this.handleOptionChange}
            value={selectedValue}
            clearable={false}
            searchable={false}
            disabled={disabled}
            joinValues={false}
          />
        </div>
      </div>
    );
  }

  render() {
    const {className, classPrefix: ns} = this.props;

    return (
      <div className={cx(`${ns}RepeatControl`, className)}>
        {this.renderInput()}
      </div>
    );
  }
}

@FormItem({
  type: 'input-repeat',
  sizeMutable: false
})
export class RepeatControlRenderer extends RepeatControl {}
