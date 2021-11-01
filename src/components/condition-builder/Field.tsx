import React from 'react';
import PopOverContainer from '../PopOverContainer';
import ListRadios from '../ListRadios';
import ResultBox from '../ResultBox';
import {ClassNamesFn, ThemeProps, themeable} from '../../theme';
import {Icon} from '../icons';
import {findTree, noop} from '../../utils/helper';
import {localeable, LocaleProps} from '../../locale';
import SearchBox from '../SearchBox';

export interface ConditionFieldProps extends ThemeProps, LocaleProps {
  options: Array<any>;
  value: any;
  onChange: (value: any) => void;
  disabled?: boolean;
  fieldClassName?: string;
  searchable?: boolean;
}

export interface ConditionFieldState {
  options: Array<any>;
}

const option2value = (item: any) => item.name;

export class ConditionField extends React.Component<
  ConditionFieldProps,
  ConditionFieldState
> {
  constructor(props: ConditionFieldProps) {
    super(props);
    this.state = {
      options: props.options
    };
    this.onSearch = this.onSearch.bind(this);
  }

  onSearch(text: string) {
    let txt = text.toLowerCase();

    this.setState({
      options: this.props.options
        .map((item: any) => {
          if (item.children) {
            let children = item.children.filter((child: any) => {
              return (
                child.name.toLowerCase().includes(txt) ||
                child.label.toLowerCase().includes(txt)
              );
            });
            return children.length > 0
              ? Object.assign({}, item, {children}) // 需要copy一份，防止覆盖原始数据
              : false;
          } else {
            return item.name.toLowerCase().includes(txt) ||
              item.label.toLowerCase().includes(txt)
              ? item
              : false;
          }
        })
        .filter((item: any) => {
          return !!item;
        })
    });
  }

  // 选了值，还原options
  onPopClose(e: React.MouseEvent, onClose: () => void) {
    this.setState({
      options: this.props.options
    });
    onClose();
  }

  render() {
    const {
      options,
      onChange,
      value,
      classnames: cx,
      fieldClassName,
      disabled,
      translate: __,
      searchable
    } = this.props;
    return (
      <PopOverContainer
        popOverRender={({onClose}) => (
          <>
            {searchable ? (
              <SearchBox mini={false} onSearch={this.onSearch} />
            ) : null}
            <ListRadios
              onClick={e => this.onPopClose(e, onClose)}
              showRadio={false}
              options={this.state.options}
              value={value}
              option2value={option2value}
              onChange={onChange}
            />
          </>
        )}
      >
        {({onClick, ref, isOpened}) => (
          <div className={cx('CBGroup-field')}>
            <ResultBox
              className={cx(
                'CBGroup-fieldInput',
                fieldClassName,
                isOpened ? 'is-active' : ''
              )}
              ref={ref}
              allowInput={false}
              result={
                value
                  ? findTree(options, item => item.name === value)?.label
                  : ''
              }
              onResultChange={noop}
              onResultClick={onClick}
              placeholder={__('Condition.field_placeholder')}
              disabled={disabled}
            >
              <span className={cx('CBGroup-fieldCaret')}>
                <Icon icon="caret" className="icon" />
              </span>
            </ResultBox>
          </div>
        )}
      </PopOverContainer>
    );
  }
}

export default themeable(localeable(ConditionField));
