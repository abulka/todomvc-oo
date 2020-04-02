# MGM pattern revisited
_http://www.andypatterns.com/index.php/design_patterns/model_gui_mediator_pattern/__
_

My article didn't mention that you can have code in the GUI control which directly accesses the mediator - you don't need the tag stuff.

GUI could potentially access model directly. No big deal.

The update loop of setting the model (from the mediator) might trigger another notification to the mediator. This is inefficient and may cause an unecessary double refresh of the GUI. However modifying the model secretly may mean other mediators miss out on their updates. So the only thing to do is for the mediator to intercept the update to itself (as a result of it setting the model) and stopping it. How this is done is tricky, probably just check the value and if the value is already set, ignore the notification message. Actually this is probably a good overal optimisation anyway!

No default implementation or github repo.

Somehow MGM pattern (old) is still active!?