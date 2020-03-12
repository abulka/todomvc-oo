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
	for (let todo_item of app.todos)
		app.visualise_todoitem(todo_item)

	// initial render
	app.dirty_all()
	console.log("--------------- init complete ----------")

	// reporting state of the app
	debug_report_app_state(app)
	// now that things are wired up, hook into event notifications to keep official model updated in gui
	// mediator_debug_info = new DebugDumpModels("debug_info")
	const mediator_debug_info = new DebugDumpModels(app)
	document.addEventListener("notify all called", (event) => { mediator_debug_info.notify(event) })

	// // test update an existing item, as an experiment
	// setTimeout(function(){ 
	// 	app.todos[0].title += " updated"  // will auto trigger a notify
	// 	// let data = {id: app.todos[0].id}  // by sending data recipients can filter and be more efficient
	// 	// notify_all("modified todoitem", this, data)
	//  }, 2000);


})(window);
