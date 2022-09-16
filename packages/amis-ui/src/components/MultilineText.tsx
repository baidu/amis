import React from 'react';
import {autobind, localeable, LocaleProps} from 'amis-core';
import {themeable, ThemeProps} from 'amis-core';
import Button from './Button';

export interface MultilineTextProps extends ThemeProps, LocaleProps {
  /**
   * 最大行数
   */
  maxRows?: number;

  /**
   * 展示文本
   */
  text: string;

  /**
   * 展开按钮文本
   */
  expendButtonText?: string;

  /**
   * 收起按钮文本
   */
  collapseButtonText?: string;
}

export interface MultilineTextState {
  isExpend: boolean;
  showBtn: boolean;
}

export class MultilineText extends React.Component<MultilineTextProps, MultilineTextState> {
  static defaultProps = {
    maxRows: 5,
    expendButtonText: '展开',
    collapseButtonText: '收起'
  };

  state = {
    isExpend: false,
    showBtn: false
  };

  ref?: React.RefObject<HTMLDivElement>;

  constructor(props: MultilineTextProps) {
    super(props);
    this.ref = React.createRef();
  }

  componentDidMount() {
    if (this.ref && this.ref.current) {
      if (this.ref.current.scrollHeight > this.ref.current.clientHeight) {
        this.setState({
          showBtn: true,
          isExpend: false
        });
      }
    }
  }

  @autobind
  toggleExpend() {
    this.setState({
      isExpend: !this.state.isExpend
    });
  }

  render() {
    const {
      className,
      text,
      classnames: cx,
      maxRows = 5,
      expendButtonText,
      collapseButtonText
    } = this.props;

    if (!text) {
      return null;
    }

    const {
      showBtn,
      isExpend
    } = this.state;

    return (
      <div
        className={cx(
          `MultilineText`,
          className
        )}
      >
        <div
          ref={this.ref}
          className={cx('white-space-pre-line', 'overflow-hidden')}
          style={{
            height: isExpend ? 'auto' : `${maxRows * 20}px`
          }}
        >{text}</div>
        {showBtn &&
          <div className="text-right">
            <Button
              className="mt-1"
              level="link"
              onClick={this.toggleExpend}
            >{!isExpend ? expendButtonText : collapseButtonText}</Button>
          </div>
        }
      </div>
    );
  }
}

export default themeable(localeable(MultilineText));
