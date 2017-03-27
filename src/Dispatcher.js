/*
|--------------------------------------------------------------------------
| Dispatcher
|--------------------------------------------------------------------------
|
| This file defines the Dispatcher class.
| This class is used in order to implement the Mediator Pattern.
| This should not be used outside of the package.
|
*/

export class Dispatcher
{
	static _dispatcher;

	/**
    * constructor
    * This function is used in order to build the object.
    */
	constructor()
	{
		this.listeners = [];
		this.queue = [];

		this.monitor();
	}

	/**
	* getInstance
	* This function is used in order to implement the Singleton pattern in the Dispatcher class.
	* NOTE: This behavior suggests this class should actually be handled
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
		if(_.isUndefined(this.listeners[event.name]))
		{
			throw new ReferenceError("There is no event listener registered for the event named " + event.name + ".");
		}

		for (let i = 0, ls = this.listeners[event.name]; i < ls.length; i++)
		{
			if (ls[i].shouldQueue)
			{
				this.queueProcess(ls[i], event);
				continue;	
			}

			if (this.process(ls[i], event))
				break;
		}
	}

	/**
	* process
	* This function is used in order to execute an EventListener treatment on an Event.
	* @param {EventListener} listener An instance of EventListener
	* @param {Event} event An instance of Event
	* @return {Boolean} True if the event should not be propagated to the next listener, false otherwise
	*/
	process(listener, event)
	{
		let stopPropagation = false;

		if (listener.hasBeforeHook)
			listener.beforeHandle(event);

		stopPropagation = listener.handle(event);

		if (listener.hasAfterHook)
			listener.afterHandle(event);

		return stopPropagation;
	}

	/**
	* monitor
	* This function is used in order to monitor queued EventListener.
	*/
	monitor()
	{
		let interval = Meteor.settings.private.event_queueInterval ? Meteor.settings.private.event_queueInterval : 5000;
		this._running = Meteor.setInterval(this.executeQueuedProcess.bind(this), interval);
	}

	/**
	* stopMonitoring
	* This function is used in order to stop monitoring queued EventListener.
	*/
	stopMonitoring()
	{
		Meteor.clearInterval(this._running);
		this._running = undefined;
	}

	/**
	* executeQueuedProcess
	* This function is used in order to process queued EventListener.
	*/
	executeQueuedProcess()
	{
		let operator = this.queue.shift();

		if (!_.isUndefined(operator))
			this.process(operator.listener, operator.event);
	}

	/**
	* queueProcess
	* This function is used in order to queue an EventListener's instance process.
	* @param {EventListener} listener An instance of EventListener
	* @param {Event} event An instance of Event
	*/
	queueProcess(listener, event)
	{
		let operator = {
			listener : listener,
			event: event
		};

		this.queue.push(operator);
	}
};