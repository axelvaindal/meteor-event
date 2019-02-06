# meteor-event

[![Project Status: Active – The project has reached a stable, usable state and is being actively developed.](https://www.repostatus.org/badges/latest/active.svg)](https://www.repostatus.org/#active)
[![Build Status](https://travis-ci.com/M4dNation/meteor-event.svg?branch=master)](https://travis-ci.com/M4dNation/meteor-event) ![](https://david-dm.org/M4dNation/meteor-event.svg)

## Install

`meteor add m4dnation:meteor-event`

## About

An event based declaration package for [**Meteor**](https://www.meteor.com).

If you have ever worked with some PHP frameworks such as Symphony or Laravel before using Meteor, you must have notice a lot of things are handled thanks to event based declarations.

The idea is simple: you fire an event and you have a class able to handle it and process things.  
This is very useful when you have to process similar treatments in different part of your application whenever something occurs.  
For example, you may have to send a notification email each time a user is doing some specific treatment.

This is exactly what you can do thanks to this package.

## Usage

The package is based on two classes named `Event` and `EventListener` which provide basic behavior.  
Thus, you just have to inherit from these classes in order to create an Event Based Application.

All of this is only available server-side (you cannot use this package in a Blaze Template or a React component).

```javascript
// in an eventlistener.js file (server side only)
import { EventListener } from "meteor/m4dnation:meteor-event";

export class UserActionListener extends EventListener {
  constructor() {
    super({
      name: "UserActionListener",
      listen: ["test"],
      shouldQueue: false, // If this is set to true, the process is queued
      autoRegister: true, // If this is set to false, you have to manually register the listener
    });
  }

  handle(event) {
    console.log("I am the " + this.name + ".");
    console.log("I handle the event named " + event.name + ".");

    // You can process here on your event

    // If the handle method returns true, the propagation is stopped.
    return true;
  }
}

// in an event.js file (server side only)
import { Event } from "meteor/m4dnation:meteor-event";

export class UserAddEmailEvent extends Event {
  constructor(options) {
    super(options.name);
    this.email = options.address;
  }
}

// in the server.js file (or a startup file loaded server side)
Meteor.startup(function() {
  // The instanciation is enough because autoRegister is set to true by default.
  new UserActionListener();
});
```

Then, you just have to create an instance of the declared event (for example in an `addEmail` method of your application) and fire it to see the magic occurs.

```javascript
// in a method.js file
Meteor.methods({
  "user.addEmail": ({ email }) => {
    // here we check if the user can do the process...

    // if so, we can process the method, create our event instance and fire it
    if (Meteor.isServer) {
      let event = new UserAddEmailEvent({
        name: "test",
        address: email,
      });

      event.fire();
    }
  },
});
```

## Authors

`meteor-event` is maintained by M4dNation Company.  
First version written by [axelvaindal](https://github.com/axelvaindal).

## Contributors

There is actually no other contributors for this project.
If you want to contribute, feel free to make any suggestions or to contact us.

### Contributing to the package

We try to keep `meteor-event` as simple as possible.
Before proposing a PR or opening an issue, please keep in mind :

    - This package is meant to be as simple as possible
    - This package tries to respect the [Single Responsibility Principle](https://en.wikipedia.org/wiki/Single_responsibility_principle)
    - This package tries to use the minimum of dependencies possible

Taking into account the previous points leads us to **NOT** merge proposed pull-request if those :

    - Integrate changes that are too far from the initial purpose of the package
    - Integrate changes that are adding additional dependencies
    - Integrate changes that are not unit tested and motivationated

This being said, we **really** welcome pull-request and bug report, so feel free to start a contribution.
Moreover, Pull Requests should always come with related unit tests, and won't be considered if tests aren't included.

### Testing

`meteor-event` uses jest for unit testing.  
If you don't know about jest yet, you can check out their [documentation](https://jestjs.io/en/).

To run the tests, just run :

`yarn test`

Note that we are using [codecov](https://codecov.io) to keep track of code coverage related to our tests and you shouldn't affect negatively the current coverage of the code by removing tests or not covering new features with new unit tests.

## Licence

`meteor-event` is available under the terms of the MIT LICENSE.  
Check the licence file for more information.
