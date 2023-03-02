import {
  registerEditorPlugin,
  BasePlugin,
  BaseEventContext,
  getSchemaTpl
} from 'amis-editor-core';
import '@webcomponents/webcomponentsjs/custom-elements-es5-adapter';
import {tipedLabel} from 'amis-editor-core';

// 需要一个示例，不然默认的没有高度都无法选中
class WebComponentDemo extends HTMLElement {
  connectedCallback() {
    const shadow = this.attachShadow({mode: 'open'});
    shadow.textContent = 'web-component-demo';
  }
}
try {
  customElements.define('web-component-demo', WebComponentDemo);
} catch (error: any) {
  console.log('[amis-editor]', error);
}

export class WebComponentPlugin extends BasePlugin {
  // 关联渲染器名字
  rendererName = 'web-component';
  $schema = '/schemas/WebComponentSchema.json';

  // 组件名称
  name = 'Web Component';
  isBaseComponent = true;
  description = '用于渲染 Web Component 组件';
  docLink = '/amis/zh-CN/components/web-component';
  tags = ['容器'];
  icon = 'fa fa-square-o';
  pluginIcon = 'web-component-plugin';
  scaffold = {
    type: 'web-component',
    tag: 'web-component-demo'
  };
  previewSchema = {
    ...this.scaffold
  };

  panelTitle = '包裹';

  notRenderFormZone = true;

  panelJustify = true;

  panelBodyCreator = (context: BaseEventContext) => {
    return getSchemaTpl('tabs', [
      {
        title: '属性',
        body: [
          getSchemaTpl('collapseGroup', [
            {
              className: 'p-none',
              title: '基本',
              body: [
                {
                  type: 'input-text',
                  label: '标签',
                  name: 'tag'
                },
                getSchemaTpl('combo-container', {
                  type: 'input-kv',
                  mode: 'normal',
                  name: 'props',
                  label: '属性'
                })
              ]
            }
          ])
        ]
      }
    ]);
  };
}

registerEditorPlugin(WebComponentPlugin);
