/**
 * @file Cascader
 * @author fex
 */

import React from 'react';
import {autobind, getTreeAncestors} from 'amis-core';
import {themeable} from 'amis-core';
import {Option, Options} from './Select';
import intersectionBy from 'lodash/intersectionBy';
import compact from 'lodash/compact';
import find from 'lodash/find';
import uniqBy from 'lodash/uniqBy';
import Button from './Button';
import Checkbox from './Checkbox';
import {flattenTree, findTree, getTreeDepth} from 'amis-core';
import type {OptionsControlProps} from 'amis-core';
import {Icon} from './icons';

export type CascaderOption = {
  text?: string;
  value?: string | number;
  valueField?: string;
  color?: string;
  disabled?: boolean;
  children?: Options;
  className?: string;
  [key: string]: any;
};
export interface CascaderProps extends OptionsControlProps {
  cascade?: boolean;
  noResultsText?: string;
  withChildren?: boolean;
  onlyChildren?: boolean;
  hideNodePathLabel?: boolean;
  mobileUI?: boolean;
  value?: (number | string)[];
  activeColor?: string;
  optionRender?: ({
    option,
    selected
  }: {
    option: CascaderOption;
    selected: boolean;
  }) => React.ReactNode;
  onClose?: () => void;
  onConfirm?: (param: any) => void;
  multiple?: boolean;
}
export type CascaderTab = {
  options: Options;
};

export interface CascaderState {
  selectedOptions: Options;
  tabs: Array<{
    options: Options;
  }>;
  // 用于在只选择子节点模式的时候禁用按钮
  disableConfirm: boolean;
  activePaths: CascaderOption[];
}

export class Cascader extends React.Component<CascaderProps, CascaderState> {
  static defaultProps = {
    labelField: 'label',
    valueField: 'value'
  };
  tabsRef: React.RefObject<HTMLDivElement> = React.createRef();
  tabRef: React.RefObject<HTMLDivElement> = React.createRef();
  constructor(props: CascaderProps) {
    super(props);
    this.state = {
      activePaths: [],
      selectedOptions: this.props.selectedOptions || [],
      tabs: [
        {
          options: this.props.options.slice() || []
        }
      ],
      disableConfirm: false
    };
  }
  componentDidMount() {
    const {
      multiple,
      options,
      valueField = 'value',
      cascade,
      onlyLeaf
    } = this.props;
    let selectedOptions = this.props.selectedOptions.slice();
    let parentsCount = 0;
    let parentTree: Options = [];
    selectedOptions.forEach((item: Option) => {
      const parents = getTreeAncestors(options, item as any);
      // 获取最长路径
      if (parents && parents?.length > parentsCount) {
        parentTree = parents;
        parentsCount = parentTree.length;
      }
    });
    const selectedValues = selectedOptions.map(
      (option: Option) => option[valueField]
    );
    const tabs = parentTree.map((option: Option) => {
      if (multiple && !cascade) {
        if (
          selectedValues.includes(option[valueField]) &&
          option?.children?.length
        ) {
          option.children.forEach((option: Option) => (option.disabled = true));
        }
      }
      return {
        options: option.children ? option.children : []
      };
    });
    this.setState({
      selectedOptions,
      tabs: [...this.state.tabs, ...tabs]
    });
  }

  @autobind
  getOptionParent(option: Option) {
    const {options, valueField = 'value'} = this.props;
    let ancestors: any[] = [];
    findTree(options, (item, index, level, paths) => {
      if (item[valueField] === option[valueField]) {
        ancestors = paths;
        return true;
      }
      return false;
    });
    return ancestors.length ? ancestors[ancestors.length - 1] : null;
  }

