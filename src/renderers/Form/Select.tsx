import React from 'react';
import cx from 'classnames';
import {
  OptionsControl,
  OptionsControlProps,
  Option,
  FormOptionsControl
} from './Options';
import Select, {normalizeOptions} from '../../components/Select';
import find from 'lodash/find';
import debouce from 'lodash/debounce';
import {Api} from '../../types';
import {isEffectiveApi} from '../../utils/api';
import {isEmpty, createObject, autobind} from '../../utils/helper';
import {dataMapping} from '../../utils/tpl-builtin';
import {SchemaApi} from '../../Schema';

/**
 * Select 下拉选择框。
 * 文档：https://baidu.gitee.io/amis/docs/components/form/select
 */
export interface SelectControlSchema extends FormOptionsControl {
  type: 'select' | 'multi-select';

  /**
   * 自动完成 API，当输入部分文字的时候，会将这些文字通过 ${term} 可以取到，发送给接口。
   * 接口可以返回匹配到的选项，帮助用户输入。
   */
  autoComplete?: SchemaApi;

  /**
   * 是否可以搜索值
   */
  searchable?: boolean;

  /**
   * 可以自定义菜单展示。
   */
  menuTpl?: string;

  /**
   * 边框模式，全边框，还是半边框，或者没边框。
   */
  borderMode?: 'full' | 'half' | 'none';
}

export interface SelectProps extends OptionsControlProps {
  autoComplete?: Api;
  searchable?: boolean;
  defaultOpen?: boolean;
}

export default class SelectControl extends React.Component<SelectProps, any> {
  static defaultProps: Partial<SelectProps> = {
    clearable: false,
    searchable: false,
    multiple: false
  };

  input: any;
  unHook: Function;
  lazyloadRemote: Function;
  constructor(props: SelectProps) {
    super(props);

    this.changeValue = this.changeValue.bind(this);
    this.lazyloadRemote = debouce(this.loadRemote.bind(this), 250, {
      trailing: true,
      leading: false
    });
    this.inputRef = this.inputRef.bind(this);
  }

  componentWillUnmount() {
    this.unHook && this.unHook();
  }

  inputRef(ref: any) {
    this.input = ref;
  }

  foucs() {
    this.input && this.input.focus();
  }

  changeValue(value: Option | Array<Option> | void) {
    const {
      joinValues,
      extractValue,
      delimiter,
      multiple,
      type,
      valueField,
      onChange,
      setOptions,
      options
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
          : [''];
      } else {
        newValue = newValue ? (newValue as Option)[valueField || 'value'] : '';
      }
    }

    // 不设置没法回显
    additonalOptions.length && setOptions(options.concat(additonalOptions));

    onChange(newValue);
  }

  async loadRemote(input: string) {
    const {
      autoComplete,
      env,
      data,
      setOptions,
      setLoading,
      formInited,
      addHook
    } = this.props;

    if (!env || !env.fetcher) {
      throw new Error('fetcher is required');
    }

    if (!formInited) {
      this.unHook && this.unHook();
      return (this.unHook = addHook(this.loadRemote.bind(this, input), 'init'));
    }

    const ctx = createObject(data, {
      term: input,
      value: input
    });

    if (!isEffectiveApi(autoComplete, ctx)) {
      return Promise.resolve({
        options: []
      });
    }

    setLoading(true);
    try {
      const ret = await env.fetcher(autoComplete, ctx);

      let options = (ret.data && (ret.data as any).options) || ret.data || [];
      let combinedOptions = this.mergeOptions(options);
      setOptions(combinedOptions);

      return {
        options: combinedOptions
      };
    } finally {
      setLoading(false);
    }
  }

  mergeOptions(options: Array<object>) {
    const {selectedOptions} = this.props;
    let combinedOptions = normalizeOptions(options).concat();

    if (Array.isArray(selectedOptions) && selectedOptions.length) {
      selectedOptions.forEach(option => {
        if (
          !find(combinedOptions, (item: Option) => item.value == option.value)
        ) {
          combinedOptions.push({
            ...option,
            hidden: true
          });
        }
      });
    }
    return combinedOptions;
  }

  @autobind
  renderMenu(option: Option, state: any) {
    const {menuTpl, render, data} = this.props;

    return render(`menu/${state.index}`, menuTpl, {
      data: createObject(createObject(data, state), option)
    });
  }

  reload() {
    const reload = this.props.reloadOptions;
    reload && reload();
  }

  render() {
    let {
      autoComplete,
      searchable,
      options,
      className,
      loading,
      value,
      selectedOptions,
      multi,
      multiple,
      placeholder,
      id,
      classPrefix,
      classnames,
      creatable,
      inline,
      noResultsText,
      render,
      menuTpl,
      borderMode,
      ...rest
    } = this.props;

    if (noResultsText) {
      noResultsText = render('noResultText', noResultsText);
    }

    return (
      <div className={cx(`${classPrefix}SelectControl`, className)}>
        <Select
          {...rest}
          borderMode={borderMode}
          placeholder={placeholder}
          multiple={multiple || multi}
          ref={this.inputRef}
          value={selectedOptions}
          options={options}
          loadOptions={
            isEffectiveApi(autoComplete) ? this.lazyloadRemote : undefined
          }
          creatable={creatable}
          searchable={searchable || !!autoComplete}
          onChange={this.changeValue}
          loading={loading}
          noResultsText={noResultsText}
          renderMenu={menuTpl ? this.renderMenu : undefined}
        />
      </div>
    );
  }
}

@OptionsControl({
  type: 'select'
})
export class SelectControlRenderer extends SelectControl {}

@OptionsControl({
  type: 'multi-select'
})
export class MultiSelectControlRenderer extends SelectControl {
  static defaultProps = {
    multiple: true
  };
}
