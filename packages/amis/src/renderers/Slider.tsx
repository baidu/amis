import {
  AMISSchemaBase,
  autobind,
  Renderer,
  RendererProps,
  AMISSchemaCollection
} from 'amis-core';
import {Slider} from 'amis-ui';
import React from 'react';
import {BaseSchema} from '../Schema';

/**
 * 滑块组件，用于选择范围或数值。支持步长、范围与提示。
 */
export interface AMISSliderSchema extends AMISSchemaBase {
  type: 'slider';
  // 主体内容
  body: AMISSchemaCollection;

  // 左侧内容
  left?: AMISSchemaCollection;

  // 右侧内容
  right?: AMISSchemaCollection;

  // pc下body宽度占比，默认60%
  bodyWidth?: string;
}

interface SliderProps
  extends RendererProps,
    Omit<AMISSliderSchema, 'className'> {}

@Renderer({
  type: 'slider'
})
export class SliderRenderer extends React.Component<SliderProps> {
  state: {
    leftShow: boolean;
    rightShow: boolean;
  } = {
    leftShow: false,
    rightShow: false
  };
  @autobind
  handleLeftShow() {
    this.props.dispatchEvent('leftShow', this.props.data);
  }

  @autobind
  handleRightShow() {
    this.props.dispatchEvent('rightShow', this.props.data);
  }

  @autobind
  handleLeftHide() {
    this.props.dispatchEvent('leftHide', this.props.data);
  }

  @autobind
  handleRightHide() {
    this.props.dispatchEvent('rightHide', this.props.data);
  }

  showLeft() {
    this.setState({
      leftShow: true
    });
  }
  hideLeft() {
    this.setState({
      leftShow: false
    });
  }

  showRight() {
    this.setState({
      rightShow: true
    });
  }

  hideRight() {
    this.setState({
      rightShow: false
    });
  }

  render() {
    const {render, body, left, right, env, ...rest} = this.props;
    const {leftShow, rightShow} = this.state;
    return (
      <Slider
        body={render('body', body, {...rest.data})}
        left={left && render('left', left, {...rest.data})}
        right={right && render('right', right, {...rest.data})}
        showLeft={leftShow}
        showRight={rightShow}
        onLeftShow={this.handleLeftShow}
        onRightShow={this.handleRightShow}
        onLeftHide={this.handleLeftHide}
        onRightHide={this.handleRightHide}
        {...rest}
      />
    );
  }
}
