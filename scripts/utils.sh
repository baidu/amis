#!/bin/bash

render_option() {
  for index in "${!choices[@]}"; do
    if [ $index -eq $1 ]; then
      printf "\033[31m> ${choices[$index]}\033[0m\n"  # 高亮显示选中的选项
    else
      echo "  ${choices[$index]}"
    fi
  done
}

clear_screen() {
  local len=$1
  echo  "\033[${len}A\033[K"
  for ((i=1;i<$len;i++)); do
    echo  "\033[K"
  done
  echo  "\033[$((${len} + 1))A"

}

select_option() {
  choices=("$@")  # 将选项数组声明为全局变量
  local selected=0      # 初始化选择索引
  local choices_lenght=${#choices[@]}  # 获取选项数组长度
  render_option $selected
  while true; do
    read -n1 -s key  # 读取单个按键并保持输入的隐私
    case "$key" in
      A)  # 上箭头
        if [ $selected -gt 0 ]; then
          selected=$((selected - 1))
        else
          selected=$(($choices_lenght - 1))
        fi
        clear_screen $choices_lenght
        render_option $selected
        ;;
      B)  # 下箭头
        if [ $selected -lt $(($choices_lenght - 1)) ]; then
          selected=$((selected + 1))
        else
          selected=0
        fi
        clear_screen $choices_lenght
        render_option $selected
        ;;
      "")  # 回车键
        break
        ;;
    esac
  done

  # 打印最终结果日志
  selected_option="${choices[$selected]}"
}

npm_version() {
  local current_version=$1
  local tag=$2
  IFS='.-' read -r major minor patch pre_release pre_release_version <<< "$current_version"
  if [ $tag = $pre_release ]; then
    ((pre_release_version++))
    new_version="$major.$minor.$patch-$tag.$pre_release_version"
  else
    ((patch++))
    new_version="$major.$minor.$patch"
  fi

  echo "新版本为：$new_version"
}

npm_get_tag() {
  IFS='.-' read -r major minor patch pre_release pre_release_version <<< "$1"
  if [ "$pre_release" ]; then
    npm_tag=$pre_release
  else
    npm_tag="latest"
  fi
  echo "发布tag为: $npm_tag"
}

