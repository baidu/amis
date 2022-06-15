/**
 * @file 基于实现 bar code
 */

import React from 'react';
import {ClassNamesFn, themeable} from 'amis-core';

import JsBarcode from 'jsbarcode';

export interface BarCodeProps {
  value: string;
  className?: string;
  classPrefix: string;
  options?: JsBarcode.Options;
  classnames: ClassNamesFn;
}

export class BarCode extends React.Component<BarCodeProps> {
  private dom;

  constructor(props: BarCodeProps) {
    super(props);
    this.dom = React.createRef<HTMLImageElement>();
  }

  componentDidUpdate(prevProps: BarCodeProps) {
    if (
      this.props.value !== prevProps.value ||
      JSON.stringify(this.props.options) !== JSON.stringify(prevProps.options)
    ) {
      this.renderBarCode();
    }
  }

  renderBarCode() {
    if (this.dom.current) {
      JsBarcode(this.dom.current, this.props.value, this.props.options);
    }
  }

  componentDidMount() {
    this.renderBarCode();
  }

  render() {
    return <img ref={this.dom} />;
  }
}

export default themeable(BarCode);
