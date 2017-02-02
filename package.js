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
    name: 'm4dnation:meteor-event',

    version: '0.0.1',

    summary: 'Event package for MeteorJS Framework.',

    git: 'https://github.com/M4dNation/meteor-event',

    documentation: ''
});

Package.onUse(function(api) 
{
    api.use(['ecmascript']);

    api.mainModule('src/meteor-event.js');
    
    api.export('Dispatcher');
    api.export('EventListener');
    api.export('Event');
});

Package.onTest(function(api) 
{
    api.use(['ecmascript', 'practicalmeteor:mocha']);
    
    api.use('mm4dnation:meteor-event');
    
    api.mainModule('tests/utils-tests.js');
});
