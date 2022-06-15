import {registerEditorPlugin} from '../manager';
import {BaseEventContext, BasePlugin, BasicToolbarItem} from '../plugin';
import React from 'react';
import JsonView, {InteractionProps} from 'react-json-view';

/**
 * 添加调试功能
 */
export class DataDebugPlugin extends BasePlugin {
  buildEditorToolbar(
    {id, schema, node}: BaseEventContext,
    toolbars: Array<BasicToolbarItem>
  ) {
    const comp = node.getComponent();
    if (!comp || !comp.props.data || !comp.props.store) {
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
    const store = comp.props.store;

    toolbars.push({
      icon: 'fa fa-bug',
      order: -1000,
      placement: 'bottom',
      tooltip: '上下文数据',
      onClick: () =>
        this.openDebugForm(
          comp.props.data,
          store.updateData && store.data === comp.props.data
            ? values => store.updateData(values)
            : undefined
        )
    });
  }

  dataViewer = {
    type: 'json',
    name: 'ctx',
    asFormItem: true,
    className: 'm-b-none',
    component: ({
      value,
      onChange,
      readOnly
    }: {
      value: any;
      onChange: (value: any) => void;
      readOnly?: boolean;
    }) => {
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

      function emitChange(e: InteractionProps) {
        const obj = Object.create(stacks[1] || Object.prototype);
        Object.keys(e.updated_src).forEach(
          key => (obj[key] = (e.updated_src as any)[key])
        );
        onChange(obj);
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
            <JsonView
              name={false}
              src={stacks[index]}
              enableClipboard={false}
              iconStyle="square"
              onAdd={index === 0 && !readOnly ? emitChange : false}
              onEdit={index === 0 && !readOnly ? emitChange : false}
              onDelete={index === 0 && !readOnly ? emitChange : false}
              collapsed={2}
            />
          </div>
        </div>
      );
    }
  };

  async openDebugForm(data: any, callback?: (values: any) => void) {
    const result = await this.manager.scaffold(
      {
        title: '上下文数据',
        body: [
          {
            ...this.dataViewer,
            readOnly: callback ? false : true
          }
        ]
      },
      {
        ctx: data
      }
    );

    callback?.((result as any).ctx);
  }
}

registerEditorPlugin(DataDebugPlugin);
