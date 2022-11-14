/**
 * @file 时间选择器的快捷键
 */
import React from 'react';
import cx from 'classnames';
import Sortable from 'sortablejs';
import {findDOMNode} from 'react-dom';
import {FormItem, Icon} from 'amis';

import type {FormControlProps} from 'amis-core';
import type {BaseEventContext} from 'amis-editor-core';
import type {Option} from 'amis';

import {autobind} from 'amis-editor-core';

type $Object = {
  [key: string]: string;
};

enum RangeType {
  Normal = 'Normal',
  Custom = 'Custom'
}

export interface DateShortCutControlProps extends FormControlProps {
  className?: string;
  /**
   * 编辑器上下文数据，用于获取字段所在Form的其他字段
   */
  context: BaseEventContext;
  normalDropDownOption: $Object;
  customDropDownOption: $Object;
}

interface OptionsType {
  label?: string;
  value: string;
  type: RangeType;
  inputType?: string;
}

interface DateShortCutControlState {
  options: Array<OptionsType>;
}

interface InputOption {
  type: 'middle' | 'suffix',
  prefix?: string,
  suffix: string
}

const ShortCutItemWrap = (
  props: {
    index: number,
    children: React.ReactNode,
    handleDelete: (index: number, e: React.SyntheticEvent<any>) => void
  }) => {
  return (
    <>
      <a className={klass + 'Item-dragBar'}><Icon icon='drag-bar' className='icon' /></a>
      <span className={klass + 'Item-content'}>
        {props.children}
      </span>
      <span
        className={klass + 'Item-close'}
        onClick={(e) => props.handleDelete(props.index, e)}>
        <Icon icon='status-close' className='icon' />
      </span>
    </>
  );
}

const klass = 'ae-DateShortCutControl';

export class DateShortCutControl extends React.PureComponent<
  DateShortCutControlProps,
  DateShortCutControlState
