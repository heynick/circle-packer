/*global window, app, navigator */
/*jshint bitwise: false*/

// http://codepen.io/desandro/pen/QbPKEq?editors=001

app.interaction = (function () {
	'use strict';

	var position = {
		x: 0,
		y: 0
	};

	var dragPos = {
		x: position.x,
		y: position.y
	};

	var dragStartPos = {
		x: 0,
		y: 0
	};

	var velocity = {
		x: 0,
		y: 0
	};

	var mousedown = {
		x: 0,
		y: 0
	};

	var cursorPos = [],

		friction = 0.90,
		isDragging = false,

		mouseBallHeld = '',


		leftBound = 0,
		topBound = 0;



	function applyForce( forceX, forceY ) {
		if (forceX) {
			velocity.x += forceX;
		}
		if (forceY) {
			velocity.y += forceY;
		}
	}


	function applyBoundForce() {
		if (isDragging) {
			return;
		}

		var distance = {
			x: app.globals.w - position.x,
			y: app.globals.h - position.y,
			Ytop: topBound - position.y,
			Xleft: leftBound - position.x
		},

		force = {
			x: distance.x * 0.1,
			y: distance.y * 0.1,
			xleft: distance.Xleft * 0.1,
			ytop: distance.Ytop * 0.1
		},

		// calculate resting position with this force
		restX = position.x + ( velocity.x + force.x ) / ( 1 - friction ),
		restY = position.y + ( velocity.y + force.y ) / ( 1 - friction ),

		restYneg = position.y + ( velocity.y + force.ytop ) / ( 1 - friction ),
		restXneg = position.x + ( velocity.x + force.xleft ) / ( 1 - friction );

		// top edge
		if (position.y <= topBound) {
			if ( restYneg <= topBound) {
				// pushing past
				applyForce( null, force.ytop );
			} else {
				// magical auto bounce back
				force.ytop = distance.Ytop * 0.1 - velocity.y;
				applyForce( null, force.ytop );
			}
		}

		// right edge
		if (position.x > app.globals.w) {
			if ( restX < app.globals.w) {
				applyForce( force.x, null );
			} else {
				force.x = distance.x * 0.1 - velocity.x;
				applyForce( force.x, null );
			}
		}

		// bottom edge
		if (position.y > app.globals.h ) {
			if ( restY < app.globals.h) {
				applyForce( null, force.y );
			} else {
				force.y = distance.y * 0.1 - velocity.y;
				applyForce( null, force.y );
			}
		}

		// left edge
		if (position.x <= leftBound) {
			if ( restXneg <= leftBound) {
				applyForce( force.xleft, null );
			} else {
				force.xleft = distance.Xleft * 0.1 - velocity.x;
				applyForce( force.xleft, null );
			}
		}


	}

	function applyDragForce() {

		if ( !isDragging ) {
			return;
		}

		var dragVelocityX = app.globals.circleArr[mouseBallHeld].x - position.x;
		var dragVelocityY = app.globals.circleArr[mouseBallHeld].y - position.y;
		var dragForceX = dragVelocityX - velocity.x;
		var dragForceY = dragVelocityY - velocity.y;

		applyForce(dragForceX, dragForceY);
	}


	function setDragPosition( e, currentBall ) {

		var moveX = e.pageX - mousedown.x;
		var moveY = e.pageY - mousedown.y;
		dragPos.x = dragStartPos.x + moveX;
		dragPos.y = dragStartPos.y + moveY;

		app.globals.circleArr[currentBall].x = dragPos.x;
		app.globals.circleArr[currentBall].y = dragPos.y;

		e.preventDefault();

	}

	var updateInertia = function() {

		applyBoundForce();
		applyDragForce();

		velocity.x *= friction;
		velocity.y *= friction;

		position.x += velocity.x;
		position.y += velocity.y;

		if (mouseBallHeld) {

			app.globals.circleArr[mouseBallHeld].x = position.x;
			app.globals.circleArr[mouseBallHeld].y = position.y;

		}

	};





	var keys = function() {

		app.globals.doc.onkeydown = function(e) {
			e = e || window.event;
			if (e.keyCode === 27) {

				setTimeout(function() {
					app.globals.activeBall.classList.remove('active');
				}, 0);

			}
		};

	};


	var mouse = function() {

		app.globals.doc.addEventListener('mousedown', function(e) {

			cursorPos = [e.pageX, e.pageY];

			app.utilities.closest(e.target, function(el) {

				if (el.tagName === 'g') {

					el.setAttribute('class', 'held');

					mouseBallHeld = el.id;
					isDragging = true;

					position.x = app.globals.circleArr[mouseBallHeld].x;
					position.y = app.globals.circleArr[mouseBallHeld].y;

					mousedown.x = e.pageX;
					mousedown.y = e.pageY;
					dragStartPos.x = position.x;
					dragStartPos.y = position.y;

					setDragPosition( e, mouseBallHeld );


				}

			});


		});


		app.globals.doc.addEventListener('mousemove', function(e) {

			if (isDragging) {

				setDragPosition(e, mouseBallHeld);

			}

		});

		app.globals.doc.addEventListener('mouseup', function(e) {

			if (isDragging) {
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

							// this is a click

							el.setAttribute('class', 'active');

						}, 0);

					}

				});

				isDragging = false;


				//app.globals.doc.removeEventListener( 'mousemove' );
				//app.globals.doc.removeEventListener( 'mouseup' );


			}


		});

	};

	var touch = function() {

		var touchBallsHeld = [];

		app.globals.doc.addEventListener('touchstart', function(e) {

			app.utilities.closest(e.target, function(el) {

				if (el.tagName === 'g') {

					el.setAttribute('class', 'held');


					touchBallsHeld.push(el.id);

					mouseBallHeld = el.id;
					isDragging = true;


					app.globals.circleArr[mouseBallHeld].dragStartPos.x = e.pageX;
					app.globals.circleArr[mouseBallHeld].dragStartPos.y = e.pageY;

				}

			});
		});

		app.globals.doc.addEventListener('touchmove', function(e) {

			e.preventDefault();

			if (touchBallsHeld.length) {

				for (var i = 0; i < e.touches.length; i++) {

					if (app.globals.circleArr[touchBallsHeld[i]] === undefined) return; // if you touchmove not on a ball

					app.globals.circleArr[touchBallsHeld[i]].x = e.touches[i].pageX;
					app.globals.circleArr[touchBallsHeld[i]].y = e.touches[i].pageY;

				}

			}


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

	var init = function () {

		mouse();
		touch();
		keys();

	};

	return {
		init: init,
		updateInertia: updateInertia
	};

})();
