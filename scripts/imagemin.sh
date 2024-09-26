#!/bin/bash

for f in $(find . -type d \( -path ./node_modules -o -path ./dist -o -path ./esm -o -path ./lib -o -path ./packages/amis/sdk \) -prune -type f -o -name "*.svg"); do
  #sed -i '' -e "s/@fex\///g" $f
  echo "imagemin $f"
  echo $(imagemin $f) >$f

  # git checkout $f
  # imagemin $f > $f
done
