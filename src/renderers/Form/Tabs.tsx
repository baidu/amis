import find from 'lodash/find';
import React from 'react';
import {Renderer, RendererProps} from '../../factory';
import {Schema} from '../../types';
import Tabs, {TabSchema, TabsSchema} from '../Tabs';
import {FormBaseControl, FormControlSchema} from './Item';

export type TabControlSchema = TabSchema & {
  /**
   * Tab 值, 当作为表当项使用时，这个值可以写入到表单中。
   */
  value?: string;

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

  /**
   * 如果配置了名称，Tabs 的打开项会同步写入变量中。
   */
  name?: string;
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

  resolveTabByKey(key: any) {
    const tabs = this.props.tabs;

    if (!Array.isArray(tabs)) {
      return;
    }

    return find(tabs, (tab: TabSchema, index) =>
      tab.hash ? tab.hash === key : index === key
    );
  }

  resolveKeyByValue(value: any) {
    const tabs = this.props.tabs;

    if (!Array.isArray(tabs)) {
      return;
    }

    const tab: TabSchema = find(
      tabs,
      tab => ((tab as TabControlSchema).value ?? tab.title) === value
    ) as TabSchema;

    return tab && tab.hash ? tab.hash : tabs.indexOf(tab);
  }

  componentDidMount() {
    super.componentDidMount();
    const {name, value, onChange, source, tabs} = this.props;

    // 如果没有配置 name ，说明不需要同步表单值
    if (
      !name ||
      typeof onChange !== 'function' ||
      // 如果关联某个变量数据，则不启用
      source
    ) {
      return;
    }

    //  如果有值，切到对应的 tab
    if (value && Array.isArray(tabs)) {
      const key = this.resolveKeyByValue(value);
      key !== undefined && this.handleSelect(key);
    } else {
      const tab = this.resolveTabByKey(this.activeKey);
      if (tab && value !== ((tab as TabControlSchema).value ?? tab.title)) {
        onChange((tab as TabControlSchema).value ?? tab.title);
      }
    }
  }

  componentDidUpdate(prevProps: TabsProps, prevState: any) {
    super.componentDidUpdate(prevProps as any, prevState);

    const {name, value, onChange, source, tabs} = this.props;

    // 如果没有配置 name ，说明不需要同步表单值
    if (
      !name ||
      typeof onChange !== 'function' ||
      // 如果关联某个变量数据，则不启用
      source
    ) {
      return;
    }

    let key: any;
    if (
      value !== prevProps.value &&
      (key = this.resolveKeyByValue(value)) !== undefined &&
      key !== this.activeKey
    ) {
      this.handleSelect(key);
    } else if (this.activeKey !== prevState.activeKey) {
      const tab = this.resolveTabByKey(this.activeKey);
      if (tab && value !== ((tab as TabControlSchema).value ?? tab.title)) {
        onChange((tab as TabControlSchema).value ?? tab.title);
      }
    }
  }
}
