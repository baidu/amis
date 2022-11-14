import React from 'react';
import {EditorManager} from '../manager';
import {EditorStoreType} from '../store/editor';
import {render, toast, resolveRenderer, resizeSensor} from 'amis';
import {autobind} from '../util';
import {RenderOptions} from 'amis-core';
import {Schema} from 'amis/lib/types';
import {ErrorRenderer} from './base/ErrorRenderer';
import cx from 'classnames';
import {findDOMNode} from 'react-dom';
import {isAlive} from 'mobx-state-tree';
import {findTree} from 'amis-core';
import {RendererConfig} from 'amis-core/lib/factory';

export interface IFramePreviewProps {
  className: string;
  editable?: boolean;
  isMobile?: boolean;
  schema: any;
  theme?: string;
  store: EditorStoreType;
  manager: EditorManager;
  autoFocus?: boolean;
  data?: any;
  envCreator?: (props: IFramePreviewProps) => any;
}

// @observer
// 这个在 iframe 里面没办法做到。但是外面做了处理，所以不用加
export default class IFramePreview extends React.Component<IFramePreviewProps> {
  env: RenderOptions = {
    ...this.props.manager.env,
    notify: (type, msg) => {
      if (this.props.editable) {
        console.warn('[Notify]', type, msg);
        return;
      }

      toast[type]
        ? toast[type](msg, type === 'error' ? '系统错误' : '系统消息')
        : console.warn('[Notify]', type, msg);
    },
    theme: this.props.theme,
    session: `preview-${this.props.manager.id}`,
    rendererResolver: this.rendererResolver,
    ...this.props.manager.env,
    ...this.props.envCreator?.(this.props)
  };

  componentDidMount() {
    const dom = findDOMNode(this) as HTMLElement;

    dom.addEventListener('mouseleave', this.handleMouseLeave);
    dom.addEventListener('mousemove', this.handleMouseMove);
    dom.addEventListener('click', this.handleClick);
    dom.addEventListener('mouseover', this.handeMouseOver);

    if (this.props.autoFocus) {
      // 一般弹框动画差不多 350ms
      // 延时 350ms，在弹框中展示编辑器效果要好点。
      const store = this.props.manager.store;
      setTimeout(() => {
        if (isAlive(store)) {
          const first = findTree(
            store.outline,
            item => !item.isRegion && item.clickable
          );

          first && store.setActiveId(first.id);
        }
      }, 350);
    } else {
      this.props.manager.buildRenderersAndPanels();
    }
  }

  componentWillUnmount() {
    const dom = findDOMNode(this) as HTMLElement;

    dom.removeEventListener('mouseleave', this.handleMouseLeave);
    dom.removeEventListener('mousemove', this.handleMouseMove);
    dom.removeEventListener('click', this.handleClick);
    dom.removeEventListener('mouseover', this.handeMouseOver);
  }

  dom?: HTMLElement;
  unSensor?: () => void;
  @autobind
  contentsRef(ref: HTMLDivElement | null) {
    this.dom = ref!;

    if (ref) {
      // this.layer = ref!.querySelector('.ae-Preview-widgets') as HTMLDivElement;
      this.syncIframeHeight();
      this.unSensor = resizeSensor(ref, () => {
        this.syncIframeHeight();
      });
    } else {
      // delete this.layer;
      this.unSensor?.();
      delete this.unSensor;
    }
  }

  // todo 优化这个
  syncIframeHeight() {
    const manager = this.props.manager;
    if (this.dom) {
      const iframe = manager.store.getIframe()!;
      iframe.style.cssText += `height: ${this.dom.offsetHeight}px`;
    }
  }

