
# angular-signalr 
[![Build Status](https://travis-ci.org/roylee0704/angular-socket-signalr.svg?branch=master)](https://travis-ci.org/roylee0704/angular-socket-signalr)
[![Code Climate](https://codeclimate.com/github/roylee0704/angular-socket-signalr/badges/gpa.svg)](https://codeclimate.com/github/roylee0704/angular-socket-signalr)
[![Test Coverage](https://codeclimate.com/github/roylee0704/angular-socket-signalr/badges/coverage.svg)](https://codeclimate.com/github/roylee0704/angular-socket-signalr/coverage)
[![Coverage Status](https://coveralls.io/repos/roylee0704/angular-socket-signalr/badge.png?branch=master)](https://coveralls.io/r/roylee0704/angular-socket-signalr?branch=master) 
[![Dependency Status](https://gemnasium.com/roylee0704/angular-socket-signalr.svg)](https://gemnasium.com/roylee0704/angular-socket-signalr)


Bower Component for using AngularJS with [SignalR.NET](http://signalr.net/).


## Install

1. `bower install angular-signalr` or [download the zip](https://github.com/roylee0704/angular-signalr/archive/master.zip).
2. Make sure the SignalR.NET client lib is loaded.
3. Include the `jquery.signalR-x.x.x.min.js` script provided by this component into your app.
4. Add `roylee.signalr-hub` as a module dependency to your app.


## Usage

This module exposes a `hubFactory`, which is an API for instantiating
signalr-hubs that are integrated with Angular's digest cycle.
