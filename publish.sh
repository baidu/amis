#!/bin/bash
set -e

rm -rf npm
mkdir npm

cp -rf lib npm
cp package.json npm
cp schema.json npm
cp -rf scss npm
cp -rf sdk npm
cp .npmignore npm
cp -rf node_modules npm

cd npm

sed -i '' -e 's/\"name\": \"amis\"/\"name\": \"@fex\/amis\"/g' ./package.json

npm publish --registry=http://registry.npm.baidu-int.com

cd ..
# rm -rf npm
