import {Button, Html, Icon, InputBox, render} from 'amis';
import find from 'lodash/find';
import {observer} from 'mobx-react';
import React from 'react';
import {PanelProps, SubRendererInfo} from '../../plugin';
import {autobind} from '../../util';
import {RendererThumb} from '../RendererThumb';

@observer
export class InsertSubRendererPanel extends React.Component<PanelProps> {
  @autobind
  handleLeftClick(e: React.MouseEvent) {
    const tag = e.currentTarget.getAttribute('data-value')!;
    const store = this.props.store;

    store.setInsertTag(tag);
  }

  @autobind
  handleClick(e: React.MouseEvent) {
    const id = e.currentTarget.getAttribute('data-value')!;
    const store = this.props.store;
    store.setInsertSelected(id);
  }

  @autobind
  hadnlDBClick(e: React.MouseEvent) {
    const id = e.currentTarget.getAttribute('data-value')!;
    const store = this.props.store;
    store.setInsertSelected(id);
    const manager = this.props.manager;
    store.insertMode === 'replace' ? manager.replace() : manager.insert();
  }

  @autobind
  handleInsert() {
    const manager = this.props.manager;

    manager.insert();
  }

  @autobind
  handleReplace() {
    const manager = this.props.manager;

    manager.replace();
  }

  @autobind
  handleCancel() {
    const store = this.props.store;
    store.closeInsertPanel();
  }

  render() {
    const store = this.props.store;
    const manager = this.props.manager;
    const info = store.getNodeById(store.insertId)?.info!;
    const regionLabel = find(
      info.regions,
      region => region.key === store.insertRegion
    )?.label;
    const grouped = store.groupedInsertRenderers;
    const keys = Object.keys(grouped);
    const insertTag = store.insertTag || '全部';
    const list = grouped[insertTag];

    return (
      <div className="ae-InsertPanel">
        {store.insertMode === 'replace' ? (
          <div className="ae-InsertPanel-title">更改组件类型</div>
        ) : (
          <div className="ae-InsertPanel-title">
            <span>选中组件插入到</span>&nbsp;
            <code>
              {info.name} &gt; {regionLabel}
            </code>
          </div>
        )}

        <div className="m-b-xs">
          <InputBox
            className="editor-InputSearch"
            value={store.insertRenderersKeywords}
            onChange={store.changeInsertRenderersKeywords}
            placeholder={'输入关键字可过滤组件'}
            clearable={false}
          >
            {store.insertRenderersKeywords ? (
              <a onClick={store.resetInsertRenderersKeywords}>
                <Icon icon="close" className="icon" />
              </a>
            ) : (
              <Icon icon="search" className="icon" />
            )}
          </InputBox>
        </div>

        <div className="ae-RenderersPicker-list">
          <ul>
            {keys.map(key => (
              <li key={key} className={insertTag === key ? 'is-active' : ''}>
                <a data-value={key} onClick={this.handleLeftClick}>
                  {key}
                </a>
              </li>
            ))}
          </ul>
          <div className="ae-RenderersPicker-content">
            {Array.isArray(list) && list.length ? (
              <ul>
                {list.map(item => (
                  <li
                    key={item.id}
                    className={
                      store.insertSelected === item.id ? 'is-active' : ''
                    }
                    data-value={item.id}
                    onClick={this.handleClick}
                    onDoubleClick={this.hadnlDBClick}
                  >
                    <RendererThumb
                      theme={manager.env.theme}
                      env={manager.env}
                      schema={
                        item.previewSchema || {
                          type: 'tpl',
                          tpl: '无法预览'
                        }
                      }
                    />

                    <div className="ae-RenderersPicker-info">
                      <h4>{item.name}</h4>
                      <div>
                        <Html html={item.description} />
                        {item.docLink ? (
                          <a
                            target="_blank"
                            href={store.amisDocHost + item.docLink}
                          >
                            <span>详情</span>
                          </a>
                        ) : null}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div>没有可用组件，也许你该切换容器试试。</div>
            )}
          </div>
        </div>
        <div className="ae-InsertPanel-footer">
          {store.insertMode === 'replace' ? (
            <Button
              className="action-btn action-btn-primary"
              onClick={this.handleReplace}
              disabled={!store.insertSelected}
              level="primary"
            >
              替换
            </Button>
          ) : (
            <Button
              className="action-btn action-btn-primary"
              onClick={this.handleInsert}
              disabled={!store.insertSelected}
              level="primary"
            >
              插入
            </Button>
          )}
          <Button className="action-btn" onClick={this.handleCancel}>
            取消
          </Button>
        </div>
      </div>
    );
  }
}
