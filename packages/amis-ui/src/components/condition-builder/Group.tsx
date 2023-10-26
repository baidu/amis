import React from 'react';
import {ConditionBuilderFields, ConditionBuilderFuncs} from './types';
import {
  ThemeProps,
  themeable,
  autobind,
  localeable,
  LocaleProps,
  guid,
  ConditionGroupValue,
  isPureVariable,
  resolveVariableAndFilter
} from 'amis-core';
import Button from '../Button';
import GroupOrItem from './GroupOrItem';
import {ConditionBuilderConfig} from './config';
import {FormulaPickerProps} from '../formula/Picker';
import Select from '../Select';

import {DownArrowBoldIcon} from '../icons';

interface ConditionGroupState {
  isCollapsed: boolean;
}

export interface ConditionGroupProps extends ThemeProps, LocaleProps {
  builderMode?: 'simple' | 'full';
  config: ConditionBuilderConfig;
  value?: ConditionGroupValue;
  fields: ConditionBuilderFields;
  funcs?: ConditionBuilderFuncs;
  showNot?: boolean;
  showANDOR?: boolean;
  showIf?: boolean;
  formulaForIf?: FormulaPickerProps;
  data?: any;
  disabled?: boolean;
  searchable?: boolean;
  onChange: (value: ConditionGroupValue) => void;
  removeable?: boolean;
  onRemove?: (e: React.MouseEvent) => void;
  draggable?: boolean;
  onDragStart?: (e: React.MouseEvent) => void;
  fieldClassName?: string;
  formula?: FormulaPickerProps;
  popOverContainer?: any;
  renderEtrValue?: any;
  selectMode?: 'list' | 'tree' | 'chained';
  isCollapsed?: boolean; // 是否折叠
  depth: number;
  isAddBtnVisibleOn?: (param: {depth: number; breadth: number}) => boolean;
  isAddGroupBtnVisibleOn?: (param: {depth: number; breadth: number}) => boolean;
}

export class ConditionGroup extends React.Component<
  ConditionGroupProps,
  ConditionGroupState
