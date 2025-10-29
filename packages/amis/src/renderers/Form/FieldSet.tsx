import React from 'react';
import {Renderer, RendererProps} from 'amis-core';
import {SchemaTpl} from '../../Schema';
import Collapse, {AMISCollapseSchemaBase} from '../Collapse';
import {FormBaseControlWithoutSize, BaseSchemaWithoutType} from 'amis-core';
import type {FormHorizontal, AMISSchemaCollection} from 'amis-core';
import {AMISFormItemBase} from 'amis-core';

/**
 * FieldSet 表单项集合
 * 文档：https://aisuda.bce.baidu.com/amis/zh-CN/components/form/fieldset
 */
/**
 * FieldSet 表单项集合组件，用于将表单项分组展示，支持折叠、标题自定义、内容区域自定义，常用于表单布局和分段展示。
 */
export interface AMISFieldSetSchema
  extends AMISFormItemBase,
    AMISCollapseSchemaBase {
  /**
   * 指定为 fieldset 组件
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
  body: AMISSchemaCollection;

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
   * 卡片隐藏就销毁内容
   */
  unmountOnExit?: boolean;

  /**
   * 子表单项展示方式
   */
  subFormMode?: 'normal' | 'inline' | 'horizontal';
  /**
   * 水平排版宽度占比
   */
  subFormHorizontal?: FormHorizontal;
}

export interface FieldSetProps
  extends RendererProps,
    Omit<
      AMISFieldSetSchema,
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

  static propsList: Array<string> = [
    'collapsable',
    'collapsed',
    'collapseTitle',
    'titlePosition',
    'collapseTitle'
  ];

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
      render,
      disabled,
      formMode: subFormMode || formMode,
      formHorizontal: subFormHorizontal || formHorizontal
    };
    mode && (props.mode = mode);
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
