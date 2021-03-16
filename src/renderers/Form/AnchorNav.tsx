import React from 'react';
import {Renderer, RendererProps} from '../../factory';
import AnchorNav, {AnchorNavSectionSchema, AnchorNavSchema} from '../AnchorNav';
import {FormBaseControl, FormControlSchema} from './Item';

export type AnchorNavSectionControlSchema = AnchorNavSectionSchema & {
  /**
   * 表单项集合
   */
  controls?: Array<FormControlSchema>;
};

/**
 * AnchorNav
 * 文档：https://baidu.gitee.io/amis/docs/components/form/anchor-nav
 */
export interface AnchorNavControlSchema
  extends FormBaseControl,
    Omit<AnchorNavSchema, 'links'> {
  type: 'anchor-nav';

  links: Array<AnchorNavSectionControlSchema>;
}

export interface AnchorNavProps extends RendererProps {}

@Renderer({
  test: /(^|\/)form(?:.+)?\/control\/anchor-nav$/i,
  weight: -100,
  name: 'anchor-nav-control'
})
export class AnchorNavRenderer extends AnchorNav {
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
    debugger;
    if (renderFormItems && !section.type && section.controls) {
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
