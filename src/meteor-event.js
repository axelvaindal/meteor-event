import { Obj } from "jstoolbox";
import { Meteor } from "meteor/meteor"; // eslint-disable-line import/no-unresolved

import { Event } from "./event";
import { EventListener } from "./event-listener";

Meteor._eventListeners = [];
Meteor._queuedEvents = [];

/**
 * Alert the dispatcher about an occurring event.
 * @param {Event} event The event to dispatch
 */
Meteor.fire = function(event) {
  if (!(event instanceof Event)) {
    throw new TypeError(`Invalid event provided.`);
  }

  notifyEventListeners(event);
};

/**
 * Register a new listener to the dispatcher.
 * @param {EventListener} eventListener The event listener to register
 */
Meteor.register = function(eventListener) {
  if (!(eventListener instanceof EventListener)) {
    throw new TypeError(`Invalid listener provided.`);
  }

  addEventListener(eventListener);
};

/**
 * Get all event listeners listening to a specific event.
 * @param   {String}    eventName   The name of the event
 * @return  {Array}                 All listeners tracking the wanted event
 */
Meteor.getEventListeners = function(eventName) {
  if (!Obj.isArray(Meteor._eventListeners[eventName])) {
    return [];
  }

  return Meteor._eventListeners[eventName];
};

/**
 * Add a new event listener to all registered event name.
 * @private
 * @param   {EventListener}     listener   The event listener to add
 */
function addEventListener(listener) {
  for (const target of listener.listen) {
    if (!Obj.isArray(Meteor._eventListeners[target])) {
      Meteor._eventListeners[target] = [];
    }

    Meteor._eventListeners[target].push(listener);
  }
}

/**
 * Notify all registered event listeners an event as occured.
 * @private
 * @param   {Event}     event   The occuring event
 */
function notifyEventListeners(event) {
  if (Obj.isUndefined(Meteor._eventListeners[event.name])) {
    const error = new ReferenceError(
      `There is no event listener registered for the event named ${event.name}.`
    );

    if (!event.skipFailing) {
      throw error;
    }

    return;
  }

  for (const listener of Meteor._eventListeners[event.name]) {
    if (listener.shouldQueue) {
      queueEvent(listener, event);
      continue;
    }

    if (processEvent(listener, event)) {
      break;
    }
  }
}

/**
 * Execute an event listener hooks and handle function on a specific event.
 * @private
 * @param   {EventListener} listener    The handling event listener
 * @param   {Event}         event       The occuring event
 * @return  {Boolean}                   Whether or not the propagation of the event should be stopped.
 */
function processEvent(listener, event) {
  let stopPropagation = false;

  if (listener.hasBeforeHook()) {
    listener.beforeHandle(event);
  }

  stopPropagation = listener.handle(event);

  if (listener.hasAfterHook()) {
    listener.afterHandle(event);
  }

  return stopPropagation;
}

/**
 * Fetch and execute a queued event.
 * @private
 * @param   {EventListener} listener    The handling event listener
 * @param   {Event}         event       The occuring event
 */
function processQueuedEvent() {
  const element = Meteor._queuedEvents.shift();

  if (!Obj.isUndefined(element)) {
    Meteor._processEvent(element.listener, element.event);
  }
}

/**
 * Queue an event with its listeners in order to be executed later.
 * @private
 * @param   {EventListener} listener    The handling event listener
 * @param   {Event}         event       The occuring event
 */
function queueEvent(listener, event) {
  const element = {
    listener,
    event,
  };

  Meteor._queuedEvents.push(element);
}

/**
 * Monitor all queued events at a specified interval.
 * @param   {Number} delay    The delay between two executions
 */
Meteor.monitorQueuedEvents = function(delay = 5000) {
  if (!Obj.isNumber(delay)) {
    throw new TypeError("delay should be a Number.");
  }

  Meteor._eventMonitoring = Meteor.setInterval(
    processQueuedEvent.bind(this),
    delay
  );
};

/**
 * Stop monitoring all queued events.
 */
Meteor.stopMonitoringQueuedEvents = function() {
  Meteor.clearInterval(Meteor._eventMonitoring);
  delete Meteor._eventMonitoring;
};

export { Event, EventListener };
