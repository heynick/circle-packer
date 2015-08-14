/*global window, document, app, navigator */
/*jshint bitwise: false*/

app.resize = (function () {
	'use strict';

	var ballsBrowserResize = app.utilities.debounce(function() {

		/*innerWidth = window.innerWidth;
		innerHeight = window.innerHeight;

		var gEls = document.querySelectorAll('g');

		for (var i = 0; i < gEls.length; i++) {
			//currentCircle.added = false;
			//gEls[i].remove();
		}*/

		//appendedBalls = [];




	}, 250);

	var init = function () {

		window.addEventListener('resize', ballsBrowserResize);

	};




	return {
		init: init



	};

})();

