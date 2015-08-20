/*global window, app.globals.doc, app, navigator */
/*jshint bitwise: false*/

app.interaction = (function () {
	'use strict';

	var easeIn = function(t, b, c, d) {
        return -c *(t/=d)*(t-2) + b;
    };

    var velocity;
    var direction;

	// http://stackoverflow.com/a/19794374
    function makeVelocityCalculator(e_init, e) {
        var x = e_init.clientX,
    		y = e_init.clientY,
			new_x,
			new_y,
			new_t,
			x_dist,
			y_dist,
			interval,
			velocity,
			t;

        if (e === false) {
        	return;
        }

        t = e.time;
		new_x = e.clientX;
		new_y = e.clientY;
		new_t = Date.now();
		x_dist = new_x - x;
            y_dist = new_y - y;
            interval = new_t - t;

        direction = Math.floor((Math.atan2(new_y - y, new_x - x) * 180 / Math.PI) - 90);

        if (direction >= 360){
            direction -= 360;
        }

        //console.log(direction)
        // update values:
        x = new_x;
        y = new_y;


        velocity = Math.sqrt(x_dist*x_dist+y_dist*y_dist)/interval;


    }




	var init = function () {

		mouse();
		touch();
		keys();

	};


	var keys = function() {

		app.globals.doc.onkeydown = function(e) {
		    e = e || window.event;
		    if (e.keyCode == 27) {

		        setTimeout(function() {
		        	app.globals.activeBall.classList.remove('active');
		        }, 0)
		    }
		};

	};

	var cursorPos = [];

	var mouse = function() {

		var mouseBallHeld = false;
		var previousEvent = false;

		app.globals.doc.addEventListener('mousedown', function(e) {

			cursorPos = [e.pageX, e.pageY];

			app.utilities.closest(e.target, function(el) {

				if (el.tagName === 'g') {

					el.setAttribute('class', 'held');

					mouseBallHeld = el.id;

				}

			});
		});


		app.globals.doc.addEventListener('mousemove', function(e) {

			if (mouseBallHeld) {


				app.utilities.closest(e.target, function(el) {
					if (el.tagName === 'g') {


						var rect = el.getBoundingClientRect();

						app.globals.circleArr[mouseBallHeld].x = e.pageX;
						app.globals.circleArr[mouseBallHeld].y = e.pageY;

					}

				});

				/*e.time = Date.now();
				makeVelocityCalculator( e, previousEvent);
				previousEvent = e;*/


			}

		});

		app.globals.doc.addEventListener('mouseup', function(e) {

			if (mouseBallHeld) {
				// gotta do it this way because user could mouseup on a different element
				// which would wreck the closest loop
				app.globals.doc.getElementById(mouseBallHeld).setAttribute('class', '');

				app.utilities.closest(e.target, function(el) {

					// check whether mouseup occured on an anchor, and whether it clicked
					if (el.tagName === 'a' && [e.pageX, e.pageY].equals(cursorPos)) {

						app.globals.svgEl.appendChild(el.parentNode);
						app.globals.activeBall = el;

						//window.cancelAnimationFrame(app.globals.animating);

						setTimeout(function() {

							//console.log('click');

							el.setAttribute('class', 'active');

						}, 0)

					}/* else if (el.tagName === 'g') {

						app.globals.circleArr[mouseBallHeld].x = e.pageX;
						app.globals.circleArr[mouseBallHeld].y = e.pageY;

					}*/

				});

				mouseBallHeld = false;

			}


		});

	};

	var touch = function() {

		var touchBallsHeld = [];

		app.globals.doc.addEventListener('touchmove', function(e) {

			e.preventDefault();


			if (touchBallsHeld.length) {


				for (var i = 0; i < e.touches.length; i++) {

					//console.log(e.touches.length);
					app.globals.circleArr[touchBallsHeld[i]].x = e.touches[i].pageX;
					app.globals.circleArr[touchBallsHeld[i]].y = e.touches[i].pageY;
					//console.log(touchBallsHeld);
				}

			}


		});





		app.globals.doc.addEventListener('touchstart', function(e) {

			app.utilities.closest(e.target, function(el) {

				if (el.tagName === 'g') {

					el.setAttribute('class', 'held');


					touchBallsHeld.push(el.id);
					console.log(touchBallsHeld);

				}

			});
		});



		app.globals.doc.addEventListener('touchend', function(e) {

			// get the 'g' element of the finger which was removed
			app.utilities.closest(e.changedTouches[0].target, function(el) {

				if (el.tagName === 'g') {

					el.setAttribute('class', '');

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

