import {autobind, Renderer, RendererProps} from 'amis-core';
import {Slider} from 'amis-ui';
import React from 'react';
import {BaseSchema} from '../Schema';

export interface SliderSchema extends BaseSchema {
  type: 'slider';
  // 主体内容
  body: BaseSchema;

  // 左侧内容
  left?: BaseSchema;

  // 右侧内容
  right?: BaseSchema;

  // pc下body宽度占比，默认60%
  bodyWidth?: string;
}

interface SliderProps extends RendererProps, Omit<SliderSchema, 'className'> {}

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
