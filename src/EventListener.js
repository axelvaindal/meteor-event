import { Meteor } from "meteor/meteor";
import { Obj, Collection } from "jstoolbox";

export class EventListener
{
	/**
     * Create an EventListener to handle event occuring.
     * @param	{PlainObject}	options		The configuration options of the listener
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
    * Evaluate if the listener has a before handle method.
    * @returns	{Boolean}	Whether or not the listener has a before handle method
    */
	hasBeforeHook()
	{
		return Obj.isFunction(this.beforeHandle);
	}

	/**
    * Evaluate if the listener has an after handle method.
    * @returns	{Boolean}	Whether or not the listener has an after handle method
    */
	hasAfterHook()
	{
		return Obj.isFunction(this.afterHandle);
	}

	/**
    * Register the listener to notify it whenever an event occurs.
    */
	register()
	{
		Meteor._addEventListener(this);	
	}

	/**
    * Evaluate if the options of the event listener are valid or not.
	* @private
    * @param	{PlainObject}	options		The configuration options of the event listener
    * @returns 	{Boolean} 					True if the options are valid, false otherwise
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
    * Evaluate if the target of the event listener is valid or not.
	* @private
    * @param	{Array}		listen	An array containing the name of the events to handle
    * @returns 	{Boolean} 			True if the event listener targets are valid, false otherwise
    */
	_isValidTarget(listen)
	{
		if (!Obj.isArray(listen) || Collection.isEmpty(listen))
			return false;

		for (let eventName of listen)
		{
			if (!Obj.isString(eventName) || Obj.isFalsy(eventName))
				return false;
		}

		return true;
	}
};
