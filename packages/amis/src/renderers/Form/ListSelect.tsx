import React from 'react';
import {
  OptionsControl,
  OptionsControlProps,
  Option,
  FormOptionsControl,
  getVariable,
  filter
} from 'amis-core';
import {ActionObject, Schema} from 'amis-core';
import {createObject, isEmpty} from 'amis-core';
import {
  FormOptionsSchema,
  SchemaClassName,
  SchemaCollection
} from '../../Schema';
import {supportStatic} from './StaticHoc';

/**
 * List 复选框
 * 文档：https://aisuda.bce.baidu.com/amis/zh-CN/components/form/list
 */
export interface ListControlSchema extends FormOptionsSchema {
  type: 'list-select';

  /**
   * 开启双击点选并提交。
   */
  submitOnDBClick?: boolean;

  /**
   * 图片div类名
   */
  imageClassName?: string;

  /**
   * 可以自定义展示模板。
   */
  itemSchema?: SchemaCollection;

  /**
   * 激活态自定义展示模板。
   */
  activeItemSchema?: SchemaCollection;

  /**
   * 支持配置 list div 的 css 类名。
   * 比如：flex justify-between
   */
  listClassName?: SchemaClassName;
}

export interface ListProps
  extends OptionsControlProps,
    Omit<
      ListControlSchema,
      | 'type'
      | 'options'
      | 'className'
      | 'descriptionClassName'
      | 'inputClassName'
    > {}

export default class ListControl extends React.Component<ListProps, any> {
  static propsList = ['itemSchema', 'value', 'renderFormItems'];
  static defaultProps = {
    clearable: false,
    imageClassName: '',
    submitOnDBClick: false
  };

  doAction(action: ActionObject, data: object, throwErrors: boolean) {
    const {resetValue, onChange, formStore, store, name} = this.props;
    const actionType = action?.actionType as string;

    if (actionType === 'clear') {
      onChange?.('');
    } else if (actionType === 'reset') {
      const pristineVal =
        getVariable(formStore?.pristine ?? store?.pristine, name) ?? resetValue;
      onChange?.(pristineVal ?? '');
    }
  }

  handleDBClick(option: Option, e: React.MouseEvent<HTMLElement>) {
    this.props.onToggle(option, false, true);
    this.props.onAction(null, {
      type: 'submit'
    });
  }

  handleClick(option: Option, e: React.MouseEvent<HTMLElement>) {
    if (e.target && (e.target as HTMLElement).closest('a,button')) {
      return;
    }

    const {onToggle} = this.props;

    onToggle(option);
  }

  reload(subpath?: string, query?: any) {
    const reload = this.props.reloadOptions;
    reload && reload(subpath, query);
  }

  renderStatic(displayValue = '-') {
    const {
      itemSchema,
      labelField,
      valueField,
      imageClassName,
      itemClassName,
      selectedOptions,
      classnames: cx,
      render,
      data
    } = this.props;

    if (!selectedOptions.length) {
      return displayValue;
    }

    const itemRender = (option: Option, key: number) => {
      let label = option[labelField || 'label'];
      label = label || `选项${key + 1}`;
      if (itemSchema || option.body || option.image) {
        return (
          <div
            key={key}
            className={cx('ListControl-static-item', itemClassName)}
          >
            {itemSchema
              ? render(`${key}/body`, itemSchema, {
                  data: createObject(data, option)
                })
              : option.body
              ? render(`${key}/body`, option.body)
              : [
                  option.image ? (
                    <div
                      key="image"
                      className={cx('ListControl-itemImage', imageClassName)}
                    >
                      <img src={option.image} alt={label} />
                    </div>
                  ) : null,
                  <div key="label" className={cx('ListControl-itemLabel')}>
                    {label}
                  </div>
                ]}
          </div>
        );
      }

      return (
        <div key={key} className={cx(`ListControl-static-item`)}>
          {label}
        </div>
      );
    };

    return (
      <div className={cx('StaticList')}>{selectedOptions.map(itemRender)}</div>
    );
  }

  @supportStatic()
  render() {
    const {
      render,
      itemClassName,
      classnames: cx,
      className,
      style,
      disabled,
      options,
      placeholder,
      selectedOptions,
      imageClassName,
      submitOnDBClick,
      itemSchema,
      activeItemSchema,
      data,
      labelField,
      listClassName,
      translate: __,
      testIdBuilder
    } = this.props;

    let body: JSX.Element | null = null;

    if (options && options.length) {
      body = (
        <div className={cx('ListControl-items', listClassName)}>
          {options.map((option, key) => (
            <div
              key={key}
              className={cx(`ListControl-item`, itemClassName, {
                'is-active': ~selectedOptions.indexOf(option),
                'is-disabled': option.disabled || disabled,
                'is-custom': !!itemSchema
              })}
              onClick={this.handleClick.bind(this, option)}
              onDoubleClick={
                submitOnDBClick
                  ? this.handleDBClick.bind(this, option)
                  : undefined
              }
              {...testIdBuilder
                ?.getChild(`options-${option.value || key}`)
                .getTestId()}
            >
              {itemSchema
                ? render(
                    `${key}/body`,
                    ~selectedOptions.indexOf(option)
                      ? activeItemSchema ?? itemSchema
                      : itemSchema,
                    {
                      data: createObject(data, option)
                    }
                  )
                : option.body
                ? render(`${key}/body`, option.body)
                : [
                    option.image ? (
                      <div
                        key="image"
                        className={cx('ListControl-itemImage', imageClassName)}
                      >
                        <img
                          src={option.image}
                          alt={option[labelField || 'label']}
                        />
                      </div>
                    ) : null,
                    option[labelField || 'label'] ? (
                      <div key="label" className={cx('ListControl-itemLabel')}>
                        {filter(String(option[labelField || 'label']), data)}
                      </div>
                    ) : null
                    // {/* {option.tip ? (<div className={`${ns}ListControl-tip`}>{option.tip}</div>) : null} */}
                  ]}
            </div>
          ))}
        </div>
      );
    }

    return (
      <div className={cx('ListControl', className)}>
        {body ? (
          body
        ) : (
          <span className={cx('ListControl-placeholder')}>
            {__(placeholder)}
          </span>
        )}
      </div>
    );
  }
}

@OptionsControl({
  type: 'list-select',
  sizeMutable: false
})
export class ListControlRenderer extends ListControl {}
