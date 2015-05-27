angular.module('roy.signalr-hub', []).
  constant('$', window.jQuery).
  provider('hubFactory', function() {
    'use strict';

    this.$get = ['$rootScope', '$timeout', '$', function($rootScope, $timeout, $) {

      var asyncAngularify  = function(context, fn) {

        return (typeof fn === 'function')? function() {
          var args = arguments;
          $timeout(function(){
            fn.apply(context, args);
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

          on: function(ev, fn) {
            _proxy.on(ev, fn.__ng = asyncAngularify(_proxy, fn));
          },

          off: function(ev, fn) {
            if(fn && fn.__ng) {
              fn = fn.__ng;
            }
            _proxy.off(ev, fn);
          },

          invoke: function(ev, data) {
            var args = arguments;
            return promisify(function() {
              _proxy.invoke.apply(_proxy, args);
            });
          },

          stateChanged: function(fn) {
            return promisify(function() {
              _hub.stateChanged(asyncAngularify(_hub, fn));
            });
          },

          error: function(fn) {
            _hub.error(asyncAngularify(_hub, fn));
          },

          forward: function(events) {

            if(!(events instanceof Array)) {
              events = [events];
            }

            events.forEach(function(ev) {
              this.on(ev, function(){
                $rootScope.$broadcast('hub:'+ ev);
              });
            }.bind(this));

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
