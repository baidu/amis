/**
 * office 文件预览
 */

import React from 'react';
import {BaseSchema} from '../Schema';
import {
  ActionObject,
  createObject,
  filter,
  isApiOutdated,
  IScopedContext,
  Renderer,
  RendererProps,
  resolveVariable,
  resolveVariableAndFilter,
  ScopedContext
} from 'amis-core';
import type {Word} from 'office-viewer';
import {Spinner} from 'amis-ui';

export interface OfficeViewerSchema extends BaseSchema {
  type: 'office-viewer';
  /**
   * 文件地址
   */
  src: string;

  /**
   * word 文档的渲染配置
   */
  wordOptions?: any;

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

    if (
      JSON.stringify(prevProps.wordOptions) !==
        JSON.stringify(props.wordOptions) ||
      prevProps.display !== props.display
    ) {
      this.renderWord();
    }

    if (props.wordOptions?.enableVar) {
      if (
        props.trackExpression &&
        filter(props.trackExpression, props.data) !==
          filter(prevProps.trackExpression, prevProps.data)
      ) {
        this.renderWord();
      } else {
        // 目前 word 渲染比较快，所以全量渲染性能可以接受
        this.renderWord();
      }
    }
  }

  /**
   * 接收动作事件
   */
  doAction(action: ActionObject, args: any, throwErrors: boolean): any {
    const actionType = action?.actionType as string;

    if (actionType === 'saveAs') {
      this.word?.download(args?.name || this.fileName);
    }

    if (actionType === 'print') {
      this.word?.print();
    }
  }

  /**
   * 执行变量替换
   */
  evalVar(text: string, data: any) {
    const localData = this.props.data;
    return resolveVariable(text, createObject(localData, data));
  }

  async renderWord() {
    const {src, name} = this.props;
    if (src) {
      this.renderRemoteWord();
    } else if (name) {
      this.renderFormFile();
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

    if (!finalSrc) {
      console.warn('file src is empty');
      return;
    }

    const response = await env.fetcher(finalSrc, data, {
      responseType: 'arraybuffer'
    });

    import('office-viewer').then(async (officeViewer: any) => {
      const Word = officeViewer.Word;
      const word = new Word(response.data, {
        ...wordOptions,
        data,
        evalVar: this.evalVar.bind(this)
      });

      if (display !== false) {
        word.render(this.rootElement?.current!);
      } else if (display === false && this.rootElement?.current) {
        // 设置为 false 后清空
        this.rootElement.current.innerHTML = '';
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
          const Word = officeViewer.Word;
          const word = new Word(data, {
            ...wordOptions,
            evalVar: this.evalVar.bind(this)
          });
          if (display !== false) {
            word.render(this.rootElement?.current!);
          } else if (display === false && this.rootElement?.current) {
            // 设置为 false 后清空
            this.rootElement.current.innerHTML = '';
          }
        });
      };
      reader.readAsArrayBuffer(file);
    }
  }

  render() {
    const {
      classnames: cx,
      translate: __,
      className,
      loading = false,
      src,
      name,
      display,
      loadingConfig
    } = this.props;
    return (
      <div ref={this.rootElement} className={cx('office-viewer', className)}>
        {/* 避免没内容时编辑器都选不了 */}
        {display !== false && !src && !name && (
          <svg width="100%" height="100" xmlns="http://www.w3.org/2000/svg">
            <rect
              x="0"
              y="0"
              width="100%"
              height="100"
              style={{fill: '#F7F7F9'}}
            />
            <text
              x="50%"
              y="50%"
              fontSize="18"
              textAnchor="middle"
              alignmentBaseline="middle"
              fontFamily="monospace, sans-serif"
              fill="#555555"
            >
              office viewer
            </text>
          </svg>
        )}

        <Spinner
          overlay
          key="info"
          show={loading}
          loadingConfig={loadingConfig}
        />
      </div>
    );
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
