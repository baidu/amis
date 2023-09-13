const originalWarn = console.warn.bind(console.warn);
const originalGroupCollapsed = console.warn.bind(console.groupCollapsed);
const originalGroupEnd = console.warn.bind(console.groupEnd);
const originalDebug = console.warn.bind(console.debug);
require('@testing-library/jest-dom');
require('moment-timezone');
const moment = require('moment');
moment.tz.setDefault('Asia/Shanghai');

global.beforeAll(() => {
  console.warn =
    console.groupCollapsed =
    console.groupEnd =
    console.debug =
      msg => {
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
  console.groupCollapsed = originalGroupCollapsed;
  console.groupEnd = originalGroupEnd;
  console.debug = originalDebug;
});
