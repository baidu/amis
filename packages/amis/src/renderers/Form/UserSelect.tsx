import React from 'react';
import cx from 'classnames';
import {
  OptionsControl,
  OptionsControlProps,
  Option,
  FormOptionsControl,
  resolveEventData
} from 'amis-core';
import {SpinnerExtraProps, UserSelect} from 'amis-ui';
import {UserTabSelect} from 'amis-ui';
import {isEffectiveApi} from 'amis-core';
import find from 'lodash/find';
import {createObject, autobind} from 'amis-core';
import {PlainObject} from 'amis-core';
import {FormOptionsSchema} from '../../Schema';
import {supportStatic} from './StaticHoc';

/**
 * UserSelect 移动端人员选择。
 */
export interface UserSelectControlSchema extends FormOptionsSchema {
  type: 'users-select';
}

export interface UserSelectProps
  extends OptionsControlProps,
    SpinnerExtraProps {
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
  /**
   * 选项卡模式
   */
  tabMode?: boolean;
  tabOptions?: Array<any>;
  /**
   * 搜索字段
   */
  searchTerm?: string;
  /**
   * 搜索携带的额外参数
   */
  searchParam?: PlainObject;
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
  async onSearch(input: string, cancelExecutor: Function, param?: PlainObject) {
    let {searchApi, setLoading, env} = this.props;
    searchApi = param?.searchApi || searchApi;
    let searchTerm = param?.searchTerm || this.props.searchTerm || 'term';
    let searchObj = param?.searchParam || this.props.searchParam || {};

    const ctx = {
      [searchTerm]: input,
      ...searchObj
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
  async deferLoad(data?: Object, isRef?: boolean, param?: PlainObject) {
    let {env, deferApi, setLoading, formInited, addHook} = this.props;

    deferApi = param?.deferApi || deferApi;

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
      resolveEventData(this.props, {
        value: newValue,
        options,
        items: options // 为了保持名字统一
      })
    );
    if (rendererEvent?.prevented) {
      return;
    }

    onChange(newValue);
  }

  renderStatic() {
    const {selectedOptions, labelField = 'label', classnames: cx} = this.props;
    if (labelField === 'avatar') {
      return selectedOptions.map((item: Option, index: number) => (
        <img
          key={index}
          className={cx('UserSelect-avatar-img')}
          src={item[labelField]}
          alt=""
        />
      ));
    }
    return selectedOptions.map((item: Option) => item[labelField]).join(',');
  }

  @supportStatic()
  render() {
    let {
      showNav,
      navTitle,
      searchable,
      options,
      className,
      style,
      selectedOptions,
      tabOptions,
      multi,
      multiple,
      isDep,
      isRef,
      placeholder,
      searchPlaceholder,
      tabMode,
      data,
      displayFields,
      labelField,
      loadingConfig
    } = this.props;
    tabOptions?.forEach((item: any) => {
      item.deferLoad = this.deferLoad;
      item.onChange = this.changeValue;
      item.onSearch = this.onSearch;
    });

    return (
      <div className={cx(`UserSelectControl`, className)}>
        {tabMode ? (
          <UserTabSelect
            selection={selectedOptions}
            tabOptions={tabOptions}
            multiple={multiple}
            onChange={this.changeValue}
            onSearch={this.onSearch}
            deferLoad={this.deferLoad}
            data={data}
          />
        ) : (
          <UserSelect
            loadingConfig={loadingConfig}
            showNav={showNav}
            navTitle={navTitle}
            selection={selectedOptions}
            options={options}
            multi={multi}
            multiple={multiple}
            searchable={searchable}
            placeholder={placeholder}
            searchPlaceholder={searchPlaceholder}
            deferLoad={this.deferLoad}
            onChange={this.changeValue}
            onSearch={this.onSearch}
            displayFields={displayFields}
            labelField={labelField}
            isDep={isDep}
            isRef={isRef}
          />
        )}
      </div>
    );
  }
}

@OptionsControl({
  type: 'users-select'
})
export class UserSelectControlRenderer extends UserSelectControl {}
