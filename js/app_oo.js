// Includes util.js

Handlebars.registerHelper('eq', function (a, b, options) {
	return a === b ? options.fn(this) : options.inverse(this);
});

const util = new Util();

var ENTER_KEY = 13;
var ESCAPE_KEY = 27;

//
// Model
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
		this.dirty()
	}

	get completed() {
		return this._completed;
	}

	set completed(v) {
		this._completed = v;
		this.dirty()
	}

	get as_dict() {
		return {
			id: this.id,
			title: this.title,
			completed: this.completed
		}
	}

	delete() {
		notify_all("deleted todoitem", this)
	}

	dirty() {
		notify_all("modified todoitem", this, {during_load: false})
	}
}

//
// App 
//

class App {  // knows everything, owns the list of todo models, creates all controllers, with some business logic
	constructor() {
		this.todos = []
		this.filter = 'all'  // options are: all, active, completed

		// Create the permanent controllers - todo controllers are added as needed
		new ControllerDebugDumpModels(this, 'pre.debug')
		new ControllerHeader(this, '.new-todo')  // gui is the input el with this class
		new ControllerFooter(this, 'footer')  // gui is footer el

		document.addEventListener("deleted todoitem", (event) => { this.delete(event.detail.from) })

		this.load()
	}

	add(title, id, completed, options) {  // options are {persist: true, notify: true}
		let todo = new TodoItem(title, id, completed);
		this.todos.push(todo);

		new ControllerTodoItem(todo, this)
		if (options.notify) {
			todo.dirty()  // will cause broadcast, to its controller, which will create gui elements as necessary
			notify_all("app model changed", this)  // will tell e.g. footer controller to update displayed count
		}
		if (options.persist)
			this.save()

		return todo
	}

	delete(todo_item) {
		console.log('App got delete notification from model todo_item', todo_item)

		const indx = this.todos.findIndex(v => v == todo_item);
		this.todos.splice(indx, indx >= 0 ? 1 : 0);

		notify_all("app model changed", this)
		this.save()
	}

	_convert_to_array_of_dicts() {
		let result = []
		this.todos.forEach(function (todo) {
			result.push(todo.as_dict)
		})
		return result
	}

	save() {
		let todos = this._convert_to_array_of_dicts()
		util.store('todos-oo', todos);
	}

	load() {
		let todos_array = util.store('todos-oo')
		let options = {persist: false, notify: false}
		todos_array.forEach(function (todo) {
			this.add(todo.title, todo.id, todo.completed, options)
		}, this)
		notify_all("modified todoitem", this, {during_load: true})
		notify_all("app model changed", this)  // no listeners except root debug listener, displaying the model debug view
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

}

//
// Controllers / Mediators
//

class ControllerTodoItem {
	constructor(model_ref, app) {
		this.model_ref = model_ref
		this.app = app
		this.gui_id = this.model_ref.id  // might as well use unqique .id of model for the gui <li> data-id
		this.todoTemplate = Handlebars.compile($('#todo-template').html());
		this.notify_func = this.notify.bind(this)  // remember exact signature of func after it goes through .bind() mangling - so that we can later remove listener

		// Gui events
		// see bind_events() below, gui el gets re-bound after each gui el rebuild, which happens after each modified event notification

		// Internal events
		document.addEventListener("modified todoitem", this.notify_func)  // event will come from todo model
		document.addEventListener("deleted todoitem", this.notify_func)  // event will come from todo model
		document.addEventListener("filter changed", this.notify_func)  // event will come from footer controller
	}

	bind_events($gui_li) {
		($gui_li)
			.on('change', '.toggle', this.toggle.bind(this))
			.on('dblclick', 'label', this.editingMode.bind(this))
			.on('keyup', '.edit', this.editKeyup.bind(this))
			.on('focusout', '.edit', this.update.bind(this))
			.on('click', '.destroy', this.destroy.bind(this));
	}

	toggle(e) {
		this.model_ref.completed = !this.model_ref.completed
	}

	editingMode(e) {
		var $input = $(e.target).closest('li').addClass('editing').find('.edit');
		// puts caret at end of input
		$input.val('');
		$input.val(this.model_ref.title)  // sets the correct initial value
		$input.focus();
	}


	editKeyup(e) {
		if (e.which === ENTER_KEY) {
			e.target.blur();
		}

		if (e.which === ESCAPE_KEY) {
			$(e.target).data('abort', true).blur();
		}
	}

	update(e) {
		var el = e.target;
		var $el = $(el);
		var val = $el.val().trim();

		if ($el.data('abort')) {
			$el.data('abort', false);
		} else if (!val) {
			this.destroy(e);
			return;
		} else {
			this.model_ref.title = val
		}

		$(e.target).closest('li').removeClass('editing')
	}

	destroy(e) {
		console.log(`controller for '${this.model_ref.title}' got DELETE user event from GUI ***`)
		this.model_ref.delete()  // we will eventually get a notification from the model to delete this controller instance
	}

	_delete_gui() {
		// delete the GUI element
		$(`li[data-id=${this.gui_id}]`).remove()
		this.gui_id = "gone"  // protect against using this controller again

		// stop referencing this todo item controller by removing any document listeners to this controller's notify_func
		document.removeEventListener("modified todoitem", this.notify_func, false)
		document.removeEventListener("deleted todoitem", this.notify_func, false)
		document.removeEventListener("filter changed", this.notify_func, false)
	}

