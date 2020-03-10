// Includes app_oo.js which also contains .controllers

(function (window) {
	'use strict';

	// Your starting point. Enjoy the ride!

	let app = new App()

	// Add a couple of todo items
	app.add("title1", "id1", false)
	app.add("title2", "id2", false)

	// Wire controllers / mediators
	for (let todo_item of app.todos) {
		let controller = new ControllerTodoItem(todo_item, undefined)  // gui is undefined
		controllers.push(controller)

		// Observer Wiring
		document.addEventListener("modified todoitem", (event) => { controller.notify(event) })
	}


	app.dirty_all()
	console.log("--------------- init complete ----------")

	// test update an existing item, as an experiment
	setTimeout(function(){ 
		app.todos[0].title += " updated"  // will auto trigger a notify
		// let data = {id: app.todos[0].id}  // by sending data recipients can filter and be more efficient
		// notify_all("modified todoitem", this, data)
	 }, 2000);

	 let controller_new_input = new ControllerCreateTodoItem(app, '.new-todo')  // gui is the input el
	//  document.addEventListener("creating todoitem", (event) => { controller_new_input.notify(event) })

	 // text input keystrokes that edit the model, go to the individual mediator controllers - note the rhs is a ?
	 $('.new-todo').on('keyup', (event) => { controller_new_input.on_keyup(event) });
	 controllers.push(controller_new_input)

})(window);
