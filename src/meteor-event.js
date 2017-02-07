/*
* TODO DISPATCHER:
* ---------------------------------------
* - Securise the class methods in order to make sure params and performance are okay for actual process
* - Allow multiple listener to listen on one event instance
* 
 */


/*
* TODO EVENT_LISTENER:
* ---------------------------------------
* - Securise the class methods in order to make sure params and performance are okay for actual process
* - Allow Queuieng
* - Allow Listener to have a specific handle method in order to process event
* 
 */


/*
* TODO EVENT:
* ---------------------------------------
* - Securise the class methods in order to make sure params and performance are okay for actual process
* 
 */



class Dispatcher
{
	constructor()
	{
		if (dispatcher)
		{
			return dispatcher;
		}

		this.listeners = [];
	}

	static getInstance()
	{
		return new Dispatcher();
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
			console.log("Calling the " + ls[i].name + ".");
			ls[i].process(event);
		}
	}
};

dispatcher = new Dispatcher();

EventListener = class EventListener
{
	constructor(options)
	{
		this.dispatcher = Dispatcher.getInstance();
		this.name = options.name;
		this.listening = options.listenTo;
		this.handle = options.handle;
	}

	process(event)
	{
		this.handle(event);

		console.log(this.name + " is handling the " + event.name + " event correctly.");
		event.do();
	}

	register()
	{
		this.dispatcher.addListener(this);	
	}
};


Event = class Event 
{
	constructor(options)
	{
		this.dispatcher = Dispatcher.getInstance();

		this.name = options.name;
		this.params = options.params;
		this.do = options.do;
	}

	fire()
	{
		this.dispatcher.notify(this);
	}
};