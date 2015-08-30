/*global window, document, app, navigator */
/*jshint bitwise: false*/

app.resize = (function () {
	'use strict';


	var ballsBrowserResize = app.utilities.debounce(function() {


		app.globals.w = window.innerWidth;
		app.globals.h = window.innerHeight;

		// need to remove balls if small, add if large

		// reset ball position just like on init
		app.globals.circleArr.forEach(function(el) {

			el.x = (app.globals.w/2) + Math.random();
			el.y = (app.globals.h/2) + Math.random();

		});



	}, 500);

	var init = function () {

		window.addEventListener('resize', ballsBrowserResize);

	};




	return {
		init: init



	};

})();

