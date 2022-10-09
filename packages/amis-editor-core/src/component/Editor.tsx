import React, {Component} from 'react';
import cx from 'classnames';
import Preview from './Preview';
import {autobind} from '../util';
import {EditorStore, EditorStoreType} from '../store/editor';
import {SchemaObject} from 'amis/lib/Schema';
import {EditorManager, EditorManagerConfig, PluginClass} from '../manager';
import {reaction} from 'mobx';
import {RenderOptions, toast} from 'amis';
import {PluginEventListener, RendererPluginAction} from '../plugin';
import {SubEditor} from './SubEditor';
import Breadcrumb from './Breadcrumb';
import {destroy} from 'mobx-state-tree';
import {ScaffoldModal} from './ScaffoldModal';
import {PopOverForm} from './PopOverForm';
import {ContextMenuPanel} from './Panel/ContextMenuPanel';
import {LeftPanels} from './Panel/LeftPanels';
import {RightPanels} from './Panel/RightPanels';
import type {VariableGroup, VariableOptions} from '../variable';

export interface EditorProps extends PluginEventListener {
  value: SchemaObject;
  onChange: (value: SchemaObject) => void;
  preview?: boolean;
  isMobile?: boolean;
  isSubEditor?: boolean;
  autoFocus?: boolean;
  className?: string;
  $schemaUrl?: string;
  schemas?: Array<any>;
  theme?: string;
  showCustomRenderersPanel?: boolean;
  amisDocHost?: string;
  superEditorData?: any;
  withSuperDataSchema?: boolean;
  dataBindingChange?: (
    value: string,
    data: any,
    manager?: EditorManager
  ) => void;

  /**
   * Preview 预览前可以修改配置。
   * 比如把api地址替换成 proxy 地址。
   */
  schemaFilter?: (schema: any) => any;
  amisEnv?: RenderOptions;

  /**
   * 上下文数据，设置后，面板和脚手架表单里面可以取到这些值。
   */
  ctx?: any;
  data?: any;

  /**
   * 是否禁用内置插件
   */
  disableBultinPlugin?: boolean;

  plugins?: Array<PluginClass>;

  /**
   * 传给预览器的其他属性
   */
  previewProps?: any;

  // 如果配置了，编辑器变成 iframe 模式。
  // 需要自己写代码去建立连接。
  iframeUrl?: string;

  isHiddenProps?: (key: string) => boolean;

  /**
   * 事件动作面板相关配置
   */
  actionOptions?: {
    // 是否开启老动作配置入口
    showOldEntry?: boolean;
    /**
     * 通用动作集（事件动作面板左侧动作树）
     */
    actionTreeGetter?: (
      actionTree: RendererPluginAction[]
    ) => RendererPluginAction[];
    /**
     * 自定义动作配置
     */
    customActionGetter?: (manager: EditorManager) => {
      [propName: string]: RendererPluginAction;
    };
  };

  /** 上下文变量 */
  variables?: VariableGroup[];
  /** 变量配置 */
  variableOptions?: VariableOptions;

  onUndo?: () => void; // 用于触发外部 undo 事件
  onRedo?: () => void; // 用于触发外部 redo 事件
  onSave?: () => void; // 用于触发外部 save 事件
  onPreview?: (preview: boolean) => void; // 用于触发外部 预览 事件
}

export default class Editor extends Component<EditorProps> {
  readonly store: EditorStoreType;
  readonly manager: EditorManager;
  readonly mainRef = React.createRef<HTMLDivElement>();
  unReaction: () => void;
  lastResult: any;
  curCopySchemaData: any; // 用于记录当前复制的元素

  static defaultProps = {
    autoFocus: true
  };
  isInternalChange: boolean = false;

  constructor(props: EditorProps) {
    super(props);

    const {
      value,
      isSubEditor = false,
      onChange,
      showCustomRenderersPanel,
      superEditorData,
      ...rest
    } = props;

    const config: EditorManagerConfig = {
      ...rest
    };
    this.store = EditorStore.create(
      {
        isMobile: props.isMobile,
        theme: props.theme,
        isSubEditor,
        amisDocHost: props.amisDocHost,
        ctx: props.ctx,
        superEditorData
      },
      config
    );
    this.store.setSchema(value);
    if (showCustomRenderersPanel !== undefined) {
      this.store.setShowCustomRenderersPanel(showCustomRenderersPanel);
    }
    this.manager = new EditorManager(config, this.store);

    (window as any).editorStore = this.store;

    // 添加快捷键事件
    document.addEventListener('keydown', this.handleKeyDown);

    // 增加插件动态添加事件响应机制
    window.addEventListener(
      'message',
      (event: any) => {
        if (!event.data) {
          return;
        }
        if (
          event.data.type === 'amis-widget-register-event' &&
          event.data.editorPluginName
        ) {
          console.info(
            '[amis-editor]响应动态添加插件事件：',
            event.data.editorPluginName
          );
          this.manager.dynamicAddPlugin(event.data.editorPluginName);
        }
      },
      false
    );

    this.unReaction = reaction(
      () => this.store.schemaRaw,
      (raw: any) => {
        this.lastResult = raw;

        if (this.isInternalChange) {
          return;
        }
        props.onChange(raw);
      }
    );
  }

