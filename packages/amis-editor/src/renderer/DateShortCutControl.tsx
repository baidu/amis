/**
 * @file 时间选择器的快捷键
 */
import React from 'react';
import cx from 'classnames';
import Sortable from 'sortablejs';
import {findDomCompat as findDOMNode} from 'amis-core';
import {FormItem, Icon} from 'amis';

import {FormControlProps, Option, optionValueCompare} from 'amis-core';
import {BaseEventContext, getSchemaTpl} from 'amis-editor-core';

import {autobind} from 'amis-editor-core';
import {FormulaDateType} from './FormulaControl';

const DefaultValue = [
  'yesterday',
  '7daysago',
  'thismonth',
  'prevmonth',
  'prevquarter'
];

const CertainPresetShorcut = {
  today: '今天',
  yesterday: '昨天',
  thisweek: '这个周',
  prevweek: '上周',
  thismonth: '这个月',
  prevmonth: '上个月',
  thisquarter: '这个季度',
  prevquarter: '上个季度',
  thisyear: '今年'
};

const ModifyPresetShorcut = {
  $hoursago: '最近n小时',
  $daysago: '最近n天',
  $dayslater: 'n天以内',
  $weeksago: '最近n周',
  $weekslater: 'n周以内',
  $monthsago: '最近n月',
  $monthslater: 'n月以内',
  $quartersago: '最近n季度',
  $quarterslater: 'n季度以内',
  $yearsago: '最近n年',
  $yearslater: 'n年以内'
};

export interface DateShortCutControlProps extends FormControlProps {
  className?: string;
  /**
   * 编辑器上下文数据，用于获取字段所在Form的其他字段
   */
  context: BaseEventContext;
  certainOptions: Array<keyof typeof CertainPresetShorcut>;
  modifyOptions: Array<keyof typeof ModifyPresetShorcut>;
}

type PresetShorCutType = string;

// 完全自定义label与时间计算方式的快捷键数据格式
type CustomShortCutType = {
  label: string;
  startDate: string;
  endDate: string;
};

// 可修改数字的预置快捷键数据值格式
type ModifyOptionType = {
  key: keyof typeof ModifyPresetShorcut;
  value: string;
};

enum OptionType {
  Custom = 1,
  Certain = 2,
  Modify = 3
}

interface OptionDataType {
  data: PresetShorCutType | CustomShortCutType | ModifyOptionType;
  type?: OptionType; // 自定义的、某个特定的、可修改数字的特定描述区域
}

interface DateShortCutControlState {
  options: Array<OptionDataType>;
}

const ShortCutItemWrap = (props: {
  index: number;
  children: React.ReactNode | Array<React.ReactNode>;
  handleDelete: (index: number, e: React.SyntheticEvent<any>) => void;
}) => {
  return (
    <>
      <a className={klass + 'Item-dragBar'}>
        <Icon icon="drag-bar" className="icon" />
      </a>
      <span className={klass + 'Item-content'}>{props.children}</span>
      <span
        className={klass + 'Item-close'}
        onClick={e => props.handleDelete(props.index, e)}
      >
        <Icon icon="status-close" className="icon" />
      </span>
    </>
  );
};

const klass = 'ae-DateShortCutControl';

export class DateShortCutControl extends React.PureComponent<
  DateShortCutControlProps,
  DateShortCutControlState
