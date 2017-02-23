# meteor-event

## ABOUT

An event based declaration package for MeteorJS.

If you have ever worked with PHP frameworks such as Symphony or Laravel before using Meteor, you must have notice
a lot of things are handled thanks to Event Based Declaration.

The idea is simple : you fire an event and you have a class which is able to handle it and process things.
This is very useful when you have to process similar treament in different part of your application whenever something occurs.
For example, you may have to send a notification email each time a user is doing some specific treament.

This is exactly what you can do thanks to this package.

Let's see how.

The package is based on two classes named `Event` and `EventListener` which provides basic behavior.
Thus, you just have to inherit from these classes in order to create an Event Based Application.

```
// in a listener.js file (server side only)
export const UserActionListener = class UserActionListener extends EventListener
{
	handle(event)
	{
		// here I can do whatever treatment is needed in order to handle the event
	}
};

// in an event.js file (server side only)
export const UserAddEmailEvent = class UserAddEmailEvent extends Event
{
	construtor(name, address)
	{
		super(name);
		this.email = address;
	}
};

// in the server.js file (or a startup file loaded server side)
Meteor.startup(function()
{
	let listener = new UserActionListener("UserActionListener", ["user.addEmail"]);
});

```

Then, you just have to create an instance of the declared event (for example in the addEmail method of your application)
and fire it to see the magic occurs.

```
// in a method.js file 
Meteor.methods(
{
	'user.addEmail'({email}) 
  	{
		// here we check if the user can do the process...
		
		// if so, we can process the method, create our event instance and fire it
		let event = new UserAddEmailEvent("user.addEmail", email);
		event.fire();
  	}
});
```

## AUTHORS

meteor-event is maintained by M4dNation Company.

Contributors are : M4dNation teammates and others.

## LICENCE

meteor-event is released under the MIT License.