#!/usr/bin/env sh

rm -rf dist

# abort on errors
set -e

# build
pnpm run build

# navigate into the build output directory
cd dist

cp index.html 404.html

# place .nojekyll to bypass Jekyll processing
echo > .nojekyll

# if you are deploying to a custom domain
# echo 'www.example.com' > CNAME

git init
git checkout -B master
git add -A
git commit -m 'deploy'

# if you are deploying to https://<USERNAME>.github.io
# git push -f git@github.com:<USERNAME>/<USERNAME>.github.io.git main

# if you are deploying to https://<USERNAME>.github.io/<REPO>
git push -f https://github.com/Minato1123/taiwan-familymart-map.git master:gh-pages

cd -