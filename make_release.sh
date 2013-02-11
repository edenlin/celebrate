cp -r beta release
git add .
git commit -am 'release update'
git checkout gh-pages
git merge master
git checkout master
git push
