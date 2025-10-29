import React from 'react';
import {registerEditorPlugin, getSchemaTpl} from 'amis-editor-core';
import {
  BasePlugin,
  BasicSubRenderInfo,
  RendererEventContext,
  SubRendererInfo
} from 'amis-editor-core';

export class UUIDControlPlugin extends BasePlugin {
  static id = 'UUIDControlPlugin';
  // 关联渲染器名字
  rendererName = 'uuid';
  $schema = '/schemas/AMISUuidSchema.json';

  // 组件名称
  name = 'UUID';
  isBaseComponent = true;
  icon = 'fa fa-eye-slash';
  pluginIcon = 'uuid-plugin';
  description = '自动生成的 UUID';
  searchKeywords = 'uuid字段';
  docLink = '/amis/zh-CN/components/form/uuid';
  tags = ['表单项'];
  scaffold = {
    type: 'uuid',
    name: 'uuid'
  };
  previewSchema: any = {
    type: 'form',
    wrapWithPanel: false,
    body: [
      {
        ...this.scaffold
      }
    ]
  };

  panelTitle = 'UUID';
  panelBody = [
    getSchemaTpl('layout:originPosition', {value: 'left-top'}),
    {type: 'static', value: '自动按 UUID v4 格式生成，无需配置'}
  ];

  renderRenderer(props: any) {
    return this.renderPlaceholder('UUID（展现将隐藏）', props.key, props.style);
  }
}

registerEditorPlugin(UUIDControlPlugin);
