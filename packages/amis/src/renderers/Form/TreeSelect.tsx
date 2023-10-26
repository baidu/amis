import React from 'react';
import {Overlay, resolveEventData} from 'amis-core';
import {PopOver} from 'amis-core';
import {PopUp, SpinnerExtraProps} from 'amis-ui';

import {
  OptionsControl,
  OptionsControlProps,
  Option,
  FormOptionsControl,
  toNumber
} from 'amis-core';

import {Tree as TreeSelector} from 'amis-ui';
import {matchSorter} from 'match-sorter';
import debouce from 'lodash/debounce';
import find from 'lodash/find';
import {Api} from 'amis-core';
import {isEffectiveApi} from 'amis-core';
import {Spinner} from 'amis-ui';
import {ResultBox} from 'amis-ui';
import {autobind, getTreeAncestors, isMobile, createObject} from 'amis-core';
import {findDOMNode} from 'react-dom';
import {normalizeOptions} from 'amis-core';
import {ActionObject} from 'amis-core';
import {FormOptionsSchema} from '../../Schema';
import {supportStatic} from './StaticHoc';
import {TooltipWrapperSchema} from '../TooltipWrapper';
import type {ItemRenderStates} from 'amis-ui/lib/components/Selection';

/**
 * Tree 下拉选择框。
 * 文档：https://aisuda.bce.baidu.com/amis/zh-CN/components/form/tree
 */
export interface TreeSelectControlSchema extends FormOptionsSchema {
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
   * 单选时，只运行选择叶子节点
   */
  onlyLeaf?: boolean;

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

  /**
   * 是否显示展开线
   */
  showOutline?: boolean;

  /**
   * 标签的最大展示数量，超出数量后以收纳浮层的方式展示，仅在多选模式开启后生效
   */
  maxTagCount?: number;

  /**
   * 收纳标签的Popover配置
   */
  overflowTagPopover?: TooltipWrapperSchema;

  /**
   * 自定义选项
   */
  menuTpl?: string;

  /**
   * 是否为选项添加默认的Icon，默认值为true
   */
  enableDefaultIcon?: boolean;
}

export interface TreeSelectProps
  extends OptionsControlProps,
    SpinnerExtraProps {
  placeholder?: any;
  autoComplete?: Api;
  hideNodePathLabel?: boolean;
  enableNodePath?: boolean;
  pathSeparator?: string;
  mobileUI?: boolean;
}

export interface TreeSelectState {
  isOpened: boolean;
  inputValue: string;
  tempValue: string;
}

export default class TreeSelectControl extends React.Component<
  TreeSelectProps,
  TreeSelectState
