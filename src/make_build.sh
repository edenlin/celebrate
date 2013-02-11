node ../third_party/r.js -o build.config
cp game.html ../release
cp game-built.js ../release/game.js
cp *.png ../release
rm game-built.js
