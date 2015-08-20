/*global window, document, app, navigator */
/*jshint bitwise: false*/

app.resize = (function () {
	'use strict';


	var ballsBrowserResize = app.utilities.debounce(function() {

		var w = window.innerWidth,
			h = window.innerHeight;

		// need to remove balls if small, add if large

		// reset ball position just like on init
		app.globals.circleArr.forEach(function(el) {

			el.x = (w/2) + Math.random();
			el.y = (h/2) + Math.random();

		});



	}, 500);

	var init = function () {

		window.addEventListener('resize', ballsBrowserResize);

	};




	return {
		init: init



	};

})();

