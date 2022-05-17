const postcss = require('postcss');
const postcssCustomProperties = require('postcss-custom-properties');

module.exports = function (content, file) {
  // console.log(content);
  return postcss([postcssCustomProperties({preserve: false})]).process(content)
    .css;
};
