import React from 'react';
import {registerActionPanel} from '../../actionsPanelManager';
import {getSchemaTpl, EditorManager} from 'amis-editor-core';

registerActionPanel('broadcast', {
  label: '全局广播事件',
  tag: '其他',
  description: '触发全局广播事件',
  innerArgs: [],
  descDetail: (info: any, context: any, props: any) => {
    const globalEvents = props.manager.store.globalEvents;
    const event = globalEvents.find(
      (item: any) => item.name === info?.eventName
    );
    return (
      <div>
        触发
        <span className="ml-1 mr-1">{event?.label || info?.eventName}</span>
        全局广播事件
      </div>
    );
  },
  schema: (manager: EditorManager, data: any) => {
    const globalEvents = manager.store.globalEvents;
    return {
      type: 'wrapper',
      body: [
        {
          type: 'select',
          name: 'eventName',
          required: true,
          label: '请选择全局事件',
          options: globalEvents.map(item => ({
            label: item.label,
            value: item.name,
            mapping: item.mapping,
            disabled: item.name === data.eventKey
          })),
          size: 'lg',
          mode: 'horizontal',
          initAutoFill: true,
          autoFill: {
            __mapping: '${mapping}'
          },
          onChange: async (val: any, oldVal: any, props: any, form: any) => {
            form.setValueByName('data', void 0);
          }
        },
        {
          type: 'input-kv',
          name: 'data',
          label: '参数映射',
          mode: 'horizontal',
          draggable: false,
          visibleOn: 'this.eventName',
          keySchema: {
            type: 'select',
            label: false,
            name: 'key',
            source: '${ARRAYMAP(__mapping, i => i.key)}'
          },
          valueSchema: getSchemaTpl('tplFormulaControl', {
            label: false,
            name: 'value',
            clearable: true,
            placeholder: '请输入参数值',
            variables: '${variables}',
            header: '配置参数值'
          })
        }
      ]
    };
  }
});
