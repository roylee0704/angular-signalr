describe('socketFactory', function() {
  'use strict';

  beforeEach(module('roy.socket-signalr'));

  var hub,
      mockedHub, /*server hub*/
      spy,
      $timeout;

  beforeEach(inject(function(hubFactory, _$timeout_) {
    mockedHub = {};
    mockedHub.connection = window.$.hubConnection();
    mockedHub.proxy = mockedHub.connection.createHubProxy('testHub');
    spy = jasmine.createSpy('mockedFn');

    hub = hubFactory( mockedHub );

    $timeout = _$timeout_;
  }));

  describe('#on', function() {

    it('should apply asynchronously', function () {
      hub.on('event', spy);
      mockedHub.proxy.invoke('event');

      expect(spy).not.toHaveBeenCalled();

      $timeout.flush();
      expect(spy).toHaveBeenCalled();
    });

  });

  describe('#invoke', function() {

    beforeEach(function() {
      spyOn(mockedHub.proxy, 'invoke');
    });

    it('should call the delegate hub\'s invoke', function() {
      hub.invoke('event', {foo: 'bar'});

      expect(mockedHub.proxy.invoke).toHaveBeenCalled();
    });

    it('should allow multiple data arguments', function() {
      hub.invoke('event', 'x', 'y');

      expect(mockedHub.proxy.invoke).toHaveBeenCalledWith('event', 'x', 'y');
    });

  });

  describe('# connect', function() {

    beforeEach(inject(function($q) {

      //setup that #connect returns a promise.
      spyOn(mockedHub.connection, 'start').and.callFake(function() {
        var deferred = $q.defer();
        deferred.resolve('resolved # connect call');
        return deferred.promise;
      });

    }));

    it('should call the delegate hub\'s connect.start', function() {
      hub.connect();

      expect(mockedHub.connection.start).toHaveBeenCalled();
    });

    it('should call the delegate hub\'s connection.start with transport option', function() {
      var transObj = {
        transport: 'longPolling'
      };
      hub.connect(transObj);

      expect(mockedHub.connection.start.calls.first().args[0]).toEqual(transObj);
    });

    it('should return a promise', function() {
      hub.connect().then(function() {
        console.log('Success');
      });
      $timeout.flush();
    });

  });


  describe('# disconnect', function () {

    it('should call the delegate hub\'s connection.stop', function() {
      spyOn(mockedHub.connection, 'stop');
      hub.disconnect();

      expect(mockedHub.connection.stop).toHaveBeenCalled();
    });

  });


  describe('# error', function () {

    beforeEach(function() {
      spyOn(mockedHub.connection, 'error');
      hub.error(spy);
    });

    it('should call the delegate hub\'s connection.error', function() {
      expect(mockedHub.connection.error).toHaveBeenCalled();
    });

    it('should apply asynchronously', function() {
      expect(mockedHub.connection.error.calls.first().args[0]).not.toBe(spy);

      var error = {error : 'test-error'};

      mockedHub.connection.error.calls.first().args[0](error);
      expect(spy).not.toHaveBeenCalled();

      $timeout.flush();
      expect(spy).toHaveBeenCalledWith(error);
    });

  });


  describe('# stateChanged', function() {

    beforeEach(function() {
      spyOn(mockedHub.connection, 'stateChanged');
      hub.stateChanged(spy);
    });

    it('should call the delegate hub\'s connection.stateChanged', function() {
      expect(mockedHub.connection.stateChanged.calls.first().args[0]).not.toBe(spy);
      expect(mockedHub.connection.stateChanged).toHaveBeenCalled();
    });

    it('should apply asynchronously', function() {
      expect(mockedHub.connection.stateChanged.calls.first().args[0]).not.toBe(spy);

      var state = {state : 'test-state'};

      mockedHub.connection.stateChanged.calls.first().args[0](state);
      expect(spy).not.toHaveBeenCalled();

      $timeout.flush();
      expect(spy).toHaveBeenCalledWith(state);
    });

  });

});
