angular.module('roy.socket-signalr', []).
  provider('hubFactory', function() {
    'use strict';

    this.$get = ['$rootScope', '$timeout', function($rootScope, $timeout) {
      return function hubFactory (socket) {

        return {
          on: function(eventName, callback) {
            socket.on(eventName, $timeout(function(){
              callback();
            }, 0));
          },
          invoke: function(ev, data) {
            socket.invoke.apply(socket, arguments);
          }
        };

      };
    }];
  });