  @autobind
  dealParentSelect(option: Option, selectedOptions: Options): Options {
    const {valueField = 'value', onlyLeaf} = this.props;
    const parentOption = this.getOptionParent(option);
    if (parentOption && !onlyLeaf) {
      const parentChildren = parentOption?.children;
      const equalOption = intersectionBy(
        selectedOptions,
        parentChildren,
        valueField
      );
      // 包含则选中父节点
      const isParentSelected = find(selectedOptions, {
        [valueField]: parentOption[valueField]
      });
      if (equalOption.length === parentChildren?.length && !isParentSelected) {
        selectedOptions.push(parentOption);
      }
      if (equalOption.length !== parentChildren?.length && isParentSelected) {
        const index = selectedOptions.findIndex(
          (item: Option) => item[valueField] === parentOption[valueField]
        );
        selectedOptions.splice(index, 1);
      }
      return this.dealParentSelect(parentOption, selectedOptions);
    } else {
      return selectedOptions;
    }
  }

  @autobind
  flattenTreeWithLeafNodes(option: Option) {
    return compact(
      flattenTree(Array.isArray(option) ? option : [option], node => node)
    );
  }

  @autobind
  adjustOptionSelect(option: Option): boolean {
    const {valueField = 'value'} = this.props;
    const {selectedOptions} = this.state;
    function loop(arr: any[]): boolean {
      if (!arr.length) {
        return false;
      }
      return arr.some((item: any) => item[valueField] === option[valueField]);
    }
    return loop(selectedOptions);
  }

  // 判断配置onlyChildren属性时节点选中情况
  @autobind
  getOnlyChildrenSelect(option: Option, selectedOptions?: Option[]) {
    const {onlyChildren} = this.props;
    selectedOptions = selectedOptions || this.state.selectedOptions;

    return (
      onlyChildren &&
      option.children
        ?.filter(option => !option.children?.length)
        .every(
          option =>
            !option.children?.length && selectedOptions?.includes(option)
        )
    );
  }

  @autobind
  getSelectedChildNum(option: Option): number {
    let count = 0;
    const loop = (arr: any[]) => {
      if (!arr || !arr.length) {
        return;
      }
      for (let item of arr) {
        if (item.children) {
          loop(item.children || []);
        } else {
          if (this.adjustOptionSelect(item)) {
            count++;
          }
        }
      }
    };
    loop(option.children || []);
    return count;
  }

  @autobind
  dealOptionDisable(selectedOptions: Options) {
    const {
      valueField = 'value',
      options,
      cascade,
      multiple,
      onlyLeaf,
      onlyChildren // 子节点可点击
    } = this.props;
    if (!multiple || cascade || onlyChildren || onlyLeaf) {
      return;
    }
    const selectedValues = selectedOptions.map(
      (option: Option) => option[valueField]
    );
    const loop = (option: Option) => {
      if (!option.children) {
        return;
      }
      option.children &&
        option.children.forEach((childOption: Option) => {
          if (
            !selectedValues.includes(option[valueField]) &&
            !option.disabled
          ) {
            childOption.disabled = false;
          }

          if (selectedValues.includes(option[valueField]) || option.disabled) {
            childOption.disabled = true;
          }
          loop(childOption);
        });
    };
    options.forEach((option: Option) => loop(option));
  }

  @autobind
  dealChildrenSelect(option: Option, selectedOptions: Options) {
    const {valueField = 'value', onlyChildren} = this.props;
    let index = selectedOptions.findIndex(
      (item: Option) => item[valueField] === option[valueField]
    );
    let isSelect = this.getOnlyChildrenSelect(option, selectedOptions);
    if (index !== -1) {
      selectedOptions.splice(index, 1);
    } else if (!isSelect) {
      if (!(onlyChildren && option.children?.length)) {
        selectedOptions.push(option);
      }
    }
    function loop(option: Option) {
      if (!option.children) {
        return;
      }
      option.children.forEach((item: Option) => {
        if (index !== -1 || isSelect) {
          // 删除选中节点及其子节点
          selectedOptions = selectedOptions.filter(
            (sItem: Option) => sItem[valueField] !== item[valueField]
          );
        } else {
          // 添加节点及其子节点
          if (!(onlyChildren && item.children?.length)) {
            selectedOptions.push(item);
          }
        }
        loop(item);
      });
    }
    loop(option);
    return selectedOptions;
  }

