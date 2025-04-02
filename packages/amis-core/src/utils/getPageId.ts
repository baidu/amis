// 获取当前页面标识
// 通过页面路径来
export function getPageId() {
  let key = location.pathname;

  if (location.hash && location.hash.startsWith('#/')) {
    key += location.hash.slice(1);
  }

  return key;
}
