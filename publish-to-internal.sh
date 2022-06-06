#!/bin/bash
set -e

npm run build --workspaces

rm -rf npm
mkdir npm

cp -rf packages npm
cp package.json npm

cd npm

# package.json 里面把包名称换了
for f in $(find ./packages -name "package.json");
do
  sed -i '' -e 's/\"name\": \"amis/\"name\": \"@fex\/amis/g' $f
done

# 把代码里面import的部分换成内部包名称
for f in $(find ./packages/*/lib -type f -name "*.js");
do
  sed -i '' -e "s/\'amis/\'@fex\/amis/g" $f
done

npm publish --workspaces --registry=http://registry.npm.baidu-int.com --ignore-scripts

cd ..
# rm -rf npm
