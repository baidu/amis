import React from 'react';
import {LocaleProps, localeable} from 'amis-core';
import {ClassNamesFn, themeable} from 'amis-core';
import {Spinner} from './Spinner';

export type LoadMoreProps = {
  iconSize?: number;
  status?: 'more' | 'loading' | 'no-more';
  showIcon?: boolean;
  showText?: boolean;
  iconColor?: string;
  color?: string;
  contentText?: {
    contentdown: string;
    contentrefresh: string;
    contentnomore: string;
  };
};

interface LoadMoreComponentProps extends LocaleProps, LoadMoreProps {
  classnames: ClassNamesFn;
  classPrefix: string;
  onClick: () => void;
}

export class LoadMore extends React.Component<LoadMoreComponentProps> {
  static defaultProps = {
    iconSize: 20,
    showIcon: true,
    showText: true,
    iconColor: '',
    color: '',
    contentText: {
      contentdown: '点击显示更多',
      contentrefresh: '加载中...',
      contentnomore: '没有更多数据了'
    }
  };

  render() {
    const {
      classnames: cx,
      classPrefix: ns,
      status,
      showIcon,
      showText,
      iconSize,
      iconColor,
      color,
      contentText,
      onClick
    } = this.props;

    const isLoading = status === 'loading';
    const isNoMore = status === 'no-more';

    return (
      <div
        className={cx(`${ns}LoadMore`, {
          'is-loading': isLoading,
          'is-nomore': isNoMore
        })}
        onClick={!isLoading && !isNoMore ? onClick : undefined}
        style={{color}}
      >
        {showIcon && (
          <Spinner
            show={isLoading}
            icon="loading-outline"
            size="sm"
            classnames={cx}
            classPrefix={ns}
            className={cx('LoadMore-icon')}
            spinnerClassName={cx({
              'is-spinning': isLoading
            })}
            style={{
              width: iconSize,
              height: iconSize,
              fill: iconColor || color
            }}
          />
        )}
        {showText && (
          <span className={cx('LoadMore-text')}>
            {isLoading
              ? contentText?.contentrefresh
              : isNoMore
              ? contentText?.contentnomore
              : contentText?.contentdown}
          </span>
        )}
      </div>
    );
  }
}

export default themeable(localeable(LoadMore));
