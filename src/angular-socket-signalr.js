angular.module('roy.socket-signalr', []).
  provider('hubFactory', function() {
    'use strict';

    this.$get = ['$rootScope', '$timeout', function($rootScope, $timeout) {

      var asyncAngularify  = function(socket, callback) {

        return (typeof callback === 'function')? function() {
          var args = arguments;
          $timeout(function(){
            callback.apply(socket, args);
          }, 0);
        }: angular.noop;

      };

      return function hubFactory (hubName, opts) {
        opts = angular.extend({
          hub: window.$.hubConnection(),
          logging: false,
          qs: {}
        }, opts);

        var _hub = opts.hub;
        var _logging = opts.logging;
        var _qs = opts.qs;

        var _proxy = _hub.createHubProxy(hubName);


        var wrappedHub = {
          hub: _hub,
          proxy: _proxy,

          connect: function(transObj) {
            _hub.logging = _logging;
            _hub.qs = _qs;
            return _hub.start(transObj);
          },

          disconnect: function() {
            _hub.stop();
          },

          on: function(eventName, callback) {
            _proxy.on(eventName, asyncAngularify(_hub, callback));
          },

          invoke: function(ev, data) {
            _proxy.invoke.apply(_hub, arguments);
          },

          stateChanged: function(callback) {
            _hub.stateChanged(asyncAngularify(_hub, callback));
          },

          error: function(callback) {
            _hub.error(asyncAngularify(_hub, callback));
          }
        };

        //auto-establish connection with server
        wrappedHub.promise = wrappedHub.connect();

        return wrappedHub;
      };
    }];
  });
