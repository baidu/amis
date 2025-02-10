/**
 * 内联编辑相关功能模块
 * 提供了纯文本和富文本两种编辑模式
 * 支持通过鼠标点击位置设置光标
 */
import {guid} from 'amis-core';
import {InlineEditableElement} from './plugin';
import {EditorNodeType} from './store/node';
import keycode from 'keycode';

/**
 * 内联编辑上下文接口定义
 * @interface InlineEditContext
 * @property {EditorNodeType} node - 当前编辑器节点实例
 * @property {HTMLElement} elem - 需要编辑的DOM元素
 * @property {InlineEditableElement} config - 内联编辑的配置信息
 * @property {MouseEvent} [event] - 触发编辑的鼠标事件对象
 * @property {Function} onConfirm - 编辑确认后的回调函数,参数为编辑后的内容
 * @property {Function} onCancel - 取消编辑的回调函数
 */
export interface InlineEditContext {
  node: EditorNodeType;
  elem: HTMLElement;
  config: InlineEditableElement;
  event?: MouseEvent;
  onConfirm: (value: string) => void;
  onCancel: () => void;
  richTextToken?: string;
  richTextOptions?: any;
}

/**
 * 启动内联编辑
 * 根据配置的mode选择对应的编辑模式
 * @param {InlineEditContext} context - 编辑上下文
 */
export function startInlineEdit(context: InlineEditContext) {
  if (context.config.mode === 'rich-text') {
    startRichTextEdit(context);
  } else {
    startPlainTextEdit(context);
  }
}

/**
 * 启动纯文本编辑模式
 * 设置元素为可编辑状态,监听键盘事件
 * 支持ESC取消和回车确认
 * @param {InlineEditContext} context - 编辑上下文
 */
function startPlainTextEdit({
  elem,
  onConfirm,
  onCancel,
  event
}: InlineEditContext) {
  let origin = elem.innerText.trim();
  let forceCancel = false;
  const onKeyDown = (e: Event) => {
    const code = keycode(e);
    if (code === 'esc') {
      // 还是不要把内容都还原了，直接取消吧
      // forceCancel = true;
      cleanup();
      e.preventDefault();
    } else if (code === 'enter') {
      cleanup();
      e.preventDefault();
    }
  };

  /**
   * 清理编辑状态
   * 移除事件监听,还原元素属性
   * 根据内容是否变化决定触发确认还是取消
   */
  const cleanup = () => {
    elem.removeEventListener('blur', cleanup);
    elem.removeAttribute('contenteditable');
    elem.removeEventListener('keydown', onKeyDown);
    const value = elem.innerText.trim();
    if (!forceCancel && value !== origin) {
      onConfirm(value);
    } else {
      onCancel();
    }
  };

  elem.addEventListener('blur', cleanup);
  elem.addEventListener('keydown', onKeyDown);
  elem.setAttribute('contenteditable', 'plaintext-only');
  elem.focus();

  let caretRange = event
    ? getMouseEventCaretRange(event, elem)
    : createRangeAtTheEnd(elem);

  // Set a timer to allow the selection to happen and the dust settle first
  setTimeout(function () {
    selectRange(caretRange, elem);
  }, 10);
}

/**
 * 启动富文本编辑模式
 * 使用Froala编辑器,支持文本格式化、插入图片表格等功能
 * @param {InlineEditContext} context - 编辑上下文
 */
