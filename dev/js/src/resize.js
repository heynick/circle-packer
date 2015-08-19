/*global window, document, app, navigator */
/*jshint bitwise: false*/

app.resize = (function () {
	'use strict';


	var ballsBrowserResize = app.utilities.debounce(function() {

		// reset ball position just like on init
		app.circleArr.forEach(function(el) {

			el.x = (window.innerWidth/2) + Math.random();
			el.y = (window.innerHeight/2) + Math.random();

		});



	}, 500);

	var init = function () {

		window.addEventListener('resize', ballsBrowserResize);

	};




	return {
		init: init



	};

})();

