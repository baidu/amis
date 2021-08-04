import React from 'react';
import cx from 'classnames';
import {
  OptionsControl,
  OptionsControlProps,
  Option,
  FormOptionsControl
} from './Options';
import Select from '../../components/Select';
import {Api} from '../../types';
import {isEffectiveApi} from '../../utils/api';
import {SchemaApi} from '../../Schema';

/**
 * 级联选择框
 * 文档：https://baidu.gitee.io/amis/docs/components/form/chained-select
 */
export interface ChainedSelectControlSchema extends FormOptionsControl {
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

  loadMore() {
    const {
      value,
      delimiter,
      onChange,
      joinValues,
      extractValue,
      source,
      data,
      env
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
          .then(ret => {
            // todo 没有检测 response.ok

            const stack = this.state.stack.concat();
            const remoteValue = ret.data ? ret.data.value : undefined;
            let options = (ret.data && (ret.data as any).options) || ret.data;

            stack.splice(idx, stack.length - idx);

            if (typeof remoteValue !== 'undefined') {
              arr.splice(idx + 1, value.length - idx - 1);
              arr.push(remoteValue);
              onChange(joinValues ? arr.join(delimiter || ',') : arr);
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

  handleChange(index: number, currentValue: any) {
    const {value, delimiter, onChange, joinValues, extractValue} = this.props;

    const arr = Array.isArray(value)
      ? value.concat()
      : value && typeof value === 'string'
      ? value.split(delimiter || ',')
      : [];
    arr.splice(index, arr.length - index);
    arr.push(joinValues ? currentValue.value : currentValue);

    onChange(
      joinValues
        ? arr.join(delimiter || ',')
        : extractValue
        ? arr.map(item => item.value || item)
        : arr
    );
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
      ...rest
    } = this.props;
    const arr = Array.isArray(value)
      ? value.concat()
      : value && typeof value === 'string'
      ? value.split(delimiter || ',')
      : [];

    return (
      <div className={cx(`${ns}ChainedSelectControl`, className)}>
        <Select
          {...rest}
          classPrefix={ns}
          key="base"
          options={options}
          value={arr[0]}
          onChange={this.handleChange.bind(this, 0)}
          loading={loading}
          inline
        />

        {this.state.stack.map(({options, loading, visible}, index) =>
          visible === false ? null : (
            <Select
              {...rest}
              classPrefix={ns}
              key={`x-${index + 1}`}
              options={options}
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