> {
  static defaultProps = {
    hideRoot: true,
    placeholder: 'Select.placeholder',
    optionsPlaceholder: 'placeholder.noData',
    multiple: false,
    clearable: true,
    rootLabel: 'Tree.root',
    rootValue: '',
    showIcon: true,
    joinValues: true,
    extractValue: false,
    delimiter: ',',
    resetValue: '',
    hideNodePathLabel: false,
    enableNodePath: false,
    pathSeparator: '/',
    selfDisabledAffectChildren: true
  };

  treeRef: any;

  container: React.RefObject<HTMLDivElement> = React.createRef();

  input: React.RefObject<any> = React.createRef();

  cache: {
    [propName: string]: any;
  } = {};

  target: HTMLElement | null;
  targetRef = (ref: any) =>
    (this.target = ref ? (findDOMNode(ref) as HTMLElement) : null);

  /** source数据源是否已加载 */
  sourceLoaded: boolean = false;

  constructor(props: TreeSelectProps) {
    super(props);

    this.state = {
      inputValue: '',
      tempValue: '',
      isOpened: false
    };

    this.open = this.open.bind(this);
    this.close = this.close.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleTempChange = this.handleTempChange.bind(this);
    this.handleConfirm = this.handleConfirm.bind(this);
    this.clearValue = this.clearValue.bind(this);
    this.handleFocus = this.handleFocus.bind(this);
    this.handleBlur = this.handleBlur.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.handleInputChange = debouce(this.handleInputChange.bind(this), 150, {
      trailing: true,
      leading: false
    });
    this.handleInputKeyDown = this.handleInputKeyDown.bind(this);
    this.loadRemote = debouce(this.loadRemote.bind(this), 250, {
      trailing: true,
      leading: false
    });
  }

  componentDidMount() {
    this.loadRemote('');
  }

  componentWillUnmount() {
    this.sourceLoaded = false;
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

  handleFocus(e: any) {
    const {dispatchEvent, value} = this.props;
    dispatchEvent('focus', resolveEventData(this.props, {value}));
  }

  handleBlur(e: any) {
    const {dispatchEvent, value, data} = this.props;
    dispatchEvent('blur', resolveEventData(this.props, {value}));
  }

  handleKeyPress(e: React.KeyboardEvent) {
    /**
     * 考虑到label/value中有空格的case
     * 这里使用组合键关闭 win：shift + space，mac：shift + space
     */
    if (e.key === ' ' && e.shiftKey) {
      this.handleOutClick(e as any);
      e.preventDefault();
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
    const {multiple} = this.props;

    if (!multiple) {
      this.close();
    }

    this.setState(
      {
        inputValue: ''
      },
      () => this.resultChangeEvent(value)
    );
  }

  handleTempChange(value: any) {
    this.setState({
      tempValue: value
    });
  }

  handleConfirm() {
    this.close();
    this.setState(
      {
        inputValue: ''
      },
      () => this.resultChangeEvent(this.state.tempValue)
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
        keys: [labelField || 'label', valueField || 'value'],
        threshold: matchSorter.rankings.CONTAINS
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
    const {autoComplete, env, data, setOptions, setLoading, source} =
      this.props;

    // 同时配置source和autoComplete时，首次渲染需要加载source数据
    if (
      !isEffectiveApi(autoComplete, data) ||
      (!input && isEffectiveApi(source) && !this.sourceLoaded)
    ) {
      this.sourceLoaded = true;
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
            ...option
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
    const {joinValues, extractValue, delimiter, valueField, multiple} =
      this.props;

    let newValue: any = Array.isArray(value) ? value.concat() : [];

    if (!multiple && !newValue.length) {
      this.resultChangeEvent('');
      return;
    }

    if (joinValues || extractValue) {
      newValue = value.map(item => item[valueField || 'value']);
    }

    if (joinValues) {
      newValue = newValue.join(delimiter || ',');
    }
    this.resultChangeEvent(newValue);
  }

  doAction(action: ActionObject, data: any, throwErrors: boolean) {
    if (action.actionType && ['clear', 'reset'].includes(action.actionType)) {
      this.clearValue();
    }
  }

  @autobind
  async resultChangeEvent(value: any) {
    const {onChange, dispatchEvent, data} = this.props;

    const rendererEvent = await dispatchEvent(
      'change',
      resolveEventData(this.props, {value})
    );

    if (rendererEvent?.prevented) {
      return;
    }
    onChange && onChange(value);
  }

  /** 下拉框选项渲染 */
  @autobind
  renderOptionItem(option: Option, states: ItemRenderStates) {
    const {menuTpl, render, data} = this.props;

    return render(`option/${states.index}`, menuTpl, {
      data: createObject(createObject(data, {...states}), option)
    });
  }

  /** 输入框选项渲染 */
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

  @autobind
  domRef(ref: any) {
    this.treeRef = ref;
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
      onlyLeaf,
      classPrefix: ns,
      optionsPlaceholder,
      searchable,
      autoComplete,
      maxLength,
      minLength,
      labelField,
      nodePath,
      onAdd,
      creatable,
      createTip,
      addControls,
      onEdit,
      editable,
      editTip,
      editControls,
      removable,
      removeTip,
      onDelete,
      rootCreatable,
      rootCreateTip,
      translate: __,
      deferLoad,
      expandTreeOptions,
      selfDisabledAffectChildren,
      showOutline,
      autoCheckChildren,
      hideRoot,
      virtualThreshold,
      itemHeight,
      menuTpl,
      enableDefaultIcon,
      mobileUI
    } = this.props;

    let filtedOptions =
      !isEffectiveApi(autoComplete) && searchable && this.state.inputValue
        ? this.filterOptions(options, this.state.inputValue)
        : options;

    return (
      <TreeSelector
        classPrefix={ns}
        onRef={this.domRef}
        onlyChildren={onlyChildren}
        onlyLeaf={onlyLeaf}
        labelField={labelField}
        valueField={valueField}
        disabled={disabled}
        onChange={mobileUI ? this.handleTempChange : this.handleChange}
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
        autoCheckChildren={autoCheckChildren}
        rootLabel={__(rootLabel)}
        rootValue={rootValue}
        showIcon={showIcon}
        showRadio={showRadio}
        showOutline={showOutline}
        cascade={cascade}
        foldedField="collapsed"
        hideRoot={hideRoot}
        value={value || ''}
        nodePath={nodePath}
        enableNodePath={enableNodePath}
        pathSeparator={pathSeparator}
        maxLength={maxLength}
        minLength={minLength}
        onAdd={onAdd}
        creatable={creatable}
        createTip={createTip}
        rootCreatable={rootCreatable}
        rootCreateTip={rootCreateTip}
        onEdit={onEdit}
        editable={editable}
        editTip={editTip}
        removable={removable}
        removeTip={removeTip}
        onDelete={onDelete}
        bultinCUD={!addControls && !editControls}
        onDeferLoad={deferLoad}
        onExpandTree={expandTreeOptions}
        selfDisabledAffectChildren={selfDisabledAffectChildren}
        virtualThreshold={virtualThreshold}
        itemHeight={toNumber(itemHeight) > 0 ? toNumber(itemHeight) : undefined}
        itemRender={menuTpl ? this.renderOptionItem : undefined}
        enableDefaultIcon={enableDefaultIcon}
        mobileUI={mobileUI}
      />
    );
  }

  @supportStatic()
  render() {
    const {
      className,
      style,
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
      popOverContainer,
      mobileUI,
      maxTagCount,
      overflowTagPopover,
      translate: __,
      env,
      loadingConfig
    } = this.props;
    const {isOpened} = this.state;
    const resultValue = multiple
      ? selectedOptions
      : selectedOptions.length
      ? this.renderItem(selectedOptions[0])
      : '';

    return (
      <div ref={this.container} className={cx(`TreeSelectControl`, className)}>
        <ResultBox
          popOverContainer={popOverContainer || env.getModalContainer}
          maxTagCount={maxTagCount}
          overflowTagPopover={overflowTagPopover}
          disabled={disabled}
          ref={this.targetRef}
          placeholder={__(placeholder ?? 'placeholder.empty')}
          inputPlaceholder={''}
          className={cx(`TreeSelect`, {
            'TreeSelect--inline': inline,
            'TreeSelect--single': !multiple,
            'TreeSelect--multi': multiple,
            'TreeSelect--searchable':
              searchable || isEffectiveApi(autoComplete),
            'is-opened': this.state.isOpened,
            'is-disabled': disabled
          })}
          result={resultValue}
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
          allowInput={
            !mobileUI &&
            (searchable || isEffectiveApi(autoComplete)) &&
            (multiple || !resultValue)
          }
          hasDropDownArrow
          readOnly={mobileUI}
          mobileUI={mobileUI}
        >
          {loading ? (
            <Spinner loadingConfig={loadingConfig} size="sm" />
          ) : undefined}
        </ResultBox>
        {!mobileUI && isOpened ? (
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
              {this.renderOuter()}
            </PopOver>
          </Overlay>
        ) : null}
        {mobileUI ? (
          <PopUp
            container={env.getModalContainer}
            className={cx(`${ns}TreeSelect-popup`)}
            isShow={isOpened}
            onHide={this.close}
            showConfirm
            onConfirm={this.handleConfirm}
          >
            {this.renderOuter()}
          </PopUp>
        ) : null}
      </div>
    );
  }
}

@OptionsControl({
  type: 'tree-select'
})
export class TreeSelectControlRenderer extends TreeSelectControl {}
