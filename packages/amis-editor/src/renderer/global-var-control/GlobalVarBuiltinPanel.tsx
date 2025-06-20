import {registerGlobalVarPanel} from './GlobalVarManagerPanel';
import React from 'react';
import {SchemaForm} from 'amis-editor-core';

const basicControls: Array<any> = [
  {
    type: 'input-text',
    label: '变量名',
    name: 'key',
    required: true,
    size: 'md',
    validations: {
      isVariableName: true
    },
    addOn: {
      type: 'text',
      label: 'global.',
      position: 'left'
    }
  },

  {
    type: 'input-text',
    label: '标题',
    required: true,
    name: 'label',
    size: 'md'
  },

  {
    type: 'json-schema-editor',
    name: 'valueSchema',
    label: '值格式',
    rootTypeMutable: true,
    showRootInfo: true,
    value: 'string'
  },

  {
    type: 'input-text',
    label: '默认值',
    name: 'defaultValue',
    size: 'md'
  },

  {
    type: 'switch',
    label: '客户端持久化',
    name: 'storageOn',
    trueValue: 'client',
    falseValue: '',
    description: '是否在客户端持久化存储，刷新页面后依然有效'
  },

  {
    type: 'button-group-select',
    label: '数据作用域',
    visibleOn: '${storageOn}',
    name: 'scope',
    options: [
      {
        label: '页面共享',
        value: 'page'
      },
      {
        label: '全局共享',
        value: 'app'
      }
    ]
  },

  {
    type: 'textarea',
    label: '描述',
    name: 'description'
  }
];

/**
 * 注册基本变量设置面板
 */
registerGlobalVarPanel('builtin', {
  title: '基础变量',
  description: '系统内置的全局变量',
  component: (props: any) => (
    <SchemaForm
      mode="horizontal"
      horizontal={{
        left: 2
      }}
      {...props}
      ref={props.formRef}
      body={basicControls}
      submitOnChange={false}
      appendSubmitBtn={false}
    />
  )
});
