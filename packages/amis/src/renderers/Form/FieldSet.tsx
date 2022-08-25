import React from 'react';
import {Renderer, RendererProps} from 'amis-core';
import {SchemaCollection, SchemaTpl, SchemaExpression} from '../../Schema';
import Collapse, {CollapseSchema} from '../Collapse';
import {FormBaseControl} from 'amis-core';
import type {FormHorizontal} from 'amis-core';

/**
 * FieldSet 表单项集合
 * 文档：https://baidu.gitee.io/amis/docs/components/form/fieldset
 */
export interface FieldSetControlSchema
  extends Omit<FormBaseControl, 'size'>,
    Omit<CollapseSchema, 'type' | 'body'> {
  /**
   * 指定为表单项集合
   */
  type: 'fieldset' | 'fieldSet';

  /**
   * 标题展示位置
   */
  titlePosition: 'top' | 'bottom';

  /**
   * 是否可折叠
   */
  collapsable?: boolean;

  /**
   * 默认是否折叠
   */
  collapsed?: boolean;

  /**
   * 内容区域
   */
  body?: SchemaCollection;

  /**
   * 标题
   */
  title?: SchemaTpl;

  /**
   * 收起的标题
   */
  collapseTitle?: SchemaTpl;

  /**
   * 点开时才加载内容
   */
  mountOnEnter?: boolean;

  /**
   * 是否显示表达式
   */
   visibleOn?: SchemaExpression;

  /**
   * 卡片隐藏就销毁内容。
   */
  unmountOnExit?: boolean;

  /**
   * 配置子表单项默认的展示方式。
   */
  subFormMode?: 'normal' | 'inline' | 'horizontal';
  /**
   * 如果是水平排版，这个属性可以细化水平排版的左右宽度占比。
   */
  subFormHorizontal?: FormHorizontal;
}

export interface FieldSetProps
  extends RendererProps,
    Omit<
      FieldSetControlSchema,
      'type' | 'className' | 'descriptionClassName' | 'inputClassName'
    > {}

export default class FieldSetControl extends React.Component<
  FieldSetProps,
  any
> {
  constructor(props: FieldSetProps) {
    super(props);
    this.renderBody = this.renderBody.bind(this);
  }

  static defaultProps = {
    titlePosition: 'top',
    headingClassName: '',
    collapsable: false
  };

  renderBody(): JSX.Element {
    const {
      body,
      collapsable,
      horizontal,
      render,
      mode,
      formMode,
      classnames: cx,
      store,
      formClassName,
      disabled,

      formHorizontal,
      subFormMode,
      subFormHorizontal
    } = this.props;

    let props: any = {
      store,
      data: store!.data,
      render,
      disabled,
      formMode: subFormMode || formMode,
      formHorizontal: subFormHorizontal || formHorizontal
    };
    mode && (props.mode = mode);
    typeof collapsable !== 'undefined' && (props.collapsable = collapsable);
    horizontal && (props.horizontal = horizontal);

    return (
      <div
        className={cx(
          `Form--${props.mode || formMode || 'normal'}`,
          formClassName
        )}
      >
        {body ? render('body', body, props) : null}
      </div>
    );
  }

  render() {
    const {controls, className, mode, body, ...rest} = this.props;

    return (
      <Collapse
        {...rest}
        body={body!}
        className={className}
        children={this.renderBody}
        wrapperComponent="fieldset"
        headingComponent={rest.titlePosition === 'bottom' ? 'div' : 'legend'}
      />
    );
  }
}

@Renderer({
  type: 'fieldset',
  weight: -100,
  name: 'fieldset'
})
export class FieldSetRenderer extends FieldSetControl {}
