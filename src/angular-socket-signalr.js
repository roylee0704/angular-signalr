angular.module('roy.socket-signalr', []).
  provider('hubFactory', function() {
    'use strict';

    this.$get = ['$rootScope', '$timeout', function($rootScope, $timeout) {
      return function hubFactory (socket) {

        return {
          connect: function(transObj) {
            socket.connection.start(transObj);
          },
          disconnect: function() {
            socket.connection.stop();
          },
          on: function(eventName, callback) {
            socket.proxy.on(eventName, $timeout(function(){
              callback();
            }, 0));
          },
          invoke: function(ev, data) {
            socket.proxy.invoke.apply(socket, arguments);
          }
        };

      };
    }];
  });
