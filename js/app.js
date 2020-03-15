// Index.html includes app_model.js and app_controllers.js so they are available here

(function (window) {
	'use strict';

	// Your starting point. Enjoy the ride!

	class App extends Subject {  // knows everything, owns the list of todo models, creates all controllers, with some business logic
		constructor() {
			super()
			this.todos = []  // model
			this.filter = 'all'  // view model, options are: 'all', 'active', 'completed'
			this.footer_controller  // unfortunately with the observer pattern we need this

			// Create the permanent controllers - todo item controllers are added as needed
			new ControllerDebugDumpModels(
				this, 
				{ $toggle_checkbox: $('input[name="debug"]'), 
				pre_output: document.querySelector('pre.debug') }
			)
			new ControllerHeader(
				this, 
				{ $input: $('.new-todo'),
				$toggle_all: $('.toggle-all') }
			)
			this.footer_controller = new ControllerFooter(
				this, 
				{ $footer: $('footer'),
				$footer_interactive_area: $('.footer')}
			)

			// document.addEventListener("deleted todoitem", (event) => { this.delete(event.detail.from) })
			// rather than to an event type here, subscribe to each todo object within .add() below

			this.load()
			this.notify_all("app model changed", this)  // NEW for observer pattern
		}

		add(title, id, completed, options) {  // options are {during_load: t/f}
			let todo = new TodoItem(title, id, completed);
			this.todos.push(todo);
			new ControllerTodoItem(
				this, 
				todo, 
				{ $todolist: $('ul.todo-list') },
				this.footer_controller
			)
			if (!options.during_load) {
				todo.dirty()  // will cause broadcast, to its controller, which will create gui elements as necessary
				this.notify_all("app model changed", this)  // will tell e.g. footer controller to update displayed count
				this.save()
			}
			todo.add_observer(this, "deleted todoitem")
			todo.add_observer(this.footer_controller, "modified todoitem")  // NEW for observer pattern

			return todo
		}

		delete(todo_item) {
			console.log('App got delete notification from model todo_item', todo_item)

			const indx = this.todos.findIndex(v => v == todo_item);
			this.todos.splice(indx, indx >= 0 ? 1 : 0);

			this.notify_all("app model changed", this)
			this.save()
		}

		as_array() {
			// convert to an array of todo item dicts
			let result = []
			this.todos.forEach(function (todo) {
				result.push(todo.as_dict)
			})
			return result
		}

		save() {
			util.store('todos-oo', this.as_array())
		}

		load() {
			let todos_array = util.store('todos-oo')
			let options = {during_load: true}
			todos_array.forEach(function (todo) {
				this.add(todo.title, todo.id, todo.completed, options)
			}, this)
			// EVENTING SOLUTION
			// this.notify_all("modified todoitem", this, options)  // all todo item controllers listen for and will receive this
			// this.notify_all("app model changed", this)  // no listeners except root debug listener, displaying the model debug view
			// OBSERVER SOLUTION
			this.todos.forEach(function (todo) {
				todo.notify_all("modified todoitem", todo, options)
			}, this)

		}

		destroyCompleted() {
			this.getCompletedTodos().forEach(function (todo) {
				todo.delete()
			});
		}

		getActiveTodos() {
			return this.todos.filter(function (todo) {
				return !todo.completed;
			});
		}

		getCompletedTodos() {
			return this.todos.filter(function (todo) {
				return todo.completed;
			});
		}

		notify(event, from, data) {
			if (event.type == "deleted todoitem")
				this.delete(from)
			else
				console.warn(`unhandled notification '${event.type}'`)
		}
	}

	let app = new App()

})(window);
