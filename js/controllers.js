// Includes util.js

Handlebars.registerHelper('eq', function (a, b, options) {
	return a === b ? options.fn(this) : options.inverse(this);
});

const util = new Util();

var ENTER_KEY = 13;
var ESCAPE_KEY = 27;

//
// Controllers / Mediators
//

class ControllerTodoItem {
	constructor(app, model_ref, gui_dict) {
		this.app = app
		this.model_ref = model_ref
		this.gui = gui_dict

		this.gui_id = this.model_ref.id  // might as well use unqique .id of model for the gui <li> data-id
		this.todoTemplate = Handlebars.compile($('#todo-template').html());
		this.notify_func = this.notify.bind(this)  // remember exact signature of func after it goes through .bind() mangling - so that we can later remove listener

		// Gui events
		// see bind_events() below

		// Internal events
		document.addEventListener("modified todoitem", this.notify_func)  // event will come from todo model
		document.addEventListener("deleted todoitem", this.notify_func)  // event will come from todo model
		document.addEventListener("filter changed", this.notify_func)  // event will come from footer controller
	}

	bind_events($gui_li) {
		// li element needs to be re-bound every time it is rebuilt/rendered, which happens after each "modified todoitem" event notification
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
		else if (this.gui.$todolist.find('li').length == 0)
			this.gui.$todolist.append($(li))  // create initial li
		else
			$(li).insertAfter(this.gui.$todolist.find('li').last())  // append after last li
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
	constructor(app, gui_dict) {
		this.app = app
		this.gui = gui_dict  // some not used cos can derive gui from $(e.target)

		// Gui events -> this controller
		this.gui.$input.on('keyup', (event) => { this.on_keyup(event) })
		this.gui.$toggle_all.on('change', this.toggleAll.bind(this))

		// No internal events, thus no notify() method needed in this class
	}

	on_keyup(e) {
		var $input = $(e.target);
		console.assert($input.get(0) == this.gui.$input.get(0))
		var val = $input.val().trim();

		if (e.which !== ENTER_KEY || !val)
			return;

		$input.val('');

		this.app.add(val, util.uuid(), false, {during_load: false})  // title, id, completed
	}

	toggleAll(e) {
		var isChecked = $(e.target).prop('checked');

		this.app.todos.forEach(function (todo) {
			todo.completed = isChecked;
		});
	}
}


class ControllerFooter {  // handles filters, reporting number of items
	constructor(app, gui_dict) {
	  	this.app = app
		this.gui = gui_dict
		this.footerTemplate = Handlebars.compile($('#footer-template').html());
		  
		// Gui events
		this.gui.$footer.on('click', '.clear-completed', this.destroyCompleted.bind(this))
		this.gui.$footer.on('click', 'ul', this.filter_click.bind(this))

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

		this.gui.$footer_interactive_area.toggle(todoCount > 0).html(template);
	}

	notify(event) {
		console.log(`\tcontroller for footer got told to render footer cos '${event.type}'`)
		this.renderFooter()
	}

}


class ControllerDebugDumpModels {
	constructor(app, gui_dict) {
		this.app = app
		this.gui = gui_dict

		// Gui events
		this.gui.$toggle_checkbox.on('change', (event) => { this.display_debug_info(event) })

		// Internal events
		document.addEventListener("notify all called", (event) => { this.notify(event) })
	}

	format(obj) {
		return JSON.stringify(obj, null, " ");
	}
	
	log(...txt) {
		this.gui.pre_output.textContent = `${txt.join("\n")}\n`
	}

	display_debug_info(event) {
		this.gui.pre_output.style.display = event.target.checked ? 'block' : 'none'
	}

	notify(event) {
		this.log("App.todos model:", this.format(this.app.todos), `\nApp.filter: '${this.app.filter}'`)
	}

}
