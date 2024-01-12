#!/bin/bash

publish_type=$1
version=$2
tag=$3

npm run version -- $version --no-git-tag-version --force-publish --yes

rm -rf npm

npm run build --workspace=amis-editor --workspace=amis-editor-core --workspace=amis-formula --workspace=amis-core --workspace=amis-ui --workspace=amis

mkdir -p npm/packages

cp -r packages/{amis-formula,amis-core,amis-ui,amis,amis-editor,amis-editor-core} npm/packages
cp package.json npm

# # 记录last commit，便于区分内网版本包之间的差异
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

if [ "$publish_type" == "internal" ]; then

  echo "处理文件内容中……"

  # package.json 里面把包名称换了
  for f in $(find ./packages -name "package.json"); do
    sed -i '' -e 's/\"name\": \"amis/\"name\": \"@fex\/amis/g' $f
    sed -i '' -e 's/\"amis-/\"@fex\/amis-/g' $f
    sed -i '' -e 's/\"amis\":/\"@fex\/amis\":/g' $f
    sed -i '' -e 's/\"i18n-runtime\":/\"@fex\/i18n-runtime\":/g' $f
  done

  for f in $(find ./packages/*/esm ./packages/*/lib -type f -name "*.[tj]s"); do
    echo $f
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

  echo "正在发版……"

  npm publish --tag=$tag --workspaces --registry=http://registry.npm.baidu-int.com --ignore-scripts
else
  echo "正在发版……"
  npm publish --tag=$tag --workspaces --ignore-scripts
fi

cd ..
rm -rf npm
