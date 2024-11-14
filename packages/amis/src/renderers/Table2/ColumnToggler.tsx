import React from 'react';
import {Renderer, isVisible, ClassNamesFn} from 'amis-core';
import {Checkbox} from 'amis-ui';

import ColumnToggler, {ColumnTogglerProps} from '../Table/ColumnToggler';
import {BaseSchema} from '../../Schema';

export interface ColumnTogglerSchema extends BaseSchema {
  label?: string;
  tooltip?: string;
  size?: string;
  icon?: string;
  draggable?: boolean;
  align?: string;
}

export interface ColumnTogglerRendererProps extends ColumnTogglerProps {
  toggleAllColumns?: Function;
  toggleToggle?: Function;
  cols: Array<any>;
  classnames: ClassNamesFn;
  classPrefix: string;
}

@Renderer({
  type: 'column-toggler',
  name: 'column-toggler'
})
export class ColumnTogglerRenderer extends React.Component<ColumnTogglerRendererProps> {
  render() {
    const {
      className,
      store,
      render,
      classPrefix: ns,
      classnames: cx,
      tooltip,
      align,
      cols,
      toggleAllColumns,
      toggleToggle,
      data,
      size,
      popOverContainer,
      ...rest
    } = this.props;
    const __ = rest.translate;
    const env = rest.env;

    if (!cols) {
      return null;
    }

    const toggableColumns = cols.filter(
      (item: any) =>
        isVisible(item.pristine || item, data) && item.toggable !== false
    );

    const activeToggaleColumns = toggableColumns.filter(
      (item: any) => item.toggled !== false
    );

    return (
      <ColumnToggler
        {...rest}
        render={render}
        tooltip={tooltip || __('Table.columnsVisibility')}
        tooltipContainer={popOverContainer || env.getModalContainer}
        isActived={cols.findIndex((column: any) => !column.toggled) !== -1}
        align={align ?? 'right'}
        size={size || 'sm'}
        classnames={cx}
        classPrefix={ns}
        key="columns-toggable"
        columns={cols}
        activeToggaleColumns={activeToggaleColumns}
        data={data}
      >
        {toggableColumns?.length ? (
          <li
            className={cx('ColumnToggler-menuItem')}
            key={'selectAll'}
            onClick={() => {
              toggleAllColumns &&
                toggleAllColumns(activeToggaleColumns?.length <= 0);
            }}
          >
            <Checkbox
              size="sm"
              classPrefix={ns}
              key="checkall"
              checked={!!activeToggaleColumns?.length}
              partial={
                !!(
                  activeToggaleColumns?.length &&
                  activeToggaleColumns?.length !== toggableColumns?.length
                )
              }
            >
              {__('Select.checkAll')}
            </Checkbox>
          </li>
        ) : null}

        {toggableColumns?.map((column: any, index: number) => (
          <li
            className={cx('ColumnToggler-menuItem')}
            key={'item' + (column.index || index)}
            onClick={() => {
              toggleToggle && toggleToggle(index);
            }}
          >
            <Checkbox
              size="sm"
              classPrefix={ns}
              checked={column.toggled !== false}
            >
              {column.title
                ? render('tpl', column.title)
                : column.label || null}
            </Checkbox>
          </li>
        ))}
      </ColumnToggler>
    );
  }
}