  getParentTree = (option: Option, arr: Options): Options => {
    const parentOption = this.getOptionParent(option);
    if (parentOption) {
      arr.push(parentOption);
      return this.getParentTree(parentOption, arr);
    }
    return arr;
  };

  @autobind
  onSelect(option: CascaderOption, tabIndex: number) {
    const {
      multiple,
      valueField = 'value',
      cascade,
      onlyLeaf,
      onlyChildren,
      withChildren
    } = this.props;
    let selectedOptions = this.state.selectedOptions;
    const isDisable = option.disabled;
    if (!isDisable) {
      if (multiple) {
        // 父子级分离
        if (cascade) {
          let index = selectedOptions.findIndex(
            (item: Option) => item[valueField] === option[valueField]
          );
          if (index !== -1) {
            selectedOptions.splice(index, 1);
          } else {
            selectedOptions.push(option);
          }
        } else {
          if (withChildren || onlyChildren) {
            selectedOptions = this.dealChildrenSelect(option, selectedOptions);
          } else {
            let index = selectedOptions.findIndex(
              (item: Option) => item[valueField] === option[valueField]
            );
            if (index !== -1) {
              selectedOptions.splice(index, 1);
            } else {
              selectedOptions.push(option);
            }
          }
          selectedOptions = this.dealParentSelect(option, selectedOptions);
        }
      } else {
        // 单选
        if (onlyLeaf) {
          if (!option.children?.length) {
            selectedOptions = [option];
          }
        } else {
          selectedOptions = [option];
        }
      }
    }
    this.dealOptionDisable(selectedOptions);

    let disableConfirm = false;
    if (onlyLeaf && selectedOptions.length && selectedOptions[0].children) {
      disableConfirm = true;
    }

    this.setState({
      selectedOptions,
      disableConfirm
    });
  }

  @autobind
  handleExpand(option: Option, tabIndex: number) {
    const activePaths = this.state.activePaths.slice();

    if (option.children?.length) {
      activePaths[tabIndex] = option;
    } else {
      activePaths.splice(tabIndex);
    }

    let tabs = this.state.tabs.slice();
    if (tabs.length > tabIndex + 1) {
      tabs = tabs.slice(0, tabIndex + 1);
    }

    if (option?.children) {
      const nextTab = {
        options: option.children
      };
      if (tabs[tabIndex + 1]) {
        tabs[tabIndex + 1] = nextTab;
      } else {
        tabs.push(nextTab);
      }
    }

    requestAnimationFrame(() => {
      const tabWidth = this.tabRef.current?.offsetWidth || 1;
      const parentTree = this.getParentTree(option, [option]);
      const scrollLeft = (parentTree.length - 2) * tabWidth;
      if (scrollLeft !== 0) {
        (this.tabsRef.current as HTMLElement)?.scrollTo(scrollLeft, 0);
      }
    });

    this.setState({
      activePaths,
      tabs
    });
  }

  @autobind
  getSubmitOptions(selectedOptions: Options): Options {
    const _selectedOptions: Options = [];
    const {
      multiple,
      options,
      valueField = 'value',
      cascade,
      onlyChildren,
      withChildren
    } = this.props;
    if (cascade || onlyChildren || withChildren || !multiple) {
      return selectedOptions;
    }
    const selectedValues = selectedOptions.map(
      (option: Option) => option[valueField]
    );
    function loop(options: Options) {
      if (!options || !options.length) {
        return;
      }
      options.forEach((option: Option) => {
        if (selectedValues.includes(option[valueField])) {
          _selectedOptions.push(option);
        } else {
          loop(option.children ? option.children : []);
        }
      });
    }
    loop(options);
    return _selectedOptions;
  }

  @autobind
  confirm() {
    const {onChange, onClose, onlyLeaf} = this.props;
    const selectedOptions = this.getSelectedOptions();
    if (onlyLeaf && selectedOptions.length && selectedOptions[0].children) {
      return;
    }
    onChange(selectedOptions);
    onClose && onClose();
  }

