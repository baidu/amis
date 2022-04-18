import React from 'react';
import cx from 'classnames';
import {
  OptionsControl,
  OptionsControlProps,
  Option,
  FormOptionsControl
} from './Options';
import UserSelect from '../../components/UserSelect';
import {isEffectiveApi} from '../../utils/api';
import find from 'lodash/find';
import {createObject, autobind} from '../../utils/helper';

/**
 * UserSelect 移动端人员选择。
 */
export interface UserSelectControlSchema extends FormOptionsControl {
  type: 'users-select';
}

export interface UserSelectProps extends OptionsControlProps {
  /**
   * 部门可选
   */
  isDep?: boolean;
  /**
   * 人员可选
   */
  isRef?: boolean;
  /**
   *
   */
  showNav?: boolean;
  /**
   * 导航头标题
   */
  navTitle?: string;
}

export default class UserSelectControl extends React.Component<
  UserSelectProps,
  any
> {
  static defaultProps: Partial<UserSelectProps> = {
    showNav: true
  };
  input?: HTMLInputElement;
  unHook: Function;
  lazyloadRemote: Function;

  constructor(props: UserSelectProps) {
    super(props);
  }

  componentWillUnmount() {
    this.unHook && this.unHook();
  }

  @autobind
  async onSearch(input: string, cancelExecutor: Function) {
    const {searchApi, setLoading, env} = this.props;
    const ctx = {
      term: input
    };

    if (!isEffectiveApi(searchApi, ctx)) {
      return Promise.resolve([]);
    }

    setLoading(true);
    try {
      const ret = await env.fetcher(searchApi, ctx, {
        cancelExecutor,
        autoAppend: true
      });
      let options = (ret.data && (ret.data as any).options) || ret.data || [];

      return options;
    } finally {
      setLoading(false);
    }
  }

  @autobind
  async deferLoad(data?: Object, isRef?: boolean) {
    const {env, deferApi, setLoading, formInited, addHook} = this.props;

    if (!env || !env.fetcher) {
      throw new Error('fetcher is required');
    }

    const ctx = createObject(data, {});

    if (!isEffectiveApi(deferApi, ctx)) {
      return Promise.resolve([]);
    }

    try {
      const ret = await env.fetcher(deferApi, ctx);

      let options = (ret.data && (ret.data as any).options) || ret.data || [];

      if (isRef) {
        options.forEach((option: Option) => {
          option.isRef = true;
        });
      }
      return options;
    } finally {
      setLoading(false);
    }
  }

  @autobind
  async changeValue(value: Option | Array<Option> | string | void) {
    const {
      joinValues,
      extractValue,
      delimiter,
      multiple,
      valueField,
      onChange,
      options,
      setOptions,
      data,
      dispatchEvent
    } = this.props;
    let newValue: string | Option | Array<Option> | void = value;
    let additonalOptions: Array<any> = [];

    (Array.isArray(value) ? value : value ? [value] : []).forEach(
      (option: any) => {
        let resolved = find(
          options,
          (item: any) =>
            item[valueField || 'value'] == option[valueField || 'value']
        );
        resolved || additonalOptions.push(option);
      }
    );

    if (joinValues) {
      if (multiple) {
        newValue = Array.isArray(value)
          ? (value
              .map(item => item[valueField || 'value'])
              .join(delimiter) as string)
          : value
          ? (value as Option)[valueField || 'value']
          : '';
      } else {
        newValue = newValue ? (newValue as Option)[valueField || 'value'] : '';
      }
    } else if (extractValue) {
      if (multiple) {
        newValue = Array.isArray(value)
          ? value.map(item => item[valueField || 'value'])
          : value
          ? [(value as Option)[valueField || 'value']]
          : [];
      } else {
        newValue = newValue ? (newValue as Option)[valueField || 'value'] : '';
      }
    }

    const rendererEvent = await dispatchEvent(
      'change',
      createObject(data, {
        value: newValue,
        options
      })
    );
    if (rendererEvent?.prevented) {
      return;
    }

    onChange(newValue);
  }

  render() {
    let {
      showNav,
      navTitle,
      searchable,
      options,
      className,
      selectedOptions,
      multi,
      multiple,
      isDep,
      isRef,
      placeholder,
      searchPlaceholder
    } = this.props;

    return (
      <div className={cx(`UserSelectControl`, className)}>
        <UserSelect
          showNav={showNav}
          navTitle={navTitle}
          value={selectedOptions}
          options={options}
          multi={multi}
          multiple={multiple}
          searchable={searchable}
          placeholder={placeholder}
          searchPlaceholder={searchPlaceholder}
          deferLoad={this.deferLoad}
          onChange={this.changeValue}
          onSearch={this.onSearch}
          isDep={isDep}
          isRef={isRef}
        />
      </div>
    );
  }
}

@OptionsControl({
  type: 'users-select'
})
export class UserSelectControlRenderer extends UserSelectControl {}
