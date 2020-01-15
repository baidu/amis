import React from 'react';
import cx from 'classnames';
import Overlay from '../../components/Overlay';
import PopOver from '../../components/PopOver';

import {OptionsControl, OptionsControlProps, Option} from './Options';
import {Icon} from '../../components/icons';
import TreeSelector from '../../components/Tree';
// @ts-ignore
import matchSorter from 'match-sorter';
import debouce = require('lodash/debounce');
import find = require('lodash/find');
import {Api} from '../../types';
import {isEffectiveApi} from '../../utils/api';

export interface TreeSelectProps extends OptionsControlProps {
  placeholder?: any;
  autoComplete?: Api;
}

export interface TreeSelectState {
  isOpened: boolean;
  isFocused: boolean;
  inputValue: string;
}

export default class TreeSelectControl extends React.Component<
  TreeSelectProps,
  TreeSelectState
> {
  static defaultProps = {
    placeholder: '请选择',
    optionsPlaceholder: '暂无数据',
    multiple: false,
    clearable: true,
    rootLabel: '顶级',
    rootValue: '',
    showIcon: true,
    joinValues: true,
    extractValue: false,
    delimiter: ',',
    resetValue: '',
    spinnerClassName: 'fa fa-spinner fa-spin fa-1x fa-fw'
  };

  container: React.RefObject<HTMLDivElement>;
  target: React.RefObject<HTMLDivElement>;
  input: React.RefObject<HTMLInputElement> = React.createRef();

  cache: {
    [propName: string]: any;
  } = {};

  constructor(props: TreeSelectProps) {
    super(props);

    this.state = {
      inputValue: '',
      isOpened: false,
      isFocused: false
    };

    this.open = this.open.bind(this);
    this.close = this.close.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.clearValue = this.clearValue.bind(this);
    this.target = React.createRef();
    this.container = React.createRef();
    this.handleFocus = this.handleFocus.bind(this);
    this.handleBlur = this.handleBlur.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleInputKeyDown = this.handleInputKeyDown.bind(this);

    this.loadRemote = debouce(this.loadRemote.bind(this), 250, {
      trailing: true,
      leading: false
    });
  }

  componentDidMount() {
    this.loadRemote('');
  }

  open(fn?: () => void) {
    if (this.props.disabled) {
      return;
    }

    this.setState(
      {
        isOpened: true
      },
      fn
    );
  }

  close() {
    this.setState(
      {
        isOpened: false,
        inputValue: this.props.multiple ? this.state.inputValue : ''
      },
      () => this.loadRemote(this.state.inputValue)
    );
  }

  handleFocus() {
    this.setState({
      isFocused: true
    });
  }

  handleBlur() {
    this.setState({
      isFocused: false
    });
  }

  handleClick() {
    this.state.isOpened
      ? this.close()
      : this.open(() => this.input.current && this.input.current.focus());
  }

  handleKeyPress(e: React.KeyboardEvent) {
    if (e.key === ' ') {
      this.handleClick();
    }
  }

  validate(): any {
    const {value, minLength, maxLength, delimiter} = this.props;

    let curValue = Array.isArray(value)
      ? value
      : (value ? String(value) : '').split(delimiter || ',');
    if (minLength && curValue.length < minLength) {
      return `已选择数量低于设定的最小个数${minLength}，请选择更多的选项。`;
    } else if (maxLength && curValue.length > maxLength) {
      return `已选择数量超出设定的最大个数${maxLength}，请取消选择超出的选项。`;
    }
  }

  removeItem(index: number, e?: React.MouseEvent<HTMLElement>) {
    const {
      selectedOptions,
      joinValues,
      extractValue,
      delimiter,
      valueField,
      onChange,
      disabled
    } = this.props;

    e && e.stopPropagation();

    if (disabled) {
      return;
    }

    const items = selectedOptions.concat();
    items.splice(index, 1);

    let value: any = items;

    if (joinValues) {
      value = items
        .map((item: any) => item[valueField || 'value'])
        .join(delimiter || ',');
    } else if (extractValue) {
      value = items.map((item: any) => item[valueField || 'value']);
    }

    onChange(value);
  }

  handleChange(value: any) {
    const {onChange, multiple} = this.props;

    if (!multiple) {
      this.close();
    }

    multiple || !this.state.inputValue
      ? onChange(value)
      : this.setState(
          {
            inputValue: ''
          },
          () => onChange(value)
        );
  }

  handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const {autoComplete, data} = this.props;

    this.setState(
      {
        inputValue: e.currentTarget.value
      },
      isEffectiveApi(autoComplete, data)
        ? () => this.loadRemote(this.state.inputValue)
        : undefined
    );
  }

  handleInputKeyDown(event: React.KeyboardEvent) {
    const inputValue = this.state.inputValue;
    const {multiple, selectedOptions} = this.props;

    if (
      event.key === 'Backspace' &&
      !inputValue &&
      selectedOptions.length &&
      multiple
    ) {
      this.removeItem(selectedOptions.length - 1);
    }
  }

  clearValue() {
    const {onChange, resetValue} = this.props;

    onChange(typeof resetValue === 'undefined' ? '' : resetValue);
  }

  filterOptions(options: Array<Option>, keywords: string): Array<Option> {
    const {labelField, valueField} = this.props;

    return options.map(option => {
      option = {
        ...option
      };
      option.visible = !!matchSorter([option], keywords, {
        keys: [labelField || 'label', valueField || 'value']
      }).length;

      if (!option.visible && option.children) {
        option.children = this.filterOptions(option.children, keywords);
        const visibleCount = option.children.filter(item => item.visible)
          .length;
        option.visible = !!visibleCount;
      }

      option.visible && (option.collapsed = false);
      return option;
    });
  }

  loadRemote(input: string) {
    const {autoComplete, env, data, setOptions, setLoading} = this.props;

    if (!isEffectiveApi(autoComplete, data)) {
      return;
    } else if (!env || !env.fetcher) {
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
    return env
      .fetcher(autoComplete, {
        ...data,
        term: input,
        value: input
      })
      .then(ret => {
        let options = (ret.data && (ret.data as any).options) || ret.data || [];
        this.cache[input] = options;
        let combinedOptions = this.mergeOptions(options);
        setOptions(combinedOptions);

        return Promise.resolve({
          options: combinedOptions
        });
      })
      .finally(() => setLoading(false));
  }

  mergeOptions(options: Array<object>) {
    const {selectedOptions} = this.props;
    let combinedOptions = options.concat();

    if (Array.isArray(selectedOptions) && selectedOptions.length) {
      selectedOptions.forEach(option => {
        if (
          !find(combinedOptions, (item: Option) => item.value == option.value)
        ) {
          combinedOptions.push({
            ...option,
            visible: false
          });
        }
      });
    }
    return combinedOptions;
  }

  reload() {
    const reload = this.props.reloadOptions;
    reload && reload();
  }

  renderValues() {
    const {
      classPrefix: ns,
      selectedOptions,
      multiple,
      labelField,
      disabled,
      placeholder,
      classnames: cx
    } = this.props;

    if ((!multiple || !selectedOptions.length) && this.state.inputValue) {
      return null;
    }

    return selectedOptions.length ? (
      selectedOptions.map((item, index) =>
        multiple ? (
          <div
            key={index}
            className={cx(`TreeSelect-value`, {
              disabled
            })}
          >
            <span
              className={cx('TreeSelect-valueIcon')}
              onClick={this.removeItem.bind(this, index)}
            >
              ×
            </span>
            <span className={cx('TreeSelect-valueLabel')}>
              {item[labelField || 'label']}
            </span>
          </div>
        ) : (
          <div className={cx('TreeSelect-value')} key={index}>
            {item[labelField || 'label']}
          </div>
        )
      )
    ) : (
      <span key="placeholder" className={cx('TreeSelect-placeholder')}>
        {placeholder}
      </span>
    );
  }

  renderOuter() {
    const {
      value,
      disabled,
      joinValues,
      extractValue,
      delimiter,
      placeholder,
      options,
      multiple,
      valueField,
      initiallyOpen,
      unfoldedLevel,
      withChildren,
      rootLabel,
      cascade,
      rootValue,
      showIcon,
      showRadio,
      popOverContainer,
      onlyChildren,
      classPrefix: ns,
      optionsPlaceholder,
      searchable,
      autoComplete,
      maxLength,
      minLength
    } = this.props;

    let filtedOptions =
      !isEffectiveApi(autoComplete) && searchable && this.state.inputValue
        ? this.filterOptions(options, this.state.inputValue)
        : options;

    return (
      <Overlay
        container={popOverContainer || (() => this.container.current)}
        target={() => this.target.current}
        show
      >
        <PopOver
          classPrefix={ns}
          className={`${ns}TreeSelect-popover`}
          style={{
            minWidth: this.target.current
              ? this.target.current.offsetWidth
              : undefined
          }}
          onHide={this.close}
          overlay
        >
          <TreeSelector
            classPrefix={ns}
            onlyChildren={onlyChildren}
            valueField={valueField}
            disabled={disabled}
            onChange={this.handleChange}
            joinValues={joinValues}
            extractValue={extractValue}
            delimiter={delimiter}
            placeholder={optionsPlaceholder}
            options={filtedOptions}
            highlightTxt={this.state.inputValue}
            multiple={multiple}
            initiallyOpen={initiallyOpen}
            unfoldedLevel={unfoldedLevel}
            withChildren={withChildren}
            rootLabel={rootLabel}
            rootValue={rootValue}
            showIcon={showIcon}
            showRadio={showRadio}
            cascade={cascade}
            foldedField="collapsed"
            hideRoot
            value={value || ''}
            labelField="label"
            maxLength={maxLength}
            minLength={minLength}
          />
        </PopOver>
      </Overlay>
    );
  }

  render() {
    const {
      className,
      disabled,
      spinnerClassName,
      inline,
      loading,
      multiple,
      value,
      clearable,
      classPrefix: ns,
      classnames: cx,
      searchable,
      autoComplete,
      selectedOptions
    } = this.props;

    return (
      <div ref={this.container} className={cx(`TreeSelectControl`, className)}>
        <div
          tabIndex={0}
          onKeyPress={this.handleKeyPress}
          onFocus={this.handleFocus}
          onBlur={this.handleBlur}
          ref={this.target}
          className={cx(`TreeSelect`, {
            'TreeSelect--inline': inline,
            'TreeSelect--single': !multiple,
            'TreeSelect--multi': multiple,
            'TreeSelect--searchable':
              searchable || isEffectiveApi(autoComplete),
            'is-opened': this.state.isOpened,
            'is-focused': this.state.isFocused,
            'is-disabled': disabled
          })}
        >
          <div onClick={this.handleClick} className={cx('TreeSelect-input')}>
            <div className={cx('TreeSelect-valueWrap')}>
              {this.renderValues()}

              {searchable || isEffectiveApi(autoComplete) ? (
                <input
                  onChange={this.handleInputChange}
                  value={this.state.inputValue}
                  ref={this.input}
                  onKeyDown={this.handleInputKeyDown}
                  // {...getInputProps({
                  //     className: `${ns}Select-input`,
                  //     onFocus: this.onFocus,
                  //     onBlur: this.onBlur,
                  //     onKeyDown: (event) => {
                  //         if (event.key === 'Backspace' && !inputValue) {
                  //             this.removeItem(value.length - 1);
                  //         }
                  //     },
                  //     onChange: this.handleInputChange,
                  //     ref: this.inputRef
                  // })}
                />
              ) : null}
            </div>

            {clearable && !disabled && selectedOptions.length ? (
              <a onClick={this.clearValue} className={`${ns}TreeSelect-clear`}>
                <Icon icon="close" className="icon" />
              </a>
            ) : null}

            {loading ? (
              <span className={cx('TreeSelect-spinner')}>
                <i className={spinnerClassName} />
              </span>
            ) : null}
            <span className={cx('TreeSelect-arrow')} />
          </div>

          {this.state.isOpened ? this.renderOuter() : null}
        </div>
      </div>
    );
  }
}

@OptionsControl({
  type: 'tree-select'
})
export class TreeSelectControlRenderer extends TreeSelectControl {}