> {
  sortable?: Sortable;
  drag?: HTMLElement | null;
  target: HTMLElement | null;
  normalDropDownOptionArr: Array<Option>;
  customDropDownOptionArr: Array<Option>

  static defaultProps: Partial<DateShortCutControlProps> = {
    label: '快捷键'
  };

  constructor(props: DateShortCutControlProps) {
    super(props);
    const {normalDropDownOption, customDropDownOption, data} = props;
    this.normalDropDownOptionArr = Object.keys(normalDropDownOption).map(key => ({
      label: normalDropDownOption[key],
      value: key
    }));
    this.customDropDownOptionArr = Object.keys(customDropDownOption).map(key => ({
      label: customDropDownOption[key],
      value: key
    }));
    const defaultRanges = [
      'yesterday',
      '7daysago',
      'prevweek',
      'thismonth',
      'prevmonth',
      'prevquarter'
    ];
    this.state = {
      options: (data?.ranges ?? defaultRanges).map((item: string, index: number) => {
        const arr = item.match(/^(\d+)[a-zA-Z]+/);
        if (arr) {
          return {
            value: arr[1],
            type: RangeType.Custom,
            inputType: item.match(/[a-zA-Z]+/)?.[0]
          }
        }
        return {
            label: normalDropDownOption[item],
            value: item,
            type: RangeType.Normal,
        }
      })
    };
  }

  @autobind
  dragRef(ref: any) {
    if (!this.drag && ref) {
      this.initDragging();
    } else if (this.drag && !ref) {
      this.destroyDragging();
    }

    this.drag = ref;
  }

  /*
   * 滚动到底部
   */
  scrollToBottom() {
    this.drag &&
      this.drag?.lastElementChild?.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'start'
      });
  }

  /**
   * 初始化拖动
   */
  initDragging() {
    const dom = findDOMNode(this) as HTMLElement;
    this.sortable = new Sortable(
      dom.querySelector(`.${klass}-content`) as HTMLElement,
      {
        group: 'OptionControlGroup',
        animation: 150,
        handle: `.${klass}Item-dragBar`,
        ghostClass: `${klass}Item-dragging`,
        onEnd: (e: any) => {
          // 没有移动
          if (e.newIndex === e.oldIndex) {
            return;
          }
          // 换回来
          const parent = e.to as HTMLElement;
          if (
            e.newIndex < e.oldIndex &&
            e.oldIndex < parent.childNodes.length - 1
          ) {
            parent.insertBefore(e.item, parent.childNodes[e.oldIndex + 1]);
          } else if (e.oldIndex < parent.childNodes.length - 1) {
            parent.insertBefore(e.item, parent.childNodes[e.oldIndex]);
          } else {
            parent.appendChild(e.item);
          }

          const options = this.state.options.concat();
          options[e.oldIndex] = options.splice(
            e.newIndex,
            1,
            options[e.oldIndex]
          )[0];
          this.setState({options}, () => this.onChangeOptions());
        }
      }
    );
  }

  /**
   * 拖动的销毁
   */
  destroyDragging() {
    this.sortable && this.sortable.destroy();
  }

  /**
   * 生成内容体
   */
  renderContent() {
    const {options} = this.state;
    return (
      <div className={klass + '-wrapper'}>
        {options && options.length ? (
          <ul className={klass + '-content'} ref={this.dragRef}>
              {options.map(
                (option, index) =>
                  <li className={klass + 'Item'} key={index}>
                    {option.type === RangeType.Normal
                      ? this.renderNormalOption(option, index)
                      : this.renderCustomOption(option, index)}
                  </li>
                )
              }
          </ul>
        ) : (
          <div className={klass + '-content ' + klass + '-empty'}>未配置</div>
        )}
      </div>
    );
  }

  /**
   * 生成固定跨度选项
   */
  renderNormalOption(option: OptionsType, index: number) {
    return (
      <ShortCutItemWrap index={index} handleDelete={this.handleDelete}>
        <span>{option.label}</span>
      </ShortCutItemWrap>);
  }

  /**
   * 生成自定义跨度选项
   */
  renderCustomOption(option: OptionsType, index: number) {
    const {render} = this.props;

    const renderInput = (option: InputOption & {value: string}) => {
      if (option.type === 'middle') {
        return render('inner', {
          type: 'input-text',
          prefix: option?.prefix,
          suffix: option.suffix,
          mode: 'normal',
          placeholder: 'n',
          value: option?.value,
          onChange: (value: string) => this.handleCustomItemChange(value, index)
        })
      }
      return render('inner', {
        type: 'input-text',
        placeholder: 'n',
        mode: 'normal',
        suffix: option.suffix,
        value: option?.value,
        onChange: (value: string) => this.handleCustomItemChange(value, index)
      })
    }

    const dateMap: {[key: string]: InputOption} = {
      daysago: {prefix: '最近', suffix: '天', type: 'middle'},
      dayslater: {suffix: '天以内', type: 'suffix'},
      weeksago: {prefix: '最近', suffix: '周', type: 'middle'},
      weekslater: {suffix: '周以内', type: 'suffix'},
      monthsago: {prefix: '最近', suffix: '月', type: 'middle'},
      monthslater: {suffix: '月以内', type: 'suffix'},
      quartersago: {prefix: '最近', suffix: '季度', type: 'middle'},
      quarterslater: {suffix: '季度以内', type: 'suffix'},
      yearsago: {prefix: '最近', suffix: '年', type: 'middle'},
      yearslater: {suffix: '年以内', type: 'suffix'}
    }
  
    return (
      <ShortCutItemWrap index={index} handleDelete={this.handleDelete}>
        {option.inputType
          ? renderInput({...dateMap[option.inputType], value: option.value})
          : null}
      </ShortCutItemWrap>
    );
  }

  /**
   * 自定义跨度变化
   */
  handleCustomItemChange(value: string, index: number) {
    const options = [...this.state.options];
    options[index].value = value;
    this.setState({options}, () => this.onChangeOptions());
  }

  /**
   * option添加
   */
  addItem(item: Option, type: RangeType) {
    this.setState(
      {
        options: [
          ...this.state.options,
          {
            label: item?.label ?? '',
            type,
            value: type === RangeType.Normal ? item.value : '',
            ...(type === RangeType.Normal ? {} : {inputType: item.value})
          }
        ]
      },
      () => {
        this.onChangeOptions();
        this.scrollToBottom();
      }
    );
  }

  /**
   * 删除选项
   */
  @autobind
  handleDelete(index: number, e: React.UIEvent<any>) {
    const options = this.state.options.concat();
    options.splice(index, 1);
    this.setState({options}, () => this.onChangeOptions());
  }

  /**
   * 更新options字段的统一出口
   */
  onChangeOptions() {
    const {options} = this.state;
    const {onBulkChange} = this.props;
    const newOptions: Array<string> = [];
    options.forEach((item, index) => {
      if (item.type === RangeType.Normal) {
        newOptions[index] = item.value;
      }
      if (item.type === RangeType.Custom && item.value) {
        newOptions[index] = `${item.value}${item.inputType}`;
      }
    });
    onBulkChange && onBulkChange({ranges: newOptions});
  }

  render() {
    const {className, label, render} = this.props;
    return (
      <div className={cx(klass, className)}>
        <header className={klass + '-header'}>
          <label>{label}</label>
        </header>
        {this.renderContent()}
        <div className={klass + '-footer'}>
          <div className={klass + '-footer-btn'}>
            {render(
              'inner',
              {
                type: 'dropdown-button',
                label: '常用跨度',
                closeOnClick: true,
                closeOnOutside: true,
                level: 'enhance',
                buttons: this.normalDropDownOptionArr.map((item: any) => ({
                  ...item,
                  type: 'button',
                  onAction: (e: React.MouseEvent, action: any) => this.addItem(item, RangeType.Normal)
                }))
              },
              {
                popOverContainer: null
              }
            )}
          </div>
          <div className={klass + '-footer-btn'}>
            {render(
              'inner',
              {
                type: 'dropdown-button',
                label: '自定义跨度',
                closeOnClick: true,
                closeOnOutside: true,
                buttons: this.customDropDownOptionArr.map((item: any) => ({
                  ...item,
                  type: 'button',
                  onAction: (e: React.MouseEvent, action: any) => this.addItem(item, RangeType.Custom)
                }))
              },
              {
                popOverContainer: null
              }
            )}
          </div>
        </div>
      </div>
    );
  }
}

@FormItem({
  type: klass,
  renderLabel: false
})
export class DateShortCutControlRender extends DateShortCutControl {}
