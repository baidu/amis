/**
 * office 文件预览
 */

import React from 'react';
import {BaseSchema, SchemaClassName, SchemaUrlPath} from '../Schema';
import {Word, WordRenderOptions} from 'office-viewer';
import {Renderer, RendererProps} from 'amis-core';

export interface OfficeViewerSchema extends BaseSchema {
  type: 'office-viewer';
  /**
   * 文件地址
   */
  src: string;

  /**
   * word 文档的渲染配置
   */
  wordOptions?: RendererProps;
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

  constructor(props: OfficeViewerProps) {
    super(props);
    this.rootElement = React.createRef();
  }

  componentDidMount() {
    if (this.rootElement?.current) {
      this.renderWord();
    }
  }

  async renderWord() {
    const {wordOptions, env} = this.props;
    const src = this.props.src;
    const response = await env.fetcher(
      src,
      {},
      {
        responseType: 'arraybuffer'
      }
    );
    const word = new Word(response.data, {
      ...wordOptions
    });
    word.render(this.rootElement.current);
    this.word = word;
  }

  render() {
    const {classnames: cx, translate: __} = this.props;
    return <div ref={this.rootElement} className={cx('Office-Viewer')}></div>;
  }
}

@Renderer({
  type: 'office-viewer'
})
export class OfficeViewerRenderer extends OfficeViewer {}
