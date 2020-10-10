import React from 'react';
import {Renderer} from '../../factory';
import cx from 'classnames';
import Container, {ContainerSchema} from '../Container';
import FormItem, {
  FormBaseControl,
  FormControlProps,
  FormControlSchema
} from './Item';
import {IIRendererStore} from '../../store/iRenderer';
import {SchemaCollection} from '../../Schema';

/**
 * 容器空间
 * 文档：https://baidu.gitee.io/amis/docs/components/form/contaier
 */
export interface ContainerControlSchema
  extends FormBaseControl,
    Omit<ContainerSchema, 'body'> {
  type: 'container';

  body?: SchemaCollection;

  /**
   * 表单项集合
   */
  controls?: Array<FormControlSchema>;

  /**
   * @deprecated 请用类型 tabs
   */
  tabs?: any;

  /**
   * @deprecated 请用类型 fieldSet
   */
  fieldSet?: any;
}

export interface ContainerProps extends FormControlProps {
  store: IIRendererStore;
}

@FormItem({
  type: 'container',
  strictMode: false,
  sizeMutable: false
})
export class ContainerControlRenderer extends Container<ContainerProps> {
  static propsList: Array<string> = ['onChange'];

  renderBody(): JSX.Element | null {
    const {
      renderFormItems,
      body,
      bodyClassName,
      controls,
      tabs,
      fieldSet,
      mode,
      formMode,
      horizontal,
      $path,
      classPrefix: ns,
      store,
      render
    } = this.props;

    if (!body && (controls || tabs || fieldSet)) {
      let props: any = {
        store,
        data: store.data,
        render
      };
      mode && (props.mode = mode);
      horizontal && (props.horizontal = horizontal);

      return (
        <div
          className={cx(
            `${ns}Form--${props.mode || formMode || 'normal'}`,
            bodyClassName
          )}
        >
          {renderFormItems(
            {
              controls,
              tabs,
              fieldSet
            },
            ($path as string).replace(/^.*form\//, ''),
            props
          )}
        </div>
      );
    }

    return super.renderBody();
  }
}
