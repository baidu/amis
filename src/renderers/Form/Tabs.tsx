import React from 'react';
import {Renderer, RendererProps} from '../../factory';
import {Schema} from '../../types';
import Tabs, {TabSchema, TabsSchema} from '../Tabs';
import {FormBaseControl, FormControlSchema} from './Item';

export type TabControlSchema = TabSchema & {
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
};

/**
 * Tabs
 * 文档：https://baidu.gitee.io/amis/docs/components/form/tabs
 */
export interface TabsControlSchema
  extends FormBaseControl,
    Omit<TabsSchema, 'tabs'> {
  type: 'tabs';

  tabs: Array<TabControlSchema>;
}

export interface TabsProps extends RendererProps {}

@Renderer({
  test: /(^|\/)form(?:.+)?\/control\/tabs$/i,
  weight: -100,
  name: 'tabs-control'
})
export class TabsRenderer extends Tabs {
  static defaultProps = {
    mountOnEnter: false // form 中的不按需渲染
  };
  static propsList: Array<string> = ['onChange', 'tabs'];

  renderTab = (tab: any, props: any, key: number) => {
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
      !tab.type &&
      (tab.controls || tab.fieldSet || tab.tabs)
    ) {
      return (
        <div className={cx(`Form--${tab.mode || formMode || 'normal'}`)}>
          {renderFormItems(
            tab,
            `${($path as string).replace(/^.*form\//, '')}/${key}`,
            {
              mode: tab.mode || formMode,
              horizontal: tab.horizontal || formHorizontal
            }
          )}
        </div>
      );
    }

    return render(`tab/${key}`, tab.body || tab.tab || tab);
  };
}
