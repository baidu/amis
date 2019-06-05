#!/bin/bash
set -e

if [ -z "$(git status --porcelain)" ]; then 
  # Working directory clean
  echo "Working directory clean"
else 
  # Uncommitted changes
  echo "Skiped: You got uncommitted changes"
  exit
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