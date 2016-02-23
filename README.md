
# angular-signalr 
[![Build Status](https://travis-ci.org/roylee0704/angular-signalr.svg?branch=master)](https://travis-ci.org/roylee0704/angular-signalr)
[![Code Climate](https://codeclimate.com/github/roylee0704/angular-signalr/badges/gpa.svg)](https://codeclimate.com/github/roylee0704/angular-signalr)
[![Coverage Status](https://coveralls.io/repos/roylee0704/angular-signalr/badge.svg?branch=master)](https://coveralls.io/r/roylee0704/angular-signalr?branch=master)
[![Dependency Status](https://gemnasium.com/roylee0704/angular-signalr.svg)](https://gemnasium.com/roylee0704/angular-signalr)


Bower Component for using AngularJS with [SignalR.NET](http://signalr.net/).


## Install

1. `bower install angular-signalr` or [download the zip](https://github.com/roylee0704/angular-signalr/archive/master.zip).
2. Make sure the SignalR.NET client lib is loaded.
3. Include the `jquery.signalR.min.js` script provided by this component into your app.
4. Add `roy.signalr-hub` as a module dependency to your app.


## Usage

This module exposes a `hubFactory`, which is an API for instantiating
signalr-hubs that are integrated with Angular's digest cycle.



### Making a Hub Instance

```javascript
// in the top-level module of the app
angular.module('myApp', [
  'roy.signalr-hub',
  'myApp.MyCtrl'
]).
factory('myHub', function (hubFactory) {
  return hubFactory('yourHubName');
});
```

With that, you can inject your `myHub` service into controllers and
other serivices within your application!

## API

For the most part, this component works exactly like you would expect. The only API
addition is `hub.forward`, which makes it easier to add/remove listener in a way that 
works with [AngularJS's scope](https://docs.angularjs.org/api/ng/type/$rootScope.Scope)

### `hub.on`
Takes an event name and callback.
Works just like the method of the same name from SignalR.NET.

### `hub.off`
Takes an event name and callback.
Works just like the method of the same name from SignalR.NET.

### `hub.invoke`
Sends a message to the server.
Works just like the method of the same name from SignalR.NET.

### `hub.forward`

`hub.forward` allows you to forward the events received by SignalR.NET's hub to
AngularJS's event system. You can then listen to the event with `$scope.on`. By default,
hub-forwarded events are namespaced with `hub:`.

The first argument is a string or array of strings listing the event names to be forwarded.
The second argument is optional, and is the scope on which the event are to be broadcasted. If
an argument is not provided, it defaults to `$rootScope`. As a reminder, broadcasted events are 
propagated down to descendant scopes.

#### Example

An easy way to make hub events available across your app:

```javascript
  //in the top level module of the app
  angular.module('myApp', [
    'roy.signalr-hub',
    'myApp.MyCtrl'
  ]).
  factory('myHub', function(hubFactory) {
    var myHub = hubFactory();
    myHub.forward('interesting-event');
    return myHub;
  });
  
  angular.module('myApp.MyCtrl', []).
    controller('MyCtrl', function() {
      $scope.$on('hub:interesting-event', function(ev, data) {
      
      });
    });
   
```




### `hubFactory(hubName, { hub: }}`

The first argument: `hubName` is a required parameter, it specifies the name of the Hub that you have created on the Server.

For next argument is optional, this option allows you to provide the `hub` service with a `SignalR.NET hub` object to be used internally.
This is useful if you want to connect on a different path, or need to hold a reference to the `SignalR.NET hub` object for use elsewhere.

#### Example

```javascript
angular.module('myApp', [
  'roy.signalr-hub'
]).
factory('myHub', function (hubFactory) {
  var mySpecialHub = $.hubConnection('/some/path', {useDefaultPath: false});

  myHub = hubFactory('yourHubName', {
    hub: mySpecialHub
  });

  return myHub;
});
```

### `hub.error`
A handler for error events.
Works just like the method of the same name from SignalR.NET.
#### Example

```javascript
angular.module('myApp', [
  'roy.signalr-hub'
]).
factory('myHub', function (hubFactory) {
  myHub = hubFactory('yourHubName');

  return myHub;
}).
controller('MyCtrl', function (myHub) {
  myHub.error(function (error) {
    console.log('SignalR error: ' + error)
  });
});
```


### `hub.stateChanged`
Raised when the connection state changes. 
Works just like the method of the same name from SignalR.NET.

#### Example

```javascript
angular.module('myApp', [
  'roy.signalr-hub'
]).
factory('myHub', function (hubFactory) {
  myHub = hubFactory('yourHubName');

  return myHub;
}).
controller('MyCtrl', function (myHub) {
  myHub.stateChanged(function(state){
    switch (state.newState) {
      case $.signalR.connectionState.connecting:
        //your code here
        break;
      case $.signalR.connectionState.connected:
        //your code here
        break;
      case $.signalR.connectionState.reconnecting:
        //your code here
        break;
      case $.signalR.connectionState.disconnected:
        //your code here
        break;
    }
  });
});
```
