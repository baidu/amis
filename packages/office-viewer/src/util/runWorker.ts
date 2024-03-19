/**
 * 异步运行 Web Worker 的辅助函数
 * @param url web worker 的 url
 * @param input 输入
 */

export async function runWorker(url: string, input: any): Promise<any> {
  if (typeof Worker === 'undefined') {
    throw new Error("can't run worker in this environment");
  }
  return new Promise((resolve, reject) => {
    const worker = new Worker(new URL(url, import.meta.url), {type: 'module'});
    worker.postMessage(input);
    worker.onerror = event => {
      reject(event);
    };
    worker.onmessage = e => {
      resolve(e.data);
    };
  });
}
