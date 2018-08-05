import { Obj } from "jstoolbox";
import { Meteor } from "meteor/meteor";

import { Event } from "./Event.js";
import { EventListener } from "./EventListener.js";

Meteor._eventListeners = [];
Meteor._queuedEvents = [];

Meteor.getEventListeners = function(eventName)
{
    if (!Obj.isArray(Meteor._eventListeners[eventName]))
        return null;

    return Meteor._eventListeners[eventName];
};

Meteor._addEventListener = function(listener)
{
    for (let target of listener.listen)
    {
        if (!Obj.isArray(Meteor._eventListeners[target]))
            Meteor._eventListeners[target] = [];

        Meteor._eventListeners[target].push(listener);
    }
};

Meteor._notifyEventListeners = function(event)
{
    if (Obj.isUndefined(Meteor._eventListeners[event.name]))
		throw new ReferenceError("There is no event listener registered for the event named " + event.name + ".");
        
    for (let listener of Meteor._eventListeners[event.name])
	{
		if (listener.shouldQueue)
		{
			Meteor._queueEvent(listener, event);
			continue;	
		}

		if (Meteor._processEvent(listener, event))
			break;
	}
};

Meteor._processEvent = function(listener, event)
{
    let stopPropagation = false;

	if (listener.hasBeforeHook())
		listener.beforeHandle(event);

	stopPropagation = listener.handle(event);

	if (listener.hasAfterHook())
		listener.afterHandle(event);

	return stopPropagation;
};

Meteor._processQueuedEvent = function()
{
    let element = Meteor._queuedEvents.shift();

	if (!Obj.isUndefined(element))
		Meteor._processEvent(element.listener, element.event);
};

Meteor._queueEvent = function(listener, event)
{
    let element = 
    {
        listener : listener,
        event: event
    };

    Meteor._queuedEvents.push(element);
};

Meteor.monitorQueuedEvents = function(delay)
{
    let interval = delay || 5000;
    Meteor._eventMonitoring = Meteor.setInterval(Meteor._processQueuedEvent.bind(this), interval);
};

Meteor.stopMonitoringQueuedEvents = function()
{
    Meteor.clearInterval(Meteor._eventMonitoring);
	Meteor._eventMonitoring = undefined;
};

export { Event, EventListener };