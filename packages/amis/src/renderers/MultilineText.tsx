/**
 * @file MultilineText
 */
import React from 'react';
import {Renderer, RendererProps} from 'amis-core';
import {BaseSchema} from '../Schema';
import {MultilineText} from 'amis-ui';

/**
* MultilineText
*/
export interface MultilineTextSchema extends BaseSchema {
  type: 'multiline-text';

  /**
 * 文本
 */
  text?: string;

  /**
   * 最大行数
   */
  maxRows?: number;

    /**
   * 展开按钮文本
   */
  expendButtonText?: string;

  /**
  * 收起按钮文本
  */
  collapseButtonText?: string;
}

export interface MultilineTextProps
  extends RendererProps,
    Omit<MultilineTextSchema, 'type' | 'className'> {}

export class MultilineTextField extends React.Component<MultilineTextProps, object> {
  render() {
    return <MultilineText {...this.props} />;
  }
}

@Renderer({
  type: 'multiline-text'
})
export class MultilineTextFieldRenderer extends MultilineTextField {}
