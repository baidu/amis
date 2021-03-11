/**
 * 用来显示选择结果，垂直显示。支持移出、排序等操作。
 */
import React from 'react';
import {Option} from './Select';
import {ThemeProps, themeable} from '../theme';
import {Icon} from './icons';
import {autobind, guid} from '../utils/helper';
import Sortable from 'sortablejs';
import {findDOMNode} from 'react-dom';
import {LocaleProps, localeable} from '../locale';

export interface ResultListProps extends ThemeProps, LocaleProps {
  className?: string;
  value?: Array<Option>;
  onChange?: (value: Array<Option>) => void;
  sortable?: boolean;
  disabled?: boolean;
  title?: string;
  placeholder: string;
  itemRender: (option: Option) => JSX.Element;
  itemClassName?: string;
}

export class ResultList extends React.Component<ResultListProps> {
  static defaultProps: Pick<ResultListProps, 'placeholder' | 'itemRender'> = {
    placeholder: 'placeholder.selectData',
    itemRender: (option: any) => (
      <span>{`${option.scopeLabel || ''}${option.label}`}</span>
    )
  };

  id = guid();
  sortable?: Sortable;

  componentDidMount() {
    this.props.sortable && this.initSortable();
  }

  componentDidUpdate() {
    if (this.props.sortable) {
      this.sortable || this.initSortable();
    } else {
      this.desposeSortable();
    }
  }

  componentWillUnmount() {
    this.desposeSortable();
  }

  @autobind
  handleRemove(e: React.MouseEvent<HTMLElement>) {
    const index = parseInt(e.currentTarget.getAttribute('data-index')!, 10);
    const {value, onChange} = this.props;

    if (!Array.isArray(value)) {
      return;
    }

    const newValue = value.concat();
    newValue.splice(index, 1);
    onChange?.(newValue);
  }

  initSortable() {
    const ns = this.props.classPrefix;
    const dom = findDOMNode(this) as HTMLElement;
    const container = dom.querySelector(
      `.${ns}Selections-items`
    ) as HTMLElement;

    if (!container) {
      return;
    }

    this.sortable = new Sortable(container, {
      group: `selections-${this.id}`,
      animation: 150,
      handle: `.${ns}Selections-dragbar`,
      ghostClass: `${ns}Selections-item--dragging`,
      onEnd: (e: any) => {
        // 没有移动
        if (e.newIndex === e.oldIndex) {
          return;
        }

        // 换回来
        const parent = e.to as HTMLElement;
        if (
          e.newIndex < e.oldIndex &&
          e.oldIndex < parent.childNodes.length - 1
        ) {
          parent.insertBefore(e.item, parent.childNodes[e.oldIndex + 1]);
        } else if (e.oldIndex < parent.childNodes.length - 1) {
          parent.insertBefore(e.item, parent.childNodes[e.oldIndex]);
        } else {
          parent.appendChild(e.item);
        }

        const value = this.props.value;
        if (!Array.isArray(value)) {
          return;
        }
        const newValue = value.concat();
        newValue.splice(e.newIndex, 0, newValue.splice(e.oldIndex, 1)[0]);
        this.props.onChange?.(newValue);
      }
    });
  }

  desposeSortable() {
    this.sortable?.destroy();
    delete this.sortable;
  }

  render() {
    const {
      classnames: cx,
      className,
      value,
      placeholder,
      itemRender,
      disabled,
      title,
      itemClassName,
      sortable,
      translate: __
    } = this.props;

    return (
      <div className={cx('Selections', className)}>
        {title ? <div className={cx('Selections-title')}>{title}</div> : null}

        {Array.isArray(value) && value.length ? (
          <div className={cx('Selections-items')}>
            {value.map((option, index) => (
              <div
                className={cx(
                  'Selections-item',
                  itemClassName,
                  option?.className
                )}
                key={index}
              >
                {sortable && !disabled && value.length > 1 ? (
                  <Icon
                    className={cx('Selections-dragbar icon')}
                    icon="drag-bar"
                  />
                ) : null}

                <label>{itemRender(option)}</label>

                {!disabled ? (
                  <a
                    className={cx('Selections-delBtn')}
                    data-index={index}
                    onClick={this.handleRemove}
                  >
                    <Icon icon="close" className="icon" />
                  </a>
                ) : null}
              </div>
            ))}
          </div>
        ) : (
          <div className={cx('Selections-placeholder')}>{__(placeholder)}</div>
        )}
      </div>
    );
  }
}

export default themeable(localeable(ResultList));
