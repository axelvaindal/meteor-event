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

First, you need to create a server file which will be used in order to make the listeners declaration.

```
// in a listener.js file (server side only)

const UserActionListener = new EventListener(
{
	name: "UserActionListener",
	listenTo: ["user.register", "user.addEmail"],
	handle(event)
	{
		console.log("I handle two events with a similar treatment.");
	}
});

UserActionListener.register();

```

Then, you just have to create an instance of an event (for example in the addEmail method of your application)
and fire it to see the magic occurs.

```
// in a method.js file 
Meteor.methods(
{
	'user.addEmail'({email}) 
  	{
		// here we check if the user can do the process...
		
		// if so, we can create our event instance
		const AddEmailEvent = new Event(
		{
			name: "user.addEmail",
			do()
			{
				console.log("I can do whatever treatment is needed.");
				// Here you can call an Email API to send a specific email for example
			},
			params: 
			{
				userId: this.userId,
				newEmail: email,
			}
		});

		// Here I add the email and then I fire the event
		AddEmailEvent.fire();
  	}
});
```

## AUTHORS

meteor-event is maintained by M4dNation Company.

Contributors are : M4dNation teammates and others.

## LICENCE

meteor-event is released under the MIT License.