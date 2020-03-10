// Includes app_oo.js which also contains .controllers

(function (window) {
	'use strict';

	// Your starting point. Enjoy the ride!

	let app = new App()

	// Add a couple of todo items
	app.add("title1", "id1", false)
	app.add("title2", "id2", false)

	// Wire the controllers
	// build_todo_list_controller(app, '.todo-list')
	for (let todo_item of app.todos)
		visualise_todoitem(todo_item)
	build_create_todoitem_controller(app)

	// initial render
	app.dirty_all()
	console.log("--------------- init complete ----------")




	// test update an existing item, as an experiment
	setTimeout(function(){ 
		app.todos[0].title += " updated"  // will auto trigger a notify
		// let data = {id: app.todos[0].id}  // by sending data recipients can filter and be more efficient
		// notify_all("modified todoitem", this, data)
	 }, 2000);


})(window);
