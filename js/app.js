// Index.html includes application.js, model.js and controllers.js so they are available here

(function (window) {
	'use strict';

	/*  
		Start here!
		
		Create an instance of 'Application' passing in a config object.

		Controller classes and this config of callbacks are the only things
	 	that know about the UI.
	*/

	let config = {
		// Callback to create the todo item controllers - are added as needed

		cb_todo: function (app, todo) {
			new ControllerTodoItem(
				app,
				todo,
				{ $todolist: $('ul.todo-list') }
			)
		},

		// Callbacks to create the permanent controllers

		cb_dump: function (app) {
			new ControllerDebugDumpModels(
				app,
				{
					$toggle_checkbox: $('input[name="debug"]'),
					pre_output: document.querySelector('pre.debug')
				}
			)
		},
		cb_header: function (app) {
			new ControllerHeader(
				app,
				{
					$input: $('.new-todo'),
					$toggle_all: $('.toggle-all')
				}
			)
		},
		cb_footer: function (app) {
			new ControllerFooter(
				app,
				{
					$footer: $('footer'),
					$footer_interactive_area: $('.footer')
				})
		}
	}

	new Application(config)

})(window);
