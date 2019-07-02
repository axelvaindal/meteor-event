import { Meteor } from "meteor/meteor"; // eslint-disable-line import/no-unresolved
import { Obj, Collection } from "jstoolbox";

export class EventListener {
  /**
   * Create an EventListener to handle event occuring.
   * @param	{PlainObject}	options		The configuration options of the listener
   */
  constructor({
    name = this.constructor.name,
    listen = [],
    shouldQueue = false,
    autoRegister = true,
    beforeHandle,
    handle,
    afterHandle,
  } = {}) {
    if (!Obj.isFunction(handle)) {
      throw new TypeError(
        `${this.constructor.name} must override the handle method.`
      );
    }

    if (!Obj.isUndefined(beforeHandle) && !Obj.isFunction(beforeHandle)) {
      throw new TypeError("beforeHandle must be a function.");
    }

    if (!Obj.isUndefined(afterHandle) && !Obj.isFunction(afterHandle)) {
      throw new TypeError("afterHandle must be a function.");
    }

    if (isValidListener({ name, listen })) {
      this.name = name;
      this.listen = listen;
      this.shouldQueue = shouldQueue;
      this.beforeHandle = beforeHandle;
      this.handle = handle;
      this.afterHandle = afterHandle;

      if (autoRegister) {
        Meteor.register(this);
      }
    }
  }

  /**
   * Evaluate if the listener has a before handle method.
   * @returns	{Boolean}	Whether or not the listener has a before handle method
   */
  hasBeforeHook() {
    return Obj.isFunction(this.beforeHandle);
  }

  /**
   * Evaluate if the listener has an after handle method.
   * @returns	{Boolean}	Whether or not the listener has an after handle method
   */
  hasAfterHook() {
    return Obj.isFunction(this.afterHandle);
  }
}

/**
 * Evaluate if the options of the event listener are valid or not.
 * @private
 * @param		{PlainObject}	options		The configuration options of the event listener
 * @return	{Boolean} 					True if the options are valid, false otherwise
 */
function isValidListener({ name, listen = [] } = {}) {
  if (!Obj.isString(name) || Obj.isFalsy(name)) {
    throw new TypeError("EventListener name must be a non-empty string.");
  } else if (!isValidTarget(listen)) {
    throw new TypeError("EventListener must listen to at least one event.");
  }

  return true;
}

/**
 * Evaluate if the target of the event listener is valid or not.
 * @private
 * @param		{Array}		listen	An array containing the name of the events to handle
 * @return 	{Boolean} 			True if the event listener targets are valid, false otherwise
 */
function isValidTarget(listen) {
  if (!Obj.isArray(listen) || Collection.isEmpty(listen)) {
    return false;
  }

  for (const eventName of listen) {
    if (!Obj.isString(eventName) || Obj.isFalsy(eventName)) {
      return false;
    }
  }

  return true;
}
