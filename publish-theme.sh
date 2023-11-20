#!/bin/bash
set -e
source ./scripts/utils.sh

echo "请选择发布内网or外网："
publish_types=("internal" "external")

select_option "${publish_types[@]}"

publish_type=$selected_option

echo "请选择发布版本的类型："

options=("latest" "beta" "alpha" "custom")

select_option "${options[@]}"

if [ "$selected_option" == "custom" ]; then
  read -p "请自定义输入版本: " version
  npm_get_tag $version
  tag=$npm_tag
else
  tag=$selected_option
  if [ "$publish_type" == "internal" ]; then
    current_version=`npm show @fex/amis-theme-editor-helper@${tag} version --registry=http://registry.npm.baidu-int.com`
  else
    current_version=`npm show amis-theme-editor-helper@${tag} version`
  fi
  if [ -z "${current_version}" ]; then
    echo "没有找到的${tag}版本"
    read -p "请自定义输入版本: " version
    npm_get_tag $version
    tag=$npm_tag
  else
    echo "当前版本：${current_version}"
    npm_version $current_version $tag
    version=$new_version
    read -p "确认更新y or n: " confirm
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

if [ "$publish_type" == "internal" ]; then
  # package.json 里面把包名称换了
  for f in $(find ./ -name "package.json"); do
    sed -i '' -e 's/\"name\": \"amis/\"name\": \"@fex\/amis/g' $f
    sed -i '' -e 's/\"amis-/\"@fex\/amis-/g' $f
    sed -i '' -e 's/\"amis\":/\"@fex\/amis\":/g' $f
    sed -i '' -e 's/\"i18n-runtime\":/\"@fex\/i18n-runtime\":/g' $f
  done

  # 把代码里面import的部分换成内部包名称
  for f in $(find ./ -type f -name "*.[tj]s"); do
    # 正则那个 | 用不了，还不知道为何
    #sed -i '' -e "s#\('|\"\)\(amis|amis-formula|amis-core|amis-ui|amis-editor|amis-editor-core\)\('|\"|\/\)#\1@fex\/\2\3#g" $f

    sed -i '' -e "s#'\(amis\)\(['\"/]\)#'@fex\/\1\2#g" $f
    sed -i '' -e "s#\"\(amis\)\(['\"/]\)#\"@fex\/\1\2#g" $f

    sed -i '' -e "s#'\(amis-core\)\(['\"/]\)#'@fex\/\1\2#g" $f
    sed -i '' -e "s#\"\(amis-core\)\(['\"/]\)#\"@fex\/\1\2#g" $f

    sed -i '' -e "s#'\(amis-ui\)\(['\"/]\)#'@fex\/\1\2#g" $f
    sed -i '' -e "s#\"\(amis-ui\)\(['\"/]\)#\"@fex\/\1\2#g" $f

    sed -i '' -e "s#'\(i18n-runtime\)\(['\"/]\)#'@fex\/\1\2#g" $f
    sed -i '' -e "s#\"\(i18n-runtime\)\(['\"/]\)#\"@fex\/\1\2#g" $f
  done

  npm publish --tag=$tag --registry=http://registry.npm.baidu-int.com
else
  npm publish --tag=$tag
fi


