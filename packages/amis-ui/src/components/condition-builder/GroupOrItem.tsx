import {ConditionBuilderConfig} from './config';
import {ConditionBuilderFields, ConditionBuilderFuncs} from './types';
import {ThemeProps, themeable, autobind} from 'amis-core';
import React from 'react';
import {Icon} from '../icons';
import ConditionGroup from './Group';
import ConditionItem from './Item';
import FormulaPicker, {FormulaPickerProps} from '../formula/Picker';
import Button from '../Button';
import type {AMISConditionGroupValue, AMISConditionValue} from 'amis-core';
import TooltipWrapper from '../TooltipWrapper';
import type {TestIdBuilder} from 'amis-core';

export interface CBGroupOrItemProps extends ThemeProps {
  builderMode?: 'simple' | 'full';
  config: ConditionBuilderConfig;
  value?: AMISConditionGroupValue;
  fields: ConditionBuilderFields;
  funcs?: ConditionBuilderFuncs;
  index: number;
  data?: any;
  draggable?: boolean;
  disabled?: boolean;
  searchable?: boolean;
  onChange: (value: AMISConditionGroupValue, index: number) => void;
  removeable?: boolean;
  onDragStart?: (e: React.MouseEvent) => void;
  onRemove?: (index: number) => void;
  fieldClassName?: string;
  formula?: FormulaPickerProps;
  popOverContainer?: any;
  renderEtrValue?: any;
  selectMode?: 'list' | 'tree' | 'chained';
  isCollapsed?: boolean;
  depth: number;
  isAddBtnVisibleOn?: (param: {
    depth: number;
    breadth: number;
  }) => boolean | undefined;
  isAddGroupBtnVisibleOn?: (param: {
    depth: number;
    breadth: number;
  }) => boolean | undefined;
  showIf?: boolean;
  formulaForIf?: FormulaPickerProps;
  testIdBuilder?: TestIdBuilder;
}

export class CBGroupOrItem extends React.Component<CBGroupOrItemProps> {
  state = {
    hover: false
  };
  @autobind
  handleItemChange(value: any) {
    this.props.onChange(value, this.props.index);
  }

  @autobind
  handleItemRemove() {
    this.props.onRemove?.(this.props.index);
  }

  @autobind
  handlerHoverIn(e: any) {
    if (this.props.mobileUI) {
      return;
    }
    e.stopPropagation();
    this.setState({
      hover: true
    });
  }

  @autobind
  handlerHoverOut(e: any) {
    this.setState({
      hover: false
    });
  }

  @autobind
  handleIfChange(condition: string) {
    const value: AMISConditionGroupValue = {
      ...(this.props.value as any),
      if: condition
    };
    this.props.onChange(value, this.props.index);
  }

  render() {
    const {
      builderMode,
      classnames: cx,
      fieldClassName,
      value,
      config,
      fields,
      funcs,
      draggable,
      data,
      searchable,
      onDragStart,
      formula,
      popOverContainer,
      selectMode,
      renderEtrValue,
      isCollapsed,
      depth,
      isAddBtnVisibleOn,
      isAddGroupBtnVisibleOn,
      showIf,
      formulaForIf,
      testIdBuilder,
      mobileUI
    } = this.props;

    const disabled = value?.disabled ?? this.props.disabled;

    return (
      <div
        className={cx(
          `CBGroupOrItem${builderMode === 'simple' ? '-simple' : ''}`,
          {'is-mobile': mobileUI}
        )}
        data-id={value?.id}
      >
        <div className={cx('CBGroupOrItem-body')}>
          {value?.conjunction ? (
            <div
              className={cx('CBGroupOrItem-body-group', {
                'is-hover': this.state.hover || mobileUI
              })}
              onMouseOver={this.handlerHoverIn}
              onMouseOut={this.handlerHoverOut}
            >
              {draggable && !disabled ? (
                <a
                  draggable
                  onDragStart={onDragStart}
                  className={cx('CBGroupOrItem-dragbar')}
                >
                  <Icon icon="drag-bar" className="icon" />
                </a>
              ) : null}
              <ConditionGroup
                isCollapsed={isCollapsed}
                draggable={draggable}
                disabled={disabled}
                searchable={searchable}
                selectMode={selectMode}
                onDragStart={onDragStart}
                config={config}
                fields={fields}
                formula={formula}
                value={value as AMISConditionGroupValue}
                onChange={this.handleItemChange}
                fieldClassName={fieldClassName}
                funcs={funcs}
                removeable
                onRemove={this.handleItemRemove}
                data={data}
                renderEtrValue={renderEtrValue}
                depth={depth + 1}
                isAddBtnVisibleOn={isAddBtnVisibleOn}
                isAddGroupBtnVisibleOn={isAddGroupBtnVisibleOn}
                showIf={showIf}
                formulaForIf={formulaForIf}
                testIdBuilder={testIdBuilder?.getChild(`sub-${depth}`)}
              />
            </div>
          ) : (
            <div className={cx('CBGroupOrItem-body-item')}>
              {draggable && !disabled ? (
                <a
                  draggable
                  onDragStart={onDragStart}
                  className={cx('CBGroupOrItem-dragbar')}
                >
                  <Icon icon="drag-bar" className="icon" />
                </a>
              ) : null}
              <ConditionItem
                disabled={disabled}
                searchable={searchable}
                config={config}
                fields={fields}
                value={value as AMISConditionValue}
                onChange={this.handleItemChange}
                fieldClassName={fieldClassName}
                funcs={funcs}
                data={data}
                formula={formula}
                popOverContainer={popOverContainer}
                renderEtrValue={renderEtrValue}
                selectMode={selectMode}
                testIdBuilder={testIdBuilder?.getChild(`cItem`)}
              />
              {showIf ? (
                <FormulaPicker
                  {...formulaForIf}
                  evalMode={true}
                  mixedMode={false}
                  header="设置条件"
                  value={value?.if || ''}
                  onChange={this.handleIfChange}
                >
                  {({onClick}) => (
                    <TooltipWrapper
                      tooltip={
                        '配置启动条件，当前规则只有在此条件成立时才会生效'
                      }
                      tooltipTheme="dark"
                      container={popOverContainer}
                    >
                      <a
                        className={cx('CBIf', value?.if ? 'is-active' : '')}
                        onClick={onClick}
                      >
                        <Icon icon="if" className="icon" />
                      </a>
                    </TooltipWrapper>
                  )}
                </FormulaPicker>
              ) : null}
              <Button
                className={cx('CBDelete')}
                onClick={this.handleItemRemove}
                disabled={disabled}
                level="link"
                testIdBuilder={testIdBuilder?.getChild(`delete`)}
              >
                <Icon icon="remove" className="icon" />
              </Button>
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default themeable(CBGroupOrItem);
