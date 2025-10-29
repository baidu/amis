import React from 'react';
import {
  FormItem,
  FormControlProps,
  FormBaseControl,
  AMISFormItem
} from 'amis-core';
import {TableCell} from '../Table';
import PopOver, {SchemaPopOver} from '../PopOver';
import QuickEdit, {SchemaQuickEdit} from '../QuickEdit';

import Copyable, {SchemaCopyable} from '../Copyable';
import {extendObject, ucFirst} from 'amis-core';
import omit from 'lodash/omit';
import {
  FormBaseControlSchema,
  SchemaObject,
  SchemaTpl,
  SchemaType
} from '../../Schema';

/**
 * Static
 * 文档：https://aisuda.bce.baidu.com/amis/zh-CN/components/form/static
 */
/**
 * Static 静态内容展示控件，支持模板渲染、内容复制、快速编辑和详情弹窗配置，一般用于只读显示表单项内容。
 */
export interface AMISStaticSchema extends AMISFormItem {
  type: 'static';

  /**
   * 内容模板，支持 HTML
   */
  tpl?: SchemaTpl;

  /**
   * 内容模板，不支持 HTML
   */
  text?: SchemaTpl;

  /**
   * 配置查看详情功能
   */
  popOver?: SchemaPopOver;

  /**
   * 配置快速编辑功能
   */
  quickEdit?: SchemaQuickEdit;

  /**
   * 配置点击复制功能
   */
  copyable?: SchemaCopyable;

  /**
   * 边框模式
   */
  borderMode?: 'full' | 'half' | 'none';
}

export interface StaticProps extends FormControlProps {
  placeholder?: string;
  tpl?: string;
  text?: string;
  contentsOnly?: boolean;
}

export default class StaticControl extends React.Component<StaticProps, any> {
  static defaultProps = {
    placeholder: '-'
  };

  constructor(props: StaticProps) {
    super(props);

    this.handleQuickChange = this.handleQuickChange.bind(this);
  }

  async handleQuickChange(
    values: any,
    saveImmediately: boolean | any,
    savePristine?: boolean,
    options?: {
      resetOnFailed?: boolean;
      reload?: string;
    }
  ) {
    const {onBulkChange, onAction, data} = this.props;

    if (saveImmediately && saveImmediately.api) {
      await onAction(
        null,
        {
          actionType: 'ajax',
          api: saveImmediately.api,
          reload: options?.reload
        },
        extendObject(data, values),
        true
      );
    }

    onBulkChange && onBulkChange(values, saveImmediately === true);
  }

  render() {
    const {
      className,
      style,
      value,
      label,
      type,
      render,
      children,
      data,
      classnames: cx,
      name,
      disabled,
      $schema,
      defaultValue,
      borderMode,
      ...rest
    } = this.props;

    const subType = /^static/.test(type)
      ? type.substring(7) || (rest.tpl ? 'tpl' : 'plain')
      : type;

    const field = {
      label,
      name,
      ...$schema,
      style: $schema.innerStyle,
      type: subType
    };

    return (
      <div
        className={cx('Form-static', {
          [`Form-static--border${ucFirst(borderMode)}`]: borderMode
        })}
      >
        <StaticFieldRenderer
          {...{
            ...(rest as any),
            name,
            render,
            field,
            value: value === defaultValue ? undefined : value,
            className,
            onQuickChange: this.handleQuickChange,
            data,
            disabled,
            classnames: cx
          }}
        />
      </div>
    );
  }
}

@FormItem({
  test: /(^|\/)static(\-[^\/]+)?$/,
  weight: -90,
  strictMode: false,
  sizeMutable: false,
  name: 'static'
})
export class StaticControlRenderer extends StaticControl {}

@QuickEdit()
@PopOver({
  position: 'right'
})
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
      contentsOnly,
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
          ...omit(rest, Object.keys(schema)),
          value,
          data
        });

    if (width) {
      style = style || {};
      style.width = style.width || width;
    }

    if (contentsOnly) {
      return body as JSX.Element;
    }

    Component = Component || 'div';

    return (
      <Component className={className} tabIndex={tabIndex} onKeyUp={onKeyUp}>
        {body}
      </Component>
    );
  }
}
