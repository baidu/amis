#!/bin/bash
set -e

npm run build --workspace=packages/amis

rm -rf npm
mkdir npm

# 如果有问题可以注释掉这两行，不知道为啥会导致 cp -rf 挂掉
# rm -rf packages/amis/node_modules/.bin
# rm -rf packages/amis-ui/node_modules/.bin

cp -rf packages npm
cp package.json npm

# 记录last commit，便于区分内网版本包之间的差异
REVISION=revision.json
npm run revision -- $REVISION

if [ -f "$REVISION" ]; then
  for dir in $(find ./npm/packages -mindepth 1 -maxdepth 1 -type d); do
    [ -d "$dir" ] && cp $REVISION "$dir/$REVISION";
  done;
else
  echo "$REVISION not exists."
fi

cd npm

# package.json 里面把包名称换了
for f in $(find ./packages -name "package.json"); do
  sed -i '' -e 's/\"name\": \"amis/\"name\": \"@fex\/amis/g' $f
  sed -i '' -e 's/\"amis-/\"@fex\/amis-/g' $f
done

# 把代码里面import的部分换成内部包名称
for f in $(find ./packages/*/lib -type f -name "*.[tj]s"); do
  sed -i '' -e "s/from \'amis/from \'@fex\/amis/g" $f
  sed -i '' -e "s/import(\'amis/import(\'@fex\/amis/g" $f
  sed -i '' -e "s/require(\'amis/require(\'@fex\/amis/g" $f
  sed -i '' -e "s/require(\[\'amis/require(\[\'@fex\/amis/g" $f
done

for f in $(find ./packages/*/esm -type f -name "*.[tj]s"); do
  sed -i '' -e "s/from \'amis/from \'@fex\/amis/g" $f
  sed -i '' -e "s/import(\'amis/import(\'@fex\/amis/g" $f
  sed -i '' -e "s/require(\'amis/require(\'@fex\/amis/g" $f
  sed -i '' -e "s/require(\[\'amis/require(\[\'@fex\/amis/g" $f
done

npm publish --workspaces --registry=http://registry.npm.baidu-int.com --ignore-scripts

cd ..
rm -rf npm
