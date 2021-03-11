#!/bin/bash
set -e

rm -rf lib
rm -rf output

./node_modules/.bin/fis3 release publish -c
rm -rf lib/node_modules

# 生成 sdk
rm -rf sdk && ./node_modules/.bin/fis3 release publish-sdk -c

cp -r node_modules/monaco-editor/min/vs/base/browser sdk/thirds/monaco-editor/min/vs/base

# 生成去掉变量的 css
./node_modules/.bin/postcss sdk/sdk.css >sdk/sdk-ie11.css
./node_modules/.bin/postcss sdk/cxd.css >sdk/cxd-ie11.css
./node_modules/.bin/postcss sdk/dark.css >sdk/dark-ie11.css
./node_modules/.bin/postcss sdk/antd.css >sdk/antd-ie11.css

cp ./lib/helper.css sdk/helper.css
cp examples/static/iconfont.css sdk/
cp examples/static/iconfont.eot sdk/

# 生成 .d.ts 文件
./node_modules/.bin/tsc --allowJs --declaration

cd output

for f in $(find . -name "*.d.ts"); do
    mkdir -p ../lib/$(dirname $f) && mv $f ../lib/$(dirname $f)
done

cd ..

rm -rf output

npm run build-schemas
