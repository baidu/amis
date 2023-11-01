import React from 'react';
import cx from 'classnames';
import {
  OptionsControl,
  OptionsControlProps,
  Option,
  FormOptionsControl,
  resolveEventData
} from 'amis-core';
import {Select, Spinner} from 'amis-ui';
import {Api, ApiObject} from 'amis-core';
import {isEffectiveApi} from 'amis-core';
import {isMobile, createObject} from 'amis-core';
import {ActionObject} from 'amis-core';
import {FormOptionsSchema} from '../../Schema';
import {supportStatic} from './StaticHoc';
import find from 'lodash/find';
import isEmpty from 'lodash/isEmpty';

/**
 * 链式下拉框
 * 文档：https://aisuda.bce.baidu.com/amis/zh-CN/components/form/chained-select
 */
export interface ChainedSelectControlSchema extends FormOptionsSchema {
  type: 'chained-select';
}

export interface ChainedSelectProps
  extends OptionsControlProps,
    Omit<
      ChainedSelectControlSchema,
      | 'options'
      | 'type'
      | 'source'
      | 'className'
      | 'descriptionClassName'
      | 'inputClassName'
    > {}

export interface StackItem {
  options: Array<Option>;
  parentId: any;
  loading: boolean;
  visible?: boolean;
}

export interface SelectState {
  stack: Array<StackItem>;
}

export default class ChainedSelectControl extends React.Component<
  ChainedSelectProps,
  SelectState
