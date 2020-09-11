import React from 'react';
import {FormItem, FormControlProps, FormBaseControl} from './Item';
import {TableCell} from '../Table';
import PopOver from '../PopOver';
import QuickEdit from '../QuickEdit';
import {Renderer} from '../../factory';
import Copyable from '../Copyable';
import {extendObject} from '../../utils/helper';
import {SchemaTpl} from '../../Schema';

/**
 * Static
 * 文档：https://baidu.gitee.io/amis/docs/components/form/static
 */
export interface StaticControlSchema extends FormBaseControl {
  type: 'static';

  /**
   * 内容模板， 支持 HTML
   */
  tpl?: SchemaTpl;

  /**
   * 内容模板，不支持 HTML
   */
  text?: SchemaTpl;
}

export interface StaticProps extends FormControlProps {
  placeholder?: string;
  tpl?: string;
  text?: string;
}

export default class StaticControl extends React.Component<StaticProps, any> {
  static defaultProps = {
    placeholder: '-'
  };

  constructor(props: StaticProps) {
    super(props);

    this.handleQuickChange = this.handleQuickChange.bind(this);
  }

  handleQuickChange(values: any, saveImmediately: boolean | any) {
    const {onBulkChange, onAction, data} = this.props;

    onBulkChange(values, saveImmediately === true);
    if (saveImmediately && saveImmediately.api) {
      onAction(
        null,
        {
          actionType: 'ajax',
          api: saveImmediately.api
        },
        extendObject(data, values)
      );
    }
  }

  render() {
    const {
      className,
      value,
      label,
      type,
      render,
      children,
      data,
      classnames: cx,
      ...rest
    } = this.props;

    const subType = /^static/.test(type) ? type.substring(7) || 'tpl' : type;

    const field = {
      label,
      name,
      ...rest,
      type: subType
    };

    return (
      <div className={cx('Form-static')}>
        {render(
          'field',
          {
            ...field,
            type: 'static-field',
            field
          },
          {
            value,
            className,
            onQuickChange: this.handleQuickChange
          }
        )}
      </div>
    );
  }
}

@FormItem({
  test: (path, schema, resolveRenderer) => {
    if (/(^|\/)form(?:\/.+)?\/control\/static(\-[^\/]+)?$/.test(path)) {
      return true;
    } else if (
      /(^|\/)form(?:\/.+)?\/control\/[^\/]+$/.test(path) &&
      schema &&
      schema.type &&
      (schema.name || schema.label) &&
      resolveRenderer &&
      resolveRenderer(`${path}/static-field/${schema.type}`)
    ) {
      // 不一定
      return true;
    }
    return false;
  },
  weight: -90,
  strictMode: false,
  sizeMutable: false,
  name: 'static-control'
})
export class StaticControlRenderer extends StaticControl {}

@Renderer({
  test: /(^|\/)static\-field$/
})
@QuickEdit()
@PopOver()
@Copyable()
export class StaticFieldRenderer extends TableCell {
  static defaultProps = {
    ...TableCell.defaultProps,
    wrapperComponent: 'div'
  };

  render() {
    let {
      type,
      className,
      render,
      style,
      wrapperComponent: Component,
      labelClassName,
      value,
      data,
      children,
      width,
      inputClassName,
      label,
      tabIndex,
      onKeyUp,
      field,
      ...rest
    } = this.props;

    const schema = {
      ...field,
      className: inputClassName,
      type: (field && field.type) || 'plain'
    };

    let body = children
      ? children
      : render('field', schema, {
          ...rest,
          value,
          data
        });

    if (width) {
      style = style || {};
      style.width = style.width || width;
    }

    if (!Component) {
      return body as JSX.Element;
    }

    return (
      <Component
        style={style}
        className={className}
        tabIndex={tabIndex}
        onKeyUp={onKeyUp}
      >
        {body}
      </Component>
    );
  }
}
