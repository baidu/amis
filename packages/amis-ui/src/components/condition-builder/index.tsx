import React from 'react';
import {
  ThemeProps,
  themeable,
  LocaleProps,
  localeable,
  autobind,
  animation,
  findTreeIndex,
  getTree,
  spliceTree,
  mapTree,
  findTree,
  guid,
  noop,
  AMISConditionRule
} from 'amis-core';
import {uncontrollable} from 'amis-core';
import {ConditionBuilderFields, ConditionBuilderFuncs} from './types';
import ConditionGroup from './Group';
import defaultConfig, {ConditionBuilderConfig} from './config';
import {FormulaPickerProps} from '../formula/Picker';
import PickerContainer from '../PickerContainer';
import ResultBox from '../ResultBox';
import type {AMISConditionGroupValue, TestIdBuilder} from 'amis-core';

export interface ConditionBuilderProps extends ThemeProps, LocaleProps {
  builderMode?: 'simple' | 'full'; // 简单模式｜完整模式
  embed?: boolean;
  pickerIcon?: JSX.Element;
  placeholder?: string;
  title?: string;
  fields: ConditionBuilderFields;
  funcs?: ConditionBuilderFuncs;
  uniqueFields?: boolean; // 是否限制字段唯一，也就是说不允许一个字段设置在两个规则里面
  showNot?: boolean; // 是否显示非按钮
  showANDOR?: boolean; // 是否显示并或切换键按钮
  showIf?: boolean; // 是否显示条件
  formulaForIf?: FormulaPickerProps;
  value?: AMISConditionGroupValue;
  data?: any;
  onChange: (value?: AMISConditionGroupValue) => void;
  config?: ConditionBuilderConfig;
  disabled?: boolean;
  draggable?: boolean;
  searchable?: boolean;
  fieldClassName?: string;
  formula?: FormulaPickerProps;
  popOverContainer?: any;
  renderEtrValue?: any;
  selectMode?: 'list' | 'tree' | 'chained';
  isAddBtnVisibleOn?: (param: {
    depth: number;
    breadth: number;
  }) => boolean | undefined;
  isAddGroupBtnVisibleOn?: (param: {
    depth: number;
    breadth: number;
  }) => boolean | undefined;
  testIdBuilder?: TestIdBuilder;
}

export interface ConditionBuilderState {
  tmpValue: AMISConditionGroupValue;
}

export class QueryBuilder extends React.Component<
  ConditionBuilderProps,
  ConditionBuilderState
