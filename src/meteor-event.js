Dispatcher = new class Dispatcher
{
	constructor()
	{
		this.listeners = [];
	}

	addListener(listener)
	{
		for (let i = 0; i < listener.listening.length; i++)
		{
			if (typeof this.listeners[listener.listening[i]] !== "[object array]")
			{
				this.listeners[listener.listening[i]] = [];
			}

			this.listeners[listener.listening[i]].push(listener);
		}
	}

	notify(event)
	{
		for (let i = 0, ls = this.listeners[event.name]; i < ls.length; i++)
		{
			console.log("I call the " + ls[i].name + ".");
			ls[i].handle(event);
		}
	}
}();

EventListener = class EventListener
{
	constructor(options)
	{
		this.name = options.name;
		this.listening = options.listenTo;
	}

	handle(event)
	{
		console.log("I am handling the " + event.name + " event correctly.");
	}

	register()
	{
		Dispatcher.addListener(this);	
	}
};


Event = class Event 
{
	constructor(options)
	{
		this.name = options.name;
	}

	fire()
	{
		Dispatcher.notify(this);
	}

	do()
	{	
		console.log("My name is " + this.name + "and I am being fired.");
	}
};