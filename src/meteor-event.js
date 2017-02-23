/*
* TODO EVENT_LISTENER:
* ---------------------------------------
* - Allow Queueing
* - Stopping propagation
 */


class Dispatcher
{
	/**
    * constructor
    * This function is used in order to build the object.
    * NOTE: There is a Singleton pattern here. This behavior suggests this class should actually be handled
    * by the Meteor object considering it only registers the different listeners.
    */
	constructor()
	{
		if (dispatcher)
		{
			return dispatcher;
		}

		this.listeners = [];
	}

	/**
	* getInstance
	* This function is used in order to implement the Singleton pattern in the following classes.
	*/
	static getInstance()
	{
		return new Dispatcher();
	}

	/**
	* addListener
	* This function is used in order to add a new registered listener.
	* @param {EventListener} listener An instance of an event listener
	*/
	addListener(listener)
	{
		for (let i = 0; i < listener.listenTo.length; i++)
		{
			if (typeof this.listeners[listener.listenTo[i]] !== "[object array]")
			{
				this.listeners[listener.listenTo[i]] = [];
			}

			this.listeners[listener.listenTo[i]].push(listener);
		}
	}

	/**
	* notify
	* This function is used in order to notify every listener an event has occured.
	* @param {Event} event An instance of an event
	*/
	notify(event)
	{
		if(_.isUndefined(this.listeners[event.name]))
		{
			throw new Meteor.Error("RUNTIME_ERROR", "There is no event listener registered for the event named " + event.name + ".");
		}

		for (let i = 0, ls = this.listeners[event.name]; i < ls.length; i++)
		{
			ls[i].process(event);
		}
	}
};

dispatcher = new Dispatcher();

EventListener = class EventListener
{
	/**
    * constructor
    * This function is used in order to build the object.
    * @param {Object} options An object containing the description of the event listener.
    */
	constructor(options)
	{
		if (this.isValid(options))
		{
			this.dispatcher = Dispatcher.getInstance();
			this.name = options.name;
			this.listenTo = options.listenTo;
			this.handle = options.handle;
		}
	}

	/**
    * process
    * This function is used in order to process after an event has been fired.
    * @param {Event} event The fired event.
    */
	process(event)
	{
		this.handle(event);
		event.do();
	}

	/**
    * register
    * This function is used in order to alert the dispatcher he has to notify a new event listener
    * whenever an event occurs.
    */
	register()
	{
		this.dispatcher.addListener(this);	
	}

	/**
    * isValid
    * This function is used in order to validate the event listener description.
    * @param {Object} options An object containing the description of the event listener.
    * @return {Boolean} True if the event description is valid, a Meteor Error otherwise.
    */
	isValid(options)
	{
		if (!_.isString(options.name) || _.isEmpty(options.name))
		{
			throw new Meteor.Error("SYNTAX_ERROR", "You must provide a name.");
		}
		else if (!_.isFunction(options.handle))
		{
			throw new Meteor.Error("SYNTAX_ERROR", "You must provide a behavior.");
		}
		else if (!this.isValidTarget(options.listenTo))
		{
			throw new Meteor.Error("SYNTAX_ERROR", "You must provide a valid event to monitor.");
		}
		else
		{
			return true;
		}
	}

	/**
    * isValidTarget
    * This function is used in order to validate the target(s) of the listener.
    * @param {Array} listenTo An array containing the name of the events to monitor.
    * @return {Boolean} True if the event target is valid, false otherwis.
    */
	isValidTarget(listenTo)
	{
		if (_.isArray(listenTo))
		{
			for (let i = 0, l = listenTo.length; i < l; i++)
			{
				if (!_.isString(listenTo[i]) || _.isEmpty(listenTo[i]))
				{
					return false;
				}
			}
		}
		else
		{
			return false;
		}

		return true;
	}
};

Event = class Event 
{
	/**
    * constructor
    * This function is used in order to build the object.
    * @param {Object} options An object containing the description of the event.
    */
	constructor(options)
	{
		if (this.isValid(options))
		{
			this.dispatcher = Dispatcher.getInstance();
			this.name = options.name;
			this.do = options.do;
			this.params = options.params;
		}
	}

	/**
    * fire
    * This function is used in order to alert the dispatcher about an occuring event.
    */
	fire()
	{
		this.dispatcher.notify(this);
	}

	/**
    * isValid
    * This function is used in order to validate the event description.
    * @param {Object} options An object containing the description of the event.
    * @return {Boolean} True if the event description is valid, a Meteor Error otherwise.
    */
	isValid(options)
	{
		if (!_.isString(options.name) || _.isEmpty(options.name))
		{
			throw new Meteor.Error("SYNTAX_ERROR", "You must provide a name.");
		}
		else if (!_.isFunction(options.do))
		{
			throw new Meteor.Error("SYNTAX_ERROR", "You must provide a behavior.");
		}
		else if (!_.isObject(options.params) || {}.toString.call(options.params) !== "[object Object]")
		{
			throw new Meteor.Error("SYNTAX_ERROR", "You must provide parameters.");
		}
		else
		{
			return true;
		}
	}
};