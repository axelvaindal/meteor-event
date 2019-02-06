import { Obj } from "jstoolbox";
import { Meteor } from "meteor/meteor"; // eslint-disable-line import/no-unresolved

export class Event {
  /**
   * Create an Event to emit.
   * @param	{String}	name	The name of the event
   */
  constructor({ name, skipFailing = true }) {
    if (this.constructor === Event) {
      throw new TypeError("Event is abstract.");
    }

    if (!Obj.isString(name) || Obj.isFalsy(name)) {
      throw new TypeError("Event name must be an non empty string.");
    }

    this.name = name;
    this.skipFailing = skipFailing;
  }

  /**
   * Alert the dispatcher about an occurring event.
   */
  fire() {
    Meteor._notifyEventListeners(this);
  }
}
