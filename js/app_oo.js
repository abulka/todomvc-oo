// Includes util.js

const util = new Util();

//
// Models
//

class TodoItem {
	constructor(title, id, completed) {
		this._title = title == undefined ? "" : title;
		this._id = id == undefined ? util.uuid() : id;
		this._completed = completed == undefined ? false : completed;
	}

	get title() {
		return this._title;
	}

	set title(v) {
		this._title = v;
		notify_all("modified title", this, this._title);
	}
}

class Todos {
	constructor(todos) {
		this._todos = todos == undefined ? [] : todos;
	}

	get todos() {
		return this._todos;
	}

	add(title, id, completed) {
		let todo = new TodoItem(title, id, completed);
		this._todos.push(todo);
		// probably need to notify
	}
}

class App {
	// aggregates all the sub models into one housing, with some business logic
	constructor(todos_model) {
		this.todos_model = todos_model
	}
}
