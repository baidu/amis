import React from 'react';
import cx from 'classnames';
import {matchSorter} from 'match-sorter';
import {
  FormItem,
  FormControlProps,
  autobind
} from 'amis-core';
import {Modal, Button, Spinner, SearchBox} from 'amis-ui';

import debounce from 'lodash/debounce';
import {FormBaseControlSchema} from '../../Schema';

import * as IconSelectStore from './IconSelectStore';


export interface IconSelectControlSchema extends FormBaseControlSchema {
  type: 'icon-select';
}

export interface IconSelectProps extends FormControlProps {
  placeholder?: string;
  disabled?: boolean;
  noDataTip?: string;
}

export interface IconSelectState {
  showModal: boolean;
  tmpCheckIconId: string;
  searchValue: string;
  activeTypeIndex: string | number;
  isRefreshLoading?: boolean;
}

export default class IconSelectControl extends React.PureComponent<
  IconSelectProps,
  IconSelectState
> {
  input?: HTMLInputElement;

  static defaultProps: Pick<
    IconSelectProps,
    'noDataTip'
  > = {
    noDataTip: 'placeholder.noData'
  };

  state: IconSelectState = {
    activeTypeIndex: 0,
    showModal: false,
    tmpCheckIconId: '',
    searchValue: '',
    isRefreshLoading: false
  };

  constructor(props: IconSelectProps) {
    super(props);

    this.handleSearchValueChange = debounce(this.handleSearchValueChange.bind(this), 300);
  }

  @autobind
  handleClick(){
    if (this.props.disabled) {
      return;
    }

    this.toggleModel(true);
  }

  @autobind
  renderInputArea() {
    const {classPrefix: ns, disabled, value, placeholder} = this.props;

    const pureValue = value && String(value).replace(/^svg-/, '') || '';

    return (
      <div className={cx(`${ns}IconSelectControl-input-area`)}>
        {
          pureValue && (
            <div className={cx(`${ns}IconSelectControl-input-icon-show`)}>
              <svg>
                  <use xlinkHref={`#${pureValue}`}></use>
              </svg>
            </div>
          )
        }
        <span className={cx(`${ns}IconSelectControl-input-icon-id`)}>{value}</span>

        {
          !value && !value && placeholder && (
            <span className={cx(`${ns}IconSelectControl-input-icon-placeholder`)}>{placeholder}</span>
          ) || null
        }
      </div>
    )
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
      id: item.typeId,
      label: item.name
    }));

    return (
      <ul className={cx(`${ns}IconSelectControl-type-list`)}>
        {
          types.map((item, index) => (
            <li
              key={item.id}
              onClick={() => this.handleIconTypeClick(item, index)}
              className={cx({
                'active': index === this.state.activeTypeIndex
              })}
            >{item.label}</li>
          ))
        }
      </ul>
    )
  }

  @autobind
  handleConfirm() {
    const iconId = this.state.tmpCheckIconId;
    this.props.onChange && this.props.onChange(
      iconId ? 'svg-' + iconId : ''
    );

    this.toggleModel(false);
  }

  handleClickIconInModal(iconId: string) {
    this.setState({
      tmpCheckIconId: iconId === this.state.tmpCheckIconId ? '' : iconId
    });
  }

  @autobind
  renderIconList(icons: any[]) {
    const {classPrefix: ns, noDataTip, translate: __} = this.props;

    if (!icons || !icons.length) {
      return (
        <p className={cx(`${ns}IconSelectControl-icon-list-empty`)}>
          {__(noDataTip)}
        </p>
      )
    }

    return (
      <ul className={cx(`${ns}IconSelectControl-icon-list`)}>
        {
          icons.map((item, index) => (
            <li key={item.id}>
              <div
                className={cx(`${ns}IconSelectControl-icon-list-item`, {
                  active: this.state.tmpCheckIconId === item.id
                })}
                onClick={() => this.handleClickIconInModal(item.id)}
              >
                <svg>
                    <use xlinkHref={`#${item.id}`}></use>
                </svg>

                <div className={cx(`${ns}IconSelectControl-icon-list-item-info`)}>
                  <p className={cx(`${ns}IconSelectControl-icon-list-item-info-name`)}>{item.name}</p>
                  <p className={cx(`${ns}IconSelectControl-icon-list-item-info-id`)}>{item.id}</p>
                </div>
                </div>
            </li>
          ))
        }
      </ul>
    )
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
      }
      catch (e) {
        console.error(e);
      }
      finally {
        this.setState({
          isRefreshLoading: false
        });
      }

    }
  }

  @autobind
  renderModalContent() {
    const {render, classPrefix: ns} = this.props;

    const icons = this.getIconsByType();

    const inputValue = this.state.searchValue;

    const filteredIcons = inputValue
                            ? matchSorter(icons, inputValue, {keys: ['name', 'id']})
                            : icons;
    return (
      <>
        <SearchBox
          className={cx(`${ns}IconSelectControl-Modal-search`)}
          mini={false}
          clearable
          onChange={this.handleSearchValueChange}
        />

        {
          IconSelectStore.refreshIconList && render('refresh',
            {
              type: "button",
              icon: "fa fa-refresh",
            },
            {
              className: cx(`${ns}IconSelectControl-Modal-refresh`),
              onClick: this.handleRefreshIconList
            }
          ) || null
        }

        <div className={cx(`${ns}IconSelectControl-Modal-content`)}>

          <Spinner size="lg" overlay key="info" show={this.state.isRefreshLoading} />
          <div className={cx(`${ns}IconSelectControl-Modal-content-aside`)}>
            {this.renderIconTypes()}
          </div>

          <div className={cx(`${ns}IconSelectControl-Modal-content-main`)}>
            {this.renderIconList(filteredIcons)}
          </div>
        </div>
      </>
    )
  }

  @autobind
  getIconsByType() {
    return IconSelectStore?.svgIcons.length && IconSelectStore.svgIcons[this.state.activeTypeIndex as number].icons || [];
  }

  @autobind
  toggleModel(isShow?: boolean) {
    const {value} = this.props;

    if (isShow === undefined) {
      this.setState({
        showModal: !this.state.showModal,
        searchValue: ''
      });
      return;
    }

    this.setState({
      showModal: isShow,
      tmpCheckIconId: isShow ? String(value).replace('svg-', '') : '',
      searchValue: ''
    });
  }

  render() {
    const {className, classPrefix: ns, disabled} = this.props;

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
          <Modal.Header
            onClose={() => this.toggleModel(false)}
          >图标选择</Modal.Header>

          <Modal.Body>
            {this.renderModalContent()}
          </Modal.Body>

          <Modal.Footer>
            <Button type="button" className="m-l" onClick={() => this.toggleModel(false)}>取消</Button>
            <Button type="button" level="primary" onClick={this.handleConfirm}>确定</Button>
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
