/**
 * @file OverflowTpl
 * @desc 文字提示组件，会基于内部文字是否触发ellipsis，动态展示tooltip提示, 默认使用子节点文本作为tooltip内容
 */

import React, {useState, useEffect, useRef, useCallback} from 'react';
import {findDomCompat as findDOMNode} from 'amis-core';
import omit from 'lodash/omit';
import {themeable, isObject} from 'amis-core';
import TooltipWrapper from './TooltipWrapper';

import type {ThemeProps} from 'amis-core';
import type {TooltipWrapperProps} from './TooltipWrapper';

export interface OverflowTplProps extends ThemeProps {
  className?: string;

  /**
   * tooltip相关配置
   */
  tooltip?: TooltipWrapperProps['tooltip'];

  /**
   * 是否使用行内标签，默认为 true，使用 span 标签，否则使用 div 标签
   */
  inline?: boolean;

  /**
   * 目标元素的selector，通常不需要指定
   */
  targetSelector?: string;

  /**
   * 内部节点
   */
  children?: React.ReactNode | React.ReactNode[];
}

const OverflowTpl: React.FC<OverflowTplProps> = props => {
  const {
    classnames: cx,
    children,
    className,
    targetSelector,
    tooltip,
    inline = true
  } = props;
  const [ellipsisAvtived, setEllipsisAvtived] = useState(false);
  const [innerText, setInnerText] = useState('');
  const innerRef = useRef<Element | React.ReactInstance>(null);
  const defaultTooltip = tooltip
    ? typeof tooltip === 'string'
      ? {content: tooltip}
      : isObject(tooltip)
      ? tooltip
      : undefined
    : typeof children === 'string'
    ? {content: children}
    : undefined; /** 默认使用子节点文本 */
  const normalizedTooltip =
    innerText && (!defaultTooltip || defaultTooltip?.content == null)
      ? {...defaultTooltip, content: innerText}
      : defaultTooltip;
  const updateEllipsisActivation = useCallback(
    (el?: Element) => {
      setEllipsisAvtived(
        el
          ? el.scrollWidth > el.clientWidth || el.scrollHeight > el.scrollHeight
          : false
      );
    },
    [innerRef.current]
  );
  const onMutation = useCallback(
    (mutations: MutationRecord[]) => {
      const dom = (
        targetSelector
          ? document.querySelector(targetSelector)
          : mutations?.[0].target
      ) as Element | undefined;

      updateEllipsisActivation(dom);
      if (
        dom?.textContent &&
        typeof dom.textContent === 'string' &&
        (!defaultTooltip || defaultTooltip?.content == null)
      ) {
        setInnerText(dom.textContent);
      }
    },
    [targetSelector]
  );
  const onResize = useCallback(
    (entries: ResizeObserverEntry[]) => {
      const dom = (
        targetSelector
          ? document.querySelector(targetSelector)
          : entries?.[0].target
      ) as Element | undefined;

      updateEllipsisActivation(dom);
      if (
        dom?.textContent &&
        typeof dom.textContent === 'string' &&
        (!defaultTooltip || !defaultTooltip?.content == null)
      ) {
        setInnerText(dom.textContent);
      }
    },
    [targetSelector]
  );

  /** 监听目标元素的DOM变化 */
  useEffect(() => {
    const element =
      innerRef.current instanceof React.Component
        ? (findDOMNode(innerRef.current) as Element)
        : innerRef.current;

    if (element) {
      const observer = new MutationObserver(onMutation);
      observer.observe(element, {
        childList: true,
        subtree: true,
        characterDataOldValue: true,
        characterData: true
      });
      return () => observer.disconnect();
    }

    return;
  }, [innerRef.current]);

  /** 监听目标元素的尺寸变化 */
  useEffect(() => {
    const element =
      innerRef.current instanceof React.Component
        ? (findDOMNode(innerRef.current) as Element)
        : innerRef.current;

    if (element) {
      const observer = new ResizeObserver(onResize);
      observer.observe(element);
      return () => observer.disconnect();
    }

    return;
  }, [innerRef.current]);

  const WrapComponent = inline !== false ? 'span' : 'div';
  const showTooltip = ellipsisAvtived && normalizedTooltip;
  const Body = React.isValidElement(children) ? (
    React.cloneElement(children as React.ReactElement, {ref: innerRef})
  ) : (
    <WrapComponent
      ref={innerRef as React.RefObject<HTMLDivElement>}
      className={cx('OverflowTpl', className, {
        'OverflowTpl--with-tooltip': showTooltip
      })}
    >
      {children}
    </WrapComponent>
  );

  return showTooltip ? (
    <TooltipWrapper
      {...omit(props, ['className', 'inline', 'targetSelector', 'children'])}
      tooltip={normalizedTooltip}
    >
      {Body}
    </TooltipWrapper>
  ) : (
    Body
  );
};

OverflowTpl.defaultProps = {
  inline: true
};

export default themeable(OverflowTpl);
