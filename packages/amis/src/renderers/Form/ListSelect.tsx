import React from 'react';
import {
  OptionsControl,
  OptionsControlProps,
  Option,
  FormOptionsControl
} from 'amis-core';
import {ActionObject, Schema} from 'amis-core';
import {createObject, isEmpty} from 'amis-core';
import {SchemaClassName, SchemaCollection} from '../../Schema';

/**
 * List 复选框
 * 文档：https://baidu.gitee.io/amis/docs/components/form/list
 */
export interface ListControlSchema extends FormOptionsControl {
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
    const {resetValue, onChange} = this.props;
    const actionType = action?.actionType as string;

    if (actionType === 'clear') {
      onChange?.('');
    } else if (actionType === 'reset') {
      onChange?.(resetValue ?? '');
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

  reload() {
    const reload = this.props.reloadOptions;
    reload && reload();
  }

  render() {
    const {
      render,
      itemClassName,
      classnames: cx,
      className,
      disabled,
      options,
      placeholder,
      selectedOptions,
      imageClassName,
      submitOnDBClick,
      itemSchema,
      data,
      labelField,
      listClassName,
      translate: __
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
                'is-disabled': option.disabled || disabled
              })}
              onClick={this.handleClick.bind(this, option)}
              onDoubleClick={
                submitOnDBClick
                  ? this.handleDBClick.bind(this, option)
                  : undefined
              }
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
                        <img
                          src={option.image}
                          alt={option[labelField || 'label']}
                        />
                      </div>
                    ) : null,
                    option[labelField || 'label'] ? (
                      <div key="label" className={cx('ListControl-itemLabel')}>
                        {String(option[labelField || 'label'])}
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
