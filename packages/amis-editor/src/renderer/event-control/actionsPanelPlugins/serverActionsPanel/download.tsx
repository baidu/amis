import {registerActionPanel} from '../../actionsPanelManager';
import {getSchemaTpl} from 'amis-editor-core';

registerActionPanel('download', {
  label: '下载文件',
  tag: '服务',
  description: '触发下载文件',
  schema: () => [
    {
      type: 'wrapper',
      className: 'p-none',
      body: [
        getSchemaTpl('apiControl', {
          name: 'api',
          label: '配置请求',
          mode: 'horizontal',
          inputClassName: 'm-b-none',
          size: 'lg',
          renderLabel: true,
          required: true
        })
      ]
    }
  ]
});
