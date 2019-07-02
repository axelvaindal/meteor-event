import { Obj } from "jstoolbox";

/**
 *
 */
export class Event {
  /**
   * Create an Event to emit.
   * @param	{String}	name	The name of the event
   */
  constructor({ name, skipFailing = false }) {
    if (this.constructor === Event) {
      throw new TypeError("Event is abstract.");
    }

    if (!Obj.isString(name) || Obj.isFalsy(name)) {
      throw new TypeError("Event name must be an non empty string.");
    }

    this.name = name;
    this.skipFailing = skipFailing;
  }
}
