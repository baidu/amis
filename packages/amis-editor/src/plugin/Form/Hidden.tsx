import React from 'react';
import {registerEditorPlugin} from 'amis-editor-core';
import {BasePlugin} from 'amis-editor-core';

export class HiddenControlPlugin extends BasePlugin {
  // 关联渲染器名字
  rendererName = 'hidden';
  $schema = '/schemas/HiddenControlSchema.json';

  // 组件名称
  name = '隐藏域';
  isBaseComponent = true;
  icon = 'fa fa-eye-slash';
  pluginIcon = 'hidden-plugin';
  description = `隐藏表单项`;
  docLink = '/amis/zh-CN/components/form/hidden';
  tags = ['表单项'];
  scaffold = {
    type: 'hidden',
    name: 'var1'
  };
  previewSchema: any = {
    type: 'tpl',
    tpl: '隐藏域'
  };

  panelTitle = '隐藏域';
  panelBody = [
    {
      type: 'input-text',
      name: 'value',
      label: '默认值'
    }
  ];

  renderRenderer(props: any) {
    return (
      <div key={props.key} className="wrapper-sm b-a b-light m-b-sm">
        <span className="text-muted">功能组件（隐藏字段）</span>
      </div>
    );
  }
}

registerEditorPlugin(HiddenControlPlugin);
