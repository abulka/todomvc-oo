class Application {  // owns the list of todo models, creates controllers through callbacks, doesn't refer to UI, has some business logic
    constructor(config) {
        this.todos = []  // model
        this.filter = 'all'  // view model, options are: 'all', 'active', 'completed'
        this.callback_config = config

        this.create_permanent_controllers()

        document.addEventListener("deleted todoitem", (event) => { this.delete(event.detail.from) })

        this.load()
    }

    create_permanent_controllers() {
        this.callback_config.cb_dump(this)  // creates diagnostic controller ControllerDebugDumpModels
        this.callback_config.cb_header(this)  // creates ControllerHeader
        this.callback_config.cb_footer(this)  // creates ControllerFooter
    }

    add(title, id, completed, options) {  // options are {during_load: t/f}
        let todo = new TodoItem(title, id, completed);
        this.todos.push(todo);

        this.callback_config.cb_todo(this, todo)  // callback to create ControllerTodoItem

        if (!options.during_load) {
            todo.dirty()  // will cause broadcast, to its controller, which will create gui elements as necessary
            notify_all("app model changed", this)  // will tell e.g. footer controller to update displayed count
            this.save()
        }
        return todo
    }

    delete(todo_item) {
        console.log('App got delete notification from model todo_item', todo_item)

        const indx = this.todos.findIndex(v => v == todo_item);
        this.todos.splice(indx, indx >= 0 ? 1 : 0);

        notify_all("app model changed", this)
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
        let options = { during_load: true }
        todos_array.forEach(function (todo) {
            this.add(todo.title, todo.id, todo.completed, options)
        }, this)
        notify_all("modified todoitem", this, options)  // all todo item controllers listen for and will receive this
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
