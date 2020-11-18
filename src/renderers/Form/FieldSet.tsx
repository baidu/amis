import React from 'react';
import {FormSchemaHorizontal} from '.';
import {Renderer, RendererProps} from '../../factory';
import {SchemaCollection, SchemaTpl} from '../../Schema';
import Collapse, {CollapseSchema} from '../Collapse';
import {FormBaseControl, FormControlSchema} from './Item';

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
   *  标题展示模式
   */
  titlePosition: 'top' | 'bottom';

  /**
   * 表单项集合
   */
  controls?: Array<FormControlSchema>;

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
}

export interface FieldSetProps
  extends RendererProps,
    Omit<FieldSetControlSchema, 'type'> {}

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
      renderFormItems,
      controls,
      body,
      collapsable,
      horizontal,
      render,
      mode,
      formMode,
      $path,
      classnames: cx,
      store,
      formClassName
    } = this.props;

    if (!controls) {
      return render('body', body!) as JSX.Element;
    }

    let props: any = {
      store,
      data: store!.data,
      render
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
        {renderFormItems(
          {controls},
          ($path as string).replace(/^.*form\//, ''),
          props
        )}
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
        headingComponent="legend"
      />
    );
  }
}

@Renderer({
  test: /(^|\/)form(?:.+)?\/control\/fieldSet$/i,
  weight: -100,
  name: 'fieldset'
})
export class FieldSetRenderer extends FieldSetControl {}
