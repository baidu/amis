import React from 'react';
import {registerActionPanel} from '../../actionsPanelManager';

registerActionPanel('refresh', {
  label: '刷新页面',
  tag: '页面',
  description: '触发浏览器刷新页面',
  descDetail: (info: any, context: any, props: any) => {
    return <div className="action-desc">{info?.label}</div>;
  }
});
