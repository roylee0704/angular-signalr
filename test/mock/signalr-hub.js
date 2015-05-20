/**
 * Created by roylee on 18/05/2015.
 */

var $ =  {
  hubConnection: createMockHubObject
};


function createMockHubObject () {
  'use strict';

  var connection = {
    _err_fn: function(){},
    createHubProxy: function (hubName) {
      return new HubProxy(hubName);
    },
    start: function(transObj) {},
    stop: function() {},
    error: function(err_fn) {
      this._err_fn = err_fn;
    },
    throwErr: function(error) {
      if(typeof this._err_fn === 'function') {
        this._err_fn(error);
      }
    }
  };

  return connection;
}


function HubProxy ( hubName ) {
  'use strict';

  this._listeners = {};

  this.on = function (ev, fn) {
    this._listeners[ev] = fn;
  };

  this.invoke = function (ev, data) {
    var listener = this._listeners[ev];
    if(typeof listener === 'function') {
      listener.apply(null, Array.prototype.slice.call(arguments, 1));
    }
  };
}


