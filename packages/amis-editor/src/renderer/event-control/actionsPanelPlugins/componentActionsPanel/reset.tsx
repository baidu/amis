import React from 'react';
import {registerActionPanel} from '../../actionsPanelManager';
import {renderCmptSelect, renderCmptIdInput} from './helper';
import {buildLinkActionDesc} from '../../helper';

registerActionPanel('reset', {
  label: '重置表单',
  tag: '组件',
  description: '重置表单数据',
  descDetail: (info: any, context: any, props: any) => {
    return (
      <div className="action-desc">
        重置
        {buildLinkActionDesc(props.manager, info)}
        的数据
      </div>
    );
  },
  supportComponents: 'form',
  schema: () => [...renderCmptSelect('目标组件', true), renderCmptIdInput()]
});
