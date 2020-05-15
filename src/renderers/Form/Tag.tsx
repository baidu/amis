import React from 'react';
import {OptionsControl, OptionsControlProps, Option} from './Options';
import cx from 'classnames';
import {Action} from '../../types';
import Downshift from 'downshift';
import matchSorter from 'match-sorter';
import debouce from 'lodash/debounce';
import find from 'lodash/find';
import {Icon} from '../../components/icons';
import {Portal} from 'react-overlays';
import {findDOMNode} from 'react-dom';
import ResultBox from '../../components/ResultBox';
import {autobind, filterTree} from '../../utils/helper';
import Spinner from '../../components/Spinner';
import Overlay from '../../components/Overlay';
import PopOver from '../../components/PopOver';
import ListMenu from '../../components/ListMenu';
import {Options} from '../../components/Select';

// declare function matchSorter(items:Array<any>, input:any, options:any): Array<any>;

export interface TagProps extends OptionsControlProps {
  placeholder?: string;
  clearable: boolean;
  resetValue?: any;
  optionsTip: string;
}

export interface TagState {
  inputValue: string;
  isFocused?: boolean;
  isOpened?: boolean;
}

export default class TagControl extends React.PureComponent<
  TagProps,
  TagState
> {
  input: React.RefObject<any> = React.createRef();

  static defaultProps = {
    resetValue: '',
    labelField: 'label',
    valueField: 'value',
    multiple: true,
    placeholder: '暂无标签'
  };

  state = {
    isOpened: false,
    inputValue: '',
    isFocused: false
  };

  componentWillReceiveProps(nextProps: TagProps) {
    const props = this.props;

    if (props.value !== nextProps.value) {
      this.setState({
        inputValue: ''
      });
    }
  }

  addItem(option: Option) {
    const {
      selectedOptions,
      onChange,
      joinValues,
      extractValue,
      delimiter,
      valueField
    } = this.props;
    const newValue = selectedOptions.concat();

    if (find(newValue, item => item.value == option.value)) {
      return;
    }

    newValue.push(option);

    onChange(
      joinValues
        ? newValue
            .map(item => item[valueField || 'value'])
            .join(delimiter || ',')
        : extractValue
        ? newValue.map(item => item[valueField || 'value'])
        : newValue
    );
  }

  @autobind
  handleFocus(e: any) {
    this.setState({
      isFocused: true,
      isOpened: true
    });

    this.props.onFocus && this.props.onFocus(e);
  }

  @autobind
  handleBlur(e: any) {
    const {
      selectedOptions,
      onChange,
      joinValues,
      extractValue,
      delimiter,
      valueField
    } = this.props;

    const value = this.state.inputValue.trim();
    this.props.onBlur && this.props.onBlur(e);
    this.setState(
      {
        isFocused: false,
        isOpened: false,
        inputValue: ''
      },
      value
        ? () => {
            const newValue = selectedOptions.concat();
            if (!find(newValue, item => item.value === value)) {
              const option = {
                label: value,
                value: value
              };
              newValue.push(option);
              onChange(
                joinValues
                  ? newValue
                      .map(item => item[valueField || 'value'])
                      .join(delimiter || ',')
                  : extractValue
                  ? newValue.map(item => item[valueField || 'value'])
                  : newValue
              );
            }
          }
        : undefined
    );
  }

  @autobind
  close() {
    this.setState({
      isOpened: false
    });
  }

  @autobind
  handleInputChange(e: React.ChangeEvent<any>) {
    this.setState({
      inputValue: e.currentTarget.value
    });
  }

  @autobind
  handleChange(value: Array<Option>) {
    const {
      joinValues,
      extractValue,
      delimiter,
      valueField,
      onChange
    } = this.props;

    let newValue: any = Array.isArray(value) ? value.concat() : [];

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
    const {labelField} = this.props;
    return item[labelField || 'label'];
  }

  @autobind
  handleKeyDown(evt: React.KeyboardEvent<HTMLInputElement>) {
    const {
      selectedOptions,
      onChange,
      joinValues,
      extractValue,
      delimiter,
      valueField
    } = this.props;

    const value = this.state.inputValue.trim();

    if (selectedOptions.length && !value && evt.key == 'Backspace') {
      const newValue = selectedOptions.concat();
      newValue.pop();

      onChange(
        joinValues
          ? newValue
              .map(item => item[valueField || 'value'])
              .join(delimiter || ',')
          : extractValue
          ? newValue.map(item => item[valueField || 'value'])
          : newValue
      );
    } else if (value && (evt.key === 'Enter' || evt.key === delimiter)) {
      evt.preventDefault();
      evt.stopPropagation();
      const newValue = selectedOptions.concat();

      if (!find(newValue, item => item.value == value)) {
        newValue.push({
          label: value,
          value: value
        });

        onChange(
          joinValues
            ? newValue
                .map(item => item[valueField || 'value'])
                .join(delimiter || ',')
            : extractValue
            ? newValue.map(item => item[valueField || 'value'])
            : newValue
        );
      }

      this.setState({
        inputValue: ''
      });
    }
  }

  @autobind
  handleOptionChange(option: Option) {
    if (this.state.inputValue || !option) {
      return;
    }
    this.addItem(option);
  }

  @autobind
  getTarget() {
    return this.input.current;
  }

  @autobind
  getParent() {
    return this.input.current && findDOMNode(this.input.current)!.parentElement;
  }

  reload() {
    const reload = this.props.reloadOptions;
    reload && reload();
  }

  render() {
    const {
      className,
      classnames: cx,
      disabled,
      placeholder,
      name,
      clearable,
      selectedOptions,
      loading,
      popOverContainer,
      options
    } = this.props;

    const finnalOptions = Array.isArray(options)
      ? filterTree(
          options,
          item =>
            (Array.isArray(item.children) && !!item.children.length) ||
            (item.value !== undefined && !~selectedOptions.indexOf(item)),
          0,
          true
        )
      : [];

    return (
      <Downshift
        selectedItem={selectedOptions}
        isOpen={this.state.isFocused}
        inputValue={this.state.inputValue}
        onChange={this.handleOptionChange}
        itemToString={this.renderItem}
      >
        {({isOpen, highlightedIndex, getItemProps, getInputProps}) => {
          return (
            <div className={cx(className, `TagControl`)}>
              <ResultBox
                {...getInputProps({
                  name,
                  ref: this.input,
                  placeholder: placeholder || '暂无标签',
                  onChange: this.handleInputChange,
                  value: this.state.inputValue,
                  onKeyDown: this.handleKeyDown,
                  onFocus: this.handleFocus,
                  onBlur: this.handleBlur,
                  disabled
                })}
                className={cx('TagControl-input')}
                result={selectedOptions}
                onResultChange={this.handleChange}
                itemRender={this.renderItem}
                clearable={clearable}
                allowInput
              >
                {loading ? <Spinner size="sm" /> : undefined}
              </ResultBox>

              <Overlay
                container={popOverContainer || this.getParent}
                target={this.getTarget}
                placement={'auto'}
                show={isOpen && !!finnalOptions.length}
              >
                <PopOver
                  overlay
                  className={cx('TagControl-popover')}
                  onHide={this.close}
                >
                  <ListMenu
                    options={finnalOptions}
                    itemRender={this.renderItem}
                    highlightIndex={highlightedIndex}
                    getItemProps={({item, index}) => ({
                      ...getItemProps({
                        index,
                        item,
                        disabled: item.disabled
                      })
                    })}
                  />
                </PopOver>
              </Overlay>
            </div>
          );
        }}
      </Downshift>
    );
  }
}

@OptionsControl({
  type: 'tag'
})
export class TagControlRenderer extends TagControl {}
