# DEST=~/Devel/abulka.github.io/todomvc-oo
DEST=docs

cp -v index.html $DEST

DIR=js
cp -v js/app.js js/controllers.js js/model.js \
js/observer_events.js js/util.js \
$DEST/$DIR

DIR=node_modules/todomvc-common
mkdir -p $DEST/$DIR && \
cp -v $DIR/base.css $_

DIR=node_modules/todomvc-app-css
mkdir -p $DEST/$DIR && \
cp -v $DIR/index.css $_

DIR=node_modules/todomvc-common
mkdir -p $DEST/$DIR && \
cp -v $DIR/base.js $_

DIR=node_modules/jquery/dist
mkdir -p $DEST/$DIR && \
cp -v $DIR/jquery.js $_

# DIR=node_modules/jquery/dist
# mkdir -p $DEST/$DIR && \
# cp -v $DIR/jquery.min.map $_

DIR=node_modules/handlebars/dist
mkdir -p $DEST/$DIR && \
cp -v $DIR/handlebars.js $_

echo
echo "Now git commit, git push 
Then access with
https://abulka.github.io/todomvc-oo/index.html 
"
