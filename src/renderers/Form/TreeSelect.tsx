import React from 'react';
import Overlay from '../../components/Overlay';
import PopOver from '../../components/PopOver';

import {
  OptionsControl,
  OptionsControlProps,
  Option,
  FormOptionsControl
} from './Options';
import {Icon} from '../../components/icons';
import TreeSelector from '../../components/Tree';
import {matchSorter} from 'match-sorter';
import debouce from 'lodash/debounce';
import find from 'lodash/find';
import {Api} from '../../types';
import {isEffectiveApi} from '../../utils/api';
import Spinner from '../../components/Spinner';
import ResultBox from '../../components/ResultBox';
import {autobind, getTreeAncestors} from '../../utils/helper';
import {findDOMNode} from 'react-dom';
import {normalizeOptions} from '../../components/Select';

/**
 * Tree 下拉选择框。
 * 文档：https://baidu.gitee.io/amis/docs/components/form/tree
 */
export interface TreeSelectControlSchema extends FormOptionsControl {
  type: 'tree-select';

  /**
   * 是否隐藏顶级
   */
  hideRoot?: boolean;

  /**
   * 顶级选项的名称
   */
  rootLabel?: string;

  /**
   * 顶级选项的值
   */
  rootValue?: any;

  /**
   * 显示图标
   */
  showIcon?: boolean;

  /**
   * 父子之间是否完全独立。
   */
  cascade?: boolean;

  /**
   * 选父级的时候是否把子节点的值也包含在内。
   */
  withChildren?: boolean;

  /**
   * 选父级的时候，是否只把子节点的值包含在内
   */
  onlyChildren?: boolean;

  /**
   * 顶级节点是否可以创建子节点
   */
  rootCreatable?: boolean;

  /**
   * 是否隐藏选择框中已选中节点的祖先节点的文本信息
   */
  hideNodePathLabel?: boolean;

  /**
   * 是否开启节点路径模式
   */
  enableNodePath?: boolean;

  /**
   * 开启节点路径模式后，节点路径的分隔符
   */
  pathSeparator?: string;
}

