/**
 * @file 这个文件的作用是将 CSS 变量去掉来支持 IE11
 */
const postcssCustomProperties = require('postcss-custom-properties');

module.exports = {
  plugins: [postcssCustomProperties({preserve: false})]
};
