class Dispatcher
{
	static _dispatcher;

	/**
    * constructor
    * This function is used in order to build the object.
    */
	constructor()
	{
		this.listeners = [];
	}

	/**
	* getInstance
	* This function is used in order to implement the Singleton pattern in the following classes.
	* NOTE:This behavior suggests this class should actually be handled
    * by the Meteor object considering it only registers the different listeners.
    * @return {Dispatcher} The instance of the Dispatcher Singleton Class.
	*/
	static getInstance()
	{
		if (_dispatcher === undefined)
			_dispatcher = new Dispatcher();
		
		return _dispatcher;
	}

	/**
	* addListener
	* This function is used in order to register a new EventListener.
	* @param {EventListener} listener An instance of EventListener
	*/
	addListener(listener)
	{
		for (let i = 0, l = listener.listenTo.length; i < l; i++)
		{
			if (!_.isArray(this.listeners[listener.listenTo[i]]))
			{
				this.listeners[listener.listenTo[i]] = [];
			}

			this.listeners[listener.listenTo[i]].push(listener);
		}
	}

	/**
	* notify
	* This function is used in order to notify every EventListener registered an Event has been fired.
	* @param {Event} event An instance of Event
	*/
	notify(event)
	{
		let stopPropagation = false;
		if(_.isUndefined(this.listeners[event.name]))
		{
			throw new ReferenceError("There is no event listener registered for the event named " + event.name + ".");
		}

		for (let i = 0, ls = this.listeners[event.name]; i < ls.length; i++)
		{
			if (ls[i]._hasBeforeHook)
				ls[i].beforeHandle(event);

			stopPropagation = ls[i].handle(event);

			if (ls[i]._hasAfterHook)
				ls[i].afterHandle(event);

			if (stopPropagation)
				break;
		}
	}
};

dispatcher = Dispatcher.getInstance();

EventListener = class EventListener
{
	/**
    * constructor
    * This function is used in order to build the object.
    * @param {Object} options An object containing the description of the event listener.
    */
	constructor(options)
	{
		if (this.constructor.name === "EventListener")
			throw new TypeError("Event Listener is abstract.");

		if (!_.isFunction(this.handle))
			throw new TypeError(this.constructor.name + " must override the handle method.");

		if (!_.isUndefined(this.beforeHandle))
		{
			if (!_.isFunction(this.beforeHandle))
				throw new TypeError("beforeHandle must be a method.");

			this._hasBeforeHook = true;
		}

		if (!_.isUndefined(this.afterHandle))
		{
			if (!_.isFunction(this.afterHandle))
				throw new TypeError("afterHandle must be a method.");

			this._hasAfterHook = true;
		}

		if (this._isValid(options))
		{
			this._dispatcher = Dispatcher.getInstance();
			this.name = options.name;
			this.listenTo = options.listenTo;

			this.register();
		}
	}

	/**
    * register
    * This function is used in order to alert the dispatcher he has to notify a new event listener
    * whenever an event occurs.
    */
	register()
	{
		this._dispatcher.addListener(this);	
	}

	/**
    * isValid
    * This function is used in order to validate the event listener description.
    * @param {Object} options An object containing the description of the event listener.
    * @return {Boolean} True if the event description is valid, a Meteor Error otherwise.
    */
	_isValid(options)
	{
		if (!_.isString(options.name) || _.isEmpty(options.name))
		{
			throw new TypeError("EventListener name must be a string.");
		}
		else if (!this._isValidTarget(options.listenTo))
		{
			throw new TypeError("EventListener listenTo must be a String[*].");
		}

		return true;
	}

	/**
    * isValidTarget
    * This function is used in order to validate the target(s) of the listener.
    * @param {Array} listenTo An array containing the name of the events to monitor.
    * @return {Boolean} True if the event target is valid, false otherwis.
    */
	_isValidTarget(listenTo)
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
    * @param {String} name The event name.
    */
	constructor(name)
	{
		if (this.constructor.name === "Event")
			throw new TypeError("Event is abstract.");

		if (!_.isString(name) || _.isEmpty(name))
		{
			throw new TypeError("EventListener name must be a string.");
		}

		this.name = name;
		this._dispatcher = Dispatcher.getInstance();
	}

	/**
    * fire
    * This function is used in order to alert the dispatcher about an occuring event.
    */
	fire()
	{
		this._dispatcher.notify(this);
	}
};
