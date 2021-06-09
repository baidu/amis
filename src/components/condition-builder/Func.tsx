import React from 'react';
import {Func, ExpressionFunc, Field, Funcs} from './types';
import {ThemeProps, themeable} from '../../theme';
import PopOverContainer from '../PopOverContainer';
import ListRadios from '../ListRadios';
import {autobind, findTree, noop} from '../../utils/helper';
import ResultBox from '../ResultBox';
import {Icon} from '../icons';
import Expression from './Expression';
import {Config} from './config';

export interface ConditionFuncProps extends ThemeProps {
  value: ExpressionFunc;
  onChange: (value: ExpressionFunc) => void;
  disabled?: boolean;
  config: Config;
  fields?: Field[];
  funcs?: Funcs;
  allowedTypes?: Array<'value' | 'field' | 'func' | 'formula'>;
  fieldClassName?: string;
}

const option2value = (item: Func) => item.type;

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

  renderFunc(func: Func) {
    const {classnames: cx, fields, value, funcs, config, disabled} = this.props;

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
    const {value, classnames: cx, fieldClassName, funcs, disabled} = this.props;
    const func = value
      ? findTree(funcs!, item => (item as Func).type === value.func)
      : null;

    return (
      <div className={cx('CBFunc')}>
        <PopOverContainer
          popOverRender={({onClose}) => (
            <ListRadios
              onClick={onClose}
              showRadio={false}
              options={funcs!}
              value={(func as Func)?.type}
              option2value={option2value}
              onChange={this.handleFuncChange}
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
                result={func?.label}
                onResultChange={noop}
                onResultClick={onClick}
                placeholder="请选择字段"
                disabled={disabled}
              >
                <span className={cx('CBGroup-fieldCaret')}>
                  <Icon icon="caret" className="icon" />
                </span>
              </ResultBox>
            </div>
          )}
        </PopOverContainer>

        {func ? (
          this.renderFunc(func as Func)
        ) : (
          <span className={cx('CBFunc-error')}>方法未定义</span>
        )}
      </div>
    );
  }
}

export default themeable(ConditionFunc);
