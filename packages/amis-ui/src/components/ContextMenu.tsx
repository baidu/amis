import {ClassNamesFn, themeable} from 'amis-core';
import React, {version} from 'react';
import {render} from 'react-dom';
import {autobind, calculatePosition} from 'amis-core';
import Transition, {
  ENTERED,
  ENTERING,
  EXITING
} from 'react-transition-group/Transition';
import debounce from 'lodash/debounce';
import type {DebouncedFunc} from 'lodash';
// import {createRoot} from 'react-dom/client';
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
  id?: string;
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
  menus: Array<MenuItem | MenuDivider> | (() => JSX.Element);
  x: number;
  y: number;
  cursorX: number;
  cursorY: number;
  align?: 'left' | 'right';
  onClose?: (ctx: ContextMenu) => void;
  contentClassName?: string;
}

export class ContextMenu extends React.Component<
  ContextMenuProps,
  ContextMenuState
> {
  static instance: any = null;
  debounceCalculatePosition: DebouncedFunc<(menu: HTMLElement) => void>;
  static async getInstance() {
    if (!ContextMenu.instance || ContextMenu.instance.unmount) {
      const container = document.body;
      const div = document.createElement('div');
      container.appendChild(div);

      // if (parseInt(version.split('.')[0], 10) >= 18) {
      //   const root = createRoot(div);
      //   await new Promise<void>(resolve =>
      //     root.render(<ThemedContextMenu ref={() => resolve()} />)
      //   );
      // } else {
      render(<ThemedContextMenu />, div);
      // }
    }

    return ContextMenu.instance;
  }

  state: ContextMenuState = {
    isOpened: false,
    menus: [],
    x: -99999,
    y: -99999,
    cursorX: -99999,
    cursorY: -99999
  };

  menuRef: React.RefObject<HTMLDivElement> = React.createRef();
  contentRef: React.RefObject<HTMLDivElement> = React.createRef();
  originInstance: this | null;
  prevInfo: {
    // 记录当前右键位置: 方便下一次做对比
    x: number;
    y: number;
  } | null;

  unmount = false;
  menuEntered = false;
  constructor(props: ContextMenuProps) {
    super(props);

    this.originInstance = ContextMenu.instance;
    ContextMenu.instance = this;
    this.debounceCalculatePosition = debounce(
      this.autoCalculatePosition.bind(this),
      200
    );
  }

  componentDidMount() {
    document.body.addEventListener('click', this.handleOutClick, true);
    document.addEventListener('keydown', this.handleKeyDown);
  }

  componentWillUnmount() {
    this.unmount = true;
    this.debounceCalculatePosition.cancel();
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
    onClose?: (ctx: ContextMenu) => void,
    options?: {
      contentClassName?: string;
    }
  ) {
    if (this.state.isOpened) {
      const {x, y} = this.state;
      const cursorX =
        x + (info.x - (this.prevInfo && this.prevInfo.x ? this.prevInfo.x : 0));
      const cursorY =
        y + (info.y - (this.prevInfo && this.prevInfo.y ? this.prevInfo.y : 0));
      // 避免 二次触发未进行智能定位 导致遮挡问题
      this.setState(
        {
          x: cursorX,
          y: cursorY,
          cursorX,
          cursorY,
          menus: menus,
          onClose,
          contentClassName: options?.contentClassName
        },
        () => {
          this.handleEnter(this.menuRef.current as HTMLElement);
        }
      );
    } else {
      this.setState({
        isOpened: true,
        x: info.x,
        y: info.y,
        cursorX: info.x,
        cursorY: info.y,
        menus: menus,
        onClose,
        contentClassName: options?.contentClassName
      });
    }
    this.prevInfo = info;
  }

  @autobind
  close() {
    this.menuEntered = false;
    this.resizeObserver?.disconnect();
    const onClose = this.state.onClose;
    this.setState(
      {
        isOpened: false,
        x: -99999,
        y: -99999,
        cursorX: -99999,
        cursorY: -99999,
        menus: [],
        contentClassName: ''
      },
      () => {
        onClose?.(this);
      }
    );
  }

  @autobind
  handleOutClick(e: Event) {
    if (
      !this.menuEntered ||
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
          cursorX: -99999,
          cursorY: -99999,
          menus: []
        },
        () => {
          item.onSelect?.(item.data);
          onClose?.(this);
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

  resizeObserver: null | ResizeObserver = null;

  @autobind
  handleEnter(menu: HTMLElement) {
    this.autoCalculatePosition(menu);
  }

  @autobind
  handleEntered(menu: HTMLElement) {
    this.menuEntered = true;
    if (!this.contentRef.current || !window.ResizeObserver) {
      return;
    }
    // 监听菜单大小变化，并自动重新计算位置
    this.resizeObserver = new ResizeObserver(entries => {
      entries.length && this.debounceCalculatePosition(menu);
    });
    this.resizeObserver.observe(this.contentRef.current);
  }

  @autobind
  autoCalculatePosition(menu: HTMLElement) {
    // 智能定位，选择一个合适的对齐方式。
    const info = calculatePosition(
      'asContextMenu',
      menu.lastChild,
      menu.children[1] as HTMLElement,
      menu.children[0]
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
        onEntered={this.handleEntered}
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
              className,
              this.state.contentClassName
            )}
            onContextMenu={this.handleSelfContextMenu}
          >
            <div className={cx(`ContextMenu-overlay`, fadeStyles[status])} />
            <div
              className={cx(`ContextMenu-cursor`)}
              style={{
                left: `${this.state.cursorX}px`,
                top: `${this.state.cursorY}px`
              }}
            />
            <div
              ref={this.contentRef}
              style={{left: `${this.state.x}px`, top: `${this.state.y}px`}}
              className={cx(`ContextMenu-menu`, fadeStyles[status])}
            >
              {typeof this.state.menus === 'function' ? (
                this.state.menus()
              ) : (
                <ul className={cx('ContextMenu-list')}>
                  {this.renderMenus(this.state.menus)}
                </ul>
              )}
            </div>
          </div>
        )}
      </Transition>
    );
  }
}

export const ThemedContextMenu = themeable(ContextMenu);
export default ThemedContextMenu;

export async function openContextMenus(
  info: Event | {x: number; y: number},
  menus: Array<MenuItem | MenuDivider> | (() => React.ReactNode),
  onClose?: (ctx: ContextMenu) => void,
  options?: {
    contentClassName?: string;
  }
) {
  return ContextMenu.getInstance().then(instance =>
    instance.openContextMenus(info, menus, onClose, options)
  );
}

export async function closeContextMenus() {
  return ContextMenu.getInstance().then(instance => instance?.close());
}
