/* Experiment re: can passing data into a function replace the OO Object?
   Well, for this simple example it works OK.

   Perhaps I can do another TodoMVC implementation using only functions and
   passing data into those functions, to stress the idea out more.
   It would still have the same controller and app architecture, but no classes.
   Interesting future idea.
*/

// OO implementation

class A {
    constructor(name, age) {
        this.name = name
        this.age = age
        this.num_accesses = 0
    }
    birthday() {
        this.age += 1
        this.num_accesses += 1
    }
}
let arr = [new A('fred', 40), new A('mary', 23), new A('sam', 55)]
arr.forEach( (a) => {a.birthday()} )
arr.forEach( (a) => {a.num_accesses += 1} )
arr.forEach( (a) => {console.log(a)} )

// NON OO implementation

let ar = [{name: 'fred', age: 40, num_accesses: 0}, {name: 'mary', age: 23, num_accesses: 0}, {name: 'sam', age: 55, num_accesses: 0}]
function birthday(a) {
     a.age += 1
     a.num_accesses += 1
}
ar.forEach( (a) => {birthday(a)} )
ar.forEach( (a) => {a.num_accesses += 1} )
ar.forEach( (a) => {console.log(a)} )
