import React, {useRef, useEffect, useState} from 'react';
import {ClassNamesFn} from 'amis-core';

interface AlphabetIndexerProps {
  letters: string[];
  onLetterClick: (letter: string) => void;
  classnames: ClassNamesFn;
  currentLetter?: string;
  parent: HTMLElement | null; // 添加父容器引用
}

const AlphabetIndexer: React.FC<AlphabetIndexerProps> = ({
  letters,
  onLetterClick,
  classnames: cx,
  currentLetter,
  parent
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [style, setStyle] = useState<React.CSSProperties>({});

  // 处理触摸滑动
  const handleTouchMove = (e: TouchEvent) => {
    e.preventDefault();
    const touch = e.touches[0];
    const target = document.elementFromPoint(touch.clientX, touch.clientY);
    const letter = target?.getAttribute('data-letter');
    if (letter) {
      onLetterClick(letter);
    }
  };

  // 更新索引条位置
  const updatePosition = () => {
    if (!parent) return;

    const parentRect = parent.getBoundingClientRect();
    const parentStyle = window.getComputedStyle(parent);
    const parentPaddingRight = parseInt(parentStyle.paddingRight || '0', 10);

    setStyle({
      position: 'fixed',
      top: '50%',
      transform: 'translateY(-50%)',
      right: `${window.innerWidth - (parentRect.right - parentPaddingRight)}px`
    });
  };

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener('touchmove', handleTouchMove, {
        passive: false
      });

      // 监听滚动和resize事件以更新位置
      window.addEventListener('scroll', updatePosition);
      window.addEventListener('resize', updatePosition);

      // 初始化位置
      updatePosition();

      return () => {
        container.removeEventListener('touchmove', handleTouchMove);
        window.removeEventListener('scroll', updatePosition);
        window.removeEventListener('resize', updatePosition);
      };
    }
    return undefined;
  }, [parent]);

  return (
    <div ref={containerRef} className={cx('AlphabetIndexer')} style={style}>
      {letters.map(letter => (
        <div
          key={letter}
          className={cx('AlphabetIndexer-letter', {
            'is-active': currentLetter === letter
          })}
          data-letter={letter}
          onClick={() => onLetterClick(letter)}
        >
          {letter}
        </div>
      ))}
    </div>
  );
};

export default AlphabetIndexer;
