// 这是个特殊的方法，请看考 mod.js 里面的实现。
export function pdfUrlLoad() {
  // @ts-ignore
  const pdfWorker = __uri('pdfjs-dist/build/pdf.worker.min.mjs');

  return filterUrl(pdfWorker);
}

function __uri(url: string) {
  return url;
}

// 用于发布 sdk 版本的时候替换，因为不确定 sdk 版本怎么部署，而 worker 地址路径不可知。
// 所以会被 fis3 替换成取相对的代码。
function filterUrl(url: string) {
  return url;
}
