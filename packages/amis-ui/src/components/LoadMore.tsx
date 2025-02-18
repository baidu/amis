import React from 'react';
import {LocaleProps, localeable} from 'amis-core';
import {ClassNamesFn, themeable} from 'amis-core';
import {Spinner} from './Spinner';

interface LoadMoreProps {
  /**
   * 图标大小,支持 sm/lg 或不设置
   * @default ''
   */
  size?: 'sm' | 'lg' | '';

  /**
   * 当前状态
   * @default 'more'
   */
  status?: 'more' | 'loading' | 'no-more';

  /**
   * 是否显示图标
   * @default true
   */
  showIcon?: boolean;

  /**
   * 是否显示文本
   * @default true
   */
  showText?: boolean;

  /**
   * 文本颜色
   */
  color?: string;

  /**
   * 自定义图标,支持传入React节点或icon字符串
   */
  icon?: string | React.ReactNode;

  /**
   * 自定义文案配置
   */
  contentText?: {
    contentdown: string;
    contentrefresh: string;
    contentnomore: string;
  };

  /**
   * 最小加载时间(ms)
   * @default 300
   */
  minLoadTime?: number;
}

interface LoadMoreComponentProps extends LocaleProps, LoadMoreProps {
  classnames: ClassNamesFn;
  classPrefix: string;
  onClick: () => void;
}

export class LoadMore extends React.Component<LoadMoreComponentProps> {
  static defaultProps = {
    size: 'sm' as 'sm' | 'lg' | '',
    showIcon: true,
    showText: true,
    color: '',
    contentText: {
      contentdown: '点击显示更多',
      contentrefresh: '加载中...',
      contentnomore: '没有更多数据了'
    },
    minLoadTime: 300
  };

  render() {
    const {
      classnames: cx,
      classPrefix: ns,
      status,
      showIcon,
      showText,
      size,
      color,
      icon,
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
            icon={icon || 'loading-outline'}
            size={size}
            classnames={cx}
            classPrefix={ns}
            className={cx('LoadMore-icon')}
            spinnerClassName={cx({
              'is-spinning': isLoading
            })}
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
