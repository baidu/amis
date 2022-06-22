/**
 * @file 自定义代码
 */

import {registerEditorPlugin} from 'amis-editor-core';
import {
  BasePlugin,
  BasicSubRenderInfo,
  RendererEventContext,
  SubRendererInfo
} from 'amis-editor-core';
import {getSchemaTpl} from 'amis-editor-core';

export class CustomPlugin extends BasePlugin {
  // 关联渲染器名字
  rendererName = 'custom';
  $schema = '/schemas/CustomSchema.json';

  // 组件名称
  name = '自定义代码';
  isBaseComponent = true;
  description = '通过内嵌代码来实现功能';
  tags = ['功能'];
  icon = 'fa fa-gears';
  pluginIcon = 'custom-plugin';
  docLink = '/amis/zh-CN/components/custom';
  scaffold = {
    type: 'custom',
    html: '<div><h2>hello, world!</h2></div>',
    onMount: `
      const button = document.createElement('button');
      button.innerText = '点击修改姓名';
      button.onclick = event => {
        event.preventDefault();
      };
      dom.appendChild(button);`
  };
  previewSchema = {
    ...this.scaffold
  };

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

  buildSubRenderers(
    context: RendererEventContext,
    renderers: Array<SubRendererInfo>
  ): BasicSubRenderInfo | Array<BasicSubRenderInfo> | void {
    const info = super.buildSubRenderers.apply(this, arguments);
    // 只有 form 下才调 onChange
    // if (
    //   context.info.renderer.name === 'form' ||
    //   context.node.childRegions.some(i => i.region === 'body')
    // ) {
    (info as BasicSubRenderInfo).scaffold.onMount = `
        const button = document.createElement('button');
        button.innerText = '点击修改姓名ddd';
        button.onclick = event => {
          onChange('new name');
          event.preventDefault();
        };
        dom.appendChild(button);`;
    // }

    return info;
  }
}

registerEditorPlugin(CustomPlugin);