> {
  constructor(props: ConditionGroupProps) {
    super(props);

    this.state = {
      isCollapsed: false
    };
  }

  componentDidUpdate(prevProps: Readonly<ConditionGroupProps>): void {
    // 上层折叠的时候，内层也折叠，主要是为了处理，子节点中，第一项也是Group的折叠场景
    if (prevProps.isCollapsed !== this.props.isCollapsed) {
      this.setState({
        isCollapsed: this.props.isCollapsed || false
      });
    }
  }

  getValue() {
    return {
      id: guid(),
      conjunction: 'and',
      ...this.props.value
    } as ConditionGroupValue;
  }

  @autobind
  handleNotClick() {
    const onChange = this.props.onChange;
    let value = this.getValue();
    value.not = !value.not;

    onChange(value);
  }

  @autobind
  handleConjunctionChange(val: {value: 'or' | 'and'}) {
    const onChange = this.props.onChange;
    let value = this.getValue();
    value.conjunction = val.value;
    onChange(value);
  }

  @autobind
  handleAdd() {
    const onChange = this.props.onChange;
    let value = this.getValue();

    value.children = Array.isArray(value.children)
      ? value.children.concat()
      : [];

    value.children.push({
      id: guid()
    });
    onChange(value);
  }

  @autobind
  handleAddGroup() {
    const onChange = this.props.onChange;
    let value = this.getValue();

    value.children = Array.isArray(value.children)
      ? value.children.concat()
      : [];

    value.children.push({
      id: guid(),
      conjunction: 'and',
      children: [
        {
          id: guid()
        }
      ]
    });
    onChange(value);
  }

  @autobind
  handleItemChange(item: any, index: number) {
    const onChange = this.props.onChange;
    let value = this.getValue();

    value.children = Array.isArray(value.children)
      ? value.children.concat()
      : [];

    value.children.splice(index!, 1, item);
    onChange(value);
  }

  @autobind
  handleItemRemove(index: number) {
    const onChange = this.props.onChange;
    let value = this.getValue();

    value.children = Array.isArray(value.children)
      ? value.children.concat()
      : [];

    value.children.splice(index, 1);
    onChange(value);
  }

  @autobind
  toggleCollapse() {
    this.setState(state => {
      return {
        isCollapsed: !state.isCollapsed
      };
    });
  }

  render() {
    const {
      builderMode,
      classnames: cx,
      fieldClassName,
      value,
      data,
      fields,
      funcs,
      config,
      removeable,
      onRemove,
      onDragStart,
      showNot,
      showANDOR = false,
      disabled,
      searchable,
      translate: __,
      formula,
      popOverContainer,
      selectMode,
      renderEtrValue,
      draggable,
      depth,
      isAddBtnVisibleOn,
      isAddGroupBtnVisibleOn,
      showIf,
      formulaForIf
    } = this.props;
    const {isCollapsed} = this.state;

    const body =
      Array.isArray(value?.children) && value!.children.length
        ? isCollapsed
          ? value!.children.slice(0, 1)
          : value!.children
        : null;

    const param = {depth, breadth: body?.length ?? 0};
    const addConditionVisibleBool = isAddBtnVisibleOn?.(param) ?? true;
    const addConditionGroupVisibleBool =
      isAddGroupBtnVisibleOn?.(param) ?? true;

    return (
      <div className={cx('CBGroup')} data-group-id={value?.id}>
        {builderMode === 'simple' && showANDOR === false ? null : (
          <div
            className={cx('CBGroup-toolbarCondition')}
            draggable={draggable}
            onDragStart={onDragStart}
          >
            {Array.isArray(value?.children) && value!.children.length > 1 ? (
              <div
                className={cx('CBGroup-toolbarCondition-arrow', {
                  'is-collapse': isCollapsed
                })}
                onClick={this.toggleCollapse}
              >
                <DownArrowBoldIcon />
              </div>
            ) : null}
            {showNot ? (
              <Button
                onClick={this.handleNotClick}
                className="m-b-sm z-10"
                size="xs"
                active={value?.not}
                disabled={disabled}
              >
                {__('Condition.not')}
              </Button>
            ) : null}
            <Select
              options={[
                {
                  label: __('Condition.and'),
                  value: 'and'
                },
                {
                  label: __('Condition.or'),
                  value: 'or'
                }
              ]}
              value={value?.conjunction || 'and'}
              disabled={disabled}
              onChange={this.handleConjunctionChange}
              clearable={false}
            />
          </div>
        )}
        <div className={cx('CBGroup-body-wrapper')}>
          <div className={cx('CBGroup-body')}>
            {body ? (
              body.map((item, index) => (
                <GroupOrItem
                  draggable={draggable && value!.children!.length > 1}
                  onDragStart={onDragStart}
                  config={config}
                  key={item.id}
                  fields={fields}
                  fieldClassName={fieldClassName}
                  value={item as ConditionGroupValue}
                  index={index}
                  onChange={this.handleItemChange}
                  funcs={funcs}
                  onRemove={this.handleItemRemove}
                  data={data}
                  disabled={disabled}
                  searchable={searchable}
                  builderMode={builderMode}
                  formula={formula}
                  popOverContainer={popOverContainer}
                  renderEtrValue={renderEtrValue}
                  selectMode={selectMode}
                  isCollapsed={isCollapsed}
                  depth={depth}
                  isAddBtnVisibleOn={isAddBtnVisibleOn}
                  isAddGroupBtnVisibleOn={isAddGroupBtnVisibleOn}
                  showIf={showIf}
                  formulaForIf={formulaForIf}
                />
              ))
            ) : (
              <div
                className={cx(
                  `CBGroup-placeholder ${
                    builderMode === 'simple' ? 'simple' : ''
                  }`
                )}
              >
                {__('Condition.blank')}
              </div>
            )}
            {isCollapsed ? (
              <div className={cx('CBGroup-body-collapse')}>
                <span onClick={this.toggleCollapse}>
                  {__('Condition.collapse')} <DownArrowBoldIcon />
                </span>
              </div>
            ) : null}
          </div>

          {isCollapsed ? null : (
            <div
              className={cx('CBGroup-toolbar')}
              draggable={draggable}
              onDragStart={onDragStart}
            >
              <div
                className={cx(
                  `CBGroup-toolbarConditionAdd${
                    builderMode === 'simple' ? '-simple' : ''
                  }`
                )}
              >
                <div className={cx('ButtonGroup')}>
                  {addConditionVisibleBool ? (
                    <Button
                      level="link"
                      onClick={this.handleAdd}
                      size="xs"
                      disabled={disabled}
                    >
                      {__('Condition.add_cond')}
                    </Button>
                  ) : null}
                  {addConditionGroupVisibleBool && builderMode !== 'simple' ? (
                    <Button
                      onClick={this.handleAddGroup}
                      size="xs"
                      disabled={disabled}
                      level="link"
                    >
                      {__('Condition.add_cond_group')}
                    </Button>
                  ) : null}
                  {removeable ? (
                    <Button
                      onClick={onRemove}
                      size="xs"
                      disabled={disabled}
                      level="link"
                    >
                      {__('Condition.delete_cond_group')}
                    </Button>
                  ) : null}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default themeable(localeable(ConditionGroup));
