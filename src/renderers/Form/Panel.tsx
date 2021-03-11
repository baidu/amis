import React from 'react';
import {Renderer, RendererProps} from '../../factory';
import Panel, {PanelSchema} from '../Panel';
import {Schema} from '../../types';
import cx from 'classnames';
import {FormBaseControl, FormControlSchema} from './Item';

/**
 * 容器空间
 * 文档：https://baidu.gitee.io/amis/docs/components/form/contaier
 */
export interface PanelControlSchema extends FormBaseControl, PanelSchema {
  type: 'panel';

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

@Renderer({
  test: /(^|\/)form(?:\/.+)?\/control\/(?:\d+\/)?panel$/,
  weight: -100,
  name: 'panel-control'
})
export class PanelRenderer extends Panel {
  static propsList: Array<string> = ['onChange'];
  renderBody(): JSX.Element | null {
    const {
      render,
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
      classPrefix: ns
    } = this.props;

    if (!body && (controls || tabs || fieldSet)) {
      let props: any = {};
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
