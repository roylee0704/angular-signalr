angular.module('roy.signalr-hub', []).
  constant('$', window.jQuery).
  provider('hubFactory', function() {
    'use strict';

    this.$get = ['$rootScope', '$timeout', '$', function($rootScope, $timeout, $) {

      var asyncAngularify  = function(context, callback) {

        return (typeof callback === 'function')? function() {
          var args = arguments;
          $timeout(function(){
            callback.apply(context, args);
          }, 0);
        }: angular.noop;

      };

      return function hubFactory (hubName, opts) {
        opts = angular.extend({
          hub: $.hubConnection(),
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

          on: function(ev, callback) {
            _proxy.on(ev, asyncAngularify(_proxy, callback));
          },

          off: function(ev, callback) {
            _proxy.off(ev, callback);
          },

          invoke: function(ev, data) {
            var args = arguments;
            return promisify(function() {
              _proxy.invoke.apply(_proxy, args);
            });
          },

          stateChanged: function(callback) {
            return promisify(function() {
              _hub.stateChanged(asyncAngularify(_hub, callback));
            });
          },

          error: function(callback) {
            _hub.error(asyncAngularify(_hub, callback));
          }
        };

        //auto-establish connection with server
        wrappedHub.promise = wrappedHub.connect();


        var promisify = function (fn) {
          return wrappedHub.promise.then(function(){
            return fn();
          });
        };

        return wrappedHub;
      };
    }];
  });
