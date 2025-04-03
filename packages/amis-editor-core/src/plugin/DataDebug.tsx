import {registerEditorPlugin} from '../manager';
import {BaseEventContext, BasePlugin, BasicToolbarItem} from '../plugin';
import React from 'react';
import {importLazyComponent} from 'amis-core';
export const JsonView = React.lazy(() =>
  import('react-json-view').then(importLazyComponent)
);

/**
 * 添加调试功能
 */
export class DataDebugPlugin extends BasePlugin {
  static scene = ['layout'];
  static id = 'data-debug';

  buildEditorToolbar(
    {id, schema, node}: BaseEventContext,
    toolbars: Array<BasicToolbarItem>
  ) {
    const comp = node.getComponent();
    if (!comp || !comp.props || !comp.props.data || !comp.props.store) {
      return;
    }

    // const renderers = getRenderers();
    // const renderInfo = find(
    //   renderers,
    //   renderer => renderer.Renderer && comp instanceof renderer.Renderer
    // ) as RendererConfig;

    // if (!renderInfo || !renderInfo.storeType) {
    //   return;
    // }
    if (this.manager.store.toolbarMode === 'default') {
      toolbars.push({
        icon: 'fa fa-bug',
        order: -1000,
        placement: 'bottom',
        tooltip: '上下文数据',
        onClick: () => this.openDebugForm(comp.props.data)
      });
    }
  }

  dataViewer = {
    type: 'json',
    name: 'ctx',
    asFormItem: true,
    className: 'm-b-none',
    component: ({value}: {value: any}) => {
      const [index, setIndex] = React.useState(0);
      let start = value || {};
      const stacks = [start];

      while (Object.getPrototypeOf(start) !== Object.prototype) {
        const superData = Object.getPrototypeOf(start);

        if (Object.prototype.toString.call(superData) !== '[object Object]') {
          break;
        }

        stacks.push(superData);
        start = superData;
      }

      return (
        <div className="aeDataChain">
          <div className="aeDataChain-aside">
            <ul>
              {stacks.map((_, i) => (
                <li
                  className={i === index ? 'is-active' : ''}
                  key={i}
                  onClick={() => setIndex(i)}
                >
                  {i === 0 ? '当前' : i === 1 ? '上层' : `上${i}层`}
                </li>
              ))}
            </ul>
          </div>
          <div className="aeDataChain-main">
            <React.Suspense fallback={<div>...</div>}>
              <JsonView
                name={false}
                src={stacks[index]}
                enableClipboard={false}
                iconStyle="square"
                collapsed={2}
              />
            </React.Suspense>
          </div>
        </div>
      );
    }
  };

  async openDebugForm(data: any) {
    await this.manager.scaffold(
      {
        title: '上下文数据',
        body: [
          {
            ...this.dataViewer
          }
        ]
      },
      {
        ctx: data
      }
    );
  }
}

registerEditorPlugin(DataDebugPlugin);
