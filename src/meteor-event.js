import { Obj } from "jstoolbox"; // eslint-disable-line import/no-unresolved
import { Meteor } from "meteor/meteor"; // eslint-disable-line import/no-unresolved

import { Event } from "./event";
import { EventListener } from "./event-listener";

Meteor._eventListeners = [];
Meteor._queuedEvents = [];

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
Meteor._addEventListener = function(listener) {
  for (const target of listener.listen) {
    if (!Obj.isArray(Meteor._eventListeners[target])) {
      Meteor._eventListeners[target] = [];
    }

    Meteor._eventListeners[target].push(listener);
  }
};

/**
 * Notify all registered event listeners an event as occured.
 * @private
 * @param   {Event}     event   The occuring event
 */
Meteor._notifyEventListeners = function(event) {
  if (Obj.isUndefined(Meteor._eventListeners[event.name])) {
    throw new ReferenceError(
      "There is no event listener registered for the event named " +
        event.name +
        "."
    );
  }

  for (const listener of Meteor._eventListeners[event.name]) {
    if (listener.shouldQueue) {
      Meteor._queueEvent(listener, event);
      continue;
    }

    if (Meteor._processEvent(listener, event)) {
      break;
    }
  }
};

/**
 * Execute an event listener hooks and handle function on a specific event.
 * @private
 * @param   {EventListener} listener    The handling event listener
 * @param   {Event}         event       The occuring event
 * @return  {Boolean}                   Whether or not the propagation of the event should be stopped.
 */
Meteor._processEvent = function(listener, event) {
  let stopPropagation = false;

  if (listener.hasBeforeHook()) {
    listener.beforeHandle(event);
  }

  stopPropagation = listener.handle(event);

  if (listener.hasAfterHook()) {
    listener.afterHandle(event);
  }

  return stopPropagation;
};

/**
 * Fetch and execute a queued event.
 * @private
 * @param   {EventListener} listener    The handling event listener
 * @param   {Event}         event       The occuring event
 */
Meteor._processQueuedEvent = function() {
  const element = Meteor._queuedEvents.shift();

  if (!Obj.isUndefined(element)) {
    Meteor._processEvent(element.listener, element.event);
  }
};

/**
 * Queue an event with its listeners in order to be executed later.
 * @private
 * @param   {EventListener} listener    The handling event listener
 * @param   {Event}         event       The occuring event
 */
Meteor._queueEvent = function(listener, event) {
  const element = {
    listener,
    event,
  };

  Meteor._queuedEvents.push(element);
};

/**
 * Monitor all queued events at a specified interval.
 * @param   {Number} delay    The delay between two executions
 */
Meteor.monitorQueuedEvents = function(delay) {
  const interval = delay || 5000;

  Meteor._eventMonitoring = Meteor.setInterval(
    Meteor._processQueuedEvent.bind(this),
    interval
  );
};

/**
 * Stop monitoring all queued events.
 */
Meteor.stopMonitoringQueuedEvents = function() {
  Meteor.clearInterval(Meteor._eventMonitoring);
  Meteor._eventMonitoring = undefined;
};

export { Event, EventListener };
