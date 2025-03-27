import React, {useRef, useEffect} from 'react';
import {ClassNamesFn} from 'amis-core';

interface AlphabetIndexerProps {
  items: Array<any>;
  getItemLetter: (item: any) => string;
  onLetterClick: (letter: string) => void;
  classnames: ClassNamesFn;
  currentLetter?: string;
}

const AlphabetIndexer: React.FC<AlphabetIndexerProps> = ({
  items,
  getItemLetter,
  onLetterClick,
  classnames: cx,
  currentLetter
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const letters = React.useMemo(() => {
    return Array.from(
      new Set(
        items
          .map(item => {
            const value = getItemLetter(item);
            return typeof value === 'string'
              ? value.charAt(0).toUpperCase()
              : '';
          })
          .filter(Boolean)
          .sort()
      )
    );
  }, [items, getItemLetter]);

  const handleTouchMove = (e: TouchEvent) => {
    e.preventDefault();
    const touch = e.touches[0];
    const target = document.elementFromPoint(touch.clientX, touch.clientY);
    const letter = target?.getAttribute('data-letter');
    if (letter) {
      onLetterClick(letter);
    }
  };

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener('touchmove', handleTouchMove, {
        passive: false
      });

      return () => {
        container.removeEventListener('touchmove', handleTouchMove);
      };
    }
    return () => {};
  }, []);

  return (
    <div ref={containerRef} className={cx('AlphabetIndexer')}>
      {letters.map(letter => (
        <div
          key={letter}
          className={cx('AlphabetIndexer-letter', {
            'is-active': letter === currentLetter
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
