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

      return function hubFactory (socket) {
        return {
          connect: function(transObj) {
            return socket.connection.start(transObj);
          },
          disconnect: function() {
            socket.connection.stop();
          },
          on: function(eventName, callback) {
            socket.proxy.on(eventName, asyncAngularify(socket, callback));
          },
          invoke: function(ev, data) {
            socket.proxy.invoke.apply(socket, arguments);
          },
          error: function(callback) {
            socket.connection.error(asyncAngularify(socket, callback));
          },
          stateChanged: function(callback) {
            socket.connection.stateChanged(asyncAngularify(socket, callback));
          }
        };

      };
    }];
  });