async function startRichTextEdit({
  elem,
  event,
  node,
  richTextToken,
  richTextOptions,
  onConfirm,
  onCancel
}: InlineEditContext) {
  const {FroalaEditor} = await import('amis-ui/lib/components/RichText');
  const id = `u_${guid()}`;
  elem.setAttribute('data-froala-id', id);

  let origin = '';
  let forceCancel = false;

  /**
   * 清理富文本编辑器
   * 销毁编辑器实例,移除关联属性
   * 根据内容变化决定触发确认还是取消
   */
  const cleanup = () => {
    const value = editor.html.get();
    editor.destroy();
    elem.removeAttribute('data-froala-id');

    if (!forceCancel && value !== origin) {
      onConfirm(value);
    } else {
      onCancel();
    }
  };

  const editor = new FroalaEditor(
    `[data-froala-id="${id}"]`,
    {
      iframe_document: elem.ownerDocument,
      toolbarInline: true,
      charCounterCount: false,
      key: richTextToken,
      // 不配置这个户自动包裹个 <p> 会出现跳动
      // https://wysiwyg-editor.froala.help/hc/en-us/articles/115000461089-Can-I-disable-wrapping-content-with-P-tags
      enter: FroalaEditor.ENTER_BR,
      // todo 现在这个按钮的位置又问题，先忽略
      // quickInsertEnabled: false,
      toolbarButtons: [
        'paragraphFormat',
        'textColor',
        'backgroundColor',
        'bold',
        'underline',
        'strikeThrough',
        'formatOL',
        'formatUL',
        'align',
        'quote',
        'insertLink',
        'insertImage',
        'insertEmotion',
        'insertTable'
      ],
      imageUpload: false,
      ...richTextOptions,
      events: {
        blur: cleanup,
        keydown: (e: KeyboardEvent) => {
          if (e.key === 'Escape') {
            // 还是不要把内容都还原了，直接取消吧
            // forceCancel = true;
            cleanup();
          }
        },
        contentChanged: () => {
          node.calculateHighlightBox();
        }
      }
    },
    () => {
      editor.events.focus();
      origin = editor.html.get();

      let caretRange = event
        ? getMouseEventCaretRange(event, elem)
        : createRangeAtTheEnd(elem);

      // Set a timer to allow the selection to happen and the dust settle first
      setTimeout(function () {
        selectRange(caretRange, elem);
      }, 10);
    }
  );
}

/**
 * 在元素末尾创建一个Range对象
 * 用于设置光标位置
 * @param {HTMLElement} elem - 目标元素
 * @returns {Range} 创建的Range对象
 */
function createRangeAtTheEnd(elem: HTMLElement) {
  const range = elem.ownerDocument.createRange();
  range.selectNodeContents(elem);
  range.collapse(false);
  return range;
}

/**
 * 根据鼠标事件获取光标Range
 * 支持多种浏览器的光标位置获取方式
 * 包括IE、Mozilla、WebKit等
 * @param {MouseEvent} evt - 鼠标事件对象
 * @returns {Range} 光标位置的Range对象
 */
function getMouseEventCaretRange(evt: MouseEvent, elem: HTMLElement) {
  let range,
    x = evt.clientX,
    y = evt.clientY;

  const target = evt.target as HTMLElement;
  const doc = elem.ownerDocument;

  if (target.ownerDocument !== doc) {
    // 如果点击事件来自iframe外部，需要调整坐标
    const iframe = doc.defaultView?.frameElement as HTMLIFrameElement;

    if (iframe) {
      const rect = iframe.getBoundingClientRect();
      x -= rect.left;
      y -= rect.top;
    }
  }

  // Try the simple IE way first
  if ((doc.body as any).createTextRange) {
    range = (doc.body as any).createTextRange();
    range.moveToPoint(x, y);
  } else if (typeof doc.createRange != 'undefined') {
    // Try Mozilla's rangeOffset and rangeParent properties,
    // which are exactly what we want
    if (typeof (evt as any).rangeParent != 'undefined') {
      range = doc.createRange();
      range.setStart((evt as any).rangeParent, (evt as any).rangeOffset);
      range.collapse(true);
    }

    // Try the standards-based way next
    else if ((doc as any).caretPositionFromPoint) {
      let pos: any = (doc as any).caretPositionFromPoint(x, y);
      range = doc.createRange();
      range.setStart(pos.offsetNode, pos.offset);
      range.collapse(true);
    }

    // Next, the WebKit way
    else if (doc.caretRangeFromPoint) {
      range = doc.caretRangeFromPoint(x, y);
    }
  }

  return range;
}

/**
 * 选中指定的Range区域
 * 支持IE和标准浏览器两种方式
 * @param {Range} range - 要选中的Range对象
 */
function selectRange(range: any, elem: HTMLElement) {
  const doc = elem.ownerDocument;
  const win = doc.defaultView || (doc as any).parentWindow;

  if (range) {
    if (typeof range.select != 'undefined') {
      range.select();
    } else if (typeof win.getSelection != 'undefined') {
      let sel: any = win.getSelection();
      sel.removeAllRanges();
      sel.addRange(range);
    }
  }
}
