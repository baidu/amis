const originalWarn = console.warn.bind(console.warn);
require('@testing-library/jest-dom');
require('moment-timezone');
const moment = require('moment');
moment.tz.setDefault('Asia/Shanghai');

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
});
