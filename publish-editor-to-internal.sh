###
 # @description 文件
 # @return {*}
###
#!/bin/bash

editorLatestVersion=`npm info @fex/amis-editor --registry=http://registry.npm.baidu-int.com | grep "latest:"`

editroCoreLatestVersion=`npm info @fex/amis-editor-core --registry=http://registry.npm.baidu-int.com | grep "latest:"`

echo "amis-editor最新版本：${editorLatestVersion}"
echo "amis-editor-core最新版本：${editroCoreLatestVersion}"


read -p  "请输入amis-editor版本: " version1

read -p "请输入amis-editor-core版本: " version2

sed -i '' -e 's/\"version\": \".*\"/\"version\": \"'${version1}'\"/g' ./packages/amis-editor/package.json
sed -i '' -e 's/\"version\": \".*\"/\"version\": \"'${version2}'\"/g' ./packages/amis-editor-core/package.json
set -e

rm -rf npm

npm run build --workspace=amis-editor --workspace=amis-editor-core

mkdir -p npm/amis-editor
mkdir -p npm/amis-editor-core

cp -rf packages/amis-editor/lib npm/amis-editor
cp -rf packages/amis-editor/esm npm/amis-editor
cp packages/amis-editor/package.json npm/amis-editor

cp -rf packages/amis-editor-core/lib npm/amis-editor-core
cp -rf packages/amis-editor-core/esm npm/amis-editor-core
cp -rf packages/amis-editor-core/static npm/amis-editor-core
cp packages/amis-editor-core/package.json npm/amis-editor-core
cp packages/amis-editor-core/src/locale/* npm/amis-editor-core/lib/locale

cd npm

funTransContent(){

  # 把代码里面import的部分换成内部包名称
  for f in $(find $1 -type f -name "*.[tj]s"); do
    # 正则那个 | 用不了，还不知道为何
    #sed -i '' -e "s#\('|\"\)\(amis|amis-formula|amis-core|amis-ui|amis-editor|amis-editor-core\)\('|\"|\/\)#\1@fex\/\2\3#g" $f

    sed -i '' -e "s#'\(amis\)\(['\"/]\)#'@fex\/\1\2#g" $f
    sed -i '' -e "s#\"\(amis\)\(['\"/]\)#\"@fex\/\1\2#g" $f

    sed -i '' -e "s#'\(amis-formula\)\(['\"/]\)#'@fex\/\1\2#g" $f
    sed -i '' -e "s#\"\(amis-formula\)\(['\"/]\)#\"@fex\/\1\2#g" $f

    sed -i '' -e "s#'\(amis-core\)\(['\"/]\)#'@fex\/\1\2#g" $f
    sed -i '' -e "s#\"\(amis-core\)\(['\"/]\)#\"@fex\/\1\2#g" $f

    sed -i '' -e "s#'\(amis-ui\)\(['\"/]\)#'@fex\/\1\2#g" $f
    sed -i '' -e "s#\"\(amis-ui\)\(['\"/]\)#\"@fex\/\1\2#g" $f

    sed -i '' -e "s#'\(amis-editor\)\(['\"/]\)#'@fex\/\1\2#g" $f
    sed -i '' -e "s#\"\(amis-editor\)\(['\"/]\)#\"@fex\/\1\2#g" $f

    sed -i '' -e "s#'\(amis-editor-core\)\(['\"/]\)#'@fex\/\1\2#g" $f
    sed -i '' -e "s#\"\(amis-editor-core\)\(['\"/]\)#\"@fex\/\1\2#g" $f

    sed -i '' -e "s#'\(amis-editor-comp\)\(['\"/]\)#'@fex\/\1\2#g" $f
    sed -i '' -e "s#\"\(amis-editor-comp\)\(['\"/]\)#\"@fex\/\1\2#g" $f

    sed -i '' -e "s#'\(amis-theme-editor\)\(['\"/]\)#'@fex\/\1\2#g" $f
    sed -i '' -e "s#\"\(amis-theme-editor\)\(['\"/]\)#\"@fex\/\1\2#g" $f

    sed -i '' -e "s#'\(amis-postcss\)\(['\"/]\)#'@fex\/\1\2#g" $f
    sed -i '' -e "s#\"\(amis-postcss\)\(['\"/]\)#\"@fex\/\1\2#g" $f

    sed -i '' -e "s#'\(amis-theme-editor-helper\)\(['\"/]\)#'@fex\/\1\2#g" $f
    sed -i '' -e "s#\"\(amis-theme-editor-helper\)\(['\"/]\)#\"@fex\/\1\2#g" $f

    sed -i '' -e "s#'\(i18n-runtime\)\(['\"/]\)#'@fex\/\1\2#g" $f
    sed -i '' -e "s#\"\(i18n-runtime\)\(['\"/]\)#\"@fex\/\1\2#g" $f
  done
}

echo "处理 amis-editor 包文件内容中……"

funTransContent './amis-editor'

echo "处理 amis-editor-core 包文件内容中……"

funTransContent './amis-editor-core'

echo '处理pacakge.json文件内容'

# package.json 里面把包名称换了
for f in $(find ./ -name "package.json"); do
  sed -i '' -e 's/\"name\": \"amis/\"name\": \"@fex\/amis/g' $f
  sed -i '' -e 's/\"amis-/\"@fex\/amis-/g' $f
  sed -i '' -e 's/\"amis\":/\"@fex\/amis\":/g' $f
  sed -i '' -e 's/\"i18n-runtime\":/\"@fex\/i18n-runtime\":/g' $f
done

echo "正在发版……"

cd ./amis-editor-core
npm publish --registry=http://registry.npm.baidu-int.com
cd ../amis-editor
npm publish --registry=http://registry.npm.baidu-int.com
