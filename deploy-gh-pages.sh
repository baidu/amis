#!/bin/bash
set -e


echo "building"
node ./scripts/generate-search-data.js

./node_modules/.bin/fis3 release gh-pages -c

# 拷贝一份兼容之前的访问路径
cp -r gh-pages/zh-CN/docs/* gh-pages/docs/

cp ./packages/amis/schema.json ./gh-pages

cp -r mock gh-pages/

tar -zcvf sdk.tar.gz packages/amis/sdk

mv sdk.tar.gz gh-pages/

# 加这个 github page 就不会忽略下划线开头的文件
touch gh-pages/.nojekyll
