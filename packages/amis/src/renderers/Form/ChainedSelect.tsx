import React from 'react';
import cx from 'classnames';
import {
  OptionsControl,
  OptionsControlProps,
  Option,
  FormOptionsControl,
  resolveEventData
} from 'amis-core';
import {Select} from 'amis-ui';
import {Api} from 'amis-core';
import {isEffectiveApi} from 'amis-core';
import {isMobile, createObject} from 'amis-core';
import {ActionObject} from 'amis-core';
import {FormOptionsSchema} from '../../Schema';

/**
 * 链式下拉框
 * 文档：https://baidu.gitee.io/amis/docs/components/form/chained-select
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

export interface SelectState {
  stack: Array<{
    options: Array<Option>;
    parentId: any;
    loading: boolean;
    visible?: boolean;
  }>;
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
                resolveEventData(this.props, {value: valueRes}, 'value')
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
              visible: !!options
            });

            this.setState(
              {
                stack: stack
              },
              this.loadMore
            );
          })
          .catch(e => {
            env.notify('error', e.message);
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
      resolveEventData(this.props, {value: valueRes}, 'value')
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

  render() {
    const {
      options,
      classPrefix: ns,
      className,
      inline,
      loading,
      value,
      delimiter,
      joinValues,
      extractValue,
      multiple,
      useMobileUI,
      env,
      ...rest
    } = this.props;
    const arr = Array.isArray(value)
      ? value.concat()
      : value && typeof value === 'string'
      ? value.split(delimiter || ',')
      : [];

    const mobileUI = useMobileUI && isMobile();
    return (
      <div className={cx(`${ns}ChainedSelectControl`, className)}>
        <Select
          {...rest}
          useMobileUI={useMobileUI}
          popOverContainer={
            mobileUI && env && env.getModalContainer
              ? env.getModalContainer
              : rest.popOverContainer
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
          visible === false ? null : (
            <Select
              {...rest}
              useMobileUI={useMobileUI}
              popOverContainer={
                mobileUI && env && env.getModalContainer
                  ? env.getModalContainer
                  : rest.popOverContainer
              }
              classPrefix={ns}
              key={`x-${index + 1}`}
              options={Array.isArray(options) ? options : []}
              value={arr[index + 1]}
              onChange={this.handleChange.bind(this, index + 1)}
              loading={loading}
              inline
            />
          )
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