> {
  sortable?: Sortable;
  drag?: HTMLElement | null;
  target: HTMLElement | null;
  certainDropDownOptions: Array<Option>;
  modifyDropDownOptions: Array<Option>;

  static defaultProps: Partial<DateShortCutControlProps> = {
    label: '快捷键'
  };

  constructor(props: DateShortCutControlProps) {
    super(props);

    // 初始化下拉选项
    const {certainOptions, modifyOptions, data} = props;
    this.certainDropDownOptions = certainOptions.map(key => ({
      label: CertainPresetShorcut[key],
      value: key
    }));
    this.modifyDropDownOptions = modifyOptions.map(key => ({
      label: ModifyPresetShorcut[key],
      value: key
    }));

    // 初始化原始组件配置的快捷键
    /** amis 3.1.0之后ranges属性废弃，此处兼容 */
    let initData = data?.ranges ?? data?.shortcuts ?? DefaultValue;
    initData = Array.isArray(initData) ? initData : initData.split(',');

    this.state = {
      options: initData
        .map((item: PresetShorCutType | CustomShortCutType) => {
          if (!item) {
            return null;
          }

          // 完全自定义的快捷键
          if (
            typeof item != 'string' &&
            item.label &&
            item.startDate &&
            item.endDate
          ) {
            return {
              type: OptionType.Custom,
              data: item
            };
          }

          // amis中提供的可灵活配置数字的自定义快捷键
          const arr = (item as string).match(/^([a-zA-Z]*)(\d+)([a-zA-Z]*)$/);
          if (arr) {
            return {
              data: {
                value: arr[2],
                key: `${arr[1]}$${arr[3]}`
              },
              type: OptionType.Modify
            };
          }

          // 固定值的快捷键
          return {
            data: item,
            type: OptionType.Certain
          };
        })
        .filter(Boolean)
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
          if (e.oldIndex < parent.childNodes.length - 1) {
            parent.insertBefore(
              e.item,
              parent.childNodes[
                e.oldIndex > e.newIndex ? e.oldIndex + 1 : e.oldIndex
              ]
            );
          } else {
            parent.appendChild(e.item);
          }

          const options = this.state.options.concat();
          // options[e.oldIndex] = options.splice(
          //   e.newIndex,
          //   1,
          //   options[e.oldIndex]
          // )[0];
          options.splice(e.newIndex, 0, options.splice(e.oldIndex, 1)[0]);
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
   * 生成快捷键项的配置
   */
  renderOption(option: OptionDataType, index: number) {
    const {render, data: schema} = this.props;

    if (option.type === OptionType.Certain) {
      return (
        <span className={klass + 'Item-content-label'}>
          {
            CertainPresetShorcut[
              option.data as keyof typeof CertainPresetShorcut
            ]
          }
        </span>
      );
    }

    if (option.type === OptionType.Custom) {
      const data = option?.data as CustomShortCutType;
      return render(
        'inner',
        {
          type: 'form',
          wrapWithPanel: false,
          body: [
            {
              type: 'input-text',
              mode: 'normal',
              placeholder: '快捷键名称',
              name: 'label'
            },
            getSchemaTpl('valueFormula', {
              name: 'startDate',
              header: '表达式或相对值',
              DateTimeType: FormulaDateType.IsDate,
              rendererSchema: {
                ...schema,
                type: 'input-date'
              },
              placeholder: '开始时间',
              needDeleteProps: [
                'ranges',
                'shortcuts',
                'maxDate',
                'id',
                'minDuration'
              ],
              label: false
            }),
            getSchemaTpl('valueFormula', {
              name: 'endDate',
              header: '表达式或相对值',
              DateTimeType: FormulaDateType.IsDate,
              rendererSchema: {
                ...schema,
                type: 'input-date'
              },
              placeholder: '结束时间',
              needDeleteProps: [
                'ranges',
                'shortcuts',
                'maxDate',
                'id',
                'minDuration'
              ],
              label: false
            })
          ],
          onChange: (value: CustomShortCutType) => {
            this.handleOptionChange(value, index);
          }
        },
        {
          data
        }
      );
    }

    const key = (option.data as ModifyOptionType)
      .key as keyof typeof ModifyPresetShorcut;

    const label = ModifyPresetShorcut[key]?.split('n') || [];

    return render(
      'inner',
      {
        type: 'form',
        wrapWithPanel: false,
        body: [
          {
            name: 'value',
            type: 'input-text',
            prefix: label[0] || undefined,
            suffix: label[1] || undefined,
            mode: 'normal',
            placeholder: 'n'
          }
        ],
        onChange: (value: ModifyOptionType) =>
          this.handleOptionChange(value, index)
      },
      {
        data: option.data
      }
    );
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
            {options.map((option, index) => (
              <li className={klass + 'Item'} key={index}>
                <ShortCutItemWrap
                  index={index}
                  handleDelete={this.handleDelete}
                >
                  {this.renderOption(option, index)}
                </ShortCutItemWrap>
              </li>
            ))}
          </ul>
        ) : (
          <div className={klass + '-content ' + klass + '-empty'}>未配置</div>
        )}
      </div>
    );
  }

  /**
   * 自定义跨度变化
   */
  handleOptionChange(
    data: string | CustomShortCutType | ModifyOptionType,
    index: number
  ) {
    const options = [...this.state.options];
    options[index].data = data;
    this.setState({options}, () => this.onChangeOptions());
  }

  /**
   * option添加
   */
  addItem(item: Option, type: OptionType) {
    this.setState(
      {
        options: this.state.options.concat({
          type,
          data:
            type === OptionType.Certain
              ? item.value
              : type === OptionType.Modify
              ? {key: item.value, value: undefined}
              : {label: undefined, startDate: undefined, endDate: undefined}
        })
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
    const {onBulkChange, name} = this.props;
    const newRanges: Array<string | CustomShortCutType> = [];

    options.forEach(item => {
      if (item.type === OptionType.Certain) {
        newRanges.push(item.data as string);
      }

      if (item.type === OptionType.Modify) {
        let data = item.data as ModifyOptionType;
        let value = data.value;
        /^\d+$/.test(value) && newRanges.push(data.key.replace('$', value));
      }

      if (item.type === OptionType.Custom) {
        let data = item.data as CustomShortCutType;
        data.label &&
          data.startDate &&
          data.endDate &&
          newRanges.push({...data});
      }
    });

    /** amis 3.1.0之后ranges属性废弃 */
    onBulkChange &&
      onBulkChange({[name ?? 'shortcuts']: newRanges, ranges: undefined});
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
                buttons: this.certainDropDownOptions.map((item: any) => ({
                  ...item,
                  type: 'button',
                  onAction: (e: React.MouseEvent, action: any) =>
                    this.addItem(item, OptionType.Certain)
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
                buttons: this.modifyDropDownOptions
                  .map((item: any) => ({
                    ...item,
                    type: 'button',
                    onAction: (e: React.MouseEvent, action: any) =>
                      this.addItem(item, OptionType.Modify)
                  }))
                  .concat([
                    {
                      type: 'button',
                      label: '其他',
                      onAction: (e: React.MouseEvent, action: any) =>
                        this.addItem(
                          {
                            value: {
                              label: undefined,
                              startDate: undefined,
                              endData: undefined
                            }
                          },
                          OptionType.Custom
                        )
                    }
                  ])
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
