import React from 'react';
import {RendererProps, Renderer} from 'amis-core';
import QuickEdit from '../QuickEdit';
import Copyable from '../Copyable';
import PopOverable from '../PopOver';
import {observer} from 'mobx-react';
import omit from 'lodash/omit';
import {filter} from 'amis-core';
import {Badge} from 'amis-ui';
import {ColorScale} from 'amis-core';
import {isPureVariable, resolveVariableAndFilter} from 'amis-core';

export interface TableCellProps extends RendererProps {
  wrapperComponent?: React.ElementType;
  column: any;
  contentsOnly?: boolean;
}

export class TableCell extends React.Component<TableCellProps> {
  static defaultProps = {
    wrapperComponent: 'td'
  };

  static propsList: Array<string> = [
    'type',
    'label',
    'column',
    'body',
    'tpl',
    'rowSpan',
    'remark',
    'contentsOnly'
  ];

  readonly propsNeedRemove: string[] = [];

  render() {
    let {
      classnames: cx,
      className,
      classNameExpr,
      render,
      style = {},
      wrapperComponent: Component,
      contentsOnly,
      column,
      value,
      data,
      children,
      width,
      align,
      innerClassName,
      label,
      tabIndex,
      onKeyUp,
      rowSpan,
      body: _body,
      tpl,
      remark,
      cellPrefix,
      cellAffix,
      isHead,
      colIndex,
      row,
      showBadge,
      itemBadge,
      ...rest
    } = this.props;
    const schema = {
      ...column,
      style: column.innerStyle, // column的innerStyle配置 作为内部组件的style 覆盖column的style
      className: innerClassName,
      type: (column && column.type) || 'plain'
    };
    // 列比表的的优先级高
    const canAccessSuperData =
      (schema?.canAccessSuperData ?? this.props.canAccessSuperData) !== false;

    // 如果本来就是 type 为 button，不要删除，其他情况下都应该删除。
    if (schema.type !== 'button' && schema.type !== 'dropdown-button') {
      delete schema.label;
    }

    let body = children
      ? children
      : render('field', schema, {
          ...omit(rest, Object.keys(schema), this.propsNeedRemove),
          // inputOnly 属性不能传递给子组件，在 SchemaRenderer.renderChild 中处理掉了
          inputOnly: true,
          /** value没有返回值时设置默认值，避免错误获取到父级数据域的值 */
          value: canAccessSuperData ? value : value ?? '',
          data
        });

    if (width) {
      style = {
        ...style,
        width: (style && style.width) || width
      };

      if (!/%$/.test(String(style.width))) {
        body = (
          <div style={{width: style.width}}>
            {cellPrefix}
            {body}
            {cellAffix}
          </div>
        );
        cellPrefix = null;
        cellAffix = null;
        // delete style.width;
      }
    }

    if (align) {
      style = {
        ...style,
        textAlign: align
      };
    }

    if (column.backgroundScale) {
      const backgroundScale = column.backgroundScale;
      let min = backgroundScale.min;
      let max = backgroundScale.max;

      if (isPureVariable(min)) {
        min = resolveVariableAndFilter(min, data, '| raw');
      }
      if (isPureVariable(max)) {
        max = resolveVariableAndFilter(max, data, '| raw');
      }

      if (typeof min === 'undefined') {
        min = Math.min(...data.rows.map((r: any) => r[column.name]));
      }
      if (typeof max === 'undefined') {
        max = Math.max(...data.rows.map((r: any) => r[column.name]));
      }

      const colorScale = new ColorScale(
        min,
        max,
        backgroundScale.colors || ['#FFEF9C', '#FF7127']
      );
      let value = data[column.name];
      if (isPureVariable(backgroundScale.source)) {
        value = resolveVariableAndFilter(backgroundScale.source, data, '| raw');
      }

      const color = colorScale.getColor(Number(value)).toHexString();
      style.background = color;
    }

    if (contentsOnly) {
      return body as JSX.Element;
    }

    if (isHead) {
      Component = 'th';
    } else {
      Component = Component || 'td';
    }

    return (
      <Component
        rowSpan={rowSpan > 1 ? rowSpan : undefined}
        style={style}
        className={cx(
          className,
          column.classNameExpr ? filter(column.classNameExpr, data) : null
        )}
        tabIndex={tabIndex}
        onKeyUp={onKeyUp}
      >
        {showBadge ? (
          <Badge
            classnames={cx}
            badge={{
              ...itemBadge,
              className: cx(`Table-badge`, itemBadge?.className)
            }}
            data={row.data}
          />
        ) : null}
        {cellPrefix}
        {body}
        {cellAffix}
      </Component>
    );
  }
}

@Renderer({
  test: /(^|\/)table\/(?:.*\/)?cell$/,
  name: 'table-cell'
})
@QuickEdit()
@PopOverable({
  targetOutter: true
})
@Copyable()
@observer
export class TableCellRenderer extends TableCell {
  static propsList = [
    'quickEdit',
    'quickEditEnabledOn',
    'popOver',
    'copyable',
    'inline',
    ...TableCell.propsList
  ];
}

@Renderer({
  type: 'field',
  name: 'field'
})
@PopOverable()
@Copyable()
export class FieldRenderer extends TableCell {
  static defaultProps = {
    ...TableCell.defaultProps,
    wrapperComponent: 'div'
  };
}