  @autobind
  getSelectedOptions() {
    return uniqBy(
      this.getSubmitOptions(this.state.selectedOptions),
      this.props.valueField
    );
  }

  @autobind
  renderOption(option: CascaderOption, tabIndex: number) {
    const {
      onlyLeaf,
      activeColor,
      optionRender,
      labelField,
      valueField = 'value',
      multiple,
      classnames: cx
    } = this.props;
    const {selectedOptions, activePaths} = this.state;
    const selectedValueArr = selectedOptions.map(item => item[valueField]);

    let selfChecked = selectedValueArr.includes(option[valueField]);
    const color = option.color || (selfChecked ? activeColor : undefined);
    const Text = optionRender ? (
      optionRender({option, selected: selfChecked})
    ) : (
      <span>{option[labelField]}</span>
    );

    return (
      <li
        className={cx(
          'Cascader-option',
          {
            'selected': selfChecked,
            'disabled': option.disabled,
            'is-active': activePaths.includes(option)
          },
          option.className
        )}
        style={{color}}
        key={tabIndex + '-' + option[valueField]}
        onClick={() => {
          !multiple && this.onSelect(option, tabIndex);
          this.handleExpand(option, tabIndex);
        }}
      >
        {multiple ? (
          <Checkbox
            disabled={option.disabled || (onlyLeaf && option.children?.length)}
            checked={
              selectedOptions.includes(option) ||
              this.getOnlyChildrenSelect(option)
            }
            onChange={() => this.onSelect(option, tabIndex)}
          >
            <span className={cx('Cascader-option--text')}>{Text}</span>
          </Checkbox>
        ) : (
          <span
            className={cx('Cascader-option--text', {
              disabled: onlyLeaf && option.children?.length
            })}
          >
            {Text}
          </span>
        )}

        {option.children?.length ? (
          <span className={cx('Cascader-option-arrow')}>
            <Icon icon="right-arrow-bold" className="icon" />
          </span>
        ) : null}
      </li>
    );
  }

  @autobind
  renderOptions(options: Options, tabIndex: number) {
    const {classnames: cx} = this.props;
    return (
      <ul key={tabIndex} className={cx('Cascader-options')}>
        {options.map(option => this.renderOption(option, tabIndex))}
      </ul>
    );
  }

  @autobind
  renderTabs() {
    const {classnames: cx, options} = this.props;
    const {tabs} = this.state;
    const depth = getTreeDepth(options);
    return (
      <div
        className={cx(`Cascader-tabs`, depth > 3 ? 'scrollable' : '')}
        ref={this.tabsRef}
      >
        {tabs.map((tab: CascaderTab, tabIndex: number) => {
          const {options} = tab;
          return (
            <div
              className={cx(`Cascader-tab depth-${tabIndex}`)}
              ref={this.tabRef}
              key={tabIndex}
            >
              {this.renderOptions(options, tabIndex)}
            </div>
          );
        })}
        {depth <= 3 && options.length
          ? Array(getTreeDepth(options) - tabs.length)
              .fill(1)
              .map((item: number, index: number) => (
                <div
                  className={cx(`Cascader-tab depth-${index + 1}`)}
                  key={index}
                ></div>
              ))
          : null}
      </div>
    );
  }

  render() {
    const {
      classPrefix: ns,
      classnames: cx,
      className,
      onClose,
      valueField,
      translate: __
    } = this.props;

    return (
      <div className={cx(`Cascader`, className)}>
        <div className={cx(`Cascader-btnGroup`)}>
          <Button
            className={cx(`Cascader-btnCancel`)}
            level="link"
            onClick={onClose}
          >
            {__('cancel')}
          </Button>
          <Button
            className={cx(`Cascader-btnConfirm`)}
            level="link"
            onClick={this.confirm}
            disabled={this.state.disableConfirm}
          >
            {__('confirm')}
          </Button>
        </div>
        {this.renderTabs()}
      </div>
    );
  }
}

export default themeable(Cascader);
