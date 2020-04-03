# Object Oriented Controller • [TodoMVC](http://todomvc.com)

The classic Javascript [TodoMVC app](https://github.com/tastejs/todomvc) implemented without a framework, using plain Object Oriented programming + a traditional MVC design pattern. Distinct, mediating Controller objects are the key to this implementation.

![](https://github.com/tastejs/todomvc-app-css/raw/master/screenshot.png)

Running demo [here](https://abulka.github.io/todomvc-oo/index.html).

## THE ARTICLE BELOW IS A WORK IN PROGRESS - DO NOT READ THIS YET!

DRAFT

DRAFT

DRAFT

DRAFT

DRAFT

DRAFT

DRAFT

DRAFT

DRAFT

DRAFT

3rd April 2020

It should be complete in a few more days.

DRAFT

DRAFT

DRAFT

DRAFT

DRAFT

DRAFT

DRAFT

DRAFT

DRAFT

DRAFT

---

## MVCA Architectural Pattern

Whilst the [MVC](https://en.wikipedia.org/wiki/Model%E2%80%93view%E2%80%93controller) (Model View Controller) pattern is commonly referred to implementations can vary widely. Most documentation on MVC, including the official wikipedia article is vague on details.  This project uses the MVCA pattern (formerly the MGM pattern) which is a clear and unambiguous interpretation of MVC, with the following key ideas:

- The **View** means a modern GUI framework, and as such is already available to be used by the programmer.
- One or more **Controllers** mediate between the View and the rest of the Application, listening for GUI events. Nobody else knows about the View.
- The **Model** is traditional, may contain some business logic, and may broadcast events when its attributes change.
- The **Application** owns the model(s), holds view state and contains some business logic methods.
- An Eventing system is needed, traditionally Observer pattern but the stronger decoupling and the proper event objects of the Publisher-Subscriber pattern is preferred.

Thus MVCA simply means "**M**odel **V**iew **C**ontroller **A**pplication" - all four roles are necessary to any implementation.

![controller point of view](https://raw.githubusercontent.com/abulka/todomvc-oo/master/out/docs/plantuml/mvc-a-controller-pov/mvc-a-controller-pov.svg?sanitize=true)

---


(Model View Controller - App)

Article on MVC-A  ⬅️ this is a bit more abstract - generalising what this implementation discovered
- Article on MVC-A [here](https://abulka.github.io/todomvc-oo/mvc-a)
- Article on MVC-A mvc-a-vers-root version [here](mvc-a-vers-root.md)

## TodoMVC-OO

This section explains this project in detail !!  Might later publish this on Medium.

This is a "traditional" Object Oriented implementation using my knowledge of Object Oriented programming, MVC patterns incl. my old [MGM pattern](http://www.andypatterns.com/index.php/design_patterns/model_gui_mediator_pattern/) where I called the Controller a 'Mediator'. The important thing is that the role of Controller is celebrated as a proper object. Controllers mediate between the GUI and the model/app. HTML for this old paper now available [here](https://abulka.github.io/todomvc-oo/pdf_as_html/andybulkamodelguimediatorpattern.html).

The role of the App is also important and often overlooked/undocumented. Whilst it is fine to wire Controllers directly to model instances, you will also need an App to hold "view state" e.g. like the state of the active "filter" in this Todo application.  The App is a centralised class, a kind of hub - to hold business logic to manipulates the model. More details below:


![mvc-a-architecture](https://raw.githubusercontent.com/abulka/todomvc-oo/master/docs/images/MVC-A-MGM-Architecture.svg?sanitize=true)

## Background

The Model View Controller (MVC) design pattern is almost universally acknowledged as a good thing - it separates the concerns of the model from the view, with the "controller" responding to events and populating the GUI.

Arguably if you have a JSON data structure that you want to visualise (the model), and some GUI event handler functions (controllers) then yes, you are doing some form of MVC. However I believe there are benefits in doing MVC in a more organised way - via the introduction of proper controller classes and notification events as defined by the Observer design pattern.

> I believe there are benefits in doing MVC in a more organised way - via the introduction of proper controller classes and using Observer design pattern eventing.

Background - what is MVC?
Let's assume that the MVC (model-view-controller) architecture in the case of getting model data rendered onto a HTML page works like this:
- Model - contains the data. Can be a object with methods, or just pure JSON data.
- View - are the DOM elements that are visualised in HTML.
- Controller - code which copies information from the app & model into the DOM. The controller also consists of any DOM event handler code that copies information back from the DOM and into the model again, as well code which manipulates the DOM / visualisation.

I quite like another more colloquial description of MVC given in a [stackoverflow answer](https://stackoverflow.com/questions/2626803/mvc-model-view-controller-can-it-be-explained-in-simple-terms) by Javier:

> the Model is the part of the code that knows things
> the View is the part of the code that shows the things the Model knows
> the Controller is the part of the code that gets commands from the user and tells the View what to show and the Model what to know.

## The Controller role
The Controller isn't necessarily a single thing. A bunch of GUI event handler functions are part of the 'controller role'. Code that copies data from the model into the GUI/DOM is part of the Controller role.

> The Model (JSON or model) and View (DOM) are simple enough, its the Controller that is the most interesting aspect of MVC.

I feel the challenge of GUI architectures is to tame the role of Controller into some semblance of coherance and symmetric organisation.

Controller is a Mediator. It mediates between (and has references to) the
* model & app
* view


## Architecture

![mvc-a-architecture](https://raw.githubusercontent.com/tcab/pagestest/master/docs/images/mvc-a-architecture.svg?sanitize=true)

## Resources

- [Website](https://www.gituml.com/editz/134)
- [Documentation](https://www.gituml.com/editz/134)
- [Used by](https://github.com/abulka/todomvc-oo)
- [Blog](https://www.gituml.com/editz/136)
- [FAQ](https://www.gituml.com/editz/136)

Which is fully visible here.

### Is TodoMVC-OO officially part of the TodoMVC project?

This project is not not officially part of the famous [TodoMVC project](http://todomvc.com/) - as it is not a trendy framework, nor does it meet the criterion of "having a community" around it.  On the other hand, perhaps "Old Skool" OO is arguably historically more popular than any of the latest frameworks? 😉

### Articles

- [Medium article]()  (coming in Apr 2020)
- [Literate Code Mapping](https://github.com/abulka/lcodemaps)


### Support

- [Stack Overflow](http://stackoverflow.com/questions/tagged/MVC-A)
- [Twitter](http://twitter.com/unjazz)

*Let us [know](https://github.com/tastejs/todomvc/issues) if you discover anything worth sharing.*


## Implementation

The app was created by studying the jQuery version of TodoMVC to understand the spec, then implementing it using traditional OO techniques incl. the use of proper controller objects.

The only spec violation might be the flash of the footer comes too early rather than right at the end of the initial render.

## Credit

Created by [Andy Bulka](http://andypatterns.com)

