nerve
=====

An asynchronous javascript micro framework for event broadcasts along routes and channels. This approach is similar to backbone but uses routes and channels instead of a simple token. Typically channels and routes are found in message queues in enterprise environments. This pattern is useful when you are using an MVC pattern and need separate view models to be able to talk to each other, but need to keep them loosely coupled.

The reason for creating this was to keep channels and routes logically different, rather than creating a complex token that has a single context.


Listening to channels and routes
---
When specifying a listener you must specify a channel and callback. Optionally you have the ability to declare a route to give greater specificity to your event subscription. Finally there is an argument that allows you to change the scope of the subscription function. Changing the scope allows us to access properties that may exist outside of our callback scope.

When you declare a channel and/or route to listen on, if the route does not exist, one is created for you. If the channel/route does exist, then it will simple append the listener to the collection.

This pattern is similar to backbone but is smart enough to not rebind the same callback more than once if it's in the same scope. 

**Listening to any message on a channel**
```
nerve.on('order', function(context) {

});
```


**Listening to a specific route on a channel**
```
nerve.on('order', 'created', function(context) {

});
```


**Listening to a channel or route but using a different scope upon event consumption**
```
this.outsideScopeProperty = 'you can see me';

var that = this;

nerve.on('order', 'created', function(context) {
  // The scope of the callback function has changed to whatever the subscription was told
  return this.outsideScopeProperty === 'you can see me';
}, that);
```


Removing listeners from a channel or route
---
Removing the listener will remove any callbacks that are bound to the channel or route. Notice in the examples you do not need to specify the callback function to remove it. Also you can not only remove a listener from a specific route but you can also remove all listeners from a channel.

**Removing a listener for a channel**
```
nerve.off('order');
```

**Removing a listener from a specific channel's route**
```
nerve.off('order', 'created');
```


**Removing a listener from a specific channel's route that has a different scope**
```
var that = this;

nerve.off('order', 'created', that);
```

Sending message along a channel or route
---
Sending a message along a channel or route is as simple as calling send. This will asynchronously call all callbacks for channel or a channel/route combination.

**Sending a message to all listeners on a channel**
```
nerve.send('order', {SomeProperty: 'Hello'});
```

**Sending a message to listeners on a channel's route**
```
nerve.send('order', 'created', {SomeProperty: 'Hello'});
```
