/*
|--------------------------------------------------------------------------
| Event
|--------------------------------------------------------------------------
|
| This file defines the Event class.
| This class is a structure for your event.
| Inherit from this event to create your custom event. 
|
*/

import { Dispatcher } from "./Dispatcher.js";

export class Event 
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
    * This function is used in order to alert the dispatcher about an occurring event.
    */
	fire()
	{
		this._dispatcher.notify(this);
	}
};