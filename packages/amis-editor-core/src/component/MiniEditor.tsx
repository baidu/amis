import React from 'react';
import Editor, {EditorProps} from './Editor';
import cx from 'classnames';
import Preview from './Preview';
import {SubEditor} from './SubEditor';
import {ScaffoldModal} from './ScaffoldModal';
import {autobind} from '../util';
import {BaseEventContext, BasicPanelItem, PluginEvent} from '../plugin';

export default class MiniEditor extends Editor {
  constructor(props: EditorProps) {
    super(props);
    this.manager.on('build-panels', this.buildPanels);
  }

  componentWillUnmount() {
    this.manager.off('build-panels', this.buildPanels);
  }

  @autobind
  buildPanels(event: PluginEvent<BaseEventContext>) {
    const panels: Array<BasicPanelItem> = event.context.data!;

    // todo, 以后干脆不要收集。
    // 因为 MiniEditor 不显示面板，所以把搜集的所有面板都干掉。
    if (Array.isArray(panels)) {
      panels.splice(0, panels.length);
    }
  }

  render() {
    const {preview, className, theme, data} = this.props;

    return (
      <div
        className={cx(
          'ae-Editor',
          {
            preview: preview
          },
          className
        )}
      >
        <div className="ae-Editor-inner" onContextMenu={this.handleContextMenu}>
          <div className="ae-Main">
            <Preview
              editable={!preview}
              store={this.store}
              manager={this.manager}
              theme={theme}
              data={data}
            ></Preview>
          </div>
        </div>

        <SubEditor store={this.store} manager={this.manager} theme={theme} />
        <ScaffoldModal
          store={this.store}
          manager={this.manager}
          theme={theme}
        />
      </div>
    );
  }
}
