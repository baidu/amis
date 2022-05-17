/**
 * @file table/HeadCellDropDown
 * @author fex
 */

import React from 'react';
import {findDOMNode} from 'react-dom';

import {themeable, ThemeProps} from '../../theme';
import {LocaleProps, localeable} from '../../locale';
import Overlay from '../Overlay';
import PopOver from '../PopOver';

export interface FilterPayload {
  closeDropdown?: boolean;
}

export interface FilterDropdownProps {
  setSelectedKeys?: (keys: Array<string | number> | string) => void,
  selectedKeys?: Array<string | number> | string,
  confirm: (payload: FilterPayload) => void,
  clearFilters?: () => void
}

export interface Props extends ThemeProps, LocaleProps {
  filterIcon: Function | React.ReactNode; // 图标方法 返回ReactNode
  className: string; // 图标样式
  layerClassName: string; // 展开层样式
  active: boolean; // 图标是否高亮
  popOverContainer?: () => Element | Text | null;
  filterDropdown: (payload: FilterDropdownProps) => JSX.Element | null ; // 菜单内容
  selectedKeys?: Array<string | number> | string;
  setSelectedKeys?: (keys: Array<string | number> | string) => void;
}

export interface State {
  isOpened: boolean;
}

export class HeadCellDropDown extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      isOpened: false
    }

    this.openLayer = this.openLayer.bind(this);
    this.closeLayer = this.closeLayer.bind(this);
  }

  render() {
    const {isOpened} = this.state;
    const {
      popOverContainer,
      active,
      className,
      layerClassName,
      filterIcon,
      filterDropdown,
      classnames: cx,
      classPrefix: ns
    } = this.props;

    return (
      <span
        className={cx(
          className,
          active ? 'is-active' : ''
        )}
      >
        <span onClick={this.openLayer}>
          {filterIcon && typeof filterIcon === 'function'
            ? filterIcon(active) : (filterIcon || null)}
        </span>
        {
          isOpened ? (
          <Overlay
            container={popOverContainer || (() => findDOMNode(this))}
            placement="left-bottom-left-top right-bottom-right-top"
            target={
              popOverContainer ? () => findDOMNode(this)!.parentNode : null
            }
            show
          >
            <PopOver
              classPrefix={ns}
              onHide={this.closeLayer}
              className={cx(layerClassName)}
              overlay
            >
              {filterDropdown && typeof filterDropdown === 'function'
                ? filterDropdown({...this.props, confirm: (payload: FilterPayload) => {
                  if (!(payload && payload.closeDropdown === false)) {
                    this.closeLayer();
                  }
                }}) : (filterDropdown || null)}
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
}

export default themeable(localeable(HeadCellDropDown));