/*global window, document, app, navigator */
/*jshint bitwise: false*/

app.dragging = (function () {
	'use strict';

	var init = function () {
		mouse();
		touch();
	};


	var mouse = function() {
		var mouseBallHeld = false;
		document.addEventListener('mousemove', function(e) {


			if (mouseBallHeld) {
				app.circleArr[mouseBallHeld].x = e.x;
				app.circleArr[mouseBallHeld].y = e.y;
			}

		});

		document.addEventListener('mousedown', function(e) {

			app.utilities.closest(e.target, function(el) {

				if (el.tagName === 'g') {

					mouseBallHeld = el.id;

				}

			});
		});

		document.addEventListener('mouseup', function(e) {

			mouseBallHeld = false;

		});

	};

	var touch = function() {
		var touchBallsHeld = [];



		document.addEventListener('touchmove', function(e) {

			e.preventDefault();


			if (touchBallsHeld.length) {

				for (var i = 0; i < e.touches.length; i++) {

					//console.log(e.touches.length);
					app.circleArr[touchBallsHeld[i]].x = e.touches[i].pageX;
					app.circleArr[touchBallsHeld[i]].y = e.touches[i].pageY;
					//console.log(touchBallsHeld);
				}

			}


		});





		document.addEventListener('touchstart', function(e) {

			app.utilities.closest(e.target, function(el) {

				if (el.tagName === 'g') {


					touchBallsHeld.push(el.id);
					console.log(touchBallsHeld);

				}

			});
		});



		document.addEventListener('touchend', function(e) {

			// get the 'g' element of the finger which was removed
			app.utilities.closest(e.changedTouches[0].target, function(el) {

				if (el.tagName === 'g') {

					// remove the corresponding ball from the touchBallsHeld array
					var indexToRemove = touchBallsHeld.indexOf(el.id);
					if (indexToRemove > -1) {
					    touchBallsHeld.splice(indexToRemove, 1);
					}

				}

			});

		});
	};






	return {
		init: init



	};

})();