> {
  config = {...defaultConfig, ...this.props.config};

  dragTarget?: HTMLElement;
  // dragNextSibling: Element | null;
  ghost?: HTMLElement;
  host: HTMLElement;
  lastX: number;
  lastY: number;
  lastMoveAt: number = 0;

  @autobind
  handleDragStart(e: React.DragEvent) {
    const {draggable = true} = this.props;
    // draggable为false时不可拖拽
    if (!draggable) return;
    const target = e.currentTarget;
    const item = target.closest('[data-id]') as HTMLElement;
    this.dragTarget = item;
    // this.dragNextSibling = item.nextElementSibling;
    this.host = item.closest('[data-group-id]') as HTMLElement;

    const ghost = item.cloneNode(true) as HTMLElement;
    ghost.classList.add('is-ghost');
    this.ghost = ghost;

    e.dataTransfer.setDragImage(item.firstChild as HTMLElement, 0, 0);

    target.addEventListener('dragend', this.handleDragEnd);
    document.body.addEventListener('dragover', this.handleDragOver);
    document.body.addEventListener('drop', this.handleDragDrop);
    this.lastX = e.clientX;
    this.lastY = e.clientY;

    // 应该是 chrome 的一个bug，如果你马上修改，会马上执行 dragend
    setTimeout(() => {
      item.classList.add('is-dragging');
      // item.parentElement!.insertBefore(
      //   item,
      //   item.parentElement!.firstElementChild
      // ); // 挪到第一个，主要是因为样式问题。
    }, 5);
  }

  @autobind
  handleDragOver(e: DragEvent) {
    e.preventDefault();
    const item = (e.target as HTMLElement).closest('[data-id]') as HTMLElement;

    const dx = e.clientX - this.lastX;
    const dy = e.clientY - this.lastY;
    const d = Math.max(Math.abs(dx), Math.abs(dy));
    const now = Date.now();

    // 没移动还是不要处理，免得晃动个不停。
    if (d < 5) {
      if (this.lastMoveAt === 0) {
      } else if (now - this.lastMoveAt > 500) {
        const host = (e.target as HTMLElement).closest(
          '[data-group-id]'
        ) as HTMLElement;

        if (host) {
          this.host = host;
          this.lastMoveAt = now;
          this.lastX = 0;
          this.lastY = 0;
          this.handleDragOver(e);
          return;
        }
      }
      return;
    }

    this.lastMoveAt = now;
    this.lastX = e.clientX;
    this.lastY = e.clientY;

    if (
      !item ||
      item.classList.contains('is-ghost') ||
      item.closest('[data-group-id]') !== this.host
    ) {
      return;
    }

    const container = item.parentElement!;
    const children = [].slice.apply(container!.children);

    const idx = children.indexOf(item);

    if (this.ghost!.parentElement !== container) {
      container.appendChild(this.ghost!);
    }

    const rect = item.getBoundingClientRect();
    const isAfter = dy > 0 && e.clientY > rect.top + rect.height / 2;
    const gIdx = isAfter ? idx : idx - 1;
    const cgIdx = children.indexOf(this.ghost);

    if (gIdx !== cgIdx) {
      animation.capture(container);

      if (gIdx === children.length - 1) {
        container.appendChild(this.ghost!);
      } else {
        container.insertBefore(this.ghost!, children[gIdx + 1]);
      }

      animation.animateAll();
    }
  }

  @autobind
  handleDragDrop() {
    const onChange = this.props.onChange;
    const fromId = this.dragTarget!.getAttribute('data-id')!;
    const toId = this.host.getAttribute('data-group-id')!;
    const children = [].slice.call(this.ghost!.parentElement!.children);
    const idx = children.indexOf(this.dragTarget);

    if (~idx) {
      children.splice(idx, 1);
    }

    const toIndex = children.indexOf(this.ghost);
    let value = this.props.value!;

    const indexes = findTreeIndex([value], item => item.id === fromId);

    if (indexes) {
      const origin = getTree([value], indexes.concat())!;
      [value] = spliceTree([value]!, indexes, 1);

      const indexes2 = findTreeIndex([value], item => item.id === toId);

      if (indexes2) {
        [value] = spliceTree([value]!, indexes2.concat(toIndex), 0, origin);
        onChange(value);
      }
    }
  }

  @autobind
  handleDragEnd(e: Event) {
    const target = e.target as HTMLElement;

    target.removeEventListener('dragend', this.handleDragEnd);
    document.body.removeEventListener('dragover', this.handleDragOver);
    document.body.removeEventListener('drop', this.handleDragDrop);

    this.dragTarget!.classList.remove('is-dragging');
    // if (this.dragNextSibling) {
    //   this.dragTarget.parentElement!.insertBefore(
    //     this.dragTarget,
    //     this.dragNextSibling
    //   );
    // } else {
    //   this.dragTarget.parentElement!.appendChild(this.dragTarget);
    // }
    delete this.dragTarget;
    // delete this.dragNextSibling;
    this.ghost!.parentElement?.removeChild(this.ghost!);
    delete this.ghost;
  }

  @autobind
  handleClear() {
    this.props.onChange();
  }

  @autobind
  highlightValue(value: AMISConditionGroupValue) {
    const {classnames: cx, translate: __} = this.props;
    const html = {
      __html: `<span class="label label-info">${__(
        'Condition.configured'
      )}</span>`
    };

    return (
      <div className={cx('CPGroup-result')} dangerouslySetInnerHTML={html} />
    );
  }

  renderBody(
    onChange: (value: AMISConditionGroupValue) => void,
    value?: AMISConditionGroupValue,
    popOverContainer?: any
  ) {
    const {
      classnames: cx,
      fieldClassName,
      fields,
      funcs,
      showNot,
      showANDOR,
      data,
      draggable = true,
      searchable,
      builderMode,
      formula,
      renderEtrValue,
      selectMode,
      isAddBtnVisibleOn,
      isAddGroupBtnVisibleOn,
      showIf,
      uniqueFields,
      formulaForIf,
      testIdBuilder
    } = this.props;

    const disabled = value?.disabled ?? this.props.disabled;

    const normalizedValue = Array.isArray(value?.children)
      ? {
          ...value,
          children: mapTree(value!.children, (value: any) => {
            if (value.id) {
              return value;
            }

            return {
              ...value,
              id: guid()
            };
          })
        }
      : value;
    let finalFields = fields || this.config.fields;
    if (uniqueFields && Array.isArray(value?.children)) {
      finalFields = mapTree(finalFields, (field: any) => {
        const selected = findTree(
          (value as any)?.children,
          (rule: any) =>
            rule.left?.type === 'field' && rule.left?.field === field.name
        );

        if (selected) {
          return {
            ...field,
            disabled: true
          };
        }

        return field;
      });
    }

    return (
      <ConditionGroup
        builderMode={builderMode}
        config={this.config}
        funcs={funcs || this.config.funcs}
        fields={finalFields}
        value={normalizedValue as any}
        onChange={onChange}
        classnames={cx}
        fieldClassName={fieldClassName}
        removeable={false}
        onDragStart={this.handleDragStart}
        showANDOR={showANDOR}
        showNot={showNot}
        data={data}
        disabled={disabled}
        draggable={draggable}
        searchable={searchable}
        formula={formula}
        renderEtrValue={renderEtrValue}
        popOverContainer={popOverContainer}
        selectMode={selectMode}
        depth={1}
        isAddBtnVisibleOn={isAddBtnVisibleOn}
        isAddGroupBtnVisibleOn={isAddGroupBtnVisibleOn}
        showIf={showIf}
        formulaForIf={formulaForIf}
        testIdBuilder={testIdBuilder?.getChild('group')}
      />
    );
  }

  render() {
    const {
      classnames: cx,
      placeholder,
      embed = true,
      pickerIcon,
      locale,
      translate,
      classPrefix,
      onChange: onFinalChange,
      value,
      title,
      popOverContainer,
      testIdBuilder,
      mobileUI
    } = this.props;

    const disabled = value?.disabled ?? this.props.disabled;

    if (embed) {
      return this.renderBody(onFinalChange, value, popOverContainer);
    }

    /** 因为 ConditionBuilder特殊的数据结构，提供给 ResultBox 的需要处理一下 */
    const resultBoxValue =
      embed === false
        ? !value ||
          !value?.hasOwnProperty('children') ||
          !Array.isArray(value.children) ||
          value.children.length < 1
          ? undefined
          : value
        : value;

    return (
      <PickerContainer
        classnames={cx}
        classPrefix={classPrefix}
        translate={translate}
        locale={locale}
        onConfirm={onFinalChange}
        value={value}
        size={'md'}
        popOverContainer={popOverContainer}
        bodyRender={(params: {
          value: AMISConditionGroupValue;
          onChange: (value: AMISConditionGroupValue) => void;
        }) => this.renderBody(params.onChange, params.value)}
        title={title}
      >
        {({onClick, isOpened}) => (
          <ResultBox
            classnames={cx}
            classPrefix={classPrefix}
            translate={translate}
            locale={locale}
            className={cx('CBGroup-result', {'is-active': isOpened})}
            allowInput={false}
            clearable={true}
            result={resultBoxValue}
            itemRender={this.highlightValue}
            onResultChange={noop}
            onClear={this.handleClear}
            disabled={disabled}
            borderMode={'full'}
            placeholder={placeholder}
            actions={
              pickerIcon && (
                <span className={cx('CBPicker-trigger')} onClick={onClick}>
                  {pickerIcon}
                </span>
              )
            }
            mobileUI={mobileUI}
            onResultClick={onClick}
            testIdBuilder={testIdBuilder?.getChild('result-box')}
          ></ResultBox>
        )}
      </PickerContainer>
    );
  }
}

export default themeable(
  localeable(
    uncontrollable(QueryBuilder, {
      value: 'onChange'
    })
  )
);
