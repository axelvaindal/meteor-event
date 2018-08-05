Package.describe(
{
    name: "m4dnation:meteor-event",

    version: "1.3.0",

    summary: "Event package for MeteorJS Framework.",

    git: "https://github.com/M4dNation/meteor-event",
});

Npm.depends(
{
    "jstoolbox": "1.0.1"
});

Package.onUse(function(api) 
{
	api.versionsFrom("1.7.0.3");

    api.use(["ecmascript"]);

    api.mainModule("src/meteor-event.js", "server");
});

Package.onTest(function(api) 
{
	api.versionsFrom("1.7.0.3");

    api.use(["ecmascript", "practicalmeteor:mocha"]);
    
    api.use("m4dnation:meteor-event");
    
    api.mainModule("tests/meteor-event-tests.js");
});
