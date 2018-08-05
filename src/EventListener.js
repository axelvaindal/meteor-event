import { Meteor } from "meteor/meteor";
import { Obj, Collection } from "jstoolbox";

export class EventListener
{
	/**
    * @param {Object} options An object containing the description of the event listener.
    */
	constructor(options)
	{
		if (this.constructor === EventListener)
			throw new TypeError("Event Listener is abstract.");

		if (!Obj.isFunction(this.handle))
			throw new TypeError(this.constructor.name + " must override the handle method.");

		if (!Obj.isUndefined(this.beforeHandle) && !Obj.isFunction(this.beforeHandle))
			throw new TypeError("beforeHandle must be a function.");

		if (!Obj.isUndefined(this.afterHandle) && !Obj.isFunction(this.afterHandle))
			throw new TypeError("afterHandle must be a function.");

		if (this._isValid(options))
		{
			this.name = options.name;
			this.listen = options.listen;
			this.shouldQueue = options.shouldQueue ? options.shouldQueue : false;

			if (!options.disableAutoRegister)
				this.register();
		}
	}

	/**
    * This function is used in order to know if the listener has a before handle method.
    * @return {Boolean} Whether or not the listener has a before handle method.
    */
	hasBeforeHook()
	{
		return Obj.isFunction(this.beforeHandle);
	}

	/**
    * This function is used in order to know if the listener has an after handle method.
    * @return {Boolean} Whether or not the listener has an after handle method.
    */
	hasAfterHook()
	{
		return Obj.isFunction(this.afterHandle);
	}

	/**
    * This function is used in order to alert the dispatcher he has to notify this EventListener whenever an event occurs.
    */
	register()
	{
		Meteor._addEventListener(this);	
	}

	/**
    * isValid
    * This function is used in order to validate the EventListener description.
    * @param {Object} options An object containing the description of the event listener.
    * @return {Boolean} True if the EventListener description is valid, a Javascript TypeError otherwise.
    */
	_isValid(options)
	{
		if (!Obj.isString(options.name) || Obj.isFalsy(options.name))
			throw new TypeError("EventListener name must be a non-empty string.");
		else if (!this._isValidTarget(options.listen))
			throw new TypeError("EventListener must listen to at least one event.");

		return true;
	}

	/**
    * isValidTarget
    * This function is used in order to validate the target(s) of the listener.
    * @param {Array} listenTo An array containing the name of the events to monitor.
    * @return {Boolean} True if the event target is valid, false otherwise.
    */
	_isValidTarget(listen)
	{
		if (!Obj.isArray(listen))
			return false;

		if (Collection.isEmpty(listen))
			return false;

		for (let eventName of listen)
		{
			if (!Obj.isString(eventName) || Obj.isFalsy(eventName))
				return false;
		}

		return true;
	}
};
