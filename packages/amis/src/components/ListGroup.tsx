import {ThemeProps, themeable} from '../theme';
import React from 'react';

export interface ListGroupProps
  extends ThemeProps,
    Omit<React.InputHTMLAttributes<HTMLDivElement>, 'placeholder'> {
  expand?: boolean;
  items?: Array<any>;
  itemClassName?: string;
  itemRender: (item: any, index: number) => JSX.Element;
  placeholder?: JSX.Element;
  getItemProps?: (props: {item: any; index: number}) => any;
}

export class ListGroup extends React.Component<ListGroupProps> {
  static defaultProps = {
    itemRender: (item: any) => <>{`${item}`}</>
  };

  render() {
    const {
      classnames: cx,
      className,
      expand,
      placeholder,
      items,
      children,
      itemClassName,
      itemRender,
      getItemProps,
      classPrefix,
      ...rest
    } = this.props;

    return (
      <div
        {...rest}
        className={cx(
          'ListGroup',
          className,
          expand ? 'ListGroup--expanded' : ''
        )}
      >
        {Array.isArray(items) && items.length ? (
          items.map((item: any, index) => {
            const itemProps = getItemProps?.({item, index}) || {};

            return (
              <div
                key={index}
                {...itemProps}
                className={cx(
                  'ListGroup-item',
                  itemClassName,
                  itemProps.className
                )}
              >
                {itemRender(item, index)}
              </div>
            );
          })
        ) : placeholder ? (
          <div className={cx('Placeholder ListGroup-placeholder')}></div>
        ) : null}

        {children}
      </div>
    );
  }
}

export default themeable(ListGroup);
