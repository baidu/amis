/**
 * @file 组件选项组件的可视化编辑控件
 */

import React from 'react';
import cx from 'classnames';
import {FormItem, NumberInput} from 'amis';
import type {FormControlProps} from 'amis-core';
import {autobind} from 'amis-editor-core';
import {getSchemaTpl} from 'amis-editor-core';

import type {Option} from 'amis';

export type PartsOptionControlItem = Option & {number: number};
export type MarksOptionControlItem = Option & {number: number; label: any};

export interface PartsControlProps extends FormControlProps {
  className?: string;
}

export interface PartsControlState {
  options: Array<PartsOptionControlItem>;
  source: string;
  parts: number;
}

export interface MarksControlProps extends FormControlProps {
  className?: string;
}

export interface MarksControlState {
  options: Array<MarksOptionControlItem>;
  source: string;
}

const PartsSourceEnum = {
  NO_BLOCK: 'NO_BLOCK',
  AVERAGE: 'AVERAGE',
  STEPS: 'STEPS',
  CUSTOM: 'CUSTOM'
};

const MarksSourceEnum = {
  PARKS: 'PARKS',
  CUSTOM: 'CUSTOM'
};

const PartsSourceOptions = [
  {label: '不分块', value: PartsSourceEnum.NO_BLOCK},
  {label: '平均分', value: PartsSourceEnum.AVERAGE},
  {label: '按步长分', value: PartsSourceEnum.STEPS},
  {label: '自定义', value: PartsSourceEnum.CUSTOM}
];

const MarksSourceOptions = [
  {label: '与分块保持一致', value: MarksSourceEnum.PARKS},
  {label: '自定义', value: MarksSourceEnum.CUSTOM}
];

// 根据滑块配置获取分块方式
const getPartsSource = (parts: number | number[], showSteps?: boolean) => {
  if (Array.isArray(parts)) {
    return PartsSourceEnum.CUSTOM;
  }
  if (parts > 1) {
    return PartsSourceEnum.AVERAGE;
  }
  if (showSteps) {
    return PartsSourceEnum.STEPS;
  }
  return PartsSourceEnum.NO_BLOCK;
};

/**
 * 分块
 */
export class PartsControl extends React.Component<
  PartsControlProps,
  PartsControlState
> {
  constructor(props: PartsControlProps) {
    super(props);

    const {parts = 1, showSteps} = props.data;
    this.state = {
      options: this.transformOptionValue(getPartsSource(parts), parts),
      source: getPartsSource(parts, showSteps),
      parts
    };
  }

  @autobind
  transformOptionValue(source: string, parts: number | number[]) {
    if (source === PartsSourceEnum.CUSTOM && Array.isArray(parts)) {
      return parts.map((value: number | string) => ({
        number: Number(value)
      }));
    }
    return [];
  }

  /**
   * 更新数据
   */
  onChange() {
    const {source, parts, options} = this.state;
    const {onBulkChange} = this.props;
    const data: Partial<PartsControlProps> = {
      parts,
      showSteps: false
    };
    switch (source) {
      case PartsSourceEnum.NO_BLOCK:
        data.parts = 1;
        break;
      case PartsSourceEnum.AVERAGE:
        data.parts = parts;
        break;
      case PartsSourceEnum.STEPS:
        data.parts = 1;
        data.showSteps = true;
        break;
      case PartsSourceEnum.CUSTOM:
        data.parts = [];
        if (options && !!options.length) {
          options.forEach(item => {
            data.parts.push(item.number);
          });
        }
      default:
        break;
    }

    onBulkChange && onBulkChange(data);
  }

  /**
   * 切换选项类型
   */
  @autobind
  handleSourceChange(source: string) {
    this.setState({source}, this.onChange);
  }

  /**
   * 自定义分块数据更新
   * @param value
   */
  @autobind
  handleOptionsChange(value: {number: number}[] = []) {
    this.setState({options: value}, this.onChange);
  }

  renderHeader() {
    const {env, render} = this.props;
    const {source} = this.state;
    const classPrefix = env?.theme?.classPrefix;

    return (
      <div
        className={cx(
          `${classPrefix}Form-item`,
          `${classPrefix}Form-item--horizontal`,
          `${classPrefix}Form-item--horizontal-justify`
        )}
      >
        <label
          className={cx(
            `${classPrefix}Form-label`,
            `${classPrefix}Form-itemColumn--4`
          )}
        >
          分块
        </label>
        <div className={cx(`${classPrefix}Form-value`)}>
          {render('header', {
            type: 'select',
            name: 'optionSourceList',
            options: PartsSourceOptions,
            value: source,
            onChange: this.handleSourceChange
          })}
        </div>
      </div>
    );
  }

  renderContent(source: string) {
    const {classPrefix, render} = this.props;
    const {parts, options} = this.state;

    if (source === PartsSourceEnum.AVERAGE) {
      return (
        <div
          className={cx(
            'ae-ExtendMore',
            `${classPrefix}Form-item`,
            `${classPrefix}Form-item--horizontal`,
            `${classPrefix}Form-item--horizontal-justify`
          )}
        >
          <label
            className={cx(
              `${classPrefix}Form-label`,
              `${classPrefix}Form-itemColumn--4`
            )}
          >
            块数
          </label>
          <div className={cx(`${classPrefix}Form-value`)}>
            <NumberInput value={parts} onChange={this.handlePartsChange} />
          </div>
        </div>
      );
    } else if (source === PartsSourceEnum.CUSTOM) {
      return (
        <div className="ae-OptionControl-wrapper">
          {render(
            'content',
            getSchemaTpl('combo-container', {
              type: 'combo',
              label: false,
              name: 'texts',
              items: [
                {
                  type: 'input-number',
                  name: 'number',
                  require: true
                }
              ],
              draggable: false,
              multiple: true,
              value: options,
              onChange: (value: Array<PartsOptionControlItem>) =>
                this.setState({options: value}, this.onChange),
              addButtonText: '新增分块'
            })
          )}
        </div>
      );
    }
    return <></>;
  }

  @autobind
  handlePartsChange(value: number) {
    this.setState({parts: value}, this.onChange);
  }

  render() {
    const {className} = this.props;
    const {source} = this.state;

    return (
      <div className={cx('ae-OptionControl', className)}>
        {this.renderHeader()}
        {this.renderContent(source)}
      </div>
    );
  }
}

