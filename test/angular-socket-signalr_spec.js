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

    it('should call the delegate hub\'s connect.start', function() {
      spyOn(mockedHub.connection, 'start');
      hub.connect();

      expect(mockedHub.connection.start).toHaveBeenCalled();
    });

    it('should call the delegate hub\'s connection.start with transport option', function() {
      spyOn(mockedHub.connection, 'start');
      var transObj = {
        transport: 'longPolling'
      };
      hub.connect(transObj);

      expect(mockedHub.connection.start.calls.first().args[0]).toEqual(transObj);
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

    it('should call the delegate hub\'s connection.error', function() {
      spyOn(mockedHub.connection, 'error');
      hub.error(spy);

      expect(mockedHub.connection.error).toHaveBeenCalled();
    });


    it('should apply asynchronously', function() {
      spyOn(mockedHub.connection, 'error');
      hub.error(spy);

      expect(mockedHub.connection.error.calls.first().args[0]).not.toBe(spy);
      mockedHub.connection.error.calls.first().args[0]();
      expect(spy).not.toHaveBeenCalled();

      $timeout.flush();
      expect(spy).toHaveBeenCalled();
    });

  });


  describe('# stateChanged', function() {

    it('should call the delegate hub\'s connection.stateChanged', function() {
      spyOn(mockedHub.connection, 'stateChanged');
      hub.stateChanged(spy);

      expect(mockedHub.connection.stateChanged.calls.first().args[0]).not.toBe(spy);
      expect(mockedHub.connection.stateChanged).toHaveBeenCalled();
    });

    it('should apply asynchronously', function() {
      spyOn(mockedHub.connection, 'stateChanged');
      hub.stateChanged(spy);

      expect(mockedHub.connection.stateChanged.calls.first().args[0]).not.toBe(spy);
      mockedHub.connection.stateChanged.calls.first().args[0]();
      expect(spy).not.toHaveBeenCalled();

      $timeout.flush();
      expect(spy).toHaveBeenCalled();
    });

  });

});
