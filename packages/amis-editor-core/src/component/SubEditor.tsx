import React from 'react';
import {EditorManager} from '../manager';
import {EditorStoreType} from '../store/editor';
import {render} from 'amis';
import {createObject} from 'amis-core';

import {observer} from 'mobx-react';
import Editor from './Editor';
import {
  BuildPanelEventContext,
  PluginEvent,
  RendererInfoResolveEventContext
} from '../plugin';
import {autobind} from '../util';

export interface SubEditorProps {
  store: EditorStoreType;
  manager: EditorManager;
  theme?: string;
}

@observer
export class SubEditor extends React.Component<SubEditorProps> {
  @autobind
  afterResolveEditorInfo(event: PluginEvent<RendererInfoResolveEventContext>) {
    const store = this.props.store;
    const context = event.context;
    const slot = store.subEditorContext?.slot;

    if (!slot) {
      if (
        context.data &&
        !context.schemaPath &&
        store.subEditorContext?.memberImmutable
      ) {
        context.data.memberImmutable = store.subEditorContext?.memberImmutable;
      }
      return;
    }
    const slotPath = store.subEditorSlotPath;

    if (!~context.schemaPath.indexOf(slotPath) && context.data) {
      context.data.editable = false;
      context.data.memberImmutable = !Array.isArray(
        store.subEditorContext?.value
      );

      if (!context.data.memberImmutable) {
        context.data.name = '容器';
      }
    } else if (context.schemaPath === slotPath && context.data) {
      if (!Array.isArray(store.subEditorContext?.value)) {
        context.data.movable = false;
        context.data.removable = false;
      }

      context.data.typeMutable = store.subEditorContext?.typeMutable;
    }
  }

  @autobind
  handleBuildPanels(event: PluginEvent<BuildPanelEventContext>) {
    const store = this.props.store;
    const slot = store.subEditorContext?.slot;

    if (!slot) {
      return;
    }
    // const slotPath = store.subEditorSlotPath;
    const context = event.context;

    // 成员节点固定时，不展示组件面板
    if (!!context.info.memberImmutable) {
      const panels = context.data.concat();
      context.data.splice(0, context.data.length);
      const renderersPanel = panels.filter(r => r.key !== 'renderers');
      renderersPanel && context.data.push(...renderersPanel);
      // 默认选中大纲
      context.changeLeftPanelKey = 'outline';
    }

    /*
    // 备注: 当前逻辑有点问题（context.schemaPath 基本上都不会含 slotPath），先注释掉。
    if (!~context.schemaPath.indexOf(slotPath)) {
      const panels = context.data.concat();
      context.data.splice(0, context.data.length);

      // 如果是slot外面，一个面板都不给。
      if (!context.info.memberImmutable) {
        const renderersPanel = panels.find(r => r.key === 'renderers');
        renderersPanel && context.data.push(renderersPanel);
      }
    }
    */
  }

  buildSchema() {
    const {store, manager} = this.props;
    const subEditorContext = store.subEditorContext;
    const config = manager.config;
    let superEditorData: any = store.superEditorData;
    if (!!subEditorContext) {
      superEditorData = createObject(store.superEditorData, subEditorContext?.data?.__super);
    }
    return {
      size: 'full',
      title: store.subEditorContext?.title,
      onClose: store.closeSubEditor,
      onConfirm: store.confirmSubEditor,
      body: store.subEditorContext
        ? {
            type: 'form',
            mode: 'normal',
            wrapperComponent: 'div',
            onValidate: async (value: any) => {
              const result = await store.subEditorContext?.validate?.(value);
              if (result) {
                return {
                  schema: result
                };
              }
              return;
            },
            onChange: store.subEditorOnChange,
            body: [
              {
                name: 'schema',
                asFormItem: true,
                children: ({
                  value,
                  onChange
                }: {
                  value: any;
                  onChange: (value: any) => void;
                }) => (
                  <Editor
                    autoFocus
                    value={value}
                    ref={store.subEditorRef}
                    onChange={onChange}
                    data={store.subEditorContext?.data}
                    superEditorData={superEditorData}
                    schemaFilter={manager.config.schemaFilter}
                    theme={manager.env.theme}
                    afterResolveEditorInfo={this.afterResolveEditorInfo}
                    onBuildPanels={this.handleBuildPanels}
                    isMobile={store.isMobile}
                    isSubEditor={true}
                    iframeUrl={config.iframeUrl}
                    ctx={store.ctx}
                    amisEnv={config.amisEnv}
                    plugins={config.plugins}
                    showCustomRenderersPanel={store.showCustomRenderersPanel ?? true}
                    isHiddenProps={config.isHiddenProps}
                    $schemaUrl={config.$schemaUrl}
                  />
                )
              }
            ]
          }
        : {
            type: 'tpl',
            tpl: 'Loading...'
          },
      actions: [
        [
          {
            children: subEditorContext ? (
              <div className="ae-DialogToolbar">
                <button
                  type="button"
                  data-tooltip="撤销"
                  disabled={!subEditorContext.canUndo}
                  onClick={store.undoSubEditor}
                >
                  <i className="fa fa-undo" />
                </button>
                <button
                  type="button"
                  data-tooltip="重做"
                  disabled={!subEditorContext.canRedo}
                  onClick={store.redoSubEditor}
                >
                  <i className="fa fa-rotate-right" />
                </button>
              </div>
            ) : null
          },
          {
            type: 'submit',
            label: '确认',
            level: 'primary'
          },
          {
            type: 'button',
            label: '取消',
            actionType: 'close'
          }
        ]
      ],
      closeOnEsc: false,
      bodyClassName: 'ae-dialog subEditor-dialog'
      // lazyRender: true
    };
  }

  render() {
    const {store, theme, manager} = this.props;
    return render(
      {
        type: 'dialog',
        ...this.buildSchema()
      },

      {
        show: !!store.subEditorContext,
        data: {
          schema: store.subEditorValue
        }
      },
      {
        ...manager.env,
        session: 'editor-dialog',
        theme: theme
      }
    );
  }
}