export interface TreeSelectProps extends OptionsControlProps {
  placeholder?: any;
  autoComplete?: Api;
  hideNodePathLabel?: boolean;
  enableNodePath?: boolean;
  pathSeparator?: string;
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
    placeholder: 'Select.placeholder',
    optionsPlaceholder: 'placeholder.noData',
    multiple: false,
    clearable: true,
    rootLabel: '顶级',
    rootValue: '',
    showIcon: true,
    joinValues: true,
    extractValue: false,
    delimiter: ',',
    resetValue: '',
    hideNodePathLabel: false,
    enableNodePath: false,
    pathSeparator: '/'
  };

  container: React.RefObject<HTMLDivElement> = React.createRef();

  input: React.RefObject<any> = React.createRef();

  cache: {
    [propName: string]: any;
  } = {};

  target: HTMLElement | null;
  targetRef = (ref: any) =>
    (this.target = ref ? (findDOMNode(ref) as HTMLElement) : null);

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
    this.handleFocus = this.handleFocus.bind(this);
    this.handleBlur = this.handleBlur.bind(this);
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

  handleKeyPress(e: React.KeyboardEvent) {
    if (e.key === ' ') {
      this.handleOutClick(e as any);
      e.preventDefault();
    }
  }

  validate(): any {
    const {value, minLength, maxLength, delimiter, translate: __} = this.props;

    let curValue = Array.isArray(value)
      ? value
      : (value ? String(value) : '').split(delimiter || ',');
    if (minLength && curValue.length < minLength) {
      return __(
        '已选择数量低于设定的最小个数${minLength}，请选择更多的选项。',
        {minLength}
      );
    } else if (maxLength && curValue.length > maxLength) {
      return __(
        '已选择数量超出设定的最大个数{{maxLength}}，请取消选择超出的选项。',
        {maxLength}
      );
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

  handleInputChange(value: string) {
    const {autoComplete, data} = this.props;

    this.setState(
      {
        inputValue: value
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
        const visibleCount = option.children.filter(
          item => item.visible
        ).length;
        option.visible = !!visibleCount;
      }

      option.visible && (option.collapsed = false);
      return option;
    });
  }

  async loadRemote(input: string) {
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

    try {
      const ret: any = await env.fetcher(autoComplete, {
        ...data,
        term: input,
        value: input
      });

      let options = (ret.data && (ret.data as any).options) || ret.data || [];
      this.cache[input] = options;
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

  @autobind
  handleOutClick(e: React.MouseEvent<any>) {
    e.defaultPrevented ||
      this.setState({
        isOpened: true
      });
  }

  @autobind
  handleResultChange(value: Array<Option>) {
    const {
      joinValues,
      extractValue,
      delimiter,
      valueField,
      onChange,
      multiple
    } = this.props;

    let newValue: any = Array.isArray(value) ? value.concat() : [];

    if (!multiple && !newValue.length) {
      onChange('');
      return;
    }

    if (joinValues || extractValue) {
      newValue = value.map(item => item[valueField || 'value']);
    }

    if (joinValues) {
      newValue = newValue.join(delimiter || ',');
    }

    onChange(newValue);
  }

  @autobind
  renderItem(item: Option) {
    const {labelField, options, hideNodePathLabel} = this.props;

    if (hideNodePathLabel) {
      return item[labelField || 'label'];
    }

    // 将所有祖先节点也展现出来
    const ancestors = getTreeAncestors(options, item, true);
    return `${
      ancestors
        ? ancestors.map(item => `${item[labelField || 'label']}`).join(' / ')
        : item[labelField || 'label']
    }`;
  }

  renderOuter() {
    const {
      value,
      enableNodePath,
      pathSeparator = '/',
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
      minLength,
      labelField,
      nodePath,
      translate: __,
      deferLoad,
      expandTreeOptions
    } = this.props;

    let filtedOptions =
      !isEffectiveApi(autoComplete) && searchable && this.state.inputValue
        ? this.filterOptions(options, this.state.inputValue)
        : options;

    return (
      <Overlay
        container={popOverContainer || (() => this.container.current)}
        target={() => this.target}
        show
      >
        <PopOver
          classPrefix={ns}
          className={`${ns}TreeSelect-popover`}
          style={{
            minWidth: this.target ? this.target.offsetWidth : undefined
          }}
          onHide={this.close}
          overlay
        >
          <TreeSelector
            classPrefix={ns}
            onlyChildren={onlyChildren}
            labelField={labelField}
            valueField={valueField}
            disabled={disabled}
            onChange={this.handleChange}
            joinValues={joinValues}
            extractValue={extractValue}
            delimiter={delimiter}
            placeholder={__(optionsPlaceholder)}
            options={filtedOptions}
            highlightTxt={this.state.inputValue}
            multiple={multiple}
            initiallyOpen={initiallyOpen}
            unfoldedLevel={unfoldedLevel}
            withChildren={withChildren}
            rootLabel={__(rootLabel)}
            rootValue={rootValue}
            showIcon={showIcon}
            showRadio={showRadio}
            cascade={cascade}
            foldedField="collapsed"
            hideRoot
            value={value || ''}
            nodePath={nodePath}
            enableNodePath={enableNodePath}
            pathSeparator={pathSeparator}
            maxLength={maxLength}
            minLength={minLength}
            onDeferLoad={deferLoad}
            onExpandTree={expandTreeOptions}
          />
        </PopOver>
      </Overlay>
    );
  }

  render() {
    const {
      className,
      disabled,
      inline,
      loading,
      multiple,
      value,
      clearable,
      classPrefix: ns,
      classnames: cx,
      searchable,
      autoComplete,
      selectedOptions,
      placeholder,
      translate: __
    } = this.props;

    return (
      <div ref={this.container} className={cx(`TreeSelectControl`, className)}>
        <ResultBox
          disabled={disabled}
          ref={this.targetRef}
          placeholder={__(placeholder || '空')}
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
          result={
            multiple
              ? selectedOptions
              : selectedOptions.length
              ? this.renderItem(selectedOptions[0])
              : ''
          }
          onResultClick={this.handleOutClick}
          value={this.state.inputValue}
          onChange={this.handleInputChange}
          onResultChange={this.handleResultChange}
          itemRender={this.renderItem}
          onKeyPress={this.handleKeyPress}
          onFocus={this.handleFocus}
          onBlur={this.handleBlur}
          onKeyDown={this.handleInputKeyDown}
          clearable={clearable}
          allowInput={searchable || isEffectiveApi(autoComplete)}
          inputPlaceholder={''}
        >
          {loading ? <Spinner size="sm" /> : undefined}
        </ResultBox>
        {this.state.isOpened ? this.renderOuter() : null}
      </div>
    );
  }
}

@OptionsControl({
  type: 'tree-select'
})
export class TreeSelectControlRenderer extends TreeSelectControl {}
