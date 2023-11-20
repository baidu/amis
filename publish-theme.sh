#!/bin/bash
set -e

source ./scripts/utils.sh

echo "请选择发布版本的类型："

options=("latest" "beta" "alpha" "custom")

select_option "${options[@]}"

if [ "$selected_option" == "custom" ]; then
  read -p "请自定义输入版本: " version
  npm_get_tag $version
  tag=$npm_tag
else
  tag=$selected_option
  current_version=`npm show amis-theme-editor-helper@${tag} version`
  if [ -z "${current_version}" ]; then
    echo "没有找到的${tag}版本"
    read -p "请自定义输入版本: " version
    npm_get_tag $version
    tag=$npm_tag
  else
    echo "当前版本：${current_version}"
    npm_version $current_version $tag
    version=$new_version
    read -p "确认更新y/n: " confirm
    if [ "$confirm" != "y" ]; then
      read -p "请自定义输入版本: " version
      npm_get_tag $version
      tag=$npm_tag
    fi
  fi
fi

sed -i '' -e 's/\"version\": \".*\"/\"version\": \"'${version}'\"/g' ./packages/amis-theme-editor-helper/package.json

npm run build --workspace=amis-theme-editor-helper

rm -rf theme-npm

mkdir -p theme-npm/amis-theme-editor-helper

cp -rf packages/amis-theme-editor-helper/lib theme-npm/amis-theme-editor-helper
cp -rf packages/amis-theme-editor-helper/esm theme-npm/amis-theme-editor-helper
cp packages/amis-theme-editor-helper/package.json theme-npm/amis-theme-editor-helper

cd theme-npm/amis-theme-editor-helper
npm publish --tag=$tag
