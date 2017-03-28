/*
|--------------------------------------------------------------------------
| meteor-event test file
|--------------------------------------------------------------------------
|
| This file defines all tests for meteor-event package.
| 
*/

import { Event } from "../src/Event.js";
import { EventListener } from "../src/EventListener.js";

var assert = require('assert');

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
			let c = class CustomEvent extends Event {};
			
		});
	});

	describe("Dispatcher related", function()
	{
		it("Should be able to inherit from the EventListener class.", function()
		{
			let c = class CustomEvent extends Event {};
			
		});
	});

	describe("Usage related", function()
	{

	});
});