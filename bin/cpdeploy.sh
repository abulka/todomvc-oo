DEST=~/Devel/abulka.github.io/todomvc-oo

cp -v index.html \
$DEST

cp -v js/app.js js/controllers.js js/model.js \
js/observer_events.js js/util.js \
index.html \
$DEST/js

mkdir -p $DEST/node_modules/todomvc-common && \
cp -v node_modules/todomvc-common/base.css $_

mkdir -p $DEST/node_modules/todomvc-app-css && \
cp -v node_modules/todomvc-app-css/index.css $_

mkdir -p $DEST/node_modules/todomvc-common && \
cp -v node_modules/todomvc-common/base.js $_

mkdir -p $DEST/node_modules/jquery/dist && \
cp -v node_modules/jquery/dist/jquery.js $_

mkdir -p $DEST/node_modules/handlebars/dist && \
cp node_modules/handlebars/dist/handlebars.js $_

echo
echo "Now cd into $DEST, git commit, git push 
Then access with
https://abulka.github.io/todomvc-oo/index.html 
"
