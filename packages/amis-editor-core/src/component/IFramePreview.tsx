import {observer} from 'mobx-react';
import {EditorStoreType} from '../store/editor';
import React, {memo} from 'react';
import {EditorManager} from '../manager';
import Frame, {useFrame} from 'react-frame-component';
import {SchemaRenderer} from './SchemaRenderer';
import {
  autobind,
  closeContextMenus,
  findTree,
  render,
  resizeSensor
} from 'amis';
import {isAlive} from 'mobx-state-tree';

/**
 * 这个用了 observer，所以能最小程度的刷新，数据不变按理是不会刷新的。
 */
export interface IFramePreviewProps {
  editable?: boolean;
  autoFocus?: boolean;
  store: EditorStoreType;
  env: any;
  data?: any;
  manager: EditorManager;
  /** 应用语言类型 */
  appLocale?: string;
}
@observer
export default class IFramePreview extends React.Component<IFramePreviewProps> {
  initialContent: string = '';
  dialogMountRef: React.RefObject<HTMLDivElement> = React.createRef();
  iframeRef: HTMLIFrameElement;
  constructor(props: IFramePreviewProps) {
    super(props);

    const styles = [].slice
      .call(document.querySelectorAll('link[rel="stylesheet"], style'))
      .map((el: any) => {
        return el.outerHTML;
      });
    styles.push(`<style>
      html, body, .ae-IFramePreview, .ae-IFramePreview > .frame-content, .ae-PageWrapper {
        position: relative;
        width: 100%;
        height: 100%;
      }
      html::-webkit-scrollbar,
      body::-webkit-scrollbar {
        display: none;
      }
    </style>`);

    this.initialContent = `<!DOCTYPE html><html><head>${styles.join(
      ''
    )}</head><body><div class="ae-IFramePreview AMISCSSWrapper"></div></body></html>`;
  }

