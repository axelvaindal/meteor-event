/*
|--------------------------------------------------------------------------
| Meteor Event Package File
|--------------------------------------------------------------------------
|
| This file defines the Meteor Event package.
| 
*/

Package.describe(
{
    name: "m4dnation:meteor-event",

    version: "0.2.0",

    summary: "Event package for MeteorJS Framework.",

    git: "https://github.com/M4dNation/meteor-event",

    documentation: ''
});

Package.onUse(function(api) 
{
    api.use(["ecmascript"]);

    api.mainModule("src/meteor-event.js", "server");
    
    api.export("EventListener", "server");
    api.export("Event", "server");
});

Package.onTest(function(api) 
{
    api.use(["ecmascript", "practicalmeteor:mocha"]);
    
    api.use("m4dnation:meteor-event");
    
    api.mainModule("tests/meteor-event-tests.js");
});