  componentDidMount() {
    if (!this.props.isSubEditor) {
      this.manager.trigger('init', {
        data: this.manager
      });
    }
  }

  componentDidUpdate(prevProps: EditorProps) {
    const props = this.props;

    if (props.value !== prevProps.value && props.value !== this.lastResult) {
      this.isInternalChange = true;
      this.store.setSchema(props.value);
      this.isInternalChange = false;
    }

    if (props.isMobile !== prevProps.isMobile) {
      this.store.setIsMobile(props.isMobile);
    }

    if (props.ctx !== prevProps.ctx) {
      this.store.setCtx(props.ctx);
    }
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleKeyDown);
    this.unReaction();
    this.manager.dispose();
    destroy(this.store);
  }

  // 快捷功能键
  @autobind
  handleKeyDown(e: KeyboardEvent) {
    // 弹窗模式不处理
    if (this.props.isSubEditor) {
      // e.defaultPrevented // 或者已经阻止不处理
      return;
    }

    const manager = this.manager;
    const store = manager.store;

    if (
      (e.target as HTMLElement).tagName === 'BODY' &&
      (e.key === 'z' || e.key === 'Z') &&
      (e.metaKey || e.ctrlKey) &&
      e.shiftKey
    ) {
      e.preventDefault();
      this.redo(); // 重做
      return;
    } else if (
      (e.target as HTMLElement).tagName === 'BODY' &&
      (e.key === 'z' || e.key === 'Z') &&
      (e.metaKey || e.ctrlKey)
    ) {
      e.preventDefault();
      this.undo(); // 撤销
      return;
    } else if (
      (e.target as HTMLElement).tagName === 'BODY' &&
      (e.key === 's' || e.key === 'S') &&
      (e.metaKey || e.ctrlKey)
    ) {
      e.preventDefault();
      this.save(); // 保存
      return;
    } else if (
      (e.target as HTMLElement).tagName === 'BODY' &&
      (e.key === 'c' || e.key === 'C') &&
      (e.metaKey || e.ctrlKey)
    ) {
      e.preventDefault();
      this.copy(); // 复制
      return;
    } else if (
      (e.target as HTMLElement).tagName === 'BODY' &&
      (e.key === 'v' || e.key === 'V') &&
      (e.metaKey || e.ctrlKey)
    ) {
      e.preventDefault();
      if (this.curCopySchemaData) {
        this.paste(); // 粘贴
      }
      return;
    } else if (
      (e.target as HTMLElement).tagName === 'BODY' &&
      e.key === 'x' &&
      (e.metaKey || e.ctrlKey)
    ) {
      e.preventDefault();
      // 剪切
      if (this.store.activeId) {
        const node = store.getNodeById(this.store.activeId);
        if (node && store.activeRegion) {
          toast.warning('区域节点不允许剪切。');
        } else if (store.isRootSchema(this.store.activeId)) {
          toast.warning('根节点不允许剪切。');
        } else if (node && node.moveable) {
          this.copy(); // 复制
          this.manager.del(this.store.activeId); // 删除
        } else {
          toast.warning('当前元素不允许剪切。');
        }
      }
    } else if (
      (e.target as HTMLElement).tagName === 'BODY' &&
      e.key === 'p' &&
      (e.metaKey || e.ctrlKey)
    ) {
      // 预览
      e.preventDefault(); // 避免触发系统默认的事件（打印快捷键）
      this.preview();
    } else if (
      (e.target as HTMLElement).tagName === 'BODY' &&
      e.key === 'ArrowUp' &&
      (e.metaKey || e.ctrlKey)
    ) {
      e.preventDefault();
      // 向上移动
      if (this.store.activeId) {
        const node = store.getNodeById(this.store.activeId);
        if (node && node.canMoveUp) {
          this.manager.moveUp();
        } else {
          toast.warning('当前元素不能向上移动');
        }
      }
    } else if (
      (e.target as HTMLElement).tagName === 'BODY' &&
      e.key === 'ArrowDown' &&
      (e.metaKey || e.ctrlKey)
    ) {
      e.preventDefault();
      // 向下移动
      if (this.store.activeId) {
        const node = store.getNodeById(this.store.activeId);
        if (node && node.canMoveDown) {
          this.manager.moveDown();
        } else {
          toast.warning('当前元素不能向下移动');
        }
      }
    } else if (
      (e.target as HTMLElement).tagName === 'BODY' &&
      (e.key === 'Backspace' || e.key === 'Delete')
    ) {
      e.preventDefault();
      // 删除快捷键
      if (this.store.activeId) {
        const node = store.getNodeById(this.store.activeId);
        if (node && store.activeRegion) {
          toast.warning('区域节点不可以直接删除。');
        } else if (store.isRootSchema(this.store.activeId)) {
          toast.warning('根节点不允许删除。');
        } else if (node && node.moveable) {
          this.manager.del(this.store.activeId);
        } else {
          toast.warning('当前元素不允许删除。');
        }
      }
      return;
    }
  }

  // 右键菜单
  @autobind
  handleContextMenu(e: React.MouseEvent<HTMLElement>) {
    let targetId: string = '';
    let region = '';

    // 如果在某个已点选的控件下面，则让当前选中的渲染器呼出右键菜单
    if (this.store.activeId) {
      targetId = (e.target as HTMLElement)
        .closest(`[data-editor-id="${this.store.activeId}"]`)
        ?.getAttribute('data-editor-id')!;
    } else if (this.store.selections.length) {
      targetId = (e.target as HTMLElement)
        .closest(
          this.store.selections
            .map(item => `[data-editor-id="${item}"]`)
            .join(',')
        )
        ?.getAttribute('data-editor-id')!;
    }

    // 没找到就近找
    if (!targetId) {
      targetId = (e.target as HTMLElement)
        .closest('[data-editor-id]')
        ?.getAttribute('data-editor-id')!;
    }

    // 没找到看看是不是在大纲中的右键
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

    const manager = this.manager;
    manager.openContextMenu(targetId, region, {
      x: window.scrollX + e.clientX,
      y: window.scrollY + e.clientY
    });
  }

  canUndo() {
    return this.store.canUndo;
  }

  canRedo() {
    return this.store.canRedo;
  }

  undo() {
    if (this.props.onUndo) {
      this.props.onUndo(); // 优先使用外部撤销方法
    } else {
      this.store.undo();
    }
  }

  redo() {
    if (this.props.onRedo) {
      this.props.onRedo(); // 优先使用外部重做方法
    } else {
      this.store.redo();
    }
  }

  // 默认数据变动都会触发前端暂存，此处主要用于执行外部保存方法
  save() {
    if (this.props.onSave) {
      this.props.onSave();
    }
  }

  preview() {
    if (this.props.onPreview) {
      this.props.onPreview(true);
    }
  }

  /**
   * 复制的内容以变量的形式存放
   * 备注1: 系统的复制&粘贴需要开启https服务才有效，所有这里改用内存形式实现
   * 备注2: 此方法不鞥实现跨页面复制&粘贴能力
   * 备注3: 后续需要支持下跨页面跨浏览器复制&粘贴能力
   */
  copy() {
    if (this.store.activeId) {
      this.curCopySchemaData = this.store.getSchema(this.store.activeId);
    }
  }

  /**
   * 粘贴上一次复制的内容
   */
  paste() {
    if (this.store.activeId && this.curCopySchemaData) {
      if (!this.curCopySchemaData) {
        // 考虑复制的元素被删除的情况
        return;
      }
      const curSimpleSchema = this.store.getSimpleSchema(
        this.curCopySchemaData
      );
      if (this.store.activeId === this.curCopySchemaData.$$id) {
        // 复制和粘贴是同一个元素，则直接追加到当前元素后面
        this.manager.appendSiblingSchema(curSimpleSchema);
      } else {
        this.manager.addElem(curSimpleSchema);
      }
    }
  }

  @autobind
  getToolbarContainer() {
    return this.mainRef.current;
  }

  render() {
    const {
      preview,
      isMobile,
      className,
      theme,
      data,
      iframeUrl,
      previewProps,
      autoFocus,
      isSubEditor
    } = this.props;
    return (
      <div
        ref={this.mainRef}
        className={cx(
          'ae-Editor',
          {
            preview: preview
          },
          className
        )}
      >
        <div className="ae-Editor-inner" onContextMenu={this.handleContextMenu}>
          {!preview && (
            <LeftPanels
              store={this.store}
              manager={this.manager}
              theme={theme}
            />
          )}

          <div className="ae-Main">
            {!preview && (
              <Breadcrumb store={this.store} manager={this.manager} />
            )}
            <Preview
              {...previewProps}
              iframeUrl={iframeUrl}
              editable={!preview}
              isMobile={isMobile}
              store={this.store}
              manager={this.manager}
              theme={theme}
              data={data}
              autoFocus={autoFocus}
              toolbarContainer={this.getToolbarContainer}
            ></Preview>
          </div>

          {!preview && (
            <RightPanels
              store={this.store}
              manager={this.manager}
              theme={theme}
            />
          )}

          {!preview && <ContextMenuPanel store={this.store} />}
        </div>

        <SubEditor store={this.store} manager={this.manager} theme={theme} />
        <ScaffoldModal
          store={this.store}
          manager={this.manager}
          theme={theme}
        />
        <PopOverForm store={this.store} manager={this.manager} theme={theme} />
      </div>
    );
  }
}
