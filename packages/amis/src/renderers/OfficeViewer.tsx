/**
 * office 文件预览
 */

import React from 'react';
import {BaseSchema} from '../Schema';
import {
  ActionObject,
  isApiOutdated,
  IScopedContext,
  Renderer,
  RendererProps,
  resolveVariableAndFilter,
  ScopedContext,
  ServiceStore
} from 'amis-core';

export interface OfficeViewerSchema extends BaseSchema {
  type: 'office-viewer';
  /**
   * 文件地址
   */
  src: string;

  /**
   * word 文档的渲染配置
   */
  wordOptions?: {};

  /**
   * 是否显示文档
   */
  display?: boolean;
}

export interface OfficeViewerProps
  extends RendererProps,
    Omit<OfficeViewerSchema, 'className'> {
  columnsCount: number;
}

export interface OfficeViewerState {}

export default class OfficeViewer extends React.Component<
  OfficeViewerProps,
  OfficeViewerState
> {
  rootElement: React.RefObject<HTMLDivElement>;

  word: Word;

  fileName?: string;

  constructor(props: OfficeViewerProps) {
    super(props);
    this.rootElement = React.createRef();
  }

  componentDidMount() {
    if (this.rootElement?.current) {
      this.renderWord();
    }
  }

  componentDidUpdate(prevProps: OfficeViewerProps) {
    const props = this.props;

    if (isApiOutdated(prevProps.src, props.src, prevProps.data, props.data)) {
      this.renderWord();
    }

    if (props.name) {
      if (prevProps.data[props.name] !== props.data[props.name]) {
        this.renderWord();
      }
    }

    // 这个变量替换只会更新变化的部分，所以性能还能接受
    this.word?.updateVariable();
  }

  doAction(action: ActionObject, args: any, throwErrors: boolean): any {
    const actionType = action?.actionType as string;

    if (actionType === 'saveAs') {
      this.word?.download(args?.name || this.fileName);
    }

    if (actionType === 'print') {
      this.word?.print();
    }
  }

  replaceText(text: string) {
    const {data} = this.props;
    // 将 {{xxx}} 替换成 ${xxx}，为啥要这样呢，因为输入 $ 可能会变成两段文本
    text = text.replace(/{{/g, '${').replace(/}}/g, '}');
    return resolveVariableAndFilter(text, data, '| raw');
  }

  async renderWord() {
    const {src, name} = this.props;
    if (src) {
      this.renderRemoteWord();
    } else if (name) {
      this.renderFormFile();
    } else {
      console.warn(`office-viewer must have src or name`);
    }
  }

  /**
   * 渲染远端文件
   */
  async renderRemoteWord() {
    const {wordOptions, env, src, data, display} = this.props;

    const finalSrc = src
      ? resolveVariableAndFilter(src, data, '| raw')
      : undefined;

    if (typeof finalSrc === 'string') {
      this.fileName = finalSrc.split('/').pop();
    }

    const response = await env.fetcher(finalSrc, data, {
      responseType: 'arraybuffer'
    });

    import('office-viewer').then(async (officeViewer: any) => {
      const Word = officeViewer.Word;
      const word = new Word(response.data, {
        ...wordOptions,
        replaceText: this.replaceText.bind(this)
      });

      if (display !== false) {
        word.render(this.rootElement?.current!);
      }

      this.word = word;
    });
  }

  /**
   * 渲染本地文件，用于预览 input-file
   */
  renderFormFile() {
    const {wordOptions, name, data, display} = this.props;
    const file = data[name];
    if (file instanceof File) {
      const reader = new FileReader();
      reader.onload = _e => {
        const data = reader.result as ArrayBuffer;

        import('office-viewer').then(async (officeViewer: any) => {
          const word = new Word(data, {
            ...wordOptions,
            replaceText: this.replaceText.bind(this)
          });
          if (display !== false) {
            word.render(this.rootElement?.current!);
          }
        });

      };
      reader.readAsArrayBuffer(file);
    }
  }

  render() {
    const {classnames: cx, translate: __} = this.props;
    return <div ref={this.rootElement} className={cx('Office-Viewer')}></div>;
  }
}

@Renderer({
  type: 'office-viewer'
})
export class OfficeViewerRenderer extends OfficeViewer {
  static contextType = ScopedContext;

  constructor(props: OfficeViewerProps, context: IScopedContext) {
    super(props);

    const scoped = context;
    scoped.registerComponent(this);
  }

  componentWillUnmount() {
    super.componentWillUnmount?.();
    const scoped = this.context as IScopedContext;
    scoped.unRegisterComponent(this);
  }
}
