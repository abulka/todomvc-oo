	unwire() {
		$(`li[data-id=${this.gui_id}]`).remove()
		this.gui_id = "gone"  // protect against using this controller again

		/*
		Remove the event listener from the document - HARD cos functions don't match cos of the bind !
		solution is to remember exact function signature as .f attribute when its created.
			document.removeEventListener("modified todoitem", this.notify, false)  // won't work
		*/
		document.removeEventListener("modified todoitem", this.notify_func, false)  // important!
		document.removeEventListener("deleted todoitem", this.notify_func, false)  // important!
		document.removeEventListener("filter changed", this.notify_func, false)  // important!

		/*
		TIP: use getEventListeners(document) to list all the listeners
		esp. getEventListeners(document)["modified todoitem"][0].listener
		or use chrome elements inspector and on rhs is the listeners tab 
		*/

		/*
		Compared to jquery solution, 
			this.todos.splice(this.getIndexFromEl(e.target), 1);
			this.render();
		we granularly delete the li vs re-rendering the entire list of li's

		- delete the todo item model by removing from App._todos
		- stop referencing the todo item controller by removing any controller document listeners using .removeEventListener( controller func )
		- delete the li gui element which will delete any DOM event bindings
		*/
	}

	toggle(e) {
		/*
		Compared to jquery solution, 
			var i = this.getIndexFromEl(e.target);  // THIS SEARCHING NOT NEEDED COS WE HAVE INDIV. CONTROLLERS
			this.todos[i].completed = !this.todos[i].completed;
			this.render();  // THIS COMPLETE REWRITE OF ALL THE TODOS NOT NEEDED COS GRANULAR UPDATE OF WHAT'S ALREADY THERE
		we are zen
		*/
		this.model_ref.completed = !this.model_ref.completed
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
			// this.todos[this.getIndexFromEl(el)].title = val;   <---- Jquery solution needs to do a massive search
			this.model_ref.title = val  // oo solution is precise and simple
		}

		$(e.target).closest('li').removeClass('editing')
		// this.render();     <---- Jquery solution needs to re-render the entire list, oo solution does not
	}

	