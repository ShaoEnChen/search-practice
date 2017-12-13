'use strict';

Rx.Observable.of('hello world')
	.subscribe(function(x) { console.log(x); });