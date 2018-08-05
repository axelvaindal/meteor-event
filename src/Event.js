import { Meteor } from "meteor/meteor";

export class Event 
{
	/**
    * This function is used in order to build the object.
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
    * fire
    * This function is used in order to alert the dispatcher about an occurring event.
    */
	fire()
	{
		Meteor._notifyEventListener(this);
	}
};