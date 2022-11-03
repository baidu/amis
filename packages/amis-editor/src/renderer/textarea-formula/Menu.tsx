/**
 * @file 下拉菜单
 */

import React from 'react';
import cx from 'classnames';
import {Button} from 'amis';
import {Overlay, PopOver, generateIcon} from 'amis-core';

export interface MenuItem {
  label: string;
  onClick: () => void;
}

interface MenuProps {
  className?: string;
  menus: MenuItem[];
}

const Menu: React.FC<MenuProps> = props => {
  const [open, setOpen] = React.useState(false);
  const domRef = React.useRef<HTMLDivElement>(null);
  const iconElement = generateIcon(cx, 'fa fa-plus');
  const {menus, className} = props;

  function handleOpen(show: boolean) {
    setOpen(!show);
  }

  function handleClick(item: MenuItem) {
    item.onClick();
    setOpen(false);
  }

  function renderButtons() {
    return (
      <ul className={cx('textarea-formula-menu-outer')}>
        {menus.map((item, i) => {
          return (
            <li key={i} onClick={() => handleClick(item)}>
              <a>{item.label}</a>
            </li>
          );
        })}
      </ul>
    );
  }

  return (
    <div
      className={cx('textarea-formula-menu', className)}
      onMouseEnter={() => handleOpen(open)}
      onMouseLeave={() => setOpen(false)}
    >
      <div ref={domRef}>
        <Button iconOnly level="link" onClick={() => handleOpen(open)}>
          {iconElement}
        </Button>
      </div>
      {open ? (
        <Overlay
          target={() => domRef.current}
          container={() => domRef.current}
          show
        >
          <PopOver>{renderButtons()}</PopOver>
        </Overlay>
      ) : null}
    </div>
  );
};

export default Menu;
