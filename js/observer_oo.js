/*
An Implementation of the Observer design pattern for Javascript.

Subject classes should inherit from Subject and call notifyall() to broadcast, 'data' is arbitrary and optional.
Observer classes should inherit from Observer and implement notify(from, data) to receive the notification.

As a debugging aid, each notify() also emits a custom event 'observer-notification' which can be listened for e.g.
document.addEventListener("observer-notification", (event) => { ... }) where event.detail will contain { from: from,
data: data }
*/

// NOT USED IN THIS PROJECT - YET - USING IDIOMATIC EVENTING INSTEAD - SEE observer_events.js

class Subject {
    constructor() {
        this.observers = []
    }

    add_observer(observer, event_type) {
        this.observers.push({observer:observer, event_type:event_type})
    }

    remove_observer(observer, event_type) {
        this.observers = this.observers.filter(
            function(item) {
                if (item.observer !== observer && item.event_type != event_type) {
                    return item;
                }
            }
        )
    }

    notify_all(event, from, data) {
        const self = this
        for (let o of this.observers) {
            if (o.event_type == event) {
                console.log(`Subject ${this.constructor.name} notifying: ${o.constructor.name} from=${from} of event ${event} with data ${JSON.stringify(data)}`)

                let event_obj = {
                    type: event,
                    detail: {
                        from: from,
                        data: data
                    }
                }
                // o.observer.notify(event, from, data)
                o.observer.notify(event_obj, from, data)
            }
        }
    }
}

// Anyone can be an observer - all they need is to implement notify()

// class Observer {
//     notify(event, from, data) {  // Observers need only implement this - inheriting from Observer is optional
//     }    
// }





/*
testing


class Subject1 extends Subject {
    constructor(name) {
        super()
        this.name = name
    }

}
class Observer1 {
    constructor(name) {
        this.name = name
    }
    notify(event, from, data) {  // Observers need only implement this - inheriting from Observer is optional
        console.log(`Observer1 instance '${this.name}' got notified of ${event} with data ${JSON.stringify(data)}`)
    }    
}


let fox = new Subject1('fox')
let hunter1 = new Observer1('hunter fred')
let hunter2 = new Observer1('hunter mary')
let hunter3 = new Observer1('hunter sam')
fox.add_observer(hunter1, 'hi')
fox.add_observer(hunter2, 'hi')
fox.add_observer(hunter2, 'there')
fox.notify_all('hi', fox, {'more data': 100})
fox.notify_all('there', fox, {'more data': 200})

*/