/**
 * 下标
 */
export class MarksControl extends React.Component<
  MarksControlProps,
  MarksControlState
> {
  constructor(props: MarksControlProps) {
    super(props);
    const {marks = {}} = props.data;
    this.state = {
      options: this.transformOptionValue(marks),
      source: !Object.keys(marks).length
        ? MarksSourceEnum.PARKS
        : MarksSourceEnum.CUSTOM
    };
  }

  componentDidUpdate(prevProps: MarksControlProps) {
    const {parts, unit, max, min, showSteps} = prevProps.data;
    const {
      parts: nextParts,
      unit: nextUnit,
      max: nextMax,
      min: nextMin,
      showSteps: nextShowSteps
    } = this.props.data;
    const {source} = this.state;
    if (
      parts !== nextParts ||
      unit !== nextUnit ||
      max !== nextMax ||
      min !== nextMin ||
      showSteps !== nextShowSteps
    ) {
      // 与分块保持一致，当分块、单位发生变换同步时，同步下标
      source === MarksSourceEnum.PARKS && this.onSynchronismParts();
    }
  }

  /**
   * 配置拿到的marks数据转换为options
   * @param marks
   * @returns
   */
  @autobind
  transformOptionValue(marks: any) {
    return Object.keys(marks).map(number => ({
      number: +number,
      label: marks[number]
    }));
  }

  /**
   * 更新数据
   */
  @autobind
  onChange() {
    const {options} = this.state;
    const {onChange} = this.props;
    const marks: {[index: number]: any} = {};
    if (options && !!options.length) {
      options.forEach((item: MarksOptionControlItem) => {
        marks[item.number] = item.label || item.number;
      });
    }
    onChange && onChange(marks);
  }

  /**
   * 不同分块方式 => 不同下标数据
   */
  @autobind
  onSynchronismParts() {
    const {
      data: {parts, max, min, step = 1, unit = '', showSteps}
    } = this.props;
    const options = [];
    const partsSource = getPartsSource(parts, showSteps);
    switch (partsSource) {
      case PartsSourceEnum.AVERAGE:
        const len = (max - min) / parts;
        for (let i = 0; i <= parts; i++) {
          options.push({
            number: i * len + min,
            label: i * len + min + unit
          });
        }
        break;
      case PartsSourceEnum.STEPS:
        const length = (max - min) / step;
        for (let i = 0; i <= length; i++) {
          options.push({
            number: i * step + min,
            label: i * step + min + unit
          });
        }
        break;
      case PartsSourceEnum.CUSTOM:
        if (Array.isArray(parts)) {
          parts.forEach(number => {
            (!!number || number === 0) &&
              options.push({
                number,
                label: number + unit
              });
          });
        }
        break;
    }
    this.setState({options}, this.onChange);
  }

  /**
   * 下标方式变化
   * @param source
   */
  @autobind
  handleSourceChange(source: any) {
    this.setState({source});
    if (source === MarksSourceEnum.PARKS) {
      this.onSynchronismParts();
    }
  }

  renderHeader() {
    const {env, render} = this.props;
    const {source} = this.state;
    const classPrefix = env?.theme?.classPrefix;
    return (
      <div
        className={cx(
          `${classPrefix}Form-item`,
          `${classPrefix}Form-item--horizontal`,
          `${classPrefix}Form-item--horizontal-justify`
        )}
      >
        <label
          className={cx(
            `${classPrefix}Form-label`,
            `${classPrefix}Form-itemColumn--4`
          )}
        >
          下标
        </label>
        <div className={cx(`${classPrefix}Form-value`)}>
          {render('header', {
            type: 'select',
            name: 'optionSourceList',
            options: MarksSourceOptions,
            value: source,
            onChange: this.handleSourceChange
          })}
        </div>
      </div>
    );
  }

  render() {
    const {className, render} = this.props;
    const {source, options} = this.state;
    return (
      <div className={cx('ae-OptionControl', className)}>
        {this.renderHeader()}
        {source === MarksSourceEnum.CUSTOM &&
          render(
            'inner',
            getSchemaTpl('combo-container', {
              type: 'combo',
              label: false,
              name: 'texts',
              draggable: false,
              multiple: true,
              items: [
                {type: 'input-number', name: 'number', required: true},
                {type: 'input-text', name: 'label', required: true}
              ],
              addButtonText: '新增下标',
              value: options,
              onChange: (value: any) => {
                this.setState({options: value}, this.onChange);
              }
            })
          )}
      </div>
    );
  }
}

@FormItem({
  type: 'ae-partsControl',
  renderLabel: false
})
export class PartsControlRenderer extends PartsControl {}

@FormItem({
  type: 'ae-marksControl',
  renderLabel: false
})
export class OptionControlRenderer extends MarksControl {}
