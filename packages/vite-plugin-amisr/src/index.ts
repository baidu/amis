import type {Plugin} from 'vite';
import fs from 'fs';
import path from 'path';

export interface AMISROptions {}

export default function vitePluginAmisR({}: AMISROptions = {}): Plugin {
  const match = (id: string) => {
    return /(?:amis|dslpage)\.json(?:$|\?)/.test(id);
  };

  return {
    name: 'vite-plugin-amisr',
    enforce: 'pre', // 优先运行

    // 添加 resolveId 方法来标记处理过的文件
    async resolveId(source: string, importer: string | undefined) {
      if (!match(source) || !source.includes('?react')) return null;

      // 解析实际文件路径（去掉 ?react）
      const withoutQuery = source.replace('?react', '');
      const resolved = await this.resolve(withoutQuery, importer, {
        skipSelf: true
      });
      const finalId = resolved?.id ?? withoutQuery;

      // 返回一个以 '\0' 开头的虚拟 id，避免后续 json 插件匹配原始 .json
      return `\0${finalId}.js?react`;
    },

    async load(id: string) {
      // 只处理我们在 resolveId 中创建的虚拟 id
      if (!id.startsWith('\0') || !id.includes('?react')) return null;

      // 从虚拟 id 恢复真实文件路径
      const real = id.slice(1).replace(/\.js\?react$/, '');
      const filePath = path.isAbsolute(real)
        ? real
        : path.resolve(process.cwd(), real);

      const code = await fs.promises.readFile(filePath, 'utf8');

      const codes = [
        `import React from 'react';`,
        `import {useRenderOptionsContext, render} from 'amis-core';`,
        `const schema = ${code};`,
        `export default function AMISPage(props) {`,
        `  const options = useRenderOptionsContext();`,
        `  return React.createElement(React.Fragment, null, render(schema, props, options));`,
        `}`
      ];

      return {
        code: codes.join('\n')
      };
    }
  };
}
