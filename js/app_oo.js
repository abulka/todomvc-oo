// Includes util.js

const util = new Util();
var ENTER_KEY = 13;
var ESCAPE_KEY = 27;

//
// Models
//

class TodoItem {
	constructor(title, id, completed) {
		this._title = title == undefined ? "" : title;
		this._completed = completed == undefined ? false : completed;
		this.id = id == undefined ? util.uuid() : id;  // no getter/setter needed
	}

	get title() {
		return this._title;
	}

	set title(v) {
		this._title = v;
		notify_all("modified todoitem", this);
	}

	get completed() {
		return this._completed;
	}

	set completed(v) {
		this._completed = v;
		notify_all("modified todoitem", this);
	}

	get as_dict() {
		return {
			id: this.id,
			title: this.title,
			completed: this.completed
		}
	}

	dirty() {
		notify_all("modified todoitem", this);	
	}
}

class App {  // aggregates all the sub models into one housing, with some business logic
	constructor(todos) {
		this._todos = todos == undefined ? [] : todos;  // existing todos from persistence
	}

	get todos() {
		return this._todos;
	}

	add(title, id, completed) {
		let todo = new TodoItem(title, id, completed);
		this._todos.push(todo);
		console.log('TODO probably need to notify, or possibly not cos usually no controller wired yet so pointless')
		return todo
	}

    dirty_all() {
		// notify_all("modified todoitem", this)
		notify_all("modified todoitem", this)
	  }	
}


// Controllers / Mediators

let controllers = []

class ControllerTodoItem {
	constructor(model_ref, gui_id) {
	  this.model_ref = model_ref
	  this.gui_id = gui_id  // <li> data-id
	  this.todoTemplate = Handlebars.compile($('#todo-template').html());
	}
  
	notify(event) {  
		if (this.gui_id == undefined) {
			// Gui element has not been created yet, so build it and inject it
			console.log(`controller for ${this.model_ref.title} got notified to build initial gui`)
			this.gui_id = this.model_ref.id  // use id of model for the gui <li> data-id
			let li = this.todoTemplate(this.model_ref.as_dict)
			$(li).insertAfter($('ul.todo-list li').last())
			}
		else {
			// Gui element already exists, simply update it
			if (this.model_ref.id == event.detail.from.id) {  // only process specific controller - more efficient
				console.log(`controller for ${this.model_ref.title} got notified with detail ${JSON.stringify(event.detail)}`)
				$(`li[data-id=${this.gui_id}] div label`).text(this.model_ref.title)
			}
		}

	}
}

class ControllerCreateTodoItem {
	constructor(app_model, id) {
	  this.app_model = app_model
	  this.gui_input = id  // not used cos can derive gui from $(e.target)
	}
  
	on_keyup(e) { 
		// this.welcome_model.message = $(e.target).val() 
		var $input = $(e.target);
		var val = $input.val().trim();

		if (e.which !== ENTER_KEY || !val)
			return;

		let todo_item = this.app_model.add(val, util.uuid(), false)  // title, id, completed
		visualise_todoitem(todo_item)

		$input.val('');
		todo_item.dirty()  // will cause broadcast, to its controller, which will create gui elements as necessary
	}
  
	// notify(event) {  // not used yet, seems there are no notifications from the app model
	//  
	// }
}

// not sure where this function should live
function visualise_todoitem(todo_item) {
	// create controller
	let controller = new ControllerTodoItem(todo_item, undefined)  // gui is undefined
	controllers.push(controller)

	// wire model changes -> controller (using observer pattern)
	document.addEventListener("modified todoitem", (event) => { controller.notify(event) })

	// wire gui changes -> controller (using dom events)
	// none

	return todo_item
}

// not sure where this function should live
function build_create_todoitem_controller(app_model) {
	let controller_new_input = new ControllerCreateTodoItem(app_model, '.new-todo')  // gui is the input el
	controllers.push(controller_new_input)

	// wire model changes -> controller - not relevant cos no model
	// document.addEventListener(...)

	// wire text input keyup gui changes -> controller (using dom events)
	$('.new-todo').on('keyup', (event) => { controller_new_input.on_keyup(event) });
}
