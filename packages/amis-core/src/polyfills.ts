/**
 * 用于放一些关键的 polyfill
 */

// ios 老版本没有这个会报错
if (!('DragEvent' in window)) {
  Object.defineProperty(window, 'DragEvent', {
    value: class DragEvent {}
  });
}
