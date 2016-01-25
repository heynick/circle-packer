/*global window, document, app, navigator */

'use strict';
let globals = require('./globals')
let utilities = require('./utilities')

let ballsBrowserResize = utilities.debounce(function() {

	globals.w = window.innerWidth;
	globals.h = window.innerHeight;

	// need to remove balls if small, add if large

	// reset ball position just like on init
	globals.ballArr.forEach(function(el) {

		el.x = (globals.w/2) + Math.random();
		el.y = (globals.h/2) + Math.random();

	});

}, 500);

window.addEventListener('resize', ballsBrowserResize);
