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
	  this.gui_id = gui_id  // dom element has id matching model id, could be done in other ways too
	  this.parent_gui_ref = 'ul.todo-list'
	}
  
	// need keychar ENTER to trigger this change
	on_keychar_welcome(e) { this.welcome_model.message = $(e.target).val() }
  
	notify(event) {  
		// sender's notify_all(event_name, from, data) - the 'from' and 'data' end up in event.detail dict

		if (this.gui_id == undefined) {
			// Gui element has not been created yet, so build it and inject it
			console.log(`controller for ${this.model_ref.title} got notified to build initial gui`)

			this.gui_id = this.model_ref.id  // use id of model for the gui id, can't think of a better gui ref technique
			let li = `<li id="${this.gui_id}">${this.model_ref.title}</li>`
			/*
			TODO - NEED TO INSERT A PROPER TEMPLATED ITEM
	
			// $('.todo-list').html(this.todoTemplate(todos));
	
			<script id="todo-template" type="text/x-handlebars-template">
				{{#this}}
				<li {{#if completed}}class="completed"{{/if}} data-id="{{id}}">
					<div class="view">
						<input class="toggle" type="checkbox" {{#if completed}}checked{{/if}}>
						<label>{{title}}</label>
						<button class="destroy"></button>
					</div>
					<input class="edit" value="{{title}}">
				</li>
			{{/this}}
			</script>
			*/
	
			let $last_item = $(`${this.parent_gui_ref} li`).last()
			$(li).insertAfter($last_item)
			}
		else {
			if (this.model_ref.id == event.detail.from.id) {
				// Gui element already exists, simply update it
				console.log(`controller for ${this.model_ref.title} got notified with detail ${JSON.stringify(event.detail)}`)
				let $li_el = $(`#${this.gui_id}`)
				$li_el.text(this.model_ref.title)  // TODO need to make this the label inside the template
			}
		}

	}
  }