> {
  static defaultProps: Partial<ChainedSelectProps> = {
    clearable: false,
    searchable: false,
    multiple: true
  };

  state: SelectState = {
    stack: []
  };
  constructor(props: ChainedSelectProps) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
    this.loadMore = this.loadMore.bind(this);
  }

  componentDidMount() {
    const {formInited} = this.props;

    formInited || !this.props.addHook
      ? this.loadMore()
      : this.props.addHook?.(this.loadMore, 'init');
  }

  componentDidUpdate(prevProps: ChainedSelectProps) {
    const props = this.props;

    if (prevProps.options !== props.options) {
      this.setState({
        stack: []
      });
    } else if (props.formInited && props.value !== prevProps.value) {
      this.loadMore();
    }
  }

  doAction(action: ActionObject, data: object, throwErrors: boolean) {
    const {resetValue, onChange} = this.props;
    const actionType = action?.actionType as string;

    if (actionType === 'clear') {
      onChange('');
    } else if (actionType === 'reset') {
      onChange(resetValue ?? '');
    }
  }

  array2value(arr: Array<any>, isExtracted: boolean = false) {
    const {delimiter, joinValues, extractValue} = this.props;
    // 判断arr的项是否已抽取
    return isExtracted
      ? joinValues
        ? arr.join(delimiter || ',')
        : arr
      : joinValues
      ? arr.join(delimiter || ',')
      : extractValue
      ? arr.map(item => item.value || item)
      : arr;
  }

  loadMore() {
    const {
      value,
      delimiter,
      onChange,
      joinValues,
      extractValue,
      source,
      data,
      env,
      dispatchEvent
    } = this.props;

    const arr = Array.isArray(value)
      ? value.concat()
      : value && typeof value === 'string'
      ? value.split(delimiter || ',')
      : [];
    let idx = 0;
    let len = this.state.stack.length;
    while (
      idx < len &&
      arr[idx] &&
      this.state.stack[idx].parentId ==
        (joinValues || extractValue ? arr[idx] : arr[idx].value)
    ) {
      idx++;
    }

    if (!arr[idx] || !env || !isEffectiveApi(source, data)) {
      return;
    }

    const parentId = joinValues || extractValue ? arr[idx] : arr[idx].value;
    const stack = this.state.stack.concat();
    stack.splice(idx, stack.length - idx);
    stack.push({
      parentId,
      loading: true,
      options: []
    });

    this.setState(
      {
        stack
      },
      () => {
        env
          .fetcher(source as Api, {
            ...data,
            value: arr,
            level: idx + 1,
            parentId,
            parent: arr[idx]
          })
          .then(async ret => {
            // todo 没有检测 response.ok

            const stack = this.state.stack.concat();
            const remoteValue = ret.data ? ret.data.value : undefined;
            let options =
              ret?.data?.options ||
              ret?.data?.items ||
              ret?.data?.rows ||
              ret.data ||
              [];

            stack.splice(idx, stack.length - idx);

            if (typeof remoteValue !== 'undefined') {
              arr.splice(idx + 1, value.length - idx - 1);
              arr.push(remoteValue);

              const valueRes = this.array2value(arr, true);

              const rendererEvent = await dispatchEvent(
                'change',
                resolveEventData(this.props, {value: valueRes})
              );

              if (rendererEvent?.prevented) {
                return;
              }

              onChange(valueRes);
            }

            stack.push({
              options,
              parentId,
              loading: false,
              visible: Array.isArray(options) && !isEmpty(options)
            });

            this.setState(
              {
                stack: stack
              },
              this.loadMore
            );
          })
          .catch(e => {
            !(source as ApiObject)?.silent && env.notify('error', e.message);
          });
      }
    );
  }

  async handleChange(index: number, currentValue: any) {
    const {
      value,
      delimiter,
      onChange,
      joinValues,
      extractValue,
      dispatchEvent,
      data
    } = this.props;

    const arr = Array.isArray(value)
      ? value.concat()
      : value && typeof value === 'string'
      ? value.split(delimiter || ',')
      : [];
    arr.splice(index, arr.length - index);
    arr.push(joinValues ? currentValue.value : currentValue);

    const valueRes = this.array2value(arr);

    const rendererEvent = await dispatchEvent(
      'change',
      resolveEventData(this.props, {value: valueRes})
    );

    if (rendererEvent?.prevented) {
      return;
    }

    onChange(valueRes);
  }

  reload() {
    const reload = this.props.reloadOptions;
    reload && reload();
  }

  renderStatic(displayValue = '-') {
    const {
      options = [],
      labelField = 'label',
      valueField = 'value',
      classPrefix,
      classnames: cx,
      className,
      value,
      delimiter
    } = this.props;

    const allOptions = [{options, visible: true}, ...(this.state.stack || [])];
    const valueArr = Array.isArray(value)
      ? value.concat()
      : value && typeof value === 'string'
      ? value.split(delimiter || ',')
      : [];

    if (valueArr?.length > 0) {
      displayValue = valueArr
        .map((value: any, index) => {
          const {options, visible} = allOptions[index] || {};
          if (visible === false) {
            return null;
          }
          if (!options || !options.length) {
            return value;
          }
          const selectedOption =
            find(options, o => value === o[valueField]) || {};
          return selectedOption[labelField] ?? value;
        })
        .filter(v => v != null)
        .join(' > ');
    }

    return (
      <div className={cx(`${classPrefix}SelectStaticControl`, className)}>
        {displayValue}
      </div>
    );
  }

  @supportStatic()
  render() {
    const {
      options,
      classPrefix: ns,
      className,
      style,
      inline,
      loading,
      value,
      delimiter,
      joinValues,
      extractValue,
      multiple,
      mobileUI,
      env,
      ...rest
    } = this.props;
    const arr = Array.isArray(value)
      ? value.concat()
      : value && typeof value === 'string'
      ? value.split(delimiter || ',')
      : [];

    const hasStackLoading = this.state.stack.find((a: StackItem) => a.loading);

    return (
      <div className={cx(`${ns}ChainedSelectControl`, className)}>
        <Select
          {...rest}
          mobileUI={mobileUI}
          popOverContainer={
            mobileUI
              ? env?.getModalContainer
              : rest.popOverContainer || env?.getModalContainer
          }
          classPrefix={ns}
          key="base"
          options={Array.isArray(options) ? options : []}
          value={arr[0]}
          onChange={this.handleChange.bind(this, 0)}
          loading={loading}
          inline
        />

        {this.state.stack.map(({options, loading, visible}, index) =>
          // loading 中的选项不展示，避免没值再隐藏造成的闪烁，改用一个 Spinner 来展示 loading 状态
          visible === false || loading ? null : (
            <Select
              {...rest}
              mobileUI={mobileUI}
              popOverContainer={
                mobileUI
                  ? env.getModalContainer
                  : rest.popOverContainer || env?.getModalContainer
              }
              classPrefix={ns}
              key={`x-${index + 1}`}
              options={Array.isArray(options) ? options : []}
              value={arr[index + 1]}
              onChange={this.handleChange.bind(this, index + 1)}
              inline
            />
          )
        )}

        {hasStackLoading && (
          <Spinner
            size="sm"
            className={cx(`${ns}ChainedSelectControl-spinner`)}
          />
        )}
      </div>
    );
  }
}

@OptionsControl({
  type: 'chained-select',
  sizeMutable: false
})
export class ChainedSelectControlRenderer extends ChainedSelectControl {}
