import { Event } from "../src/Event.js";
import { EventListener } from "../src/EventListener.js";

var assert = require("assert");

describe("meteor-event Package", function()
{
	describe("Event related", function()
	{
		it("Should be able to inherit from the Event class.", function()
		{
			let c = class CustomEvent extends Event {};
		});
	});

	describe("EventListener related", function()
	{
		it("Should be able to inherit from the EventListener class.", function()
		{
			let c = class CustomEventListener extends EventListener {};
		});
	});
});