/**
 * @file image 相关的工具
 * @param url
 */

import memoize from 'lodash/memoize';

/**
 * 将 url 转成 dataurl
 * @param url
 */
export const toDataURL = memoize((url: string) => {
  return new Promise<string>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.onload = function () {
      const reader = new FileReader();
      reader.onloadend = function () {
        resolve(reader.result as string);
      };
      reader.readAsDataURL(xhr.response);
    };
    xhr.onerror = reject;
    xhr.open('GET', url);
    xhr.responseType = 'blob';
    xhr.send();
  });
});

/**
 * 根据 url 获取图片尺寸
 * @param url
 */
export const getImageDimensions = memoize((url: string) => {
  return new Promise<{width: number; height: number}>(function (
    resolved,
    rejected
  ) {
    const i = new Image();
    i.onerror = rejected;
    i.onload = function () {
      resolved({width: i.width, height: i.height});
    };
    i.src = url;
  });
});
