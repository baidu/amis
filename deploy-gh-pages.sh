#!/bin/bash
set -e

rm -rf gh-pages

echo "Cloning"
git clone -b gh-pages --depth=1 https://$GH_TOKEN@github.com/baidu/amis.git gh-pages
rm -rf gh-pages/*

echo "building"
node ./scripts/generate-search-data.js

npm run build-schemas

fis3 release gh-pages -c

# 拷贝一份兼容之前的访问路径
cp -r gh-pages/zh-CN/docs/* gh-pages/docs/

cp ./schema.json ./gh-pages

# 不走 cdn 了
# node ./scripts/upload2cdn.js $1 $2

echo "pushing"

cd gh-pages

git config user.email "liaoxuezhi@icloud.com"
git config user.name "liaoxuezhi"

git add . -A
git commit --allow-empty -m "自动同步 gh-pages"

git push --tags https://$GH_TOKEN@github.com/baidu/amis.git gh-pages

echo "done"
