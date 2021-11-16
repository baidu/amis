const logs = `
[0K$ node --version
v12.20.1
$ npm --version
6.14.10
$ nvm --version
0.37.2

[0K$ npm install 
npm WARN deprecated fsevents@2.1.3: "Please update to latest v2.3 or v2.2"
npm WARN deprecated fsevents@1.2.13: fsevents 1 will break on node v14+ and could be using insecure binaries. Upgrade to fsevents 2.
npm notice created a lockfile as package-lock.json. You should commit this file.
npm WARN optional SKIPPING OPTIONAL DEPENDENCY: fsevents@~2.1.2 (node_modules/sass/node_modules/chokidar/node_modules/fsevents):
npm WARN notsup SKIPPING OPTIONAL DEPENDENCY: Unsupported platform for fsevents@2.1.3: wanted {"os":"darwin","arch":"any"} (current: {"os":"linux","arch":"x64"})
npm WARN optional SKIPPING OPTIONAL DEPENDENCY: fsevents@^1.0.0 (node_modules/chokidar/node_modules/fsevents):
npm WARN notsup SKIPPING OPTIONAL DEPENDENCY: Unsupported platform for fsevents@1.2.13: wanted {"os":"darwin","arch":"any"} (current: {"os":"linux","arch":"x64"})
npm WARN mobx-wiretap@0.12.0 requires a peer of mobx@^3.3.0 but none is installed. You must install peer dependencies yourself.
npm WARN mobx-wiretap@0.12.0 requires a peer of mobx-state-tree@^1.0.1 but none is installed. You must install peer dependencies yourself.

audited 1806 packages in 7.852s

40 packages are looking for funding
  run 'npm fund' for details

found 95 vulnerabilities (28 low, 35 moderate, 32 high)
  run 'npm audit fix' to fix them, or 'npm audit' for details
[0K
[0K$ sh deploy-gh-pages.sh
Cloning
Cloning into 'gh-pages'...
building

> amis@1.1.3 build-schemas /home/travis/build/baidu/amis
> ts-node -O '{"target":"es6"}' scripts/build-schemas.ts


 [36m[INFO][39m Currently running fis3 (/home/travis/build/baidu/amis/node_modules/fis3)
[33m[1m
 δ [22m[39m[1m[32m2ms[39m[22m
[1m[32m
 Ω [39m[22m.[33m[1m.[22m[39m......[33m[1m.[22m[39m[33m[1m.[22m[39m.[33m[1m.[22m[39m.[33m[1m.[22m[39m.[33m[1m.[22m[39m....................[90m.[39m.......................[33m[1m.[22m[39m...............................[33m[1m.[22m[39m...............................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................[33m[1m.[22m[39m[33m[1m.[22m[39m........................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................[33m[1m.[22m[39m............................................[33m[1m.[22m[39m..................................................................................................................................................................................................................................................................................................................................................................................................................................................................................[33m[1m.[22m[39m...............[33m[1m.[22m[39m..........................................................................................................................................................................................................................................................................................................................................................................................................................................................................[32m[1m 109.12s[22m[39m

 [36m[INFO][39m Currently running fis3 (/home/travis/build/baidu/amis/node_modules/fis3)
[33m[1m
 δ [22m[39m[1m[32m218ms[39m[22m
[1m[32m
 Ω [39m[22m[33m[1m.[22m[39m[90m.[39m.[33m[1m.[22m[39m[90m.[39m[33m[1m.[22m[39m[90m.[39m.[90m.[39m.[90m.[39m.[90m.[39m.[90m.[39m.[90m.[39m.[90m.[39m..[90m.[39m.[90m.[39m.[90m.[39m.[90m.[39m.[90m.[39m.[90m.[39m.[90m.[39m.[90m.[39m.[90m.[39m.[90m.[39m.[90m.[39m.[90m.[39m.[90m.[39m.[90m.[39m.[90m.[39m.[90m.[39m.[90m.[39m.[90m.[39m.[90m.[39m.[90m.[39m.[90m.[39m.[90m.[39m.[90m.[39m.[90m.[39m.[90m.[39m.[90m.[39m.[90m.[39m.[90m.[39m.[90m.[39m.[90m.[39m.[90m.[39m.[90m.[39m.[90m.[39m.[90m.[39m.[90m.[39m.[90m.[39m.[90m.[39m.[90m.[39m.[90m.[39m.[90m.[39m.[90m.[39m.[90m.[39m.[90m.[39m.[90m.[39m.[90m.[39m.[90m.[39m.[90m.[39m.[90m.[39m.[90m.[39m.[90m.[39m.[90m.[39m.[90m.[39m.[90m.[39m.[90m.[39m.[90m.[39m.[90m.[39m.[90m.[39m.[90m.[39m.[90m.[39m.[90m.[39m.[90m.[39m.[90m.[39m.[90m.[39m.[90m.[39m.[90m.[39m.[90m.[39m.[90m.[39m.[90m.[39m.[90m.[39m.[90m.[39m.[90m.[39m.[90m.[39m.[90m.[39m.[90m.[39m.[90m.[39m.[90m.[39m.[90m.[39m.[90m.[39m.[90m.[39m.[90m.[39m.[90m.[39m.[90m.[39m.[90m.[39m.[90m.[39m.[90m.[39m.[90m.[39m.......................................................[90m.[39m.[90m.[39m.[90m.[39m.[90m.[39m.[90m.[39m.[90m.[39m.[90m.[39m.[90m.[39m.[90m.[39m.[90m.[39m.[90m.[39m.[90m.[39m.[90m.[39m.[90m.[39m.[90m.[39m.[90m.[39m.[90m.[39m.[90m.[39m.[90m.[39m.[90m.[39m.[90m.[39m.[90m.[39m.[90m.[39m.[90m.[39m.[90m.[39m.[90m.[39m.[90m.[39m.[90m.[39m.[90m.[39m.[90m.[39m.[90m.[39m.[90m.[39m.[90m.[39m.[90m.[39m.[90m.[39m.[90m.[39m.[90m.[39m.[90m.[39m.[90m.[39m.[90m.[39m.[90m.[39m.[90m.[39m.[90m.[39m.[90m.[39m.[90m.[39m.[90m.[39m.[90m.[39m.[90m.[39m.[90m.[39m.[90m.[39m.[90m.[39m.[90m.[39m.[90m.[39m.[90m.[39m.[90m.[39m.[90m.[39m.[90m.[39m.[90m.[39m.[90m.[39m.[90m.[39m.[90m.[39m.[90m.[39m.[90m.[39m.[90m.[39m.[90m.[39m.[90m.[39m.[90m.[39m.[90m.[39m.[90m.[39m.[90m.[39m.[90m.[39m.[90m.[39m.[90m.[39m.[90m.[39m.[90m.[39m.[90m.[39m.[90m.[39m.[90m.[39m.[90m.[39m.[90m.[39m.[90m.[39m.[90m.[39m.[90m.[39m.[90m.[39m.[90m.[39m.[90m.[39m.[90m.[39m.[90m.[39m.[90m.[39m.[90m.[39m.[90m.[39m.[90m.[39m.[90m.[39m.[90m.[39m.[90m.[39m.[90m.[39m.[90m.[39m.[90m.[39m.[90m.[39m.[90m.[39m.[90m.[39m.[90m.[39m.[90m.[39m..[90m.[39m.[90m.[39m.[90m.[39m.[90m.[39m.[90m.[39m.[90m.[39m.[90m.[39m.[90m.[39m.[90m.[39m.[90m.[39m.[90m.[39m.[90m.[39m.[90m.[39m.[90m.[39m.[90m.[39m.[90m.[39m.[90m.[39m.[90m.[39m.[90m.[39m.[90m.[39m.[90m.[39m.[90m.[39m.[90m.[39m.[90m.[39m.[90m.[39m.[90m.[39m.[90m.[39m.[90m.[39m.[90m.[39m.[90m.[39m.[90m.[39m.[90m.[39m.[90m.[39m.[90m.[39m.[90m.[39m.[90m.[39m.[90m.[39m.[90m.[39m.[90m.[39m.[90m.[39m.[90m.[39m.[90m.[39m.[90m.[39m.[90m.[39m.[90m.[39m.[90m.[39m.[90m.[39m.[90m.[39m.[90m.[39m.[90m.[39m.[90m.[39m.[90m.[39m.[90m.[39m.[90m.[39m.[90m.[39m.[90m.[39m.[90m.[39m.[90m.[39m.[90m.[39m.[90m.[39m.[90m.[39m.[90m.[39m.[90m.[39m.[90m.[39m.[90m.[39m.[90m.[39m.[90m.[39m.[90m.[39m.[90m.[39m.[90m.[39m.[90m.[39m[32m[1m 22.09s[22m[39m

 [36m[INFO][39m Currently running fis3 (/home/travis/build/baidu/amis/node_modules/fis3)
[33m[1m
 δ [22m[39m[1m[32m34ms[39m[22m
[1m[32m
 Ω [39m[22m...[90m.[39m..[33m[1m.[22m[39m...[90m.[39m...................[90m.[39m.....[33m[1m.[22m[39m.....[90m.[39m..........................[33m[1m.[22m[39m....................................................................................................................................................................................................................................................................................................................................................................[90m.[39m...................................................................[33m[1m.[22m[39m[90m.[39m[33m[1m.[22m[39m[90m.[39m..............................................................................................................................................................................................................................................................................................................................................................................................................[90m.[39m.[90m.[39m...........................................[90m.[39m............[90m.[39m...[33m[1m.[22m[39m..................................................................................................................................................................................................................................................................................................................................................................................................................................................................[90m.[39m.....[33m[1m.[22m[39m...............[33m[1m.[22m[39m...........[90m.[39m.[90m.[39m.[90m.[39m..............................................[90m.[39m.[90m.[39m...........................................................................................................................................................................................................................[90m.[39m.[90m.[39m.[90m.[39m.[90m.[39m.[90m.[39m.[90m.[39m.[90m.[39m.[90m.[39m.[90m.[39m...................................................................................................................................[90m.[39m.[90m.[39m.[90m.[39m.[90m.[39m.[90m.[39m.[90m.[39m.[90m.[39m................................................................................................................................[32m[1m 89.56s[22m[39m

> amis@1.1.3 build-schemas /home/travis/build/baidu/amis
> ts-node -O '{"target":"es6"}' scripts/build-schemas.ts

sdk/
sdk/sdk.css
sdk/charts.js
sdk/dark-ie11.css
sdk/antd-ie11.css
sdk/dark.css
sdk/papaparse.js
sdk/thirds/
sdk/thirds/flv.js/
sdk/thirds/flv.js/flv.js
sdk/thirds/font-awesome/
sdk/thirds/font-awesome/fonts/
sdk/thirds/font-awesome/fonts/fontawesome-webfont.woff
sdk/thirds/font-awesome/fonts/fontawesome-webfont.svg
sdk/thirds/font-awesome/fonts/fontawesome-webfont.eot
sdk/thirds/font-awesome/fonts/fontawesome-webfont.ttf
sdk/thirds/font-awesome/fonts/fontawesome-webfont.woff2
sdk/thirds/bootstrap/
sdk/thirds/bootstrap/fonts/
sdk/thirds/bootstrap/fonts/glyphicons-halflings-regular.eot
sdk/thirds/bootstrap/fonts/glyphicons-halflings-regular.svg
sdk/thirds/bootstrap/fonts/glyphicons-halflings-regular.woff2
sdk/thirds/bootstrap/fonts/glyphicons-halflings-regular.woff
sdk/thirds/bootstrap/fonts/glyphicons-halflings-regular.ttf
sdk/thirds/hls.js/
sdk/thirds/hls.js/hls.js
sdk/thirds/monaco-editor/
sdk/thirds/monaco-editor/min/
sdk/thirds/monaco-editor/min/vs/
sdk/thirds/monaco-editor/min/vs/base/
sdk/thirds/monaco-editor/min/vs/base/worker/
sdk/thirds/monaco-editor/min/vs/base/worker/workerMain.js
sdk/thirds/monaco-editor/min/vs/base/browser/
sdk/thirds/monaco-editor/min/vs/base/browser/ui/
sdk/thirds/monaco-editor/min/vs/base/browser/ui/codicons/
sdk/thirds/monaco-editor/min/vs/base/browser/ui/codicons/codicon/
sdk/thirds/monaco-editor/min/vs/base/browser/ui/codicons/codicon/codicon.ttf
sdk/thirds/monaco-editor/min/vs/loader.js
sdk/thirds/monaco-editor/min/vs/language/
sdk/thirds/monaco-editor/min/vs/language/html/
sdk/thirds/monaco-editor/min/vs/language/html/htmlMode.js
sdk/thirds/monaco-editor/min/vs/language/html/htmlWorker.js
sdk/thirds/monaco-editor/min/vs/language/typescript/
sdk/thirds/monaco-editor/min/vs/language/typescript/tsMode.js
sdk/thirds/monaco-editor/min/vs/language/typescript/tsWorker.js
sdk/thirds/monaco-editor/min/vs/language/css/
sdk/thirds/monaco-editor/min/vs/language/css/cssWorker.js
sdk/thirds/monaco-editor/min/vs/language/css/cssMode.js
sdk/thirds/monaco-editor/min/vs/language/json/
sdk/thirds/monaco-editor/min/vs/language/json/jsonWorker.js
sdk/thirds/monaco-editor/min/vs/language/json/jsonMode.js
sdk/thirds/monaco-editor/min/vs/editor/
sdk/thirds/monaco-editor/min/vs/editor/editor.main.js
sdk/thirds/monaco-editor/min/vs/editor/editor.main.nls.zh-cn.js
sdk/thirds/monaco-editor/min/vs/editor/editor.main.nls.js
sdk/thirds/monaco-editor/min/vs/editor/editor.main.css
sdk/thirds/monaco-editor/min/vs/basic-languages/
sdk/thirds/monaco-editor/min/vs/basic-languages/ini/
sdk/thirds/monaco-editor/min/vs/basic-languages/ini/ini.js
sdk/thirds/monaco-editor/min/vs/basic-languages/java/
sdk/thirds/monaco-editor/min/vs/basic-languages/java/java.js
sdk/thirds/monaco-editor/min/vs/basic-languages/powershell/
sdk/thirds/monaco-editor/min/vs/basic-languages/powershell/powershell.js
sdk/thirds/monaco-editor/min/vs/basic-languages/javascript/
sdk/thirds/monaco-editor/min/vs/basic-languages/javascript/javascript.js
sdk/thirds/monaco-editor/min/vs/basic-languages/st/
sdk/thirds/monaco-editor/min/vs/basic-languages/st/st.js
sdk/thirds/monaco-editor/min/vs/basic-languages/shell/
sdk/thirds/monaco-editor/min/vs/basic-languages/shell/shell.js
sdk/thirds/monaco-editor/min/vs/basic-languages/fsharp/
sdk/thirds/monaco-editor/min/vs/basic-languages/fsharp/fsharp.js
sdk/thirds/monaco-editor/min/vs/basic-languages/html/
sdk/thirds/monaco-editor/min/vs/basic-languages/html/html.js
sdk/thirds/monaco-editor/min/vs/basic-languages/go/
sdk/thirds/monaco-editor/min/vs/basic-languages/go/go.js
sdk/thirds/monaco-editor/min/vs/basic-languages/typescript/
sdk/thirds/monaco-editor/min/vs/basic-languages/typescript/typescript.js
sdk/thirds/monaco-editor/min/vs/basic-languages/lua/
sdk/thirds/monaco-editor/min/vs/basic-languages/lua/lua.js
sdk/thirds/monaco-editor/min/vs/basic-languages/scheme/
sdk/thirds/monaco-editor/min/vs/basic-languages/scheme/scheme.js
sdk/thirds/monaco-editor/min/vs/basic-languages/msdax/
sdk/thirds/monaco-editor/min/vs/basic-languages/msdax/msdax.js
sdk/thirds/monaco-editor/min/vs/basic-languages/sql/
sdk/thirds/monaco-editor/min/vs/basic-languages/sql/sql.js
sdk/thirds/monaco-editor/min/vs/basic-languages/handlebars/
sdk/thirds/monaco-editor/min/vs/basic-languages/handlebars/handlebars.js
sdk/thirds/monaco-editor/min/vs/basic-languages/css/
sdk/thirds/monaco-editor/min/vs/basic-languages/css/css.js
sdk/thirds/monaco-editor/min/vs/basic-languages/coffee/
sdk/thirds/monaco-editor/min/vs/basic-languages/coffee/coffee.js
sdk/thirds/monaco-editor/min/vs/basic-languages/objective-c/
sdk/thirds/monaco-editor/min/vs/basic-languages/objective-c/objective-c.js
sdk/thirds/monaco-editor/min/vs/basic-languages/bat/
sdk/thirds/monaco-editor/min/vs/basic-languages/bat/bat.js
sdk/thirds/monaco-editor/min/vs/basic-languages/ruby/
sdk/thirds/monaco-editor/min/vs/basic-languages/ruby/ruby.js
sdk/thirds/monaco-editor/min/vs/basic-languages/razor/
sdk/thirds/monaco-editor/min/vs/basic-languages/razor/razor.js
sdk/thirds/monaco-editor/min/vs/basic-languages/swift/
sdk/thirds/monaco-editor/min/vs/basic-languages/swift/swift.js
sdk/thirds/monaco-editor/min/vs/basic-languages/postiats/
sdk/thirds/monaco-editor/min/vs/basic-languages/postiats/postiats.js
sdk/thirds/monaco-editor/min/vs/basic-languages/dockerfile/
sdk/thirds/monaco-editor/min/vs/basic-languages/dockerfile/dockerfile.js
sdk/thirds/monaco-editor/min/vs/basic-languages/r/
sdk/thirds/monaco-editor/min/vs/basic-languages/r/r.js
sdk/thirds/monaco-editor/min/vs/basic-languages/sb/
sdk/thirds/monaco-editor/min/vs/basic-languages/sb/sb.js
sdk/thirds/monaco-editor/min/vs/basic-languages/less/
sdk/thirds/monaco-editor/min/vs/basic-languages/less/less.js
sdk/thirds/monaco-editor/min/vs/basic-languages/markdown/
sdk/thirds/monaco-editor/min/vs/basic-languages/markdown/markdown.js
sdk/thirds/monaco-editor/min/vs/basic-languages/yaml/
sdk/thirds/monaco-editor/min/vs/basic-languages/yaml/yaml.js
sdk/thirds/monaco-editor/min/vs/basic-languages/redshift/
sdk/thirds/monaco-editor/min/vs/basic-languages/redshift/redshift.js
sdk/thirds/monaco-editor/min/vs/basic-languages/xml/
sdk/thirds/monaco-editor/min/vs/basic-languages/xml/xml.js
sdk/thirds/monaco-editor/min/vs/basic-languages/apex/
sdk/thirds/monaco-editor/min/vs/basic-languages/apex/apex.js
sdk/thirds/monaco-editor/min/vs/basic-languages/python/
sdk/thirds/monaco-editor/min/vs/basic-languages/python/python.js
sdk/thirds/monaco-editor/min/vs/basic-languages/vb/
sdk/thirds/monaco-editor/min/vs/basic-languages/vb/vb.js
sdk/thirds/monaco-editor/min/vs/basic-languages/cpp/
sdk/thirds/monaco-editor/min/vs/basic-languages/cpp/cpp.js
sdk/thirds/monaco-editor/min/vs/basic-languages/azcli/
sdk/thirds/monaco-editor/min/vs/basic-languages/azcli/azcli.js
sdk/thirds/monaco-editor/min/vs/basic-languages/pug/
sdk/thirds/monaco-editor/min/vs/basic-languages/pug/pug.js
sdk/thirds/monaco-editor/min/vs/basic-languages/clojure/
sdk/thirds/monaco-editor/min/vs/basic-languages/clojure/clojure.js
sdk/thirds/monaco-editor/min/vs/basic-languages/php/
sdk/thirds/monaco-editor/min/vs/basic-languages/php/php.js
sdk/thirds/monaco-editor/min/vs/basic-languages/csharp/
sdk/thirds/monaco-editor/min/vs/basic-languages/csharp/csharp.js
sdk/thirds/monaco-editor/min/vs/basic-languages/rust/
sdk/thirds/monaco-editor/min/vs/basic-languages/rust/rust.js
sdk/thirds/monaco-editor/min/vs/basic-languages/solidity/
sdk/thirds/monaco-editor/min/vs/basic-languages/solidity/solidity.js
sdk/thirds/monaco-editor/min/vs/basic-languages/scss/
sdk/thirds/monaco-editor/min/vs/basic-languages/scss/scss.js
sdk/thirds/monaco-editor/min/vs/basic-languages/redis/
sdk/thirds/monaco-editor/min/vs/basic-languages/redis/redis.js
sdk/rest.js
sdk/exceljs.js
sdk/cxd.css
sdk/cxd-ie11.css
sdk/rich-text.js
sdk/iconfont.eot
sdk/tinymce.js
sdk/sdk-ie11.css
sdk/renderers/
sdk/renderers/Form/
sdk/renderers/Form/CityDB.js
sdk/antd.css
sdk/helper.css
sdk/sdk.js
sdk/iconfont.css
pushing
[gh-pages 834cc30] 自动同步 gh-pages
 406 files changed, 841 insertions(+), 820 deletions(-)
 rename docs/zh-CN/components/form/{service_d900eca.js => service_6bc3fa7.js} (93%)
 rename docs/zh-CN/components/{service_e4d309a.js => service_182fe19.js} (67%)
 rename pkg/{app_eaa9489.js => app_aba673c.js} (97%)
 rename pkg/examples/{index.html_map_36aa437.js => index.html_map_cc4be94.js} (99%)
 rename pkg/examples/{mobile.html_map_11900af.js => mobile.html_map_e6b3129.js} (99%)
To https://github.com/baidu/amis.git
   a4dc6ff..834cc30  gh-pages -> gh-pages
done
[0K

Done. Your build exited with 0.
`

const http = require('http');

let app = http.createServer((req, res) => {
  res.writeHead(200, {
    'Content-Type': 'text/plain',
    'Access-Control-Allow-Origin': '*'
  });

  let index = 0;
  const logLength = logs.length;
  let timer = setInterval(() => {
    const random = Math.floor(Math.random() * Math.floor(100));
    if (index + random < logLength - 1) {
      res.write(logs.substring(index, index + random));
    } else {
      res.end(logs.substring(index, logLength - 1))
      clearInterval(timer);
    }
    index = index + random;
  }, 100);
});

app.listen(3000, '127.0.0.1');