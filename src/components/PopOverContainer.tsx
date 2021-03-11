import React from 'react';
import {autobind} from '../utils/helper';
import Overlay from './Overlay';
import PopOver from './PopOver';
import {findDOMNode} from 'react-dom';

export interface PopOverContainerProps {
  children: (props: {
    onClick: (e: React.MouseEvent) => void;
    isOpened: boolean;
    ref: any;
  }) => JSX.Element;
  popOverRender: (props: {onClose: () => void}) => JSX.Element;
  popOverContainer?: any;
  popOverClassName?: string;
}

export interface PopOverContainerState {
  isOpened: boolean;
}

export class PopOverContainer extends React.Component<
  PopOverContainerProps,
  PopOverContainerState
> {
  state: PopOverContainerState = {
    isOpened: false
  };

  target: any;

  @autobind
  targetRef(target: any) {
    this.target = target ? findDOMNode(target) : null;
  }

  @autobind
  handleClick() {
    this.setState({
      isOpened: true
    });
  }

  @autobind
  close() {
    this.setState({
      isOpened: false
    });
  }

  @autobind
  getTarget() {
    return this.target || (findDOMNode(this) as HTMLElement);
  }

  @autobind
  getParent() {
    return this.getTarget()?.parentElement;
  }

  render() {
    const {
      children,
      popOverContainer,
      popOverClassName,
      popOverRender: dropdownRender
    } = this.props;
    return (
      <>
        {children({
          isOpened: this.state.isOpened,
          onClick: this.handleClick,
          ref: this.targetRef
        })}

        <Overlay
          container={popOverContainer || this.getParent}
          target={this.getTarget}
          placement={'auto'}
          show={this.state.isOpened}
        >
          <PopOver
            overlay
            className={popOverClassName}
            style={{
              minWidth: this.target
                ? Math.max(this.target.getBoundingClientRect().width, 100)
                : 'auto'
            }}
            onHide={this.close}
          >
            {dropdownRender({onClose: this.close})}
          </PopOver>
        </Overlay>
      </>
    );
  }
}

export default PopOverContainer;
