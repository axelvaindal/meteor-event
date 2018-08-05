import { Meteor } from "meteor/meteor";

export class EventListener
{
	/**
    * constructor
    * This function is used in order to build the object.
    * @param {Object} options An object containing the description of the event listener.
    */
	constructor(options)
	{
		if (this.constructor === EventListener)
			throw new TypeError("Event Listener is abstract.");

		if (!_.isFunction(this.handle))
			throw new TypeError(this.constructor.name + " must override the handle method.");

		if (!_.isUndefined(this.beforeHandle))
		{
			if (!_.isFunction(this.beforeHandle))
				throw new TypeError("beforeHandle must be a method.");

			this._hasBeforeHook = true;
		}
		else 
		{
			this._hasBeforeHook = false;
		}

		if (!_.isUndefined(this.afterHandle))
		{
			if (!_.isFunction(this.afterHandle))
				throw new TypeError("afterHandle must be a method.");

			this._hasAfterHook = true;
		}
		else 
		{
			this._hasAfterHook = false;
		}

		if (this._isValid(options))
		{
			this._dispatcher = Dispatcher.getInstance();
			this.name = options.name;
			this.listenTo = options.listenTo;
			this.shouldQueue = options.shouldQueue ? options.shouldQueue : false;

			this.register();
		}
	}

	/**
    * hasBeforeHook
    * @getter
    * This function is used in order to know if the listener has a before handle method.
    * @return {Boolean} Whether or not the listener has a before handle method.
    */
	get hasBeforeHook()
	{
		return this._hasBeforeHook;
	}

	/**
    * hasAfterHook
    * @getter
    * This function is used in order to know if the listener has an after handle method.
    * @return {Boolean} Whether or not the listener has an after handle method.
    */
	get hasAfterHook()
	{
		return this._hasAfterHook;
	}

	/**
    * register
    * This function is used in order to alert the dispatcher he has to notify this EventListener whenever an event occurs.
    * whenever an event occurs.
    */
	register()
	{
		this._dispatcher.addListener(this);	
	}

	/**
    * isValid
    * This function is used in order to validate the EventListener description.
    * @param {Object} options An object containing the description of the event listener.
    * @return {Boolean} True if the EventListener description is valid, a Javascript TypeError otherwise.
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
    * @return {Boolean} True if the event target is valid, false otherwise.
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
