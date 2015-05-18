describe('socketFactory', function() {
  'use strict';

  beforeEach(module('roy.socket-signalr'));


  var hub;


  beforeEach(inject(function(hubFactory, $rootScope) {
    hub = hubFactory();

  }));


  describe('#on', function() {

    it('should apply asynchronously', function () {


    });
  });





});
