# meteor-event

## ABOUT
An event based declaration package for MeteorJS.

## DESCRIPTION

If you have ever worked with some PHP frameworks such as Symphony or Laravel before using Meteor, you must have notice
a lot of things are handled thanks to Event Based Declaration.

The idea is simple: you fire an event and you have a class which is able to handle it and process things.   
This is very useful when you have to process similar treaments in different part of your application whenever something occurs.   
For example, you may have to send a notification email each time a user is doing some specific treament.

This is exactly what you can do thanks to this package.

Let's see how.

The package is based on two classes named `Event` and `EventListener` which provide basic behavior.   
Thus, you just have to inherit from these classes in order to create an Event Based Application.

All of this is only available server-side (you cannot use this package in a Blaze Template or a React component).

```
// in an listeners.js file (server side only)
export const UserActionListener = class UserActionListener extends EventListener
{
	constructor()
	{
		super(
		{
			name: "UserActionListener", 
			listenTo: ["user.addEmail"]
		});
	}

	handle(event)
	{
		console.log("I am the " + this.name + ".");
		console.log("I handle the event named " + event.name + ".");

		// You can process here on your event

		// If the handle method returns true, the propagation is stopped.
		return true;
	}
};

// in an events.js file (server side only)
export const UserAddEmailEvent = class UserAddEmailEvent extends Event
{
	construtor(options)
	{
		super(options.name);
		this.email = options.address;
	}
};

// in the server.js file (or a startup file loaded server side)
Meteor.startup(function()
{
	let listener = new UserActionListener();
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
		let event = new UserAddEmailEvent(
		{
			name: "test",
			address: email
		});
		event.fire();
  	}
});
```

## AUTHORS

meteor-event is maintained by M4dNation Company.

Contributors are : M4dNation teammates and others.

## LICENCE

meteor-event is released under the MIT License.