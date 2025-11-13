import React from 'react';
import {findDomCompat} from './utils/findDomCompat';

interface TaggerWrapperProps {
  children: React.ReactElement;
  tagger: {
    [propName: string]: string | number;
  };
}

/**
 * 自动给组件对应 dom 打标记，开发态时才会进来
 * @param param0
 * @returns
 */
export const TaggerWrapper: React.FC<TaggerWrapperProps> = ({
  children,
  tagger
}) => {
  const ref = React.useRef<HTMLElement | null>(null);

  React.useLayoutEffect(() => {
    if (!ref.current || !tagger) {
      return;
    }

    const dom = findDomCompat(ref.current);
    const attrs: any = {};
    Object.keys(tagger).forEach(key => {
      if (typeof tagger[key] === 'string' || typeof tagger[key] === 'number') {
        attrs[`data-amis-tagger-${key}`] = String(tagger[key]);
      }
    });

    Object.keys(attrs).forEach(key => {
      dom?.setAttribute(key, attrs[key]);
    });

    return () => {
      Object.keys(attrs).forEach(key => {
        dom?.removeAttribute(key);
      });
    };
  }, [tagger, ref.current]);

  // 合并 ref：保持原有 ref，同时添加我们的 ref
  const mergedRef = React.useCallback(
    (node: HTMLElement | null) => {
      ref.current = node;

      // 如果原有 children 有 ref，也调用它
      const childRef = (children as any).ref;
      if (childRef) {
        if (typeof childRef === 'function') {
          childRef(node);
        } else {
          // ref 对象
          childRef.current = node;
        }
      }
    },
    [children]
  );

  return React.cloneElement(children, {
    ref: mergedRef
  } as any);
};

export default TaggerWrapper;
