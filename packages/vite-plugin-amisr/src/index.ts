import type {Plugin} from 'vite';
import fs from 'fs';
import path from 'path';

export interface AMISROptions {
  jsTemplate?: string;
  jsDevTemplate?: string;
}

const defaultDevTemplate = `
import React from 'react';
import {useRenderOptionsContext, render} from 'amis-core';
import {useParams} from "react-router-dom";

export const schema = {{JSON_CODE}}
export const meta = schema.meta || {};

let _updateSchema; // for hot reload
export default function AMISPage(props) {
  const options = useRenderOptionsContext();
  const params = useParams();
  const [s, setS] = React.useState(schema);
  React.useEffect(() => {
    _updateSchema = setS;
    return () => { _updateSchema = null; }
  }, []);
  return React.createElement(React.Fragment, null, render(s, {params, ...props}, options));
}
if (import.meta.hot) {
  import.meta.hot.accept('{{id}}', ({schema: newSchema}) => {
    if (_updateSchema) {
      _updateSchema(newSchema);
    }
  });
}
`;

const defaultJsTemplate = `
import React from 'react';
import {useRenderOptionsContext, render} from 'amis-core';
import {useParams} from "react-router-dom";

export const schema = {{JSON_CODE}}
export const meta = schema.meta || {};

export default function AMISPage(props) {
  const options = useRenderOptionsContext();
  const params = useParams();
  return React.createElement(React.Fragment, null, render(schema, {params, ...props}, options));
}
`;

export default function vitePluginAmisR({
  jsTemplate = defaultJsTemplate,
  jsDevTemplate = defaultDevTemplate
}: AMISROptions = {}): Plugin {
  const match = (id: string) => {
    return /(?:amis|dslpage)\.json(?:$|\?)/.test(id);
  };
  let skipHotReload = false;

  return {
    name: 'vite-plugin-amisr',
    enforce: 'pre', // 优先运行

    configResolved(config) {
      skipHotReload =
        config.isProduction ||
        config.command === 'build' ||
        config.server?.hmr === false;
    },

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
      return `\0${finalId}.amisr.jsx`;
    },

    async load(id: string) {
      // 只处理我们在 resolveId 中创建的虚拟 id
      if (!id.startsWith('\0') || !id.includes('.amisr.jsx')) return null;

      // 从虚拟 id 恢复真实文件路径
      const real = id.slice(1).replace(/\.amisr\.jsx$/, '');
      const filePath = path.isAbsolute(real)
        ? real
        : path.resolve(process.cwd(), real);

      const jsonCode = await fs.promises.readFile(filePath, 'utf8');
      const code = (skipHotReload ? jsTemplate : jsDevTemplate)
        .replace('{{JSON_CODE}}', jsonCode)
        .replace('{{JSON_CONTENTS}}', jsonCode)
        .replace('{{id}}', id);

      return {
        code: code
      };
    },

    // 热更新逻辑：当 amis.json/dslpage.json 文件变更时，触发虚拟模块热更新
    handleHotUpdate({file, server}) {
      if (!match(file)) return [];

      const virtualId = `\0${file}.amisr.jsx`;
      const mod = server.moduleGraph.getModuleById(virtualId);
      if (mod) {
        server.moduleGraph.invalidateModule(mod);
        return [mod];
      }

      return [];
    }
  };
}
