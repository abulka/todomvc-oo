// Includes util.js

const util = new Util();

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

}

class App {
	constructor(todos) {
		this._todos = todos == undefined ? [] : todos;  // existing todos from persistence
	}

	get todos() {
		return this._todos;
	}

	add(title, id, completed) {
		let todo = new TodoItem(title, id, completed);
		this._todos.push(todo);
		// probably need to notify
	}

    dirty_all() {
		// notify_all("modified todoitem", this)
		notify_all("modified todoitem", this)
	  }	
}


// Controllers / Mediators

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

