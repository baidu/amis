/**
 * @file table/HeadCellFilter
 * @author fex
 */

import React from 'react';
import {findDOMNode} from 'react-dom';
import isEqual from 'lodash/isEqual';

import {themeable, ThemeProps} from '../../theme';
import {LocaleProps, localeable} from '../../locale';
import Overlay from '../Overlay';
import PopOver from '../PopOver';
import CheckBox from '../Checkbox';
import Button from '../Button';
import {Icon} from '../icons';

export interface Props extends ThemeProps, LocaleProps {
  column: any;
  popOverContainer?: () => Element | Text | null;
  onFilter?: Function;
  onQuery?: Function;
  filteredValue?: Array<string>;
  filterMultiple?: boolean;
}

export interface OptionProps {
  text: string;
  value: string;
  selected?: boolean;
  children?: Array<OptionProps>;
}

export interface State {
  options: Array<OptionProps>;
  isOpened: boolean;
  filteredValue:  Array<string>;
}

export class HeadCellFilter extends React.Component<Props, State> {
  static defaultProps = {
    filteredValue: [],
    filterMultiple: false
  };

  constructor(props: Props) {
    super(props);

    this.state = {
      options: [],
      isOpened: false,
      filteredValue: props.filteredValue || []
    }

    this.openLayer = this.openLayer.bind(this);
    this.closeLayer = this.closeLayer.bind(this);
  }

  alterOptions(options: Array<any>) {
    const {column} = this.props;

    options = options.map(option => ({
      ...option,
      selected: this.state.filteredValue.indexOf(option.value) > -1
    }));

    return options;
  }

  componentDidMount() {
    const {column} = this.props;
    if (column.filters && column.filters.length > 0) {
      this.setState({options: this.alterOptions(column.filters)});
    }
  }

  componentDidUpdate(prevProps: Props, prevState: State) {
    const {column} = this.props;
    if (column.filters && column.filters.length > 0
      && !isEqual(prevState.filteredValue, this.state.filteredValue)) {
      this.setState({options: this.alterOptions(column.filters)});
    }
  }

  render() {
    const {isOpened, options} = this.state;
    const {
      column,
      popOverContainer,
      classnames: cx,
      classPrefix: ns
    } = this.props;

    return (
      <span
        className={cx(
          `${ns}TableCell-filterBtn`,
          column.filtered || options && options.some((item: any) => item.selected) ? 'is-active' : ''
        )}
      >
        <span onClick={this.openLayer}>
          <Icon icon="column-filter" className="icon" />
        </span>
        {
          isOpened ? (
          <Overlay
            container={popOverContainer || (() => findDOMNode(this))}
            placement="left-bottom-left-top right-bottom-right-top"
            target={
              popOverContainer ? () => findDOMNode(this) : null
            }
            show
          >
            <PopOver
              classPrefix={ns}
              onHide={this.closeLayer}
              className={cx(
                `${ns}TableCell-filterPopOver`
              )}
              overlay
            >
              {options && options.length > 0 ? (
                <ul className={cx('DropDown-menu')}>
                  {!column.filterMultiple
                    ? options.map((option: any, index) => (
                        <li
                          key={index}
                          className={cx({
                            'is-active': option.selected
                          })}
                          onClick={this.handleClick.bind(this, option.value)}
                        >
                          {option.text}
                        </li>
                      ))
                    : options.map((option: any, index) => (
                        <li key={index}>
                          <CheckBox
                            classPrefix={ns}
                            onChange={this.handleCheck.bind(this, option.value)}
                            checked={option.selected}
                          >
                            {option.text}
                          </CheckBox>
                        </li>
                      ))}
                  {column.filterMultiple ? (
                    <li
                      key="DropDown-multiple-menu"
                      className={cx('DropDown-multiple-menu')}
                    >
                      <Button
                        size={'xs'}
                        level={'primary'}
                        onClick={this.handleConfirmClick.bind(this)}
                        >确定</Button>
                      <Button
                        size={'xs'}
                        onClick={this.handleCancelClick.bind(this)}
                        >取消</Button>
                    </li>
                  ) : null}
                </ul>
              ) : null}
            </PopOver>
          </Overlay>)
          : null
        }
      </span>
    );
  }

  openLayer() {
    this.setState({isOpened: true});
  }

  closeLayer() {
    this.setState({isOpened: false});
  }

  handleClick(value: string) {
    const {onQuery, column} = this.props;

    this.setState({filteredValue: [value]});

    onQuery && onQuery({[column.key] : value});
    this.closeLayer();
  }

  handleCheck(value: string) {
    const filteredValue = this.state.filteredValue;
    if (value) {
      this.setState({filteredValue: [...filteredValue, value]});
    } else {
      this.setState({filteredValue: filteredValue.filter(v => v !== value)});
    }
  }

  handleConfirmClick() {
    const {onQuery, column} = this.props;
    onQuery && onQuery({[column.key] : this.state.filteredValue});
    this.closeLayer();
  }

  handleCancelClick() {
    this.setState({filteredValue: []});
    this.closeLayer();
  }
}

export default themeable(localeable(HeadCellFilter));