import React from 'react';
import cx from 'classnames';
import {Icon} from 'amis';
import {EditorStoreType} from '../store/editor';
import {observer} from 'mobx-react';
import {EditorManager} from '../manager';
import {EditorNodeType} from '../store/node';
import {autobind} from '../util';

export const AddBTNSvg = `<svg viewBox="0 0 12 12">
<g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
  <g id="plus" fill="currentColor" fill-rule="nonzero">
    <polygon points="6.6 6.6 6.6 12 5.4 12 5.4 6.6 0 6.6 0 5.4 5.4 5.4 5.4 0 6.6 0 6.6 5.4 12 5.4 12 6.6"></polygon>
  </g>
</g>
</svg>`;

export interface HighlightBoxProps {
  store: EditorStoreType;
  node: EditorNodeType;
  name: string;
  id: string;
  className?: string;
  title: string;
  preferTag?: string;
  manager: EditorManager;
  isOnlyChildRegion: boolean;
}

@observer
export default class RegionHighlightBox extends React.Component<HighlightBoxProps> {
  // 点击清空当前区域中的所有元素
  @autobind
  handleClick() {
    const {manager, id, name} = this.props;
    manager.emptyRegion(id, name);
  }

  render() {
    const {store, id, name, title, node, isOnlyChildRegion} = this.props;

    let isHiglight = store.isRegionHighlighted(id, name);
    let isHiglightHover = store.isRegionHighlightHover(id, name);
    let isDragEnter = store.isRegionDragEnter(id, name);
    const host = store.getNodeById(id)!;
    const dx = node.x - host.x;
    const dy = node.y - host.y;

    return (
      <div
        data-renderer={node.host.info.renderer.name}
        data-region={name}
        className={cx(
          'ae-Editor-rhlbox',
          isDragEnter ? 'is-dragenter' : '',
          !isOnlyChildRegion && isHiglightHover ? 'region-hover' : '',
          isHiglight ? 'is-highlight' : '',
          dx < 87 && dy < 21 && node.x < 190 ? 'region-label-within' : ''
        )}
        style={{
          width: node.w,
          height: node.h,
          borderWidth: `${Math.max(0, dy)}px ${Math.max(
            0,
            host.w - dx - node.w
          )}px ${Math.max(0, host.h - dy - node.h)}px ${Math.max(0, dx)}px`
        }}
      >
        <div
          data-node-id={id}
          data-node-region={name}
          className={`region-tip ${
            isOnlyChildRegion ? 'is-only-child-region' : ''
          } ignore-hover-elem`}
        >
          {title}
          <span className="margin-space">|</span>

          <button
            type="button"
            className="clear-icon-btn"
            data-tooltip={'点击清空当前区域'}
            data-position={'bottom'}
            onClick={this.handleClick}
          >
            <Icon icon="clear-btn" />
          </button>
        </div>
      </div>
    );
  }
}
