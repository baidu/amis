import React from 'react';
import cx from 'classnames';
import {matchSorter} from 'match-sorter';
import {FormItem, FormControlProps, autobind} from 'amis-core';
import {
  Modal,
  Button,
  Spinner,
  SearchBox,
  Icon,
  SpinnerExtraProps
} from 'amis-ui';

import debounce from 'lodash/debounce';
import find from 'lodash/find';
import {FormBaseControlSchema} from '../../Schema';

import * as IconSelectStore from './IconSelectStore';
export interface IconSelectControlSchema extends FormBaseControlSchema {
  type: 'icon-select';

  placeholder?: string;

  disabled?: boolean;

  noDataTip?: string;

  clearable?: boolean;
}

export interface IconSelectProps extends FormControlProps, SpinnerExtraProps {
  placeholder?: string;
  disabled?: boolean;
  noDataTip?: string;
}

export interface IconChecked {
  id: string;
  name?: string;
  svg?: string;
}

export interface IconSelectState {
  showModal: boolean;
  tmpCheckIconId: IconChecked | null;
  searchValue: string;
  activeTypeIndex: number;
  isRefreshLoading?: boolean;
}

/**
 * 新图标选择器
 */
export default class IconSelectControl extends React.PureComponent<
  IconSelectProps,
  IconSelectState
