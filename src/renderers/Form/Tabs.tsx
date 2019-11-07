import React from 'react';
import {Renderer, RendererProps} from '../../factory';
import {Schema} from '../../types';
import Tabs from '../Tabs';

export interface TabsProps extends RendererProps {}

@Renderer({
  test: /(^|\/)form(?:.+)?\/control\/tabs$/i,
  weight: -100,
  name: 'tabs-control'
})
export class TabsRenderer extends React.Component<TabsProps, any> {
  static defaultProps = {
    mountOnEnter: false // form 中的不按需渲染
  };

  constructor(props: TabsProps) {
    super(props);
    this.renderTab = this.renderTab.bind(this);
  }

  renderTab(tab: any, {key}: any) {
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
          {renderFormItems(tab, ($path as string).replace(/^.*form\//, ''), {
            mode: tab.mode || formMode,
            horizontal: tab.horizontal || formHorizontal
          })}
        </div>
      );
    }

    return render(`tab/${key}`, tab.body || tab.tab || tab);
  }

  render() {
    const {children, type, ...rest} = this.props;

    return <Tabs {...rest} tabRender={this.renderTab} />;
  }
}
