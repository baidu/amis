import {ClassNamesFn, themeable} from '../theme';
import React from 'react';
import {render} from 'react-dom';
import {autobind} from '../utils/helper';
import Transition, {
  ENTERED,
  ENTERING,
  EXITING
} from 'react-transition-group/Transition';
import {calculatePosition} from '../utils/dom';
const fadeStyles: {
  [propName: string]: string;
} = {
  [ENTERING]: 'in',
  [ENTERED]: 'in',
  [EXITING]: 'out'
};

interface ContextMenuProps {
  className?: string;
  classPrefix: string;
  classnames: ClassNamesFn;
  container?: HTMLElement | null | (() => HTMLElement);
}

export type MenuItem = {
  label: string;
  icon?: string;
  disabled?: boolean;
  children?: Array<MenuItem | MenuDivider>;
  data?: any;
  className?: string;
  onSelect?: (data: any) => void;
  onHighlight?: (isHiglight: boolean, data: any) => void;
};

export type MenuDivider = '|';

interface ContextMenuState {
  isOpened: boolean;
  menus: Array<MenuItem | MenuDivider>;
  x: number;
  y: number;
  align?: 'left' | 'right';
  onClose?: () => void;
}

export class ContextMenu extends React.Component<
  ContextMenuProps,
  ContextMenuState
> {
  static instance: any = null;
  static getInstance() {
    if (!ContextMenu.instance) {
      const container = document.body;
      const div = document.createElement('div');
      container.appendChild(div);
      render(<ThemedContextMenu />, div);
    }

    return ContextMenu.instance;
  }

  state: ContextMenuState = {
    isOpened: false,
    menus: [],
    x: -99999,
    y: -99999
  };

  menuRef: React.RefObject<HTMLDivElement> = React.createRef();
  originInstance: this | null;

  constructor(props: ContextMenuProps) {
    super(props);

    this.originInstance = ContextMenu.instance;
    ContextMenu.instance = this;
  }

  componentDidMount() {
    document.body.addEventListener('click', this.handleOutClick, true);
    document.addEventListener('keydown', this.handleKeyDown);
  }

  componentWillUnmount() {
    ContextMenu.instance = this.originInstance;
    document.body.removeEventListener('click', this.handleOutClick, true);
    document.removeEventListener('keydown', this.handleKeyDown);

    // @ts-ignore
    delete this.originInstance;
  }

  @autobind
  openContextMenus(
    info: {x: number; y: number},
    menus: Array<MenuItem>,
    onClose?: () => void
  ) {
    this.setState({
      isOpened: true,
      x: info.x,
      y: info.y,
      menus: menus,
      onClose
    });
  }

  @autobind
  close() {
    const onClose = this.state.onClose;
    this.setState(
      {
        isOpened: false,
        x: -99999,
        y: -99999,
        menus: []
      },
      onClose
    );
  }

  @autobind
  handleOutClick(e: Event) {
    if (
      !e.target ||
      !this.menuRef.current ||
      this.menuRef.current.contains(e.target as HTMLElement)
    ) {
      return;
    }
    if (this.state.isOpened) {
      e.preventDefault();
      this.close();
    }
  }

  handleClick(item: MenuItem) {
    const onClose = this.state.onClose;
    item.disabled ||
      (Array.isArray(item.children) && item.children.length) ||
      this.setState(
        {
          isOpened: false,
          x: -99999,
          y: -99999,
          menus: []
        },
        () => {
          item.onSelect?.(item.data);
          onClose?.();
        }
      );
  }

  @autobind
  handleKeyDown(e: KeyboardEvent) {
    if (e.keyCode === 27 && this.state.isOpened) {
      e.preventDefault();
      this.close();
    }
  }

  handleMouseEnter(item: MenuItem) {
    item.disabled || !item.onHighlight || item.onHighlight(true, item.data);
  }

  handleMouseLeave(item: MenuItem) {
    item.disabled || !item.onHighlight || item.onHighlight(false, item.data);
  }

  @autobind
  handleEnter(menu: HTMLElement) {
    // 智能定位，选择一个合适的对齐方式。
    const info = calculatePosition(
      'auto',
      menu.lastChild,
      menu.children[1] as HTMLElement,
      document.body
    );

    const align =
      info.positionLeft + 300 < window.innerWidth ? 'right' : 'left';

    this.setState({
      x: info.positionLeft,
      y: info.positionTop,
      align
    });
  }

  @autobind
  handleSelfContextMenu(e: React.MouseEvent) {
    e.preventDefault();
  }

  renderMenus(menus: Array<MenuItem | MenuDivider>) {
    const {classnames: cx} = this.props;

    return menus.map((item, index) => {
      if (item === '|') {
        return <li key={index} className={cx('ContextMenu-divider')} />;
      }

      const hasChildren = Array.isArray(item.children) && item.children.length;
      return (
        <li
          key={`${item.label}-${index}`}
          className={cx('ContextMenu-item', item.className, {
            'has-child': hasChildren,
            'is-disabled': item.disabled
          })}
        >
          <a
            onClick={this.handleClick.bind(this, item)}
            onMouseEnter={this.handleMouseEnter.bind(this, item)}
            onMouseLeave={this.handleMouseLeave.bind(this, item)}
          >
            {item.icon ? (
              <span className={cx('ContextMenu-itemIcon', item.icon)} />
            ) : null}
            {item.label}
          </a>
          {hasChildren ? (
            <ul className={cx('ContextMenu-subList')}>
              {this.renderMenus(item.children!)}
            </ul>
          ) : null}
        </li>
      );
    });
  }

  render() {
    const {className, container, classnames: cx} = this.props;

    return (
      <Transition
        mountOnEnter
        unmountOnExit
        onEnter={this.handleEnter}
        in={this.state.isOpened}
        timeout={500}
      >
        {(status: string) => (
          <div
            ref={this.menuRef}
            role="contextmenu"
            className={cx(
              'ContextMenu',
              {
                'ContextMenu--left': this.state.align === 'left'
              },
              className
            )}
            onContextMenu={this.handleSelfContextMenu}
          >
            <div className={cx(`ContextMenu-overlay`, fadeStyles[status])} />
            <div
              className={cx(`ContextMenu-cursor`)}
              style={{left: `${this.state.x}px`, top: `${this.state.y}px`}}
            />
            <div
              style={{left: `${this.state.x}px`, top: `${this.state.y}px`}}
              className={cx(`ContextMenu-menu`, fadeStyles[status])}
            >
              <ul className={cx('ContextMenu-list')}>
                {this.renderMenus(this.state.menus)}
              </ul>
            </div>
          </div>
        )}
      </Transition>
    );
  }
}

export const ThemedContextMenu = themeable(ContextMenu);
export default ThemedContextMenu;

export function openContextMenus(
  info: Event | {x: number; y: number},
  menus: Array<MenuItem | MenuDivider>,
  onClose?: () => void
) {
  return ContextMenu.getInstance().openContextMenus(info, menus, onClose);
}
