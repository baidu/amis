import React from 'react';
import {registerEditorPlugin} from 'amis-editor-core';
import {BasePlugin, getSchemaTpl} from 'amis-editor-core';

export class HiddenControlPlugin extends BasePlugin {
  static id = 'HiddenControlPlugin';
  // 关联渲染器名字
  rendererName = 'hidden';
  $schema = '/schemas/AMISHiddenSchema.json';

  // 组件名称
  name = '隐藏域';
  isBaseComponent = true;
  icon = 'fa fa-eye-slash';
  pluginIcon = 'hidden-plugin';
  description = '隐藏表单项';
  searchKeywords = '隐藏字段';
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
    getSchemaTpl('layout:originPosition', {value: 'left-top'}),
    {
      type: 'input-text',
      name: 'value',
      label: '默认值'
    }
  ];

  renderRenderer(props: any) {
    return this.renderPlaceholder(
      '功能组件（隐藏字段）',
      props.key,
      props.style
    );
  }
}

registerEditorPlugin(HiddenControlPlugin);
