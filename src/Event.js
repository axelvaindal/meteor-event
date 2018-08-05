import { Obj } from "jstoolbox";
import { Meteor } from "meteor/meteor";

export class Event 
{
	/**
    * @param {String} name The event name.
    */
	constructor(name)
	{
		if (this.constructor === Event)
			throw new TypeError("Event is abstract.");

		if (!Obj.isString(name) || Obj.isFalsy(name))
			throw new TypeError("Event name must be an non empty string.");

		this.name = name;
	}

	/**
    * Alert the dispatcher about an occurring event.
    */
	fire()
	{
		Meteor._notifyEventListeners(this);
	}
};