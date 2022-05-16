#!/bin/bash
set -e

export NODE_ENV=production

rm -rf lib
rm -rf output

echo "===fis release==="
./node_modules/.bin/fis3 release publish -c
rm -rf lib/node_modules

# 生成 sdk
echo "===fis sdk==="
rm -rf sdk && ./node_modules/.bin/fis3 release publish-sdk -c

cp -r node_modules/monaco-editor/min/vs/base/browser sdk/thirds/monaco-editor/min/vs/base

echo "===postcss ie11==="
# 生成去掉变量的 css，动画设置为零
echo ':root { --animation-duration: 0s;}' >>sdk/ie11-patch.css
cat lib/themes/ang.css | ./node_modules/.bin/postcss >lib/themes/ang-ie11.css
cat lib/themes/dark.css | ./node_modules/.bin/postcss >lib/themes/dark-ie11.css
cat lib/themes/antd.css | ./node_modules/.bin/postcss >lib/themes/antd-ie11.css
cat lib/themes/cxd.css | ./node_modules/.bin/postcss >lib/themes/cxd-ie11.css
cp lib/themes/cxd-ie11.css lib/themes/default-ie11.css

cat sdk/sdk.css sdk/ie11-patch.css | ./node_modules/.bin/postcss >sdk/sdk-ie11.css
cat sdk/ang.css sdk/ie11-patch.css | ./node_modules/.bin/postcss >sdk/ang-ie11.css
cat sdk/dark.css sdk/ie11-patch.css | ./node_modules/.bin/postcss >sdk/dark-ie11.css
cat sdk/antd.css sdk/ie11-patch.css | ./node_modules/.bin/postcss >sdk/antd-ie11.css

# 默认变成 cxd 了，所以要拷贝一份兼容之前的引用
cp sdk/sdk.css sdk/cxd.css
cp sdk/sdk-ie11.css sdk/cxd-ie11.css

cp ./lib/helper.css sdk/helper.css
cp ./lib/helper.css.map sdk/helper.css.map
cp examples/static/iconfont.* sdk/

mkdir sdk/locale

echo "===sdk locale==="
node scripts/generate-sdk-locale.js src/locale/de-DE.ts >sdk/locale/de-DE.js

# 生成 .d.ts 文件
echo "===generate .d.ts==="
./node_modules/.bin/tsc --declaration --emitDeclarationOnly --outDir ./lib --project ./tsconfig-for-declaration.json

echo "===build-schemas==="
npm run build-schemas
