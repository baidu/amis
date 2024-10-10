import MagicString from 'magic-string';
import type {Plugin} from 'vite';

/**
 * 因为这个 mobile.html 也作用于 fis3 编译，不能直接修改源码
 * 所以靠这个插件来改成让 vite 支持
 * @param options
 * @returns
 */
export default function transformMobileHtml(options: {} = {}): Plugin {
  return {
    name: 'amis-transform-mobile-html',
    enforce: 'pre',
    apply: 'serve',

    transformIndexHtml(html: string, file) {
      if (
        file.path === '/examples/mobile.html' ||
        file.path === '/examples/index.html'
      ) {
        html = html.replace(/href=('|")(.*?)\1/g, (_, quote, value) => {
          if (/^amis\/lib\/themes\/(.*)\.css$/.test(value)) {
            return `href=${quote}../../packages/amis-ui/scss/themes/${RegExp.$1}.scss${quote}`;
          } else if (/^amis\/lib\/helper\.css$/.test(value)) {
            return `href=${quote}../../packages/amis-ui/scss/helper.scss${quote}`;
          } else if (
            /^(?:amis|amis\-core|amis\-formula|amis\-ui|office\-viewer)/.test(
              value
            )
          ) {
            return `href=${quote}../../packages/${value}${quote}`;
          } else if (value[0] !== '.' && value[0] !== '/') {
            return `href=${quote}../../node_modules/${value}${quote}`;
          }

          return _;
        });

        const script = '<script type="text/javascript">';
        const idx = html.lastIndexOf(script);
        if (~idx) {
          html =
            html.substring(0, idx) +
            '<script type="module">' +
            html.substring(idx + script.length);
        }

        html = html.replace(
          "amis.require(['./mobile.jsx'], function (app)",
          "import('./mobile.jsx').then(function (app)"
        );
      }
      return html;
    }
  };
}
