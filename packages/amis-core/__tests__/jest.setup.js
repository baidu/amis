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

global.__buildVersion = '';

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

  /**
   * Jest环境下关闭Log, 避免影响输出
   * 若要调试, 请使用@testing-library/react中的screen.debug方法
   * screen.debug是console.log(prettyDOM())的shortcut, 所以console.log不能禁用
   */
  console.error = jest.fn();
  console.debug = jest.fn();
  console.group = jest.fn();
  console.groupEnd = jest.fn();
});
global.afterAll(() => {
  console.warn = originalWarn;
  cleanup();
});
