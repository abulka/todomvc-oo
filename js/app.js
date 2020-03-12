// Includes app_oo.js which also contains .controllers

(function (window) {
	'use strict';

	// Your starting point. Enjoy the ride!

	let app = new App()

	// Add a couple of todo items
	app.add("title1", "id1", false)
	app.add("title2", "id2", false)

	// Wire the controllers
	app.controller_app = new ControllerApp(app, '.new-todo')  // gui is the input el with this class
	app.controller_footer = new ControllerFooter(app, 'footer')  // gui is footer el
	app.controller_debug = new ControllerDebugDumpModels(app)
	for (let todo_item of app.todos)
		app.visualise_todoitem(todo_item)

	// initial render
	app.dirty_all()
	console.log("--------------- init complete ----------")

})(window);
