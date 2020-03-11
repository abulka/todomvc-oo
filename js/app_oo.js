// Includes util.js

const util = new Util();
var ENTER_KEY = 13;
var ESCAPE_KEY = 27;

function format(obj) {
	return JSON.stringify(obj, null, " ");
}

function log(...txt) {
	document.querySelector("pre").textContent = `${txt.join("\n")}\n`
}

function log_append(...txt) {
	document.querySelector("pre").textContent += `${txt.join("\n")}\n`
}

function debug_report_app_state(app) {
	log("App.todos is (official)", format(app.todos))
}

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

	delete() {
		notify_all("deleted todoitem", this);	
	}

	dirty() {
		notify_all("modified todoitem", this);	
	}
}

class App {  // aggregates all the sub models into one housing, with some business logic
	constructor(todos) {
		this._todos = todos == undefined ? [] : todos;  // existing todos from persistence
		document.addEventListener("deleted todoitem", (event) => { this.delete(event.detail.from) })
	}

	get todos() {  // what's the point of this, it only gets used to populate the initial controllers
		return this._todos;
	}

	add(title, id, completed) {
		let todo = new TodoItem(title, id, completed);
		this._todos.push(todo);
		// don't notify any controllers cos none have been wired yet
		// debug_report_app_state(this)
		return todo
	}

	delete(todo_item) {
		// Note: if you're not sure about the contents of your array, 
		// you should check the results of findIndex first
		console.log('App model got delete notification from todo_item model', todo_item)
		log("DEL App.todos is ", format(this.todos))
		
		const indx = this.todos.findIndex(v => v == todo_item);
		console.log('inx found was', indx)
		this.todos.splice(indx, indx >= 0 ? 1 : 0);
		// debug_report_app_state(this)

		// someArray4.splice(indx, indx >= 0 ? 1 : 0);
		// log("", "check findIndex result first > someArray4 (nothing is removed) > ", format(someArray4));
		// log(`**someArray4.length (should still be 3) ${someArray4.length}`);

		// alternative implementation
		// this.todos.splice(this.getIndexFromEl(e.target), 1);

	}

    dirty_all() {
		// notify_all("modified todoitem", this)
		notify_all("modified todoitem", this)
	  }	
}


// Controllers / Mediators

let controllers = []  // what's the point of this, nobody loops through it

class ControllerTodoItem {
	constructor(model_ref, gui_id) {
	  this.model_ref = model_ref
	  this.gui_id = gui_id  // <li> data-id
	  this.todoTemplate = Handlebars.compile($('#todo-template').html());
	  this.notify_func = undefined  // will be replaced by exact address of the this.notify function after it goes through .bind() mangling
									// if there wasn't a need for bind() then we could just refer to the this.notify function normally
	}
  
	bind_events($gui_li) {
		($gui_li)
			.on('change', '.toggle', this.toggle.bind(this))
			.on('dblclick', 'label', this.editingMode.bind(this))
			.on('keyup', '.edit', this.editKeyup.bind(this))
			.on('focusout', '.edit', this.update.bind(this))
			.on('click', '.destroy', this.destroy.bind(this));		
	}

	toggle (e) {
		this.model_ref.completed = !this.model_ref.completed
		// var i = this.getIndexFromEl(e.target);  // THIS SEARCHING NOT NEEDED COS WE HAVE INDIV. CONTROLLERS
		// this.todos[i].completed = !this.todos[i].completed;
		// this.render();  // THIS COMPLETE REWRITE OF ALL THE TODOS NOT NEEDED COS GRANULAR UPDATE OF WHAT'S ALREADY THERE
	}
	
	editingMode (e) {
		var $input = $(e.target).closest('li').addClass('editing').find('.edit');
		// puts caret at end of input
		$input.val('');
		$input.val(this.model_ref.title)  // sets the correct initial value
		$input.focus();
	}


	editKeyup (e) {
		if (e.which === ENTER_KEY) {
			e.target.blur();
		}

		if (e.which === ESCAPE_KEY) {
			$(e.target).data('abort', true).blur();
		}
	}

	update (e) {
		var el = e.target;
		var $el = $(el);
		var val = $el.val().trim();
		
		if ($el.data('abort')) {
			$el.data('abort', false);
		} else if (!val) {
			this.destroy(e);
			return;
		} else {
			// this.todos[this.getIndexFromEl(el)].title = val;
			this.model_ref.title = val
		}

		$(e.target).closest('li').removeClass('editing')
		// this.render();
	}