  @autobind
  handleClick(e: MouseEvent) {
    const store = this.props.store;
    const target = (e.target as HTMLElement).closest(`[data-editor-id]`);

    if (e.defaultPrevented) {
      return;
    }

    if (target) {
      store.setActiveId(target.getAttribute('data-editor-id')!);
    }

    if (this.props.editable) {
      // 让渲染器不可点，只能点击选中。
      const event = this.props.manager.trigger('prevent-click', {
        data: e
      });

      if (!event.prevented && !event.stoped) {
        e.preventDefault();
        e.stopPropagation();
      }
    }
  }

  @autobind
  handleMouseMove(e: MouseEvent) {
    const store = this.props.store;
    const dom = e.target as HTMLElement;

    const target = dom.closest(`[data-editor-id]`);

    if (target) {
      store.setHoverId(target.getAttribute('data-editor-id')!);
    }
  }

  @autobind
  handleMouseLeave() {
    const store = this.props.store;
    store.setHoverId('');
  }

  @autobind
  handeMouseOver(e: MouseEvent) {
    if (this.props.editable) {
      e.preventDefault();
      e.stopPropagation();
    }
  }

  @autobind
  handleDragEnter(e: React.DragEvent) {
    const manager = this.props.manager;
    manager.dnd.dragEnter(e.nativeEvent);
  }

  @autobind
  handleDragLeave(e: React.DragEvent) {
    const manager = this.props.manager;
    manager.dnd.dragLeave(e.nativeEvent);
  }

  @autobind
  handleDragOver(e: React.DragEvent) {
    const manager = this.props.manager;
    manager.dnd.dragOver(e.nativeEvent);
  }

  @autobind
  handleDrop(e: React.DragEvent) {
    const manager = this.props.manager;
    manager.dnd.drop(e.nativeEvent);
  }

  @autobind
  handleContextMenu(e: React.MouseEvent<HTMLElement>) {
    let targetId: string = (e.target as HTMLElement)
      .closest('[data-editor-id]')
      ?.getAttribute('data-editor-id')!;
    let region = '';

    if (!targetId) {
      const node = (e.target as HTMLElement).closest(
        '[data-node-id]'
      ) as HTMLElement;
      targetId = node?.getAttribute('data-node-id')!;

      if (!targetId) {
        return;
      }

      region = node.getAttribute('data-node-region')!;
    }

    e.preventDefault();
    e.stopPropagation();

    const manager = this.props.manager;
    const rect = manager.store.getIframe()!.getBoundingClientRect();
    manager.parent!.openContextMenu(targetId, region, {
      x: window.scrollX + e.clientX + rect.left,
      y: window.scrollY + e.clientY + rect.top
    });
  }

  @autobind
  rendererResolver(path: string, schema: Schema, props: any) {
    const {editable, manager} = this.props;

    let renderer: RendererConfig = resolveRenderer(path, schema)!;
    if (editable === false) {
      return renderer;
    }

    renderer = renderer || {
      name: 'error',
      test: () => true,
      component: ErrorRenderer
    };

    let info = manager.getEditorInfo(renderer!, path, schema);

    // 更新 Editor 中的 amisStore
    if (props && props.store && props.store.data) {
      manager.updateAMISContext(props.store.data);
    }

    info &&
      (renderer = {
        ...renderer,
        component: manager.makeWrapper(info, renderer)
      });

    return renderer;
  }

  render() {
    const {store, editable, manager, className, schema, data, ...rest} =
      this.props;

    return (
      <div
        ref={this.contentsRef}
        onContextMenu={this.handleContextMenu}
        onDragEnter={this.handleDragEnter}
        onDragLeave={this.handleDragLeave}
        onDragOver={this.handleDragOver}
        onDrop={this.handleDrop}
        className={cx(
          'ae-IFramePreview',
          className,
          editable ? 'is-edting' : ''
        )}
      >
        {render(
          schema || {
            type: 'tpl',
            tpl: '渲染中...'
          },
          {
            ...rest,
            key: editable ? 'edit-mode' : 'preview-mode',
            theme: this.env.theme,
            data: data ?? store.ctx
          },
          this.env
        )}
      </div>
    );
  }
}
