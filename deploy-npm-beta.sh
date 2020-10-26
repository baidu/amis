#!/bin/bash
set -e

rm -rf npm

echo "Cloning"
git clone -b npm --depth=1 https://$GH_TOKEN@github.com/baidu/amis.git npm

echo "building"
sh build.sh

cp -rf lib npm
cp package.json npm
cp schema.json npm
cp -rf scss npm
cp -rf examples npm
cp -rf sdk npm

echo "pushing"

cd npm

git config user.email "liaoxuezhi@icloud.com"
git config user.name "liaoxuezhi"

git add .
git commit --allow-empty -m "npm 下一个版本"

git push --tags https://$GH_TOKEN@github.com/baidu/amis.git npm

echo "done"