	destroy (e) {
		console.log(`controller for '${this.model_ref.title}' got event from GUI of a DELETE`)
		this.model_ref.delete()
		$(`li[data-id=${this.gui_id}]`).remove()
		// this.model_ref = this.gui_id = undefined  // attempt to self zap/neuter :-)
		// this.model_ref = this.gui_id = undefined  // attempt to self zap/neuter :-)
		this.gui_id = "gone"  // attempt to self zap/neuter :-)

		/*
		Remove the event listener from the document - HARD cos functions don't match cos of the bind !
		solution is to remember exact function signature as .f attribute when its created.
			document.removeEventListener("modified todoitem", this.notify, false)  // won't work
		TIP: use getEventListeners(document) to list all the listeners
		esp. getEventListeners(document)["modified todoitem"][0].listener
		or use chrome elements inspector and on rhs is the listeners tab 
		*/
		document.removeEventListener("modified todoitem", this.notify_func, false)  // important!

		/*
		todo
		- delete the todo item model
		- delete the todo item controller and associated gui AND associated bindings
			presumably deleting the gui el will delete the bindings, phew
		- remove todo item from controllers list  // not sure if the controllers list will survive
		- remove any controller document listener using .removeEventListener( controller func )
		- remove todo item from App._todos

		Gosh - so much to do, compared to the jquery example:
			this.todos.splice(this.getIndexFromEl(e.target), 1);
			this.render();

		Need to think about this.  Do we need a pointer to the App or
		some higher level, or can we just send an event perhaps?
		
		Also, what benefit does the App model
		have besides an .add() method. The list of todos is not used by anyone yet
		except perhaps when we implement persistence?
		*/
	}

	notify(event) {
		console.assert(this.gui_id != 'gone', 'old controller being notified?')
		if (this.model_ref.id == event.detail.from.id || this.gui_id == undefined) {  // only process specific controller - more efficient
			if (this.gui_id == undefined) {
				// Gui element has not been created yet, so build it and inject it
				console.log(`controller for ${this.model_ref.title} got notified to build initial gui`)
				this.gui_id = this.model_ref.id  // use id of model for the gui <li> data-id
				let li = this.todoTemplate(this.model_ref.as_dict)
				let $res
				if ($('ul.todo-list li').last().length == 0) { // no last element to insert after so append instead
					$('ul.todo-list').append($(li))  // returns the ul not the inserted li, so need to then find the last li
					$res = $('ul.todo-list li').last()
				}
				else
					$res = $(li).insertAfter($('ul.todo-list li').last())
					//console.log('inserted gui el is', $res, $res.find('div label').text())
				this.bind_events($res)
			}
			else {
				// Gui element already exists, simply update it
				console.log(`controller for '${this.model_ref.title}' got notified with detail ${JSON.stringify(event.detail)}`)
				$(`li[data-id=${this.gui_id}] div label`).text(this.model_ref.title)
				$(`li[data-id=${this.gui_id}]`).toggleClass('completed',this.model_ref._completed)
			}
		}
		else {
			console.log(`controller for '${this.model_ref.title}' ignoring event targeting '${event.detail.from.title}'`)
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

class DebugDumpModels {
	constructor(app) {
	  this.app = app
	}
	
	notify(event) {
		debug_report_app_state(this.app)
	}

	// constructor(id) {
	//   this.gui_pre_id = id
	// }
	
	// notify(event) {
	//   let info = {
	// 	app_models: app,
	// 	mediator_welcome: mediator_welcome,
	// 	mediator_welcome_user : mediator_welcome_user,
	// 	mediator_edit_welcome : mediator_edit_welcome,
	// 	mediator_edit_firstname : mediator_edit_firstname,
	// 	mediator_edit_user_surname : mediator_edit_user_surname,
	//   }
	//   $(`#${this.gui_pre_id}`).html(syntaxHighlight(JSON.stringify(info, null, 2)))
	// }

}

// not sure where this function should live
function visualise_todoitem(todo_item) {
	// create controller
	let controller = new ControllerTodoItem(todo_item, undefined)  // gui is undefined
	controllers.push(controller)

	// wire model changes -> controller (using observer pattern)
	/*
	Note, anonymous functions cannot be removed using removeEventListener(), nor can
	functions that have been called using bind() cos these indirectly also create an anonymous
	function. But you can remember the func generated by using bind() in order to remove it.
	Need to call bind() so that 'this' inside the handler refers to the controller.

	Viz. bind() is called on a FUNCTION and you pass in the value of 'this' that you want
	to be the case inside that function later, in this case it is 'controller'.
	*/
	// document.addEventListener("modified todoitem", (event) => { controller.notify(event) })  // cannot use removeEventListener() later
	controller.notify_func = controller.notify.bind(controller)  // remember exact signature of func so that we can later remove listener
	document.addEventListener("modified todoitem", controller.notify_func)

	// wire gui changes -> controller (using dom events)
	// none wired here, all wired up in ControllerTodoItem constructor

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
