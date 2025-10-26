import React from 'react';
import {
  ConditionFieldFunc,
  ConditionBuilderField,
  ConditionBuilderFuncs
} from './types';
import {
  ThemeProps,
  themeable,
  utils,
  autobind,
  localeable,
  LocaleProps,
  findTree,
  noop
} from 'amis-core';
import PopOverContainer from '../PopOverContainer';
import GroupedSelection from '../GroupedSelection';
import ResultBox from '../ResultBox';
import {Icon} from '../icons';
import Expression from './Expression';
import {ConditionBuilderConfig} from './config';
import type {TestIdBuilder, AMISExpressionFunc} from 'amis-core';

export interface ConditionFuncProps extends ThemeProps, LocaleProps {
  value: AMISExpressionFunc;
  onChange: (value: AMISExpressionFunc) => void;
  disabled?: boolean;
  config: ConditionBuilderConfig;
  fields?: ConditionBuilderField[];
  funcs?: ConditionBuilderFuncs;
  allowedTypes?: Array<'value' | 'field' | 'func'>;
  fieldClassName?: string;
  testIdBuilder?: TestIdBuilder;
}

const option2value = (item: ConditionFieldFunc) => item.type;

export class ConditionFunc extends React.Component<ConditionFuncProps> {
  @autobind
  handleFuncChange(type: string) {
    const value = {...this.props.value};
    value.func = type;
    this.props.onChange(value);
  }

  @autobind
  handleArgChange(arg: any, index: number) {
    const value = {...this.props.value};
    value.args = Array.isArray(value.args) ? value.args.concat() : [];
    value.args.splice(index, 1, arg);
    this.props.onChange(value);
  }

  renderFunc(func: ConditionFieldFunc) {
    const {
      classnames: cx,
      fields,
      value,
      funcs,
      config,
      disabled,
      testIdBuilder
    } = this.props;

    return (
      <div className={cx('CBFunc-args')}>
        <span>(</span>
        {Array.isArray(func.args) && func.args.length ? (
          <div>
            {func.args.map((item, index) => (
              <Expression
                config={config}
                key={index}
                index={index}
                fields={fields}
                value={value?.args[index]}
                valueField={{type: item.type} as any}
                onChange={this.handleArgChange}
                funcs={funcs}
                disabled={disabled}
                testIdBuilder={testIdBuilder?.getChild(`exp-${index}`)}
                // allowedTypes={allowedTypes}
              />
            ))}
          </div>
        ) : null}
        <span>)</span>
      </div>
    );
  }

  render() {
    const {
      value,
      classnames: cx,
      fieldClassName,
      funcs,
      disabled,
      testIdBuilder,
      translate: __
    } = this.props;
    const func = value
      ? findTree(
          funcs!,
          item => (item as ConditionFieldFunc).type === value.func
        )
      : null;

    return (
      <div className={cx('CBFunc')}>
        <PopOverContainer
          popOverRender={({onClose}) => (
            <GroupedSelection
              onClick={onClose}
              options={funcs!}
              value={(func as ConditionFieldFunc)?.type}
              option2value={option2value}
              onChange={this.handleFuncChange}
              multiple={false}
              testIdBuilder={testIdBuilder?.getChild('group')}
            />
          )}
        >
          {({onClick, ref, isOpened}) => (
            <div className={cx('CBFunc-select')}>
              <ResultBox
                className={cx(
                  'CBGroup-fieldInput',
                  fieldClassName,
                  isOpened ? 'is-active' : ''
                )}
                ref={ref}
                allowInput={false}
                result={func}
                onResultChange={noop}
                onResultClick={onClick}
                placeholder={__('Condition.field_placeholder')}
                disabled={disabled}
                testIdBuilder={testIdBuilder?.getChild('resbox')}
              >
                <span className={cx('CBGroup-fieldCaret')}>
                  <Icon icon="right-arrow-bold" className="icon" />
                </span>
              </ResultBox>
            </div>
          )}
        </PopOverContainer>

        {func ? (
          this.renderFunc(func as ConditionFieldFunc)
        ) : (
          <span className={cx('CBFunc-error')}>
            {__('Condition.fun_error')}
          </span>
        )}
      </div>
    );
  }
}

export default themeable(localeable(ConditionFunc));
