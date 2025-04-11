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

import type {TestIdBuilder} from 'amis-core';

export interface TableCellProps extends RendererProps {
  wrapperComponent?: React.ElementType;
  column: any;
  contentsOnly?: boolean;
  testIdBuilder?: TestIdBuilder;
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
      vAlign,
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
      textOverflow,
      testIdBuilder,
      ...rest
    } = this.props;

    if (isHead) {
      Component = 'th';
    } else {
      Component = Component || 'td';
    }
    const isTableCell = Component === 'td' || Component === 'th';

    const schema = {
      ...column,
      // 因为列本身已经做过显隐判断了，单元格不应该再处理
      visibleOn: '',
      hiddenOn: '',
      visible: true,
      hidden: false,
      style: column.innerStyle, // column的innerStyle配置 作为内部组件的style 覆盖column的style
      className: innerClassName,
      type: (column && column.type) || 'plain'
    };

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
          value: value,
          data
        });

    if (isTableCell) {
      // table Cell 会用 colGroup 来设置宽度，这里不需要再设置
      // 同时剔除style中的定位相关样式，避免表格样式异常
      style = omit(style, ['width', 'position', 'display']);
    } else if (width) {
      style = {
        ...style,
        width: (style && style.width) || width
      };
    }

    if (align) {
      style = {
        ...style,
        textAlign: align
      };
    }

    if (vAlign) {
      style = {
        ...style,
        verticalAlign: vAlign
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

    return (
      <Component
        rowSpan={rowSpan > 1 ? rowSpan : undefined}
        style={style}
        className={cx(className)}
        tabIndex={tabIndex}
        onKeyUp={onKeyUp}
        {...testIdBuilder?.getChild('cell').getTestId()}
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
        {textOverflow === 'ellipsis' ? (
          <div className={cx(`TableCell-ellipsis`)}>{body}</div>
        ) : (
          body
        )}
        {cellAffix}
      </Component>
    );
  }
}

@Renderer({
  type: 'cell',
  name: 'table-cell'
})
@PopOverable({
  targetOutter: true
})
@QuickEdit()
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