	_insert_gui(li) {
		// inserts or replaces li in 'ul.todo-list', returns the new $(li)
		let $existing_li = $(`li[data-id=${this.gui_id}]`)
		if ($existing_li.length == 1)
			$existing_li.replaceWith(li)  // replace existing li
		else if ($('ul.todo-list li').last().length == 0)
			$('ul.todo-list').append($(li))  // create initial li
		else
			$(li).insertAfter($('ul.todo-list li').last())  // append after last li
		return $(`li[data-id=${this.gui_id}]`)
	}

	build() {
		let li = this.todoTemplate(this.model_ref.as_dict);
		let $res = this._insert_gui(li);
		this.bind_events($res);
		this.apply_filter(this.app.filter);
	}

	apply_filter(filter) {
		let $el = $(`li[data-id=${this.gui_id}]`)
		if (filter == 'all')
			$el.show()
		else if (filter == 'active' && this.model_ref.completed)
			$el.hide()
		else if (filter == 'completed' && !this.model_ref.completed)
			$el.hide()
		else
			$el.show()
	}

	notify(event) {
		console.assert(this.gui_id != 'gone', 'old controller being notified?')

		if (event.type == "filter changed") {  // sent from footer controller
			console.log(`\tcontroller for '${this.model_ref.title}' got notified of filter change to '${event.detail.data.filter}', applying necessary visibility`)
			this.apply_filter(event.detail.data.filter)
		}
		else if (event.type == "modified todoitem" && (this.model_ref.id == event.detail.from.id || event.detail.data.during_load)) {
			console.log(`\tcontroller for '${this.model_ref.title}' got notified of modification, updating gui ${event.detail.data.during_load ? '(during_load)' : ''}`)
			this.build();
			if (!event.detail.data.during_load)  // persist if modification event comes from todo item, not during initial app load creation of all items
				this.app.save()
		}
		else if (this.model_ref.id == event.detail.from.id) {
			console.log(`\tcontroller for ${this.model_ref.title} got notified of deletion, unwiring`)
			this._delete_gui()
		}

	}

}


class ControllerHeader {  // handles adding new items and toggling all as completed/not completed
	constructor(app, id) {
		this.app = app
		this.gui_input = id  // not used cos can derive gui from $(e.target)

		// Gui events -> this controller
		$('.new-todo').on('keyup', (event) => { this.on_keyup(event) })
		$('.toggle-all').on('change', this.toggleAll.bind(this))

		// No internal events, thus no notify() method needed in this class
	}

	on_keyup(e) {
		// this.welcome_model.message = $(e.target).val() 
		var $input = $(e.target);
		var val = $input.val().trim();

		if (e.which !== ENTER_KEY || !val)
			return;

		$input.val('');

		this.app.add(val, util.uuid(), false, {persist: true, notify: true})  // title, id, completed
	}

	toggleAll(e) {
		var isChecked = $(e.target).prop('checked');

		this.app.todos.forEach(function (todo) {
			todo.completed = isChecked;
		});
	}
}


class ControllerFooter {  // handles filters, reporting number of items
	constructor(app, footer_selector) {
	  	this.app = app
		this.gui_footer_selector = footer_selector
		this.footerTemplate = Handlebars.compile($('#footer-template').html());
		  
		// Gui events
		$(this.gui_footer_selector).on('click', '.clear-completed', this.destroyCompleted.bind(this))
		$(this.gui_footer_selector).on('click', 'ul', this.filter_click.bind(this))

		// Internal events
		document.addEventListener("app model changed", (event) => { this.notify(event) })
		document.addEventListener("modified todoitem", (event) => { this.notify(event) })
	}

	destroyCompleted(e) {
		this.app.destroyCompleted()
	}

	filter_click(e) {
		var $el = $(e.target).closest('li');
		this.filter = $el.find('a').attr("name")
		this.renderFooter()

		// this broadcast goes to all the todoitem controllers
		notify_all("filter changed", this, {'filter': this.filter});		
	}

	get filter() {
		return this.app.filter
	}

	set filter(val) {
		this.app.filter = val
	}

	renderFooter() {
		var todoCount = this.app.todos.length;
		var activeTodoCount = this.app.getActiveTodos().length;
		var template = this.footerTemplate({
			activeTodoCount: activeTodoCount,
			activeTodoWord: util.pluralize(activeTodoCount, 'item'),
			completedTodos: todoCount - activeTodoCount,
			filter: this.filter
		});

		$('.footer').toggle(todoCount > 0).html(template);
	}

	notify(event) {
		console.log(`\tcontroller for footer got told to render footer cos '${event.type}'`)
		this.renderFooter()
	}

}


class ControllerDebugDumpModels {
	constructor(app, gui) {
		this.app = app
		this.gui = gui
		document.addEventListener("notify all called", (event) => { this.notify(event) })
	}

	format(obj) {
		return JSON.stringify(obj, null, " ");
	}
	
	log(...txt) {
		document.querySelector(this.gui).textContent = `${txt.join("\n")}\n`
	}

	notify(event) {
		this.log("App.todos model:", this.format(this.app.todos), `\nApp.filter: '${this.app.filter}'`)
	}

}
