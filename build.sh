#!/bin/bash
set -e

export NODE_ENV=production

rm -rf lib
rm -rf output

./node_modules/.bin/fis3 release publish -c
rm -rf lib/node_modules

# 生成 sdk
rm -rf sdk && ./node_modules/.bin/fis3 release publish-sdk -c

cp -r node_modules/monaco-editor/min/vs/base/browser sdk/thirds/monaco-editor/min/vs/base

# 生成去掉变量的 css
./node_modules/.bin/postcss sdk/sdk.css >sdk/sdk-ie11.css
./node_modules/.bin/postcss sdk/ang.css >sdk/ang-ie11.css
./node_modules/.bin/postcss sdk/dark.css >sdk/dark-ie11.css
./node_modules/.bin/postcss sdk/antd.css >sdk/antd-ie11.css

# 默认变成 cxd 了，所以要拷贝一份兼容之前的引用
cp sdk/sdk.css sdk/cxd.css
cp sdk/sdk-ie11.css sdk/cxd-ie11.css

cp ./lib/helper.css sdk/helper.css
cp ./lib/helper.css.map sdk/helper.css.map
cp examples/static/iconfont.css sdk/
cp examples/static/iconfont.eot sdk/

# 生成 .d.ts 文件
./node_modules/.bin/tsc --declaration --emitDeclarationOnly --outDir ./lib --project ./tsconfig-for-declaration.json

npm run build-schemas
