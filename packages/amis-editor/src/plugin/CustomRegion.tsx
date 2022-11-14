/**
 * @file 自定义代码
 */

import React from 'react';
import {registerEditorPlugin} from 'amis-editor-core';
import {
  BasePlugin,
  BasicRendererInfo,
  RendererInfoResolveEventContext,
  PluginInterface,
  RegionConfig
} from 'amis-editor-core';
import {defaultValue, getSchemaTpl} from 'amis-editor-core';
import isArray from 'lodash/isArray';

export class CustomPlugin extends BasePlugin {
  // 关联渲染器名字
  rendererName = 'custom';
  $schema = '/schemas/CustomSchema.json';

  // 组件名称
  name = '自定义容器';
  isBaseComponent = true;
  disabledRendererPlugin = true; // 待完善，暂时隐藏

  description = '通过自定义代码来实现容器组件';
  docLink = '/amis/zh-CN/components/custom';
  tags = ['功能', '容器'];
  icon = 'fa fa-gears';
  scaffold = {
    type: 'custom',
    html: '<div>\n<h2>hello, world!</h2>\n<div id="customBox">自定义容器区域</div>\n</div>',
    onMount: `this.renderChild('body', props.body, document.getElementById('customBox'));`,
    body: [
      {
        type: 'tpl',
        tpl: '<p>自定义容器区域</p>'
      }
    ]
  };

  previewSchema = {
    ...this.scaffold
  };

  regions: Array<RegionConfig> = [
    {
      key: 'body',
      label: '内容区'
    }
  ];

  panelTitle = '自定义代码';
  panelBody = [
    getSchemaTpl('fieldSet', {
      title: 'HTML 内容',
      body: [
        {
          label: 'HTML 内容',
          name: 'html',
          type: 'editor',
          allowFullscreen: true
        }
      ]
    }),
    getSchemaTpl('fieldSet', {
      title: 'onMount',
      body: [
        {
          name: 'onMount',
          type: 'editor',
          allowFullscreen: true,
          size: 'xxl',
          label: 'onMount 代码',
          options: {
            lineNumbers: 'off',
            glyphMargin: false,
            lineDecorationsWidth: 0,
            lineNumbersMinChars: 0
          }
        }
      ]
    }),
    getSchemaTpl('fieldSet', {
      title: 'onUpdate',
      body: [
        {
          name: 'onUpdate',
          type: 'editor',
          allowFullscreen: true,
          size: 'xxl',
          label: 'onUpdate 代码'
        }
      ]
    }),
    getSchemaTpl('fieldSet', {
      title: 'onUnmount',
      body: [
        {
          name: 'onUnmount',
          type: 'editor',
          allowFullscreen: true,
          size: 'xxl',
          label: 'onUnmount 代码'
        }
      ]
    })
  ];

  /**
   * 备注: 根据当前custom组件的schema中是否有body元素来启动容器模式，用于实现custom组件实现自定义容器类型
   */
  getRendererInfo(
    context: RendererInfoResolveEventContext
  ): BasicRendererInfo | void {
    const plugin: PluginInterface = this;
    const {renderer, schema} = context;
    if (
      schema.$$id &&
      plugin.name &&
      plugin.rendererName &&
      plugin.rendererName === renderer.name
    ) {
      let regions = plugin.regions;
      if (!regions && schema && schema.body && isArray(schema.body)) {
        regions = [
          {
            key: 'body',
            label: '自定义容器区'
          }
        ];
      }

      return {
        name: plugin.name,
        regions: regions,
        patchContainers: plugin.patchContainers,
        // wrapper: plugin.wrapper,
        vRendererConfig: plugin.vRendererConfig,
        wrapperProps: plugin.wrapperProps,
        wrapperResolve: plugin.wrapperResolve,
        filterProps: plugin.filterProps,
        $schema: plugin.$schema,
        renderRenderer: plugin.renderRenderer,
        multifactor: plugin.multifactor,
        scaffoldForm: plugin.scaffoldForm,
        disabledRendererPlugin: plugin.disabledRendererPlugin,
        isBaseComponent: plugin.isBaseComponent,
        rendererName: plugin.rendererName
      };
    }
  }
}

registerEditorPlugin(CustomPlugin);
