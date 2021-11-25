/**
 * @file GridNav
 * @description 金刚位宫格导航 参考react-vant
 */

import React, {useMemo} from 'react';
import {ClassNamesFn} from '../theme';
import {Badge, BadgeProps} from './Badge';

export type GridNavDirection = 'horizontal' | 'vertical';

export interface GridNavProps {
  /** 是否将格子固定为正方形	 */
  square?: boolean;
  /** 是否将格子内容居中显示	 */
  center?: boolean;
  /** 是否显示边框	 */
  border?: boolean;
  /** 格子之间的间距，默认单位为`px` */
  gutter?: number;
  /** 是否调换图标和文本的位置	 */
  reverse?: boolean;
  /** 图标占比，默认单位为`%` */
  iconRatio?: number;
  /** 格子内容排列的方向，可选值为 `horizontal`	 */
  direction?: GridNavDirection;
  /** 列数	 */
  columnNum?: number;
  className?: string;
  itemClassName?: string;
  classnames: ClassNamesFn;
  style?: React.CSSProperties;
}

export interface GridNavItemProps {
  /**  图标右上角徽标	 */
  badge?: BadgeProps;
  /** 文字 */
  text?: string | React.ReactNode;
  /** 图标名称或图片链接	 */
  icon?: string | React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  contentClassName?: string;
  contentStyle?: React.CSSProperties;
  children?: React.ReactNode;
  classnames: ClassNamesFn;
  onClick?: (event: React.MouseEvent) => void;
}

type InternalProps = {
  parent?: GridNavProps;
  index?: number;
};

function addUnit(value?: string | number): string | undefined {
  if (value === undefined || value === null) {
    return undefined;
  }
  value = String(value);
  return /^\d+(\.\d+)?$/.test(value) ? `${value}px` : value;
}

export const GridNavItem: React.FC<GridNavItemProps & InternalProps> = ({
  children,
  classnames: cx,
  className,
  style,
  ...props
}) => {
  const {index = 0, parent} = props;
  if (!parent) {
    if (process.env.NODE_ENV !== 'production') {
      // eslint-disable-next-line no-console
      console.error(
        '[React Vant] <GridNavItem> must be a child component of <GridNav>.'
      );
    }
    return null;
  }

  const rootStyle = useMemo(() => {
    const {square, gutter, columnNum = 4} = parent;
    const percent = `${100 / +columnNum}%`;
    const internalStyle: React.CSSProperties = {
      ...style,
      flexBasis: percent
    };

    if (square) {
      internalStyle.paddingTop = percent;
    } else if (gutter) {
      const gutterValue = addUnit(gutter);
      internalStyle.paddingRight = gutterValue;

      if (index >= columnNum) {
        internalStyle.marginTop = gutterValue;
      }
    }

    return internalStyle;
  }, [parent.style, parent.gutter, parent.columnNum]);

  const contentStyle = useMemo(() => {
    const {square, gutter} = parent;

    if (square && gutter) {
      const gutterValue = addUnit(gutter);
      return {
        ...props.contentStyle,
        right: gutterValue,
        bottom: gutterValue,
        height: 'auto'
      };
    }
    return props.contentStyle;
  }, [parent.gutter, parent.columnNum, props.contentStyle]);

  const renderIcon = () => {
    const ratio = parent.iconRatio || 60;
    if (typeof props.icon === 'string') {
      if (props.badge) {
        return (
          <Badge {...props.badge}>
            <div className={cx('GridNavItem-image')}>
              <img src={props.icon} style={{width: ratio + '%'}} />
            </div>
          </Badge>
        );
      }
      return (
        <div className={cx('GridNavItem-image')}>
          <img src={props.icon} style={{width: ratio + '%'}} />
        </div>
      );
    }

    if (React.isValidElement(props.icon)) {
      return <Badge {...(props.badge as BadgeProps)}>{props.icon}</Badge>;
    }

    return null;
  };

  const renderText = () => {
    if (React.isValidElement(props.text)) {
      return props.text;
    }
    if (props.text) {
      return <span className={cx('GridNavItem-text')}>{props.text}</span>;
    }
    return null;
  };

  const renderContent = () => {
    if (children) {
      return children;
    }
    return (
      <>
        {renderIcon()}
        {renderText()}
      </>
    );
  };

  const {center, border, square, gutter, reverse, direction} = parent;

  const prefix = 'GridNavItem-content';
  const classes = cx(`${prefix} ${props.contentClassName || ''}`, {
    [`${prefix}--${direction}`]: !!direction,
    [`${prefix}--center`]: center,
    [`${prefix}--square`]: square,
    [`${prefix}--reverse`]: reverse,
    [`${prefix}--clickable`]: !!props.onClick,
    [`${prefix}--surround`]: border && gutter,
    [`${prefix}--border u-hairline`]: border
  });

  return (
    <div
      className={cx(className, {'GridNavItem--square': square})}
      style={rootStyle}
    >
      <div
        role={props.onClick ? 'button' : undefined}
        className={classes}
        style={contentStyle}
        onClick={props.onClick}
      >
        {renderContent()}
      </div>
    </div>
  );
};

const GridNav: React.FC<GridNavProps> = ({
  children,
  className,
  classnames: cx,
  itemClassName,
  style,
  ...props
}) => {
  return (
    <div
      style={{paddingLeft: addUnit(props.gutter), ...style}}
      className={cx(`GridNav ${className || ''}`, {
        'GridNav-top u-hairline': props.border && !props.gutter
      })}
    >
      {React.Children.toArray(children)
        .filter(Boolean)
        .map((child: React.ReactElement, index: number) =>
          React.cloneElement(child, {
            index,
            parent: props,
            className: itemClassName,
            classnames: cx
          })
        )}
    </div>
  );
};

GridNav.defaultProps = {
  direction: 'vertical',
  center: true,
  border: true,
  columnNum: 4
};

export default GridNav;
