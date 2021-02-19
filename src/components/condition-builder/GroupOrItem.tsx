import {Config} from './config';
import {Fields, ConditionGroupValue, Funcs, ConditionValue} from './types';
import {ThemeProps, themeable} from '../../theme';
import React from 'react';
import {Icon} from '../icons';
import {autobind} from '../../utils/helper';
import ConditionGroup from './Group';
import ConditionItem from './Item';

export interface CBGroupOrItemProps extends ThemeProps {
  config: Config;
  value?: ConditionGroupValue;
  fields: Fields;
  funcs?: Funcs;
  index: number;
  data?: any;
  draggable?: boolean;
  onChange: (value: ConditionGroupValue, index: number) => void;
  removeable?: boolean;
  onDragStart?: (e: React.MouseEvent) => void;
  onRemove?: (index: number) => void;
}

export class CBGroupOrItem extends React.Component<CBGroupOrItemProps> {
  @autobind
  handleItemChange(value: any) {
    this.props.onChange(value, this.props.index);
  }

  @autobind
  handleItemRemove() {
    this.props.onRemove?.(this.props.index);
  }

  render() {
    const {
      classnames: cx,
      value,
      config,
      fields,
      funcs,
      draggable,
      data,
      onDragStart
    } = this.props;

    return (
      <div className={cx('CBGroupOrItem')} data-id={value?.id}>
        <div className={cx('CBGroupOrItem-body')}>
          {draggable ? (
            <a
              draggable
              onDragStart={onDragStart}
              className={cx('CBGroupOrItem-dragbar')}
            >
              <Icon icon="drag-bar" className="icon" />
            </a>
          ) : null}

          {value?.conjunction ? (
            <ConditionGroup
              onDragStart={onDragStart}
              config={config}
              fields={fields}
              value={value as ConditionGroupValue}
              onChange={this.handleItemChange}
              funcs={funcs}
              removeable
              onRemove={this.handleItemRemove}
              data={data}
            />
          ) : (
            <>
              <ConditionItem
                config={config}
                fields={fields}
                value={value as ConditionValue}
                onChange={this.handleItemChange}
                funcs={funcs}
                data={data}
              />
              <a className={cx('CBDelete')} onClick={this.handleItemRemove}>
                <Icon icon="close" className="icon" />
              </a>
            </>
          )}
        </div>
      </div>
    );
  }
}

export default themeable(CBGroupOrItem);
