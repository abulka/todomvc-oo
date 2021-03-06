# DEST=~/Devel/abulka.github.io/todomvc-oo
DEST=docs

cp -v index.html $DEST

DIR=images
cp -v \
out/docs_other/plantuml/mvca-architecture-v2.svg \
out/copied-from-gituml/todomvc-oo-event-flow-gituml-134.svg \
$DEST/$DIR

DIR=js
cp -v js/app.js js/controllers.js js/model.js \
js/observer_events.js js/util.js js/application.js \
$DEST/$DIR

DIR=css
mkdir -p $DEST/$DIR && \
cp -v $DIR/app.css $_

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
