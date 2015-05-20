
# angular-signalr 
[![Build Status](https://travis-ci.org/roylee0704/angular-signalr.svg?branch=master)](https://travis-ci.org/roylee0704/angular-signalr)
[![Code Climate](https://codeclimate.com/github/roylee0704/angular-signalr/badges/gpa.svg)](https://codeclimate.com/github/roylee0704/angular-signalr)
[![Code Climate](https://codeclimate.com/github/roylee0704/angular-socket-signalr/badges/gpa.svg)](https://codeclimate.com/github/roylee0704/angular-socket-signalr)[![Coverage Status](https://coveralls.io/repos/roylee0704/angular-signalr/badge.svg?branch=master)](https://coveralls.io/r/roylee0704/angular-signalr?branch=master)
[![Dependency Status](https://gemnasium.com/roylee0704/angular-socket-signalr.svg)](https://gemnasium.com/roylee0704/angular-socket-signalr)


Bower Component for using AngularJS with [SignalR.NET](http://signalr.net/).


## Install

1. `bower install angular-signalr` or [download the zip](https://github.com/roylee0704/angular-signalr/archive/master.zip).
2. Make sure the SignalR.NET client lib is loaded.
3. Include the `jquery.signalR-x.x.x.min.js` script provided by this component into your app.
4. Add `roylee.signalr-hub` as a module dependency to your app.


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

For the most part, this component works exactly like you would expect.


### `hub.on`
Takes an event name and callback.
Works just like the method of the same name from SignalR.NET.

#### Example

```javascript
angular.module('myApp', [
  'roy.signalr-hub'
]).
factory('myHub', function (hubFactory) {
  return hubFactory('yourHubName');
}).
controller('MyCtrl', function (myHub) {
  myHub.on('bar', function () {
    $scope.bar = true;
  });
});
```

### `hub.invoke`
Sends a message to the server.
Works just like the method of the same name from SignalR.NET.

#### Example

```javascript
angular.module('myApp', [
  'roy.signalr-hub'
]).
factory('myHub', function (hubFactory) {
  return hubFactory('yourHubName');
}).
controller('MyCtrl', function (myHub) {
  myHub.invoke('foo');
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
factory('myHub', function (socketFactory) {
  var mySpecialHub = $.hubConnection('/some/path', {useDefaultPath: false});

  myHub= socketFactory('yourHubName', {
    hub: mySpecialHub
  });

  return myHub;
});
```




