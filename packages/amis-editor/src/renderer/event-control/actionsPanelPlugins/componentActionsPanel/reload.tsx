import React from 'react';
import {getRendererByName} from 'amis-core';
import {
  getSchemaTpl,
  defaultValue,
  JSONGetById,
  tipedLabel,
  EditorManager
} from 'amis-editor-core';
import {registerActionPanel} from '../../actionsPanelManager';
import {renderCmptSelect, renderCmptIdInput} from './helper';
import {buildLinkActionDesc} from '../../helper';

registerActionPanel('reload', {
  label: '重新请求数据',
  tag: '组件',
  description:
    '如果开启发送数据，会先发送配置数据到目标组件，然后重新请求数据。',
  descDetail: (info: any, context: any, props: any) => {
    // TODO: actionConfig
    return (
      <div className="action-desc">
        刷新
        {buildLinkActionDesc(props.manager, info)}
        组件
      </div>
    );
  },
  supportComponents: 'byComponent',
  schema: (manager: EditorManager) => [
    {
      type: 'wrapper',
      size: 'sm',
      className: 'p-0',
      body: [
        ...renderCmptSelect(
          '目标组件',
          true,
          (value: string, oldVal: any, data: any, form: any) => {
            form.setValueByName('args.resetPage', true);
            form.setValueByName('__addParam', false);
            form.setValueByName('__containerType', 'all');
            form.setValueByName('__reloadParam', []);
          },
          true
        )
      ]
    },
    renderCmptIdInput((value: string, oldVal: any, data: any, form: any) => {
      // 找到组件并设置相关的属性
      let schema = JSONGetById(manager.store.schema, value, 'id');
      if (schema) {
        const render = getRendererByName(schema.type);
        let __isScopeContainer = !!render?.storeType;
        let __rendererName = schema.type;
        form.setValues({
          __isScopeContainer,
          __rendererName
        });
      } else {
        form.setValues({
          __isScopeContainer: false,
          __rendererName: ''
        });
      }
    }),
    {
      type: 'switch',
      name: '__resetPage',
      label: tipedLabel('重置页码', '选择“是”时，将重新请求第一页数据。'),
      onText: '是',
      offText: '否',
      mode: 'horizontal',
      pipeIn: defaultValue(true),
      visibleOn: `this.actionType === "reload" && this.__rendererName === "crud"`
    },
    {
      type: 'switch',
      name: '__addParam',
      label: tipedLabel(
        '发送数据',
        '开启“发送数据”后，所配置的数据将发送给目标组件，这些数据将与目标组件数据域进行合并或覆盖'
      ),
      onText: '是',
      offText: '否',
      mode: 'horizontal',
      pipeIn: defaultValue(false),
      visibleOn: `this.actionType === "reload" &&  this.__isScopeContainer`,
      onChange: (value: string, oldVal: any, data: any, form: any) => {
        form.setValueByName('__containerType', 'all');
      }
    },
    {
      type: 'radios',
      name: '__containerType',
      mode: 'horizontal',
      label: '',
      pipeIn: defaultValue('all'),
      visibleOn: `this.__addParam && this.actionType === "reload" && this.__isScopeContainer`,
      options: [
        {
          label: '直接赋值',
          value: 'all'
        },
        {
          label: '成员赋值',
          value: 'appoint'
        }
      ],
      onChange: (value: string, oldVal: any, data: any, form: any) => {
        form.setValueByName('__reloadParams', []);
        form.setValueByName('__valueInput', undefined);
      }
    },
    getSchemaTpl('formulaControl', {
      name: '__valueInput',
      label: '',
      variables: '${variables}',
      size: 'lg',
      mode: 'horizontal',
      required: true,
      visibleOn: `this.__addParam && this.__containerType === "all" && this.actionType === "reload" && this.__isScopeContainer`
    }),
    {
      type: 'combo',
      name: '__reloadParams',
      label: '',
      multiple: true,
      removable: true,
      addable: true,
      strictMode: false,
      canAccessSuperData: true,
      size: 'lg',
      mode: 'horizontal',
      formClassName: 'event-action-combo',
      itemClassName: 'event-action-combo-item',
      items: [
        {
          name: 'key',
          type: 'input-text',
          placeholder: '参数名',
          labelField: 'label',
          valueField: 'value',
          required: true
        },
        getSchemaTpl('formulaControl', {
          name: 'val',
          variables: '${variables}',
          placeholder: '参数值',
          columnClassName: 'flex-1'
        })
      ],
      visibleOn: `this.__addParam && this.__containerType === "appoint" && this.actionType === "reload" && this.__isScopeContainer`
    },
    {
      type: 'radios',
      name: 'dataMergeMode',
      mode: 'horizontal',
      label: tipedLabel(
        '数据处理方式',
        '选择“合并”时，会将数据合并到目标组件的数据域。<br/>选择“覆盖”时，数据会直接覆盖目标组件的数据域。'
      ),
      pipeIn: defaultValue('merge'),
      visibleOn: `this.__addParam && this.actionType === "reload" && this.__isScopeContainer`,
      options: [
        {
          label: '合并',
          value: 'merge'
        },
        {
          label: '覆盖',
          value: 'override'
        }
      ]
    }
  ]
});
