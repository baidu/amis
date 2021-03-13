// 这是个特殊的方法，请看考 mod.js 里面的实现。
export function __mod__async__load(callback: (exports: any) => void) {
  // @ts-ignore
  const monacoLoader = __uri('monaco-editor/min/vs/loader.js');

  // @ts-ignore
  const script = amis.require.loadJs(filterUrl(monacoLoader));
  script.onload = () => onLoad(window.require, callback);
}

function __uri(url: string) {
  return url;
}

// 用于发布 sdk 版本的时候替换，因为不确定 sdk 版本怎么部署，而 worker 地址路径不可知。
// 所以会被 fis3 替换成取相对的代码。
function filterUrl(url: string) {
  return url;
}

function onLoad(req: any, callback: (result: any) => void) {
  const config = {
    'vs/nls': {
      availableLanguages: {
        '*': 'zh-cn'
      }
    },
    'paths': {
      'vs': __uri('monaco-editor/min/vs/editor/editor.main.js').replace(
        /\/vs\/.*$/,
        ''
      ),
      'vs/base/worker/workerMain': __uri(
        'monaco-editor/min/vs/base/worker/workerMain.js'
      ),
      'vs/basic-languages/apex/apex': __uri(
        'monaco-editor/min/vs/basic-languages/apex/apex'
      ),
      'vs/basic-languages/azcli/azcli': __uri(
        'monaco-editor/min/vs/basic-languages/azcli/azcli'
      ),
      'vs/basic-languages/clojure/clojure': __uri(
        'monaco-editor/min/vs/basic-languages/clojure/clojure'
      ),
      'vs/basic-languages/bat/bat': __uri(
        'monaco-editor/min/vs/basic-languages/bat/bat'
      ),
      'vs/basic-languages/coffee/coffee': __uri(
        'monaco-editor/min/vs/basic-languages/coffee/coffee'
      ),
      'vs/basic-languages/cpp/cpp': __uri(
        'monaco-editor/min/vs/basic-languages/cpp/cpp'
      ),
      'vs/basic-languages/csharp/csharp': __uri(
        'monaco-editor/min/vs/basic-languages/csharp/csharp'
      ),
      'vs/basic-languages/css/css': __uri(
        'monaco-editor/min/vs/basic-languages/css/css'
      ),
      'vs/basic-languages/dockerfile/dockerfile': __uri(
        'monaco-editor/min/vs/basic-languages/dockerfile/dockerfile'
      ),
      'vs/basic-languages/fsharp/fsharp': __uri(
        'monaco-editor/min/vs/basic-languages/fsharp/fsharp'
      ),
      'vs/basic-languages/go/go': __uri(
        'monaco-editor/min/vs/basic-languages/go/go'
      ),
      'vs/basic-languages/handlebars/handlebars': __uri(
        'monaco-editor/min/vs/basic-languages/handlebars/handlebars'
      ),
      'vs/basic-languages/html/html': __uri(
        'monaco-editor/min/vs/basic-languages/html/html'
      ),
      'vs/basic-languages/ini/ini': __uri(
        'monaco-editor/min/vs/basic-languages/ini/ini'
      ),
      'vs/basic-languages/java/java': __uri(
        'monaco-editor/min/vs/basic-languages/java/java'
      ),
      'vs/basic-languages/javascript/javascript': __uri(
        'monaco-editor/min/vs/basic-languages/javascript/javascript'
      ),
      'vs/basic-languages/less/less': __uri(
        'monaco-editor/min/vs/basic-languages/less/less'
      ),
      'vs/basic-languages/lua/lua': __uri(
        'monaco-editor/min/vs/basic-languages/lua/lua'
      ),
      'vs/basic-languages/markdown/markdown': __uri(
        'monaco-editor/min/vs/basic-languages/markdown/markdown'
      ),
      'vs/basic-languages/msdax/msdax': __uri(
        'monaco-editor/min/vs/basic-languages/msdax/msdax'
      ),
      'vs/basic-languages/objective-c/objective-c': __uri(
        'monaco-editor/min/vs/basic-languages/objective-c/objective-c'
      ),
      'vs/basic-languages/php/php': __uri(
        'monaco-editor/min/vs/basic-languages/php/php'
      ),
      'vs/basic-languages/postiats/postiats': __uri(
        'monaco-editor/min/vs/basic-languages/postiats/postiats'
      ),
      'vs/basic-languages/powershell/powershell': __uri(
        'monaco-editor/min/vs/basic-languages/powershell/powershell'
      ),
      'vs/basic-languages/pug/pug': __uri(
        'monaco-editor/min/vs/basic-languages/pug/pug'
      ),
      'vs/basic-languages/python/python': __uri(
        'monaco-editor/min/vs/basic-languages/python/python'
      ),
      'vs/basic-languages/r/r': __uri(
        'monaco-editor/min/vs/basic-languages/r/r'
      ),
      'vs/basic-languages/razor/razor': __uri(
        'monaco-editor/min/vs/basic-languages/razor/razor'
      ),
      'vs/basic-languages/redis/redis': __uri(
        'monaco-editor/min/vs/basic-languages/redis/redis'
      ),
      'vs/basic-languages/redshift/redshift': __uri(
        'monaco-editor/min/vs/basic-languages/redshift/redshift'
      ),
      'vs/basic-languages/ruby/ruby': __uri(
        'monaco-editor/min/vs/basic-languages/ruby/ruby'
      ),
      'vs/basic-languages/rust/rust': __uri(
        'monaco-editor/min/vs/basic-languages/rust/rust'
      ),
      'vs/basic-languages/sb/sb': __uri(
        'monaco-editor/min/vs/basic-languages/sb/sb'
      ),
      'vs/basic-languages/scheme/scheme': __uri(
        'monaco-editor/min/vs/basic-languages/scheme/scheme'
      ),
      'vs/basic-languages/scss/scss': __uri(
        'monaco-editor/min/vs/basic-languages/scss/scss'
      ),
      'vs/basic-languages/shell/shell': __uri(
        'monaco-editor/min/vs/basic-languages/shell/shell'
      ),
      'vs/basic-languages/solidity/solidity': __uri(
        'monaco-editor/min/vs/basic-languages/solidity/solidity'
      ),
      'vs/basic-languages/sql/sql': __uri(
        'monaco-editor/min/vs/basic-languages/sql/sql'
      ),
      'vs/basic-languages/st/st': __uri(
        'monaco-editor/min/vs/basic-languages/st/st'
      ),
      'vs/basic-languages/swift/swift': __uri(
        'monaco-editor/min/vs/basic-languages/swift/swift'
      ),
      'vs/basic-languages/typescript/typescript': __uri(
        'monaco-editor/min/vs/basic-languages/typescript/typescript'
      ),
      'vs/basic-languages/vb/vb': __uri(
        'monaco-editor/min/vs/basic-languages/vb/vb'
      ),
      'vs/basic-languages/xml/xml': __uri(
        'monaco-editor/min/vs/basic-languages/xml/xml'
      ),
      'vs/basic-languages/yaml/yaml': __uri(
        'monaco-editor/min/vs/basic-languages/yaml/yaml'
      ),
      'vs/editor/editor.main': __uri(
        'monaco-editor/min/vs/editor/editor.main.js'
      ),
      'vs/editor/editor.main.css': __uri(
        'monaco-editor/min/vs/editor/editor.main.css'
      ),
      'vs/editor/editor.main.nls': __uri(
        'monaco-editor/min/vs/editor/editor.main.nls.js'
      ),
      'vs/editor/editor.main.nls.zh-cn': __uri(
        'monaco-editor/min/vs/editor/editor.main.nls.zh-cn.js'
      ),
      // 'vs/editor/contrib/suggest/media/String_16x.svg': __uri('monaco-editor/min/vs/editor/contrib/suggest/media/String_16x.svg'),
      // 'vs/editor/contrib/suggest/media/String_inverse_16x.svg': __uri('monaco-editor/min/vs/editor/contrib/suggest/media/String_inverse_16x.svg'),
      // 'vs/editor/standalone/browser/quickOpen/symbol-sprite.svg': __uri('monaco-editor/min/vs/editor/standalone/browser/quickOpen/symbol-sprite.svg'),
      'vs/base/browser/ui/codicons/codicon/codicon.ttf': __uri(
        'monaco-editor/min/vs/base/browser/ui/codicons/codicon/codicon.ttf'
      ),
      'vs/language/typescript/tsMode': __uri(
        'monaco-editor/min/vs/language/typescript/tsMode.js'
      ),
      // 'vs/language/typescript/lib/typescriptServices': __uri('monaco-editor/min/vs/language/typescript/lib/typescriptServices.js'),
      'vs/language/typescript/tsWorker': __uri(
        'monaco-editor/min/vs/language/typescript/tsWorker.js'
      ),
      'vs/language/json/jsonMode': __uri(
        'monaco-editor/min/vs/language/json/jsonMode.js'
      ),
      'vs/language/json/jsonWorker': __uri(
        'monaco-editor/min/vs/language/json/jsonWorker.js'
      ),
      'vs/language/html/htmlMode': __uri(
        'monaco-editor/min/vs/language/html/htmlMode.js'
      ),
      'vs/language/html/htmlWorker': __uri(
        'monaco-editor/min/vs/language/html/htmlWorker.js'
      ),
      'vs/language/css/cssMode': __uri(
        'monaco-editor/min/vs/language/css/cssMode.js'
      ),
      'vs/language/css/cssWorker': __uri(
        'monaco-editor/min/vs/language/css/cssWorker.js'
      )
    }
  };
  Object.keys(config.paths).forEach((key: keyof typeof config.paths) => {
    config.paths[key] = filterUrl(config.paths[key].replace(/\.js$/, ''));
  });
  req.config(config);

  if (/^(https?:)?\/\//.test(config.paths.vs)) {
    (window as any).MonacoEnvironment = {
      getWorkerUrl: function () {
        return `data:text/javascript;charset=utf-8,${encodeURIComponent(`
              self.MonacoEnvironment = {
                  baseUrl: '${config.paths.vs}',
                  paths: ${JSON.stringify(config.paths)}
              };
              importScripts('${filterUrl(
                __uri('monaco-editor/min/vs/base/worker/workerMain.js')
              )}');`)}`;
      }
    };
  } else {
    delete (window as any).MonacoEnvironment;
  }

  req(['vs/editor/editor.main'], function (ret: any) {
    callback(ret);
  });
}
