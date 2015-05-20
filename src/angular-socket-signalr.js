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

      return function hubFactory (options) {


        options = options || {};
        var hub = options.hub || $.hubConnection();

        return {
          connect: function(transObj) {
            return hub.connection.start(transObj);
          },
          disconnect: function() {
            hub.connection.stop();
          },
          on: function(eventName, callback) {
            hub.proxy.on(eventName, asyncAngularify(hub, callback));
          },
          invoke: function(ev, data) {
            hub.proxy.invoke.apply(hub, arguments);
          },
          error: function(callback) {
            hub.connection.error(asyncAngularify(hub, callback));
          },
          stateChanged: function(callback) {
            hub.connection.stateChanged(asyncAngularify(hub, callback));
          }
        };

      };
    }];
  });
