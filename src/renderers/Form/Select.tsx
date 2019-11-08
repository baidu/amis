import React from 'react';
import cx from 'classnames';
import {OptionsControl, OptionsControlProps, Option} from './Options';
import Select from '../../components/Select';
import find = require('lodash/find');
import debouce = require('lodash/debounce');
import {Api} from '../../types';
import {isEffectiveApi} from '../../utils/api';
import {isEmpty, createObject} from '../../utils/helper';
import {dataMapping} from '../../utils/tpl-builtin';

export interface SelectProps extends OptionsControlProps {
  autoComplete?: Api;
  searchable?: boolean;
}

export default class SelectControl extends React.Component<SelectProps, any> {
  static defaultProps: Partial<SelectProps> = {
    clearable: false,
    searchable: false
  };

  input: any;
  cache: {
    [propName: string]: any;
  } = {};
  constructor(props: SelectProps) {
    super(props);

    this.changeValue = this.changeValue.bind(this);
    this.loadRemote = debouce(this.loadRemote.bind(this), 250, {
      trailing: true,
      leading: false
    });
    this.inputRef = this.inputRef.bind(this);
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
      options,
      autoFill,
      onBulkChange
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

    const sendTo =
      !multiple &&
      autoFill &&
      !isEmpty(autoFill) &&
      dataMapping(autoFill, value as Option);
    sendTo && onBulkChange(sendTo);
    onChange(newValue);
  }

  loadRemote(input: string) {
    const {autoComplete, env, data, setOptions, setLoading} = this.props;

    if (!env || !env.fetcher) {
      throw new Error('fetcher is required');
    }

    if (this.cache[input] || ~input.indexOf("'") /*中文没输完 233*/) {
      let options = this.cache[input] || [];
      let combinedOptions = this.mergeOptions(options);
      setOptions(combinedOptions);

      return Promise.resolve({
        options: combinedOptions
      });
    }

    setLoading(true);
    return (
      isEffectiveApi(autoComplete, data) &&
      env
        .fetcher(
          autoComplete,
          createObject(data, {
            term: input,
            value: input
          })
        )
        .then(ret => {
          let options =
            (ret.data && (ret.data as any).options) || ret.data || [];
          this.cache[input] = options;
          let combinedOptions = this.mergeOptions(options);
          setOptions(combinedOptions);

          return Promise.resolve({
            options: combinedOptions
          });
        })
        .finally(() => setLoading(false))
    );
  }

  mergeOptions(options: Array<object>) {
    const {selectedOptions} = this.props;
    let combinedOptions = options.concat();

    if (Array.isArray(selectedOptions) && selectedOptions.length) {
      selectedOptions.forEach(option => {
        if (
          !find(combinedOptions, (item: Option) => item.value == option.value)
        ) {
          combinedOptions.push(option);
        }
      });
    }
    return combinedOptions;
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
      ...rest
    } = this.props;

    if (noResultsText && /<\w+/.test(noResultsText)) {
      noResultsText = render('noResultText', noResultsText);
    }

    return (
      <div className={cx(`${classPrefix}SelectControl`, className)}>
        <Select
          {...rest}
          placeholder={placeholder}
          multiple={multiple || multi}
          ref={this.inputRef}
          value={selectedOptions}
          options={options}
          loadOptions={
            isEffectiveApi(autoComplete) ? this.loadRemote : undefined
          }
          creatable={creatable}
          searchable={searchable || !!autoComplete}
          onChange={this.changeValue}
          loading={loading}
          noResultsText={noResultsText}
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