> {
  input?: HTMLInputElement;

  static defaultProps: Pick<IconSelectProps, 'noDataTip' | 'clearable'> = {
    noDataTip: 'placeholder.noData',
    clearable: true
  };

  state: IconSelectState = {
    activeTypeIndex: 0,
    showModal: false,
    tmpCheckIconId: null,
    searchValue: '',
    isRefreshLoading: false
  };

  constructor(props: IconSelectProps) {
    super(props);

    this.handleSearchValueChange = debounce(
      this.handleSearchValueChange.bind(this),
      300
    );
  }

  getValueBySvg(svg: string | undefined): IconSelectStore.SvgIcon | null {
    if (!svg || typeof svg !== 'string') {
      return null;
    }
    let findItem: IconSelectStore.SvgIcon | undefined = undefined;
    if (IconSelectStore.svgIcons && IconSelectStore.svgIcons.length) {
      for (let i = 0; i < IconSelectStore.svgIcons.length; i++) {
        findItem = find(
          IconSelectStore.svgIcons[i].children,
          i => i.svg === svg
        );
        if (findItem) {
          break;
        }
      }
    }
    return findItem || {name: svg, id: '', svg: ''};
  }

  @autobind
  handleClick() {
    if (this.props.disabled) {
      return;
    }

    this.toggleModel(true);
  }

  @autobind
  handleClear(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    this.props.onChange && this.props.onChange('');
  }

  @autobind
  renderInputArea() {
    const {
      classPrefix: ns,
      disabled,
      value: valueTemp,
      placeholder,
      clearable
    } = this.props;
    const value =
      typeof valueTemp === 'string' ? this.getValueBySvg(valueTemp) : valueTemp;
    const SvgStr =
      typeof valueTemp === 'string' && valueTemp.match(/(<svg.{1,}\/svg>)/);

    const pureValue =
      (value?.id && String(value.id).replace(/^svg-/, '')) || '';
    const iconName = value?.name || pureValue;

    return (
      <div className={cx(`${ns}IconSelectControl-input-area`)}>
        {pureValue ? (
          <div className={cx(`${ns}IconSelectControl-input-icon-show`)}>
            <svg>
              <use xlinkHref={`#${pureValue}`}></use>
            </svg>
          </div>
        ) : valueTemp ? (
          SvgStr ? (
            <div
              className={cx(`${ns}IconSelectControl-input-area-str-svg`)}
              dangerouslySetInnerHTML={{__html: SvgStr[0].replace(/\\"/g, '"')}}
            ></div>
          ) : (
            <Icon
              icon={valueTemp}
              className={cx(
                `${ns}IconSelectControl-input-area-iconfont`,
                'icon'
              )}
            />
          )
        ) : null}
        <span className={cx(`${ns}IconSelectControl-input-icon-id`)}>
          {iconName}
        </span>

        {clearable && !disabled && (pureValue || valueTemp) ? (
          <a
            onClick={this.handleClear}
            className={cx(`${ns}IconSelectControl-clear`)}
          >
            <Icon icon="input-clear" className="icon" />
          </a>
        ) : null}

        {(!value && placeholder && (
          <span className={cx(`${ns}IconSelectControl-input-icon-placeholder`)}>
            {placeholder}
          </span>
        )) ||
          null}
      </div>
    );
  }

  @autobind
  handleIconTypeClick(item: any, index: number) {
    this.setState({
      activeTypeIndex: index
    });
  }

  @autobind
  renderIconTypes() {
    const {classPrefix: ns} = this.props;

    const types = IconSelectStore.svgIcons.map(item => ({
      id: item.groupId,
      label: item.name
    }));

    return (
      <ul className={cx(`${ns}IconSelectControl-type-list`)}>
        {types.map((item, index) => (
          <li
            key={item.id}
            onClick={() => this.handleIconTypeClick(item, index)}
            className={cx({
              active: index === this.state.activeTypeIndex
            })}
          >
            {item.label}
          </li>
        ))}
      </ul>
    );
  }

  @autobind
  handleConfirm() {
    const checkedIcon = this.state.tmpCheckIconId;
    if (this.props.returnSvg) {
      this.props.onChange &&
        this.props.onChange((checkedIcon && checkedIcon.svg) || '');
    } else {
      this.props.onChange &&
        this.props.onChange(
          checkedIcon && checkedIcon.id
            ? {...checkedIcon, id: 'svg-' + checkedIcon.id}
            : ''
        );
    }

    this.toggleModel(false);
  }

  @autobind
  async handleLocalUpload(icon: string) {
    this.props.onChange && this.props.onChange(icon);

    this.toggleModel(false);
  }

  handleClickIconInModal(icon: IconChecked) {
    this.setState({
      tmpCheckIconId: icon?.id === this.state.tmpCheckIconId?.id ? null : icon
    });
  }

  @autobind
  renderIconList(icons: IconSelectStore.SvgIcon[]) {
    const {classPrefix: ns, noDataTip, translate: __} = this.props;

    if (!icons || !icons.length) {
      return (
        <p className={cx(`${ns}IconSelectControl-icon-list-empty`)}>
          {__(noDataTip)}
        </p>
      );
    }

    return (
      <ul className={cx(`${ns}IconSelectControl-icon-list`)}>
        {icons.map((item, index) => (
          <li key={item.id}>
            <div
              className={cx(`${ns}IconSelectControl-icon-list-item`, {
                active: this.state.tmpCheckIconId?.id === item.id
              })}
              onClick={() => this.handleClickIconInModal(item)}
            >
              <svg>
                <use xlinkHref={`#${item.id}`}></use>
              </svg>

              <div className={cx(`${ns}IconSelectControl-icon-list-item-info`)}>
                <p
                  className={cx(
                    `${ns}IconSelectControl-icon-list-item-info-name`
                  )}
                >
                  {item.name}
                </p>
              </div>
            </div>
          </li>
        ))}
      </ul>
    );
  }

  handleSearchValueChange(e: string) {
    this.setState({
      searchValue: e
    });
  }

  @autobind
  async handleRefreshIconList() {
    const refreshIconList = IconSelectStore.refreshIconList;

    if (refreshIconList && typeof refreshIconList === 'function') {
      try {
        this.setState({
          isRefreshLoading: true
        });
        await Promise.resolve(refreshIconList());
      } catch (e) {
        console.error(e);
      } finally {
        this.setState({
          isRefreshLoading: false
        });
      }
    }
  }

  @autobind
  renderModalContent() {
    const {
      render,
      classPrefix: ns,
      loadingConfig,
      funcSchema,
      funcCom: FuncCom
    } = this.props;

    const icons = this.getIconsByType();

    const inputValue = this.state.searchValue;

    const filteredIcons = inputValue
      ? matchSorter(icons, inputValue, {
          keys: ['name'],
          threshold: matchSorter.rankings.CONTAINS
        })
      : icons;
    return (
      <>
        <SearchBox
          className={cx(`${ns}IconSelectControl-Modal-search`)}
          mini={false}
          clearable
          onChange={this.handleSearchValueChange}
        />

        {(IconSelectStore.refreshIconList &&
          render(
            'refresh-btn',
            {
              type: 'button',
              icon: 'fa fa-refresh'
            },
            {
              className: cx(`${ns}IconSelectControl-Modal-refresh`),
              onClick: this.handleRefreshIconList
            }
          )) ||
          null}

        {FuncCom ? (
          <div className={cx(`${ns}IconSelectControl-Modal-func`)}>
            <FuncCom onUpload={this.handleLocalUpload} />
          </div>
        ) : null}

        <div className={cx(`${ns}IconSelectControl-Modal-content`)}>
          <Spinner
            size="lg"
            loadingConfig={loadingConfig}
            overlay
            key="info"
            show={this.state.isRefreshLoading}
          />
          <div className={cx(`${ns}IconSelectControl-Modal-content-aside`)}>
            {this.renderIconTypes()}
          </div>

          <div className={cx(`${ns}IconSelectControl-Modal-content-main`)}>
            {this.renderIconList(filteredIcons)}
          </div>
        </div>
      </>
    );
  }

  getIconsByType() {
    return (
      (IconSelectStore?.svgIcons.length &&
        IconSelectStore.svgIcons[this.state.activeTypeIndex as number]
          .children) ||
      []
    );
  }

  @autobind
  toggleModel(isShow?: boolean) {
    const {value: valueTemp} = this.props;
    const value =
      typeof valueTemp === 'string' ? this.getValueBySvg(valueTemp) : valueTemp;

    if (isShow === undefined) {
      this.setState({
        showModal: !this.state.showModal,
        searchValue: ''
      });
      return;
    }

    this.setState({
      showModal: isShow,
      // tmpCheckIconId: isShow ? String(value).replace('svg-', '') : '',
      tmpCheckIconId:
        isShow && value?.id
          ? {...value, id: String(value.id).replace(/^svg-/, '')}
          : null,
      searchValue: ''
    });
  }

  render() {
    const {
      className,
      style,
      classPrefix: ns,
      disabled,
      translate: __
    } = this.props;

    return (
      <div
        className={cx(className, `${ns}IconSelectControl`, {
          'is-focused': this.state.showModal,
          'is-disabled': disabled
        })}
      >
        <div
          className={cx(`${ns}IconSelectControl-input`)}
          onClick={this.handleClick}
        >
          {this.renderInputArea()}
        </div>

        <Modal
          show={this.state.showModal}
          closeOnOutside
          closeOnEsc
          size="lg"
          overlay
          onHide={() => this.toggleModel(false)}
        >
          <Modal.Header onClose={() => this.toggleModel(false)}>
            {__('IconSelect.choice')}
          </Modal.Header>

          <Modal.Body>{this.renderModalContent()}</Modal.Body>

          <Modal.Footer>
            <Button
              type="button"
              className="m-l"
              onClick={() => this.toggleModel(false)}
            >
              {__('cancel')}
            </Button>
            <Button type="button" level="primary" onClick={this.handleConfirm}>
              {__('confirm')}
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}

@FormItem({
  type: 'icon-select'
})
export class IconSelectControlRenderer extends IconSelectControl {}
