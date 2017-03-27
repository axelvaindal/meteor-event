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

    version: "1.0.2",

    summary: "Event package for MeteorJS Framework.",

    git: "https://github.com/M4dNation/meteor-event",
});

Package.onUse(function(api) 
{
    api.use(["ecmascript", "underscore"]);

    api.mainModule("src/meteor-event.js", "server");
});

Package.onTest(function(api) 
{
    api.use(["ecmascript", "underscore", "practicalmeteor:mocha"]);
    
    api.use("m4dnation:meteor-event");
    
    api.mainModule("tests/meteor-event-tests.js");
});
