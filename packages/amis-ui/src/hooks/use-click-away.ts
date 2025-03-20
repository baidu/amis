import {RefObject, useCallback, useEffect} from 'react';

// 存储所有点击事件监听器的集合
const listeners = new Set<(e: Event) => void>();

// 添加点击事件监听器
const addClickListener = (callback: (e: Event) => void) =>
  listeners.add(callback);

// 移除点击事件监听器
const removeClickListener = (callback: (e: Event) => void) =>
  listeners.delete(callback);

// 处理点击事件，调用所有监听器
function handleEvent(e: Event) {
  listeners.forEach(listener => listener(e));
}

// 默认的事件类型
const defaultEvents = ['mousedown', 'touchstart'];

/**
 * 自定义 Hook：useClickAway
 * 当点击事件发生在指定元素外部时，触发回调函数
 *
 * @param ref - 目标元素的引用
 * @param onClickAway - 点击外部时的回调函数
 * @param doc - Document 对象，默认为当前文档
 * @param events - 监听的事件类型，默认为 ['mousedown', 'touchstart']
 */
const useClickAway = (
  ref: RefObject<HTMLElement | null>,
  onClickAway: (e: Event) => void,
  doc: Document = document,
  events: string[] = defaultEvents
) => {
  // 事件处理函数
  const handler = useCallback(
    (e: Event) => {
      const {current: el} = ref;
      el && !el.contains(e.target as Node) && onClickAway(e);
    },
    [ref]
  );

  useEffect(() => {
    // 添加事件监听器
    if (!listeners.has(handler)) {
      addClickListener(handler);
    }
    events.forEach(event => doc.addEventListener(event, handleEvent));

    // 清理函数，移除事件监听器
    return () => {
      removeClickListener(handler);
      events.forEach(event => doc.removeEventListener(event, handleEvent));
    };
  }, [events, ref, doc]);
};

export default useClickAway;
