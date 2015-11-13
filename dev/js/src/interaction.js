/*global window, app, navigator */
/*jshint bitwise: false*/


// http://codepen.io/desandro/pen/QbPKEq?editors=001

app.interaction = (function () {
	'use strict';


	var	positionX = null;
	var	positionY = null;
	var dragPositionX = positionX;
	var dragPositionY = positionY;

	var dragStartPositionX;
	var dragStartPositionY;

	var cursorPos = [],

		// particle properties


		velocityX = 0,
		velocityY = 0,

		friction = 0.95,
		isDragging = false,

		mouseBallHeld = '',

		mousedownX,
		mousedownY,

		leftBound = 0,
		topBound = 0;



	function applyForce( forceX, forceY ) {
		if (forceX) {
			velocityX += forceX;
		}
		if (forceY) {
			velocityY += forceY;
		}
	}

	function applyBoundForce() {
		if (isDragging) {
			return;
		}

		// bouncing past bound
		var distanceX = app.globals.w - positionX,
		  	distanceY = app.globals.h - positionY,

			forceX = distanceX * 0.1,
			forceY = distanceY * 0.1,
			//
			distanceYtop = topBound - positionY,
			distanceXleft = leftBound - positionX,
			//
			forceXleft = distanceXleft * 0.1,
			forceYtop = distanceYtop * 0.1,

		// calculate resting position with this force
			restX = positionX + ( velocityX + forceX ) / ( 1 - friction ),
			restY = positionY + ( velocityY + forceY ) / ( 1 - friction ),

			restYneg = positionY + ( velocityY + forceYtop ) / ( 1 - friction ),
			restXneg = positionX + ( velocityX + forceXleft ) / ( 1 - friction );

		// top edge
		if (positionY <= topBound) {
			if ( restYneg <= topBound) {
				// pushing past
				applyForce( null, forceYtop );
			} else {
				// magical auto bounce back
				forceYtop = distanceYtop * 0.1 - velocityY;
				applyForce( null, forceYtop );
			}
		}

		// right edge
		if (positionX > app.globals.w) {
			if ( restX < app.globals.w) {
				applyForce( forceX, null );
			} else {
				forceX = distanceX * 0.1 - velocityX;
				applyForce( forceX, null );
			}
		}

		// bottom edge
		if (positionY > app.globals.h ) {
			if ( restY < app.globals.h) {
				applyForce( null, forceY );
			} else {
				forceY = distanceY * 0.1 - velocityY;
				applyForce( null, forceY );
			}
		}

		// left edge
		if (positionX <= leftBound) {
			if ( restXneg <= leftBound) {
				applyForce( forceXleft, null );
			} else {
				forceXleft = distanceXleft * 0.1 - velocityX;
				applyForce( forceXleft, null );
			}
		}


	}

	function applyDragForce() {

		if ( !isDragging ) {
			return;
		}

		var dragVelocityX = app.globals.circleArr[mouseBallHeld].x - positionX;
		var dragVelocityY = app.globals.circleArr[mouseBallHeld].y - positionY;
		var dragForceX = dragVelocityX - velocityX;
		var dragForceY = dragVelocityY - velocityY;

		applyForce(dragForceX, dragForceY);
	}


	function setDragPosition( e, currentBall ) {

		var moveX = e.pageX - mousedownX;
		var moveY = e.pageY - mousedownY;
	  dragPositionX = dragStartPositionX + moveX;
	  dragPositionY = dragStartPositionY + moveY;

		app.globals.circleArr[currentBall].x = dragPositionX;
		app.globals.circleArr[currentBall].y = dragPositionY;

	  e.preventDefault();

	}

	var updateInertia = function() {

		applyBoundForce();
		applyDragForce();

		velocityX *= friction;
		velocityY *= friction;

		positionX += velocityX;
		positionY += velocityY;

		if (mouseBallHeld) {

			app.globals.circleArr[mouseBallHeld].x = positionX;
			app.globals.circleArr[mouseBallHeld].y = positionY;

		}

	};



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



	var mouse = function() {

		app.globals.doc.addEventListener('mousedown', function(e) {

			cursorPos = [e.pageX, e.pageY];

			app.utilities.closest(e.target, function(el) {

				if (el.tagName === 'g') {

					el.setAttribute('class', 'held');

					mouseBallHeld = el.id;
					isDragging = true;

					positionX = app.globals.circleArr[mouseBallHeld].x;
					positionY = app.globals.circleArr[mouseBallHeld].y;

					mousedownX = e.pageX;
					mousedownY = e.pageY;
					dragStartPositionX = positionX;
					dragStartPositionY = positionY;

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


					app.globals.circleArr[mouseBallHeld].dragStartPositionX = e.pageX;
					app.globals.circleArr[mouseBallHeld].dragStartPositionY = e.pageY;

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


	return {
		init: init,
		updateInertia: updateInertia
	};

})();
