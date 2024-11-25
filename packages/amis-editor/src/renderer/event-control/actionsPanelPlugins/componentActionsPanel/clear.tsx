import React from 'react';
import {registerActionPanel} from '../../actionsPanelManager';
import {renderCmptSelect, renderCmptIdInput} from './helper';
import {buildLinkActionDesc} from '../../helper';

registerActionPanel('clear', {
  label: '清空表单',
  tag: '组件',
  description: '清空表单数据',
  descDetail: (info: any, context: any, props: any) => {
    return (
      <div className="action-desc">
        清空
        {buildLinkActionDesc(props.manager, info)}
        的数据
      </div>
    );
  },
  supportComponents: 'form',
  schema: () => [...renderCmptSelect('目标组件', true), renderCmptIdInput()]
});
