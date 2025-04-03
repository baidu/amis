/**
 * @file PdfViewer.tsx PDF 预览
 *
 * @created: 2024/02/26
 */

import React, {Suspense} from 'react';
import {
  autobind,
  getVariable,
  isApiOutdated,
  IScopedContext,
  Renderer,
  RendererProps,
  resolveVariableAndFilter,
  ScopedContext,
  getGlobalOptions
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
   * 文件取值，一般配合表单使用
   */
  name?: string;
  width?: number;
  height?: number;
  background?: string;
}

export interface PdfViewerProps extends RendererProps {}

interface PdfViewerState {
  loading: boolean;
  inited: boolean;
  width?: number;
  error: boolean;
}

export default class PdfViewer extends React.Component<
  PdfViewerProps,
  PdfViewerState
> {
  file?: ArrayBuffer;
  reader?: FileReader;
  fetchCancel?: Function;
  wrapper = React.createRef<HTMLDivElement>();
  constructor(props: PdfViewerProps) {
    super(props);
    this.state = {
      inited: false,
      loading: false,
      error: false
    };
  }

  componentDidMount() {
    if (this.wrapper.current) {
      this.setState({
        width: this.wrapper.current.clientWidth - 100
      });
    }
    this.renderPdf();
  }

  componentDidUpdate(prevProps: PdfViewerProps) {
    const props = this.props;

    if (
      isApiOutdated(prevProps.src, props.src, prevProps.data, props.data) ||
      resolveVariableAndFilter(props.src, props.data, '| raw') !==
        resolveVariableAndFilter(prevProps.src, prevProps.data, '| raw')
    ) {
      this.abortLoad();
      setTimeout(() => {
        this.fetchPdf();
      }, 0);
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

  componentWillUnmount() {
    this.abortLoad();
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
    this.setState({error: false});
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
    let finalSrc;

    if (src) {
      const resolveSrc = resolveVariableAndFilter(src, data, '| raw');
      if (typeof resolveSrc === 'string') {
        finalSrc = resolveSrc;
      } else if (
        typeof resolveSrc === 'object' &&
        typeof resolveSrc.value === 'string'
      ) {
        finalSrc = resolveSrc.value;
      }
    }

    if (!finalSrc) {
      console.warn('file src is empty');
      return;
    }

    this.setState({
      inited: true,
      loading: true,
      error: false
    });

    try {
      const res = await env.fetcher(finalSrc, data, {
        responseType: 'arraybuffer',
        cancelExecutor: (executor: Function) => (this.fetchCancel = executor)
      });
      this.file = res.data;
      this.forceUpdate();
    } catch (error) {
      this.setState({error: true});
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
    this.setState({
      inited: true,
      loading: true
    });
    if (file instanceof File) {
      const reader = new FileReader();
      reader.onload = _e => {
        const data = reader.result as ArrayBuffer;
        this.file = data;
        this.setState({
          loading: false
        });
        this.forceUpdate();
      };
      reader.onerror = _e => {
        this.setState({error: true});
      };
      reader.readAsArrayBuffer(file);
      this.reader = reader;
    }
  }

  @autobind
  renderEmpty() {
    const {src, name} = this.props;
    if (!src && !name) {
      return (
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
            PDF viewer
          </text>
        </svg>
      );
    }
    return null;
  }

  @autobind
  renderError() {
    const {src, translate: __} = this.props;
    const {error} = this.state;
    if (error && src) {
      return <div>{__('loadingFailed') + ' url:' + src}</div>;
    }

    return null;
  }

  @autobind
  renderTip() {
    return (
      <div>
        <p>
          [PdfViewer]: pdfjsWorkerSrc is required, Please set the
          `pdfjsWorkerSrc` in setGlobalOptions function.
        </p>
      </div>
    );
  }

  render() {
    const {
      className,
      classnames: cx,
      translate: __,
      height,
      background
    } = this.props;
    const pdfjs = getGlobalOptions().pdfjsWorkerSrc;
    const {loading, inited, error} = this.state;
    const width = Math.max(this.props.width || this.state.width, 300);

    return (
      <div ref={this.wrapper}>
        {this.renderEmpty()}
        {!pdfjs ? (
          this.renderTip()
        ) : (
          <Suspense fallback={<div>...</div>}>
            {inited && !error ? (
              <PdfView
                file={this.file}
                loading={loading}
                className={className}
                classnames={cx}
                width={width}
                height={height}
                background={background}
              />
            ) : null}
          </Suspense>
        )}

        {this.renderError()}
      </div>
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
