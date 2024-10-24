import React from 'react';
import {registerActionPanel} from '../../actionsPanelManager';
import {renderCmptSelect, renderCmptIdInput} from './helper';

registerActionPanel('clear', {
  label: '清空表单',
  tag: '组件',
  description: '清空表单数据',
  descDetail: (info: any) => {
    return (
      <div>
        清空
        <span className="variable-left variable-right">
          {info?.rendererLabel || info.componentId || '-'}
        </span>
        的数据
      </div>
    );
  },
  supportComponents: 'form',
  schema: () => [...renderCmptSelect('目标组件', true), renderCmptIdInput()]
});
