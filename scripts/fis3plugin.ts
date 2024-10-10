import MagicString from 'magic-string';
import {createFilter} from 'rollup-pluginutils';
import type {Plugin} from 'vite';

export default function fis3replace(
  options: {
    include?: any;
    exclude?: any;
    sourcemap?: boolean;
    sourceMap?: boolean;
  } = {}
): Plugin {
  const filter = createFilter(options.include, options.exclude);

  return {
    name: 'fis3',
    enforce: 'pre',
    apply: 'serve',

    transform(code: string, id: string) {
      if (!filter(id)) return null;

      const magicString = new MagicString(code);

      let hasReplacements = false;
      let start;
      let end;

      code = code.replace(
        /(__uri|__inline)\(\s*('|")(.*?)\2\s*\)/g,
        (_, directive, quote, target, index) => {
          hasReplacements = true;

          start = index;
          end = start + _.length;

          if (directive === '__uri') {
            let replacement = `new URL(${quote}${target}${quote}, import.meta.url).href`;
            magicString.overwrite(start, end, replacement);
          } else if (directive === '__inline') {
            let varname = target
              .replace(/[^a-zA-Z0-9]/g, '')
              .replace(/^\d+/, '');

            magicString.prepend(`import ${varname} from '${target}?inline';\n`);
            magicString.overwrite(start, end, `${varname}`);
          }

          return _;
        }
      );

      if (!hasReplacements) return null;

      const result: any = {code: magicString.toString()};
      if (options.sourceMap !== false && options.sourcemap !== false)
        result.map = magicString.generateMap({hires: true});

      return result;
    }
  };
}
