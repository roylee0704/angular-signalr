describe('socketFactory', function() {
  'use strict';

  beforeEach(module('roy.socket-signalr'));


  var hub,
      mockedHub, /*server hub*/
      spy,
      $timeout;

  beforeEach(inject(function(hubFactory, _$timeout_) {

    mockedHub = window.$.hubConnection().createHubProxy('testHub');
    spy = jasmine.createSpy('mockedFn');

    hub = hubFactory( mockedHub );

    $timeout = _$timeout_;


  }));


  describe('#on', function() {

    it('should apply asynchronously', function () {

      hub.on('event', spy);
      mockedHub.invoke('event');

      expect(spy).not.toHaveBeenCalled();

      $timeout.flush();
      expect(spy).toHaveBeenCalled();
    });

  });


  describe('#emit', function() {

    beforeEach(function() {

      spyOn(mockedHub, 'invoke');

    });

    it('should call the delegate hub\'s invoke', function() {

      hub.invoke('event', {foo: 'bar'});

      expect(mockedHub.invoke).toHaveBeenCalled();
    });

    it('should allow multiple data arguments', function() {

      hub.invoke('event', 'x', 'y');

      expect(mockedHub.invoke).toHaveBeenCalledWith('event', 'x', 'y');

    });

  });





});
