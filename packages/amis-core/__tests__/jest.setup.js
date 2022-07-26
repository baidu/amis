const originalWarn = console.warn.bind(console.warn);
require('@testing-library/jest-dom');
require('moment-timezone');
const moment = require('moment');
moment.tz.setDefault('Asia/Shanghai');
const cleanup = require('@testing-library/react').cleanup;

// https://github.com/nrwl/nx/issues/1178
// 解决jest 运行的时候报：
// ReferenceError: DragEvent is not defined
Object.defineProperty(window, 'DragEvent', {
  value: class DragEvent {}
});

global.beforeAll(() => {
  console.warn = msg => {
    // warning 先关了，实在太吵。
    // const str = msg.toString();
    // if (
    //   str.includes('componentWillMount') ||
    //   str.includes('componentWillReceiveProps')
    // ) {
    //   return;
    // }
    // originalWarn(msg);
  };
});
global.afterAll(() => {
  console.warn = originalWarn;
  cleanup();
});
