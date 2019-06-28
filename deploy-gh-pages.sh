#!/bin/bash
set -e

if [ -z "$(git status --porcelain)" ]; then 
  # Working directory clean
  echo "Working directory clean"
else 
  # Uncommitted changes
  read -p "You got uncommitted changes, press y to continue? " -n 1 -r
  echo    # (optional) move to a new line
  if [[ ! $REPLY =~ ^[Yy]$ ]]
  then
    echo "Skiped!"
    [[ "$0" = "$BASH_SOURCE" ]] && exit 1 || return 1 # handle exits from shell or function but don't exit interactive shell
  fi
fi

rm -rf gh-pages

fis3 release gh-pages -c

node ./build/upload2cdn.js $1

git add gh-pages -f

git commit -m "更新 gh-pages"

git push

git subtree push --prefix gh-pages origin gh-pages

git commit -m 'rebuild pages' --allow-empty

git push origin

echo "done"