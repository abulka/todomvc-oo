//
// Model
//

class TodoItem extends Subject {
	constructor(title, id, completed) {
		super()
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
		this.notify_all("deleted todoitem", this)
	}

	dirty() {
		this.notify_all("modified todoitem", this, {during_load: false})
	}
}
