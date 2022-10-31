/**
 * @file 时间选择器的快捷键
 */
import React from 'react';
import cx from 'classnames';
import Sortable from 'sortablejs';
import {findDOMNode} from 'react-dom';
import {FormItem, Button, Icon, InputBox} from 'amis';

import type {FormControlProps} from 'amis-core';
import type {BaseEventContext} from 'amis-editor-core';

import {autobind} from 'amis-editor-core';
import FormulaControl from './FormulaControl';

const CustomType = 'custom';

type RangesType = Array<string | {label: string; range: any}>;

type DropDownOption = {
  [key: string]: string;
};

export interface DateShortCutControlProps extends FormControlProps {
  className?: string;
  /**
   * 编辑器上下文数据，用于获取字段所在Form的其他字段
   */
  context: BaseEventContext;
  dropDownOption: DropDownOption;
}

interface OptionsType {
  label: string;
  type: string;
  inputValue: string;
}

interface DateShortCutControlState {
  options: Array<OptionsType>;
}

const klass = 'ae-DateShortCutControl';

export class DateShortCutControl extends React.PureComponent<
  DateShortCutControlProps,
  DateShortCutControlState
> {
  sortable?: Sortable;
  drag?: HTMLElement | null;
  target: HTMLElement | null;
  dropDownOptionArr: Array<{
    label: string;
    value: string;
  }>;

  static defaultProps: Partial<DateShortCutControlProps> = {
    label: '快捷键'
  };

  constructor(props: DateShortCutControlProps) {
    super(props);
    const {dropDownOption, data} = props;
    this.dropDownOptionArr = Object.keys(dropDownOption).map(key => ({
      label: dropDownOption[key],
      value: key
    }));
    this.initOptions(data.ranges);
  }

  initOptions(ranges: RangesType) {
    if (!ranges) {
      // 这里先写固定，如果amis的dateTimeRange组件暴露对应属性，从中获取更合适，到时需要让其暴露下
      ranges = [
        'yesterday',
        '7daysago',
        'prevweek',
        'thismonth',
        'prevmonth',
        'prevquarter'
      ];
    }
    const {dropDownOption} = this.props;
    const options: Array<OptionsType> = [];
    if (Array.isArray(ranges)) {
      ranges.map(item => {
        if (typeof item === 'string' && dropDownOption.hasOwnProperty(item)) {
          options.push({
            label: dropDownOption[item as keyof typeof dropDownOption],
            type: item,
            inputValue: item
          });
        }
        if (typeof item === 'object') {
          options.push({
            label: item?.label,
            type: CustomType,
            inputValue: item.range
          });
        }
      });
    }
    this.state = {options};
  }

  /**
   * 添加
   */
  addItem(item: {label: string; value: string}) {
    const {options} = this.state;
    this.setState(
      {
        options: [
          ...options,
          {
            ...item,
            inputValue: item.value === CustomType ? '' : item.value,
            type: item.value
          }
        ]
      },
      () => {
        this.onChangeOptions();
        this.scrollToBottom();
      }
    );
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
            {options.map((option, index) => this.renderOption(option, index))}
          </ul>
        ) : (
          <div className="ae-OptionControl-placeholder">未配置</div>
        )}
      </div>
    );
  }

  /**
   * 生成选项
   */
  renderOption(option: OptionsType, index: number) {
    return (
      <li className={klass + 'Item'} key={index}>
        <a className={klass + 'Item-dragBar'}>
          <Icon icon="drag-bar" className="icon" />
        </a>
        <InputBox
          className={klass + 'Item-input'}
          clearable={false}
          placeholder="名称"
          value={option.label}
          onInput={(e: React.FocusEvent<HTMLInputElement>) =>
            this.onInputChange(index, e.target.value, 'label')
          }
        />
        <FormulaControl
          {...this.props}
          simple
          variables={[]}
          functions={[]}
          header={''}
          onChange={(value: string) =>
            this.onInputChange(index, value, 'inputValue')
          }
          value={option.inputValue}
        />
        <Button
          className={klass + 'Item-action'}
          level="link"
          size="md"
          onClick={(e: React.UIEvent<any>) => this.handleDelete(index, e)}
        >
          <Icon icon="delete-btn" className="icon" />
        </Button>
      </li>
    );
  }

  /**
   * 输入框的改变
   */
  onInputChange(index: number, value: string, key: 'inputValue' | 'label') {
    const options = this.state.options.concat();
    options[index][key] = value;
    options[index].type = CustomType;
    this.setState({options}, () => this.onChangeOptions());
  }

  /**
   * 删除选项
   */
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
    const newOptions: RangesType = [];
    options.forEach(item => {
      if (item.type !== CustomType) {
        newOptions.push(item.inputValue);
      } else {
        newOptions.push({
          label: item.label,
          range: item.inputValue
        });
      }
    });

    onBulkChange && onBulkChange({ranges: newOptions});
  }

  render() {
    const {className, label, render} = this.props;
    const optionList = this.dropDownOptionArr.map((item: any) => ({
      ...item,
      type: 'button',
      onAction: (e: React.MouseEvent, action: any) => this.addItem(item)
    }));
    return (
      <div className={cx(klass, className)}>
        <header className={klass + '-header'}>
          <label>{label}</label>
        </header>
        {this.renderContent()}
        <div className={klass + '-footer'}>
          {render(
            'inner',
            {
              type: 'dropdown-button',
              label: '添加选项',
              closeOnClick: true,
              closeOnOutside: true,
              buttons: optionList
            },
            {
              popOverContainer: null // amis 渲染挂载节点会使用 this.target
            }
          )}
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
