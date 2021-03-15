import React from 'react';
import {Renderer, RendererProps} from '../../factory';
import Anchor, {AnchorSectionSchema, AnchorSchema} from '../Anchor';
import {FormBaseControl, FormControlSchema} from './Item';

export type AnchorSectionControlSchema = AnchorSectionSchema & {
  /**
   * 表单项集合
   */
  controls?: Array<FormControlSchema>;

  /**
   * @deprecated 请用类型 anchor
   */
  anchor?: any;

  /**
   * @deprecated 请用类型 fieldSet
   */
  fieldSet?: any;
};

/**
 * Anchor
 * 文档：https://baidu.gitee.io/amis/docs/components/form/anchor
 */
export interface AnchorControlSchema
  extends FormBaseControl,
    Omit<AnchorSchema, 'links'> {
  type: 'anchor';

  links: Array<AnchorSectionControlSchema>;
}

export interface AnchorProps extends RendererProps {}

@Renderer({
  test: /(^|\/)form(?:.+)?\/control\/anchor$/i,
  weight: -100,
  name: 'anchor-control'
})
export class AnchorRenderer extends Anchor {
  static defaultProps = {
    mountOnEnter: false // form 中的不按需渲染
  };
  static propsList: Array<string> = ['onChange', 'links'];

  renderSection = (section: any, props: any, key: number) => {
    const {
      renderFormItems,
      formMode,
      formHorizontal,
      $path,
      render,
      classnames: cx
    } = this.props;

    if (
      renderFormItems &&
      !section.type &&
      (section.controls || section.fieldSet || section.anchor)
    ) {
      return (
        <div className={cx(`Form--${formMode || 'normal'}`)}>
          {renderFormItems(
            section,
            `${($path as string).replace(/^.*form\//, '')}/${key}`,
            {
              mode: formMode,
              horizontal: formHorizontal
            }
          )}
        </div>
      );
    }

    return render(`section/${key}`, section.body || section);
  };
}
