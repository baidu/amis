import {Html, render, TooltipWrapper, hasIcon} from 'amis';
import {observer} from 'mobx-react';
import React from 'react';
import cx from 'classnames';
import {Icon} from '../../icons/index';
import SearchRendererPanel from '../base/SearchRendererPanel';
import SearchCustomRendererPanel from '../base/SearchCustomRendererPanel';
import {autobind, noop, isHasPluginIcon} from '../../util';
import {EditorStoreType} from '../../store/editor';
import {EditorManager} from '../../manager';
import {SubRendererInfo} from '../../plugin';

type PanelProps = {
  store: EditorStoreType;
  manager: EditorManager;
  groupedRenderers: {
    [propName: string]: Array<SubRendererInfo>;
  };
  searchRendererType: string;
  className?: string;
};

type PanelStates = {
  toggleCollapseFolderStatus: boolean;
};

@observer
export default class RenderersPanel extends React.Component<
  PanelProps,
  PanelStates
> {
  state = {
    toggleCollapseFolderStatus: false // 用于触发重新渲染组件面板的
  };

  // 用于记录组件分类面板的折叠状态
  curCollapseFolded: {
    [propName: string]: boolean;
  } = {};

  // 暂未使用
  @autobind
  handleRegionFilterClick(e: React.MouseEvent) {
    let region = e.currentTarget.getAttribute('data-value')!;

    const {store, manager} = this.props;
    region = region === store.subRendererRegion ? '' : region;
    manager.switchToRegion(region);
  }

  handleDragStart(e: React.DragEvent) {
    const current = e.currentTarget;
    const id = current.getAttribute('data-id')!;
    e.dataTransfer.setData(`dnd-dom/[data-id="${id}"]`, '');
  }

  // 组件点选使用
  @autobind
  handleClick(e: React.MouseEvent) {
    const id = e.currentTarget.getAttribute('data-dnd-id')!;
    this.props.manager.addElem(id);
  }

  // 改变折叠状态
  @autobind
  changeCollapseFoldStatus(tagKey: string, event: any) {
    this.curCollapseFolded[tagKey] = !this.curCollapseFolded[tagKey];
    this.setState({
      toggleCollapseFolderStatus: !this.state.toggleCollapseFolderStatus
    });
    event.preventDefault();
    event.stopPropagation();
  }

  renderThumb(schema: any) {
    const manager = this.props.manager;
    return schema ? (
      render(
        schema,
        {
          onAction: noop
        },
        manager.env
      )
    ) : (
      <p>没有预览图</p>
    );
  }

  render() {
    const {store, searchRendererType, className} = this.props;
    const grouped = this.props.groupedRenderers || {};
    const keys = Object.keys(grouped);

    return (
      <div className={cx('ae-RendererList', className)}>
        {searchRendererType === 'renderer' && (
          <SearchRendererPanel store={store} />
        )}
        {searchRendererType === 'custom-renderer' && (
          <SearchCustomRendererPanel store={store} />
        )}
        <hr className="margin-top" />

        {/* {node.childRegions.length ? (
          <div className="ae-RegionFilter">
            区域：
            {node.childRegions.map(region => (
              <div
                className={
                  store.subRendererRegion === region.region ? 'is-active' : ''
                }
                data-value={region.region}
                onClick={this.handleRegionFilterClick}
                key={region.region}
              >
                {region.label}
              </div>
            ))}
          </div>
        ) : null} */}

        {/*<div className="ae-RendererList-tip">
          请选择以下组件拖入「{node?.label}」中
        </div>*/}

        <div className="ae-RendererList-groupWrap hoverShowScrollBar">
          {keys.length ? (
            keys.map((tag, index) => {
              const items = grouped[tag];

              if (!items || !items.length) {
                return null;
              }

              return (
                <React.Fragment key={tag}>
                  <div
                    key={`${tag}-head`}
                    className={'ae-RendererList-head collapse-header'}
                    onClick={(event: any) => {
                      this.changeCollapseFoldStatus(tag, event);
                    }}
                  >
                    {tag}
                    <div
                      className={cx('expander-icon', {
                        'is-folded': !!this.curCollapseFolded[tag]
                      })}
                      title={
                        !!this.curCollapseFolded[tag] ? '点击展开' : '点击折叠'
                      }
                    >
                      <Icon icon="right-arrow-bold" />
                    </div>
                  </div>
                  <div
                    key={`${tag}-content`}
                    className={cx('ae-RendererList-group collapse-content', {
                      'is-folded': !!this.curCollapseFolded[tag]
                    })}
                  >
                    {items.map((item: any) => {
                      const key = `${index}_${item.id}`;
                      const usePluginIcon = isHasPluginIcon(item);

                      return (
                        <div
                          key={key}
                          className="ae-RendererList-item"
                          draggable
                          data-id={key}
                          data-dnd-type="subrenderer"
                          data-dnd-id={item.id}
                          data-dnd-data={JSON.stringify(
                            item.scaffold || {type: item.type}
                          )}
                          onDragStart={this.handleDragStart}
                        >
                          <div
                            className="icon-box"
                            data-dnd-id={item.id}
                            title={`点击添加「${item.name}」`}
                            onClick={this.handleClick}
                          >
                            {usePluginIcon && <Icon icon={item.pluginIcon} />}
                            {!usePluginIcon && (
                              <i
                                className={cx(
                                  'fa-fw',
                                  item.icon || 'fa fa-circle-thin'
                                )}
                              />
                            )}
                          </div>
                          <div
                            className="ae-RendererInfo"
                            data-dnd-id={item.id}
                            onClick={this.handleClick}
                          >
                            {item.name}
                          </div>
                          <TooltipWrapper
                            tooltipClassName="ae-RendererThumb"
                            trigger="hover"
                            rootClose={true}
                            placement="right"
                            tooltip={{
                              offset: [10, 0], // x轴偏移，避免遮挡边框
                              children: () => (
                                <div>
                                  <div className="ae-Renderer-title">
                                    {item.name}
                                  </div>
                                  {item.description || item.docLink ? (
                                    <div className="ae-Renderer-info">
                                      <Html
                                        html={
                                          item.description
                                            ? item.description
                                            : ''
                                        }
                                      />
                                      {item.docLink && (
                                        <a
                                          target="_blank"
                                          href={
                                            store.amisDocHost + item.docLink
                                          }
                                        >
                                          详情
                                        </a>
                                      )}
                                    </div>
                                  ) : null}
                                  <div className="ae-Renderer-preview">
                                    {this.renderThumb(item.previewSchema)}
                                  </div>
                                </div>
                              )
                            }}
                          >
                            <div className="ae-RendererIcon">
                              <Icon icon="editor-help" className="icon" />
                            </div>
                          </TooltipWrapper>
                        </div>
                      );
                    })}
                  </div>
                </React.Fragment>
              );
            })
          ) : (
            <span>没有找到可用组件，您可以换个关键字继续查找。</span>
          )}
        </div>
      </div>
    );
  }
}
