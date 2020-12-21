#!/bin/bash
set -e

rm -rf lib
rm -rf output

fis3 release publish -c
rm -rf lib/node_modules

# 生成 sdk
rm -rf sdk && fis3 release publish-sdk -c

# 生成去掉变量的 css
./node_modules/.bin/postcss sdk/sdk.css > sdk/sdk-ie11.css

# 生成 .d.ts 文件
./node_modules/.bin/tsc --allowJs --declaration

cd output

for f in $(find . -name "*.d.ts"); do
    mkdir -p ../lib/$(dirname $f) && mv $f ../lib/$(dirname $f)
done

cd ..

rm -rf output

npm run build-schemas