  componentDidMount() {
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

  @autobind
  iframeRefFunc(iframe: any) {
    const store = this.props.store;
    this.iframeRef = iframe;
    isAlive(store) && store.setIframe(iframe);
  }

  @autobind
  getModalContainer() {
    const store = this.props.store;
    return store.getDoc().body;
  }

  @autobind
  isMobile() {
    return true;
  }

  @autobind
  getDialogMountRef() {
    return this.dialogMountRef.current;
  }

  @autobind
  iframeContentDidMount() {
    const body = this.iframeRef.contentWindow?.document.body;
    body?.classList.add('ae-PreviewIFrameBody');
  }

  render() {
    const {editable, store, appLocale, autoFocus, env, data, manager, ...rest} =
      this.props;

    return (
      <Frame
        className={'ae-PreviewIFrame'}
        initialContent={this.initialContent}
        ref={this.iframeRefFunc}
        contentDidMount={this.iframeContentDidMount}
      >
        <InnerComponent store={store} editable={editable} manager={manager} />
        <div ref={this.dialogMountRef} className="ae-PageWrapper">
          {render(
            editable ? store.filteredSchema : store.filteredSchemaForPreview,
            {
              globalVars: store.globalVariables,
              ...rest,
              key: editable ? 'edit-mode' : 'preview-mode',
              theme: env.theme,
              data: data,
              context: store.ctx,
              locale: appLocale,
              editorDialogMountNode: this.getDialogMountRef
            },
            {
              ...env,
              session: `${env.session}-${
                editable ? 'edit' : 'preview'
              }-iframe-preview`,
              SchemaRenderer: editable ? SchemaRenderer : undefined,
              useMobileUI: true,
              isMobile: this.isMobile,
              getModalContainer: this.getModalContainer
            }
          )}
          <InnerSvgSpirit />
        </div>
      </Frame>
    );
  }
}

function InnerComponent({
  store,
  editable,
  manager
}: {
  store: EditorStoreType;
  editable?: boolean;
  manager: EditorManager;
}) {
  // Hook returns iframe's window and document instances from Frame context
  const {document: doc, window: win} = useFrame();
  const editableRef = React.useRef(editable);

  const handleMouseLeave = React.useCallback(() => {
    store.setHoverId('');
  }, []);

  const handleMouseMove = React.useCallback((e: MouseEvent) => {
    const dom = e.target as HTMLElement;
    const target = dom.closest(`[data-editor-id]`);

    if (target) {
      store.setHoverId(target.getAttribute('data-editor-id')!);
    }
  }, []);

  const handleBodyClick = React.useCallback(() => {
    closeContextMenus();
  }, []);

  const handleClick = React.useCallback((e: MouseEvent) => {
    const target = (e.target as HTMLElement).closest(`[data-editor-id]`);
    closeContextMenus();

    if (e.defaultPrevented) {
      return;
    }

    if (store.activeElement) {
      // 禁用内部的点击事件
      e.preventDefault();
      return;
    }

    if (target) {
      store.setActiveId(target.getAttribute('data-editor-id')!);
    }

    if (editableRef.current) {
      // 让渲染器不可点，只能点击选中。
      const event = manager.trigger('prevent-click', {
        data: e
      });

      if (!event.prevented && !event.stoped) {
        e.preventDefault();
        e.stopPropagation();
      }
    }
  }, []);

  const handleDBClick = React.useCallback((e: MouseEvent) => {
    const target = e.target as HTMLElement;
    const hostElem = target.closest(`[data-editor-id]`) as HTMLElement;
    if (hostElem) {
      const node = store.getNodeById(hostElem.getAttribute('data-editor-id')!);
      if (!node) {
        return;
      }

      const rendererInfo = node.info;

      // 需要支持 :scope > xxx 语法，所以才这么写
      let inlineElem: HTMLElement | undefined | null = null;
      const inlineSetting = (rendererInfo.inlineEditableElements || []).find(
        elem => {
          inlineElem = (
            [].slice.call(
              hostElem.querySelectorAll(elem.match)
            ) as Array<HTMLElement>
          ).find(dom => dom.contains(target));
          return !!inlineElem;
        }
      )!;

      // 如果命中了支持内联编辑的元素，则开始内联编辑
      if (inlineElem && inlineSetting) {
        manager.startInlineEdit(node, inlineElem, inlineSetting, e);
      }
    }
  }, []);

  const handeMouseOver = React.useCallback((e: MouseEvent) => {
    if (editableRef.current) {
      e.preventDefault();
      e.stopPropagation();
    }
  }, []);

  // 禁用内部的提交事件
  const handleSubmit = React.useCallback((e: Event) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDragEnter = React.useCallback((e: DragEvent) => {
    if (!editable) {
      return;
    }
    e.stopPropagation();
    manager.dnd.dragEnter(e);
  }, []);

  const handleDragLeave = React.useCallback((e: DragEvent) => {
    if (!editable) {
      return;
    }
    e.stopPropagation();
    manager.dnd.dragLeave(e);
  }, []);

  const handleDragOver = React.useCallback((e: DragEvent) => {
    if (!editable) {
      return;
    }
    e.stopPropagation();
    manager.dnd.dragOver(e);
  }, []);

  const handleDrop = React.useCallback((e: DragEvent) => {
    if (!editable) {
      return;
    }
    e.stopPropagation();
    manager.dnd.drop(e);
  }, []);

  React.useEffect(() => {
    store.setDoc(doc);
    const layer = doc?.querySelector('.frame-content') as HTMLElement;

    doc!.addEventListener('click', handleBodyClick);
    layer!.addEventListener('mouseleave', handleMouseLeave);
    layer!.addEventListener('mousemove', handleMouseMove);
    layer!.addEventListener('click', handleClick, true);
    layer!.addEventListener('dblclick', handleDBClick);
    layer!.addEventListener('mouseover', handeMouseOver);
    layer!.addEventListener('submit', handleSubmit);
    layer!.addEventListener('dragenter', handleDragEnter);
    layer!.addEventListener('dragleave', handleDragLeave);
    layer!.addEventListener('dragover', handleDragOver);
    layer!.addEventListener('drop', handleDrop);

    const widgetsLayer = store.getLayer();
    const handleScroll = () => {
      widgetsLayer?.classList.add('is-scrolling');
      store.calculateHighlightBox(store.highlightNodes.map(item => item.id));
    };
    const handleScrollEnd = () => {
      widgetsLayer?.classList.remove('is-scrolling');
    };

    win?.addEventListener('scroll', handleScroll, true);
    win?.addEventListener('scrollend', handleScrollEnd, true);

    return () => {
      win?.removeEventListener('scroll', handleScroll, true);
      win?.removeEventListener('scrollend', handleScrollEnd, true);
      doc!.removeEventListener('click', handleBodyClick);
      layer!.removeEventListener('mouseleave', handleMouseLeave);
      layer!.removeEventListener('mousemove', handleMouseMove);
      layer!.removeEventListener('click', handleClick);
      layer!.removeEventListener('mouseover', handeMouseOver);
      layer!.removeEventListener('dblclick', handleDBClick);
      layer!.removeEventListener('submit', handleSubmit);
      layer!.removeEventListener('dragenter', handleDragEnter);
      layer!.removeEventListener('dragleave', handleDragLeave);
      layer!.removeEventListener('dragover', handleDragOver);
      layer!.removeEventListener('drop', handleDrop);
      store.setDoc(document);
    };
  }, [doc]);

  React.useEffect(() => {
    doc
      ?.querySelector('body>div:first-child')
      ?.classList.toggle('is-edting', editable);
    editableRef.current = editable;
  }, [editable]);

  return null;
}

const InnerSvgSpirit = memo(() => {
  // @ts-ignore 这里取的是平台的变量
  let spiriteIcons = window.spiriteIcons;
  if (spiriteIcons) {
    return (
      <div
        id="amis-icon-manage-mount-node"
        style={{display: 'none'}}
        dangerouslySetInnerHTML={{__html: spiriteIcons}}
      ></div>
    );
  } else {
    return null;
  }
});
