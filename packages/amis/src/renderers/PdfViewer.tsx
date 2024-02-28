/**
 * @file PdfViewer.tsx PDF 预览
 *
 * @created: 2024/02/26
 */

import React from 'react';
import {
  autobind,
  getVariable,
  isApiOutdated,
  IScopedContext,
  Renderer,
  RendererProps,
  resolveVariableAndFilter,
  ScopedContext
} from 'amis-core';
import {BaseSchema} from '../Schema';

export const PdfView = React.lazy(
  () => import('amis-ui/lib/components/PdfViewer')
);

export interface PdfViewerSchema extends BaseSchema {
  type: 'pdf-viewer';
  /**
   * 文件地址
   */
  src?: string;
  /**
   * 文件取值，一般配个表单使用
   */
  name?: string;
  width?: number;
  height?: number;
  background?: string;
}

export interface PdfViewerProps extends RendererProps {}

interface PdfViewerState {
  loading: boolean;
}

export default class PdfViewer extends React.Component<
  PdfViewerProps,
  PdfViewerState
> {
  file?: ArrayBuffer;
  reader?: FileReader;
  fetchCancel?: Function;
  constructor(props: PdfViewerProps) {
    super(props);
    this.state = {
      loading: false
    };
  }

  componentDidMount() {
    this.renderPdf();
  }

  componentDidUpdate(prevProps: PdfViewerProps) {
    const props = this.props;

    if (isApiOutdated(prevProps.src, props.src, prevProps.data, props.data)) {
      this.abortLoad();
      this.fetchPdf();
    }

    if (getVariable(props.data, props.name)) {
      if (
        getVariable(prevProps.data, prevProps.name) !==
        getVariable(props.data, props.name)
      ) {
        this.abortLoad();
        this.renderPdf();
      }
    }
  }

  @autobind
  abortLoad() {
    if (this.fetchCancel) {
      this.fetchCancel('load canceled');
      this.fetchCancel = undefined;
    }
    if (this.reader) {
      this.reader.abort();
      this.reader = undefined;
    }
  }

  @autobind
  async renderPdf() {
    const {src, name, data} = this.props;
    // src 优先级高于 name
    if (src) {
      if (!this.file) {
        await this.fetchPdf();
      }
    } else if (getVariable(data, name)) {
      await this.renderFormFile();
    }
  }

  @autobind
  async fetchPdf() {
    const {env, src, data, translate: __} = this.props;
    const finalSrc = src
      ? resolveVariableAndFilter(src, data, '| raw')
      : undefined;

    if (!finalSrc) {
      console.warn('file src is empty');
      return;
    }

    this.setState({
      loading: true
    });

    try {
      const res = await env.fetcher(finalSrc, data, {
        responseType: 'arraybuffer',
        cancelExecutor: (executor: Function) => (this.fetchCancel = executor)
      });
      this.file = res.data;
      this.forceUpdate();
    } catch (error) {
      console.error(error);
    } finally {
      this.setState({
        loading: false
      });
    }
  }

  @autobind
  async renderFormFile() {
    const {name, data} = this.props;
    const file = getVariable(data, name);
    if (file instanceof File) {
      const reader = new FileReader();
      reader.onload = _e => {
        const data = reader.result as ArrayBuffer;
        this.file = data;
        this.forceUpdate();
      };
      reader.readAsArrayBuffer(file);
      this.reader = reader;
    }
  }

  render() {
    const {className, classnames: cx, width, height, background} = this.props;

    return (
      <PdfView
        file={this.file}
        className={className}
        classnames={cx}
        width={width}
        height={height}
        background={background}
      />
    );
  }
}

@Renderer({
  type: 'pdf-viewer'
})
export class PdfViewerRenderer extends PdfViewer {
  static contextType = ScopedContext;

  constructor(props: PdfViewerProps, context: IScopedContext) {
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
