import {observer} from 'mobx-react';
import React from 'react';
import {PanelProps} from '../../plugin';
import cx from 'classnames';
import {autobind} from '../../util';
import {Icon, InputBox} from 'amis';
import {EditorNodeType} from '../../store/node';

@observer
export class OutlinePanel extends React.Component<PanelProps> {
  state = {
    curSearchElemKey: '' // 用于记录用户当前输入的关键字
  };

  @autobind
  handleClick(e: React.MouseEvent<HTMLAnchorElement>) {
    const store = this.props.store;
    const dom = e.currentTarget;
    const id = dom.getAttribute('data-node-id')!;
    const region = dom.getAttribute('data-node-region')!;
    const manager = this.props.manager;

    if (region) {
      // 点击容器类型自动弹出「组件插入面板」有点干扰用户操作
      // manager.showInsertPanel(region, id);
      /** 特殊区域允许点击事件 */
      if (store.activeId === id && store.activeRegion === region) {
        // 重复点击则取消区域选中
        store.setActiveId(id);
      } else {
        store.setActiveId(id, region);
      }
    } else {
      store.setActiveId(id);
    }
  }

  @autobind
  handleEnter(e: React.MouseEvent) {
    const dom = e.currentTarget;
    const id = dom.getAttribute('data-node-id')!;
    const region = dom.getAttribute('data-node-region')!;
    const store = this.props.store;

    store.setHoverId(id, region);
  }

  @autobind
  handleDragStart(e: React.DragEvent) {
    const id = e.currentTarget!.getAttribute('data-node-id')!;

    if (!id) {
      return;
    }

    this.props.manager.startDrag(id, e);
  }

  @autobind
  handleDragOver(e: React.DragEvent) {
    const target = e.target as HTMLElement;
    const dom = target.closest(`[data-node-id][data-node-region]`);

    if (!dom) {
      return;
    }

    const manager = this.props.manager;
    const id = dom.getAttribute('data-node-id')!;
    const region = dom.getAttribute('data-node-region')!; // 大纲树中的容器节点

    e.preventDefault();
    id && region && manager.dnd.switchToRegion(e.nativeEvent, id, region);
  }

  @autobind
  handleDrop(e: React.DragEvent) {
    const manager = this.props.manager;
    manager.dnd.drop(e.nativeEvent);
  }

  @autobind
  handleSearchElemKeyChange(searchVal: string) {
    this.setState({
      curSearchElemKey: searchVal
    });
  }

  @autobind
  clearSearchElemKey() {
    this.setState({
      curSearchElemKey: ''
    });
  }

  @autobind
  renderTitleByKeyword(rendererTitle: string, curSearchTitle: string) {
    if (curSearchTitle && ~rendererTitle.indexOf(curSearchTitle)) {
      const keywordStartIndex = rendererTitle.indexOf(curSearchTitle);
      const keywordEndIndex = keywordStartIndex + curSearchTitle.length;
      return (
        <span>
          {rendererTitle.substring(0, keywordStartIndex)}
          <span className="has-keywords">{curSearchTitle}</span>
          {rendererTitle.substring(keywordEndIndex)}
        </span>
      );
    } else {
      return rendererTitle;
    }
  }

  renderItem(option: EditorNodeType, index: number) {
    const store = this.props.store;
    const {curSearchElemKey} = this.state;
    const children = (!store.dragging && option.singleRegion
      ? option.uniqueChildren[0]!.uniqueChildren
      : option.uniqueChildren) as Array<EditorNodeType>;
    const hasChildren = children.length;

    if (store.dragging && !option.isRegion && !option.children.length) {
      return null;
    }

    return (
      <li
        className={cx('ae-Outline-node', {
          'is-folded': option.folded,
          'is-active':
            (store.activeId === option.id && !option.region) ||
            (option.isRegion &&
              store.dropId === option.id &&
              store.dropRegion === option.region) ||
            (option.isRegion &&
              store.activeId === option.id &&
              store.activeRegion === option.region),
          'is-region': option.isRegion,
          'is-hover':
            !option.isRegion &&
            (store.isHoved(option.id) || store.isContextOn(option.id)),
          'has-children': hasChildren,
          'is-dragging':
            store.dragId === option.id && store.dragType === 'schema'
        })}
        key={index}
      >
        <a
          onClick={this.handleClick}
          onMouseEnter={this.handleEnter}
          data-node-id={option.id}
          data-node-region={option.region}
          data-node-common-config={option.schema?.$$commonSchema}
          draggable={option.draggable}
          onDragStart={this.handleDragStart}
        >
          {hasChildren ? (
            <span
              onClick={option.toggleFold}
              className={cx('ae-Outline-expander ae-Outline-node-icon', {
                'is-folded': option.folded
              })}
              data-node-id={option.id}
              data-node-region={option.region}
            >
              <Icon icon="down-arrow" />
            </span>
          ) : null}
          <span className="ae-Outline-node-text">
            {option.isCommonConfig
              ? `${option.label}-[公共配置]`
              : this.renderTitleByKeyword(option.label, curSearchElemKey)}
          </span>
        </a>
        {hasChildren ? (
          <ul className="ae-Outline-sublist">
            {children.map((option, index) => this.renderItem(option, index))}
          </ul>
        ) : null}
      </li>
    );
  }

  render() {
    const {curSearchElemKey} = this.state;
    const {store} = this.props;
    const options = store.outline;

    return (
      <div className="ae-Outline-panel">
        <div className="panel-header">大纲</div>
        <InputBox
          className="editor-InputSearch"
          value={curSearchElemKey}
          onChange={this.handleSearchElemKeyChange}
          placeholder={'查询页面元素'}
          clearable={false}
        >
          {curSearchElemKey ? (
            <a onClick={this.clearSearchElemKey}>
              <Icon icon="close" className="icon" />
            </a>
          ) : (
            <Icon icon="editor-search" className="icon" />
          )}
        </InputBox>
        <hr className="margin-top" />
        <div
          className={cx('ae-Outline', 'hoverShowScrollBar', {
            'ae-Outline--draging': store.dragging
          })}
          onDragOver={this.handleDragOver}
          onDrop={this.handleDrop}
        >
          {store.dragging ? (
            <div className="ae-Outline-tip">
              将目标拖入导航中的节点可以切换容器
            </div>
          ) : null}

          {options.length ? (
            <ul className="ae-Outline-list">
              {options.map((option, index) => this.renderItem(option, index))}
            </ul>
          ) : (
            <div>加载中，请稍等...</div>
          )}
        </div>
      </div>
    );
  }
}
