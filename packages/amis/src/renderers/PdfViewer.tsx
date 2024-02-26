/**
 * @file PdfViewer.tsx PDF 预览
 *
 * @created: 2024/02/26
 */

import React from 'react';
import {
  autobind,
  isApiOutdated,
  IScopedContext,
  Renderer,
  RendererProps,
  resolveVariableAndFilter,
  ScopedContext
} from 'amis-core';
import {PdfView} from 'amis-ui';
import {BaseSchema} from '../Schema';

export interface PdfViewerSchema extends BaseSchema {
  type: 'pdf-viewer';
  /**
   * 文件地址
   */
  src: string;
}

export interface PdfViewerProps extends RendererProps {}

interface PdfViewerState {
  loading: boolean;
  document?: ArrayBuffer;
}

export default class PdfViewer extends React.Component<
  PdfViewerProps,
  PdfViewerState
> {
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
    // 避免 loading 时更新
    if (this.state.loading) {
      return;
    }
    const props = this.props;

    if (isApiOutdated(prevProps.src, props.src, prevProps.data, props.data)) {
      this.fetchPdf();
    }

    if (props.name) {
      if (prevProps.data[props.name] !== props.data[props.name]) {
        this.renderPdf();
      }
    }
  }

  @autobind
  async renderPdf() {
    const {src, name} = this.props;
    if (src) {
      if (!this.state.document) {
        await this.fetchPdf();
      }
    } else if (name) {
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
        responseType: 'arraybuffer'
      });
      this.setState({
        document: res.data
      });
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
    const file = data[name];
    if (file instanceof File) {
      const reader = new FileReader();
      reader.onload = _e => {
        const data = reader.result as ArrayBuffer;
        this.setState({
          document: data
        });
      };
      reader.readAsArrayBuffer(file);
    }
  }

  @autobind
  getUrlFromBuffer() {
    const document = this.state.document;
    if (!document) {
      return;
    }
    const blob = new Blob([document], {
      type: 'application/pdf'
    });
    return URL.createObjectURL(blob);
  }

  render() {
    const {className, classnames: cx} = this.props;
    const src = this.getUrlFromBuffer();

    // 创建 URL
    return <PdfView src={src} className={className} classnames={cx} />;
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
